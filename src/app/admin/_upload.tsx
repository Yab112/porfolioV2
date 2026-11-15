"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { api } from "./_lib";

type Signed = { upload_url: string; fields: Record<string, string> };
const MAX_BYTES = 10 * 1024 * 1024;

/** Upload one image straight to Cloudinary with a one-time signature from the API. Returns its URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
  if (file.size > MAX_BYTES) throw new Error(`${file.name} is larger than 10 MB.`);
  const signed = await api<Signed>(`admin/uploads/sign?folder=${encodeURIComponent(folder)}`, { method: "POST", quiet: true, body: {} });
  const form = new FormData();
  form.append("file", file);
  for (const [k, v] of Object.entries(signed.fields)) form.append(k, v);
  const res = await fetch(signed.upload_url, { method: "POST", body: form });
  const data = (await res.json().catch(() => null)) as { secure_url?: string; error?: { message?: string } } | null;
  if (!res.ok || !data?.secure_url) throw new Error(data?.error?.message ?? `Upload of ${file.name} failed.`);
  return data.secure_url;
}

/**
 * Pick or drop images; each uploads on its own and reports back as it finishes.
 * `onUploaded` is called once per image with its URL and file name.
 */
export function ImageUpload({
  folder,
  multiple = false,
  label,
  onUploaded,
}: {
  folder: string;
  multiple?: boolean;
  label: string;
  onUploaded: (url: string, name: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, multiple ? 20 : 1);
    setErrors([]);
    setPending((n) => n + list.length);
    await Promise.all(
      list.map(async (file) => {
        try {
          onUploaded(await uploadImage(file, folder), file.name.replace(/\.[a-z0-9]+$/i, ""));
        } catch (e) {
          setErrors((prev) => [...prev, e instanceof Error ? e.message : "Upload failed"]);
        } finally {
          setPending((n) => n - 1);
        }
      })
    );
    if (input.current) input.current.value = "";
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void handle(e.dataTransfer.files);
        }}
        disabled={pending > 0}
        className={cn(
          "flex w-full items-center justify-center gap-2 border border-dashed px-3 py-4 text-[13px] transition-colors",
          over ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground"
        )}
      >
        {pending > 0 ? (
          <>
            <span aria-hidden className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Uploading {pending} image{pending === 1 ? "" : "s"}…
          </>
        ) : (
          <>
            {label} <span className="opacity-70">· click or drop {multiple ? "images" : "an image"} here</span>
          </>
        )}
      </button>
      <input ref={input} type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => void handle(e.target.files)} />
      {errors.map((err, i) => (
        <p key={i} role="alert" className="mt-1.5 text-[12.5px] text-destructive">
          {err}
        </p>
      ))}
    </div>
  );
}
