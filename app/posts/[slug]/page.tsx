import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageSquare, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import ReadingProgress from "@/components/reading-progress";
import BackButton from "@/components/back-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({ where: { slug: resolvedParams.slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Iqbal Blog`,
    description: post.description,
    openGraph: {
      images: [post.thumbnail],
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const resolvedParams = await params;

  const [post, allPosts] = await Promise.all([
    prisma.post.findUnique({ where: { slug: resolvedParams.slug } }),
    prisma.post.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ],
      select: {
        title: true,
        slug: true,
        category: true,
        thumbnail: true,
        description: true,
      }
    })
  ]);

  if (!post) notFound();

  const currentIndex = allPosts.findIndex(p => p.slug === resolvedParams.slug);
  const nextPost = allPosts.length > 1
    ? allPosts[(currentIndex + 1) % allPosts.length]
    : null;

  return (
    <div className="min-h-screen pb-12 bg-page-gradient">
      <div className="relative z-10 flex flex-col min-h-screen">
        <ReadingProgress />
        <article className="w-full mx-auto px-4 pt-16 sm:pt-24 pb-8 max-w-[768px] flex-grow">
          <BackButton href="/posts" label="Back to Activities" />

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-navy/10 text-navy dark:bg-white dark:text-navy font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight text-primary">{post.title}</h1>
          <p className="text-xl text-muted leading-relaxed mb-6">{post.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </div>
            {post.eventName && (
              <span className="font-semibold text-foreground">{post.eventName}</span>
            )}
            {post.teamName && (
              <span className="italic">{post.teamName}</span>
            )}
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-xl border border-slate-100 dark:border-slate-800">
            <Image src={post.thumbnail} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px" className="object-cover" />
          </div>
        </article>

        {/* Bottom cards — Next Activity + Collaboration */}
        <div className="w-full mx-auto px-4 pb-16 sm:pb-24 max-w-[768px]">
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 sm:pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {nextPost && (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-8 transition-all hover:shadow-xl hover:border-accent/40 dark:hover:border-accent/40 hover:-translate-y-1"
                >
                  <div className="flex flex-col h-full justify-between relative z-10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-3 block">
                        Next Activity
                      </span>
                      <h3 className="text-xl font-bold text-[#0f172a] dark:text-white group-hover:text-accent transition-colors duration-300 leading-snug">
                        {nextPost.title}
                      </h3>
                      <p className="text-sm text-[#64748b] dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {nextPost.description}
                      </p>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wider">
                        {nextPost.category}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#0f172a] dark:text-white group-hover:translate-x-1 group-hover:text-accent transition-all duration-300">
                      Read More <ArrowRight className="w-4 h-4 text-accent" />
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05] group-hover:opacity-[0.12] transition-opacity">
                    <Image
                      src={nextPost.thumbnail}
                      alt=""
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                </Link>
              )}

              <div className="rounded-3xl bg-navy dark:bg-[#1a356e] p-8 text-white relative overflow-hidden group border border-white/10 dark:border-white/20 shadow-lg transition-transform duration-300 hover:-translate-y-1">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      Interested in collaborating?
                    </h3>
                    <p className="text-white/80 dark:text-slate-200 text-sm leading-relaxed max-w-[280px]">
                      Let's chat about your project and see how I can help bring your ideas to life.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Button asChild className="bg-white text-navy hover:bg-accent hover:text-white dark:bg-white dark:text-navy dark:hover:bg-accent dark:hover:text-white rounded-xl px-6 font-bold shadow-lg transition-all duration-300 active:scale-95 border-none">
                      <a
                        href="https://wa.me/6285177440699?text=Hello%20Iqbal%2C%20I%20saw%20your%20activity%20post%20and%20would%20like%20to%20discuss%20a%20collaboration!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 dark:bg-white/10 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors duration-500" />
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
