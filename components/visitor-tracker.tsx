"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // Only track in production/deployed environments
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocalhost) return;

    const hasVisited = localStorage.getItem("portofolio_visited");
    
    if (!hasVisited) {
      // Small delay to ensure it doesn't block initial page load
      const timer = setTimeout(async () => {
        try {
          const response = await fetch("/api/notifications/new-visitor", {
            method: "POST",
          });
          
          if (response.ok) {
            localStorage.setItem("portofolio_visited", "true");
          }
        } catch (error) {
          console.error("Failed to register new visitor:", error);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
