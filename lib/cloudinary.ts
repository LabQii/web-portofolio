import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// ─── URL Optimizer ────────────────────────────────────────────────────────────
// Converts any Cloudinary URL to WebP on-the-fly without re-uploading.
// Safe to call on non-Cloudinary URLs (returns original unchanged).
//
// How it works:
//   Cloudinary supports URL-based transformations. By injecting transformation
//   parameters between "/upload/" and the public ID, Cloudinary delivers a
//   transformed version while keeping the original intact in storage.
//
// Example:
//   Input:  https://res.cloudinary.com/demo/image/upload/sample.jpg
//   Output: https://res.cloudinary.com/demo/image/upload/f_webp,q_auto:good,w_1200,c_limit/sample.jpg

export type CloudinaryImageType = "thumbnail" | "profile" | "gallery" | "logo";

const TRANSFORM_PRESETS: Record<CloudinaryImageType, string> = {
  thumbnail: "f_webp,q_auto:good,w_1200,c_limit",
  profile:   "f_webp,q_auto:good,w_400,c_limit",
  gallery:   "f_webp,q_auto:good,w_1200,c_limit",
  logo:      "f_webp,q_auto:good,w_200,c_limit",
};

/**
 * Returns an optimized Cloudinary URL with WebP format and compression.
 *
 * - Works on existing URLs (adds transformations via URL injection)
 * - Safe on non-Cloudinary URLs (returns original)
 * - Idempotent: already-transformed URLs are not double-transformed
 *
 * @param url    - The original Cloudinary image URL from the database
 * @param type   - Preset: "thumbnail" | "profile" | "gallery" | "logo"
 * @returns      - Optimized WebP URL
 */
export function getOptimizedUrl(
  url: string,
  type: CloudinaryImageType = "thumbnail"
): string {
  if (!url) return url;

  // Skip non-Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;

  // Skip if transformations already applied (idempotent)
  if (url.includes("f_webp") || url.includes("f_auto")) return url;

  const transform = TRANSFORM_PRESETS[type];

  // Inject transforms between "/upload/" and the rest of the path
  return url.replace("/upload/", `/upload/${transform}/`);
}
