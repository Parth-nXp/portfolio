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
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileText,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  ScanSearch,
  Tags,
  Target,
  TriangleAlert,
  Workflow
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  arxiv: "https://arxiv.org/abs/1810.04805",
  html: "https://arxiv.org/html/1810.04805v2",
  pdf: "https://arxiv.org/pdf/1810.04805v2",
  doi: "https://doi.org/10.48550/arXiv.1810.04805",
  code: "https://github.com/google-research/bert"
};

export const metadata: Metadata = {
  title: "BERT: A Complete Technical Deep Dive",
  description:
    "A visual, equation-first reconstruction of BERT: bidirectional encoding, MLM and NSP pre-training, input representations, fine-tuning heads, results, and ablations."
};

const sections = [
  ["shift", "The shift"],
  ["architecture", "Architecture"],
  ["inputs", "Input system"],
  ["objectives", "MLM + NSP"],
  ["pretraining", "Pre-training"],
  ["finetuning", "Fine-tuning"],
  ["results", "Results"],
  ["ablations", "Ablations"],
  ["transfer", "Transfer"],
  ["limits", "Limits"]
];

const glueRows = [
  ["Pre-OpenAI SOTA", "80.6 / 80.1", "66.1", "82.3", "93.2", "35.0", "81.0", "86.0", "61.7", "74.0"],
  ["BiLSTM + ELMo + Attn", "76.4 / 76.1", "64.8", "79.8", "90.4", "36.0", "73.3", "84.9", "56.8", "71.0"],
  ["OpenAI GPT", "82.1 / 81.4", "70.3", "87.4", "91.3", "45.4", "80.0", "82.3", "56.0", "75.1"],
  ["BERT Base", "84.6 / 83.4", "71.2", "90.5", "93.5", "52.1", "85.8", "88.9", "66.4", "79.6"],
  ["BERT Large", "86.7 / 85.9", "72.1", "92.7", "94.9", "60.5", "86.5", "89.3", "70.1", "82.1"]
];

const objectiveAblations = [
  ["BERT Base", "84.4", "88.4", "86.7", "92.7", "88.5"],
  ["No NSP", "83.9", "84.9", "86.5", "92.6", "87.9"],
  ["LTR + No NSP", "82.1", "84.3", "77.5", "92.1", "77.8"],
  ["LTR + No NSP + BiLSTM", "82.1", "84.1", "75.7", "91.6", "84.9"]
];

const scaleRows = [
  ["3", "768", "12", "5.84", "77.9", "79.8", "88.4"],
  ["6", "768", "3", "5.24", "80.6", "82.2", "90.7"],
  ["6", "768", "12", "4.68", "81.9", "84.8", "91.3"],
  ["12", "768", "12", "3.99", "84.4", "86.7", "92.9"],
  ["12", "1024", "16", "3.54", "85.7", "86.9", "93.3"],
  ["24", "1024", "16", "3.23", "86.6", "87.8", "93.7"]
];

const maskingRows = [
  ["80%", "10%", "10%", "84.2", "95.4", "94.9"],
  ["100%", "0%", "0%", "84.3", "94.9", "94.0"],
  ["80%", "0%", "20%", "84.1", "95.2", "94.6"],
  ["80%", "20%", "0%", "84.4", "95.2", "94.7"],
  ["0%", "20%", "80%", "83.7", "94.8", "94.6"],
  ["0%", "0%", "100%", "83.6", "94.9", "94.6"]
];

