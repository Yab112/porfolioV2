"use client";

import { DATA } from "@/data/resume";
import { onShapeRequest, STATIONS, stationForPath, type SwarmShape } from "@/lib/swarm-bus";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { buildFormation, cloud, fromImage, type Formation } from "./shapes";

const FALLBACK_PORTRAIT = "/Icon Color Version@700x.png";

const VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSigFrom;
  attribute float aSigTo;
  attribute float aSeed;
  uniform float uT;
  uniform float uTime;
  uniform float uSize;
  uniform vec3 uMouse;
  varying float vSig;
  varying float vDepth;

  void main() {
    // Each point leaves on its own beat, so a morph reads as a flock, not a fade.
    float p = clamp(uT * 1.7 - aSeed * 0.7, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(aFrom, aTo, p);

    // Arc outward mid-flight.
    float arc = sin(p * 3.14159);
    vec3 dir = normalize(vec3(sin(aSeed * 91.7), cos(aSeed * 47.3), sin(aSeed * 23.1 + 1.7)));
    pos += dir * arc * (0.35 + aSeed * 0.55);

    // Idle breathing.
    pos += dir * sin(uTime * 0.9 + aSeed * 40.0) * 0.012;

    // The pointer pushes points aside.
    vec3 away = pos - uMouse;
    float d = length(away.xy);
    float push = smoothstep(0.55, 0.0, d);
    pos.xy += normalize(away.xy + 0.0001) * push * 0.28;
    pos.z += push * 0.25;

    vSig = mix(aSigFrom, aSigTo, p);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + vSig * 0.55 + push * 1.2) * (7.5 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uSignal;
  uniform float uOpacity;
  varying float vSig;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float edge = smoothstep(0.5, 0.38, r);
    vec3 col = mix(uInk, uSignal, step(0.5, vSig));
    // Points further from the eye sit back.
    float fog = clamp(1.25 - (vDepth - 6.0) * 0.22, 0.35, 1.0);
    gl_FragColor = vec4(col, edge * uOpacity * fog);
  }
`;

function cssColor(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#8e62a9";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * One persistent WebGL figure behind every page. It never unmounts, so moving
 * between routes is the points flying into a new formation.
 */
export function SwarmCanvas() {
  const pathname = usePathname();
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ setRoute: (path: string) => void } | null>(null);
  const [caption, setCaption] = useState<{ index: string; count: number; text: string } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE: typeof THREE_NS = await import("three");
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.innerWidth < 768;
      const N = small ? 6000 : 12000;

      let renderer: THREE_NS.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      } catch {
        return; // No WebGL: the site reads fine without the figure.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      camera.position.z = 7.5;

      const start = cloud(N);
      const geo = new THREE.BufferGeometry();
      const aFrom = new THREE.BufferAttribute(start.pos.slice(), 3);
      const aTo = new THREE.BufferAttribute(start.pos.slice(), 3);
      const aSigFrom = new THREE.BufferAttribute(new Float32Array(N), 1);
      const aSigTo = new THREE.BufferAttribute(new Float32Array(N), 1);
      const seeds = new Float32Array(N);
      for (let i = 0; i < N; i++) seeds[i] = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      for (let i = 0; i < N; i++) seeds[i] = Math.abs(seeds[i]);
      geo.setAttribute("position", new THREE.BufferAttribute(start.pos.slice(), 3));
      geo.setAttribute("aFrom", aFrom);
      geo.setAttribute("aTo", aTo);
      geo.setAttribute("aSigFrom", aSigFrom);
      geo.setAttribute("aSigTo", aSigTo);
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);

      const uniforms = {
        uT: { value: 1 },
        uTime: { value: 0 },
        uSize: { value: 2.2 * renderer.getPixelRatio() },
        uOpacity: { value: 0 },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uInk: { value: new THREE.Color() },
        uSignal: { value: new THREE.Color() },
      };
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      const group = new THREE.Group();
      group.add(points);
      scene.add(group);

      const isDark = () => document.documentElement.classList.contains("dark");
      const applyTheme = () => {
        uniforms.uInk.value.set(cssColor("--purple"));
        uniforms.uSignal.value.set(cssColor("--green-fill"));
      };
      applyTheme();

      // ── formations ────────────────────────────────────────────────────────
      const cache = new Map<string, Formation>();
      let portraitImg: HTMLImageElement | null = null;
      const portraitReady = loadImage(DATA.avatarUrl)
        .catch(() => loadImage(FALLBACK_PORTRAIT))
        .then((img) => {
          portraitImg = img;
        })
        .catch(() => undefined);

      const formation = (shape: SwarmShape): Formation => {
        const key = shape === "portrait" ? `portrait-${isDark()}` : shape;
        let f = cache.get(key);
        if (!f) {
          f =
            shape === "portrait"
              ? portraitImg
                ? fromImage(N, portraitImg, portraitImg.naturalWidth, portraitImg.naturalHeight, isDark())
                : buildFormation("network", N)
              : buildFormation(shape, N);
          cache.set(key, f);
        }
        return f;
      };

      let current: SwarmShape | null = null;
      const morphTo = (shape: SwarmShape, force = false) => {
        if (shape === current && !force) return;
        current = shape;
        const target = formation(shape);
        // Freeze wherever each point is right now and fly on from there.
        const t = uniforms.uT.value;
        const from = aFrom.array as Float32Array;
        const to = aTo.array as Float32Array;
        const sf = aSigFrom.array as Float32Array;
        const st = aSigTo.array as Float32Array;
        for (let i = 0; i < N; i++) {
          let p = Math.min(1, Math.max(0, t * 1.7 - seeds[i] * 0.7));
          p = p * p * (3 - 2 * p);
          for (let k = 0; k < 3; k++) {
            const j = i * 3 + k;
            from[j] = from[j] + (to[j] - from[j]) * p;
          }
          sf[i] = p > 0.5 ? st[i] : sf[i];
        }
        to.set(target.pos);
        st.set(target.sig);
        aFrom.needsUpdate = aTo.needsUpdate = aSigFrom.needsUpdate = aSigTo.needsUpdate = true;
        uniforms.uT.value = reduce ? 1 : 0;
      };

      // ── placement: where the figure sits for each page ────────────────────
      let route = stationForPath(window.location.pathname);
      let preview: SwarmShape | null = null;
      const goal = { x: 0, y: 0, scale: 1, opacity: 1 };
      const place = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const viewH = 2 * Math.tan((35 * Math.PI) / 360) * camera.position.z;
        const viewW = viewH * (w / h);
        const home = route.href === "/";
        const scrolled = Math.min(1, window.scrollY / (h * 0.7));
        if (w >= 1024) {
          goal.scale = home ? Math.min(1.08, viewW / 6.2) : 0.62;
          goal.x = home ? viewW * 0.23 : viewW / 2 - 1.35;
          goal.y = home ? 0.25 : viewH / 2 - 1.25;
          goal.opacity = home ? 1 : 0.55 - scrolled * 0.25;
        } else {
          goal.scale = home ? Math.min(0.8, viewW / 3.6) : 0.5;
          goal.x = home ? 0 : viewW / 2 - 0.9;
          goal.y = home ? viewH * 0.17 : viewH / 2 - 1.0;
          goal.opacity = home ? 1 - scrolled * 0.82 : 0.32 - scrolled * 0.2;
        }
        if (preview) goal.opacity = Math.max(goal.opacity, 0.9);
      };

      const publishCaption = () => {
        const shape = preview ?? current ?? route.shape;
        const st = stationForPath(route.href);
        const figureFor = (sh: SwarmShape) =>
          sh === "network"
            ? "arranged as a neural network, one path lit"
            : (STATIONS.find((x) => x.shape === sh)?.figure ?? st.figure);
        const text = figureFor(shape);
        setCaption({ index: st.key.padStart(2, "0"), count: N, text });
      };

      const show = (shape: SwarmShape) => {
        if (shape === "portrait") {
          portraitReady.then(() => {
            if (!disposed && (preview ?? sectionShape ?? route.shape) === "portrait") morphTo("portrait");
          });
        } else {
          morphTo(shape);
        }
        publishCaption();
      };

      // A page section can borrow the figure while it is on screen.
      let sectionShape: SwarmShape | null = null;
      const refresh = () => {
        show(preview ?? sectionShape ?? route.shape);
        place();
      };

      apiRef.current = {
        setRoute: (path) => {
          route = stationForPath(path);
          sectionShape = null;
          preview = null;
          refresh();
        },
      };

      const offBus = onShapeRequest((shape) => {
        preview = shape;
        refresh();
      });
      const onSection = (e: Event) => {
        sectionShape = (e as CustomEvent<SwarmShape | null>).detail;
        refresh();
      };
      window.addEventListener("swarm:section", onSection);

      // ── pointer ───────────────────────────────────────────────────────────
      const ndc = new THREE.Vector2(9, 9);
      const ray = new THREE.Raycaster();
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const hit = new THREE.Vector3();
      let sway = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        sway = { x: ndc.x, y: ndc.y };
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        place();
      };
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", place, { passive: true });

      const themeWatch = new MutationObserver(() => {
        applyTheme();
        if (current === "portrait") morphTo("portrait", true);
      });
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      resize();
      refresh();

      // ── loop ──────────────────────────────────────────────────────────────
      let raf = 0;
      let last = performance.now();
      let spin = 0;
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (document.hidden) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        uniforms.uTime.value += dt;
        if (uniforms.uT.value < 1) uniforms.uT.value = Math.min(1, uniforms.uT.value + dt / 1.9);

        const k = 1 - Math.exp(-dt * 3.2);
        group.position.x += (goal.x - group.position.x) * k;
        group.position.y += (goal.y - group.position.y) * k;
        const s = group.scale.x + (goal.scale - group.scale.x) * k;
        group.scale.setScalar(s);
        uniforms.uOpacity.value += (Math.max(0, goal.opacity) - uniforms.uOpacity.value) * k;

        const flat = current === "portrait" || current === "pages" || current === "network";
        if (!reduce) spin += dt * (current === "globe" ? 0.22 : flat ? 0 : 0.12);
        const targetY = (flat ? 0 : spin) + sway.x * (flat ? 0.22 : 0.35);
        const targetX = (current === "surface" || current === "layers" ? 0.42 : 0) - sway.y * 0.16;
        group.rotation.y += (targetY - group.rotation.y) * k;
        group.rotation.x += (targetX - group.rotation.x) * k;

        // Pointer in the figure's own space, for the repel in the shader.
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(plane, hit)) {
          group.worldToLocal(hit);
          uniforms.uMouse.value.copy(hit);
        }
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        offBus();
        themeWatch.disconnect();
        window.removeEventListener("swarm:section", onSection);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", place);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        apiRef.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setRoute(pathname);
  }, [pathname]);

  return (
    <>
      <div ref={mountRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 [&>canvas]:size-full" />
      {caption && (
        <p
          aria-hidden
          className="note pointer-events-none fixed right-3 top-1/2 z-[5] hidden -translate-y-1/2 whitespace-nowrap [writing-mode:vertical-rl] lg:block"
        >
          Fig. {caption.index} <span className="text-signal">■</span> {caption.count.toLocaleString("en-US")} points{" "}
          {caption.text}
        </p>
      )}
    </>
  );
}
