"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MusicHintAlert() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {

    if (sessionStorage.getItem("music_hint_shown")) return;

    const showTimer = setTimeout(() => {
      setVisible(true);

      const dismissTimer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 400);
      }, 4000);

      return () => clearTimeout(dismissTimer);
    }, 1500);

    sessionStorage.setItem("music_hint_shown", "1");

    return () => clearTimeout(showTimer);
  }, []);

  const pathname = usePathname();

  if (!visible || pathname?.startsWith("/admin")) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 88,
        right: 24,
        zIndex: 9998,
        padding: "10px 16px",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#f1f5f9" : "#1e293b",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateY(8px)" : "translateY(0)",
        animation: "music-hint-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
      <span>Background music available</span>
      <style>{`
        @keyframes music-hint-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
