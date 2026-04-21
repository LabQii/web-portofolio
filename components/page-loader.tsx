"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
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
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 600);

    const unmountTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.05)" : "scale(1)",
        pointerEvents: isExiting ? "none" : "all",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glow behind the logo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: isDark ? "rgba(96, 165, 250, 0.2)" : "rgba(30, 58, 95, 0.1)",
            filter: "blur(20px)",
            animation: "loader-glow 2s ease-in-out infinite",
          }}
        />

        {/* The main logo */}
        <img
          src="/images/icon-li.png"
          alt="Logo"
          style={{
            width: 80,
            height: 80,
            objectFit: "contain",
            animation: "loader-scale 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            position: "relative",
            zIndex: 1,
            userSelect: "none",
            filter: isDark ? "drop-shadow(0 0 8px rgba(255,255,255,0.1))" : "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
          }}
        />
      </div>

      <style>{`
        @keyframes loader-scale {
          0%, 100% { 
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.05);
            opacity: 1;
          }
        }
        @keyframes loader-glow {
          0%, 100% { 
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
