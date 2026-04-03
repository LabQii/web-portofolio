"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentPostsCarousel({ posts: initialPosts }: { posts: any[] }) {
  if (!initialPosts || initialPosts.length === 0) {
    return <p className="text-muted-foreground italic">No posts yet. Check back soon!</p>;
  }

  const displayPosts = initialPosts;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, displayPosts.length]);

  const activePost = displayPosts[currentIndex];

  return (
    <div
      className="flex flex-col md:flex-row gap-8 md:gap-10 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Area: Carousel */}
      <div className="w-full md:w-[55%] lg:max-w-[600px] flex flex-col overflow-hidden">
        {/* Coverflow container */}
        <div className="relative w-full h-[260px] md:h-[300px] flex items-center justify-center overflow-visible">
          {displayPosts.map((post, idx) => {
            const total = displayPosts.length;
            let dist = idx - currentIndex;

            // Normalize distance — prefer shortest path around the loop
            if (dist < -Math.floor(total / 2)) dist += total;
            if (dist > Math.floor(total / 2)) dist -= total;

            const isActive = dist === 0;
            const isSide = Math.abs(dist) === 1;
            const isHidden = Math.abs(dist) > 1;

            // Derived animated values
            const xPercent = dist * 62;          // side cards offset %
            const scale = isActive ? 1 : 0.85;
            const opacity = isActive ? 1 : isSide ? 0.6 : 0;
            const rotateY = isActive ? 0 : dist > 0 ? -15 : 15;
            const zIndex = isActive ? 30 : isSide ? 20 : 0;

            return (
              <motion.div
                key={`${post.id}-${idx}`}
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
                  opacity: { duration: 0.5, ease: "easeInOut" },
                }}
                style={{ perspective: 900, boxShadow: isActive ? '0 16px 48px rgba(15,36,66,0.22)' : '0 4px 16px rgba(15,36,66,0.10)' }}
                className={`absolute w-[80%] md:w-[75%] h-[260px] md:h-[300px] rounded-2xl overflow-hidden cursor-pointer ${post.imageFit === 'contain' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'} ${isHidden ? 'pointer-events-none' : ''}`}
                onClick={() => {
                  if (isActive) return;
                  setCurrentIndex(idx);
                }}
              >
                <div className={`absolute inset-0 ${post.imageFit === 'contain' ? 'p-4' : ''}`}>
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className={`
                      absolute inset-0 w-full h-full
                      ${post.imageFit === 'contain' ? 'object-contain' : 'object-cover'}
                      ${post.imagePosition === 'center' ? 'object-center' :
                        post.imagePosition === 'bottom' ? 'object-bottom' : 'object-top'}
                      transition-transform duration-700 hover:scale-[1.04]
                      ${isActive ? 'grayscale-0' : 'grayscale'}
                    `}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {/* Featured Star Badge */}
                {post.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-3 right-3 z-30 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md"
                  >
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  </motion.div>
                )}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-6 pt-24 pointer-events-none" 
                  style={{ background: "linear-gradient(to top, rgba(15, 36, 66, 0.85) 0%, rgba(15, 36, 66, 0) 100%)" }}
                >
                  <h3 className="font-bold text-white text-lg line-clamp-2 md:text-xl mb-1 drop-shadow-md">{post.title}</h3>
                  <p className="text-white/80 text-sm drop-shadow-md">{formatDate(post.createdAt)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-2 mt-8 md:mt-10">
          {displayPosts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-accent w-6 h-2" : "bg-slate-300 dark:bg-slate-700 w-2 h-2 hover:bg-slate-400"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right Area: Static Detail Panel (Desktop only) */}
      <div className="hidden md:flex flex-1 relative z-10 flex-col h-[340px] my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl p-8 border flex flex-col h-full relative overflow-hidden bg-surface border-slate-200 dark:border-slate-800 shadow-md shadow-slate-700/10"
          >
            <div className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.01] z-0 bg-navy dark:bg-white" />

            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="uppercase tracking-widest text-sm text-slate-400 font-semibold">{formatDate(activePost.createdAt)}</span>
              {activePost.category && (
                <span className="bg-navy/10 text-navy dark:bg-white dark:text-navy font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {activePost.category}
                </span>
              )}
            </div>

            <h2 className="text-[28px] font-bold text-primary mt-2 mb-4 leading-tight line-clamp-2 relative z-10">{activePost.title}</h2>

            <p className="text-muted text-[16px] leading-relaxed line-clamp-5 flex-grow mb-6 overflow-y-auto max-h-[120px] relative z-10">
              {activePost.description}
            </p>

            <div className="mt-auto border-t border-slate-100 pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-medium">Post {currentIndex + 1} of {displayPosts.length}</span>
                <Link href={`/posts/${activePost.slug}`} className="group flex items-center text-[15px] font-bold text-accent hover:text-accent/80 transition-colors">
                  Read Full Post
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Details Box for Active Post */}
      <AnimatePresence mode="wait">
        <motion.div
           key={currentIndex}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
           className="flex md:hidden flex-col bg-surface rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative w-full"
        >
          <div className="flex justify-between items-center mb-4">
             <span className="uppercase tracking-widest text-[11px] text-slate-400 font-semibold">{formatDate(activePost.createdAt)}</span>
             {activePost.category && (
               <span className="bg-navy/10 text-navy dark:bg-white dark:text-navy font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                 {activePost.category}
               </span>
             )}
          </div>
          <p className="text-muted text-[14px] leading-relaxed line-clamp-4 mb-6">
            {activePost.description}
          </p>
          <Link href={`/posts/${activePost.slug}`} className="w-full">
            <button className="w-full flex items-center justify-center bg-navy hover:bg-navy/90 dark:bg-slate-100 dark:text-navy dark:hover:bg-white shadow-sm rounded-xl py-3.5 text-[14px] font-bold text-white transition-all duration-300">
              Read Full Post <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
