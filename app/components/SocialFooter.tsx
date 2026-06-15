"use client";

import { motion } from "framer-motion";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/parthnith/",
    logo: "linkedin",
    accent: "from-blue-400 to-cyan-300"
  },
  {
    label: "GitHub",
    href: "https://github.com/Parth-nXp",
    logo: "https://cdn.simpleicons.org/github",
    accent: "from-gray-200 to-blue-300"
  },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=Dw0a4zgAAAAJ&hl=en&authuser=1",
    logo: "https://cdn.simpleicons.org/googlescholar",
    accent: "from-blue-300 to-purple-300"
  },
  {
    label: "ResearchGate",
    href: "https://www.researchgate.net/profile/Parth_Sharma14",
    logo: "https://cdn.simpleicons.org/researchgate",
    accent: "from-emerald-300 to-cyan-300"
  },
  {
    label: "ORCID",
    href: "https://orcid.org/0000-0001-9463-268X",
    logo: "https://cdn.simpleicons.org/orcid",
    accent: "from-lime-300 to-emerald-300"
  }
];

export default function SocialFooter() {
  return (
    <footer className="relative z-10 border-t border-gray-800/50 px-8 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
          Connect
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              whileHover={{ y: -4, scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="group flex h-14 w-14 items-center justify-center rounded-xl border border-gray-800 bg-[#161b22]/70 shadow-[0_0_30px_-18px_rgba(59,130,246,0.8)] backdrop-blur transition-all hover:border-blue-400/50 hover:bg-[#1c2430]"
            >
              {link.logo === "linkedin" ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-blue-400 transition-transform group-hover:scale-110 group-hover:text-cyan-300"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.371 4.267 5.455v6.286ZM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729V22.27C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                </svg>
              ) : (
                <span
                  aria-hidden="true"
                  className={`h-6 w-6 bg-gradient-to-r ${link.accent} transition-transform group-hover:scale-110`}
                  style={{
                    WebkitMask: `url(${link.logo}) center / contain no-repeat`,
                    mask: `url(${link.logo}) center / contain no-repeat`
                  }}
                />
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}
