"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Palette, Quote, Sparkles } from "lucide-react";
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
    <main className="min-h-screen overflow-hidden bg-[#0d1117] pb-24 text-white font-sans selection:bg-pink-500/30">
      <SiteNav />

      <header className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-8 pb-20 pt-36 lg:grid-cols-[1fr_0.75fr]">
        <div className="absolute left-1/2 top-28 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-pink-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute right-0 top-28 h-[420px] w-[420px] rounded-full bg-orange-600/10 blur-[130px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-400/30 bg-pink-500/10 shadow-[0_0_30px_-15px_rgba(236,72,153,0.9)]">
              <Palette className="text-pink-300" size={20} />
            </div>
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-pink-300">Creative Mode</span>
          </div>
          <h1 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            &quot;Every child is an artist.
            <span className="block bg-gradient-to-r from-pink-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
              The problem is how to remain an artist once we grow up.&quot;
            </span>
          </h1>
          <p className="font-mono text-xl italic text-gray-400">
            - Pablo Picasso
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative z-10">
          <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] p-6 shadow-[0_0_70px_-35px_rgba(236,72,153,0.85)]">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-400/10" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-400/10" />
            <div className="relative z-10 rounded-2xl border border-pink-400/20 bg-[#0d1117]/90 p-6 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-pink-400/30 bg-pink-500/10">
                <Camera className="text-pink-300" size={30} />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-pink-300">Art Gallery</p>
              <h2 className="mt-3 text-2xl font-bold">Ink, fandom, memory</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                A personal sketch gallery that keeps the human side visible behind the ML systems.
              </p>
            </div>
            <div className="relative z-10 mt-6 grid grid-cols-3 gap-3">
              {["Sketch", "Cinema", "People"].map((label) => (
                <div key={label} className="rounded-xl border border-gray-800 bg-[#0d1117] p-4 text-center font-mono text-xs font-bold uppercase tracking-widest text-gray-300">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl border-t border-gray-800/50 px-8 py-20">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-pink-400">Gallery</p>
            <h2 className="text-3xl font-bold md:text-4xl">Personal Sketch Archive</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-400/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-pink-300">
            <Sparkles size={16} />
            offline creativity
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <motion.article
              key={item.imageSrc}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] transition-all duration-500 hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-[0_0_45px_-20px_rgba(236,72,153,0.75)]"
            >
              <div className="relative h-[380px] overflow-hidden bg-[#0d1117]">
                <Image
                  src={item.imageSrc}
                  alt={item.source}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.035]"
                />
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.theme} opacity-10 transition-opacity duration-500 group-hover:opacity-15`} />
                <div className="pointer-events-none absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
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
