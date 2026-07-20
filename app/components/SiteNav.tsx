"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Resources", href: "/resources" },
  { label: "Hobbies", href: "/hobbies" }
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 overflow-hidden border-b border-gray-800/60 bg-[#0d1117]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center gap-3 sm:gap-6">
        <Link href="/" aria-label="Home" className="group flex shrink-0 items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-blue-400/30 bg-[#0b1220] shadow-[0_0_35px_-14px_rgba(59,130,246,0.95)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-purple-400/60 group-hover:shadow-[0_0_45px_-12px_rgba(168,85,247,0.95)]">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(96,165,250,0.35),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.28),transparent_35%)]" />
            <span className="absolute inset-x-1 top-1 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <span className="absolute -inset-8 animate-spin rounded-full border border-blue-400/10 border-t-cyan-300/40 duration-1000" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.95)]" />
            <span className="relative font-mono text-lg font-black tracking-tight text-cyan-200 transition-colors group-hover:text-purple-200">
              &lt;/&gt;
            </span>
          </span>
          <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-emerald-300 shadow-[0_0_25px_-18px_rgba(52,211,153,0.9)] transition-all group-hover:border-cyan-300/40 group-hover:text-cyan-200 sm:inline">
            AI MODE <span className="text-cyan-300">ON</span>
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto rounded-full border border-gray-800/70 bg-[#0b1220]/70 p-1 shadow-[0_0_35px_-25px_rgba(59,130,246,0.9)] backdrop-blur [scrollbar-width:none] sm:justify-end [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative shrink-0 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-blue-400/10 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.22),0_0_20px_-12px_rgba(34,211,238,0.9)]"
                    : "text-gray-400 hover:bg-gray-800/80 hover:text-gray-100"
                }`}
              >
                {isActive && (
                  <span className="absolute left-1/2 top-1 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
