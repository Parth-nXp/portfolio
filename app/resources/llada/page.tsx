import Image from "next/image";
import katex from "katex";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  Clock3,
  Cpu,
  Database,
  ExternalLink,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  MessageSquareCode,
  Network,
  RefreshCw,
  Sparkles,
  Target,
  TriangleAlert,
  Workflow,
  Zap
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  arxiv: "https://arxiv.org/abs/2502.09992",
  html: "https://arxiv.org/html/2502.09992v3",
  pdf: "https://arxiv.org/pdf/2502.09992v3",
  doi: "https://doi.org/10.48550/arXiv.2502.09992",
  project: "https://ml-gsai.github.io/LLaDA-demo/"
};

export const metadata: Metadata = {
  title: "LLaDA: A Complete Technical Deep Dive",
  description:
    "A visual, equation-first reconstruction of LLaDA: masked diffusion, likelihood-bound training, parallel denoising, scaling, benchmarks, reversal reasoning, sampling ablations, and limitations."
};

const sections = [
  ["thesis", "The thesis"],
  ["process", "Diffusion process"],
  ["objective", "Objective"],
  ["system", "8B system"],
  ["sft", "SFT"],
  ["sampling", "Sampling"],
  ["scaling", "Scaling"],
  ["benchmarks", "Benchmarks"],
  ["reversal", "Reversal"],
  ["ablations", "Ablations"],
  ["limits", "Limits"]
];

const baseRows = [
  ["MMLU", "5", "65.9", "65.4", "+0.5"],
  ["BBH", "3", "49.7", "62.1", "-12.4"],
  ["ARC-C", "0", "45.9", "53.1", "-7.2"],
  ["HellaSwag", "0", "70.5", "79.1", "-8.6"],
  ["TruthfulQA", "0", "46.1", "44.0", "+2.1"],
  ["WinoGrande", "5", "74.8", "77.3", "-2.5"],
  ["PIQA", "0", "73.6", "80.6", "-7.0"],
  ["GSM8K", "4", "70.3", "48.7", "+21.6"],
  ["Math", "4", "31.4", "16.0", "+15.4"],
  ["GPQA", "5", "25.2", "25.9", "-0.7"],
  ["HumanEval", "0", "35.4", "34.8", "+0.6"],
  ["HumanEval-FIM", "2", "73.8", "73.3", "+0.5"],
  ["MBPP", "4", "40.0", "48.8", "-8.8"],
  ["CMMLU", "5", "69.9", "50.7", "+19.2"],
  ["C-Eval", "5", "70.5", "51.7", "+18.8"]
];

const instructRows = [
  ["MMLU", "65.5", "68.4", "-2.9"],
  ["MMLU-Pro", "37.0", "41.9", "-4.9"],
  ["HellaSwag", "74.6", "75.5", "-0.9"],
  ["ARC-C", "88.5", "82.4", "+6.1"],
  ["GSM8K", "69.4", "78.3", "-8.9"],
  ["Math", "31.9", "29.6", "+2.3"],
  ["GPQA", "33.3", "31.9", "+1.4"],
  ["HumanEval", "49.4", "59.8", "-10.4"],
  ["MBPP", "41.0", "57.6", "-16.6"]
];

const architectureRows = [
  ["Layers", "32", "32"],
  ["Model width", "4,096", "4,096"],
  ["Attention heads", "32", "32"],
  ["Key / value heads", "32", "8"],
  ["FFN width", "12,288", "14,336"],
  ["Vocabulary", "126,464", "128,000"],
  ["Total parameters", "8.02B", "8.03B"],
  ["Non-embedding parameters", "6.98B", "6.98B"]
];

const samplingRows = [
  ["Autoregressive", "-", "38.1", "63.1", "23.6", "18.3", "33.4"],
  ["Block diffusion", "2", "37.3", "62.6", "25.2", "14.6", "33.6"],
  ["Block diffusion", "4", "40.0", "65.7", "26.6", "15.9", "36.0"],
  ["Block diffusion", "8", "42.0", "68.2", "27.7", "19.5", "39.2"],
  ["Block diffusion", "32", "45.7", "68.6", "29.7", "29.9", "37.4"],
  ["Block LLaDA", "2", "48.0", "70.0", "30.8", "26.2", "40.0"],
  ["Block LLaDA", "4", "48.5", "70.3", "31.3", "27.4", "38.8"],
  ["Block LLaDA", "8", "48.6", "70.2", "30.9", "31.1", "39.0"],
  ["Block LLaDA", "32", "48.3", "70.3", "31.2", "32.3", "40.0"],
  ["Pure diffusion", "-", "49.7", "70.3", "31.4", "35.4", "40.0"]
];

const formulas = {
  principle: String.raw`\max_\theta\;\mathbb{E}_{p_{\mathrm{data}}(x)}\!\left[\log p_\theta(x)\right]\quad\Longleftrightarrow\quad\min_\theta\;D_{\mathrm{KL}}\!\left(p_{\mathrm{data}}\,\|\,p_\theta\right)`,
  arm: String.raw`p_\theta(x)=p_\theta(x_1)\prod_{i=2}^{L}p_\theta\!\left(x_i\mid x_1,\ldots,x_{i-1}\right)`,
  forward: String.raw`q_{t\mid 0}(x_t\mid x_0)=\prod_{i=1}^{L}q_{t\mid 0}(x_t^i\mid x_0^i),\qquad q_{t\mid 0}(x_t^i\mid x_0^i)=(1-t)\,\delta_{x_0^i}+t\,\delta_{\mathrm{M}}`,
  loss: String.raw`\mathcal{L}(\theta)=-\mathbb{E}_{t,x_0,x_t}\!\left[\frac{1}{t}\sum_{i=1}^{L}\mathbf{1}[x_t^i=\mathrm{M}]\log p_\theta(x_0^i\mid x_t)\right]`,
  bound: String.raw`-\mathbb{E}_{p_{\mathrm{data}}(x_0)}\!\left[\log p_\theta(x_0)\right]\leq \mathcal{L}(\theta)`,
  sft: String.raw`\mathcal{L}_{\mathrm{SFT}}=-\mathbb{E}\!\left[\frac{1}{t}\sum_{i=1}^{L'}\mathbf{1}[r_t^i=\mathrm{M}]\log p_\theta(r_0^i\mid p_0,r_t)\right]`,
  likelihood: String.raw`-\mathbb{E}_{\ell,r_0,r_\ell}\!\left[\frac{L}{\ell}\sum_{i=1}^{L}\mathbf{1}[r_\ell^i=\mathrm{M}]\log p_\theta(r_0^i\mid p_0,r_\ell)\right]`,
  cfg: String.raw`\widetilde p_\theta(r_0\mid p_0,r_t)\propto\frac{p_\theta(r_0\mid p_0,r_t)^{1+w}}{p_\theta(r_0\mid m,r_t)^w}`
};

