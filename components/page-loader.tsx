"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect theme from .dark class on <html> (not from prefers-color-scheme)
  // This ensures light mode is default on first visit, 
  // only going dark if the user has actively enabled it.
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    // Watch for theme changes while loader is visible
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
    }, 1000); // 600ms wait + 400ms transition

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
        transform: isExiting ? "translateY(-8px)" : "translateY(0)",
        pointerEvents: isExiting ? "none" : "all",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Brand icon with pulse */}
        <img
          src="/images/logo-labqii.png"
          alt="Logo"
          style={{
            width: 42,
            height: 42,
            objectFit: "contain",
            animation: "loader-pulse 2s ease-in-out infinite",
            position: "relative",
            zIndex: 1,
            userSelect: "none",
            borderRadius: 10,
            backgroundColor: "#ffffff",
            padding: 1,
            boxShadow: isDark ? "0 0 0 1px rgba(255,255,255,0.08)" : "none",
          }}
        />

        {/* Arc spinner SVG */}
        <svg
          viewBox="0 0 80 80"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            animation: "loader-spin 1.2s linear infinite",
          }}
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke={isDark ? "#60a5fa" : "#1e3a5f"}
            strokeWidth="1.5"
            strokeDasharray="60 154"
            strokeLinecap="round"
          />
        </svg>

        {/* Subtle outer glow ring (static, thin) */}
        <svg
          viewBox="0 0 80 80"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.15,
          }}
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke={isDark ? "#93c5fd" : "#1e3a5f"}
            strokeWidth="1"
          />
        </svg>
      </div>

      <style>{`
        @keyframes loader-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes loader-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
