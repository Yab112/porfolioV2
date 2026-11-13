"use client";
import {  useActiveSection } from "@/context/activeSection";
import { links } from "@/lib/constant";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
const Header = () => {
  const { active, setActive,setTimeOfLastClick } = useActiveSection();
  
  return (
    <div className="fixed inset-x-0 top-0 h-20 pt-6  z-[10000000]">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className=" px-4 py-2 w-full sm:max-w-[500px] mx-auto bg-gray-100 border-cyan-100 border h-[50px]  rounded-none flex justify-between items-center  z-[999]"
      >
        {links.map((value,index) => (
          <div
          key={index}
            className={clsx("px-3 py-1 relative rounded-none transition duration-800", {
              "bg-cyan-600": active === value.name,
            })}
          >
            <Link
              href={value.href}
              onClick={()=>{
                setActive(value.name)
                setTimeOfLastClick(Date.now())
              }}
              className={clsx("hover:text-gray-400 transition text-black", {
                "text-gray-200 ": active === value.name,
              })}
            >
              {value.name}
            </Link>
            {/* {
            activeSection=== value.name&&<div className="absolute inset-0 bg-red-700 "/>
           }  */}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
export default Header;
