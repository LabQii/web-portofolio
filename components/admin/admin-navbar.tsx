"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Check, Clock, Trash2, ExternalLink } from "lucide-react";
import AdminSignOut from "./sign-out-button";
import Image from "next/image";
import { cn, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminNavbar() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (ids: string[] | "all") => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ ids }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  return (
    <header className="h-[64px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 shrink-0 relative z-20">
      <Link href="/admin" className="flex items-center gap-2.5 text-[18px] font-bold tracking-tight text-[#0f172a] group">
        <div className="relative w-8 h-8 flex items-center justify-center transition-all">
          <Image 
            src="/images/icon-wolf.png" 
            alt="Logo" 
            width={34} 
            height={34} 
            className="object-contain"
          />
        </div>
        <span>Labqii.</span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "text-[#64748b] hover:text-[#0f172a] transition-colors p-2 rounded-full hover:bg-slate-100 relative",
              isOpen && "bg-slate-100 text-[#0f172a]"
            )}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
            )}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-3 w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAsRead("all")}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            "p-4 transition-colors relative group",
                            !notif.isRead ? "bg-blue-50/30" : "hover:bg-slate-50/50"
                          )}
                        >
                          {!notif.isRead && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                          )}
                          <div className="flex justify-between gap-3 mb-1">
                            <span className="text-sm font-bold text-slate-800 line-clamp-1">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(notif.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pr-6">
                            {notif.message}
                          </p>
                          <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notif.isRead && (
                              <button
                                onClick={() => markAsRead([notif.id])}
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-slate-100 text-[10px] font-bold text-slate-600 hover:text-blue-600 transition-colors shadow-sm"
                              >
                                <Check className="w-3 h-3" />
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium italic">No notifications yet</p>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">
                    View configuration
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-5 bg-[#e2e8f0] mx-1"></div>
        <Link href="/" target="_blank" className="text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] transition-colors px-2 flex items-center gap-1.5">
          View Site
          <ExternalLink className="w-3 h-3" />
        </Link>
        <AdminSignOut />
      </div>
    </header>
  );
}
