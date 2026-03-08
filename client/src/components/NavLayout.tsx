/*
 * KOVA OS — Persistent Navigation Layout
 * Design: Premium SaaS Dark Dashboard — Liquid Orb Edition
 * Top nav linking Integration Hub ↔ Command Center
 */

import { Link, useLocation } from "wouter";
import { Zap, Grid3x3, LayoutDashboard } from "lucide-react";

const ORB_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663309818529/KywZHjdnZoy9ZJkeuXSWsQ/kova-hero-orb-b7b4wYvkEusLkjqB2BHk4K.webp";

const NAV_ITEMS = [
  { path: "/", label: "Integration Hub", icon: <Grid3x3 className="w-4 h-4" /> },
  { path: "/command-center", label: "Command Center", icon: <LayoutDashboard className="w-4 h-4" /> },
];

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-white/8">
        <div className="container h-14 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-4">
            <img
              src={ORB_IMAGE}
              alt="Kova OS"
              className="w-7 h-7 rounded-full object-cover"
              style={{ boxShadow: "0 0 12px oklch(0.65 0.28 320 / 50%)" }}
            />
            <span className="font-display font-bold text-white text-sm tracking-tight hidden sm:block">
              Kova OS
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:block">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side badge */}
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[10px] font-mono text-zinc-500">
              <Zap className="w-3 h-3 text-cyan-400" />
              v2.1
            </div>
            <a
              href="https://manus.im"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600/80 to-cyan-600/80 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-display font-semibold transition-all"
            >
              Open Manus
            </a>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