function DisplayMath({ formula, className = "" }: { formula: string; className?: string }) {
  return (
    <div
      className={"min-w-max text-base text-current sm:text-lg md:text-xl [&_.katex-display]:m-0 " + className}
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
    <div className="mb-10 min-w-0 max-w-4xl">
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-orange-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({
  label,
  formula,
  note,
  tone = "orange"
}: {
  label: string;
  formula: string;
  note?: ReactNode;
  tone?: "orange" | "sky" | "rose";
}) {
  const tones = {
    orange: "border-orange-300/20 bg-orange-300/5 text-orange-50",
    sky: "border-sky-300/20 bg-sky-300/5 text-sky-50",
    rose: "border-rose-300/20 bg-rose-300/5 text-rose-50"
  };

  return (
    <div className={"min-w-0 overflow-hidden rounded-2xl border " + tones[tone]}>
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </div>
      <div className="overflow-x-auto px-5 py-7">
        <DisplayMath formula={formula} />
        {note && <p className="mt-5 max-w-5xl text-sm leading-7 text-slate-400">{note}</p>}
      </div>
    </div>
  );
}

function FigureCard({
  src,
  width,
  height,
  label,
  title,
  caption,
  className = ""
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  title: string;
  caption: ReactNode;
  className?: string;
}) {
  return (
    <figure className={"min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722] " + className}>
      <div className="flex min-h-52 items-center justify-center bg-white p-4 sm:p-7">
        <Image src={src} alt={title} width={width} height={height} className="h-auto max-h-[780px] w-full object-contain" />
      </div>
      <figcaption className="border-t border-slate-800 p-5 sm:p-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">{label}</p>
        <p className="mt-2 font-black text-slate-100">{title}</p>
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
      className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-orange-300 transition-colors hover:text-white"
    >
      {children} <ExternalLink size={13} />
    </a>
  );
}

function DenoisingConsole() {
  const stages = [
    { time: "t = 1.00", tokens: ["[M]", "[M]", "[M]", "[M]", "[M]", "[M]"] },
    { time: "t = 0.75", tokens: ["Diffusion", "[M]", "can", "[M]", "[M]", "[M]"] },
    { time: "t = 0.50", tokens: ["Diffusion", "models", "can", "[M]", "in", "parallel"] },
    { time: "t = 0.25", tokens: ["Diffusion", "models", "can", "reason", "in", "parallel"] },
    { time: "t = 0.00", tokens: ["Diffusion", "models", "can", "reason", "in", "parallel"] }
  ];

  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-orange-300/20 bg-[#101722] shadow-[0_0_100px_-45px_rgba(251,146,60,0.7)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.9)]" />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-200">reverse process</span>
        </div>
        <span className="font-mono text-[10px] text-slate-600">all masks / every step</span>
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="relative">
          <div className="rounded-2xl border border-sky-300/15 bg-[#0d1117] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-sky-300">prompt / clean context</p>
            <p className="mt-2 text-sm font-black text-slate-200">Complete the model&apos;s response</p>
          </div>

          <div className="mt-4 space-y-2.5">
            {stages.map((stage, stageIndex) => (
              <div key={stage.time} className="grid grid-cols-[58px_minmax(0,1fr)] items-center gap-3">
                <span className={"font-mono text-[9px] " + (stageIndex === stages.length - 1 ? "text-orange-300" : "text-slate-600")}>{stage.time}</span>
                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                  {stage.tokens.map((token, tokenIndex) => {
                    const masked = token === "[M]";
                    const changed = stageIndex > 0 && stages[stageIndex - 1].tokens[tokenIndex] !== token;
                    return (
                      <div
                        key={`${stage.time}-${tokenIndex}`}
                        className={
                          "flex min-h-8 items-center justify-center rounded-md border px-1.5 text-center font-mono text-[8px] sm:text-[9px] " +
                          (masked
                            ? "border-slate-700 bg-slate-800/70 text-slate-600"
                            : changed
                              ? "border-orange-300/30 bg-orange-300/10 text-orange-200"
                              : "border-sky-300/15 bg-sky-300/5 text-sky-200")
                        }
                      >
                        {token}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-orange-300/15 bg-orange-300/5 p-4">
              <p className="font-mono text-[9px] uppercase tracking-wider text-orange-300">predict</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">Fill every masked position simultaneously.</p>
            </div>
            <div className="rounded-xl border border-sky-300/15 bg-sky-300/5 p-4">
              <p className="font-mono text-[9px] uppercase tracking-wider text-sky-300">remask</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">Keep confident tokens; revisit uncertain ones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LladaPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] font-sans text-white selection:bg-orange-400/30">
      <SiteNav />

      <header className="relative border-b border-slate-800 px-5 pb-16 pt-32 sm:px-8 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.025)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-orange-300/25 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.22em]">
              <span className="rounded-full border border-orange-300/25 bg-orange-300/5 px-3 py-1.5 text-orange-300">paper reconstruction</span>
              <span className="text-slate-600">NeurIPS / 2025</span>
            </div>

            <h1 className="mt-7 text-6xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">LLaDA.</h1>
            <p className="mt-3 max-w-3xl text-3xl font-black leading-tight text-orange-300 sm:text-4xl">
              Language does not have to arrive left-to-right.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
              An 8B language model trained from scratch as masked diffusion: corrupt text at a random mask ratio, learn
              to recover every missing token, then generate by repeatedly predicting and revising the whole response.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={links.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-300 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#0d1117] transition-colors hover:bg-white"
              >
                Read original PDF <ExternalLink size={14} />
              </a>
              <a
                href="#thesis"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#101722] px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-300 transition-colors hover:border-orange-300/50 hover:text-white"
              >
                Decode the paper <ArrowDown size={14} />
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-4">
              {[
                ["8.02B", "parameters"],
                ["2.3T", "training tokens"],
                ["4,096", "context length"],
                ["0.13M", "H800 GPU hours"]
              ].map(([value, label]) => (
                <div key={label} className="bg-[#101722] p-4">
                  <p className="font-mono text-xl font-black text-orange-300">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <DenoisingConsole />
        </div>
      </header>

      <nav className="sticky top-16 z-30 overflow-x-auto border-b border-slate-800 bg-[#0d1117]/95 px-5 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex w-max min-w-full max-w-7xl items-center gap-7 py-4">
          {sections.map(([href, label], index) => (
            <a
              key={href}
              href={`#${href}`}
              className="whitespace-nowrap font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 transition-colors hover:text-orange-300"
            >
              <span className="mr-2 text-slate-800">{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="thesis" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="01 / the central claim"
            title="Generative modeling is the principle. Autoregression is one factorization."
            description={
              <>
                The paper separates what language models optimize from how they expose conditionals. Maximum likelihood
                asks for a model distribution close to real text; it does not mathematically require a left-to-right chain.
              </>
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Equation
              label="generative modeling principle"
              formula={formulas.principle}
              note="Any sufficiently expressive, Fisher-consistent model family can target the data distribution through maximum likelihood."
            />
            <Equation
              label="the conventional autoregressive choice"
              formula={formulas.arm}
              tone="sky"
              note="An ARM chooses one ordering and decomposes the joint distribution into next-token conditionals. Effective, but not the only valid construction."
            />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.92fr_auto_1.08fr] lg:items-stretch">
            <article className="rounded-3xl border border-sky-300/15 bg-[#101722] p-7">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">autoregressive model</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {["x1", "x2", "x3", "x4", "x5"].map((token, index) => (
                  <div key={token} className="contents">
                    <span className="rounded-lg border border-sky-300/15 bg-sky-300/5 px-4 py-3 font-mono text-xs text-sky-200">{token}</span>
                    {index < 4 && <ArrowRight className="text-slate-700" size={14} />}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-500">One fixed direction. One new token per dependency step. KV caching makes this path efficient.</p>
            </article>

            <div className="hidden items-center justify-center text-orange-300 lg:flex"><ArrowRight size={26} /></div>

            <article className="rounded-3xl border border-orange-300/20 bg-orange-300/[0.035] p-7">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">masked diffusion model</p>
              <div className="mt-6 grid grid-cols-5 gap-2">
                {["x1", "M", "x3", "M", "M"].map((token, index) => (
                  <span key={index} className={"rounded-lg border px-2 py-3 text-center font-mono text-xs " + (token === "M" ? "border-orange-300/25 bg-orange-300/10 text-orange-200" : "border-slate-700 bg-[#0d1117] text-slate-300")}>
                    {token}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-500">Many conditioning directions. All masked tokens receive predictions in one network evaluation.</p>
            </article>
          </div>

          <div className="mt-8 rounded-3xl border border-orange-300/20 bg-orange-300/[0.035] p-7 md:p-9">
            <Sparkles className="text-orange-300" size={26} />
            <h3 className="mt-5 text-2xl font-black">The experiment is deliberately ambitious.</h3>
            <p className="mt-4 max-w-5xl text-base leading-8 text-slate-300">
              LLaDA is not adapted from an autoregressive checkpoint. The authors pre-train masked diffusion from scratch
              at 8B scale, then ask whether scalability, in-context learning, instruction-following, math, code, and
              dialogue still emerge. That makes the paper a test of modeling paradigm, not only a decoding method.
            </p>
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="02 / forward and reverse processes"
            title="Destroy information linearly. Learn to put it back."
            description={
              <>
                At time zero the sequence is clean. At time one every token is the mask symbol. A continuous time
                variable controls the expected corruption level between those endpoints.
              </>
            }
          />

          <FigureCard
            src="/images/resources/llada/overview.png"
            width={830}
            height={250}
            label="Figure 2 / original paper"
            title="Pre-training, supervised fine-tuning, and reverse sampling"
            caption="Pre-training masks every position independently. SFT protects the prompt and masks only response positions. Sampling begins with a fully masked response, predicts every hole, and remasks selected tokens between steps."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Equation
              label="linear independent masking kernel"
              formula={formulas.forward}
              tone="sky"
              note={
                <>
                  Every token survives with probability <span className="font-mono text-sky-200">1 - t</span> or becomes
                  <span className="font-mono text-sky-200"> M</span> with probability <span className="font-mono text-sky-200">t</span>.
                  The forward kernel factorizes across positions.
                </>
              }
            />

            <article className="rounded-2xl border border-orange-300/20 bg-[#101722] p-6">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">one sequence / many corruption levels</p>
              <div className="mt-6 space-y-3">
                {[
                  ["t = 0.00", "0% masked", "w-full"],
                  ["t = 0.25", "25% masked", "w-3/4"],
                  ["t = 0.50", "50% masked", "w-1/2"],
                  ["t = 0.75", "75% masked", "w-1/4"],
                  ["t = 1.00", "fully masked", "w-0"]
                ].map(([time, label, width]) => (
                  <div key={time} className="grid grid-cols-[66px_1fr_78px] items-center gap-3">
                    <span className="font-mono text-[9px] text-slate-600">{time}</span>
                    <div className="h-3 overflow-hidden rounded-full bg-orange-300/20">
                      <div className={"h-full bg-sky-300 " + width} />
                    </div>
                    <span className="text-right font-mono text-[9px] text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-500">
                Sampling <span className="font-mono text-orange-200">t ~ Uniform(0,1)</span> means the same Transformer
                learns easy local repairs, difficult global reconstruction, and every intermediate case.
              </p>
            </article>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: LockKeyhole, title: "No causal mask", text: "Each masked position can use clean evidence on both its left and right." },
              { icon: Network, title: "Shared predictor", text: "One Transformer handles every noise level without receiving time as an explicit input." },
              { icon: RefreshCw, title: "Iterative reverse path", text: "Generation moves from all masks to text over a configurable number of denoising steps." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                  <Icon className="text-orange-300" size={23} />
                  <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="objective" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="03 / the probabilistic objective"
            title="Masked cross-entropy, corrected into a generative likelihood bound."
            description={
              <>
                The predictor estimates each original token only where the corrupted sequence contains a mask. The
                unusual factor is the inverse mask ratio, which is essential to the masked-diffusion derivation.
              </>
            }
          />

          <Equation
            label="Equation 3 / LLaDA training loss"
            formula={formulas.loss}
            note={
              <>
                The indicator selects masked positions. The <span className="font-mono text-orange-200">1/t</span> term
                corrects for how frequently a token is corrupted at time <span className="font-mono text-orange-200">t</span>.
                Without it, this is closer to heuristic random masking than the paper&apos;s likelihood-based diffusion objective.
              </>
            }
          />

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <Equation
              label="Equation 4 / negative log-likelihood upper bound"
              formula={formulas.bound}
              tone="sky"
              note="Minimizing the diffusion loss minimizes an upper bound on sequence negative log-likelihood. Equivalently, its negative is a lower bound on log-likelihood."
            />
            <article className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.035] p-6">
              <TriangleAlert className="text-rose-300" size={24} />
              <h3 className="mt-5 text-xl font-black">Why this is not just BERT.</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                BERT uses a mostly fixed 15% corruption recipe for representation learning. LLaDA samples the mask ratio
                across the entire interval, applies inverse-ratio weighting, defines an iterative reverse process, and
                connects the objective to the likelihood of a generative model.
              </p>
            </article>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["01", "sample time", "t is uniform on [0,1]"],
              ["02", "corrupt", "mask each token with probability t"],
              ["03", "predict", "estimate every original masked token"],
              ["04", "weight", "scale token loss by 1/t"]
            ].map(([number, title, detail]) => (
              <div key={number} className="bg-[#101722] p-6">
                <p className="font-mono text-xs font-black text-orange-300">{number}</p>
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="system" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="04 / the 8B system"
            title="LLaMA-scale backbone, full attention, different systems economics."
            description={
              <>
                LLaDA keeps the familiar decoder-shaped Transformer stack but removes the causal attention mask. Dense
                key/value heads replace grouped-query attention because iterative bidirectional denoising cannot use a
                conventional autoregressive KV cache.
              </>
            }
          />

          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 px-6 py-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">Table 5 / architecture comparison</p>
                <h3 className="mt-2 text-xl font-black">LLaDA 8B vs LLaMA3 8B</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">
                    <tr>
                      {['Configuration', 'LLaDA 8B', 'LLaMA3 8B'].map((heading) => <th key={heading} className="px-5 py-4 font-bold">{heading}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {architectureRows.map((row) => (
                      <tr key={row[0]} className="border-b border-slate-800 last:border-0">
                        <td className="px-5 py-4 font-bold text-slate-300">{row[0]}</td>
                        <td className="px-5 py-4 font-mono font-black text-orange-200">{row[1]}</td>
                        <td className="px-5 py-4 font-mono text-slate-500">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-5">
              <article className="rounded-3xl border border-orange-300/20 bg-[#101722] p-7">
                <Cpu className="text-orange-300" size={26} />
                <h3 className="mt-5 text-2xl font-black">Transformer internals</h3>
                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-800">
                  {[["32", "layers"], ["32", "MHA heads"], ["RMSNorm", "normalization"], ["SwiGLU", "activation"], ["RoPE", "positions"], ["bf16", "evaluation precision"]].map(([value, label]) => (
                    <div key={label} className="bg-[#0d1117] p-4">
                      <p className="font-mono text-lg font-black text-orange-300">{value}</p>
                      <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">{label}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-sky-300/20 bg-[#101722] p-7">
                <Database className="text-sky-300" size={26} />
                <h3 className="mt-5 text-2xl font-black">Pre-training corpus</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Public web data, books, papers, social media, encyclopedias, math, and code are filtered by rules,
                  LLM-based methods, deduplication, harmful-content filters, and a fine-tuned BERT quality model.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[["61%", "English"], ["28%", "code"], ["11%", "Chinese"]].map(([value, label]) => (
                    <div key={label} className="rounded-xl border border-slate-800 bg-[#0d1117] p-4 text-center">
                      <p className="font-mono text-xl font-black text-sky-300">{value}</p>
                      <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">{label}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">optimization timeline</p>
              <h3 className="mt-2 text-xl font-black">Warmup, stable plateaus, and controlled decay</h3>
            </div>
            <div className="grid gap-px bg-slate-800 md:grid-cols-4">
              {[
                ["warmup", "2,000 iterations", "0 -> 4e-4"],
                ["stable I", "first 1.2T tokens", "4e-4"],
                ["stable II", "next 0.8T tokens", "1e-4"],
                ["decay", "last 0.3T tokens", "1e-4 -> 1e-5"]
              ].map(([phase, span, rate]) => (
                <div key={phase} className="bg-[#0d1117] p-6">
                  <p className="font-mono text-[10px] font-black uppercase tracking-wider text-orange-300">{phase}</p>
                  <p className="mt-4 font-black">{span}</p>
                  <p className="mt-2 font-mono text-xs text-slate-500">learning rate {rate}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-5 border-t border-slate-800 p-6 sm:grid-cols-2 lg:grid-cols-4">
              {[["AdamW", "optimizer"], ["0.1", "weight decay"], ["1,280", "global batch"], ["4", "local batch / GPU"]].map(([value, label]) => (
                <div key={label}><p className="font-mono text-xl font-black text-sky-300">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">{label}</p></div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6">
            <p className="font-bold text-rose-100">The 8B run was executed once, without hyperparameter tuning.</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">The 7B ARM baseline did receive a grid search for learning rate and batch size. This matters when reading small gaps in the scaling comparison.</p>
          </div>
        </div>
      </section>

      <section id="sft" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="05 / supervised fine-tuning"
            title="Keep the prompt clean. Diffuse only the response."
            description={
              <>
                Conditional generation uses exactly the pre-training mechanism with a protected prefix. The response is
                corrupted at a random ratio while every prompt token remains available as conditioning evidence.
              </>
            }
          />

          <Equation
            label="Equation 5 / response-only masked diffusion"
            formula={formulas.sft}
            note="The loss sums only over masked response positions. Prompt p0 is never corrupted, so the model learns p_theta(response | prompt) without changing the backbone interface."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.03fr_0.97fr]">
            <article className="rounded-3xl border border-orange-300/20 bg-[#101722] p-7">
              <MessageSquareCode className="text-orange-300" size={27} />
              <h3 className="mt-5 text-2xl font-black">4.5 million instruction pairs</h3>
              <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
                <div className="flex h-full">
                  <div className="w-[22.22%] bg-sky-300" />
                  <div className="w-[77.78%] bg-orange-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wider">
                <span className="text-sky-300">1.0M human</span>
                <span className="text-orange-300">3.5M synthetic</span>
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-400">The mixture spans instruction-following, mathematics, and code. Multi-turn conversations are converted into sampled prefix-response pairs.</p>
            </article>

            <article className="rounded-3xl border border-sky-300/20 bg-[#101722] p-7">
              <BookOpen className="text-sky-300" size={27} />
              <h3 className="mt-5 text-2xl font-black">Dynamic length through EOS padding</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Short responses are padded with EOS tokens, and those tokens participate in masking and loss like normal
                response tokens. At inference, content after the generated EOS is discarded.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["answer", "token", "EOS", "EOS", "EOS"].map((token, index) => (
                  <span key={index} className={"rounded-lg border px-3 py-2 font-mono text-[10px] " + (token === "EOS" ? "border-orange-300/20 bg-orange-300/5 text-orange-200" : "border-slate-700 bg-[#0d1117] text-slate-300")}>{token}</span>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 sm:grid-cols-3 lg:grid-cols-6">
            {[["3", "epochs"], ["50", "warmup steps"], ["2.5e-5", "peak LR"], ["2.5e-6", "final LR"], ["256", "global batch"], ["0.1", "weight decay"]].map(([value, label]) => (
              <div key={label} className="bg-[#101722] p-5"><p className="font-mono text-xl font-black text-orange-300">{value}</p><p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">{label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section id="sampling" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="06 / reverse generation"
            title="Predict globally, preserve certainty, revisit doubt."
            description={
              <>
                A response begins as a user-chosen number of mask tokens. Each step predicts all remaining masks, then
                remasks the fraction required by the next time point. Low-confidence remasking makes this practical.
              </>
            }
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "initialize", "Create a fully masked response of length L."],
              ["02", "predict", "Run the bidirectional Transformer over prompt and response."],
              ["03", "rank", "Measure confidence for every newly predicted token."],
              ["04", "remask", "At t -> s, revisit the least confident s/t fraction."]
            ].map(([number, title, detail]) => (
              <article key={number} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <p className="font-mono text-xs font-black text-orange-300">{number}</p>
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <Equation
              label="Equation 6 / lower-variance conditional likelihood estimator"
              formula={formulas.likelihood}
              tone="sky"
              note="Choose exactly l response positions without replacement, estimate their reconstruction loss, and scale by L/l. The paper uses one Monte Carlo sample for one-token choices and 128 samples for longer likelihood comparisons."
            />
            <article className="rounded-2xl border border-orange-300/20 bg-[#101722] p-6">
              <Clock3 className="text-orange-300" size={25} />
              <h3 className="mt-5 text-xl font-black">Quality and speed share one control.</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                More reverse steps allow fewer tokens to be finalized per pass. Fewer steps decode more positions at once
                but give the model fewer opportunities to correct interactions among uncertain tokens.
              </p>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {[["32", "8"], ["64", "4"], ["128", "2"], ["256", "1"]].map(([steps, tokens]) => (
                  <div key={steps} className="rounded-xl border border-slate-800 bg-[#0d1117] p-3 text-center">
                    <p className="font-mono text-lg font-black text-orange-300">{steps}</p>
                    <p className="mt-1 text-[8px] uppercase text-slate-600">steps</p>
                    <p className="mt-2 font-mono text-[9px] text-sky-300">{tokens} tok/pass</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 rounded-3xl border border-sky-300/20 bg-sky-300/[0.035] p-7 md:p-9">
            <Workflow className="text-sky-300" size={26} />
            <h3 className="mt-5 text-2xl font-black">One checkpoint supports three decoding regimes.</h3>
            <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-400">
              Pure diffusion revises the full response. Block diffusion is autoregressive across blocks but diffusive
              within each block. LLaDA can even reveal one token at a time autoregressively. No retraining is required,
              but the ablations show that matching the training paradigm matters greatly.
            </p>
          </div>
        </div>
      </section>

      <section id="scaling" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="07 / compute scaling"
            title="Diffusion remains competitive as training compute grows."
            description={
              <>
                Checkpoints from roughly 10^20 to 10^23 FLOPs are compared with self-constructed autoregressive
                baselines across general knowledge, Chinese, commonsense, mathematics, and code.
              </>
            }
          />

          <FigureCard
            src="/images/resources/llada/scaling.png"
            width={825}
            height={380}
            label="Figure 3 / original paper"
            title="Downstream performance against pre-training FLOPs"
            caption="LLaDA tracks or exceeds the ARM trend on MMLU, CMMLU, GSM8K, and late HumanEval checkpoints. PIQA remains the clearest weakness, although the gap narrows with scale."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["MMLU", "58.52", "LLaDA at 8.27e22 FLOPs", "49.26", "ARM at 7.71e22"],
              ["GSM8K", "53.30", "LLaDA at 6.48e22 FLOPs", "27.37", "ARM at 7.71e22"],
              ["PIQA", "75.35", "LLaDA at 8.27e22 FLOPs", "77.69", "ARM at 7.71e22"]
            ].map(([task, lScore, lNote, aScore, aNote]) => (
              <article key={task} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <h3 className="text-lg font-black">{task}</h3>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div><p className="font-mono text-2xl font-black text-orange-300">{lScore}</p><p className="mt-1 text-[9px] leading-4 text-slate-600">{lNote}</p></div>
                  <div><p className="font-mono text-2xl font-black text-sky-300">{aScore}</p><p className="mt-1 text-[9px] leading-4 text-slate-600">{aNote}</p></div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6">
            <h3 className="font-black text-rose-100">The controlled comparison stops below the largest experiment.</h3>
            <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-400">
              The paper did not train an architecture-matched 8B ARM through the full 2.3T-token LLaDA budget. At 1B the
              architectures and data are matched; at larger scale the comparison uses a previously trained 6.83B ARM with
              different batch tuning. Treat the curves as evidence of competitive scaling, not a definitive compute-efficiency win.
            </p>
          </div>
        </div>
      </section>

      <section id="benchmarks" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="08 / zero-shot and few-shot evidence"
            title="Competitive overall, unusually strong in math and Chinese."
            description={
              <>
                LLaDA Base is evaluated after 2.3T training tokens. The most direct published comparison is LLaMA3 8B,
                re-evaluated under the authors&apos; protocol but trained autoregressively on 15T tokens.
              </>
            }
          />

          <FigureCard
            src="/images/resources/llada/benchmark-radars.png"
            width={855}
            height={360}
            label="Figure 1 / original paper"
            title="Base and instruct benchmark profiles"
            caption="The radar plots make the shape of the result visible: LLaDA is strongest relative to LLaMA3 on GSM8K, Math, Chinese evaluations, and several code settings, while trailing on some general and commonsense tasks."
          />

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[["65.9", "MMLU", "vs 65.4"], ["70.3", "GSM8K", "vs 48.7"], ["73.8", "HumanEval-FIM", "vs 73.3"], ["70.5", "C-Eval", "vs 51.7"]].map(([value, task, comparison]) => (
              <div key={task} className="bg-[#101722] p-6"><p className="font-mono text-3xl font-black text-orange-300">{value}</p><h3 className="mt-3 font-black">{task}</h3><p className="mt-1 text-xs text-slate-600">LLaMA3 8B {comparison}</p></div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">Table 1 / base models</p>
              <h3 className="mt-2 text-xl font-black">LLaDA 8B vs re-evaluated LLaMA3 8B</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600">
                  <tr>{['Task', 'Shots', 'LLaDA', 'LLaMA3', 'Delta'].map((heading) => <th key={heading} className="px-5 py-4 font-bold">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {baseRows.map((row) => {
                    const positive = row[4].startsWith("+");
                    return (
                      <tr key={row[0]} className="border-b border-slate-800 last:border-0">
                        <td className="px-5 py-4 font-black text-white">{row[0]}</td>
                        <td className="px-5 py-4 font-mono text-slate-600">{row[1]}</td>
                        <td className="px-5 py-4 font-mono font-black text-orange-200">{row[2]}</td>
                        <td className="px-5 py-4 font-mono text-slate-400">{row[3]}</td>
                        <td className={"px-5 py-4 font-mono font-black " + (positive ? "text-orange-300" : "text-sky-300")}>{row[4]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">Table 2 / post-trained models</p>
              <h3 className="mt-2 text-xl font-black">LLaDA 8B SFT vs LLaMA3 8B SFT + RL</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600">
                  <tr>{['Task', 'LLaDA SFT', 'LLaMA3 aligned', 'Delta'].map((heading) => <th key={heading} className="px-5 py-4 font-bold">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {instructRows.map((row) => {
                    const positive = row[3].startsWith("+");
                    return (
                      <tr key={row[0]} className="border-b border-slate-800 last:border-0">
                        <td className="px-5 py-4 font-black text-white">{row[0]}</td>
                        <td className="px-5 py-4 font-mono font-black text-orange-200">{row[1]}</td>
                        <td className="px-5 py-4 font-mono text-slate-400">{row[2]}</td>
                        <td className={"px-5 py-4 font-mono font-black " + (positive ? "text-orange-300" : "text-sky-300")}>{row[3]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-300/5 p-6">
            <p className="font-bold text-sky-100">Post-training is not matched.</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">LLaDA receives supervised fine-tuning only. Every comparison model in Table 2 also receives reinforcement-learning alignment, so the table measures final systems rather than isolating architecture.</p>
          </div>
        </div>
      </section>

      <section id="reversal" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="09 / many conditioning orders"
            title="The reversal result is about balance, not dominance."
            description={
              <>
                Left-to-right training makes the reverse of a memorized relation structurally unfamiliar. LLaDA&apos;s
                random masking exposes the predictor to conditionals in many orders, creating a more symmetric inductive bias.
              </>
            }
          />

          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="rounded-3xl border border-orange-300/20 bg-[#101722] p-7">
              <GitBranch className="text-orange-300" size={27} />
              <p className="mt-5 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">any-order interpretation</p>
              <h3 className="mt-3 text-2xl font-black">One network learns conditionals across many token orders.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                The appendix connects masked diffusion to an any-order autoregressive objective averaged over permutations.
                A token may be predicted from left context, right context, or scattered evidence, depending on the sampled mask.
              </p>
              <div className="mt-6 space-y-3">
                {["A -> B", "B -> A", "A _ C -> B", "_ B C -> A"].map((order, index) => (
                  <div key={order} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0d1117] p-4"><span className="font-mono text-[10px] text-orange-300">0{index + 1}</span><span className="font-mono text-xs text-slate-300">{order}</span></div>
                ))}
              </div>
            </article>

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 px-6 py-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">Table 4 / poem completion</p>
                <h3 className="mt-2 text-xl font-black">Forward and reversal accuracy</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600"><tr><th className="px-5 py-4">Model</th><th className="px-5 py-4">Forward</th><th className="px-5 py-4">Reversal</th><th className="px-5 py-4">Gap</th></tr></thead>
                  <tbody>
                    {[["GPT-4o", "82.7", "34.3", "48.4"], ["Qwen2.5-7B", "75.9", "38.0", "37.9"], ["LLaDA-8B", "51.8", "45.6", "6.2"]].map((row, index) => (
                      <tr key={row[0]} className={"border-b border-slate-800 last:border-0 " + (index === 2 ? "bg-orange-300/[0.05]" : "")}>
                        <td className="px-5 py-5 font-black text-white">{row[0]}</td><td className="px-5 py-5 font-mono text-slate-400">{row[1]}</td><td className={"px-5 py-5 font-mono font-black " + (index === 2 ? "text-orange-300" : "text-slate-400")}>{row[2]}</td><td className="px-5 py-5 font-mono text-slate-600">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-800 p-6">
                <p className="text-sm leading-7 text-slate-400">
                  LLaDA beats GPT-4o on reversal completion by 11.3 points, but GPT-4o is 30.9 points stronger forward.
                  The notable result is LLaDA&apos;s small directional gap, not superior poem knowledge overall.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[["4-step", "64", "38"], ["5-step", "41", "35"], ["6-step", "44", "34"]].map(([level, llada, llama]) => (
              <article key={level} className="rounded-2xl border border-slate-800 bg-[#101722] p-6"><p className="font-mono text-[10px] font-black uppercase tracking-wider text-sky-300">iGSM / {level}</p><div className="mt-5 flex items-end gap-5"><div><p className="font-mono text-3xl font-black text-orange-300">{llada}</p><p className="mt-1 text-[9px] text-slate-600">LLaDA</p></div><div><p className="font-mono text-2xl font-black text-sky-300">{llama}</p><p className="mt-1 text-[9px] text-slate-600">LLaMA3</p></div></div></article>
            ))}
          </div>
        </div>
      </section>

      <section id="ablations" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="10 / sampling evidence"
            title="The reverse algorithm is part of the model, not an implementation detail."
            description={
              <>
                The same checkpoint can decode in multiple ways, but performance changes dramatically. Pure diffusion
                is strongest overall for the base model; confidence-aware remasking is the largest practical intervention.
              </>
            }
          />

          <FigureCard
            src="/images/resources/llada/sampling-strategies.png"
            width={825}
            height={190}
            label="Figure 4 / original paper"
            title="Autoregressive, block diffusion, and fixed-block LLaDA sampling"
            caption="Increasing block size exposes more positions to bidirectional refinement. Pure diffusion removes the autoregressive block boundary and revises the full generated region."
          />

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">Table 7 / LLaDA 8B Base</p>
              <h3 className="mt-2 text-xl font-black">Sampling strategy ablation</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-xs">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600"><tr>{['Strategy', 'Block L', 'BBH', 'GSM8K', 'Math', 'HumanEval', 'MBPP'].map((h) => <th key={h} className="px-4 py-4">{h}</th>)}</tr></thead>
                <tbody>
                  {samplingRows.map((row, index) => (
                    <tr key={`${row[0]}-${row[1]}`} className={"border-b border-slate-800 last:border-0 " + (index === samplingRows.length - 1 ? "bg-orange-300/[0.05]" : "")}>
                      {row.map((cell, cellIndex) => <td key={cellIndex} className={"px-4 py-4 " + (cellIndex === 0 ? "font-black text-white" : index === samplingRows.length - 1 ? "font-mono font-black text-orange-200" : "font-mono text-slate-400")}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <article className="rounded-3xl border border-orange-300/20 bg-[#101722] p-7">
              <Target className="text-orange-300" size={25} />
              <p className="mt-5 font-mono text-3xl font-black text-orange-300">21.3 -&gt; 70.0</p>
              <h3 className="mt-3 text-xl font-black">GSM8K remasking</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">Random remasking to low-confidence remasking at length 256. BBH moves 32.1 to 45.0; Math moves 9.2 to 30.3.</p>
            </article>
            <article className="rounded-3xl border border-sky-300/20 bg-[#101722] p-7">
              <Gauge className="text-sky-300" size={25} />
              <p className="mt-5 font-mono text-3xl font-black text-sky-300">256 / 512 / 1024</p>
              <h3 className="mt-3 text-xl font-black">Length is stable</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">GSM8K stays 70.0, 70.8, 70.3. HumanEval stays 32.9, 32.9, then rises to 35.4.</p>
            </article>
            <article className="rounded-3xl border border-slate-700 bg-[#101722] p-7">
              <Zap className="text-orange-300" size={25} />
              <p className="mt-5 font-mono text-3xl font-black text-orange-300">+2.0</p>
              <h3 className="mt-3 text-xl font-black">CFG on ARC-C</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">Classifier-free guidance raises ARC-C 45.9 to 47.9 and improves five of the other six tested metrics, but is excluded from main results.</p>
            </article>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.58fr_0.42fr]">
            <Equation label="Equation 16 / classifier-free guidance" formula={formulas.cfg} tone="sky" note="The denominator removes an unconditional masked-prompt score, while w controls how strongly generation follows the real prompt." />
            <div className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">CFG ablation</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                {[["ARC-C", "45.9 -> 47.9"], ["HellaSwag", "70.5 -> 72.5"], ["TruthfulQA", "46.1 -> 46.4"], ["WinoGrande", "74.8 -> 74.8"], ["GPQA", "25.2 -> 26.1"], ["PIQA", "73.6 -> 74.4"]].map(([task, value]) => <div key={task} className="rounded-xl border border-slate-800 bg-[#0d1117] p-4"><p className="font-black">{task}</p><p className="mt-2 font-mono text-sky-300">{value}</p></div>)}
              </div>
            </div>
          </div>

          <FigureCard
            src="/images/resources/llada/sampling-efficiency.png"
            width={750}
            height={510}
            label="Figure 5 / original paper"
            title="Quality-throughput trade-off on a single A100-80GB"
            caption="With 256 output tokens, reducing reverse steps increases throughput while reducing quality. At comparable GSM8K and Math performance, selected LLaDA settings are reported at 1.5x and 1.8x LLaMA3 throughput; MBPP remains weaker."
            className="mt-8"
          />

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">Table 11 / memory in GB</p><h3 className="mt-2 text-xl font-black">Dense diffusion vs autoregressive KV caching</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600"><tr>{['Input', 'Output', 'LLaDA', 'LLaMA3 no cache', 'LLaMA3 KV cache'].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
                <tbody>
                  {[["512", "512", "17.03", "16.70", "16.32"], ["512", "1,024", "17.53", "17.49", "16.43"], ["512", "2,048", "18.52", "20.00", "16.73"], ["1,024", "512", "17.53", "17.16", "16.36"], ["1,024", "1,024", "18.01", "18.26", "16.41"], ["1,024", "2,048", "19.02", "21.39", "16.74"]].map((row) => <tr key={`${row[0]}-${row[1]}`} className="border-b border-slate-800 last:border-0">{row.map((cell, i) => <td key={i} className={"px-5 py-4 font-mono " + (i === 2 ? "font-black text-orange-200" : "text-slate-400")}>{cell}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-36 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="11 / boundary conditions"
            title="The paper establishes viability, not universal superiority."
            description={
              <>
                LLaDA demonstrates that core language-model capabilities can emerge outside next-token prediction. Its
                current systems costs, controls, data comparisons, and post-training maturity still leave major open questions.
              </>
            }
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-2">
            {[
              { icon: Clock3, title: "User-specified output length", text: "Sampling begins with a fixed number of masks. EOS helps termination, but the allocation remains an inference hyperparameter." },
              { icon: Cpu, title: "No KV cache", text: "Bidirectional predictions recompute the generated region each step. The model uses dense key/value heads and lacks mature inference optimization." },
              { icon: GitBranch, title: "Incomplete controlled scaling", text: "Matched ARM comparisons do not extend through the full 8B, 2.3T-token experiment or beyond 10^23 FLOPs." },
              { icon: Database, title: "Different data regimes", text: "LLaDA uses 2.3T curated tokens; LLaMA3 uses 15T undisclosed-mixture tokens. Benchmark differences cannot be assigned only to architecture." },
              { icon: Activity, title: "SFT-only alignment", text: "LLaDA has no RL alignment. That weakens direct final-system comparisons but also leaves post-training capability unresolved." },
              { icon: TriangleAlert, title: "Sampling sensitivity", text: "Confidence remasking is essential, EOS handling changes instruct results, and autoregressive decoding can collapse on several tasks." },
              { icon: BrainCircuit, title: "Single major run", text: "The 8B pre-training and SFT experiments were each executed once without hyperparameter tuning, limiting uncertainty estimates." },
              { icon: Layers3, title: "Language-only evidence", text: "Multimodal diffusion, agent use, prompt tuning, and specialized LLaDA architectures remain outside the paper's experiments." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="bg-[#101722] p-7"><Icon className="text-rose-300" size={24} /><h3 className="mt-5 text-xl font-black">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p></article>
              );
            })}
          </div>

          <div className="mt-8 rounded-3xl border border-orange-300/20 bg-orange-300/[0.035] p-7 md:p-9">
            <Target className="text-orange-300" size={27} />
            <h3 className="mt-5 text-2xl font-black">What the paper actually proves.</h3>
            <p className="mt-4 max-w-5xl text-base leading-8 text-slate-300">
              A likelihood-based masked diffusion Transformer can be pre-trained from scratch at 8B scale, improve with
              compute, perform in-context learning, acquire instruction-following through SFT, and compete with strong
              autoregressive models across diverse tasks. It does not prove diffusion is always faster, cheaper, or more
              accurate than autoregression.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.75fr]">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">reading checkpoint</p>
              <h3 className="mt-3 text-3xl font-black">You can now reconstruct LLaDA end to end.</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "derive the linear masking kernel",
                  "explain the inverse-ratio loss",
                  "trace pre-training into response-only SFT",
                  "implement low-confidence remasking",
                  "read both benchmark ledgers honestly",
                  "separate paradigm evidence from systems claims"
                ].map((item) => <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#101722] p-4"><ChevronRight className="mt-0.5 shrink-0 text-orange-300" size={15} /><span className="text-sm leading-6 text-slate-400">{item}</span></div>)}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">primary sources</p>
              <div className="mt-4 space-y-3">
                <SourceLink href={links.arxiv}>Official arXiv abstract</SourceLink>
                <SourceLink href={links.html}>Official arXiv HTML</SourceLink>
                <SourceLink href={links.pdf}>Version 3 PDF</SourceLink>
                <SourceLink href={links.project}>Official project and code</SourceLink>
                <SourceLink href={links.doi}>arXiv DOI record</SourceLink>
              </div>
              <div className="mt-7 rounded-2xl border border-slate-800 bg-[#101722] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">paper</p>
                <p className="mt-2 text-sm font-black leading-6 text-slate-300">Large Language Diffusion Models</p>
                <p className="mt-3 text-xs leading-6 text-slate-600">Shen Nie, Fengqi Zhu, Zebin You, Xiaolu Zhang, Jingyang Ou, Jun Hu, Jun Zhou, Yankai Lin, Ji-Rong Wen, and Chongxuan Li</p>
              </div>
            </div>
          </div>

          <PaperTimelineNav
            older={{ href: "/resources/sparks-of-agi", title: "Sparks of AGI", year: 2023 }}
            newer={{ href: "/resources/turboquant", title: "TurboQuant", year: 2025 }}
          />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
