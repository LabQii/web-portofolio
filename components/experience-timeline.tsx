"use client";

import { motion } from "framer-motion";
import { Briefcase, Star, Calendar } from "lucide-react";

type Experience = {
  id: string;
  category: string;
  period: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

function TimelineCard({ item }: { item: Experience }) {
  return (
    <div
      className="group rounded-2xl p-6 border relative overflow-hidden bg-surface border-slate-200 dark:border-slate-800 shadow-md shadow-slate-700/10 hover:shadow-xl hover:shadow-navy/10 dark:hover:shadow-white/5 hover:-translate-y-1.5 hover:border-navy/20 dark:hover:border-slate-600 transition-all duration-500 ease-out"
    >
      <div 
        className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.015] group-hover:opacity-[0.04] bg-navy dark:bg-white transition-opacity duration-500" 
        aria-hidden="true"
      />
      <div className="relative z-10">
        {/* Top row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-600 border dark:border-slate-500 text-primary dark:text-slate-100 font-semibold">
            {item.category}
          </span>
          <span className="text-muted text-sm flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {item.period}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-primary mb-1">{item.title}</h3>

        {/* Organization */}
        <p className="text-sm font-semibold mb-3 text-accent">
          {item.organization}
        </p>

        {/* Description */}
        <p className="text-muted text-sm leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-muted"
            >
              # {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineNode({ featured }: { featured: boolean }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full z-10 transition-colors ${featured
        ? "w-12 h-12 bg-accent text-white shadow-lg shadow-accent/20"
        : "w-10 h-10 text-primary bg-surface border-2 border-slate-300 dark:border-slate-600 shadow-[0_0_0_4px_rgba(15,36,66,0.06)] dark:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]"
      }`}
    >
      {featured ? (
        <Star className="w-5 h-5" fill="currentColor" />
      ) : (
        <Briefcase className="w-4 h-4" />
      )}
    </div>
  );
}

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="relative">
      {/* Vertical center line — desktop only */}
      <div
        className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
        style={{
          width: '2px',
          background:
            "linear-gradient(to bottom, transparent 0%, #b8c8d8 15%, #8fa8be 50%, #b8c8d8 85%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Vertical left line — mobile only */}
      <div
        className="block md:hidden absolute left-5 top-0 bottom-0"
        style={{
          width: '2px',
          background:
            "linear-gradient(to bottom, transparent 0%, #b8c8d8 15%, #8fa8be 50%, #b8c8d8 85%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-12">
        {experiences.length === 0 && (
          <p className="text-slate-500 italic text-center py-12">No experiences yet. Add some from the admin panel.</p>
        )}
        {experiences.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.1 }}
              className="relative"
            >
              {/* Desktop: alternating layout */}
              <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
                {/* Left slot */}
                <div className={isLeft ? "flex justify-end" : ""}>
                  {isLeft && <div className="w-full max-w-[440px]"><TimelineCard item={item} /></div>}
                </div>

                {/* Center node */}
                <TimelineNode featured={item.featured} />

                {/* Right slot */}
                <div className={!isLeft ? "flex justify-start" : ""}>
                  {!isLeft && <div className="w-full max-w-[440px]"><TimelineCard item={item} /></div>}
                </div>
              </div>

              {/* Mobile: all cards on right of left line */}
              <div className="flex md:hidden items-start gap-4 pl-2">
                {/* Node pinned to left */}
                <div className="flex-shrink-0 relative z-10">
                  <TimelineNode featured={item.featured} />
                </div>
                {/* Card */}
                <div className="flex-1 min-w-0">
                  <TimelineCard item={item} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
