"use client";

import { useEffect } from "react";

export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {

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
    }, 2000);

    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}
