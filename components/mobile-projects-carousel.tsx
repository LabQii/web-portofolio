"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getTechLogoDetails } from "@/lib/tech-icons";
import TechLogoImage from "@/components/tech-logo-image";

export default function MobileProjectsCarousel({ 
  projects, 
  customTechLogos = [] 
}: { 
  projects: any[],
  customTechLogos?: any[]
}) {
  if (!projects || projects.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, projects.length]);

  const activeProject = projects[currentIndex];

  return (
    <div 
      className="flex flex-col w-full md:hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      
      <div className="relative w-full h-[240px] flex items-center justify-center overflow-visible mb-6">
        {projects.map((project, idx) => {
          const total = projects.length;
          let dist = idx - currentIndex;

          if (dist < -Math.floor(total / 2)) dist += total;
          if (dist > Math.floor(total / 2)) dist -= total;

          const isActive = dist === 0;
          const isSide = Math.abs(dist) === 1;
          const isHidden = Math.abs(dist) > 1;

          const xPercent = dist * 65; 
          const scale = isActive ? 1 : 0.85;
          const opacity = isActive ? 1 : isSide ? 0.6 : 0;
          const rotateY = isActive ? 0 : dist > 0 ? -15 : 15;
          const zIndex = isActive ? 30 : isSide ? 20 : 0;

          return (
            <motion.div
              key={`${project.id}-${idx}`}
              animate={{
                x: `${xPercent}%`,
                scale,
                opacity,
                rotateY,
                zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 0.8,
              }}
              style={{ perspective: 900, boxShadow: isActive ? '0 16px 40px rgba(15,36,66,0.15)' : '0 4px 16px rgba(15,36,66,0.10)' }}
              className={`absolute w-[80%] h-[220px] rounded-[20px] overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800 ${isHidden ? 'pointer-events-none' : ''}`}
              onClick={() => {
                if (isActive) return;
                setCurrentIndex(idx);
              }}
            >
              <div className="absolute inset-0">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className={`
                    absolute inset-0 w-full h-full object-cover
                    transition-transform duration-700
                    ${isActive ? 'grayscale-0' : 'grayscale'}
                  `}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ background: "linear-gradient(to top, rgba(15, 36, 66, 0.9) 0%, rgba(15, 36, 66, 0.4) 40%, rgba(15, 36, 66, 0) 100%)" }}
              />

              <div className="absolute bottom-0 left-0 right-0 p-5 px-6 pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-white/20 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                     {project.category}
                   </span>
                </div>
                <h3 className="font-bold text-white text-lg line-clamp-1 drop-shadow-md mb-1">{project.title}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-2 mb-6">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-accent w-6 h-2" : "bg-slate-300 dark:bg-slate-700 w-2 h-2 hover:bg-slate-400"}`}
            aria-label={`Go to project slide ${idx + 1}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={currentIndex}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
           className="bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative"
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {activeProject.techStack.slice(0, 4).map((tech: string, i: number) => {
               const logoDetails = getTechLogoDetails(tech, customTechLogos);
               return (
                 <div key={`${tech}-${i}`} className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" title={tech}>
                   {logoDetails.type === 'initial' ? (
                     <span className="text-[10px] font-bold">{logoDetails.initial}</span>
                   ) : (
                     <TechLogoImage src={logoDetails.url} alt={tech} initial={tech.charAt(0)} className="w-[16px] h-[16px] object-contain" />
                   )}
                 </div>
               );
            })}
            {activeProject.techStack.length > 4 && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-navy text-white text-[10px] font-bold">
                +{activeProject.techStack.length - 4}
              </div>
            )}
          </div>
          <p className="text-muted text-[14px] leading-relaxed line-clamp-4 mb-6">
            {activeProject.description}
          </p>
          <div className="flex gap-3">
            <Link href={`/projects/${activeProject.slug}`} className="flex-1">
              <button className="w-full flex items-center justify-center bg-navy hover:bg-navy/90 dark:bg-slate-100 dark:text-navy dark:hover:bg-white shadow-sm rounded-xl py-3.5 text-[14px] font-bold text-white transition-all duration-300">
                View Project <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </Link>
            {activeProject.videoUrl && (
               <Link href={`/projects/${activeProject.slug}`} className="w-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#ef4444] dark:text-accent rounded-xl transition-all">
                 <Play className="w-5 h-5 ml-0.5 fill-current" />
               </Link>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
