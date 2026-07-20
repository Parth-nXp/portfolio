import Image from "next/image";
import Link from "next/link";
import katex from "katex";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  Clock3,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  Route,
  Sigma,
  Timer,
  TriangleAlert,
  Zap
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  arxiv: "https://arxiv.org/abs/1706.03762",
  html: "https://arxiv.org/html/1706.03762v7",
  pdf: "https://arxiv.org/pdf/1706.03762v7",
  doi: "https://doi.org/10.48550/arXiv.1706.03762",
  code: "https://github.com/tensorflow/tensor2tensor"
};

export const metadata: Metadata = {
  title: "Attention Is All You Need: A Complete Transformer Deep Dive",
  description:
    "A visual, equation-first reconstruction of the original Transformer: attention, multi-head projections, masking, positional encoding, training, ablations, and results."
};

const sections = [
  ["thesis", "Thesis"],
  ["architecture", "Architecture"],
  ["attention", "Attention"],
  ["heads", "Multi-head"],
  ["positions", "Position + FFN"],
  ["why", "Why it works"],
  ["training", "Training"],
  ["results", "Results"],
  ["maps", "Attention maps"],
  ["limits", "Limits"]
];

const complexityRows = [
  {
    type: "Self-attention",
    complexity: "O(n^2d)",
    sequential: "O(1)",
    path: "O(1)",
    note: "Every token can interact directly with every other token."
  },
  {
    type: "Recurrent",
    complexity: "O(nd^2)",
    sequential: "O(n)",
    path: "O(n)",
    note: "State must move through the sequence one position at a time."
  },
  {
    type: "Convolutional",
    complexity: "O(knd^2)",
    sequential: "O(1)",
    path: "O(log_k n)",
    note: "Long-range communication requires depth or dilation."
  },
  {
    type: "Restricted attention",
    complexity: "O(rnd)",
    sequential: "O(1)",
    path: "O(n/r)",
    note: "Lower cost trades away the one-hop global path."
  }
];

const attentionModes = [
  {
    label: "encoder self-attention",
    query: "encoder state",
    keys: "encoder state",
    values: "encoder state",
    mask: "none",
    purpose: "Build a contextual representation of every input token."
  },
  {
    label: "decoder masked self-attention",
    query: "decoder state",
    keys: "decoder state",
    values: "decoder state",
    mask: "causal",
    purpose: "Use only the target prefix available before the current position."
  },
  {
    label: "encoder-decoder attention",
    query: "decoder state",
    keys: "encoder output",
    values: "encoder output",
    mask: "none",
    purpose: "Retrieve source information needed for the next target token."
  }
];

const translationRows = [
  ["ByteNet", "single", "23.75", "-", "-"],
  ["Deep-Att + PosUnk", "single", "-", "39.20", "- / 1.0e20"],
  ["GNMT + RL", "single", "24.60", "39.92", "2.3e19 / 1.4e20"],
  ["ConvS2S", "single", "25.16", "40.46", "9.6e18 / 1.5e20"],
  ["MoE", "single", "26.03", "40.56", "2.0e19 / 1.2e20"],
  ["Deep-Att + PosUnk", "ensemble", "-", "40.40", "- / 8.0e20"],
  ["GNMT + RL", "ensemble", "26.30", "41.16", "1.8e20 / 1.1e21"],
  ["ConvS2S", "ensemble", "26.36", "41.29", "7.7e19 / 1.2e21"],
  ["Transformer base", "single", "27.30", "38.10", "3.3e18 / -"],
  ["Transformer big", "single", "28.40", "41.80", "2.3e19 / -"]
];

const ablations = [
  {
    title: "One head is not enough",
    metric: "24.9 BLEU",
    detail: "A single 512-dimensional head trails the base eight-head configuration by 0.9 development BLEU."
  },
  {
    title: "Too many heads can hurt",
    metric: "25.4 BLEU",
    detail: "Thirty-two 16-dimensional heads underperform the eight- and sixteen-head settings."
  },
  {
    title: "Wider feed-forward wins",
    metric: "26.2 BLEU",
    detail: "Increasing d_ff from 2048 to 4096 improves development BLEU while raising parameters from 65M to 90M."
  },
  {
    title: "Position choice nearly ties",
    metric: "25.7 vs 25.8",
    detail: "Learned positional embeddings and fixed sinusoids are almost identical in the reported ablation."
  }
];

const figures = {
  1: { src: "/images/resources/transformer/figure-1.png", width: 1520, height: 2239 },
  2: { src: "/images/resources/transformer/figure-2.png", width: 1215, height: 786 },
  3: { src: "/images/resources/transformer/figure-3.png", width: 1299, height: 951 },
  4: { src: "/images/resources/transformer/figure-4.png", width: 1299, height: 1605 },
  5: { src: "/images/resources/transformer/figure-5.png", width: 1299, height: 1740 }
};

function DisplayMath({ formula, className = "" }: { formula: string; className?: string }) {
  return (
    <div
      className={"min-w-max text-lg text-current md:text-xl [&_.katex-display]:m-0 " + className}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formula, {
          displayMode: true,
          output: "htmlAndMathml",
          strict: false,
          throwOnError: false
        })
      }}
    />
  );
}

