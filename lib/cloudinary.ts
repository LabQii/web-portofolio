import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export type CloudinaryImageType = "thumbnail" | "profile" | "gallery" | "logo";

const TRANSFORM_PRESETS: Record<CloudinaryImageType, string> = {
  thumbnail: "f_webp,q_auto:good,w_1200,c_limit",
  profile:   "f_webp,q_auto:good,w_400,c_limit",
  gallery:   "f_webp,q_auto:good,w_1200,c_limit",
  logo:      "f_webp,q_auto:good,w_200,c_limit",
};

export function getOptimizedUrl(
  url: string,
  type: CloudinaryImageType = "thumbnail"
): string {
  if (!url) return url;

  if (!url.includes("res.cloudinary.com")) return url;

  if (url.includes("f_webp") || url.includes("f_auto")) return url;

  const transform = TRANSFORM_PRESETS[type];

  return url.replace("/upload/", `/upload/${transform}/`);
}
