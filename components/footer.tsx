"use client";

import { usePathname } from "next/navigation";
import { Github, Linkedin, Instagram, Facebook, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useTransition, useEffect } from "react";
import { useToast } from "@/components/ui/toast";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/LabQii", icon: Github, color: "hover:bg-[#24292e]" },
  { name: "Facebook", href: "https://www.facebook.com/share/1CMSrW3JzB/", icon: Facebook, color: "hover:bg-[#1877f2]" },
  { name: "Instagram", href: "https://www.instagram.com/iqbaallfir", icon: Instagram, color: "hover:bg-[#e4405f]" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/labqii", icon: Linkedin, color: "hover:bg-[#0a66c2]" },
];

export default function Footer() {
  const pathname = usePathname();
  const { success, error: toastError, info } = useToast();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  useEffect(() => {
    if (window.location.hash === "#contact") {
      const handleInitialScroll = () => {
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }, 800);
      };

      if (document.readyState === "complete") {
        handleInitialScroll();
      } else {
        window.addEventListener("load", handleInitialScroll);
        return () => window.removeEventListener("load", handleInitialScroll);
      }
    }
  }, []);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    const newErrors: Record<string, boolean> = {};
    if (!data.name.trim()) {
      newErrors.name = true;
      toastError("Field Nama tidak boleh kosong");
    }
    if (!data.email.trim()) {
      newErrors.email = true;
      toastError("Field Email tidak boleh kosong");
    } else if (!validateEmail(data.email)) {
      newErrors.email = true;
      toastError("Format email tidak valid");
    }
    if (!data.message.trim()) {
      newErrors.message = true;
      toastError("Field Pesan tidak boleh kosong");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    startTransition(async () => {
      try {

        const response = await fetch("https://formspree.io/f/mqaebrda", {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          success("Pesan berhasil dikirim! Kami akan segera membalas.", { duration: 4000 });
          form.reset();
        } else {
          toastError("Gagal mengirim pesan, coba lagi.", { autoDismiss: false });
        }
      } catch (error) {
        toastError("Gagal mengirim pesan, coba lagi.", { autoDismiss: false });
      }
    });
  };

  return (
    <footer className="relative overflow-hidden bg-hero-gradient" id="contact">

      <div
        className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.02] bg-navy dark:bg-slate-800"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

          <div className="hidden md:block">
            <h2 className="text-[2rem] font-bold text-primary mb-4 leading-tight">
              Connect with me:
            </h2>
            <p className="text-muted text-lg mb-8">
              Satisfied with me? Please contact me
            </p>
            <div className="flex items-center gap-4 mb-10">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2.5 rounded-lg transition-all transform hover:scale-110 ${link.color} dark:hover:text-white`}
                >
                  <link.icon className="h-6 w-6 stroke-[1.5]" />
                  <span className="sr-only">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[1.25rem] font-medium text-primary mb-6">
              Contact me by email, let's make magic together
            </h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="sr-only">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Name"
                  className={`bg-surface border-slate-200 dark:border-slate-800 text-primary focus-visible:ring-accent text-base h-12 transition-colors ${errors.name ? "border-red-500 bg-red-50/10 dark:bg-red-500/10" : ""}`}
                />
              </div>
              <div>
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className={`bg-surface border-slate-200 dark:border-slate-800 text-primary focus-visible:ring-accent text-base h-12 transition-colors ${errors.email ? "border-red-500 bg-red-50/10 dark:bg-red-500/10" : ""}`}
                />
              </div>
              <div>
                <Label htmlFor="message" className="sr-only">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Message"
                  className={`bg-surface border-slate-200 dark:border-slate-800 text-primary focus-visible:ring-accent resize-none min-h-[120px] text-base transition-colors ${errors.message ? "border-red-500 bg-red-50/10 dark:bg-red-500/10" : ""}`}
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-navy hover:bg-navy/90 dark:bg-slate-100 dark:text-navy dark:hover:bg-white text-white min-w-[140px] rounded-xl h-11 text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
}
