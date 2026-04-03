"use client";

import { useEffect } from "react";

export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    // Check if we've already viewed this project in the current session
    // This prevents spamming the API on hot reloads or fast navigations
    const cacheKey = `viewed-project-${slug}`;
    if (sessionStorage.getItem(cacheKey)) {
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/views/${slug}`, {
        method: "POST",
      })
        .then((res) => {
          if (res.ok) {
            sessionStorage.setItem(cacheKey, "true");
          }
        })
        .catch((err) => {
          console.error("Failed to increment view:", err);
        });
    }, 2000); // Wait 2 seconds before counting as a view

    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}
