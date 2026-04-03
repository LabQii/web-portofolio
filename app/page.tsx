import Hero from "@/components/hero";
import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/project-card";
import RecentPostsCarousel from "@/components/recent-posts-carousel";
import AnimatedSectionHeader from "@/components/animated-section-header";
import ExperienceTimeline from "@/components/experience-timeline";
import TechMarquee from "@/components/tech-marquee";
import MobileProjectsCarousel from "@/components/mobile-projects-carousel";
import DesktopProjectList from "@/components/desktop-project-list";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = await prisma.profile.findFirst();
  const featuredProjects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  const recentPosts = await prisma.post.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  const customTechLogos = await prisma.techStack.findMany();
  const experiences = await prisma.experience.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  const cv = await prisma.cV.findFirst({
    where: { isActive: true },
  });

  // Robust raw SQL: Prioritize Active, then most recent created
  const rawImages = await prisma.$queryRaw<any[]>`
    SELECT url FROM "ProfileImage" 
    ORDER BY 
      CASE WHEN "isActive" = true THEN 0 ELSE 1 END, 
      "createdAt" DESC 
    LIMIT 1
  `;
  const activeProfileImage = rawImages[0] || null;
  const allProjects = await prisma.project.findMany({ select: { techStack: true } });

  const allTechSet = new Set<string>();
  allProjects.forEach(p => p.techStack.forEach(t => allTechSet.add(t)));
  customTechLogos.forEach(t => allTechSet.add(t.name));
  const uniqueTechStacks = Array.from(allTechSet);

  return (
    <div className="flex flex-col">
      <Hero
        name={profile?.name}
        description={profile?.description}
        cvUrl={cv?.fileUrl}
        cvFileName={cv?.fileName}
        cvId={cv?.id}
        profileImageUrl={activeProfileImage?.url}
        heroExperience={profile?.heroExperience ?? undefined}
      />

      {/* Activities (Recent Posts) Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-section-gradient" id="recent-posts">

        <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <AnimatedSectionHeader title="Activities" href="/posts" />
          <div className="mt-10">
            <RecentPostsCarousel posts={recentPosts} />
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-hero-gradient">
        <div
          className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.02] bg-navy dark:bg-white"
          aria-hidden="true"
        ></div>
        <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <AnimatedSectionHeader title="Projects" href="/projects" />
          {/* Desktop/Tablet Project List (Paginated) */}
          <DesktopProjectList projects={featuredProjects} customTechLogos={customTechLogos} />
          
          {/* Mobile Project Carousel */}
          <div className="flex md:hidden mt-8 w-full">
            <MobileProjectsCarousel projects={featuredProjects} customTechLogos={customTechLogos} />
          </div>

          {/* All projects button (Only Mobile Now) */}
          <div className="flex justify-center w-full mt-10 md:hidden">
            <Link href="/projects" className="group flex items-center justify-center px-8 py-3.5 rounded-xl border border-navy shadow-sm dark:border-white text-navy dark:text-white bg-transparent hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy font-bold text-[15px] transition-all duration-300 active:scale-[0.98]">
              All projects <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="py-16 md:py-24 relative overflow-hidden bg-section-gradient"
      >
        <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-[2.5rem] font-bold text-primary">Experience</h2>
          </div>
          <ExperienceTimeline experiences={experiences} />
        </div>

        <div className="relative z-10 w-full">
          <TechMarquee techStacks={uniqueTechStacks} customTechLogos={customTechLogos} />
        </div>
      </section>
    </div>
  );
}
