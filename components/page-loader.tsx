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
    }, 800); // slightly longer to let progress finish smoothly

    const unmountTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

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
        flexDirection: "column",
        gap: "24px",
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

      {/* Progress Bar Container */}
      <div 
        style={{
          width: "140px",
          height: "3px",
          background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.08)",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Progress Bar Fill */}
        <div 
          style={{
            height: "100%",
            background: isDark ? "#38bdf8" : "#0ea5e9", // beautiful light blue/sky color
            borderRadius: "4px",
            animation: "progress-fill 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards",
            transformOrigin: "left",
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
        @keyframes progress-fill {
          0% {
            transform: scaleX(0);
          }
          40% {
            transform: scaleX(0.4);
          }
          80% {
            transform: scaleX(0.85);
          }
          100% {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
