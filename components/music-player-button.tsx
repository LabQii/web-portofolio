"use client";

import { useMusic } from "@/contexts/MusicContext";
import { Pause, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function MusicPlayerButton() {
    const { isPlaying, toggle, isReady } = useMusic();
    const [showLabel, setShowLabel] = useState(false);
    const pathname = usePathname();

    if (pathname?.startsWith("/admin")) return null;

    return (
        <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-2">
            
            <AnimatePresence>
                {showLabel && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap backdrop-blur-sm"
                    >
                        {isPlaying ? "Pause music" : "Play music"}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={toggle}
                onMouseEnter={() => setShowLabel(true)}
                onMouseLeave={() => setShowLabel(false)}
                title={isPlaying ? "Pause music" : "Play background music"}
                disabled={!isReady}
                className={`relative h-11 w-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border
                    ${isPlaying
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-700 dark:border-slate-300 shadow-slate-900/25"
                        : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600"
                    } backdrop-blur-sm disabled:opacity-40`}
            >
                
                {isPlaying && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-slate-900/20 dark:bg-white/20 animate-ping" />
                        <span className="absolute inset-0 rounded-full bg-slate-900/10 dark:bg-white/10 animate-pulse" />
                    </>
                )}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={isPlaying ? "pause" : "play"}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 30 }}
                        className="relative z-10"
                    >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
                    </motion.span>
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
