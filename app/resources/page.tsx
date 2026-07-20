"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Binary,
  Bot,
  Boxes,
  BrainCircuit,
  FileText,
  HeartHandshake,
  ImageIcon,
  Layers3,
  Lightbulb,
  Network,
  RefreshCw,
  ScanSearch,
  Sparkles
} from "lucide-react";
import SiteNav from "../components/SiteNav";
import SocialFooter from "../components/SocialFooter";

const papers = [
  {
    title: "TurboQuant",
    subtitle: "Online vector quantization with near-optimal distortion.",
    venue: "arXiv",
    year: 2025,
    href: "/resources/turboquant",
    source: "https://arxiv.org/abs/2504.19874",
    tags: ["Quantization", "ML systems"],
    icon: Binary,
    accent: {
      text: "text-cyan-300",
      icon: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
      border: "hover:border-cyan-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(34,211,238,0.9)]",
      line: "from-cyan-300 via-blue-400 to-transparent",
      tag: "border-cyan-400/15 bg-cyan-400/5 text-cyan-200"
    }
  },
  {
    title: "LLaDA",
    subtitle: "Large language modeling through masked diffusion.",
    venue: "NeurIPS",
    year: 2025,
    href: "/resources/llada",
    source: "https://arxiv.org/abs/2502.09992",
    tags: ["Diffusion LM", "Parallel decoding"],
    icon: RefreshCw,
    accent: {
      text: "text-orange-300",
      icon: "border-orange-300/25 bg-orange-300/10 text-orange-200",
      border: "hover:border-orange-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(251,146,60,0.8)]",
      line: "from-orange-300 via-sky-400 to-transparent",
      tag: "border-orange-300/15 bg-orange-300/5 text-orange-200"
    }
  },
  {
    title: "Sparks of AGI",
    subtitle: "A capability-led investigation of early GPT-4.",
    venue: "Microsoft Research",
    year: 2023,
    href: "/resources/sparks-of-agi",
    source: "https://arxiv.org/abs/2303.12712",
    tags: ["Capability probes", "AGI + limits"],
    icon: Lightbulb,
    accent: {
      text: "text-fuchsia-300",
      icon: "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-200",
      border: "hover:border-fuchsia-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(217,70,239,0.85)]",
      line: "from-cyan-300 via-fuchsia-300 to-amber-200",
      tag: "border-fuchsia-300/15 bg-fuchsia-300/5 text-fuchsia-200"
    }
  },
  {
    title: "GPT-4",
    subtitle: "A measured frontier model with multimodal inputs.",
    venue: "OpenAI",
    year: 2023,
    href: "/resources/gpt-4",
    source: "https://arxiv.org/abs/2303.08774",
    tags: ["Multimodal", "Scaling + safety"],
    icon: Boxes,
    accent: {
      text: "text-emerald-300",
      icon: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
      border: "hover:border-emerald-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(52,211,153,0.85)]",
      line: "from-emerald-300 via-indigo-300 to-rose-300",
      tag: "border-emerald-300/15 bg-emerald-300/5 text-emerald-200"
    }
  },
  {
    title: "InstructGPT",
    subtitle: "Training language models with human feedback.",
    venue: "NeurIPS",
    year: 2022,
    href: "/resources/instructgpt",
    source: "https://arxiv.org/abs/2203.02155",
    tags: ["RLHF", "Instruction tuning"],
    icon: HeartHandshake,
    accent: {
      text: "text-teal-300",
      icon: "border-teal-300/25 bg-teal-300/10 text-teal-200",
      border: "hover:border-teal-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(45,212,191,0.85)]",
      line: "from-teal-300 via-sky-300 to-rose-300",
      tag: "border-teal-300/15 bg-teal-300/5 text-teal-200"
    }
  },
  {
    title: "Vision Transformer (ViT)",
    subtitle: "An image is worth 16 x 16 words.",
    venue: "ICLR",
    year: 2021,
    href: "/resources/vision-transformer",
    source: "https://arxiv.org/abs/2010.11929",
    tags: ["Patch tokens", "Vision"],
    icon: ImageIcon,
    accent: {
      text: "text-yellow-200",
      icon: "border-yellow-200/25 bg-yellow-200/10 text-yellow-100",
      border: "hover:border-yellow-200/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(250,204,21,0.75)]",
      line: "from-yellow-200 via-cyan-300 to-transparent",
      tag: "border-yellow-200/15 bg-yellow-200/5 text-yellow-100"
    }
  },
  {
    title: "GPT-3",
    subtitle: "Language models as few-shot learners in context.",
    venue: "arXiv",
    year: 2020,
    href: "/resources/gpt-3",
    source: "https://arxiv.org/abs/2005.14165",
    tags: ["In-context learning", "Scaling"],
    icon: Layers3,
    accent: {
      text: "text-sky-300",
      icon: "border-sky-300/25 bg-sky-300/10 text-sky-200",
      border: "hover:border-sky-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(56,189,248,0.85)]",
      line: "from-sky-300 via-blue-400 to-amber-200",
      tag: "border-sky-300/15 bg-sky-300/5 text-sky-200"
    }
  },
  {
    title: "BERT",
    subtitle: "Deep bidirectional pre-training for language understanding.",
    venue: "NAACL",
    year: 2019,
    href: "/resources/bert",
    source: "https://arxiv.org/abs/1810.04805",
    tags: ["Encoder", "Pre-training"],
    icon: BrainCircuit,
    accent: {
      text: "text-lime-300",
      icon: "border-lime-300/25 bg-lime-300/10 text-lime-200",
      border: "hover:border-lime-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(190,242,100,0.85)]",
      line: "from-lime-300 via-emerald-400 to-transparent",
      tag: "border-lime-300/15 bg-lime-300/5 text-lime-200"
    }
  },
  {
    title: "GPT-2",
    subtitle: "Language models as unsupervised multitask learners.",
    venue: "OpenAI",
    year: 2019,
    href: "/resources/gpt-2",
    source: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf",
    tags: ["Zero-shot", "Scaling"],
    icon: Sparkles,
    accent: {
      text: "text-fuchsia-300",
      icon: "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-200",
      border: "hover:border-fuchsia-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(232,121,249,0.85)]",
      line: "from-fuchsia-300 via-cyan-300 to-transparent",
      tag: "border-fuchsia-300/15 bg-fuchsia-300/5 text-fuchsia-200"
    }
  },
  {
    title: "GPT-1",
    subtitle: "Generative pre-training for language understanding.",
    venue: "OpenAI",
    year: 2018,
    href: "/resources/gpt-1",
    source: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf",
    tags: ["Causal LM", "Fine-tuning"],
    icon: Bot,
    accent: {
      text: "text-emerald-300",
      icon: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
      border: "hover:border-emerald-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(110,231,183,0.8)]",
      line: "from-emerald-300 via-sky-400 to-transparent",
      tag: "border-emerald-300/15 bg-emerald-300/5 text-emerald-200"
    }
  },
  {
    title: "Attention Is All You Need",
    subtitle: "The Transformer, reconstructed from first principles.",
    venue: "NeurIPS",
    year: 2017,
    href: "/resources/attention-is-all-you-need",
    source: "https://arxiv.org/abs/1706.03762",
    tags: ["Transformer", "Attention"],
    icon: Network,
    accent: {
      text: "text-rose-300",
      icon: "border-rose-300/25 bg-rose-300/10 text-rose-200",
      border: "hover:border-rose-300/50",
      glow: "hover:shadow-[0_20px_70px_-38px_rgba(251,113,133,0.8)]",
      line: "from-rose-300 via-purple-400 to-transparent",
      tag: "border-rose-300/15 bg-rose-300/5 text-rose-200"
    }
  }
].sort((a, b) => b.year - a.year);

