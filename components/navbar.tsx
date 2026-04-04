"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Profile", href: "/" },
  { name: "Experience", href: "/#experience" },
  { name: "All Activities", href: "/posts" },
  { name: "All Projects", href: "/projects" },
  { name: "Contacts", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  // ── Scroll detection ──────────────────────────────────────────────────────
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname === "/") {
        let currentSection = "profile";
        const scrollY = window.scrollY;

        if (window.innerHeight + scrollY >= document.body.offsetHeight - 50) {
          currentSection = "contact";
        } else {
          for (const section of ["experience", "contact"]) {
            const el = document.getElementById(section);
            if (el && el.getBoundingClientRect().top <= 300) {
              currentSection = section;
            }
          }
        }
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // ── Hash scroll on load ───────────────────────────────────────────────────
  React.useEffect(() => {
    const resolveHashScroll = () => {
      const hash = window.location.hash;
      if (!hash || pathname !== "/") return;

      const id = hash.replace("#", "");
      setActiveSection(id);
      let foundOnce = false;

      const tryScroll = (retries = 50) => {
        const el = document.getElementById(id);
        if (el) {
          foundOnce = true;
          const y = Math.max(
            0,
            el.getBoundingClientRect().top + window.pageYOffset - 80
          );
          window.scrollTo({ top: y, behavior: "auto" });
          setActiveSection(id);
          if (retries > 5) setTimeout(() => tryScroll(5), 100);
          else if (retries > 0) setTimeout(() => tryScroll(retries - 1), 100);
        } else if (!foundOnce && retries > 0) {
          setTimeout(() => tryScroll(retries - 1), 100);
        }
      };
      tryScroll();
    };

    setTimeout(resolveHashScroll, 50);
  }, [pathname]);

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/login"))
    return null;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getIsActive = (item: { href: string }) => {
    if (pathname === "/") {
      if (item.href === "/") return activeSection === "profile";
      if (item.href.startsWith("/#"))
        return activeSection === item.href.split("#")[1];
      return false;
    }
    return item.href !== "/" && pathname.startsWith(item.href);
  };

  const handleNavClick = (
    e: React.MouseEvent,
    href: string,
    isMobile = false
  ) => {
    const isHomeLink =
      pathname === "/" && (href === "/" || href.startsWith("/#"));

    if (isHomeLink) {
      e.preventDefault();
      const doScroll = () => {
        if (href === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveSection("profile");
        } else {
          const id = href.split("#")[1];
          if (id === "contact") {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            setActiveSection("contact");
          } else {
            const el = document.getElementById(id);
            if (el) {
              const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
              window.scrollTo({ top: y, behavior: "smooth" });
              setActiveSection(id);
            }
          }
        }
      };

      if (isMobile) {
        setIsMenuOpen(false);
        setTimeout(doScroll, 100);
      } else {
        doScroll();
      }
    } else if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
          scrolled
            ? "bg-background/80 backdrop-blur-[16px] border-b border-slate-200/50 dark:border-transparent shadow-[0_2px_20px_rgba(0,0,0,0.06)] dark:shadow-none"
            : "bg-background border-b border-slate-100 dark:border-transparent shadow-none"
        )}
        style={scrolled ? { WebkitBackdropFilter: "blur(16px)" } : {}}
      >
        <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight text-primary group"
            >
              <div className="relative w-8 h-8 flex items-center justify-center transition-all">
                <Image
                  src="/images/icon-labqii.png"
                  alt="Labqii Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <span>Labqii</span>
            </Link>

            {/* ── Desktop Nav ───────────────────────────────────────────── */}
            <div className="hidden md:flex items-center">
              {/* Magic Pill nav list */}
              <div
                className="relative flex items-center ml-10"
                onMouseLeave={() => setHoveredItem(null)}
              >
                {navItems.map((item) => {
                  const isActive = getIsActive(item);
                  // Pill shows on this item when:
                  //   a) it's being hovered, OR
                  //   b) it's the active item AND nothing is hovered
                  // → guarantees exactly ONE pill in the DOM at any time
                  //   so layoutId can slide it smoothly
                  const showPill =
                    hoveredItem === item.name ||
                    (isActive && hoveredItem === null);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      className={cn(
                        "relative px-4 py-2 mx-0.5 text-[14px] font-semibold rounded-full select-none",
                        "transition-colors duration-200",
                        showPill
                          ? "text-white dark:text-white"
                          : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {/* Single pill — always same color so no color flash during slide */}
                      {showPill && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-navy dark:bg-accent/75"
                          style={{ zIndex: -1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 40,
                            mass: 0.6,
                          }}
                        />
                      )}

                      {item.name}
                    </Link>
                  );
                })}

                {/* Divider + Theme toggle */}
                <div className="ml-3 pl-3 border-l border-slate-300 dark:border-slate-600 flex items-center h-8">
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* ── Mobile controls ───────────────────────────────────────── */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primary p-2 bg-surface rounded-md"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-background/95 backdrop-blur-xl overflow-hidden shadow-lg"
              style={{ WebkitBackdropFilter: "blur(20px)" }}
            >
              <div className="space-y-1 px-4 py-4">
                {navItems.map((item, i) => {
                  const isActive = getIsActive(item);
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200",
                          isActive
                            ? "bg-navy text-white dark:bg-accent/70 dark:text-white shadow-sm"
                            : "text-primary hover:bg-slate-100 hover:text-navy dark:hover:bg-white/10 dark:hover:text-white"
                        )}
                        onClick={(e) => handleNavClick(e, item.href, true)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