function InlineMath({ formula, className = "" }: { formula: string; className?: string }) {
  return (
    <span
      className={"inline-block text-current " + className}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formula, {
          displayMode: false,
          output: "htmlAndMathml",
          strict: false,
          throwOnError: false
        })
      }}
    />
  );
}

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="mb-9 min-w-0 max-w-4xl">
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-rose-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({
  label,
  formula,
  note,
  tone = "rose"
}: {
  label: string;
  formula: string;
  note?: ReactNode;
  tone?: "rose" | "cyan" | "yellow";
}) {
  const tones = {
    rose: "border-rose-300/20 bg-rose-300/5 text-rose-50",
    cyan: "border-cyan-300/20 bg-cyan-300/5 text-cyan-50",
    yellow: "border-yellow-200/20 bg-yellow-200/5 text-yellow-50"
  };

  return (
    <div className={"min-w-0 overflow-hidden rounded-2xl border " + tones[tone]}>
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </div>
      <div className="overflow-x-auto px-5 py-7">
        <DisplayMath formula={formula} />
        {note && <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400">{note}</p>}
      </div>
    </div>
  );
}

function FigureCard({
  image,
  title,
  caption,
  className = "",
  imageClassName = ""
}: {
  image: keyof typeof figures;
  title: string;
  caption: ReactNode;
  className?: string;
  imageClassName?: string;
}) {
  const figure = figures[image];

  return (
    <figure className={"min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722] " + className}>
      <div className="flex min-h-52 items-center justify-center bg-white p-4 sm:p-6">
        <Image
          src={figure.src}
          alt={title}
          width={figure.width}
          height={figure.height}
          className={"h-auto max-h-[860px] w-full object-contain " + imageClassName}
        />
      </div>
      <figcaption className="border-t border-slate-800 p-5">
        <p className="font-bold text-slate-100">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{caption}</p>
      </figcaption>
    </figure>
  );
}

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-rose-300 transition-colors hover:text-white"
    >
      {children} <ExternalLink size={13} />
    </a>
  );
}

