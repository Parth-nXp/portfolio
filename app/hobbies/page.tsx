"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Palette, Quote } from "lucide-react";
import SiteNav from "../components/SiteNav";
import SocialFooter from "../components/SocialFooter";

const gallery = [
  {
    quote: "The things I do for love",
    source: "Jon Snow (Game of Thrones)",
    imageSrc: "/images/hobbies/hobby-2.jpg",
    theme: "from-slate-600 to-slate-950"
  },
  {
    quote: "I am burdened with glorious purpose",
    source: "Loki",
    imageSrc: "/images/hobbies/hobby-1.jpg",
    theme: "from-emerald-600 to-emerald-950"
  },
  {
    quote: "Where art meets the mystic arts.",
    source: "Dr. Strange",
    imageSrc: "/images/hobbies/hobby-3.jpg",
    theme: "from-orange-600 to-red-950"
  },
  {
    quote: "In the silence between swings, a whispered promise.",
    source: "Peter and Gwen (The Amazing Spider-Man)",
    imageSrc: "/images/hobbies/hobby-4.jpg",
    theme: "from-blue-600 to-red-950"
  },
  {
    quote: "Capturing the emotional turbulence through visual poetry.",
    source: "Personal Art",
    imageSrc: "/images/hobbies/hobby-5.jpg",
    theme: "from-purple-600 to-purple-950"
  },
  {
    quote: "Illustrating the chapters of my academic odyssey with my mentor.",
    source: "Dr. Pyari Mohan Pradhan (Ph.D. Supervisor)",
    imageSrc: "/images/hobbies/hobby-6.jpg",
    theme: "from-cyan-600 to-blue-950"
  }
];

export default function Hobbies() {
  return (
    <main className="min-h-screen bg-[#0d1117] pb-24 text-white font-sans selection:bg-pink-500/30">
      <SiteNav />

      <header className="relative mx-auto max-w-4xl px-8 pb-16 pt-36 text-center">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-600/10 blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <Palette className="mx-auto mb-6 text-pink-400" size={40} />
          <h1 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            &quot;Every child is an artist.
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              The problem is how to remain an artist once we grow up.&quot;
            </span>
          </h1>
          <p className="font-mono text-xl italic text-gray-400">
            - Pablo Picasso
          </p>
        </motion.div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <motion.article
              key={item.imageSrc}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#161b22] transition-all duration-500 hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-[0_0_40px_-18px_rgba(236,72,153,0.5)]"
            >
              <div className="relative h-[360px] overflow-hidden bg-[#0d1117]">
                <Image
                  src={item.imageSrc}
                  alt={item.source}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.theme} opacity-10 transition-opacity duration-500 group-hover:opacity-15`} />
              </div>

              <div className="border-t border-gray-800 bg-[#10151d] p-6">
                <Quote className="mb-3 text-pink-400 opacity-70 transition-opacity duration-300 group-hover:opacity-100" size={22} />
                <h2 className="mb-2 text-lg font-bold leading-snug text-white">
                  &quot;{item.quote}&quot;
                </h2>
                <p className="font-mono text-sm text-gray-400">
                  - {item.source}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
