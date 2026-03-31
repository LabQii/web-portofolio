import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, Github, ExternalLink, Code2, Database, Layout, Smartphone, Server, Paintbrush, Globe, Braces, Terminal } from "lucide-react";
import { Metadata } from "next";
import type { Project, TechStack } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { getTechLogoDetails } from "@/lib/tech-icons";
import TechLogoImage from "@/components/tech-logo-image";
import VideoDemoButton from "@/components/video-demo-button";
import ProjectGallery from "@/components/project-gallery";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({ where: { slug: resolvedParams.slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Iqbal Portfolio`,
    description: project.description,
    openGraph: {
      images: [project.thumbnail],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [project, customTechLogos] = await Promise.all([
    prisma.project.findUnique({ where: { slug } }),
    prisma.techStack.findMany(),
  ]);

  if (!project) notFound();

  // Increment views in background — don't block render
  void prisma.project.update({ where: { id: project.id }, data: { views: { increment: 1 } } });

  const allImages = [project.thumbnail, ...project.images];

  return (
    <div className="min-h-screen pb-24 bg-page-gradient">
      <div className="relative z-10 flex flex-col min-h-screen">
        <article className="w-full mx-auto px-4 py-16 sm:py-24 max-w-[1024px] flex-grow">
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 mb-6 pl-0 hover:pl-2 transition-all text-muted hover:text-primary transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 border-transparent">
                {project.category}
              </Badge>
              {project.tags.map((tag, i) => (
                <Badge key={`${tag}-${i}`} variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">{project.title}</h1>
            <p className="text-xl text-muted leading-relaxed max-w-[950px]">{project.description}</p>
            <div className="flex items-center gap-1 mt-3 text-sm text-muted">
              <Eye className="h-3.5 w-3.5" />
              <span>{project.views} views</span>
            </div>
          </div>

          <div className="mb-12">
            <ProjectGallery images={allImages} />
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 mb-12">
            {project.demoUrl && (
              <Button asChild className="bg-navy hover:bg-navy/90 dark:bg-slate-50 dark:text-navy dark:hover:bg-slate-100 text-white rounded-xl px-7 h-11 shadow-md transition-all duration-300 active:scale-[0.98]">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-semibold text-[15px]">
                  <ExternalLink className="h-4 w-4" /> Live Demo
                </a>
              </Button>
            )}
            
            {project.videoUrl && (
              <Button asChild className="bg-[#ef4444] hover:bg-[#dc2626] dark:bg-[#ef4444] dark:text-white dark:hover:bg-[#dc2626] text-white rounded-xl px-7 h-11 shadow-md transition-all duration-300 active:scale-[0.98]">
                <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-semibold text-[15px]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Video Demo
                </a>
              </Button>
            )}

            {project.githubUrl && (
              <Button asChild className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 text-white rounded-xl px-7 h-11 shadow-md transition-all duration-300 active:scale-[0.98]">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-semibold text-[15px]">
                  <Github className="h-4 w-4" /> Source Code
                </a>
              </Button>
            )}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Left Column: Tech Stack */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-1 bg-accent rounded-full"></div>
                <h2 className="text-xl font-bold m-0 text-primary">Tech Stack</h2>
              </div>
              <div className="flex flex-col gap-3">
                {project.techStack.map((tech, i) => {
                  const logoDetails = getTechLogoDetails(tech, customTechLogos);
                  return (
                    <div key={`${tech}-${i}`} className="px-5 py-3 rounded-xl border text-[14px] font-semibold flex items-center justify-start gap-3 transition-colors bg-background dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-primary shadow-sm hover:border-accent/40">
                      {logoDetails.type === 'initial' ? (
                        <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-600 dark:text-slate-200">
                          {logoDetails.initial}
                        </div>
                      ) : (
                        <div className="w-5 h-5 relative flex items-center justify-center shrink-0">
                          <TechLogoImage
                            src={logoDetails.url}
                            alt={tech}
                            initial={tech.charAt(0).toUpperCase()}
                          />
                        </div>
                      )}
                      <span>{tech}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: About Content */}
            <div className="md:col-span-2">
              <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 mt-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-1 bg-accent rounded-full"></div>
                  <h2 className="text-xl font-bold m-0 text-primary">About this project</h2>
                </div>
                {project.content ? (
                  <div className="prose prose-neutral dark:prose-invert max-w-none text-muted leading-relaxed whitespace-pre-wrap text-base">
                    {project.content}
                  </div>
                ) : (
                  <p className="text-muted italic">No description provided.</p>
                )}
              </div>
            </div>

          </div>

        </article>
      </div>
    </div>
  );
}
