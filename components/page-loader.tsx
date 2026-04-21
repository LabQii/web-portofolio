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
    }, 800);

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
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.05)" : "scale(1)",
        pointerEvents: isExiting ? "none" : "all",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Sound Wave Ripples */}
        <div className="wave-circle" style={{ 
          borderColor: isDark ? "rgba(96, 165, 250, 0.6)" : "rgba(30, 58, 95, 0.4)",
          animationDelay: "0s" 
        }} />
        <div className="wave-circle" style={{ 
          borderColor: isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(30, 58, 95, 0.25)",
          animationDelay: "0.5s" 
        }} />
        <div className="wave-circle" style={{ 
          borderColor: isDark ? "rgba(96, 165, 250, 0.2)" : "rgba(30, 58, 95, 0.1)",
          animationDelay: "1s" 
        }} />

        {/* Logo Container */}
        <div style={{
          position: "relative",
          zIndex: 10,
          background: isDark ? "#1e293b" : "#ffffff",
          borderRadius: "50%",
          padding: "14px",
          boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 24px rgba(0,0,0,0.08)",
          animation: "logo-beat 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        }}>
          <img
            src="/images/icon-li.png"
            alt="Logo"
            style={{
              width: 56,
              height: 56,
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        </div>
      </div>

      <style>{`
        .wave-circle {
          position: absolute;
          width: 84px;
          height: 84px;
          border-radius: 50%;
          border-width: 2px;
          border-style: solid;
          opacity: 0;
          animation: wave-ripple 1.5s cubic-bezier(0.21, 0.53, 0.56, 0.8) infinite;
        }

        @keyframes wave-ripple {
          0% {
            transform: scale(0.85);
            opacity: 1;
          }
          100% {
            transform: scale(2.8);
            opacity: 0;
          }
        }

        @keyframes logo-beat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.92);
          }
        }
      `}</style>
    </div>
  );
}
