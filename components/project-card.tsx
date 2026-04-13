"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { getTechLogoDetails } from "@/lib/tech-icons";
import TechLogoImage from "@/components/tech-logo-image";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Play } from "lucide-react";

export default function ProjectCard({
  project,
  customTechLogos = [],
  index = 0
}: {
  project: any;
  customTechLogos?: any[];
  index?: number;
}) {
  const isNew = project.createdAt && (new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 3600 * 24) <= 30;
  const [isHoveringPlay, setIsHoveringPlay] = useState(false);
  const [visibleCount, setVisibleCount] = useState(project.techStack.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = project.videoUrl ? getYoutubeId(project.videoUrl) : null;

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const calculateOverflow = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length < 2) return;

      const containerWidth = container.offsetWidth;
      const categoryBadge = children[0];
      let currentWidth = categoryBadge.offsetWidth + 12;
      
      let count = 0;
      const badgeWidth = 45;
      const totalTechItems = project.techStack.length;

      children.forEach((child, i) => {
        if (i > 0 && i <= totalTechItems) {
          child.style.display = 'flex';
        }
      });

      for (let i = 0; i < totalTechItems; i++) {
        const item = children[i + 1];
        if (!item) continue;
        
        const itemWidth = item.offsetWidth + 12;
        const isNotLast = i < totalTechItems - 1;
        
        if (currentWidth + itemWidth + (isNotLast ? badgeWidth : 0) > containerWidth) {
          break;
        }
        currentWidth += itemWidth;
        count++;
      }

      children.forEach((child, i) => {
        if (i > 0 && i <= totalTechItems) {
          child.style.display = (i - 1) < count ? 'flex' : 'none';
        }
      });

      setVisibleCount((prev: number) => (prev !== count ? count : prev));
    };

    calculateOverflow();
    
    const resizeObserver = new ResizeObserver(() => {

      requestAnimationFrame(calculateOverflow);
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, [project.techStack]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group border border-slate-200 dark:border-slate-800 relative shadow-md shadow-slate-700/10 hover:shadow-2xl hover:shadow-slate-700/30 rounded-2xl p-6 md:p-8 transition-shadow bg-surface"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="w-full md:w-[45%] flex-shrink-0 relative">
          {isNew && (
            <Badge className="absolute -top-3 -right-3 z-10 bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md px-3 py-1 uppercase text-[11px] font-bold tracking-wider">
              New
            </Badge>
          )}
          <Link href={`/projects/${project.slug}`} className="block relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-sm transition-transform duration-300">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          {project.videoUrl && (
            <div className="absolute bottom-3 right-3 z-20 flex flex-col items-end">
              <AnimatePresence>
                {isHoveringPlay && videoId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="mb-3 w-[280px] aspect-video bg-black rounded-[10px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.20)] border border-white/10"
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`}
                      className="w-full h-full pointer-events-none"
                      allow="autoplay"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Link 
                href={`/projects/${project.slug}`}
                title="Video Demo"
                onMouseEnter={() => setIsHoveringPlay(true)}
                onMouseLeave={() => setIsHoveringPlay(false)}
                className="w-10 h-10 bg-white dark:bg-background hover:bg-slate-50 dark:hover:bg-surface rounded-full flex items-center justify-center text-[#ef4444] dark:text-accent shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 dark:border dark:border-slate-800"
              >
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </Link>
            </div>
          )}
        </div>

        <div className="flex-1 pt-2 overflow-hidden w-full">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-[28px] font-bold text-primary mb-4 leading-[1.3] group-hover:text-accent transition-colors">
              {project.title}
            </h3>
          </Link>

          <div ref={containerRef} className="flex flex-nowrap items-center gap-3 mb-6 overflow-hidden w-full">
            <Badge variant="secondary" className="bg-navy text-white hover:bg-navy/90 dark:bg-slate-100 dark:text-navy dark:hover:bg-white border-transparent font-semibold rounded-xl px-4 py-1.5 text-[14px] shrink-0 transition-all duration-300">
              {project.category}
            </Badge>

            {project.techStack.map((tech: string, i: number) => {
              const logoDetails = getTechLogoDetails(tech, customTechLogos);
              const isVisible = i < visibleCount;

              return (
                  <div
                    key={`${tech}-${i}`}
                    ref={(el) => { itemRefs.current[i] = el; }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[13px] font-semibold shadow-sm transition-colors bg-background dark:bg-slate-700 border-slate-200 dark:border-slate-500 text-muted dark:text-slate-200 whitespace-nowrap shrink-0 ${!isVisible ? 'hidden' : ''}`}
                  >
                  {logoDetails.type === 'initial' ? (
                    <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-200">
                      {logoDetails.initial}
                    </div>
                  ) : (
                    <div className="relative w-4 h-4">
                      <TechLogoImage
                        src={logoDetails.url}
                        alt={tech}
                        initial={tech.charAt(0).toUpperCase()}
                      />
                    </div>
                  )}
                  <span>{tech}</span>
                </div>
              );
            })}
            {project.techStack.length > visibleCount && (
              <div className="bg-[#1e293b] text-white rounded-full text-[12px] font-bold px-[10px] py-[4px] whitespace-nowrap shrink-0">
                +{project.techStack.length - visibleCount}
              </div>
            )}
          </div>

          <p className="text-muted text-[18px] leading-[1.7]">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
