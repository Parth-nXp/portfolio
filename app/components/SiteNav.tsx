"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Hobbies", href: "/hobbies" }
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-800/60 bg-[#0d1117]/80 px-6 py-4 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link href="/" className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
          PS
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-blue-500/10 text-blue-300"
                    : "text-gray-400 hover:bg-gray-800/70 hover:text-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
