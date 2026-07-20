import Image from "next/image";
import Link from "next/link";
import katex from "katex";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Binary,
  BookOpen,
  Braces,
  ChartNoAxesCombined,
  Check,
  CircleDot,
  Cpu,
  Database,
  ExternalLink,
  Gauge,
  Layers3,
  MemoryStick,
  Network,
  RotateCw,
  ScanSearch,
  Sigma,
  Sparkles,
  TriangleAlert,
  Variable,
  Workflow,
  Zap
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  arxiv: "https://arxiv.org/abs/2504.19874v1",
  html: "https://arxiv.org/html/2504.19874v1",
  pdf: "https://arxiv.org/pdf/2504.19874v1"
};

export const metadata: Metadata = {
  title: "TurboQuant: A Complete Technical Deep Dive",
  description: "A visual, equation-first guide to TurboQuant's algorithms, proofs, rate-distortion guarantees, KV-cache results, ANN experiments, and deployment tradeoffs."
};

const sections = [
  ["problem", "Problem"],
  ["landscape", "Landscape"],
  ["geometry", "Foundations"],
  ["mse", "MSE quantizer"],
  ["inner-product", "Inner product"],
  ["guarantees", "Guarantees"],
  ["experiments", "Experiments"],
  ["engineering", "Deployment"],
  ["limits", "Limits"]
];

const headlineStats: Array<{
  value?: string;
  formula?: string;
  label: string;
  labelFormula?: string;
  detail: string;
  featured?: boolean;
}> = [
  {
    formula: "4^{-b}",
    label: "distortion rate",
    detail: "Each additional bit divides the theoretical distortion by four.",
    featured: true
  },
  {
    formula: "2.7\\times",
    label: "worst-case gap",
    detail: "Maximum constant-factor gap from the information-theoretic MSE lower bound."
  },
  {
    formula: "3.5",
    label: "bits / channel",
    detail: "Matches the full-cache LongBench average for Llama-3.1-8B-Instruct."
  },
  {
    formula: "0.0021\\,\\mathrm{s}",
    label: "embedding dimension",
    labelFormula: "d=3072",
    detail: "Reported 4-bit quantization time for TurboQuant."
  }
];

type AlgorithmStep = {
  label: string;
  title: string;
  formula: string;
  explanation: ReactNode;
};

const mseAlgorithm: AlgorithmStep[] = [
  {
    label: "setup",
    title: "Create a shared random rotation",
    formula: "\\boldsymbol{\\Pi}\\in\\mathbb{R}^{d\\times d},\\qquad \\boldsymbol{\\Pi}^{\\mathsf T}\\boldsymbol{\\Pi}=\\mathbf{I}",
    explanation: "Generate a Gaussian matrix and take its QR decomposition. The resulting orthogonal matrix is fixed and shared by the encoder and decoder."
  },
  {
    label: "codebook",
    title: "Precompute optimal scalar centroids",
    formula: "\\mathcal{K}_b=\\{c_1,\\ldots,c_{2^b}\\}",
    explanation: <>Run the one-dimensional Lloyd-Max optimization once to obtain the <InlineMath formula={"2^b"} /> reconstruction levels that best fit the rotated-coordinate density.</>
  },
  {
    label: "rotate",
    title: "Regularize the input coordinates",
    formula: "\\mathbf{u}=\\boldsymbol{\\Pi}\\mathbf{x}",
    explanation: "The rotation maps any fixed unit vector to a uniformly random point on the sphere, so every coordinate follows the same known distribution."
  },
  {
    label: "encode",
    title: "Replace each coordinate with an index",
    formula: "\\operatorname{idx}_j=\\underset{k\\in[2^b]}{\\arg\\min}\\,|u_j-c_k|",
    explanation: "Each rotated coordinate independently selects its nearest centroid. The stored value is only a b-bit integer index."
  },
  {
    label: "decode",
    title: "Recover centroids and rotate back",
    formula: "\\widetilde{u}_j=c_{\\operatorname{idx}_j},\\qquad \\widetilde{\\mathbf{x}}=\\boldsymbol{\\Pi}^{\\mathsf T}\\widetilde{\\mathbf{u}}",
    explanation: "Look up every selected centroid to reconstruct the rotated vector, then apply the inverse rotation to return to the original coordinate system."
  }
];

const productAlgorithm: AlgorithmStep[] = [
  {
    label: "base",
    title: "Reserve one bit for bias correction",
    formula: "Q_{\\mathrm{mse}}\\text{ uses }b-1\\text{ bits per coordinate}",
    explanation: "The first stage spends most of the budget on a low-MSE reconstruction and leaves one bit per coordinate for the residual sketch."
  },
  {
    label: "residual",
    title: "Isolate what reconstruction missed",
    formula: "\\mathbf{r}=\\mathbf{x}-Q_{\\mathrm{mse}}^{-1}\\!\\left(Q_{\\mathrm{mse}}(\\mathbf{x})\\right)",
    explanation: "Because the MSE stage already captures most of the vector, the remaining residual has small Euclidean norm."
  },
  {
    label: "one bit",
    title: "Sketch the residual direction",
    formula: "\\mathbf{z}=\\operatorname{sign}(\\mathbf{S}\\mathbf{r}),\\qquad S_{ij}\\overset{\\mathrm{i.i.d.}}{\\sim}\\mathcal{N}(0,1)",
    explanation: "QJL converts each projected residual coordinate to one sign bit while retaining an unbiased inner-product estimator."
  },
  {
    label: "payload",
    title: "Store the complete compressed representation",
    formula: "Q_{\\mathrm{prod}}(\\mathbf{x})=\\left(\\operatorname{idx},\\mathbf{z},\\gamma\\right),\\qquad \\gamma=\\lVert\\mathbf{r}\\rVert_2",
    explanation: "The payload contains the coarse centroid indices, the one-bit residual signs, and one scalar recording the residual magnitude."
  },
  {
    label: "decode",
    title: "Add the unbiased residual estimate",
    formula: "\\widetilde{\\mathbf{x}}=\\widetilde{\\mathbf{x}}_{\\mathrm{mse}}+\\frac{\\sqrt{\\pi/2}}{d}\\,\\gamma\\mathbf{S}^{\\mathsf T}\\mathbf{z}",
    explanation: "The decoded QJL correction restores the residual's expected contribution, making dot-product estimates unbiased."
  }
];

type Rate = { bits: string; formula: string };

type ProofStep = {
  marker: string;
  title: string;
  formula?: string;
  text: ReactNode;
};

const mseRates: Rate[] = [
  { bits: "b=1", formula: "0.360" },
  { bits: "b=2", formula: "0.117" },
  { bits: "b=3", formula: "0.030" },
  { bits: "b=4", formula: "0.009" }
];

const productRates: Rate[] = [
  { bits: "b=1", formula: "\\frac{1.570}{d}" },
  { bits: "b=2", formula: "\\frac{0.560}{d}" },
  { bits: "b=3", formula: "\\frac{0.180}{d}" },
  { bits: "b=4", formula: "\\frac{0.047}{d}" }
];

const needleFigures = [
  { image: 7, name: "SnapKV", score: "0.858" },
  { image: 8, name: "PyramidKV", score: "0.895" },
  { image: 9, name: "KIVI", score: "0.981" },
  { image: 10, name: "PolarQuant", score: "0.995" },
  { image: 11, name: "Full precision", score: "0.997" },
  { image: 12, name: "TurboQuant", score: "0.997" }
];

const longBenchRows = [
  {
    model: "Llama 3.1 8B",
    method: "Full Cache",
    kv: "16",
    scores: ["45.29", "45.16", "26.55", "68.38", "59.54", "46.28", "50.06"]
  },
  {
    model: "Llama 3.1 8B",
    method: "KIVI",
    kv: "3",
    scores: ["43.38", "37.99", "27.16", "68.38", "59.50", "44.68", "48.50"]
  },
  {
    model: "Llama 3.1 8B",
    method: "KIVI",
    kv: "5",
    scores: ["45.04", "45.70", "26.47", "68.57", "59.55", "46.41", "50.16"]
  },
  {
    model: "Llama 3.1 8B",
    method: "PolarQuant",
    kv: "3.9",
    scores: ["45.18", "44.48", "26.23", "68.25", "60.07", "45.24", "49.78"]
  },
  {
    model: "Llama 3.1 8B",
    method: "TurboQuant",
    kv: "2.5",
    scores: ["44.16", "44.96", "24.80", "68.01", "59.65", "45.76", "49.44"]
  },
  {
    model: "Llama 3.1 8B",
    method: "TurboQuant",
    kv: "3.5",
    scores: ["45.01", "45.31", "26.00", "68.63", "59.95", "46.17", "50.06"]
  },
  {
    model: "Mistral 7B",
    method: "Full Cache",
    kv: "16",
    scores: ["47.53", "49.06", "26.09", "66.83", "53.50", "47.90", "49.89"]
  },
  {
    model: "Mistral 7B",
    method: "TurboQuant",
    kv: "2.5",
    scores: ["48.38", "49.22", "24.91", "66.69", "53.17", "46.83", "49.62"]
  }
];

const timeRows = [
  ["Product Quantization", "37.04", "239.75", "494.42"],
  ["RabitQ", "597.25", "2267.59", "3957.19"],
  ["TurboQuant", "0.0007", "0.0013", "0.0021"]
];