function AttentionConsole() {
  const tokens = [
    { token: "The", weight: 7, tone: "bg-cyan-300" },
    { token: "animal", weight: 18, tone: "bg-rose-300" },
    { token: "didn't", weight: 5, tone: "bg-cyan-300" },
    { token: "cross", weight: 10, tone: "bg-yellow-200" },
    { token: "street", weight: 8, tone: "bg-cyan-300" },
    { token: "because", weight: 12, tone: "bg-yellow-200" },
    { token: "it", weight: 34, tone: "bg-rose-300" },
    { token: "was tired", weight: 6, tone: "bg-cyan-300" }
  ];

  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-rose-300/20 bg-[#101722] shadow-[0_0_90px_-45px_rgba(251,113,133,0.85)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-300 shadow-[0_0_12px_rgba(253,164,175,0.9)]" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rose-200">
            attention routing console
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-600">head 03 / 08</span>
      </div>
      <div className="relative p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="relative">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">active query</p>
              <p className="mt-1 text-2xl font-black text-white">Which context matters?</p>
            </div>
            <Network className="shrink-0 text-rose-300" size={28} />
          </div>
          <div className="mt-7 space-y-3">
            {tokens.map((item) => (
              <div key={item.token} className="grid grid-cols-[70px_1fr_34px] items-center gap-3">
                <span className="truncate font-mono text-[10px] text-slate-500">{item.token}</span>
                <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                  <div className={"h-full rounded-full " + item.tone} style={{ width: String(item.weight * 2.65) + "%" }} />
                </div>
                <span className="text-right font-mono text-[10px] text-slate-600">{item.weight}</span>
              </div>
            ))}
          </div>
          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-slate-800 pt-5">
            {[
              ["query", "1 x 64"],
              ["scores", "1 x n"],
              ["output", "1 x 64"]
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</p>
                <p className="mt-1 truncate font-mono text-xs font-bold text-rose-200">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CausalMask() {
  const size = 8;

  return (
    <div className="grid grid-cols-8 gap-1" aria-label="Lower-triangular causal attention mask">
      {Array.from({ length: size * size }, (_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const allowed = col <= row;
        return (
          <div
            key={index}
            className={
              "aspect-square rounded-sm border " +
              (allowed
                ? "border-cyan-300/20 bg-cyan-300/55"
                : "border-rose-300/10 bg-rose-300/5")
            }
            title={allowed ? "visible" : "masked"}
          />
        );
      })}
    </div>
  );
}

function PositionGrid() {
  const positions = Array.from({ length: 16 }, (_, index) => index);
  const dimensions = [0, 1, 64, 65, 128, 129, 256, 257];

  return (
    <div className="min-w-[620px]">
      <div className="mb-2 grid grid-cols-[52px_repeat(16,minmax(0,1fr))] gap-1">
        <span />
        {positions.map((position) => (
          <span key={position} className="text-center font-mono text-[8px] text-slate-700">{position}</span>
        ))}
      </div>
      <div className="space-y-1">
        {dimensions.map((dimension) => (
          <div key={dimension} className="grid grid-cols-[52px_repeat(16,minmax(0,1fr))] gap-1">
            <span className="font-mono text-[9px] text-slate-600">dim {dimension}</span>
            {positions.map((position) => {
              const denominator = Math.pow(10000, (2 * Math.floor(dimension / 2)) / 512);
              const angle = position / denominator;
              const value = dimension % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
              const alpha = 0.12 + Math.abs(value) * 0.72;
              const background =
                value >= 0
                  ? "rgba(103, 232, 249, " + alpha.toFixed(3) + ")"
                  : "rgba(253, 164, 175, " + alpha.toFixed(3) + ")";
              return <span key={position} className="aspect-square rounded-sm" style={{ background }} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningRateChart() {
  const steps = [1, 500, 1000, 2000, 3000, 4000, 6000, 8000, 12000, 20000];
  const warmup = 4000;
  const model = 512;
  const values = steps.map((step) =>
    Math.pow(model, -0.5) * Math.min(Math.pow(step, -0.5), step * Math.pow(warmup, -1.5))
  );
  const max = Math.max(...values);
  const points = values
    .map((value, index) => {
      const x = 24 + (index / (values.length - 1)) * 552;
      const y = 170 - (value / max) * 132;
      return String(x) + "," + String(y);
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Noam schedule</p>
          <p className="mt-1 text-sm text-slate-500">linear warmup, inverse-square-root decay</p>
        </div>
        <Activity className="text-cyan-300" size={22} />
      </div>
      <svg viewBox="0 0 600 200" className="mt-5 h-auto w-full" role="img" aria-label="Transformer learning rate schedule">
        <line x1="24" y1="170" x2="576" y2="170" stroke="rgba(148,163,184,0.2)" />
        <line x1="24" y1="38" x2="24" y2="170" stroke="rgba(148,163,184,0.2)" />
        <line x1="269" y1="30" x2="269" y2="176" stroke="rgba(253,164,175,0.35)" strokeDasharray="5 5" />
        <polyline points={points} fill="none" stroke="#67e8f9" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="269" cy="38" r="6" fill="#fda4af" />
        <text x="276" y="29" fill="#fda4af" fontSize="10" fontFamily="monospace">warmup 4000</text>
        <text x="24" y="192" fill="#475569" fontSize="10" fontFamily="monospace">step 1</text>
        <text x="525" y="192" fill="#475569" fontSize="10" fontFamily="monospace">20k</text>
      </svg>
    </div>
  );
}

export default function AttentionPaperPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0d1117] font-sans text-white selection:bg-rose-300/30">
      <SiteNav />

      <header className="relative border-b border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(251,113,133,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/70 to-cyan-300/50" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 md:pb-24 md:pt-36">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-rose-300"
          >
            <ArrowLeft size={15} /> back to resources
          </Link>

          <div className="mt-9 grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-rose-300/25 bg-rose-300/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rose-300">
                  complete paper reconstruction
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">arXiv:1706.03762v7</span>
              </div>

              <h1 className="mt-7 text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl md:text-7xl">
                Attention Is
                <span className="block text-rose-300">All You Need.</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                The original Transformer, rebuilt from the tensor shapes up.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">
                Follow one sequence through embeddings, positional signals, six encoder and decoder layers,
                scaled dot-product attention, eight parallel heads, training, ablations, and the results that
                changed sequence modeling.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={links.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-300 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#16080c] transition-colors hover:bg-rose-200"
                >
                  read original PDF <BookOpen size={16} />
                </a>
                <a
                  href={links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#101722] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-cyan-300/40 hover:text-white"
                >
                  official HTML <ExternalLink size={15} />
                </a>
              </div>

              <p className="mt-6 max-w-3xl font-mono text-xs leading-6 text-slate-600">
                Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones,
                Aidan N. Gomez, Lukasz Kaiser, and Illia Polosukhin
              </p>
            </div>

            <AttentionConsole />
          </div>

          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 lg:grid-cols-4">
            {[
              ["06 + 06", "stack depth", "encoder + decoder"],
              ["08", "attention heads", "64 dimensions each"],
              ["512", "model width", "2,048 FFN width"],
              ["28.4", "EN-DE BLEU", "Transformer big"]
            ].map(([value, label, detail]) => (
              <div key={label} className="min-w-0 bg-[#101722] p-5">
                <p className="font-mono text-2xl font-black text-rose-300 md:text-3xl">{value}</p>
                <p className="mt-2 text-sm font-bold text-slate-200">{label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky top-[76px] z-40 border-y border-slate-800/80 bg-[#0d1117]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map(([id, label], index) => (
            <a
              key={id}
              href={"#" + id}
              className="shrink-0 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors hover:bg-rose-300/8 hover:text-rose-300"
            >
              <span className="mr-2 text-slate-700">{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="thesis" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="01 / the thesis"
            title="Remove the recurrence. Keep the sequence."
            description={
              <>
                Before the Transformer, leading sequence-to-sequence systems stepped through tokens with recurrent
                state or built context through convolutional stacks. The paper asks a sharper question: can attention
                itself perform the entire information-routing job?
              </>
            }
          />

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Clock3,
                label: "recurrent bottleneck",
                title: "One step waits for the last",
                text: "An RNN computes h_t from h_(t-1). Training examples can be batched, but positions inside one sequence remain sequential."
              },
              {
                icon: Layers3,
                label: "convolutional path",
                title: "Distance requires depth",
                text: "A finite kernel sees locally. Connecting distant positions requires multiple layers, dilation, or a kernel spanning the sequence."
              },
              {
                icon: Network,
                label: "attention route",
                title: "Every token gets a direct edge",
                text: "Self-attention computes all pairwise compatibilities in one layer, making the path between positions constant."
              }
            ].map(({ icon: Icon, label, title, text }) => (
              <article key={title} className="border-t border-slate-700 bg-[#101722] p-6">
                <div className="flex items-center justify-between">
                  <Icon className="text-rose-300" size={24} />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-700">{label}</span>
                </div>
                <h3 className="mt-8 text-xl font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
            <div className="border-l-2 border-rose-300 bg-rose-300/5 px-6 py-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rose-300">paper claim</p>
              <p className="mt-4 text-xl font-bold leading-9 text-slate-200">
                Sequence order does not require sequential computation. Put every position in a shared vector space,
                inject position explicitly, and let learned attention decide which positions exchange information.
              </p>
            </div>
            <div className="border border-slate-800 bg-[#101722] p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">what was actually new</p>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Attention already existed. The decisive architectural move was making self-attention the primary
                sequence mixer, eliminating sequence-aligned recurrence and convolution from both encoder and decoder.
              </p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="grid gap-px bg-slate-800 md:grid-cols-5">
              {["tokens", "embeddings + position", "attention routing", "per-token FFN", "next-token probabilities"].map((step, index) => (
                <div key={step} className="relative bg-[#101722] p-5">
                  <span className="font-mono text-[10px] text-slate-700">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">{step}</p>
                  {index < 4 && <ChevronRight className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-rose-300 md:block" size={17} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="02 / architecture"
            title="Two six-layer towers, three attention routes."
            description="The encoder transforms the source sequence into contextual memory. The autoregressive decoder consumes the shifted target prefix, attends to that memory, and produces a distribution for the next token."
          />

          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <FigureCard
              image={1}
              title="Figure 1 · Original Transformer architecture"
              caption="The left tower is the encoder; the right tower is the decoder. N = 6 in both stacks. Every attention or feed-forward sublayer is wrapped by a residual connection followed by layer normalization."
            />

            <div className="space-y-5">
              <article className="rounded-3xl border border-cyan-300/20 bg-[#101722] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">encoder / repeated 6x</p>
                    <h3 className="mt-2 text-2xl font-black">Source becomes memory</h3>
                  </div>
                  <Database className="text-cyan-300" size={26} />
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ["01", "Multi-head self-attention", "Q, K, and V all come from the current encoder representation."],
                    ["02", "Add and layer norm", "The paper uses post-norm: normalize x + Sublayer(x)."],
                    ["03", "Position-wise feed-forward", "The same 512 -> 2048 -> 512 MLP is applied independently to every position."],
                    ["04", "Add and layer norm", "A second residual path preserves and stabilizes the token representation."]
                  ].map(([id, title, text]) => (
                    <div key={id} className="grid grid-cols-[34px_1fr] gap-3 border-t border-slate-800 pt-3 first:border-0 first:pt-0">
                      <span className="font-mono text-[10px] text-cyan-300">{id}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-200">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-rose-300/20 bg-[#101722] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-rose-300">decoder / repeated 6x</p>
                    <h3 className="mt-2 text-2xl font-black">Prefix becomes next token</h3>
                  </div>
                  <BrainCircuit className="text-rose-300" size={26} />
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ["01", "Masked self-attention", "Target positions can see themselves and earlier tokens, never future tokens."],
                    ["02", "Encoder-decoder attention", "Decoder states provide Q; final encoder states provide K and V."],
                    ["03", "Position-wise feed-forward", "Each target position receives the same two-layer nonlinear transformation."],
                    ["04", "Linear plus softmax", "The final decoder state becomes a probability distribution over the target vocabulary."]
                  ].map(([id, title, text]) => (
                    <div key={id} className="grid grid-cols-[34px_1fr] gap-3 border-t border-slate-800 pt-3 first:border-0 first:pt-0">
                      <span className="font-mono text-[10px] text-rose-300">{id}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-200">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <Equation
                label="original post-norm residual wrapper"
                formula={"\\operatorname{LayerNorm}\\!\\left(\\mathbf{x}+\\operatorname{Sublayer}(\\mathbf{x})\\right)"}
                note="Dropout is applied to the sublayer output before residual addition and normalization. All sublayers preserve the model width so the addition is shape-compatible."
                tone="yellow"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["d_model", "512", "base hidden width"],
              ["N", "6", "layers per tower"],
              ["d_ff", "2,048", "FFN inner width"],
              ["parameters", "65M", "base model"]
            ].map(([symbol, value, note]) => (
              <div key={symbol} className="bg-[#101722] p-5">
                <p className="font-mono text-[10px] text-slate-600">{symbol}</p>
                <p className="mt-2 font-mono text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="attention" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="03 / scaled dot-product attention"
            title="Score, scale, normalize, retrieve."
            description="Attention converts each query into a weighted mixture of values. Keys determine compatibility; values carry the content that will be retrieved."
          />

          <Equation
            label="the central equation"
            formula={"\\operatorname{Attention}(\\mathbf{Q},\\mathbf{K},\\mathbf{V})=\\operatorname{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^{\\mathsf T}}{\\sqrt{d_k}}+\\mathbf{M}\\right)\\mathbf{V}"}
            note={
              <>
                <InlineMath formula={"\\mathbf{M}"} /> is zero when a connection is allowed and
                <InlineMath formula={"-\\infty"} className="ml-1" /> when it is forbidden. Encoder self-attention
                omits the causal mask; decoder self-attention uses it.
              </>
            }
          />

          <div className="mt-7 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-3 lg:grid-cols-6">
            {[
              ["01", "project", "Q = XW_Q, K = XW_K, V = XW_V"],
              ["02", "compare", "QK^T creates every query-key score"],
              ["03", "scale", "divide logits by sqrt(d_k)"],
              ["04", "mask", "block illegal decoder connections"],
              ["05", "normalize", "softmax each query row"],
              ["06", "retrieve", "weighted sum A V"]
            ].map(([id, title, text]) => (
              <div key={id} className="min-w-0 bg-[#101722] p-5">
                <span className="font-mono text-[10px] font-black text-rose-300">{id}</span>
                <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-200">{title}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
            <FigureCard
              image={2}
              title="Figure 2 · Scaled dot-product and multi-head attention"
              caption="The left path is matrix multiplication, optional masking, scaling, softmax, and value mixing. The right path performs several learned projections and attention operations in parallel before concatenation."
            />

            <div className="space-y-6">
              <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-6">
                <div className="flex items-center gap-3">
                  <Sigma className="text-cyan-300" size={23} />
                  <h3 className="text-xl font-black">Why divide by sqrt(d_k)?</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Assume query and key components are independent with mean zero and variance one. Their dot product
                  sums <InlineMath formula={"d_k"} /> products, so its variance grows with <InlineMath formula={"d_k"} />.
                  Large logits make softmax extremely sharp and gradients very small.
                </p>
                <div className="mt-5 overflow-x-auto border-t border-cyan-300/15 pt-5 text-cyan-50">
                  <DisplayMath formula={"\\operatorname{Var}(\\mathbf{q}^{\\mathsf T}\\mathbf{k})=d_k\\quad\\Longrightarrow\\quad\\operatorname{Var}\\!\\left(\\frac{\\mathbf{q}^{\\mathsf T}\\mathbf{k}}{\\sqrt{d_k}}\\right)=1"} className="text-base" />
                </div>
              </article>

              <article className="rounded-3xl border border-rose-300/20 bg-[#101722] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">causal mask</p>
                    <h3 className="mt-2 text-xl font-black">Future tokens are invisible</h3>
                  </div>
                  <Eye className="text-rose-300" size={22} />
                </div>
                <div className="mt-6">
                  <CausalMask />
                </div>
                <div className="mt-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-slate-600">
                  <span>query position downward</span>
                  <span>key position rightward</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  The lower triangle remains visible. Upper-triangle logits become negative infinity before softmax,
                  giving them exactly zero probability.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">single-head tensor ledger</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">tensor</th>
                    <th className="px-5 py-4">shape</th>
                    <th className="px-5 py-4">meaning</th>
                    <th className="px-5 py-4">operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    ["X", "n x 512", "token states", "input to the head"],
                    ["Q, K", "n x 64", "queries and addressing keys", "learned linear projections"],
                    ["V", "n x 64", "retrievable content", "learned linear projection"],
                    ["QK^T", "n x n", "pairwise compatibility logits", "batched matrix multiply"],
                    ["A", "n x n", "row-normalized attention weights", "mask + softmax"],
                    ["AV", "n x 64", "contextual head output", "weighted value mixture"]
                  ].map(([tensor, shape, meaning, operation]) => (
                    <tr key={tensor} className="hover:bg-rose-300/[0.03]">
                      <td className="px-5 py-4 font-mono font-black text-rose-300">{tensor}</td>
                      <td className="px-5 py-4 font-mono text-cyan-300">{shape}</td>
                      <td className="px-5 py-4 text-slate-400">{meaning}</td>
                      <td className="px-5 py-4 text-slate-500">{operation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="heads" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="04 / multi-head attention"
            title="Split the space, route in parallel, merge."
            description="A single attention map compresses many relationships into one weighted average. Multi-head attention gives the model separate learned subspaces in which different compatibility patterns can coexist."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Equation
              label="one projected attention head"
              formula={"\\operatorname{head}_i=\\operatorname{Attention}\\!\\left(\\mathbf{Q}\\mathbf{W}_i^Q,\\mathbf{K}\\mathbf{W}_i^K,\\mathbf{V}\\mathbf{W}_i^V\\right)"}
              note="Each head owns independent Q, K, and V projection matrices. In the base model, every projected query, key, and value has width 64."
              tone="cyan"
            />
            <Equation
              label="parallel heads merged back to model width"
              formula={"\\operatorname{MultiHead}(\\mathbf{Q},\\mathbf{K},\\mathbf{V})=\\operatorname{Concat}(\\operatorname{head}_1,\\ldots,\\operatorname{head}_h)\\mathbf{W}^O"}
              note="Eight 64-dimensional outputs concatenate to 512 dimensions, then W^O mixes them into the residual stream."
            />
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["h", "8", "parallel heads"],
              ["d_k", "64", "query / key width"],
              ["d_v", "64", "value width"],
              ["h x d_v", "512", "concatenated width"]
            ].map(([symbol, value, note]) => (
              <div key={symbol} className="bg-[#101722] p-6">
                <p className="font-mono text-[10px] text-slate-600">{symbol}</p>
                <p className="mt-2 font-mono text-3xl font-black text-rose-300">{value}</p>
                <p className="mt-2 text-xs text-slate-500">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {attentionModes.map((mode, index) => (
              <article key={mode.label} className="grid gap-5 rounded-2xl border border-slate-800 bg-[#101722] p-5 lg:grid-cols-[180px_repeat(4,minmax(0,1fr))] lg:items-center">
                <div>
                  <span className="font-mono text-[10px] text-rose-300">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-sm font-black text-white">{mode.label}</h3>
                </div>
                {[
                  ["Q", mode.query],
                  ["K / V", mode.keys],
                  ["mask", mode.mask]
                ].map(([label, value]) => (
                  <div key={label} className="border-l border-slate-800 pl-4">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</p>
                    <p className="mt-1 text-xs font-bold text-slate-300">{value}</p>
                  </div>
                ))}
                <p className="text-sm leading-6 text-slate-500">{mode.purpose}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">cost accounting</p>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Splitting into eight heads does not multiply the main attention cost by eight because each head is
                one-eighth of the model width. The aggregate projected width remains
                <InlineMath formula={"h d_v=d_{\\mathrm{model}}"} className="ml-1 text-cyan-200" />.
              </p>
            </div>
            <div className="rounded-3xl border border-yellow-200/20 bg-yellow-200/5 p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-yellow-100">what heads buy</p>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Separate projection spaces can emphasize position, syntax, agreement, or token identity differently.
                The appendix visualizations show that some heads become sharp and specialized while others stay broad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="positions" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="05 / order and per-token computation"
            title="Attention mixes tokens. Position tells it where they are."
            description="Without recurrence or convolution, token order is not built into the operation. The paper adds fixed sinusoids to embeddings, then alternates cross-token attention with an identical feed-forward network at each position."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Equation
              label="even positional dimensions"
              formula={"\\operatorname{PE}_{(pos,2i)}=\\sin\\!\\left(\\frac{pos}{10000^{2i/d_{\\mathrm{model}}}}\\right)"}
              note="Each even dimension carries a sine wave at a different wavelength."
              tone="cyan"
            />
            <Equation
              label="odd positional dimensions"
              formula={"\\operatorname{PE}_{(pos,2i+1)}=\\cos\\!\\left(\\frac{pos}{10000^{2i/d_{\\mathrm{model}}}}\\right)"}
              note="The corresponding odd dimension uses cosine, giving each frequency a phase-shifted pair."
              tone="rose"
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">positional signal microscope</p>
                <h3 className="mt-2 text-xl font-black">Different dimensions oscillate at different rates</h3>
              </div>
              <span className="font-mono text-[10px] text-slate-600">cyan positive / rose negative</span>
            </div>
            <div className="overflow-x-auto p-6">
              <PositionGrid />
            </div>
            <div className="border-t border-slate-800 p-5 text-sm leading-7 text-slate-500">
              The wavelength range forms a geometric progression from <InlineMath formula={"2\\pi"} /> to
              <InlineMath formula={"10000\\cdot2\\pi"} className="ml-1" />. The authors chose this representation
              because fixed offsets can be expressed as linear transformations of the signal and because fixed
              sinusoids may extrapolate beyond training lengths.
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
            <Equation
              label="position-wise feed-forward network"
              formula={"\\operatorname{FFN}(\\mathbf{x})=\\max\\!\\left(0,\\mathbf{x}\\mathbf{W}_1+\\mathbf{b}_1\\right)\\mathbf{W}_2+\\mathbf{b}_2"}
              note={
                <>
                  The transformation is shared across positions inside one layer but not across layers. It expands
                  <InlineMath formula={"512\\rightarrow2048"} className="mx-1" /> through ReLU and projects back
                  <InlineMath formula={"2048\\rightarrow512"} className="ml-1" />.
                </>
              }
              tone="yellow"
            />
            <article className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">division of labor</p>
              <div className="mt-5 space-y-5">
                <div className="flex gap-4">
                  <Network className="mt-0.5 shrink-0 text-rose-300" size={22} />
                  <div>
                    <p className="font-bold text-slate-200">Attention communicates</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Information moves between token positions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Cpu className="mt-0.5 shrink-0 text-cyan-300" size={22} />
                  <div>
                    <p className="font-bold text-slate-200">FFN computes locally</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Each position transforms its mixed representation independently.</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 md:grid-cols-3">
            {[
              ["embedding scale", "sqrt(d_model)", "Multiply token embeddings before adding position."],
              ["weight tying", "3-way shared", "Source embedding, target embedding, and pre-softmax weights share one matrix."],
              ["dropout", "0.1 base", "Applied to position sums and sublayer outputs."]
            ].map(([label, value, detail]) => (
              <div key={label} className="bg-[#101722] p-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">{label}</p>
                <p className="mt-2 text-lg font-black text-rose-300">{value}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="06 / why self-attention"
            title="The win is parallelism plus a one-hop path."
            description="The paper evaluates layer types using three criteria: arithmetic complexity, the minimum number of sequential operations, and the maximum path length between positions."
          />

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">layer type</th>
                    <th className="px-5 py-4">complexity / layer</th>
                    <th className="px-5 py-4">sequential ops</th>
                    <th className="px-5 py-4">maximum path</th>
                    <th className="px-5 py-4">interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {complexityRows.map((row, index) => (
                    <tr key={row.type} className={index === 0 ? "bg-rose-300/[0.05]" : "hover:bg-white/[0.02]"}>
                      <td className="px-5 py-4 font-bold text-slate-200">{row.type}</td>
                      <td className="px-5 py-4 font-mono text-cyan-300">{row.complexity}</td>
                      <td className="px-5 py-4 font-mono text-rose-300">{row.sequential}</td>
                      <td className="px-5 py-4 font-mono text-yellow-100">{row.path}</td>
                      <td className="px-5 py-4 text-slate-500">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Parallel training",
                text: "All positions in a layer can be computed together with dense matrix multiplications. There is no hidden-state dependency from token t-1 to t."
              },
              {
                icon: Route,
                title: "Constant path length",
                text: "A token can use information from any other token through one attention edge instead of propagating it across n recurrent steps."
              },
              {
                icon: Gauge,
                title: "Favorable sentence regime",
                text: "Self-attention is cheaper than recurrence when sequence length n is smaller than representation width d, which held for the paper's translation setup."
              }
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="border-t border-rose-300/35 bg-[#101722] p-6">
                <Icon className="text-rose-300" size={24} />
                <h3 className="mt-7 text-xl font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">where attention wins</p>
              <div className="mt-5 overflow-x-auto text-cyan-50">
                <DisplayMath formula={"O(n^2d)<O(nd^2)\\quad\\Longleftrightarrow\\quad n<d"} />
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-400">
                For the base model, <InlineMath formula={"d=512"} />. Sentence lengths were commonly below that width,
                making full attention computationally attractive.
              </p>
            </div>
            <div className="rounded-3xl border border-rose-300/20 bg-rose-300/5 p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-rose-300">where cost returns</p>
              <p className="mt-5 text-lg font-bold leading-8 text-slate-200">
                The <InlineMath formula={"n\\times n"} /> attention matrix grows quadratically with sequence length.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                The paper already identifies restricted local attention as a route to <InlineMath formula={"O(rnd)"} />,
                accepting a longer <InlineMath formula={"O(n/r)"} /> communication path.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="training" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="07 / training recipe"
            title="The architecture and the schedule shipped together."
            description="The reported result depends on more than attention: large token batches, Adam with unusual beta values, four thousand warmup steps, residual dropout, label smoothing, and checkpoint averaging."
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["4.5M", "EN-DE pairs", "37K shared BPE vocabulary"],
              ["36M", "EN-FR pairs", "32K word-piece vocabulary"],
              ["25K + 25K", "tokens / batch", "approx. source + target"],
              ["8 x P100", "one machine", "paper training hardware"]
            ].map(([value, label, detail]) => (
              <div key={label} className="bg-[#101722] p-6">
                <p className="font-mono text-2xl font-black text-rose-300">{value}</p>
                <p className="mt-2 text-sm font-bold text-slate-200">{label}</p>
                <p className="mt-1 text-xs text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="space-y-6">
              <Equation
                label="learning-rate schedule"
                formula={"\\operatorname{lr}=d_{\\mathrm{model}}^{-1/2}\\min\\!\\left(\\operatorname{step}^{-1/2},\\operatorname{step}\\cdot\\operatorname{warmup}^{-3/2}\\right)"}
                note={
                  <>
                    The paper uses <InlineMath formula={"\\operatorname{warmup}=4000"} />. Learning rate rises linearly
                    during warmup and then decays proportionally to the inverse square root of the step number.
                  </>
                }
                tone="cyan"
              />
              <LearningRateChart />
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-rose-300">optimizer and regularization</p>
              <div className="mt-6 space-y-5">
                {[
                  ["Adam", "beta_1 = 0.9, beta_2 = 0.98, epsilon = 1e-9"],
                  ["Residual dropout", "0.1 for base; applied before residual addition and to embedding + position sums"],
                  ["Label smoothing", "epsilon_ls = 0.1; worse perplexity, better accuracy and BLEU"],
                  ["Checkpoint averaging", "last 5 checkpoints for base, last 20 for big"],
                  ["Beam search", "beam 4, length penalty alpha = 0.6, maximum input length + 50"]
                ].map(([title, detail]) => (
                  <div key={title} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                    <p className="font-bold text-slate-200">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-cyan-300/20 bg-[#101722] p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-cyan-300">BASE</span>
                <Timer className="text-cyan-300" size={23} />
              </div>
              <p className="mt-6 text-3xl font-black">12 hours</p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-800 pt-5">
                {[
                  ["100K", "steps"],
                  ["0.4 s", "per step"],
                  ["65M", "params"]
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-mono text-sm font-black text-cyan-300">{value}</p>
                    <p className="mt-1 text-[10px] text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-3xl border border-rose-300/20 bg-[#101722] p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-rose-300">BIG</span>
                <Timer className="text-rose-300" size={23} />
              </div>
              <p className="mt-6 text-3xl font-black">3.5 days</p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-800 pt-5">
                {[
                  ["300K", "steps"],
                  ["1.0 s", "per step"],
                  ["213M", "params"]
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-mono text-sm font-black text-rose-300">{value}</p>
                    <p className="mt-1 text-[10px] text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="08 / results and ablations"
            title="Better translation, less training cost."
            description="The big Transformer set new single-model translation results in the paper's comparisons, while the base model already exceeded the listed ensemble baselines on English-to-German at much lower estimated training FLOPs."
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-3">
            {[
              ["28.4", "WMT14 EN-DE BLEU", "more than 2 BLEU above the listed prior ensembles"],
              ["41.8", "WMT14 EN-FR BLEU", "new single-model result reported in the abstract and Table 2"],
              ["92.7", "WSJ parsing F1", "4-layer semi-supervised Transformer"]
            ].map(([value, label, detail]) => (
              <div key={label} className="bg-[#101722] p-6">
                <p className="font-mono text-4xl font-black text-rose-300">{value}</p>
                <p className="mt-3 font-bold text-slate-200">{label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">table 2 reconstructed</p>
                <h3 className="mt-2 text-xl font-black">WMT 2014 newstest2014</h3>
              </div>
              <p className="font-mono text-[10px] text-slate-600">BLEU higher is better</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">model</th>
                    <th className="px-5 py-4">system</th>
                    <th className="px-5 py-4">EN-DE</th>
                    <th className="px-5 py-4">EN-FR</th>
                    <th className="px-5 py-4">training FLOPs EN-DE / EN-FR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {translationRows.map((row) => {
                    const transformer = row[0].startsWith("Transformer");
                    return (
                      <tr key={row[0] + row[1]} className={transformer ? "bg-rose-300/[0.05]" : "hover:bg-white/[0.02]"}>
                        <td className={"px-5 py-4 font-bold " + (transformer ? "text-rose-200" : "text-slate-300")}>{row[0]}</td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-600">{row[1]}</td>
                        <td className="px-5 py-4 font-mono font-bold text-cyan-300">{row[2]}</td>
                        <td className="px-5 py-4 font-mono font-bold text-cyan-300">{row[3]}</td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">{row[4]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ablations.map((item, index) => (
              <article key={item.title} className="border-t border-rose-300/40 bg-[#101722] p-5">
                <span className="font-mono text-[10px] text-slate-700">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-5 font-mono text-xl font-black text-rose-300">{item.metric}</p>
                <h3 className="mt-3 font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
            <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-6 sm:p-8">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">constituency parsing transfer</p>
              <p className="mt-5 text-2xl font-black text-white">The architecture generalized beyond translation.</p>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                A four-layer Transformer reached 91.3 F1 with only about 40K WSJ training sentences and 92.7 F1 in
                the semi-supervised setting with roughly 17M sentences. The semi-supervised score exceeded every
                semi-supervised baseline listed in Table 4.
              </p>
            </article>
            <article className="rounded-3xl border border-yellow-200/20 bg-yellow-200/5 p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow-100">read the comparisons correctly</p>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                These are the paper&apos;s 2017-era task settings and reported baselines. BLEU, tokenization, data,
                checkpoint averaging, decoding, and estimated hardware FLOPs all affect the comparison. The result
                validates the architecture in that experimental context; it is not a timeless benchmark leaderboard.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="maps" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="09 / attention maps"
            title="Different heads learned visibly different routes."
            description="The appendix traces individual encoder heads at layer 5 of 6. The examples show long-distance phrase completion, anaphora resolution, and patterns aligned with sentence structure."
          />

          <FigureCard
            image={3}
            title="Figure 3 · A long-distance dependency"
            caption="For the query word “making,” several heads place weight on the distant phrase “more difficult,” completing a dependency across intervening words. Colors identify different heads."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <FigureCard
              image={4}
              title="Figure 4 · Sharp anaphora-related heads"
              caption="Two layer-5 heads attend from “its” toward “Law” and “application.” The bottom panel isolates those outgoing attention links."
            />
            <FigureCard
              image={5}
              title="Figure 5 · Head specialization"
              caption="Two heads exhibit different structural patterns over the same sentence, illustrating why parallel representation subspaces are useful."
            />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: GitBranch,
                title: "Long-range links",
                text: "One layer can connect positions regardless of token distance."
              },
              {
                icon: Eye,
                title: "Inspectable weights",
                text: "The routing matrix can be visualized per layer and per head."
              },
              {
                icon: TriangleAlert,
                title: "Not a complete explanation",
                text: "A visible attention weight shows routing inside one operation; it does not by itself prove causal importance or full model reasoning."
              }
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="border-t border-slate-700 bg-[#101722] p-5">
                <Icon className="text-rose-300" size={22} />
                <h3 className="mt-5 font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="10 / limits and lasting idea"
            title="The paper solved sequence mixing, not every sequence cost."
            description="The original architecture is precise about its tradeoffs. Full self-attention removes recurrence from layer computation, but it introduces a quadratic matrix and retains autoregressive generation in the decoder."
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-2">
            {[
              {
                id: "01",
                title: "Quadratic sequence cost",
                text: "Attention materializes n by n compatibility weights. Long inputs eventually reverse the favorable n < d regime."
              },
              {
                id: "02",
                title: "Generation is still sequential",
                text: "Training can process target positions in parallel with a mask, but inference still emits one autoregressive target token at a time."
              },
              {
                id: "03",
                title: "Order is injected, not intrinsic",
                text: "Removing recurrence makes the content operation permutation-equivariant, so position must be supplied explicitly and learned by downstream attention."
              },
              {
                id: "04",
                title: "The evidence is task-bounded",
                text: "The paper's strongest evidence is machine translation plus one parsing transfer study, not the broad pretraining and multimodal settings that followed later."
              },
              {
                id: "05",
                title: "Heads are not guaranteed roles",
                text: "Some visualized heads look syntactic or semantic, but specialization emerges from optimization and is not imposed by the architecture."
              },
              {
                id: "06",
                title: "Restricted attention is a tradeoff",
                text: "Local neighborhoods reduce compute to O(rnd), but the maximum communication path grows to O(n/r)."
              }
            ].map((item) => (
              <article key={item.id} className="bg-[#101722] p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-black text-rose-300">{item.id}</span>
                  <ArrowRight className="text-slate-700" size={18} />
                </div>
                <h3 className="mt-8 text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-rose-300/25 bg-[#101722]">
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-stretch">
              <div className="p-7 sm:p-9">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-rose-300">the durable insight</p>
                <p className="mt-5 max-w-4xl text-2xl font-black leading-tight text-white md:text-3xl">
                  Represent every token at once, learn the routing graph from content, and separate communication from
                  per-token computation.
                </p>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">
                  Scaled dot-product attention performs communication. The position-wise FFN performs local
                  computation. Residual streams preserve width and information. Stacking those pieces creates the
                  original Transformer.
                </p>
              </div>
              <a
                href={links.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-36 items-center justify-center gap-3 border-t border-rose-300/20 bg-rose-300 px-8 font-mono text-xs font-black uppercase tracking-wider text-[#16080c] transition-colors hover:bg-rose-200 lg:border-l lg:border-t-0"
              >
                open paper <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            <SourceLink href={links.arxiv}>arXiv record</SourceLink>
            <SourceLink href={links.html}>official HTML</SourceLink>
            <SourceLink href={links.doi}>paper DOI</SourceLink>
            <SourceLink href={links.code}>original codebase</SourceLink>
          </div>

          <p className="mt-7 max-w-4xl text-xs leading-6 text-slate-600">
            Figures are reproduced from the supplied v7 paper with attribution. The paper explicitly grants permission
            to reproduce its tables and figures for journalistic or scholarly works when proper attribution is provided.
          </p>

          <PaperTimelineNav
            newer={{ href: "/resources/gpt-1", title: "GPT-1", year: 2018 }}
          />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
