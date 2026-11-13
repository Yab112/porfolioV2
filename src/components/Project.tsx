"use client";
import React, { useRef } from "react";
import { projectsData } from "@/lib/constant";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";

type ProjectProp = (typeof projectsData)[number];
const Project = ({ title, description, tags, imageUrl, href }: ProjectProp) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  return (
    <motion.div
      className="group my-8 bg-cyan-100/20 border h-[300px] rounded-none opacity-100 relative overflow-hidden text-[15px]"
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess,
      }}
    >
      
      <a href={href} target="_black" className="">
        <div className="w-full  sm:w-[50%] p-6 flex flex-row sm:flex-col h-full  sm:group-even:ml-[14rem] border-b border-b-black">
          <div>
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="mt-1 leading-relaxed font-Poppins text-black text-sm">
              {description}
            </p>
          </div>

          <ul className="flex flex-wrap mt-auto gap-2 ">
            {tags.map((tag, index) => (
              <li
                className="bg-cyan-100/[0.1] border border-x-cyan-500 px-3 py-1 text-[0.7rem] uppercase tracking-wider text-black rounded-none"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <Image
          src={imageUrl}
          alt="project photo"
          className=" 
            transition 
            group-hover:scale-[1.04]
            group-hover:-translate-x-3
            group-hover:translate-y-3
            group-hover:-rotate-2

            group-even:group-hover:translate-x-3
            group-even:group-hover:translate-y-3
            group-even:group-hover:rotate-2

            group-even:-left-48
            absolute hidden sm:block top-8 -right-48 w-[25.25rem] rounded-t-none shadow-2xl"
        />
      </a>
    </motion.div>
  );
};
export default Project;