const figures = {
  1: { src: "/images/resources/bert/figure-1.png", width: 1392, height: 585 },
  2: { src: "/images/resources/bert/figure-2.png", width: 1365, height: 531 },
  3: { src: "/images/resources/bert/figure-3.png", width: 1380, height: 375 },
  4: { src: "/images/resources/bert/figure-4.png", width: 1326, height: 1239 },
  5: { src: "/images/resources/bert/figure-5.png", width: 720, height: 705 }
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
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-lime-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({
  label,
  formula,
  note,
  tone = "lime"
}: {
  label: string;
  formula: string;
  note?: ReactNode;
  tone?: "lime" | "cyan" | "blue";
}) {
  const tones = {
    lime: "border-lime-300/20 bg-lime-300/5 text-lime-50",
    cyan: "border-cyan-300/20 bg-cyan-300/5 text-cyan-50",
    blue: "border-blue-300/20 bg-blue-300/5 text-blue-50"
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
          className={"h-auto max-h-[880px] w-full object-contain " + imageClassName}
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
      className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-lime-300 transition-colors hover:text-white"
    >
      {children} <ExternalLink size={13} />
    </a>
  );
}

function MaskingConsole() {
  const candidates = [
    ["see", "42%", "bg-lime-300"],
    ["use", "24%", "bg-cyan-300"],
    ["read", "17%", "bg-blue-300"],
    ["learn", "9%", "bg-slate-500"]
  ];

  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-lime-300/20 bg-[#101722] shadow-[0_0_90px_-45px_rgba(190,242,100,0.85)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.9)]" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-lime-200">
            masked token laboratory
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-600">layer 24 / 24</span>
      </div>
      <div className="relative p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="relative">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">bidirectional reconstruction</p>
              <p className="mt-1 text-xl font-black text-white">Both sides inform the blank.</p>
            </div>
            <ScanSearch className="shrink-0 text-lime-300" size={28} />
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {["[CLS]", "the", "model", "can", "[MASK]", "both", "sides", "[SEP]"].map((token) => (
              <span
                key={token}
                className={
                  "rounded-lg border px-3 py-2 font-mono text-xs font-bold " +
                  (token === "[MASK]"
                    ? "border-lime-300/50 bg-lime-300/15 text-lime-200 shadow-[0_0_24px_-12px_rgba(190,242,100,0.9)]"
                    : "border-slate-800 bg-[#0d1117] text-slate-400")
                }
              >
                {token}
              </span>
            ))}
          </div>

          <div className="mt-7 space-y-3">
            {candidates.map(([token, probability, tone], index) => (
              <div key={token} className="grid grid-cols-[58px_1fr_38px] items-center gap-3">
                <span className="font-mono text-[10px] text-slate-500">{token}</span>
                <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                  <div className={"h-full rounded-full " + tone} style={{ width: String(84 - index * 17) + "%" }} />
                </div>
                <span className="text-right font-mono text-[10px] text-slate-600">{probability}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-slate-800 pt-5">
            {[
              ["context", "left + right"],
              ["selected", "15%"],
              ["target", "original id"]
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</p>
                <p className="mt-1 truncate font-mono text-xs font-bold text-lime-200">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReplacementPolicy() {
  const cells = [
    ...Array.from({ length: 8 }, () => ({ label: "[MASK]", tone: "bg-lime-300 text-[#101707]" })),
    { label: "random", tone: "bg-cyan-300 text-[#071418]" },
    { label: "same", tone: "bg-blue-300 text-[#0a1020]" }
  ];

  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5">
        {cells.map((cell, index) => (
          <div
            key={index}
            className={"flex aspect-square items-center justify-center rounded-md font-mono text-[7px] font-black sm:text-[9px] " + cell.tone}
          >
            {cell.label}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[9px] uppercase tracking-wider text-slate-500">
        <span>80% mask</span>
        <span className="text-center">10% random</span>
        <span className="text-right">10% same</span>
      </div>
    </div>
  );
}

export default function BertPaperPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0d1117] font-sans text-white selection:bg-lime-300/30">
      <SiteNav />

      <header className="relative border-b border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(190,242,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/70 to-cyan-300/50" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 md:pb-24 md:pt-36">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-lime-300"
          >
            <ArrowLeft size={15} /> back to resources
          </Link>

          <div className="mt-9 grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-lime-300/25 bg-lime-300/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300">
                  complete paper reconstruction
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">arXiv:1810.04805v2</span>
              </div>

              <h1 className="mt-7 text-6xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
                BERT<span className="text-lime-300">.</span>
              </h1>
              <p className="mt-7 max-w-3xl text-xl font-bold leading-8 text-slate-200 md:text-2xl">
                Pre-train deeply in both directions. Fine-tune almost anything.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">
                A tensor-level guide to bidirectional Transformer encoders, WordPiece inputs, masked language
                modeling, next-sentence prediction, task heads, pre-training infrastructure, benchmark results,
                and the ablations that justify the design.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={links.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#101707] transition-colors hover:bg-lime-200"
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

              <p className="mt-6 font-mono text-xs leading-6 text-slate-600">
                Jacob Devlin, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova<br />
                Google AI Language · NAACL 2019
              </p>
            </div>

            <MaskingConsole />
          </div>

          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 lg:grid-cols-4">
            {[
              ["24", "encoder layers", "BERT Large"],
              ["340M", "parameters", "16 attention heads"],
              ["3.3B", "pre-training words", "BooksCorpus + Wikipedia"],
              ["80.5", "official GLUE", "paper leaderboard score"]
            ].map(([value, label, detail]) => (
              <div key={label} className="min-w-0 bg-[#101722] p-5">
                <p className="font-mono text-2xl font-black text-lime-300 md:text-3xl">{value}</p>
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
              className="shrink-0 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 transition-colors hover:bg-lime-300/8 hover:text-lime-300"
            >
              <span className="mr-2 text-slate-700">{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="shift" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="01 / the representation shift"
            title="Stop predicting only forward. Learn the missing word."
            description={
              <>
                A left-to-right language model cannot use future context when representing the current token. BERT
                changes the pre-training problem: hide selected input tokens, expose both surrounding directions, and
                train a Transformer encoder to reconstruct the originals.
              </>
            }
          />

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ArrowRight,
                label: "OpenAI GPT",
                title: "Deep but left-to-right",
                text: "Every layer uses a causal mask. Token t can depend on positions before t, never positions after it."
              },
              {
                icon: GitBranch,
                label: "ELMo",
                title: "Two directions, joined late",
                text: "Independent left-to-right and right-to-left LSTMs are trained separately, then their features are concatenated."
              },
              {
                icon: Network,
                label: "BERT",
                title: "Deeply bidirectional",
                text: "Every encoder layer allows every visible token to condition on both left and right context simultaneously."
              }
            ].map(({ icon: Icon, label, title, text }) => (
              <article key={title} className="border-t border-slate-700 bg-[#101722] p-6">
                <div className="flex items-center justify-between">
                  <Icon className="text-lime-300" size={24} />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-700">{label}</span>
                </div>
                <h3 className="mt-8 text-xl font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>

          <FigureCard
            image={3}
            title="Figure 3 · BERT, GPT, and ELMo pre-training architectures"
            caption="BERT jointly conditions every layer on left and right context. GPT is deep but causal. ELMo combines separately trained directional LSTMs at the feature level."
            className="mt-9"
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
            <div className="border-l-2 border-lime-300 bg-lime-300/5 px-6 py-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-lime-300">the core contribution</p>
              <p className="mt-4 text-xl font-bold leading-9 text-slate-200">
                A single unlabeled-text checkpoint can initialize sentence classification, text-pair reasoning,
                extractive question answering, and token tagging with only small output layers added.
              </p>
            </div>
            <div className="border border-slate-800 bg-[#101722] p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">what is transferred</p>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Not only embeddings or a frozen feature vector. Fine-tuning initializes the entire downstream encoder
                from pre-training and updates all BERT parameters end to end.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="02 / model architecture"
            title="The Transformer encoder becomes the product."
            description="BERT keeps the bidirectional encoder stack from the original Transformer and removes the autoregressive decoder. Every output token is a contextual representation at the same sequence position."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                tag: "BERT BASE",
                tone: "cyan",
                layers: "12",
                hidden: "768",
                heads: "12",
                ffn: "3,072",
                params: "110M",
                note: "Chosen to match OpenAI GPT's model size for a controlled architectural comparison."
              },
              {
                tag: "BERT LARGE",
                tone: "lime",
                layers: "24",
                hidden: "1,024",
                heads: "16",
                ffn: "4,096",
                params: "340M",
                note: "The model behind the paper's strongest GLUE, SQuAD, and SWAG results."
              }
            ].map((model) => (
              <article
                key={model.tag}
                className={
                  "overflow-hidden rounded-3xl border bg-[#101722] " +
                  (model.tone === "lime" ? "border-lime-300/25" : "border-cyan-300/25")
                }
              >
                <div className="flex items-center justify-between border-b border-slate-800 p-6">
                  <div>
                    <p className={"font-mono text-xs font-black tracking-[0.2em] " + (model.tone === "lime" ? "text-lime-300" : "text-cyan-300")}>
                      {model.tag}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{model.params} parameters</p>
                  </div>
                  <Layers3 className={model.tone === "lime" ? "text-lime-300" : "text-cyan-300"} size={28} />
                </div>
                <div className="grid grid-cols-2 gap-px bg-slate-800 sm:grid-cols-4">
                  {[
                    ["L", model.layers, "layers"],
                    ["H", model.hidden, "hidden"],
                    ["A", model.heads, "heads"],
                    ["4H", model.ffn, "FFN"]
                  ].map(([symbol, value, label]) => (
                    <div key={symbol} className="bg-[#101722] p-4">
                      <p className="font-mono text-[9px] text-slate-600">{symbol}</p>
                      <p className="mt-2 font-mono text-xl font-black text-white">{value}</p>
                      <p className="mt-1 text-[10px] text-slate-600">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="p-6 text-sm leading-7 text-slate-400">{model.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-5">
            {[
              ["input", "n x H"],
              ["multi-head attention", "bidirectional"],
              ["add + norm", "residual"],
              ["GELU FFN", "H -> 4H -> H"],
              ["output", "n x H"]
            ].map(([label, value], index) => (
              <div key={label} className="relative bg-[#101722] p-5">
                <span className="font-mono text-[9px] text-slate-700">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-4 text-xs font-black text-slate-200">{label}</p>
                <p className="mt-1 font-mono text-[10px] text-lime-300">{value}</p>
                {index < 4 && <ChevronRight className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-lime-300 md:block" size={17} />}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
            <Equation
              label="one encoder block"
              formula={"\\mathbf{H}^{(\\ell)}=\\operatorname{TransformerBlock}_{\\ell}\\!\\left(\\mathbf{H}^{(\\ell-1)}\\right),\\qquad \\mathbf{H}^{(\\ell)}\\in\\mathbb{R}^{n\\times H}"}
              note="Each position leaves every layer with the same hidden width H, but its vector now incorporates content from the entire visible sequence."
              tone="cyan"
            />
            <div className="rounded-2xl border border-lime-300/20 bg-lime-300/5 p-6">
              <div className="flex items-center gap-3">
                <Eye className="text-lime-300" size={23} />
                <h3 className="text-xl font-black">No causal mask</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                The encoder attention matrix is fully visible. Position i can attend to any input position j. The MLM
                corruption prevents the model from solving selected targets by copying their visible token identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="inputs" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="03 / unified input system"
            title="Token identity plus segment identity plus position."
            description="BERT packs either one text span or a pair of spans into one WordPiece sequence. Special tokens and learned segment embeddings make the structure unambiguous to the shared encoder."
          />

          <FigureCard
            image={2}
            title="Figure 2 · BERT input representation"
            caption="Each input vector is the elementwise sum of a WordPiece token embedding, a learned sentence-A or sentence-B embedding, and a learned absolute position embedding."
          />

          <Equation
            label="embedding construction at position i"
            formula={"\\mathbf{x}_i=\\mathbf{e}_{\\mathrm{token}(i)}+\\mathbf{e}_{\\mathrm{segment}(i)}+\\mathbf{e}_{\\mathrm{position}(i)}"}
            note="All three vectors have hidden width H, so they can be added before the first Transformer block."
            tone="lime"
          />

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                token: "[CLS]",
                title: "Sequence aggregate",
                text: "Always the first token. Its final state C feeds sentence-level classifiers and NSP."
              },
              {
                token: "[SEP]",
                title: "Boundary marker",
                text: "Terminates a span and separates sentence A from sentence B."
              },
              {
                token: "A / B",
                title: "Segment identity",
                text: "A learned embedding tells every token which packed span it belongs to."
              },
              {
                token: "##ing",
                title: "WordPiece continuation",
                text: "A 30K vocabulary decomposes rare words into reusable subword units."
              }
            ].map((item) => (
              <article key={item.token} className="border-t border-lime-300/40 bg-[#101722] p-5">
                <span className="font-mono text-sm font-black text-lime-300">{item.token}</span>
                <h3 className="mt-5 font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">packed pair example</p>
            </div>
            <div className="overflow-x-auto p-6">
              <div className="flex min-w-max items-end gap-2">
                {[
                  ["[CLS]", "A", "0"],
                  ["the", "A", "1"],
                  ["cat", "A", "2"],
                  ["sat", "A", "3"],
                  ["[SEP]", "A", "4"],
                  ["where", "B", "5"],
                  ["?", "B", "6"],
                  ["[SEP]", "B", "7"]
                ].map(([token, segment, position]) => (
                  <div key={token + position} className="w-20 text-center">
                    <div className="rounded-lg border border-lime-300/20 bg-lime-300/8 px-2 py-3 font-mono text-xs font-bold text-lime-200">{token}</div>
                    <div className="mt-2 rounded-md border border-cyan-300/15 bg-cyan-300/5 py-1 font-mono text-[9px] text-cyan-300">seg {segment}</div>
                    <div className="mt-1 font-mono text-[9px] text-slate-700">pos {position}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="objectives" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="04 / pre-training objectives"
            title="Recover tokens. Judge sentence continuity."
            description="BERT jointly optimizes masked language modeling and next sentence prediction. MLM creates deep bidirectional token representations; NSP teaches the [CLS] pathway about relationships between packed spans."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="overflow-hidden rounded-3xl border border-lime-300/25 bg-[#101722]">
              <div className="flex items-center justify-between border-b border-lime-300/15 bg-lime-300/5 p-6">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-lime-300">task 01</p>
                  <h3 className="mt-2 text-2xl font-black">Masked language model</h3>
                </div>
                <LockKeyhole className="text-lime-300" size={27} />
              </div>
              <div className="p-6">
                <p className="text-sm leading-7 text-slate-400">
                  Select 15% of WordPiece positions. Corrupt those inputs according to the replacement policy, then
                  predict each selected token&apos;s original vocabulary id from its final bidirectional hidden state.
                  The loss ignores unselected positions.
                </p>
                <div className="mt-6">
                  <ReplacementPolicy />
                </div>
                <div className="mt-6 overflow-x-auto border-t border-slate-800 pt-6 text-lime-50">
                  <DisplayMath
                    formula={"\\mathcal{L}_{\\mathrm{MLM}}=-\\sum_{i\\in\\mathcal{M}}\\log p_{\\theta}\\!\\left(x_i\\mid\\widetilde{\\mathbf{x}}\\right)"}
                    className="text-base"
                  />
                </div>
              </div>
            </article>

            <article className="overflow-hidden rounded-3xl border border-cyan-300/25 bg-[#101722]">
              <div className="flex items-center justify-between border-b border-cyan-300/15 bg-cyan-300/5 p-6">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">task 02</p>
                  <h3 className="mt-2 text-2xl font-black">Next sentence prediction</h3>
                </div>
                <GitBranch className="text-cyan-300" size={27} />
              </div>
              <div className="p-6">
                <p className="text-sm leading-7 text-slate-400">
                  Build a sentence pair. Half the time B actually follows A in the source document; half the time B is
                  randomly sampled. Classify IsNext versus NotNext from the final [CLS] vector C.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="border border-cyan-300/20 bg-cyan-300/8 p-4">
                    <p className="font-mono text-2xl font-black text-cyan-300">50%</p>
                    <p className="mt-2 text-xs font-bold text-slate-300">IsNext</p>
                    <p className="mt-1 text-[10px] text-slate-600">actual continuation</p>
                  </div>
                  <div className="border border-blue-300/20 bg-blue-300/8 p-4">
                    <p className="font-mono text-2xl font-black text-blue-300">50%</p>
                    <p className="mt-2 text-xs font-bold text-slate-300">NotNext</p>
                    <p className="mt-1 text-[10px] text-slate-600">random sentence</p>
                  </div>
                </div>
                <div className="mt-6 overflow-x-auto border-t border-slate-800 pt-6 text-cyan-50">
                  <DisplayMath
                    formula={"p_{\\mathrm{NSP}}=\\operatorname{softmax}\\!\\left(\\mathbf{W}_{\\mathrm{NSP}}\\mathbf{C}+\\mathbf{b}_{\\mathrm{NSP}}\\right)"}
                    className="text-base"
                  />
                </div>
                <p className="mt-5 text-xs leading-5 text-slate-600">The final model reports 97-98% NSP accuracy.</p>
              </div>
            </article>
          </div>

          <Equation
            label="joint pre-training objective"
            formula={"\\mathcal{L}_{\\mathrm{pretrain}}=\\mathcal{L}_{\\mathrm{MLM}}+\\mathcal{L}_{\\mathrm{NSP}}"}
            note="The implementation averages masked-token likelihood and next-sentence likelihood terms, then sums the two task losses."
            tone="blue"
          />

          <div className="mt-7 rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-lime-300">the subtle probability tree</p>
            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-slate-800 sm:grid-cols-4">
              {[
                ["85%", "not selected", "visible input / no MLM loss"],
                ["12%", "[MASK]", "15% x 80%"],
                ["1.5%", "random token", "15% x 10%"],
                ["1.5%", "unchanged", "15% x 10%"]
              ].map(([value, label, note]) => (
                <div key={label} className="bg-[#0d1117] p-5">
                  <p className="font-mono text-2xl font-black text-lime-300">{value}</p>
                  <p className="mt-2 text-sm font-bold text-slate-300">{label}</p>
                  <p className="mt-1 text-xs text-slate-600">{note}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-500">
              The 80/10/10 policy applies only after a position enters the 15% prediction set. Random and unchanged
              cases reduce the gap between pre-training and fine-tuning, where [MASK] never appears.
            </p>
          </div>
        </div>
      </section>

      <section id="pretraining" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="05 / pre-training system"
            title="One million updates over 3.3 billion words."
            description="BERT's transfer quality is inseparable from scale: document-level corpora, large token batches, TPU pods, a two-stage sequence-length curriculum, and four days of optimization."
          />

          <FigureCard
            image={1}
            title="Figure 1 · Pre-training becomes task initialization"
            caption="MLM and NSP train one shared encoder on unlabeled sentence pairs. The same parameters initialize separate fine-tuned models for classification, named entities, and question answering; only the output heads change."
          />

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["800M", "BooksCorpus words", "long contiguous text"],
              ["2.5B", "Wikipedia words", "passages only"],
              ["128K", "tokens / batch", "256 x 512"],
              ["1M", "optimization steps", "about 40 epochs"]
            ].map(([value, label, detail]) => (
              <div key={label} className="bg-[#101722] p-6">
                <p className="font-mono text-2xl font-black text-lime-300">{value}</p>
                <p className="mt-2 text-sm font-bold text-slate-200">{label}</p>
                <p className="mt-1 text-xs text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <article className="rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">sequence-length curriculum</p>
              <div className="mt-7 space-y-5">
                <div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-mono text-3xl font-black text-cyan-300">90%</p>
                      <p className="mt-1 text-sm font-bold text-slate-300">steps at length 128</p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-600">cheaper attention</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-900">
                    <div className="h-full w-[90%] rounded-full bg-cyan-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-mono text-3xl font-black text-lime-300">10%</p>
                      <p className="mt-1 text-sm font-bold text-slate-300">steps at length 512</p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-600">learn long positions</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-900">
                    <div className="h-full w-[10%] rounded-full bg-lime-300" />
                  </div>
                </div>
              </div>
              <p className="mt-6 border-t border-slate-800 pt-5 text-sm leading-7 text-slate-500">
                Attention cost is quadratic in sequence length. Short sequences make most updates cheaper; the final
                long-sequence phase trains the positional embeddings through 512 tokens.
              </p>
            </article>

            <article className="rounded-3xl border border-lime-300/20 bg-lime-300/5 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-lime-300">optimizer</p>
                  <h3 className="mt-2 text-xl font-black">Adam + warmup + decay</h3>
                </div>
                <Activity className="text-lime-300" size={25} />
              </div>
              <div className="mt-6 space-y-4 text-sm">
                {[
                  ["learning rate", "1e-4"],
                  ["beta_1 / beta_2", "0.9 / 0.999"],
                  ["L2 weight decay", "0.01"],
                  ["warmup", "first 10,000 steps"],
                  ["schedule", "linear decay"],
                  ["dropout", "0.1 on all layers"],
                  ["activation", "GELU"]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b border-lime-300/10 pb-3 last:border-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">{label}</span>
                    <span className="font-bold text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-cyan-300/20 bg-[#101722] p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-cyan-300">BERT BASE</span>
                <Cpu className="text-cyan-300" size={23} />
              </div>
              <p className="mt-6 text-3xl font-black">4 Cloud TPUs</p>
              <p className="mt-2 text-sm text-slate-500">16 TPU chips total in Pod configuration</p>
            </article>
            <article className="rounded-3xl border border-lime-300/20 bg-[#101722] p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-lime-300">BERT LARGE</span>
                <Cpu className="text-lime-300" size={23} />
              </div>
              <p className="mt-6 text-3xl font-black">16 Cloud TPUs</p>
              <p className="mt-2 text-sm text-slate-500">64 TPU chips total · each run took 4 days</p>
            </article>
          </div>
        </div>
      </section>

      <section id="finetuning" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="06 / fine-tuning interfaces"
            title="Keep the encoder. Swap the output head."
            description="The same packed input and contextual outputs support classification, sentence-pair reasoning, answer-span extraction, and token labeling. Every task fine-tunes all BERT parameters end to end."
          />

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <FigureCard
              image={4}
              title="Figure 4 · Four downstream interfaces"
              caption="Sentence and sentence-pair classification read [CLS]. Question answering scores start and end positions. Named-entity recognition classifies each token state."
            />

            <div className="space-y-4">
              {[
                {
                  icon: Tags,
                  title: "Sequence classification",
                  input: "single text or text pair",
                  output: "[CLS] -> K labels",
                  formula: "p(y\\mid\\mathbf{x})=\\operatorname{softmax}(\\mathbf{W}\\mathbf{C})"
                },
                {
                  icon: Target,
                  title: "Extractive question answering",
                  input: "question [SEP] passage",
                  output: "start + end token",
                  formula: "p_i^{\\mathrm{start}}=\\frac{e^{\\mathbf{S}^{\\mathsf T}\\mathbf{T}_i}}{\\sum_j e^{\\mathbf{S}^{\\mathsf T}\\mathbf{T}_j}}"
                },
                {
                  icon: FileText,
                  title: "Token classification",
                  input: "single sequence",
                  output: "one label per token",
                  formula: "p(y_i\\mid\\mathbf{x})=\\operatorname{softmax}(\\mathbf{W}\\mathbf{T}_i)"
                },
                {
                  icon: Layers3,
                  title: "Multiple-choice reasoning",
                  input: "one pair per candidate",
                  output: "softmax over choices",
                  formula: "s_k=\\mathbf{V}^{\\mathsf T}\\mathbf{C}_k"
                }
              ].map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                  <div className="flex items-start gap-4">
                    <item.icon className="mt-1 shrink-0 text-lime-300" size={22} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-white">{item.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-wider text-slate-600">
                        <span>{item.input}</span>
                        <span className="text-cyan-300">{item.output}</span>
                      </div>
                      <div className="mt-4 overflow-x-auto border-t border-slate-800 pt-4 text-lime-50">
                        <DisplayMath formula={item.formula} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["batch", "16 or 32", "appendix search range"],
              ["learning rate", "2e-5 to 5e-5", "small task updates"],
              ["epochs", "2, 3, or 4", "task-specific search"],
              ["runtime", "< 1 hour", "single Cloud TPU"]
            ].map(([label, value, detail]) => (
              <div key={label} className="bg-[#101722] p-5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</p>
                <p className="mt-2 font-mono text-xl font-black text-lime-300">{value}</p>
                <p className="mt-1 text-xs text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-6 sm:p-8">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">why packed pairs matter</p>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Earlier systems often encoded two texts independently and added a separate cross-attention module.
              BERT concatenates both spans before encoding, so every Transformer layer already performs bidirectional
              cross-attention between the two segments.
            </p>
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="07 / eleven-task evidence"
            title="One checkpoint, state of the art across task shapes."
            description="BERT's claim is breadth as much as peak score. Sentence classification, pairwise reasoning, question answering, and commonsense completion all improve without heavily engineered task-specific encoders."
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["80.5", "official GLUE score", "+7.7 over GPT leaderboard score"],
              ["93.2", "SQuAD 1.1 test F1", "ensemble + TriviaQA"],
              ["83.1", "SQuAD 2.0 test F1", "+5.1 over prior best"],
              ["86.3", "SWAG test accuracy", "+8.3 over GPT"]
            ].map(([value, label, detail]) => (
              <div key={label} className="bg-[#101722] p-6">
                <p className="font-mono text-3xl font-black text-lime-300">{value}</p>
                <p className="mt-3 font-bold text-slate-200">{label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime-300">table 1 reconstructed</p>
                <h3 className="mt-2 text-xl font-black">GLUE test results</h3>
              </div>
              <p className="font-mono text-[10px] text-slate-600">average excludes WNLI</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-left text-xs">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    {["system", "MNLI m/mm", "QQP", "QNLI", "SST-2", "CoLA", "STS-B", "MRPC", "RTE", "avg"].map((header) => (
                      <th key={header} className="px-4 py-4">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {glueRows.map((row) => {
                    const bert = row[0].startsWith("BERT");
                    return (
                      <tr key={row[0]} className={bert ? "bg-lime-300/[0.04]" : "hover:bg-white/[0.02]"}>
                        {row.map((cell, index) => (
                          <td
                            key={index}
                            className={
                              "px-4 py-4 " +
                              (index === 0
                                ? "font-bold " + (bert ? "text-lime-200" : "text-slate-300")
                                : "font-mono text-slate-500")
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-cyan-300/20 bg-[#101722] p-6">
              <p className="font-mono text-xs font-black text-cyan-300">SQuAD 1.1</p>
              <p className="mt-5 text-3xl font-black">87.4 EM / 93.2 F1</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Test score for the seven-model BERT Large ensemble with TriviaQA fine-tuning. A single augmented model
                reaches 85.1 EM / 91.8 F1.
              </p>
            </article>
            <article className="rounded-3xl border border-lime-300/20 bg-[#101722] p-6">
              <p className="font-mono text-xs font-black text-lime-300">SQuAD 2.0</p>
              <p className="mt-5 text-3xl font-black">80.0 EM / 83.1 F1</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                A single BERT Large model treats [CLS] as the null-answer span and compares that score against the best
                non-null start/end pair.
              </p>
            </article>
            <article className="rounded-3xl border border-blue-300/20 bg-[#101722] p-6">
              <p className="font-mono text-xs font-black text-blue-300">SWAG</p>
              <p className="mt-5 text-3xl font-black">86.3% test</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                BERT Large scores each of four sentence-continuation pairs through [CLS], exceeding the reported 85.0%
                expert human estimate on 100 examples.
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-[#101722] p-6">
            <div className="flex items-start gap-4">
              <TriangleAlert className="mt-0.5 shrink-0 text-lime-300" size={22} />
              <p className="text-sm leading-7 text-slate-400">
                The table&apos;s 82.1 average excludes WNLI and is not the same quantity as the 80.5 official GLUE
                leaderboard score highlighted in the abstract. The page keeps those two reported metrics separate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="ablations" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="08 / ablations"
            title="Bidirectionality matters. Scale keeps paying."
            description="The paper isolates its two most important design claims: masked bidirectional pre-training beats left-to-right pre-training, and larger pre-trained encoders improve even on small labeled datasets."
          />

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime-300">table 5 · objective ablation</p>
              <h3 className="mt-2 text-xl font-black">Dev-set impact of MLM and NSP</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    {["pre-training", "MNLI", "QNLI", "MRPC", "SST-2", "SQuAD F1"].map((header) => (
                      <th key={header} className="px-5 py-4">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {objectiveAblations.map((row, rowIndex) => (
                    <tr key={row[0]} className={rowIndex === 0 ? "bg-lime-300/[0.05]" : "hover:bg-white/[0.02]"}>
                      {row.map((cell, index) => (
                        <td key={index} className={"px-5 py-4 " + (index === 0 ? "font-bold text-slate-300" : "font-mono text-slate-500")}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["-10.7 F1", "LTR on SQuAD", "77.8 versus BERT Base at 88.5: right-side context is crucial for token span prediction."],
              ["-3.5", "No NSP on QNLI", "Removing sentence-pair pre-training drops QNLI accuracy from 88.4 to 84.9 in this experiment."],
              ["not repaired", "random BiLSTM", "Adding a randomly initialized bidirectional LSTM helps SQuAD but remains below pre-trained bidirectionality."]
            ].map(([metric, title, detail]) => (
              <article key={title} className="border-t border-lime-300/40 bg-[#101722] p-5">
                <p className="font-mono text-xl font-black text-lime-300">{metric}</p>
                <h3 className="mt-3 font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 px-6 py-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">table 6 · model scaling</p>
                <h3 className="mt-2 text-xl font-black">Larger encoders improve every selected task</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-xs">
                  <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      {["L", "H", "A", "MLM ppl", "MNLI", "MRPC", "SST-2"].map((header) => (
                        <th key={header} className="px-4 py-3">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {scaleRows.map((row) => (
                      <tr key={row.join("-")} className="hover:bg-cyan-300/[0.03]">
                        {row.map((cell, index) => (
                          <td key={index} className={"px-4 py-3 font-mono " + (index > 3 ? "text-cyan-300" : "text-slate-500")}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <FigureCard
              image={5}
              title="Figure 5 · More pre-training still helps"
              caption="MNLI dev accuracy continues to improve through one million pre-training steps. MLM converges slightly slower than left-to-right LM but remains more accurate almost immediately."
            />
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">table 8 · masking policy ablation</p>
              <h3 className="mt-2 text-xl font-black">Fine-tuning is robust; frozen features expose the mismatch</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    {["MASK", "same", "random", "MNLI FT", "NER FT", "NER features"].map((header) => (
                      <th key={header} className="px-5 py-4">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {maskingRows.map((row, rowIndex) => (
                    <tr key={row.join("-")} className={rowIndex === 0 ? "bg-blue-300/[0.05]" : "hover:bg-white/[0.02]"}>
                      {row.map((cell, index) => (
                        <td key={index} className="px-5 py-4 font-mono text-slate-500">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="transfer" className="scroll-mt-36 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="09 / transfer modes"
            title="Fine-tune the model, or freeze it as a feature engine."
            description="The main results update every BERT parameter, but the paper also tests frozen representations for named-entity recognition to show that the checkpoint works as a feature extractor."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-lime-300/20 bg-[#101722] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-black text-lime-300">FINE-TUNING</p>
                  <h3 className="mt-2 text-2xl font-black">Update all layers</h3>
                </div>
                <Workflow className="text-lime-300" size={27} />
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-400">
                Add a small randomly initialized head and backpropagate through the complete encoder. BERT Base reaches
                96.6 dev F1 and 92.8 test F1 on CoNLL-2003 NER.
              </p>
              <div className="mt-6 flex items-center gap-2">
                {["embeddings", "12 blocks", "task head"].map((stage, index) => (
                  <div key={stage} className="flex flex-1 items-center gap-2">
                    <div className="flex-1 border border-lime-300/20 bg-lime-300/8 p-3 text-center font-mono text-[9px] text-lime-200">{stage}</div>
                    {index < 2 && <ChevronRight className="shrink-0 text-lime-300" size={14} />}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-cyan-300/20 bg-[#101722] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-black text-cyan-300">FEATURE-BASED</p>
                  <h3 className="mt-2 text-2xl font-black">Freeze and extract</h3>
                </div>
                <Database className="text-cyan-300" size={27} />
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-400">
                Cache BERT activations and train a two-layer BiLSTM plus classifier. Concatenating the top four hidden
                layers reaches 96.1 dev F1, only 0.3 below BERT Large fine-tuning on the reported dev setup.
              </p>
              <div className="mt-6 flex items-center gap-2">
                {["frozen BERT", "top 4 concat", "BiLSTM head"].map((stage, index) => (
                  <div key={stage} className="flex flex-1 items-center gap-2">
                    <div className="flex-1 border border-cyan-300/20 bg-cyan-300/8 p-3 text-center font-mono text-[9px] text-cyan-200">{stage}</div>
                    {index < 2 && <ChevronRight className="shrink-0 text-cyan-300" size={14} />}
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["embeddings only", "91.0", "NER dev F1"],
              ["last hidden", "94.9", "NER dev F1"],
              ["weighted top 4", "95.9", "NER dev F1"],
              ["concat top 4", "96.1", "best frozen features"]
            ].map(([label, value, detail]) => (
              <div key={label} className="bg-[#101722] p-5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</p>
                <p className="mt-2 font-mono text-2xl font-black text-cyan-300">{value}</p>
                <p className="mt-1 text-xs text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading
            eyebrow="10 / limits and durable idea"
            title="A representation model, not a universal text machine."
            description="BERT established the pre-train-then-fine-tune encoder recipe, but the original system carries clear constraints in sequence length, compute, corruption mismatch, generation, and per-task deployment."
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-2">
            {[
              {
                id: "01",
                title: "[MASK] never appears downstream",
                text: "The 80/10/10 policy reduces the pre-train/fine-tune mismatch but does not remove the artificial corruption process."
              },
              {
                id: "02",
                title: "Full attention stops at 512 tokens",
                text: "Learned positional embeddings and quadratic self-attention bound the original sequence length and make long updates disproportionately expensive."
              },
              {
                id: "03",
                title: "Pre-training is infrastructure-heavy",
                text: "BERT Large used 64 TPU chips for four days. Cheap fine-tuning depends on an expensive checkpoint already existing."
              },
              {
                id: "04",
                title: "Every task gets a separate model",
                text: "The paper initializes and fine-tunes independent parameter copies for each downstream task rather than serving one shared multitask model."
              },
              {
                id: "05",
                title: "Small-task fine-tuning can be unstable",
                text: "The authors use random restarts on small GLUE datasets because data order and classifier initialization can materially affect results."
              },
              {
                id: "06",
                title: "Encoder representations do not generate directly",
                text: "Bidirectional attention is ideal for understanding visible text but does not provide the causal factorization needed for left-to-right generation."
              }
            ].map((item) => (
              <article key={item.id} className="bg-[#101722] p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-black text-lime-300">{item.id}</span>
                  <ArrowRight className="text-slate-700" size={18} />
                </div>
                <h3 className="mt-8 text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-lime-300/25 bg-[#101722]">
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-stretch">
              <div className="p-7 sm:p-9">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-lime-300">the durable insight</p>
                <p className="mt-5 max-w-4xl text-2xl font-black leading-tight text-white md:text-3xl">
                  Pre-train one deep bidirectional encoder on unlabeled text, then express each understanding task as a
                  thin interface over [CLS] or token-level contextual states.
                </p>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">
                  MLM makes every layer bidirectional. Packed segments unify text pairs. Large-scale pre-training stores
                  transferable language structure. Fine-tuning turns that structure into task behavior with minimal
                  architectural change.
                </p>
              </div>
              <a
                href={links.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-36 items-center justify-center gap-3 border-t border-lime-300/20 bg-lime-300 px-8 font-mono text-xs font-black uppercase tracking-wider text-[#101707] transition-colors hover:bg-lime-200 lg:border-l lg:border-t-0"
              >
                open paper <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            <SourceLink href={links.arxiv}>arXiv record</SourceLink>
            <SourceLink href={links.html}>official HTML</SourceLink>
            <SourceLink href={links.doi}>paper DOI</SourceLink>
            <SourceLink href={links.code}>original code</SourceLink>
          </div>

          <PaperTimelineNav
            older={{ href: "/resources/gpt-2", title: "GPT-2", year: 2019 }}
            newer={{ href: "/resources/gpt-3", title: "GPT-3", year: 2020 }}
          />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
