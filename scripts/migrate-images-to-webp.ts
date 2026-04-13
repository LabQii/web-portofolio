

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function optimizeUrl(url: string, transform: string): string {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("f_webp") || url.includes("f_auto")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}

const THUMB_TRANSFORM  = "f_webp,q_auto:good,w_1200,c_limit";
const PROFILE_TRANSFORM = "f_webp,q_auto:good,w_400,c_limit";
const LOGO_TRANSFORM   = "f_webp,q_auto:good,w_200,c_limit";

async function migrateProjects() {
  const projects = await prisma.project.findMany();
  let updated = 0;

  for (const p of projects) {
    const newThumb = optimizeUrl(p.thumbnail, THUMB_TRANSFORM);
    const newImages = p.images.map((img) => optimizeUrl(img, THUMB_TRANSFORM));

    const changed =
      newThumb !== p.thumbnail ||
      newImages.some((img, i) => img !== p.images[i]);

    if (changed) {
      await prisma.project.update({
        where: { id: p.id },
        data: { thumbnail: newThumb, images: newImages },
      });
      console.log(`  ✅ Project: ${p.title}`);
      updated++;
    }
  }

  console.log(`Projects migrated: ${updated}/${projects.length}`);
}

async function migratePosts() {
  const posts = await prisma.post.findMany();
  let updated = 0;

  for (const p of posts) {
    const newThumb = optimizeUrl(p.thumbnail, THUMB_TRANSFORM);
    if (newThumb !== p.thumbnail) {
      await prisma.post.update({
        where: { id: p.id },
        data: { thumbnail: newThumb },
      });
      console.log(`  ✅ Post: ${p.title}`);
      updated++;
    }
  }

  console.log(`Posts migrated: ${updated}/${posts.length}`);
}

async function migrateProfileImages() {
  const images = await prisma.profileImage.findMany();
  let updated = 0;

  for (const img of images) {
    const newUrl = optimizeUrl(img.url, PROFILE_TRANSFORM);
    if (newUrl !== img.url) {
      await prisma.profileImage.update({
        where: { id: img.id },
        data: { url: newUrl },
      });
      console.log(`  ✅ Profile image: ${img.id}`);
      updated++;
    }
  }

  console.log(`Profile images migrated: ${updated}/${images.length}`);
}

async function migrateTechStacks() {
  const stacks = await prisma.techStack.findMany();
  let updated = 0;

  for (const ts of stacks) {
    if (!ts.customLogoUrl) continue;
    const newUrl = optimizeUrl(ts.customLogoUrl, LOGO_TRANSFORM);
    if (newUrl !== ts.customLogoUrl) {
      await prisma.techStack.update({
        where: { id: ts.id },
        data: { customLogoUrl: newUrl },
      });
      console.log(`  ✅ TechStack: ${ts.name}`);
      updated++;
    }
  }

  console.log(`TechStacks migrated: ${updated}/${stacks.length}`);
}

async function main() {
  console.log("🔄 Starting image URL migration to WebP...\n");

  console.log("📁 Projects:");
  await migrateProjects();

  console.log("\n📝 Posts / Activities:");
  await migratePosts();

  console.log("\n👤 Profile Images:");
  await migrateProfileImages();

  console.log("\n🛠  Tech Stack Logos:");
  await migrateTechStacks();

  console.log("\n✨ Migration complete!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Migration failed:", e);
  prisma.$disconnect();
  process.exit(1);
});
