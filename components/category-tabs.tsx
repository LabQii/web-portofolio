"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory?: string;
}

export default function CategoryTabs({ categories, activeCategory }: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (query === currentQ) return;

      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (query) {
        current.set("q", query);
      } else {
        current.delete("q");
      }

      const search = current.toString();
      const queryStr = search ? `?${search}` : "";
      router.push(`/projects${queryStr}`);
    }, 400);

    return () => clearTimeout(handler);
  }, [query, router, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-slate-200 dark:border-slate-700 pb-0">
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        
        <Link 
          href="/projects" 
          className="relative px-4 pt-2 pb-4 text-sm font-semibold rounded-t-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
        >
          <span className={!activeCategory ? "text-accent dark:!text-white" : "hover:text-accent dark:hover:!text-white"}>{"All Projects"}</span>
          {!activeCategory && (
            <motion.div
              layoutId="activeTab"
              className="absolute left-0 right-0 bottom-0 h-[2px] bg-accent"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </Link>

        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <Link
              key={cat}
              href={`/projects?category=${cat}`}
              className="relative px-4 pt-2 pb-4 text-sm font-semibold rounded-t-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
            >
              <span className={isActive ? "text-accent dark:!text-white" : "hover:text-accent dark:hover:!text-white"}>{cat}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 right-0 bottom-0 h-[2px] bg-accent"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="relative group w-full mb-3 sm:w-auto pb-0 sm:pb-0">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-[200px] sm:focus:w-[260px] pl-9 pr-8 py-2 bg-slate-50/50 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:border-accent focus:ring-1 focus:ring-accent rounded-full text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-300 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
