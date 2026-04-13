"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MessageCircle, Code2, Terminal, Cpu, Github, Linkedin, Instagram, Facebook } from "lucide-react";
import { useState, useRef } from "react";

interface HeroProps {
  name?: string;
  description?: string;
  cvUrl?: string;
  cvFileName?: string;
  cvId?: string;
  profileImageUrl?: string;
  heroExperience?: string;
}

export default function Hero({ name, description, cvUrl, cvFileName, cvId, profileImageUrl, heroExperience }: HeroProps) {
  const defaultName = "Hi, I am Muhammad Iqbal Firmansyah";
  const defaultDesc = "Fullstack JavaScript Developer with hands-on experience in Google Apps Script automation and web application development for operational and business needs. He has a strong interest in Front-End Development and continuously improves his skills in Laravel and modern web technologies. Experienced in supporting internal systems, improving workflow efficiency, and mentoring learners in coding environments.";

  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-20, 20]);

  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);

  const scale = useSpring(isHovered ? 1.04 : 1, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.04);
  };

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center pt-12 pb-20 md:py-24 lg:py-0 bg-hero-gradient">
      <div
        className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.02] bg-navy dark:bg-white"
      ></div>
      <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-14">

          <div className="w-full lg:max-w-[50%] text-center lg:text-left relative z-10">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex md:hidden items-center justify-center gap-4 mb-6 -mt-2"
            >
              {[
                { name: "GitHub", href: "https://github.com/LabQii", icon: Github, color: "hover:bg-[#24292e]" },
                { name: "Facebook", href: "https://www.facebook.com/share/1CMSrW3JzB/", icon: Facebook, color: "hover:bg-[#1877f2]" },
                { name: "Instagram", href: "https://www.instagram.com/iqbaallfir", icon: Instagram, color: "hover:bg-[#e4405f]" },
                { name: "LinkedIn", href: "https://www.linkedin.com/in/labqii", icon: Linkedin, color: "hover:bg-[#0a66c2]" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2.5 rounded-lg transition-all transform hover:scale-110 ${link.color} dark:hover:text-white shadow-sm border border-transparent dark:border-slate-800`}
                >
                  <link.icon className="h-5 w-5 stroke-[1.5]" />
                  <span className="sr-only">{link.name}</span>
                </a>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[44px] md:text-[38px] font-bold text-primary leading-[1.1] mb-6 tracking-tight"
            >
              {name || defaultName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-[17px] text-muted leading-[1.7] mb-10 max-w-[672px] mx-auto lg:mx-0"
            >
              {description || defaultDesc}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Button size="lg" asChild className="bg-navy hover:bg-navy/90 dark:bg-slate-100 dark:text-navy dark:hover:bg-white text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                <a
                  href={cvId ? `/api/cv/download/${cvId}` : (cvUrl || "#")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View CV
                </a>
              </Button>
              <Button size="lg" asChild className="bg-white text-navy hover:bg-navy hover:text-white dark:bg-white dark:text-navy dark:hover:bg-accent dark:hover:text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 border-none">
                <a
                  href="https://wa.me/6285177440699?text=Hello%20Iqbal%2C%20I%20saw%20your%20portfolio%20and%20would%20love%20to%20connect!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Chat on WhatsApp
                </a>
              </Button>
            </motion.div>
          </div>

          <div className="relative flex items-center justify-center flex-shrink-0 p-8 md:p-10">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[420px] md:h-[420px] bg-blue-50/80 dark:bg-slate-700/40 rounded-full -z-10 opacity-60"></div>

            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              style={{
                perspective: 1200,
                transformStyle: "preserve-3d",
              }}
              className="relative w-[300px] h-[340px] md:w-[340px] md:h-[380px] z-20 group"
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  scale,
                  transformStyle: "preserve-3d",
                }}
                className="w-full h-full relative"
              >
                
                <motion.div 
                  className="absolute inset-0 rounded-[24px] pointer-events-none z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 0.4 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: useTransform(
                      [glareX, glareY],
                      ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
                    )
                  }}
                />

                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-transparent rounded-tl-xl z-30 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500"></div>
                <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-transparent rounded-tr-xl z-30 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500"></div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-transparent rounded-bl-xl z-30 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500"></div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-transparent rounded-br-xl z-30 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500"></div>

                <div className="absolute inset-0 bg-slate-100 rounded-[24px] shadow-2xl overflow-hidden border border-white/40">
                  <Image
                    src={profileImageUrl || ""}
                    alt={name || "Profile Image"}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 300px, 340px"
                    priority
                  />
                </div>

                <div 
                  className={`absolute top-12 -left-12 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-100 font-mono text-[11px] px-3 py-1.5 rounded-lg flex items-center shadow-lg border border-slate-200/50 dark:border-white/10 z-30 transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                    ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transform: "translateZ(50px)", ...(isHovered ? {} : { transform: "translateZ(0) translateY(16px)" }) }}
                >
                  <span className="text-cyan-400 mr-0.5">&lt;</span><span className="text-emerald-400">HelloWorld</span><span className="text-cyan-400 ml-1">/&gt;</span>
                </div>

                <div 
                  className={`absolute top-2/3 -left-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-100 font-mono text-[11px] px-3 py-1.5 rounded-lg shadow-lg border border-slate-200/50 dark:border-white/10 z-30 transition-all duration-[800ms] delay-100 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                    ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transform: "translateZ(40px)", ...(isHovered ? {} : { transform: "translateZ(0) translateY(16px)" }) }}
                >
                  npm<span className="text-pink-400 mx-1.5">run</span><span className="text-cyan-300">dev</span>
                </div>

                <div 
                  className={`absolute bottom-24 -right-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-100 font-mono text-[11px] px-3 py-1.5 rounded-lg shadow-lg border border-slate-200/50 dark:border-white/10 z-30 transition-all duration-700 delay-75 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                    ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transform: "translateZ(60px)", ...(isHovered ? {} : { transform: "translateZ(0) translateY(16px)" }) }}
                >
                  php<span className="text-emerald-400 mx-1.5">artisan</span><span className="text-orange-300">serve</span>
                </div>

                <div 
                  className={`absolute top-4 -right-6 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/50 z-30 transition-all duration-500 delay-150 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                    ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transform: "translateZ(40px)", ...(isHovered ? {} : { transform: "translateZ(0) translateY(16px)" }) }}
                >
                  <Code2 className="w-5 h-5 text-navy dark:text-accent drop-shadow-sm" />
                </div>
                
                <div 
                  className={`absolute top-1/2 -left-8 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/50 z-30 transition-all duration-700 delay-100 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                    ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
                  style={{ transform: "translateZ(45px)", ...(isHovered ? {} : { transform: "translateZ(0) translateY(-16px)" }) }}
                >
                  <Cpu className="w-5 h-5 text-navy dark:text-accent drop-shadow-sm" />
                </div>

                <div className="absolute -top-6 left-0 right-0 hidden lg:flex justify-center z-30 pointer-events-none">
                  <div
                    className={`flex items-center gap-3 w-max pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]`}
                    style={{ transform: isHovered ? "translateZ(50px) translateY(-14px)" : "translateZ(0) translateY(0)" }}
                  >
                    <div className="flex items-center bg-white/80 dark:bg-[#1e293b] backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-white/60 dark:border-slate-600 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" className="w-4 h-4 mr-1.5 dark:invert" />
                      Next.js
                    </div>
                    <div className="flex items-center bg-white/80 dark:bg-[#1e293b] backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-white/60 dark:border-slate-600 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <img src="https://cdn.simpleicons.org/react" alt="React" className="w-4 h-4 mr-1.5" />
                      React.js
                    </div>
                    <div className="flex items-center bg-white/80 dark:bg-[#1e293b] backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-white/60 dark:border-slate-600 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <img src="https://cdn.simpleicons.org/laravel" alt="Laravel" className="w-4 h-4 mr-1.5" />
                      Laravel
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-white/90 dark:bg-[#1e293b] backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-white/60 dark:border-slate-600 min-w-[130px] z-30 transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  style={{ transform: isHovered ? "translateZ(60px)" : "translateZ(0)" }}
                >
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-1 font-semibold">Experience</div>
                  <div className="flex items-center font-bold text-slate-800 dark:text-slate-200 text-[15px]">
                    <svg className="w-4 h-4 mr-1.5 text-navy dark:text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {heroExperience || "1+ Years"}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex lg:hidden items-center justify-center gap-2 z-20 w-max"
            >
              <div className="flex items-center bg-white dark:bg-[#1e293b] rounded-full px-3 py-1.5 shadow-md border border-transparent dark:border-slate-600 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" className="w-3.5 h-3.5 mr-1.5 dark:invert" />
                Next.js
              </div>
              <div className="flex items-center bg-white dark:bg-[#1e293b] rounded-full px-3 py-1.5 shadow-md border border-transparent dark:border-slate-600 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                <img src="https://cdn.simpleicons.org/react" alt="React" className="w-3.5 h-3.5 mr-1.5" />
                React
              </div>
              <div className="flex items-center bg-white dark:bg-[#1e293b] rounded-full px-3 py-1.5 shadow-md border border-transparent dark:border-slate-600 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                <img src="https://cdn.simpleicons.org/laravel" alt="Laravel" className="w-3.5 h-3.5 mr-1.5" />
                Laravel
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
