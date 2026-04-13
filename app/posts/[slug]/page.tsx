import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import ReadingProgress from "@/components/reading-progress";

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
  const post = await prisma.post.findUnique({ where: { slug: resolvedParams.slug } });
  if (!post) notFound();

  return (
    <div className="min-h-screen pb-24 bg-page-gradient">
      <div className="relative z-10 flex flex-col min-h-screen">
        <ReadingProgress />
        <article className="w-full mx-auto px-4 py-16 sm:py-24 max-w-[768px] flex-grow">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 mb-6 pl-0 hover:pl-2 transition-all text-muted hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Posts
          </Link>

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

          <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-xl border border-slate-100 dark:border-slate-800">
            <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
          </div>
        </article>
      </div>
    </div>
  );
}
