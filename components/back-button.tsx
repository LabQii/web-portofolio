"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label: string;
}

export default function BackButton({ href, label }: BackButtonProps) {
  return (
    <Link href={href} className="inline-flex items-center group mb-8">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden group-hover:border-accent dark:group-hover:border-accent transition-colors duration-300 bg-transparent">
          {/* Default icon that slides out left */}
          <ArrowLeft className="w-4 h-4 text-muted absolute transition-transform duration-300 ease-out group-hover:-translate-x-6" />
          {/* Active icon that slides in from right */}
          <ArrowLeft className="w-4 h-4 text-accent absolute translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0" />
        </div>
        <span className="text-[13px] uppercase tracking-widest font-bold text-muted group-hover:text-primary transition-colors duration-300">
          {label}
        </span>
      </div>
    </Link>
  );
}
