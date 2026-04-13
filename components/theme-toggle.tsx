"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[38px] h-[38px] rounded-full" aria-hidden="true" />;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
      aria-label="Toggle theme"
    >
      <div className="relative w-[18px] h-[18px] flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            scale: currentTheme === 'dark' ? 0 : 1,
            rotate: currentTheme === 'dark' ? -90 : 0,
            opacity: currentTheme === 'dark' ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center origin-center"
        >
          <Sun className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            scale: currentTheme === 'dark' ? 1 : 0,
            rotate: currentTheme === 'dark' ? 0 : 90,
            opacity: currentTheme === 'dark' ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center origin-center"
        >
          <Moon className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </motion.div>
      </div>
    </button>
  );
}