const annFigures = [
  { image: 13, title: "GloVe", dimension: 200 },
  { image: 14, title: "OpenAI3", dimension: 1536 },
  { image: 15, title: "OpenAI3", dimension: 3072 }
];

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
    <div className="mb-8 min-w-0 max-w-4xl">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({
  label,
  formula,
  note,
  tone = "cyan"
}: {
  label: string;
  formula: string;
  note?: ReactNode;
  tone?: "cyan" | "purple" | "emerald";
}) {
  const tones = {
    cyan: "border-cyan-400/20 bg-cyan-400/5 text-cyan-100",
    purple: "border-purple-400/20 bg-purple-400/5 text-purple-100",
    emerald: "border-emerald-400/20 bg-emerald-400/5 text-emerald-100"
  };

  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border ${tones[tone]}`}>
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </div>
      <div className="overflow-x-auto px-5 py-7">
        <DisplayMath formula={formula} />
        {note && <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">{note}</p>}
      </div>
    </div>
  );
}

function DisplayMath({ formula, className = "" }: { formula: string; className?: string }) {
  return (
    <div
      className={`min-w-max text-lg text-current md:text-xl [&_.katex-display]:m-0 ${className}`}
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
      className={`inline-block text-current ${className}`}
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

function Algorithm({
  title,
  badge,
  steps,
  tone
}: {
  title: string;
  badge: string;
  steps: AlgorithmStep[];
  tone: "cyan" | "purple";
}) {
  const isCyan = tone === "cyan";

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
      <div className={`border-b p-6 ${isCyan ? "border-cyan-400/20 bg-cyan-400/5" : "border-purple-400/20 bg-purple-400/5"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className={`font-mono text-xs font-bold uppercase tracking-[0.25em] ${isCyan ? "text-cyan-300" : "text-purple-300"}`}>
              {badge}
            </p>
            <h3 className="mt-2 break-words text-xl font-black md:text-2xl">{title}</h3>
          </div>
          <Braces className={isCyan ? "text-cyan-300" : "text-purple-300"} size={30} />
        </div>
      </div>
      <div className="divide-y divide-slate-800">
        {steps.map((step, index) => (
          <div key={step.label} className="grid gap-4 p-5 sm:grid-cols-[48px_1fr]">
            <div>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl border font-mono text-xs font-black ${
                isCyan
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  : "border-purple-400/20 bg-purple-400/10 text-purple-300"
              }`}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{step.label}</span>
                <h4 className="font-bold text-slate-100">{step.title}</h4>
              </div>
              <div className={`mt-3 overflow-x-auto rounded-xl border px-4 py-3 ${
                isCyan
                  ? "border-cyan-400/15 bg-cyan-400/5 text-cyan-100"
                  : "border-purple-400/15 bg-purple-400/5 text-purple-100"
              }`}>
                <DisplayMath formula={step.formula} className="text-sm md:text-base" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{step.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FigureCard({
  image,
  title,
  alt,
  caption,
  square = false
}: {
  image: number;
  title: ReactNode;
  alt?: string;
  caption: ReactNode;
  square?: boolean;
}) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
      <div className={`flex items-center justify-center bg-white p-3 ${square ? "aspect-square" : "min-h-48"}`}>
        <Image
          src={`/images/resources/turboquant/figure-${image}.png`}
          alt={alt ?? (typeof title === "string" ? title : "TurboQuant paper figure")}
          width={1085}
          height={square ? 1085 : 271}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="border-t border-slate-800 p-5">
        <p className="font-bold text-slate-100">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{caption}</p>
      </figcaption>
    </figure>
  );
}

function RateGrid({
  title,
  rates,
  tone
}: {
  title: string;
  rates: Rate[];
  tone: "cyan" | "purple";
}) {
  return (
    <div className="min-w-0 rounded-3xl border border-slate-800 bg-[#101722] p-6">
      <p className={`font-mono text-xs font-bold uppercase tracking-[0.22em] ${tone === "cyan" ? "text-cyan-300" : "text-purple-300"}`}>
        {title}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {rates.map((rate) => (
          <div key={rate.bits} className="rounded-2xl border border-slate-800 bg-[#0d1117] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <InlineMath formula={rate.bits} />
            </div>
            <div className="mt-3 overflow-x-auto text-xl font-black text-white">
              <DisplayMath formula={rate.formula} className="text-lg md:text-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProofTrace({
  title,
  description,
  steps,
  tone = "cyan"
}: {
  title: string;
  description: ReactNode;
  steps: ProofStep[];
  tone?: "cyan" | "purple" | "emerald";
}) {
  const tones = {
    cyan: {
      border: "border-cyan-400/20",
      surface: "bg-cyan-400/5",
      text: "text-cyan-300",
      formula: "border-cyan-400/15 bg-cyan-400/5 text-cyan-100"
    },
    purple: {
      border: "border-purple-400/20",
      surface: "bg-purple-400/5",
      text: "text-purple-300",
      formula: "border-purple-400/15 bg-purple-400/5 text-purple-100"
    },
    emerald: {
      border: "border-emerald-400/20",
      surface: "bg-emerald-400/5",
      text: "text-emerald-300",
      formula: "border-emerald-400/15 bg-emerald-400/5 text-emerald-100"
    }
  };
  const selected = tones[tone];

  return (
    <div className={`min-w-0 overflow-hidden rounded-3xl border ${selected.border} bg-[#101722]`}>
      <div className={`border-b ${selected.border} ${selected.surface} p-6 md:p-7`}>
        <div className="flex items-center gap-3">
          <Workflow className={selected.text} size={25} />
          <p className={`font-mono text-xs font-bold uppercase tracking-[0.24em] ${selected.text}`}>proof trace</p>
        </div>
        <h3 className="mt-4 text-2xl font-black text-white">{title}</h3>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <div className="divide-y divide-slate-800">
        {steps.map((step) => (
          <div key={step.marker} className="grid min-w-0 gap-4 p-5 md:grid-cols-[150px_1fr] md:p-6">
            <div>
              <p className={`font-mono text-[10px] font-black uppercase tracking-[0.2em] ${selected.text}`}>{step.marker}</p>
              <p className="mt-2 text-sm font-bold text-slate-200">{step.title}</p>
            </div>
            <div className="min-w-0">
              {step.formula && (
                <div className={`overflow-x-auto rounded-xl border px-4 py-4 ${selected.formula}`}>
                  <DisplayMath formula={step.formula} className="text-sm md:text-base" />
                </div>
              )}
              <p className={`${step.formula ? "mt-3" : ""} text-sm leading-6 text-slate-400`}>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TurboQuantPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0d1117] font-sans text-white selection:bg-cyan-400/30">
      <SiteNav />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute left-[8%] top-36 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[160px]" />
        <div className="absolute right-[2%] top-[38rem] h-[560px] w-[560px] rounded-full bg-purple-500/10 blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <article className="relative z-10 w-full min-w-0 max-w-full">
        <header className="mx-auto w-full min-w-0 max-w-7xl px-6 pb-16 pt-32 md:px-8 md:pt-40">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-[#101722]/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-200"
          >
            <ArrowLeft size={14} />
            resources
          </Link>

          <div className="mt-10 grid min-w-0 items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">
                <Sparkles size={15} />
                technical paper deep dive
              </div>
              <h1 className="mt-7 text-5xl font-black tracking-tight md:text-7xl lg:text-8xl">
                Turbo
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Quant
                </span>
              </h1>
              <p className="mt-5 max-w-4xl break-words text-xl font-light leading-relaxed text-slate-300 md:text-2xl">
                Online vector quantization with near-optimal distortion, derived from first principles and traced all the way to KV-cache and vector-search results.
              </p>
            </div>

            <div className="min-w-0 rounded-3xl border border-slate-800 bg-[#101722]/90 p-6 shadow-[0_0_80px_-50px_rgba(34,211,238,0.9)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">arXiv:2504.19874v1</p>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                  28 Apr 2025
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black leading-tight">Online Vector Quantization with Near-optimal Distortion Rate</h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Amir Zandieh, Majid Daliri, Majid Hadian, Vahab Mirrokni
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Google Research, New York University, Google DeepMind
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href={links.html} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 font-mono text-xs text-cyan-200 transition hover:bg-cyan-400/15">
                  HTML <ExternalLink size={13} />
                </a>
                <a href={links.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-2 font-mono text-xs text-purple-200 transition hover:bg-purple-400/15">
                  PDF <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {headlineStats.map((stat) => (
              <div
                key={stat.label}
                className={`group relative min-h-40 overflow-hidden rounded-2xl border p-5 ${
                  stat.featured
                    ? "border-cyan-400/30 bg-gradient-to-br from-cyan-400/12 via-[#101722] to-[#101722] shadow-[0_0_50px_-38px_rgba(34,211,238,0.95)]"
                    : "border-slate-800 bg-[#101722]/85"
                }`}
              >
                {stat.featured && (
                  <>
                    <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
                    <svg viewBox="0 0 112 52" className="absolute right-4 top-5 h-12 w-24 opacity-65" aria-hidden="true">
                      <defs>
                        <linearGradient id="rateCurve" x1="0" x2="1">
                          <stop offset="0%" stopColor="#67e8f9" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                      <path d="M6 7 C24 18, 34 29, 50 37 C67 45, 83 47, 106 48" fill="none" stroke="url(#rateCurve)" strokeWidth="3" strokeLinecap="round" />
                      {[["6", "7"], ["30", "25"], ["53", "39"], ["78", "46"], ["106", "48"]].map(([cx, cy]) => (
                        <circle key={cx} cx={cx} cy={cy} r="2.5" fill="#67e8f9" />
                      ))}
                    </svg>
                  </>
                )}

                <div className="relative">
                  {stat.formula ? (
                    <div className="w-fit text-4xl font-black text-white">
                      <InlineMath formula={stat.formula} />
                    </div>
                  ) : (
                    <p className="font-mono text-3xl font-black text-white">{stat.value}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${stat.featured ? "bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.9)]" : "bg-cyan-400"}`} />
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                      {stat.labelFormula ? <InlineMath formula={stat.labelFormula} /> : stat.label}
                    </p>
                  </div>
                  <p className="mt-3 max-w-[18rem] text-xs leading-5 text-slate-500">{stat.detail}</p>
                  {stat.featured && (
                    <div className="mt-4 inline-flex rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                      <InlineMath formula={"b\\!+\\!1\\quad\\Longrightarrow\\quad D/4"} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]/90">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="border-b border-slate-800 p-6 md:p-8 lg:border-b-0 lg:border-r">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300">read this first</p>
                <h2 className="mt-3 text-2xl font-black md:text-3xl">The paper in sixty seconds</h2>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  LLM serving and vector search move enormous collections of high-dimensional vectors. Storing them at full precision is expensive, but naive low-bit rounding can damage distances and dot products. TurboQuant builds a fast online compressor with a provable error rate.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    ["MSE", "reconstruction"],
                    ["dot product", "attention + search"],
                    ["online", "no dataset training"]
                  ].map(([name, meaning]) => (
                    <div key={name} className="rounded-xl border border-slate-800 bg-[#0d1117] px-3 py-2">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">{name}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2">
                {[
                  {
                    number: "01",
                    title: "Make coordinates predictable",
                    formula: "\\mathbf{u}=\\boldsymbol{\\Pi}\\mathbf{x}",
                    text: "A random rotation removes dependence on the original direction and gives every coordinate the same known distribution."
                  },
                  {
                    number: "02",
                    title: "Quantize one coordinate at a time",
                    formula: "u_j\\longrightarrow c_{\\operatorname{idx}_j}",
                    text: <>A precomputed Lloyd-Max codebook maps each coordinate to one of <InlineMath formula={"2^b"} /> centroids.</>
                  },
                  {
                    number: "03",
                    title: "Choose the required contract",
                    formula: "Q_{\\mathrm{mse}}\\quad\\text{or}\\quad Q_{\\mathrm{prod}}",
                    text: "The first minimizes reconstruction error. The second adds a residual sketch for unbiased dot products."
                  },
                  {
                    number: "04",
                    title: "Get exponential error decay",
                    formula: "D\\propto4^{-b}",
                    text: "Each extra bit per coordinate reduces the theoretical distortion by a factor of four."
                  }
                ].map((item, index) => (
                  <div
                    key={item.number}
                    className={`p-6 ${index < 2 ? "border-b border-slate-800" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-slate-800" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] font-black text-purple-300">{item.number}</span>
                      <div className="text-sm text-cyan-100">
                        <InlineMath formula={item.formula} />
                      </div>
                    </div>
                    <h3 className="mt-4 font-black text-slate-100">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </header>

        <nav className="sticky top-[76px] z-40 border-y border-slate-800/80 bg-[#0d1117]/90 backdrop-blur-xl">
          <div className="mx-auto flex w-full min-w-0 max-w-7xl gap-2 overflow-x-auto px-6 py-3 md:px-8">
            {sections.map(([id, label], index) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-slate-800 bg-[#101722] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-200"
              >
                <span className="text-cyan-400">{String(index + 1).padStart(2, "0")}</span>
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mx-auto w-full min-w-0 max-w-7xl space-y-28 px-6 py-20 md:px-8">
          <section id="problem" className="scroll-mt-40">
            <SectionHeading
              eyebrow="01 / Problem contract"
              title="What exactly is being compressed?"
              description={
                <>
                  TurboQuant accepts a worst-case vector <InlineMath formula={"\\mathbf{x}\\in\\mathbb{R}^d"} /> and emits only <InlineMath formula={"b"} /> bits per coordinate. The decoded vector must either remain close in Euclidean distance or preserve its dot product with an arbitrary query vector.
                </>
              }
            />

            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 px-5 py-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">notation used throughout this page</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-slate-800 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { formula: "\\mathbf{x}", label: "source vector" },
                  { formula: "\\widetilde{\\mathbf{x}}", label: "decoded vector" },
                  { formula: "\\mathbf{y}", label: "query vector" },
                  { formula: "\\mathbf{u}=\\boldsymbol{\\Pi}\\mathbf{x}", label: "rotated coordinates" },
                  { formula: "d", label: "vector dimension" },
                  { formula: "b", label: "bits per coordinate" }
                ].map((item) => (
                  <div key={item.label} className="p-4 text-center">
                    <div className="text-lg text-cyan-100"><InlineMath formula={item.formula} /></div>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-3xl border border-slate-800 bg-[#101722] p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <Variable className="text-cyan-300" size={24} />
                </div>
                <h3 className="mt-6 text-2xl font-black">The compression map</h3>
                <p className="mt-4 leading-7 text-slate-400">
                  A randomized encoder maps a real vector into a binary payload containing <InlineMath formula={"bd"} className="text-slate-200" /> bits in total. A matching decoder reconstructs a vector in the original space.
                </p>
                <div className="mt-6 space-y-3 overflow-x-auto rounded-2xl border border-slate-800 bg-[#0d1117] p-5 text-cyan-100">
                  <DisplayMath formula={"Q:\\mathbb{R}^d\\rightarrow\\{0,1\\}^{bd}"} className="text-base" />
                  <DisplayMath formula={"Q^{-1}:\\{0,1\\}^{bd}\\rightarrow\\mathbb{R}^d"} className="text-base" />
                </div>
              </div>

              <div className="grid gap-5">
                <Equation
                  label="Objective A / reconstruction MSE"
                  formula={"D_{\\mathrm{mse}}=\\mathbb{E}\\!\\left[\\left\\lVert\\mathbf{x}-\\widetilde{\\mathbf{x}}\\right\\rVert_2^2\\right]"}
                  note="Use this objective when the decoded vector itself must remain close to the original."
                />
                <Equation
                  label="Objective B / inner-product distortion"
                  tone="purple"
                  formula={"D_{\\mathrm{prod}}=\\mathbb{E}\\!\\left[\\left|\\langle\\mathbf{y},\\mathbf{x}\\rangle-\\langle\\mathbf{y},\\widetilde{\\mathbf{x}}\\rangle\\right|^2\\right]"}
                  note="Use this objective when attention scores, cosine similarity, or nearest-neighbor ranking must remain accurate."
                />
                <Equation
                  label="Required for inner-product use cases"
                  tone="emerald"
                  note="The expectation is over the quantizer's randomness. This condition matters for repeated attention and retrieval estimates because systematic error does not average away."
                  formula={"\\mathbb{E}\\!\\left[\\langle\\mathbf{y},\\widetilde{\\mathbf{x}}\\rangle\\right]=\\langle\\mathbf{y},\\mathbf{x}\\rangle"}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <MemoryStick size={22} />,
                  title: "KV cache",
                  text: "Compress keys and values online as tokens arrive while preserving attention geometry."
                },
                {
                  icon: <Database size={22} />,
                  title: "Vector databases",
                  text: "Reduce index memory without destroying inner-product or cosine-similarity rankings."
                },
                {
                  icon: <Cpu size={22} />,
                  title: "Accelerator path",
                  text: "Use data-oblivious, vectorizable operations instead of per-dataset codebook training."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                  <div className="text-cyan-300">{item.icon}</div>
                  <h3 className="mt-4 font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="landscape" className="scroll-mt-40">
            <SectionHeading
              eyebrow="02 / Research landscape"
              title="The paper sits at the intersection of rate-distortion theory and online ML systems."
              description="TurboQuant is easier to understand once the alternatives are separated by when they learn, what they preserve, and whether their operations map cleanly to accelerators. The central target is a quantizer that is data-oblivious, online, vectorizable, and close to the information-theoretic distortion limit."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  era: "1948-1959",
                  name: "Shannon",
                  title: "What distortion is theoretically unavoidable?",
                  text: "Rate-distortion theory relates a finite information budget to the smallest possible expected reconstruction error, without prescribing an implementation."
                },
                {
                  era: "1963-1979",
                  name: "Zador + Gersho",
                  title: "What happens at high rate?",
                  text: "High-resolution analysis and lattice ideas sharpen the asymptotic picture, but practical encoding can still require an expensive nearest-codeword search."
                },
                {
                  era: "modern systems",
                  name: "PQ + online VQ",
                  title: "Can the theory become a fast primitive?",
                  text: "Product Quantization makes vector search practical through learned subspace codebooks; newer data-oblivious methods target dynamic KV caches and zero-training indexes."
                }
              ].map((item, index) => (
                <div key={item.name} className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#101722] p-6">
                  <div className={`absolute left-0 top-0 h-1 w-full ${index === 0 ? "bg-cyan-400" : index === 1 ? "bg-purple-400" : "bg-emerald-400"}`} />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{item.era}</p>
                  <p className="mt-4 text-sm font-black uppercase tracking-widest text-cyan-300">{item.name}</p>
                  <h3 className="mt-3 text-xl font-black leading-snug text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 p-6 md:p-7">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-purple-300">method map</p>
                <h3 className="mt-2 text-2xl font-black">Five quantizers, five different contracts</h3>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
                  “Online” means a new vector can be encoded without fitting the quantizer to the dataset first. Shared random transforms and precomputed scalar centroids are setup state, not per-dataset training.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-[#0d1117] font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Method</th>
                      <th className="px-5 py-4">Data learned?</th>
                      <th className="px-5 py-4">Online?</th>
                      <th className="px-5 py-4">Core mechanism</th>
                      <th className="px-5 py-4">Primary contract</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Product Quantization", "Yes", "No", "Blockwise k-means codebooks", "Compact ANN index"],
                      ["RabitQ", "No", "Yes", "Projected grid plus search", "Data-oblivious ANN quantization"],
                      ["QJL", "No", "Yes", "Gaussian projection plus one sign bit", "Unbiased one-bit dot products"],
                      ["TurboQuant MSE", "No", "Yes", "Random rotation plus Lloyd-Max codes", "Near-optimal reconstruction MSE"],
                      ["TurboQuant product", "No", "Yes", "MSE stage plus one-bit residual QJL", "Unbiased, near-optimal dot products"]
                    ].map((row) => (
                      <tr key={row[0]} className={`border-t border-slate-800 ${row[0].startsWith("TurboQuant") ? "bg-cyan-400/5" : ""}`}>
                        <td className={`px-5 py-5 font-bold ${row[0].startsWith("TurboQuant") ? "text-cyan-200" : "text-slate-200"}`}>{row[0]}</td>
                        <td className="px-5 py-5 font-mono text-slate-400">{row[1]}</td>
                        <td className="px-5 py-5 font-mono text-slate-400">{row[2]}</td>
                        <td className="px-5 py-5 text-slate-400">{row[3]}</td>
                        <td className="px-5 py-5 text-slate-300">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-4 border-t border-slate-800 p-6 md:grid-cols-2 md:p-7">
                <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
                  <p className="font-bold text-amber-100">Why ordinary PQ is not the target</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Its learned codebooks can be excellent for a fixed database, but the indexing phase needs clustering and must be repeated when the data distribution changes.</p>
                </div>
                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5">
                  <p className="font-bold text-cyan-100">Why QJL alone is not the answer</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">QJL supplies the unbiased one-bit estimator. TurboQuant first shrinks the residual with an MSE code, then applies QJL only to that smaller signal.</p>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-5 lg:grid-cols-3">
              {[
                {
                  title: "Token selection",
                  methods: "SnapKV, PyramidKV",
                  text: "Keep a subset of cached tokens. Memory falls because entries disappear, but a relevant key can be evicted."
                },
                {
                  title: "Scalar KV quantization",
                  methods: "KIVI",
                  text: "Keep every token but reduce numerical precision. The geometry is governed by the scalar quantizer and outlier handling."
                },
                {
                  title: "Geometric quantization",
                  methods: "PolarQuant, TurboQuant",
                  text: "Transform vectors before coding so the compressed cache better preserves the structure used by attention."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">{item.methods}</p>
                  <h3 className="mt-3 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="geometry" className="scroll-mt-40">
            <SectionHeading
              eyebrow="03 / Mathematical foundations"
              title="Rotation turns a worst-case vector into a known distribution."
              description="The key move is not quantization itself. It is changing coordinates so a fixed adversarial vector becomes statistically regular, letting a high-dimensional problem collapse into the same one-dimensional scalar problem repeated d times."
            />

            <div className="mb-7 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-purple-300" size={25} />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-purple-300">rate-distortion prerequisite</p>
                </div>
                <h3 className="mt-4 text-2xl font-black">Why the target rate is <InlineMath formula={"4^{-b}"} /></h3>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
                  Let <InlineMath formula={"B"} /> be the total number of encoded bits and <InlineMath formula={"h(\\mathbf{x})"} /> the source&apos;s differential entropy. Shannon&apos;s lower bound says no encoder-decoder pair with mutual information at most <InlineMath formula={"B"} /> can beat the first expression below.
                </p>
              </div>
              <div className="grid divide-y divide-slate-800 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                <div className="min-w-0 p-5 md:p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">01 / arbitrary source</p>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-[#0d1117] p-4 text-cyan-100">
                    <DisplayMath formula={"\\begin{aligned}D(p_X,B)&\\ge\\frac{d}{2\\pi e}\\\\[-1pt]&\\quad\\cdot2^{\\frac{2}{d}(h(\\mathbf{x})-B)}\\end{aligned}"} className="text-sm md:text-base" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">This is a universal information bound, not a property of TurboQuant.</p>
                </div>
                <div className="min-w-0 p-5 md:p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">02 / uniform sphere source</p>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-[#0d1117] p-4 text-purple-100">
                    <DisplayMath formula={"D(B)\\ge 2^{-2B/d}"} className="text-sm md:text-base" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Substituting the sphere&apos;s surface area into Shannon&apos;s bound and applying Stirling&apos;s approximation removes the entropy term.</p>
                </div>
                <div className="min-w-0 p-5 md:p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">03 / b bits per coordinate</p>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4 text-emerald-100">
                    <DisplayMath formula={"B=bd\\quad\\Longrightarrow\\quad D\\ge2^{-2b}=4^{-b}"} className="text-sm md:text-base" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">One extra bit doubles the number of levels along each scalar axis; squared error therefore falls by a factor of four.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#101722] p-5 md:p-7">
                <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]" />
                <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-400/8 blur-[90px]" />

                <div className="relative">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">geometric signal flow</p>
                      <p className="mt-2 text-sm text-slate-500">One vector, two transforms, one reusable scalar codebook.</p>
                    </div>
                    <span className="rounded-full border border-slate-700 bg-[#0d1117] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
                      online path
                    </span>
                  </div>

                  <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_62px_1fr_62px_1fr]">
                    <div className="group relative overflow-hidden rounded-2xl border border-rose-400/20 bg-[#0d1117] p-5">
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-400/10 blur-2xl" />
                      <div className="relative flex h-full min-h-52 flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-rose-300">01 / input</span>
                          <Variable className="text-rose-300/70" size={18} />
                        </div>
                        <div className="my-auto py-6 text-center text-3xl text-rose-100">
                          <InlineMath formula={"\\mathbf{x}\\in\\mathbb{S}^{d-1}"} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">Arbitrary direction</p>
                          <p className="mt-2 text-xs leading-5 text-slate-500">A fixed, potentially adversarial unit vector with no coordinate assumptions.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 py-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                        <RotateCw size={18} />
                      </div>
                      <div className="relative h-8 w-px bg-gradient-to-b from-cyan-400/60 to-purple-400/30 lg:h-px lg:w-full lg:bg-gradient-to-r">
                        <span className="absolute -bottom-1 -right-0 h-2 w-2 rotate-45 border-r border-t border-purple-300/70 lg:-right-0.5 lg:-top-1" />
                      </div>
                      <p className="text-center font-mono text-[8px] font-bold uppercase leading-4 tracking-[0.14em] text-slate-500">
                        Haar
                        <span className="block">rotation</span>
                      </p>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#0d1117] p-5 shadow-[0_0_45px_-36px_rgba(34,211,238,0.9)]">
                      <div className="absolute left-1/2 top-[46%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />
                      <div className="absolute left-1/2 top-[46%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15" />
                      <div className="relative flex h-full min-h-52 flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">02 / regularize</span>
                          <RotateCw className="text-cyan-300/70" size={18} />
                        </div>
                        <div className="my-auto py-6 text-center text-3xl text-cyan-100">
                          <InlineMath formula={"\\mathbf{u}=\\boldsymbol{\\Pi}\\mathbf{x}"} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">Uniform sphere point</p>
                          <p className="mt-2 text-xs leading-5 text-slate-500">Coordinates now follow the known Beta law and approach Gaussian behavior.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 py-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                        <Binary size={18} />
                      </div>
                      <div className="relative h-8 w-px bg-gradient-to-b from-cyan-400/40 to-purple-400/60 lg:h-px lg:w-full lg:bg-gradient-to-r">
                        <span className="absolute -bottom-1 -right-0 h-2 w-2 rotate-45 border-r border-t border-purple-300/70 lg:-right-0.5 lg:-top-1" />
                      </div>
                      <p className="text-center font-mono text-[8px] font-bold uppercase leading-4 tracking-[0.14em] text-slate-500">
                        scalar
                        <span className="block">quantize</span>
                      </p>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-purple-400/25 bg-[#0d1117] p-5 shadow-[0_0_45px_-36px_rgba(168,85,247,0.9)]">
                      <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-purple-400/10 blur-2xl" />
                      <div className="relative flex h-full min-h-52 flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-purple-300">03 / encode</span>
                          <Binary className="text-purple-300/70" size={18} />
                        </div>
                        <div className="my-auto py-5 text-center">
                          <div className="text-3xl text-purple-100">
                            <InlineMath formula={"q(\\mathbf{u})"} />
                          </div>
                          <div className="mt-4 flex justify-center gap-1.5">
                            {["01", "11", "00", "10"].map((code) => (
                              <span key={code} className="rounded-md border border-purple-400/20 bg-purple-400/10 px-2 py-1 font-mono text-[9px] text-purple-200">
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">Centroid indices</p>
                          <p className="mt-2 text-xs leading-5 text-slate-500">Each regularized coordinate becomes a compact b-bit scalar code.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {[
                      {
                        title: "isotropic",
                        text: <>Every direction is treated symmetrically after a Haar-random rotation.</>
                      },
                      {
                        title: "concentrated",
                        text: <>Each coordinate has variance <InlineMath formula={"1/d"} />, so most probability mass lies close to zero.</>
                      },
                      {
                        title: "near-independent",
                        text: <>Distinct coordinates become nearly independent as <InlineMath formula={"d"} /> grows.</>
                      }
                    ].map((item) => (
                      <div key={item.title} className="border-l border-cyan-400/30 pl-4">
                        <p className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-300">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <Equation
                  label="Coordinate density on the unit hypersphere"
                  note={<>As <InlineMath formula={"d\\to\\infty"} />, this scaled Beta density converges to <InlineMath formula={"\\mathcal{N}(0,1/d)"} />. That known source distribution makes a universal precomputed scalar codebook possible.</>}
                  formula={"\\begin{aligned}f_X(t)&=\\frac{\\Gamma(d/2)}{\\sqrt{\\pi}\\,\\Gamma((d-1)/2)}\\\\[-2pt]&\\quad\\cdot\\left(1-t^2\\right)^{(d-3)/2},\\qquad t\\in[-1,1]\\end{aligned}"}
                />
                <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-purple-300">why this matters</p>
                  <p className="mt-4 text-lg leading-8 text-slate-300">
                    The same centroids can be computed once for a chosen <InlineMath formula={"(d,b)"} className="text-white" /> pair and reused for every vector. There is no per-dataset k-means stage in the online path.
                  </p>
                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                    <Check className="shrink-0 text-emerald-300" size={20} />
                    <p className="text-sm text-slate-300">Worst-case input &rarr; random sphere point &rarr; repeated scalar quantization.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <ProofTrace
                title="Where the Beta coordinate law comes from"
                description="This lemma is the bridge from a worst-case vector to a reusable scalar quantizer. The proof is geometric: fix one coordinate and measure how much sphere remains for all the others."
                steps={[
                  {
                    marker: "invariance",
                    title: "Randomize direction",
                    formula: "\\mathbf{u}=\\boldsymbol{\\Pi}\\mathbf{x}\\sim\\operatorname{Unif}(\\mathbb{S}^{d-1})",
                    text: "A Haar-random orthogonal matrix sends any fixed unit vector to a uniformly random direction. The input can be adversarial; the distribution after rotation is still known."
                  },
                  {
                    marker: "sphere slice",
                    title: "Condition on one coordinate",
                    formula: "u_j=t\\quad\\Longrightarrow\\quad\\sum_{k\\ne j}u_k^2=1-t^2",
                    text: <>The remaining <InlineMath formula={"d-1"} /> coordinates lie on a sphere of radius <InlineMath formula={"\\sqrt{1-t^2}"} />. Its area contributes a power of <InlineMath formula={"(1-t^2)"} />, and the surface-angle Jacobian contributes <InlineMath formula={"1/\\sqrt{1-t^2}"} />.</>
                  },
                  {
                    marker: "normalize",
                    title: "Divide by total sphere area",
                    formula: "f_X(t)=\\frac{\\Gamma(d/2)}{\\sqrt{\\pi}\\,\\Gamma((d-1)/2)}(1-t^2)^{(d-3)/2}",
                    text: "The Gamma-function ratio is exactly the normalizing constant that makes the density integrate to one on [-1, 1]."
                  },
                  {
                    marker: "high dimension",
                    title: "Use concentration",
                    formula: "\\sqrt d\\,u_j\\Rightarrow\\mathcal{N}(0,1)\\qquad\\text{and}\\qquad u_j\\approx\\mathcal{N}(0,1/d)",
                    text: "Most coordinates are small and concentrated near zero. Distinct coordinates become nearly independent in high dimension, although the expected-MSE proof later needs only identical marginals, not full independence."
                  }
                ]}
              />
            </div>
          </section>

          <section id="mse" className="scroll-mt-40">
            <SectionHeading
              eyebrow="04 / MSE variant"
              title="Optimal scalar codes after rotation."
              description={
                <>
                  <InlineMath formula={"Q_{\\mathrm{mse}}"} /> minimizes reconstruction error. It partitions the coordinate interval into <InlineMath formula={"2^b"} /> Voronoi cells and uses Lloyd-Max centroids optimized for the exact rotated-coordinate density.
                </>
              }
            />

            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <Algorithm title="MSE-optimized quantization" badge="Algorithm 1" steps={mseAlgorithm} tone="cyan" />

              <div className="space-y-5">
                <Equation
                  label="Continuous 1D k-means objective"
                  note="Each boundary is the midpoint between neighboring centroids. The integral measures density-weighted squared reconstruction error within that Voronoi cell."
                  formula={"\\begin{aligned}m_i&=\\frac{c_i+c_{i+1}}{2},\\\\[4pt]\\mathcal{C}(f_X,b)&=\\min_{\\substack{-1\\le c_1\\le\\cdots\\\\\\le c_{2^b}\\le1}}\\sum_{i=1}^{2^b}\\int_{m_{i-1}}^{m_i}(t-c_i)^2f_X(t)\\,dt\\end{aligned}"}
                />

                <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">example codebooks</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-4">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500"><InlineMath formula={"b=1"} /></div>
                      <div className="mt-3 overflow-x-auto text-slate-200">
                        <DisplayMath formula={"\\mathcal{K}_1=\\left\\{\\pm\\frac{\\sqrt{2/\\pi}}{\\sqrt d}\\right\\}"} className="text-base" />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-4">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500"><InlineMath formula={"b=2"} /></div>
                      <div className="mt-3 overflow-x-auto text-slate-200">
                        <DisplayMath formula={"\\mathcal{K}_2=\\left\\{\\pm\\frac{0.453}{\\sqrt d},\\ \\pm\\frac{1.51}{\\sqrt d}\\right\\}"} className="text-base" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-transparent p-7">
                <div className="flex items-center gap-3">
                  <Sigma className="text-cyan-300" size={26} />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Theorem 1</p>
                </div>
                <h3 className="mt-5 text-2xl font-black">MSE performance guarantee</h3>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-cyan-400/15 bg-[#0d1117]/80 p-5 text-cyan-100">
                  <DisplayMath formula={"D_{\\mathrm{mse}}\\le\\frac{\\sqrt{3}\\,\\pi}{2}\\,4^{-b}"} />
                </div>
                <p className="mt-5 leading-7 text-slate-400">
                  Rotation preserves the L2 norm, so the vector error is exactly the sum of d identical scalar errors:
                  <InlineMath formula={"D_{\\mathrm{mse}}=d\\,\\mathcal{C}(f_X,b)"} className="ml-2 text-slate-200" />.
                  The Panter-Dite high-resolution formula gives the stated upper bound.
                </p>
              </div>
              <RateGrid title="Numerically optimized low-bit MSE" rates={mseRates} tone="cyan" />
            </div>

            <div className="mt-7">
              <ProofTrace
                title="Deriving the MSE theorem, line by line"
                description="The proof contains no hidden vector approximation. Orthogonality converts the vector error exactly into scalar coordinate errors; the only approximation is the numerical or high-rate evaluation of the optimal scalar cost."
                steps={[
                  {
                    marker: "step 1",
                    title: "Move into the rotated basis",
                    formula: "\\lVert\\mathbf{x}-\\widetilde{\\mathbf{x}}\\rVert_2^2=\\lVert\\boldsymbol{\\Pi}\\mathbf{x}-\\widetilde{\\mathbf{u}}\\rVert_2^2=\\lVert\\mathbf{u}-\\widetilde{\\mathbf{u}}\\rVert_2^2",
                    text: <>Because <InlineMath formula={"\\boldsymbol{\\Pi}^{\\mathsf T}\\boldsymbol{\\Pi}=\\mathbf I"} />, rotation preserves every Euclidean distance. Analyzing reconstruction after rotation is therefore exact.</>
                  },
                  {
                    marker: "step 2",
                    title: "Expand the squared norm",
                    formula: "D_{\\mathrm{mse}}=\\sum_{j=1}^{d}\\mathbb E\\!\\left[(u_j-c_{\\operatorname{idx}_j})^2\\right]",
                    text: "Each coordinate is reconstructed by the centroid of its Voronoi cell. Linearity of expectation lets the proof sum coordinate costs even though sphere coordinates are not exactly independent."
                  },
                  {
                    marker: "step 3",
                    title: "Use identical marginals",
                    formula: "u_j\\sim f_X\\ \\forall j\\qquad\\Longrightarrow\\qquad D_{\\mathrm{mse}}=d\\,\\mathcal C(f_X,b)",
                    text: "Every coordinate has the same Beta density, and every coordinate uses the same optimal codebook. The d terms are identical."
                  },
                  {
                    marker: "Lloyd-Max",
                    title: "Characterize the scalar optimum",
                    formula: "m_i=\\frac{c_i+c_{i+1}}2,\\qquad c_i=\\frac{\\int_{m_{i-1}}^{m_i}t f_X(t)\\,dt}{\\int_{m_{i-1}}^{m_i}f_X(t)\\,dt}",
                    text: "Nearest-centroid boundaries sit halfway between adjacent reconstruction levels; each optimal level is the conditional mean inside its cell. Alternating these updates solves the one-dimensional continuous k-means problem numerically."
                  },
                  {
                    marker: "high rate",
                    title: "Apply Panter-Dite",
                    formula: "\\mathcal C(f_X,b)\\le\\frac1{12}\\left(\\int f_X(t)^{1/3}\\,dt\\right)^3 4^{-b}=\\frac{\\sqrt3\\pi}{2d}\\,4^{-b}",
                    text: <>Multiplying the scalar bound by <InlineMath formula={"d"} /> gives Theorem 1. For <InlineMath formula={"b\\in\\{1,2,3,4\\}"} />, the paper instead solves the scalar objective numerically to report the tighter values shown above.</>
                  }
                ]}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
              <div className="flex items-start gap-4">
                <TriangleAlert className="mt-0.5 shrink-0 text-amber-300" size={22} />
                <div>
                  <p className="font-bold text-amber-100">Entropy coding is possible, but intentionally omitted.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    At <InlineMath formula={"b=4"} />, codebook-index entropy is about <InlineMath formula={"3.8"} /> bits and optimal prefix coding saves roughly 5%. The authors leave it out to preserve simplicity and speed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="inner-product" className="scroll-mt-40">
            <SectionHeading
              eyebrow="05 / Inner-product variant"
              title="MSE quality is not enough for attention or retrieval."
              description={
                <>
                  A reconstruction can have low Euclidean error and still produce systematically biased dot products. <InlineMath formula={"Q_{\\mathrm{prod}}"} /> fixes that bias by applying a one-bit Quantized Johnson-Lindenstrauss transform to the residual left by <InlineMath formula={"Q_{\\mathrm{mse}}"} />.
                </>
              }
            />

            <div className="mb-7 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="border-b border-slate-800 p-6 md:p-7 lg:border-b-0 lg:border-r">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">why attention is an inner-product problem</p>
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5 text-cyan-100">
                    <DisplayMath
                      formula={"\\operatorname{Attn}(\\mathbf q_i,\\mathbf K_{:i},\\mathbf V_{:i})=\\operatorname{softmax}\\!\\left(\\frac{\\mathbf K_{:i}\\mathbf q_i}{\\sqrt d}\\right)^{\\!\\mathsf T}\\mathbf V_{:i}"}
                      className="text-sm md:text-base"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    Quantized keys perturb the logits inside softmax; quantized values perturb the vectors averaged after softmax. Preserving query-key dot products is therefore the direct contract for cache keys.
                  </p>
                </div>
                <div className="divide-y divide-slate-800">
                  <div className="p-6">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">systematic bias</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">A multiplicative score bias changes the softmax temperature and can reorder nearest-neighbor candidates. It does not disappear by averaging more queries.</p>
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">zero-mean noise</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">An unbiased estimator has no systematic score shift. Its remaining uncertainty is described by the product-error variance that TurboQuant minimizes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-7">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-rose-300">the one-bit failure mode</p>
                <h3 className="mt-4 text-2xl font-black"><InlineMath formula={"Q_{\\mathrm{mse}}"} /> is biased.</h3>
                <p className="mt-4 leading-7 text-slate-300">
                  For <InlineMath formula={"b=1"} />, the optimal MSE codebook reduces to a scaled sign quantizer. In high dimension, its expected inner product is:
                </p>
                <div className="mt-6 overflow-x-auto rounded-2xl border border-rose-400/15 bg-[#0d1117] p-5 text-rose-100">
                  <DisplayMath formula={"\\mathbb{E}\\!\\left[\\left\\langle\\mathbf{y},Q_{\\mathrm{mse}}^{-1}\\!\\left(Q_{\\mathrm{mse}}(\\mathbf{x})\\right)\\right\\rangle\\right]=\\frac{2}{\\pi}\\langle\\mathbf{y},\\mathbf{x}\\rangle"} className="text-base md:text-lg" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  The factor 2/&pi; is a multiplicative bias. More samples do not remove a systematic scaling error.
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-7">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">the residual repair</p>
                <h3 className="mt-4 text-2xl font-black">Spend the final bit where it matters.</h3>
                <p className="mt-4 leading-7 text-slate-300">
                  Use <InlineMath formula={"b-1"} /> bits for the low-MSE reconstruction, then encode the remaining residual direction with one QJL bit per coordinate. Because <InlineMath formula={"\\lVert\\mathbf{r}\\rVert_2"} /> is already small, the QJL variance is small too.
                </p>
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-[#0d1117] p-5">
                  <CircleDot className="shrink-0 text-emerald-300" size={22} />
                  <div className="text-sm text-emerald-100"><InlineMath formula={"\\mathbf{x}=\\widetilde{\\mathbf{x}}_{\\mathrm{mse}}+\\mathbf{r}"} /></div>
                  <ArrowRight className="text-slate-600" size={18} />
                  <div className="text-sm text-emerald-100"><InlineMath formula={"\\operatorname{sign}(\\mathbf{S}\\mathbf{r})"} /></div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-5">
                <Equation
                  label="QJL encoder"
                  tone="purple"
                  formula={"Q_{\\mathrm{qjl}}(\\mathbf{x})=\\operatorname{sign}(\\mathbf{S}\\mathbf{x}),\\qquad S_{ij}\\overset{\\mathrm{i.i.d.}}{\\sim}\\mathcal{N}(0,1)"}
                />
                <Equation
                  label="QJL decoder"
                  tone="purple"
                  formula={"Q_{\\mathrm{qjl}}^{-1}(\\mathbf{z})=\\frac{\\sqrt{\\pi/2}}{d}\\,\\mathbf{S}^{\\mathsf T}\\mathbf{z}"}
                />
                <Equation
                  label="QJL variance"
                  tone="emerald"
                  note={<>After scaling by <InlineMath formula={"\\lVert\\mathbf{r}\\rVert_2"} />, this variance is proportional to the residual energy left by the MSE stage.</>}
                  formula={"\\operatorname{Var}\\!\\left(\\left\\langle\\mathbf{y},Q_{\\mathrm{qjl}}^{-1}\\!\\left(Q_{\\mathrm{qjl}}(\\mathbf{x})\\right)\\right\\rangle\\right)\\le\\frac{\\pi}{2d}\\left\\lVert\\mathbf{y}\\right\\rVert_2^2"}
                />
              </div>
              <Algorithm title="Inner-product-optimized quantization" badge="Algorithm 2" steps={productAlgorithm} tone="purple" />
            </div>

            <div className="mt-7">
              <ProofTrace
                title="Why a vector of signs can estimate a dot product"
                description="QJL does not reconstruct the residual accurately in Euclidean distance. It constructs an unbiased random estimator of every query dot product, and averages d independent rows to control variance."
                tone="emerald"
                steps={[
                  {
                    marker: "one row",
                    title: "Define a scalar sample",
                    formula: "Z_i=\\sqrt{\\pi/2}\\,(\\mathbf{s}_i^{\\mathsf T}\\mathbf{y})\\,\\operatorname{sign}(\\mathbf{s}_i^{\\mathsf T}\\mathbf{x})",
                    text: <>Each Gaussian row <InlineMath formula={"\\mathbf{s}_i"} /> contributes one random estimate. Only the sign of its projection on the encoded vector must be stored.</>
                  },
                  {
                    marker: "Gaussian identity",
                    title: "Recover the direction in expectation",
                    formula: "\\mathbb E_{\\mathbf{s}}\\!\\left[\\mathbf{s}\\,\\operatorname{sign}(\\mathbf{s}^{\\mathsf T}\\mathbf{x})\\right]=\\sqrt{2/\\pi}\\,\\mathbf{x}",
                    text: <>For unit <InlineMath formula={"\\mathbf{x}"} />, the Gaussian&apos;s component parallel to <InlineMath formula={"\\mathbf{x}"} /> survives the sign operation while orthogonal components cancel by symmetry. The prefactor <InlineMath formula={"\\sqrt{\\pi/2}"} /> removes the remaining scale.</>
                  },
                  {
                    marker: "average",
                    title: "Combine d independent rows",
                    formula: "\\widehat p=\\frac1d\\sum_{i=1}^{d}Z_i=\\left\\langle\\mathbf{y},Q_{\\mathrm{qjl}}^{-1}(Q_{\\mathrm{qjl}}(\\mathbf{x}))\\right\\rangle",
                    text: <>Linearity now gives <InlineMath formula={"\\mathbb E[\\widehat p]=\\langle\\mathbf{y},\\mathbf{x}\\rangle"} /> exactly.</>
                  },
                  {
                    marker: "variance",
                    title: "Gain the 1/d factor",
                    formula: "\\operatorname{Var}(Z_i)\\le\\frac\\pi2\\lVert\\mathbf{y}\\rVert_2^2\\quad\\Longrightarrow\\quad\\operatorname{Var}(\\widehat p)\\le\\frac{\\pi}{2d}\\lVert\\mathbf{y}\\rVert_2^2",
                    text: "The estimator averages d independent samples. That is the source of the inverse-dimension variance factor used by TurboQuant's residual correction."
                  }
                ]}
              />
            </div>

            <div className="mt-6">
              <Equation
                label="Final unbiased estimator"
                tone="emerald"
                note="The first term estimates the coarse reconstruction. The second estimates the missing residual contribution. Conditional expectation makes their sum exactly unbiased."
                formula={"\\left\\langle\\mathbf{y},\\widetilde{\\mathbf{x}}_{\\mathrm{mse}}\\right\\rangle+\\lVert\\mathbf{r}\\rVert_2\\left\\langle\\mathbf{y},Q_{\\mathrm{qjl}}^{-1}\\!\\left(Q_{\\mathrm{qjl}}(\\mathbf{r})\\right)\\right\\rangle"}
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-400/10 to-transparent p-7">
                <div className="flex items-center gap-3">
                  <Network className="text-purple-300" size={26} />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-purple-300">Theorem 2</p>
                </div>
                <h3 className="mt-5 text-2xl font-black">Unbiased inner-product guarantee</h3>
                <div className="mt-6 space-y-3">
                  <div className="overflow-x-auto rounded-2xl border border-purple-400/15 bg-[#0d1117]/80 p-5 text-purple-100">
                    <DisplayMath formula={"\\mathbb{E}\\!\\left[\\langle\\mathbf{y},\\widetilde{\\mathbf{x}}\\rangle\\right]=\\langle\\mathbf{y},\\mathbf{x}\\rangle"} className="text-base md:text-lg" />
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-purple-400/15 bg-[#0d1117]/80 p-5 text-purple-100">
                    <DisplayMath formula={"D_{\\mathrm{prod}}\\le\\frac{\\sqrt{3}\\,\\pi^2\\lVert\\mathbf{y}\\rVert_2^2}{d}\\,4^{-b}"} className="text-base md:text-lg" />
                  </div>
                </div>
                <p className="mt-5 leading-7 text-slate-400">
                  The proof reduces product distortion to residual MSE:
                  <InlineMath formula={"D_{\\mathrm{prod}}\\le\\frac{\\pi}{2d}\\lVert\\mathbf{y}\\rVert_2^2D_{\\mathrm{mse}}"} className="ml-2 text-slate-200" />.
                </p>
              </div>
              <RateGrid title="Low-bit product distortion" rates={productRates} tone="purple" />
            </div>

            <div className="mt-7">
              <ProofTrace
                title="Deriving unbiasedness and the product-error rate"
                description="Conditioning on the coarse MSE reconstruction freezes the residual. QJL is then the only remaining source of randomness, so its unbiasedness and variance bound can be inserted directly."
                tone="purple"
                steps={[
                  {
                    marker: "condition",
                    title: "Freeze the first stage",
                    formula: "\\mathbf{r}=\\mathbf{x}-\\widetilde{\\mathbf{x}}_{\\mathrm{mse}},\\qquad\\widetilde{\\mathbf{x}}=\\widetilde{\\mathbf{x}}_{\\mathrm{mse}}+\\widetilde{\\mathbf{x}}_{\\mathrm{qjl}}",
                    text: "Once the MSE reconstruction is fixed, the residual is a fixed vector and the QJL guarantee applies to its normalized direction."
                  },
                  {
                    marker: "unbiased",
                    title: "The two parts add back to x",
                    formula: "\\begin{aligned}\\mathbb E[\\langle\\mathbf y,\\widetilde{\\mathbf x}\\rangle\\mid\\widetilde{\\mathbf x}_{\\mathrm{mse}}]&=\\langle\\mathbf y,\\widetilde{\\mathbf x}_{\\mathrm{mse}}\\rangle+\\langle\\mathbf y,\\mathbf r\\rangle\\\\&=\\langle\\mathbf y,\\mathbf x\\rangle.\\end{aligned}",
                    text: "The law of total expectation removes the conditioning, proving unbiasedness over all quantizer randomness."
                  },
                  {
                    marker: "error",
                    title: "Only QJL variance remains",
                    formula: "\\mathbb E\\!\\left[|\\langle\\mathbf y,\\mathbf x\\rangle-\\langle\\mathbf y,\\widetilde{\\mathbf x}\\rangle|^2\\mid\\widetilde{\\mathbf x}_{\\mathrm{mse}}\\right]\\le\\frac{\\pi}{2d}\\lVert\\mathbf r\\rVert_2^2\\lVert\\mathbf y\\rVert_2^2",
                    text: "The deterministic coarse term cancels. Because the residual correction is unbiased, its conditional mean-squared error equals its conditional variance."
                  },
                  {
                    marker: "average residual",
                    title: "Reduce to the MSE theorem",
                    formula: "D_{\\mathrm{prod}}\\le\\frac{\\pi}{2d}\\lVert\\mathbf y\\rVert_2^2\\,\\mathbb E\\lVert\\mathbf r\\rVert_2^2=\\frac{\\pi}{2d}\\lVert\\mathbf y\\rVert_2^2D_{\\mathrm{mse}}(b-1)",
                    text: <>The residual energy is precisely the reconstruction distortion of the <InlineMath formula={"(b-1)"} />-bit MSE stage.</>
                  },
                  {
                    marker: "substitute",
                    title: "Recover the final exponential rate",
                    formula: "\\frac{\\pi}{2d}\\lVert\\mathbf y\\rVert_2^2\\cdot\\frac{\\sqrt3\\pi}{2}\\,4^{-(b-1)}=\\frac{\\sqrt3\\pi^2}{d}\\lVert\\mathbf y\\rVert_2^2\\,4^{-b}",
                    text: "The reserved QJL bit shifts the MSE rate from b to b-1; algebra absorbs that factor of four into the theorem's constant."
                  }
                ]}
              />
            </div>
          </section>

          <section id="guarantees" className="scroll-mt-40">
            <SectionHeading
              eyebrow="06 / Near-optimality"
              title="The upper bounds are compared against what any quantizer can achieve."
              description={
                <>
                  The paper combines Shannon&apos;s distortion-rate lower bound with Yao&apos;s minimax principle. The result applies to every randomized quantizer using <InlineMath formula={"b"} /> bits per coordinate, not only to the baselines evaluated in the experiments.
                </>
              }
            />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
                <BookOpen className="text-cyan-300" size={28} />
                <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Shannon</p>
                <p className="mt-3 text-lg font-bold">Sphere-source distortion</p>
                <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-[#0d1117] p-4 text-cyan-100">
                  <DisplayMath formula={"D(B)\\ge 2^{-2B/d}"} className="text-base md:text-lg" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Setting the total bit budget to <InlineMath formula={"B=bd"} /> reduces Shannon&apos;s expression to <InlineMath formula={"4^{-b}"} />.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
                <Workflow className="text-purple-300" size={28} />
                <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-purple-300">Yao minimax</p>
                <p className="mt-3 text-lg font-bold">Random algorithm, hard input</p>
                <p className="mt-5 text-sm leading-7 text-slate-400">
                  A lower bound for deterministic quantizers under a difficult random sphere distribution transfers to randomized quantizers on a worst-case input vector.
                </p>
              </div>
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6">
                <Gauge className="text-emerald-300" size={28} />
                <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">constant gap</p>
                <p className="mt-3 text-lg font-bold">Near-optimal at every b</p>
                <div className="mt-5 overflow-x-auto text-4xl font-black text-white">
                  <DisplayMath formula={"\\frac{\\sqrt{3}\\,\\pi}{2}"} className="text-3xl md:text-4xl" />
                </div>
                <p className="mt-2 text-sm text-emerald-200">approximately 2.7x</p>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  This is the maximum MSE upper/lower-bound ratio; the measured low-bit gap is smaller.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Equation
                label="Universal MSE lower bound"
                formula={"D_{\\mathrm{mse}}(Q)\\ge 4^{-b}"}
              />
              <Equation
                label="Universal product-error lower bound"
                tone="purple"
                note={<>The theorem states this for a unit query. Homogeneity gives the displayed <InlineMath formula={"\\lVert\\mathbf y\\rVert_2^2"} /> scaling for an arbitrary query norm.</>}
                formula={"D_{\\mathrm{prod}}(Q)\\ge\\frac{\\lVert\\mathbf y\\rVert_2^2}{d}\\,4^{-b}"}
              />
            </div>

            <div className="mt-7 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 p-6 md:p-7">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">rate comparison</p>
                <h3 className="mt-2 text-2xl font-black">Optimal exponent, explicit constants</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left text-sm">
                  <thead className="bg-[#0d1117] font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Objective</th>
                      <th className="px-6 py-4">Any quantizer must incur</th>
                      <th className="px-6 py-4">TurboQuant guarantees</th>
                      <th className="px-6 py-4">Constant-factor gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-800">
                      <td className="px-6 py-5 font-bold text-cyan-200">Reconstruction MSE</td>
                      <td className="px-6 py-5 text-slate-300"><InlineMath formula={"4^{-b}"} /></td>
                      <td className="px-6 py-5 text-slate-300"><InlineMath formula={"\\frac{\\sqrt3\\pi}{2}4^{-b}"} /></td>
                      <td className="px-6 py-5 font-mono font-bold text-white">2.72</td>
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="px-6 py-5 font-bold text-purple-200">Inner-product error</td>
                      <td className="px-6 py-5 text-slate-300"><InlineMath formula={"\\frac{\\lVert\\mathbf y\\rVert_2^2}{d}4^{-b}"} /></td>
                      <td className="px-6 py-5 text-slate-300"><InlineMath formula={"\\frac{\\sqrt3\\pi^2\\lVert\\mathbf y\\rVert_2^2}{d}4^{-b}"} /></td>
                      <td className="px-6 py-5 font-mono font-bold text-white">17.09</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-800 p-5 text-sm leading-6 text-slate-400 md:px-7">
                “Near-optimal” refers to the bit-width exponent: no method can improve the <InlineMath formula={"4^{-b}"} /> rate in the worst case. TurboQuant differs only by constants independent of <InlineMath formula={"b"} /> and <InlineMath formula={"d"} />. The paper highlights the tighter 2.7 MSE gap; low-bit numerical constants are smaller than the generic high-rate upper bound.
              </p>
            </div>

            <div className="mt-7">
              <ProofTrace
                title="How Shannon and Yao produce a worst-case lower bound"
                description="Shannon gives an average-case statement for a random source. Yao's minimax principle converts that hard distribution into a worst-case input for any randomized quantizer."
                tone="emerald"
                steps={[
                  {
                    marker: "hard source",
                    title: "Choose the uniform sphere",
                    formula: "\\mathbf X\\sim\\operatorname{Unif}(\\mathbb S^{d-1}),\\qquad B=bd",
                    text: <>A deterministic <InlineMath formula={"bd"} />-bit encoder can produce at most <InlineMath formula={"2^{bd}"} /> messages. Shannon&apos;s distortion-rate function lower-bounds the best average reconstruction error over this source.</>
                  },
                  {
                    marker: "Shannon",
                    title: "Lower-bound deterministic encoders",
                    formula: "\\inf_{I(\\mathbf X;\\widetilde{\\mathbf X})\\le bd}\\mathbb E\\lVert\\mathbf X-\\widetilde{\\mathbf X}\\rVert_2^2\\ge2^{-2bd/d}=4^{-b}",
                    text: "This applies even to an ideal encoder-decoder unconstrained by the particular algorithmic structure used in the paper."
                  },
                  {
                    marker: "Yao",
                    title: "Move to randomized algorithms",
                    formula: "\\min_{Q\\ \\mathrm{randomized}}\\max_{\\mathbf x}\\mathbb E_Q[L(Q,\\mathbf x)]\\ge\\max_{\\mathcal D}\\min_{q\\ \\mathrm{deterministic}}\\mathbb E_{\\mathbf X\\sim\\mathcal D}[L(q,\\mathbf X)]",
                    text: <>Using the uniform sphere as the hard distribution implies that every randomized quantizer has at least one fixed unit input with expected MSE at least <InlineMath formula={"4^{-b}"} />.</>
                  },
                  {
                    marker: "pigeonhole",
                    title: "Turn MSE into one hard query",
                    formula: "D_{\\mathrm{mse}}=\\sum_{j=1}^{d}\\mathbb E\\!\\left[|\\langle\\mathbf e_j,\\mathbf x-\\widetilde{\\mathbf x}\\rangle|^2\\right]\\ge4^{-b}",
                    text: <>At least one coordinate direction <InlineMath formula={"\\mathbf e_j"} /> contributes at least the average, so choosing <InlineMath formula={"\\mathbf y=\\mathbf e_j"} /> yields product error at least <InlineMath formula={"4^{-b}/d"} />.</>
                  },
                  {
                    marker: "scope",
                    title: "Match the theorem's expectation",
                    text: "This is a lower bound on expected distortion over quantizer randomness, not merely a worst-realization packing bound. That makes it directly comparable to TurboQuant's expected upper bounds."
                  }
                ]}
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <FigureCard
                image={5}
                title="Inner-product error vs. theoretical bounds"
                caption={<><InlineMath formula={"Q_{\\mathrm{prod}}"} /> is strongest at very low bit-width; <InlineMath formula={"Q_{\\mathrm{mse}}"} /> catches up as its bias shrinks. Both follow the predicted exponential slope.</>}
                square
              />
              <FigureCard
                image={6}
                title="MSE vs. theoretical bounds"
                caption="Measured reconstruction distortion on DBpedia embeddings is plotted against the Shannon lower bound and the scalar-quantization upper bound."
                square
              />
            </div>
          </section>

          <section id="experiments" className="scroll-mt-40">
            <SectionHeading
              eyebrow="07 / Experimental evidence"
              title="Theory, long-context inference, and vector search."
              description={
                <>
                  The experiments run on a single NVIDIA A100. The theory-validation setup uses 100,000 DBpedia vectors with embedding dimension <InlineMath formula={"d=1536"} />, plus 1,000 held-out query vectors.
                </>
              }
            />

            <div className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <ScanSearch className="text-cyan-300" size={25} />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">experimental protocol at a glance</p>
                </div>
                <h3 className="mt-3 text-2xl font-black">What each experiment is actually testing</h3>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">All reported experiments use one NVIDIA A100. The four blocks answer different questions, so their metrics should not be compared directly.</p>
              </div>
              <div className="grid md:grid-cols-2">
                {[
                  {
                    id: "7.1",
                    title: "Theory validation",
                    setup: <>DBpedia / OpenAI3, <InlineMath formula={"d=1536"} />, 100k encoded vectors, 1k queries</>,
                    metric: "Bias, error variance, MSE, and product distortion versus bit-width",
                    question: "Do measured errors follow the proved distributions and bounds?"
                  },
                  {
                    id: "7.2",
                    title: "Needle in a haystack",
                    setup: <>Llama-3.1-8B-Instruct, contexts from 4K to 104K, <InlineMath formula={"25\\%"} /> KV memory</>,
                    metric: "Recall score over context length and hidden-sentence depth",
                    question: "Does compressed attention still retrieve a precise fact from long context?"
                  },
                  {
                    id: "7.3",
                    title: "LongBench-E",
                    setup: "Llama-3.1-8B-Instruct and Mistral-7B across six task families",
                    metric: "Task scores and macro average at effective KV precision",
                    question: "Does quality survive realistic end-to-end generation, including streamed tokens?"
                  },
                  {
                    id: "7.4",
                    title: "Approximate nearest neighbor",
                    setup: <>GloVe <InlineMath formula={"d=200"} /> and DBpedia/OpenAI3 <InlineMath formula={"d\\in\\{1536,3072\\}"} /></>,
                    metric: <><InlineMath formula={"1@k"} /> recall and reported 4-bit quantization/indexing time</>,
                    question: "Can a zero-training quantizer preserve ranking against learned PQ and RabitQ?"
                  }
                ].map((item, index) => (
                  <div key={item.id} className={"p-6 md:p-7 " + (index < 2 ? "border-b border-slate-800 " : "") + (index % 2 === 0 ? "md:border-r md:border-slate-800" : "")}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] font-black text-cyan-300">{item.id}</span>
                      <span className="rounded-full border border-slate-700 bg-[#0d1117] px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-slate-500">protocol</span>
                    </div>
                    <h3 className="mt-4 text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-3 text-sm font-bold leading-6 text-slate-300">{item.question}</p>
                    <dl className="mt-4 space-y-3 text-xs leading-5">
                      <div className="grid grid-cols-[58px_1fr] gap-3">
                        <dt className="font-mono uppercase tracking-widest text-slate-600">setup</dt>
                        <dd className="text-slate-400">{item.setup}</dd>
                      </div>
                      <div className="grid grid-cols-[58px_1fr] gap-3">
                        <dt className="font-mono uppercase tracking-widest text-slate-600">metric</dt>
                        <dd className="text-slate-400">{item.metric}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">7.1 / empirical validation</p>
                  <h3 className="mt-2 text-2xl font-black">Bias and variance behave as predicted.</h3>
                </div>
                <div className="flex gap-2">
                  {[
                    { key: "vectors", content: "100k vectors" },
                    { key: "queries", content: "1k queries" },
                    { key: "dimension", formula: "d=1536" }
                  ].map((tag) => (
                    <span key={tag.key} className="rounded-full border border-slate-700 bg-[#0d1117] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                      {tag.formula ? <InlineMath formula={tag.formula} /> : tag.content}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                <FigureCard
                  image={1}
                  title={<><InlineMath formula={"Q_{\\mathrm{prod}}"} /> error distribution</>}
                  alt="TurboQuant product estimator error distribution"
                  caption="The product-optimized estimator remains centered around zero across bit-widths, demonstrating unbiased inner-product estimates."
                />
                <FigureCard
                  image={2}
                  title={<><InlineMath formula={"Q_{\\mathrm{mse}}"} /> error distribution</>}
                  alt="TurboQuant MSE estimator error distribution"
                  caption="The MSE-optimized estimator exhibits bias at low bit-width; the bias contracts as more bits are allocated."
                />
                <FigureCard
                  image={3}
                  title={<><InlineMath formula={"Q_{\\mathrm{prod}}"} /> at <InlineMath formula={"b=2"} /></>}
                  alt="TurboQuant product estimator at two bits"
                  caption="Inner-product error variance remains broadly independent of the original pair's average inner product."
                />
                <FigureCard
                  image={4}
                  title={<><InlineMath formula={"Q_{\\mathrm{mse}}"} /> at <InlineMath formula={"b=2"} /></>}
                  alt="TurboQuant MSE estimator at two bits"
                  caption="The error shifts with average inner product, exposing the systematic bias that motivates the residual-QJL stage."
                />
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-6 flex items-center gap-3">
                <ScanSearch className="text-emerald-300" size={26} />
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">7.2 / needle in a haystack</p>
                  <h3 className="mt-1 text-2xl font-black">Retrieval from 4K to 104K tokens</h3>
                </div>
              </div>
              <p className="mb-6 max-w-4xl leading-7 text-slate-400">
                Llama-3.1-8B-Instruct is tested using only <InlineMath formula={"25\\%"} /> of the full KV-cache memory. TurboQuant preserves the same <InlineMath formula={"0.997"} /> aggregate score as full precision, while token-eviction methods lose recall.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {needleFigures.map((figure) => (
                  <figure
                    key={figure.name}
                    className={`overflow-hidden rounded-2xl border bg-[#101722] ${figure.name === "TurboQuant" ? "border-cyan-400/35 shadow-[0_0_50px_-35px_rgba(34,211,238,0.9)]" : "border-slate-800"}`}
                  >
                    <div className="bg-white p-3">
                      <Image
                        src={`/images/resources/turboquant/figure-${figure.image}.png`}
                        alt={`${figure.name} needle-in-a-haystack heatmap`}
                        width={358}
                        height={223}
                        className="h-auto w-full"
                      />
                    </div>
                    <figcaption className="flex items-center justify-between border-t border-slate-800 p-4">
                      <span className="font-bold text-slate-200">{figure.name}</span>
                      <span className={`font-mono text-sm font-black ${figure.name === "TurboQuant" ? "text-cyan-300" : "text-slate-400"}`}>
                        {figure.score}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 p-6 md:p-8">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-purple-300">7.3 / LongBench-E</p>
                  <h3 className="mt-2 text-2xl font-black">End-to-end generation with streamed tokens quantized</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                    Unlike KIVI and PolarQuant in this comparison, TurboQuant also quantizes newly generated tokens. Fractional bit-widths come from assigning higher precision to outlier channels.
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">2.5-bit mix</p>
                  <div className="mt-2 text-xs text-slate-300">
                    <InlineMath formula={"\\frac{32\\cdot3+96\\cdot2}{128}=2.5"} />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1040px] text-left text-sm">
                  <thead className="bg-[#0d1117] font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Model</th>
                      <th className="px-5 py-4">Method</th>
                      <th className="px-5 py-4">KV bits</th>
                      {["SingleQA", "MultiQA", "Summary", "Few shot", "Synthetic", "Code", "Average"].map((heading) => (
                        <th key={heading} className="px-4 py-4">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {longBenchRows.map((row, index) => (
                      <tr
                        key={`${row.model}-${row.method}-${row.kv}`}
                        className={`${index > 0 && longBenchRows[index - 1].model !== row.model ? "border-t-4 border-slate-700" : "border-t border-slate-800"} ${row.method === "TurboQuant" ? "bg-cyan-400/5" : ""}`}
                      >
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">{row.model}</td>
                        <td className={`px-5 py-4 font-bold ${row.method === "TurboQuant" ? "text-cyan-200" : "text-slate-200"}`}>{row.method}</td>
                        <td className="px-5 py-4 font-mono text-slate-300">{row.kv}</td>
                        {row.scores.map((score, scoreIndex) => (
                          <td key={`${score}-${scoreIndex}`} className={`px-4 py-4 font-mono ${scoreIndex === 6 ? "font-black text-white" : "text-slate-400"}`}>
                            {score}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-800 p-5 text-sm leading-6 text-slate-400">
                At 3.5 bits, TurboQuant exactly matches the Llama full-cache average of <span className="font-mono font-bold text-cyan-200">50.06</span>. At 2.5 bits, Mistral remains within <span className="font-mono text-slate-200">0.27</span> average points of full cache.
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-6 flex items-center gap-3">
                <Database className="text-blue-300" size={26} />
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-blue-300">7.4 / nearest-neighbor search</p>
                  <h3 className="mt-1 text-2xl font-black">Recall without a learned indexing stage</h3>
                </div>
              </div>
              <p className="mb-6 max-w-4xl leading-7 text-slate-400">
                TurboQuant is compared with Product Quantization and RabitQ on GloVe and DBpedia/OpenAI3 embeddings. The <InlineMath formula={"1@k"} /> metric asks whether the exact top inner-product neighbor appears anywhere in the approximate top-<InlineMath formula={"k"} /> candidate set.
              </p>
              <div className="grid gap-5 lg:grid-cols-3">
                {annFigures.map((figure) => (
                  <FigureCard
                    key={figure.image}
                    image={figure.image}
                    title={<>{figure.title} / <InlineMath formula={`d=${figure.dimension}`} /></>}
                    alt={`${figure.title} recall plot at dimension ${figure.dimension}`}
                    caption={<>Recall <InlineMath formula={"1@k"} /> for two-bit and four-bit quantization as the candidate set size <InlineMath formula={"k"} /> increases.</>}
                    square
                  />
                ))}
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <Zap className="text-amber-300" size={25} />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-amber-300">4-bit indexing time / seconds</p>
                </div>
                <h3 className="mt-3 text-2xl font-black">TurboQuant removes the codebook-training bottleneck.</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead className="bg-[#0d1117] font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Approach</th>
                      <th className="px-6 py-4"><InlineMath formula={"d=200"} /></th>
                      <th className="px-6 py-4"><InlineMath formula={"d=1536"} /></th>
                      <th className="px-6 py-4"><InlineMath formula={"d=3072"} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeRows.map((row) => (
                      <tr key={row[0]} className={`border-t border-slate-800 ${row[0] === "TurboQuant" ? "bg-emerald-400/5" : ""}`}>
                        {row.map((cell, index) => (
                          <td key={cell} className={`px-6 py-5 ${index === 0 ? `font-bold ${row[0] === "TurboQuant" ? "text-emerald-200" : "text-slate-200"}` : "font-mono text-slate-400"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-4 border-t border-slate-800 p-6 md:grid-cols-2 md:p-8">
                <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5">
                  <p className="font-bold text-slate-200">PQ configuration</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    The paper uses LUT256 because LUT16 caused substantial quality loss. PQ is trained and evaluated on the same dataset, which the authors note gives it an advantage.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5">
                  <p className="font-bold text-slate-200">RabitQ implementation</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    The evaluated implementation is not fully vectorized and cannot use GPU acceleration, so its timing should be read with that systems distinction in mind.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="engineering" className="scroll-mt-40">
            <SectionHeading
              eyebrow="08 / Deployment anatomy"
              title="From theorem budget to an actual payload."
              description="The formal rate counts per-coordinate codes. A deployment also needs shared transforms, codebooks, vector norms, residual scales, deterministic seeds, and kernels for the dense linear maps. This section makes that accounting explicit."
            />

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-[#101722] to-[#101722] p-7">
                <Layers3 className="text-cyan-300" size={32} />
                <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">mental model</p>
                <p className="mt-4 text-3xl font-black leading-tight">
                  Regularize the geometry, quantize the bulk, repair the residual.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    { number: "01", formula: "\\mathbf{u}=\\boldsymbol{\\Pi}\\mathbf{x}", detail: "randomize coordinates" },
                    { number: "02", formula: "\\operatorname{nearest}(c_i)", detail: "minimize reconstruction MSE" },
                    { number: "03", formula: "\\mathbf{r}=\\mathbf{x}-\\widetilde{\\mathbf{x}}", detail: "isolate what was lost" },
                    { number: "04", formula: "\\operatorname{sign}(\\mathbf{S}\\mathbf{r})", detail: "restore unbiased dot products" }
                  ].map((item) => (
                    <div key={item.number} className="grid grid-cols-[32px_130px_1fr] items-center gap-3 rounded-2xl border border-slate-800 bg-[#0d1117]/80 p-4">
                      <span className="font-mono text-xs text-cyan-300">{item.number}</span>
                      <span className="overflow-x-auto text-sm font-bold text-white"><InlineMath formula={item.formula} /></span>
                      <span className="text-sm text-slate-400">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: <RotateCw size={23} />,
                    title: "Data-oblivious",
                    text: "No data-dependent calibration or per-index clustering is needed in the online path."
                  },
                  {
                    icon: <Binary size={23} />,
                    title: "Two objectives",
                    text: <>Use <InlineMath formula={"Q_{\\mathrm{mse}}"} /> for reconstruction; use <InlineMath formula={"Q_{\\mathrm{prod}}"} /> when unbiased dot products are the contract.</>
                  },
                  {
                    icon: <Cpu size={23} />,
                    title: "Vectorization",
                    text: "Rotation, nearest scalar-centroid lookup, signs, and matrix products map naturally to accelerator operations."
                  },
                  {
                    icon: <Gauge size={23} />,
                    title: "Norm handling",
                    text: "The theory assumes unit vectors. For general data, store each norm in floating point and rescale after decoding."
                  },
                  {
                    icon: <MemoryStick size={23} />,
                    title: "Fractional KV bits",
                    text: "2.5 and 3.5 bits are channel mixtures, assigning more precision to identified outlier channels."
                  },
                  {
                    icon: <TriangleAlert size={23} />,
                    title: "Shared transforms",
                    text: "The random rotation, projection matrix, and scalar codebooks are global state that encoder and decoder must share."
                  }
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                    <div className="text-purple-300">{item.icon}</div>
                    <h3 className="mt-4 font-black text-slate-100">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <MemoryStick className="text-purple-300" size={25} />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-purple-300">bit and state ledger</p>
                </div>
                <h3 className="mt-3 text-2xl font-black">What must be stored, per vector and globally</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-[#0d1117] font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Variant</th>
                      <th className="px-6 py-4">Per-vector payload</th>
                      <th className="px-6 py-4">Nominal total</th>
                      <th className="px-6 py-4">Shared state</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-800">
                      <td className="px-6 py-5 font-bold text-cyan-200"><InlineMath formula={"Q_{\\mathrm{mse}}"} /></td>
                      <td className="px-6 py-5 text-slate-400"><InlineMath formula={"d"} /> centroid indices, each <InlineMath formula={"b"} /> bits</td>
                      <td className="px-6 py-5 text-slate-200"><InlineMath formula={"bd"} /> bits</td>
                      <td className="px-6 py-5 text-slate-400"><InlineMath formula={"\\boldsymbol\\Pi"} /> and <InlineMath formula={"2^b"} /> scalar centroids</td>
                    </tr>
                    <tr className="border-t border-slate-800 bg-purple-400/5">
                      <td className="px-6 py-5 font-bold text-purple-200"><InlineMath formula={"Q_{\\mathrm{prod}}"} /></td>
                      <td className="px-6 py-5 text-slate-400"><InlineMath formula={"d"} /> indices at <InlineMath formula={"b-1"} /> bits, <InlineMath formula={"d"} /> signs, scalar <InlineMath formula={"\\gamma=\\lVert\\mathbf r\\rVert_2"} /></td>
                      <td className="px-6 py-5 text-slate-200"><InlineMath formula={"(b-1)d+d=bd"} /> bits plus one scalar</td>
                      <td className="px-6 py-5 text-slate-400">MSE state plus Gaussian projection <InlineMath formula={"\\mathbf S"} /></td>
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="px-6 py-5 font-bold text-emerald-200">Non-unit input</td>
                      <td className="px-6 py-5 text-slate-400">The selected payload above plus <InlineMath formula={"\\lVert\\mathbf x\\rVert_2"} /></td>
                      <td className="px-6 py-5 text-slate-200">One additional floating scalar</td>
                      <td className="px-6 py-5 text-slate-400">No additional global state</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-800 p-5 text-sm leading-6 text-slate-400 md:px-7">
                The paper&apos;s <InlineMath formula={"b"} />-bit terminology counts the <InlineMath formula={"bd"} /> coordinate payload. The residual norm <InlineMath formula={"\\gamma"} /> and, for non-unit data, the source norm are constant-size side information. Their amortized cost per coordinate vanishes as <InlineMath formula={"d"} /> grows, but a real format must still serialize them.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 md:p-7">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">reference implementation path</p>
                <h3 className="mt-3 text-2xl font-black">A reproducible build sequence</h3>
                <div className="mt-6 space-y-4">
                  {[
                    ["01", "Choose the contract", "Use the MSE variant for vector reconstruction and the product variant when unbiased attention or retrieval scores are required."],
                    ["02", "Normalize and retain scale", "Map each vector to the unit sphere; persist its original L2 norm when downstream code needs the original magnitude."],
                    ["03", "Version shared randomness", "Generate the orthogonal rotation from a Gaussian matrix and QR decomposition. Persist the seed or matrix; product mode also needs the Gaussian QJL matrix."],
                    ["04", "Precompute the scalar codebook", "Solve the Lloyd-Max centroid equations for the chosen dimension and bit-width once, then freeze the sorted levels."],
                    ["05", "Encode in batches", "Apply rotations/projections as dense batched matrix operations, then perform elementwise nearest-centroid and sign kernels."],
                    ["06", "Validate both objectives", "Measure reconstruction MSE, signed product bias, product-error variance, and the actual serialized byte count separately."]
                  ].map((step) => (
                    <div key={step[0]} className="grid gap-3 rounded-2xl border border-slate-800 bg-[#0d1117] p-4 sm:grid-cols-[42px_150px_1fr] sm:items-start">
                      <span className="font-mono text-xs font-black text-cyan-300">{step[0]}</span>
                      <span className="text-sm font-bold text-slate-200">{step[1]}</span>
                      <span className="text-sm leading-6 text-slate-400">{step[2]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-purple-400/20 bg-purple-400/5 p-6">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-purple-300">straight dense cost model</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    A literal implementation stores dense <InlineMath formula={"d\\times d"} /> transforms. Setup includes a QR decomposition for <InlineMath formula={"\\boldsymbol\\Pi"} />; online encoding includes matrix-vector or batched matrix-matrix products. These operations are accelerator-friendly, but they are not free.
                  </p>
                </div>
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">fractional KV precision</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    The reported 2.5-bit mode is not a half-bit code. It applies 3-bit TurboQuant to 32 outlier channels and 2-bit TurboQuant to the remaining 96 channels:
                  </p>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-emerald-400/15 bg-[#0d1117] p-4 text-emerald-100">
                    <DisplayMath formula={"(32\\cdot3+96\\cdot2)/128=2.5"} className="text-base" />
                  </div>
                </div>
                <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-300">format invariant</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Encoder and decoder must agree on <InlineMath formula={"d"} />, <InlineMath formula={"b"} />, centroids, transform seeds, scalar precision, index packing, and channel grouping. A mismatch silently changes the decoded geometry.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-7 md:p-9">
              <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                    <ChartNoAxesCombined className="text-emerald-300" size={28} />
                  </div>
                  <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">bottom line</p>
                  <h2 className="mt-3 text-3xl font-black">Why the paper matters</h2>
                </div>
                <p className="text-xl font-light leading-9 text-slate-300 md:text-2xl">
                  TurboQuant connects information-theoretic rate bounds to an online quantizer that is useful in real workloads. Its most important idea is the decomposition: a near-optimal scalar reconstruction handles most of the signal, while a one-bit residual sketch restores the statistical property inner-product systems actually need.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-800 bg-[#101722] p-6 md:flex-row md:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">source and attribution</p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Technical claims, tables, and reproduced plots are from Zandieh et al., &quot;TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate,&quot; arXiv:2504.19874v1. The paper is released under CC BY 4.0.
                </p>
              </div>
              <a
                href={links.arxiv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-cyan-200 transition hover:bg-cyan-400/15"
              >
                read original <ExternalLink size={14} />
              </a>
            </div>
          </section>

          <section id="limits" className="scroll-mt-40">
            <SectionHeading
              eyebrow="09 / Scope and limitations"
              title="What the paper establishes, and what remains a systems question."
              description="A complete reading includes the boundary of every claim. The guarantees are strong but specific: expected distortion, worst-case input vectors, a nominal coordinate bit budget, and experiments on the listed datasets, models, baselines, and hardware."
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Expectation, not certainty",
                  text: <>The bounds average over random transforms and quantizer randomness. They do not promise that every seed and every encoded vector attains the stated error.</>
                },
                {
                  title: "Unit-sphere theory",
                  text: <>The main theorems assume <InlineMath formula={"\\lVert\\mathbf x\\rVert_2=1"} />. General vectors require a separately stored norm and introduce its precision into a real implementation.</>
                },
                {
                  title: "Side information exists",
                  text: <>Product mode adds residual scale <InlineMath formula={"\\gamma"} />; both modes rely on shared codebooks and transforms. The nominal <InlineMath formula={"bd"} /> count describes coordinate codes.</>
                },
                {
                  title: "Dense transforms cost work",
                  text: <>Random rotation and QJL use dense <InlineMath formula={"d\\times d"} /> matrices in the paper&apos;s formulation. Vectorizable is not synonymous with zero latency or zero shared-state memory.</>
                },
                {
                  title: "Timing is not apples-to-apples",
                  text: "The paper notes that the evaluated RabitQ implementation is not fully vectorized and runs on CPU, while TurboQuant targets GPU operations. Treat the timing table as implementation-specific."
                },
                {
                  title: "Empirical scope is finite",
                  text: "The evaluation covers Llama-3.1-8B-Instruct, Mistral-7B, LongBench-E, needle retrieval, DBpedia/OpenAI3, and GloVe. It does not establish unchanged quality for every model, modality, or embedding distribution."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                  <TriangleAlert className="text-amber-300" size={22} />
                  <h3 className="mt-4 text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="grid md:grid-cols-2">
                <div className="border-b border-slate-800 p-6 md:border-b-0 md:border-r md:p-7">
                  <div className="flex items-center gap-3 text-emerald-300">
                    <Check size={23} />
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.22em]">supported conclusion</p>
                  </div>
                  <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                    <p>TurboQuant MSE achieves the optimal <InlineMath formula={"4^{-b}"} /> distortion exponent within a 2.7 constant in the paper&apos;s worst-case expected setting.</p>
                    <p>The residual-QJL construction gives an exactly unbiased inner-product estimator with error proportional to residual MSE divided by dimension.</p>
                    <p>The reported experiments show competitive KV-cache quality and ANN recall with effectively no learned codebook-training phase.</p>
                  </div>
                </div>
                <div className="p-6 md:p-7">
                  <div className="flex items-center gap-3 text-rose-300">
                    <TriangleAlert size={23} />
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.22em]">unsupported extrapolation</p>
                  </div>
                  <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                    <p>That every individual vector receives a deterministic near-optimal error bound.</p>
                    <p>That end-to-end inference latency, energy, or memory bandwidth always improves against every optimized baseline.</p>
                    <p>That the full shared-transform footprint and scalar side information can be ignored in a production serialization format.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-[#101722] to-purple-400/5 p-7 md:p-9">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">complete-paper checkpoint</p>
              <h3 className="mt-3 text-3xl font-black">What you should be able to explain after this page</h3>
              <div className="mt-7 grid gap-3 md:grid-cols-2">
                {[
                  "Why Haar rotation removes worst-case coordinate structure",
                  "How the Beta density produces Lloyd-Max scalar codebooks",
                  "Why vector MSE equals d times one scalar cost",
                  "Why MSE-optimal codes can bias dot products",
                  "How one-bit QJL repairs only the residual",
                  "Where every constant in both theorems comes from",
                  "How Shannon plus Yao proves the exponential lower bound",
                  "How to interpret, reproduce, and qualify every experiment"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#0d1117]/80 p-4">
                    <Check className="mt-0.5 shrink-0 text-cyan-300" size={18} />
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <PaperTimelineNav
              older={{ href: "/resources/llada", title: "LLaDA", year: 2025 }}
            />
          </section>
        </div>
      </article>

      <SocialFooter />
    </main>
  );
}
