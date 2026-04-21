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

  // Elegant gradients for the soundwaves
  const waveGradientLight = "linear-gradient(135deg, rgba(30, 58, 138, 0.35), rgba(14, 165, 233, 0.35))"; // Navy to light blue
  const waveGradientDark = "linear-gradient(135deg, rgba(56, 189, 248, 0.4), rgba(79, 70, 229, 0.4))"; // Sky blue to Indigo

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
        {/* Sound Wave Ripples - Solid Gradient Discs */}
        <div className="wave-circle" style={{ 
          background: isDark ? waveGradientDark : waveGradientLight,
          animationDelay: "0s" 
        }} />
        <div className="wave-circle" style={{ 
          background: isDark ? waveGradientDark : waveGradientLight,
          animationDelay: "0.5s" 
        }} />
        <div className="wave-circle" style={{ 
          background: isDark ? waveGradientDark : waveGradientLight,
          animationDelay: "1s" 
        }} />

        {/* Logo Container */}
        <div style={{
          position: "relative",
          zIndex: 10,
          background: isDark ? "#1e293b" : "#ffffff",
          borderRadius: "50%",
          padding: "6px", // Much smaller padding so logo is huge and dominant
          boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 8px 32px rgba(30, 58, 138, 0.15)", // Navy tinted shadow in light mode
          animation: "logo-beat 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        }}>
          <img
            src="/images/icon-li.png"
            alt="Logo"
            style={{
              width: 68, // Huge and extremely clear
              height: 68,
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        </div>
      </div>

      <style>{`
        .wave-circle {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          opacity: 0;
          animation: wave-ripple 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) infinite;
        }

        @keyframes wave-ripple {
          0% {
            transform: scale(0.9);
            opacity: 1;
            filter: blur(2px);
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
            filter: blur(8px);
          }
        }

        @keyframes logo-beat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.94);
          }
        }
      `}</style>
    </div>
  );
}
