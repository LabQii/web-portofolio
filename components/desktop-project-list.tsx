"use client";

import { useState } from "react";
import ProjectCard from "./project-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DesktopProjectList({ 
  projects, 
  customTechLogos = [] 
}: { 
  projects: any[],
  customTechLogos?: any[]
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  if (!projects || projects.length === 0) {
    return <p className="text-muted-foreground italic hidden md:block">No featured projects yet.</p>;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optionally smooth scroll slightly up to the top of the projects list
    const element = document.getElementById("projects-section-top");
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden md:flex flex-col w-full">
      <div id="projects-section-top" className="absolute -mt-20"></div>
      
      <div className="flex flex-col gap-8 mt-10 min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
            >
              <ProjectCard project={project} customTechLogos={customTechLogos} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-2 mt-12 md:mt-16 w-full">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 mx-2">
          {Array.from({ length: totalPages || 1 }).map((_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-navy text-white shadow-md dark:bg-white dark:text-navy scale-105"
                    : "bg-surface border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 shadow-sm"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handlePageChange(Math.min(totalPages || 1, currentPage + 1))}
          disabled={currentPage === (totalPages || 1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