const decoderStages = [
  { label: "Architecture", value: "trace the data path", icon: Layers3 },
  { label: "Mathematics", value: "unpack the objective", icon: FileText },
  { label: "Evidence", value: "read results + ablations", icon: ScanSearch }
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] font-sans text-white selection:bg-cyan-500/30">
      <SiteNav />

      <header className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-14 pt-32 sm:px-8 lg:grid-cols-[1fr_0.78fr]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_30px_-15px_rgba(34,211,238,0.9)]">
              <ScanSearch className="text-cyan-300" size={20} />
            </div>
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-cyan-300">Resource Library</span>
          </div>

          <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight md:text-6xl">
            Read the paper.
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              See the system.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-gray-400 md:text-xl">
            Technical deep dives focused on architecture, equations, experiments, and the ideas that survive ablation.
          </p>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative z-10"
        >
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] shadow-[0_0_70px_-35px_rgba(34,211,238,0.75)]">
            <div className="flex items-center justify-between border-b border-gray-800 bg-[#0b1119] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gray-500">paper decoder</span>
            </div>

            <div className="divide-y divide-gray-800">
              {decoderStages.map((stage, index) => {
                const Icon = stage.icon;

                return (
                  <div key={stage.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-100">{stage.label}</p>
                      <p className="mt-1 font-mono text-xs text-gray-500">{stage.value}</p>
                    </div>
                    <span className="font-mono text-xs text-gray-700">0{index + 1}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 border-t border-gray-800 bg-cyan-400/[0.03] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
              paper <ArrowRight size={14} /> working mental model
            </div>
          </div>
        </motion.div>
      </header>

      <section id="paper-shelf" className="relative scroll-mt-24 border-t border-gray-800/60 px-6 py-16 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-400/[0.025] to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">Reading shelf</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Technical paper breakdowns</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {papers.map((paper, index) => {
              const Icon = paper.icon;

              return (
                <motion.article
                  key={paper.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={`group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] transition-all duration-300 hover:-translate-y-1 ${paper.accent.border} ${paper.accent.glow}`}
                >
                  <Link
                    href={paper.href}
                    aria-label={`Open the ${paper.title} breakdown`}
                    className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  >
                    <span className="sr-only">Open the {paper.title} breakdown</span>
                  </Link>
                  <div className={`h-px w-full bg-gradient-to-r ${paper.accent.line}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${paper.accent.icon}`}>
                        <Icon size={23} />
                      </div>
                      <div className="text-right font-mono">
                        <p className={`text-xl font-black ${paper.accent.text}`}>{paper.year}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gray-600">{paper.venue}</p>
                      </div>
                    </div>

                    <div className="mt-7 flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-600">paper 0{index + 1}</p>
                      <h3 className="mt-3 min-h-[3.5rem] text-2xl font-black leading-tight text-white">{paper.title}</h3>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-gray-400">{paper.subtitle}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {paper.tags.map((tag) => (
                          <span key={tag} className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${paper.accent.tag}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
