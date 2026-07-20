import Image from "next/image";
import Link from "next/link";
import katex from "katex";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Binary,
  Braces,
  Check,
  ChevronRight,
  CircleDot,
  Cpu,
  Database,
  ExternalLink,
  FileSearch,
  Filter,
  Gauge,
  GitBranch,
  Globe2,
  LockKeyhole,
  MessageSquareText,
  ScanSearch,
  Sparkles,
  Target,
  TextCursorInput,
  TriangleAlert,
  Workflow,
  X
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  pdf: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf",
  overview: "https://openai.com/index/better-language-models/"
};

export const metadata: Metadata = {
  title: "GPT-2: A Complete Technical Deep Dive",
  description:
    "A visual reconstruction of GPT-2: WebText, byte-level BPE, decoder-only scaling, zero-shot task transfer, benchmark evidence, contamination analysis, generation, and limitations."
};

const sections = [
  ["thesis", "Thesis"],
  ["webtext", "WebText"],
  ["tokenizer", "Tokenizer"],
  ["architecture", "Architecture"],
  ["objective", "Objective"],
  ["interface", "Task interface"],
  ["scaling", "Scaling"],
  ["results", "Results"],
  ["overlap", "Overlap"],
  ["generation", "Generation"],
  ["limits", "Limits"]
];

const modelConfigs = [
  { params: "117M", layers: "12", width: "768", role: "GPT-1 scale" },
  { params: "345M", layers: "24", width: "1,024", role: "BERT-Large scale" },
  { params: "762M", layers: "36", width: "1,280", role: "scale probe" },
  { params: "1,542M", layers: "48", width: "1,600", role: "GPT-2" }
];

const webTextSteps = [
  {
    index: "01",
    title: "Use human curation as a filter",
    text: "Collect outbound Reddit links that received at least 3 karma instead of ingesting an unfiltered web crawl.",
    icon: Filter
  },
  {
    index: "02",
    title: "Extract page text",
    text: "Run Dragnet and Newspaper over the linked HTML responses to isolate document text from page chrome.",
    icon: FileSearch
  },
  {
    index: "03",
    title: "Clean and deduplicate",
    text: "Filter low-quality material, deduplicate documents, and keep links created no later than December 2017.",
    icon: Binary
  },
  {
    index: "04",
    title: "Remove Wikipedia",
    text: "Exclude Wikipedia because it feeds many evaluation datasets and would make benchmark overlap harder to interpret.",
    icon: Database
  }
];

const architectureRows = [
  ["Backbone", "decoder-only Transformer"],
  ["Largest model", "48 blocks, 1,600 hidden dimensions"],
  ["Parameters", "1.542 billion"],
  ["Context window", "1,024 tokens"],
  ["Vocabulary", "50,257 byte-level BPE tokens"],
  ["Batch size", "512 sequences"],
  ["Normalization", "pre-norm plus a final layer norm"],
  ["Residual initialization", "weights scaled by 1 / sqrt(N)"],
  ["Validation", "5% held-out WebText split"],
  ["Training state", "all four models still underfit WebText"]
];

const promptRecipes = [
  {
    task: "Summarization",
    context: "article text",
    cue: "TL;DR:",
    decode: "top-k sampling, k = 2",
    metric: "ROUGE"
  },
  {
    task: "Translation",
    context: "English = French examples",
    cue: "new English sentence =",
    decode: "greedy first sentence",
    metric: "BLEU"
  },
  {
    task: "Reading comprehension",
    context: "document + dialogue history",
    cue: "A:",
    decode: "greedy answer",
    metric: "token F1"
  },
  {
    task: "Question answering",
    context: "short QA demonstrations",
    cue: "new question + A:",
    decode: "generated short answer",
    metric: "exact match"
  }
];

const taskResults = [
  {
    task: "CoQA",
    score: "55 F1",
    baseline: "Matches or exceeds 3 of 4 supervised baselines in the paper",
    read: "The strongest direct evidence that a text continuation interface can recover a downstream task.",
    tone: "cyan"
  },
  {
    task: "Winograd",
    score: "70.70%",
    baseline: "+7 points over the prior result reported by the paper",
    read: "A notable scaling result, but only 273 examples make this estimate statistically fragile.",
    tone: "fuchsia"
  },
  {
    task: "LAMBADA",
    score: "8.63 PPL",
    baseline: "63.24% accuracy with the final-word filter",
    read: "Long-context prediction improves sharply; the filtering rule also shows that evaluation format matters.",
    tone: "cyan"
  },
  {
    task: "Natural Questions",
    score: "4.1% EM",
    baseline: "63.1% accuracy on the most confident 1%",
    read: "Parameters store recoverable facts, but the full-set result is still far below retrieval-based QA.",
    tone: "fuchsia"
  },
  {
    task: "WMT14 Fr -> En",
    score: "11.5 BLEU",
    baseline: "Versus 5 BLEU for En -> Fr",
    read: "The English LM helps decoding into English; sparse French exposure limits the reverse direction.",
    tone: "cyan"
  },
  {
    task: "CNN / Daily Mail",
    score: "21.40 R-AVG",
    baseline: "Random-3: 20.98; Bottom-Up: 32.75",
    read: "The model invokes summarization, but the quantitative result is only marginally above a random extractive control.",
    tone: "fuchsia"
  }
];

const lmRows = [
  ["LAMBADA PPL", "99.8", "35.13", "15.60", "10.87", "8.63"],
  ["LAMBADA ACC", "59.23", "45.99", "55.48", "60.12", "63.24"],
  ["CBT common nouns", "85.7", "87.65", "92.35", "93.45", "93.30"],
  ["CBT named entities", "82.3", "83.4", "87.1", "88.0", "89.05"],
  ["WikiText-2 PPL", "39.14", "29.41", "22.76", "19.93", "18.34"],
  ["Penn Treebank PPL", "46.54", "65.85", "47.33", "40.31", "35.76"],
  ["enwik8 BPB", "0.99", "1.16", "1.01", "0.97", "0.93"],
  ["text8 BPC", "1.08", "1.17", "1.06", "1.02", "0.98"],
  ["WikiText-103 PPL", "18.3", "37.50", "26.37", "22.05", "17.48"],
  ["1 Billion Word PPL", "21.8", "75.20", "55.72", "44.575", "42.16"]
];

const overlapRows = [
  ["Penn Treebank", "2.67%", "0.88%"],
  ["WikiText-2", "0.66%", "1.63%"],
  ["enwik8", "7.50%", "6.31%"],
  ["text8", "2.34%", "3.94%"],
  ["WikiText-103", "9.09%", "2.42%"],
  ["1 Billion Word", "13.19%", "3.75%"]
];

const formulas = {
  factorization: String.raw`p(x)=\prod_{t=1}^{T}p\!\left(s_t\mid s_1,\ldots,s_{t-1}\right)`,
  objective: String.raw`\mathcal{L}_{\mathrm{LM}}(x)=-\sum_{t=1}^{T}\log p_{\theta}\!\left(x_t\mid x_{<t}\right)`,
  multitask: String.raw`p(\text{output}\mid\text{input},\text{task})\;\subset\;p_{\theta}(x_t\mid x_{<t})`,
  attention: String.raw`\operatorname{Attn}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_k}}+M_{\mathrm{causal}}\right)V`,
  prenorm: String.raw`u_{\ell}=h_{\ell}+\operatorname{Attn}(\operatorname{LN}(h_{\ell})),\qquad h_{\ell+1}=u_{\ell}+\operatorname{MLP}(\operatorname{LN}(u_{\ell}))`,
  init: String.raw`W_{\mathrm{residual}}\leftarrow\frac{1}{\sqrt{N}}W_{\mathrm{residual}},\qquad N=\text{number of residual layers}`,
  perplexity: String.raw`\operatorname{PPL}(x)=\exp\!\left(-\frac{1}{T}\sum_{t=1}^{T}\log p_{\theta}(x_t\mid x_{<t})\right)`,
  overlap: String.raw`\operatorname{overlap}(D)=\frac{\#\{\text{normalized test 8-grams found in WebText}\}}{\#\{\text{test 8-grams}\}}`,
  topk: String.raw`p_k(x_t)=\frac{p(x_t)\,\mathbf{1}[x_t\in\operatorname{TopK}(p,k)]}{\sum_{j\in\operatorname{TopK}(p,k)}p(j)}`
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
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-fuchsia-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({
  label,
  formula,
  note,
  tone = "fuchsia"
}: {
  label: string;
  formula: string;
  note?: ReactNode;
  tone?: "fuchsia" | "cyan" | "rose";
}) {
  const tones = {
    fuchsia: "border-fuchsia-300/20 bg-fuchsia-300/5 text-fuchsia-50",
    cyan: "border-cyan-300/20 bg-cyan-300/5 text-cyan-50",
    rose: "border-rose-300/20 bg-rose-300/5 text-rose-50"
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
      <div className="flex min-h-48 items-center justify-center bg-white p-4 sm:p-7">
        <Image src={src} alt={title} width={width} height={height} className="h-auto max-h-[760px] w-full object-contain" />
      </div>
      <figcaption className="border-t border-slate-800 p-5 sm:p-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-300">{label}</p>
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
      className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-fuchsia-300 transition-colors hover:text-white"
    >
      {children} <ExternalLink size={13} />
    </a>
  );
}

export default function GPT2Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] font-sans text-white selection:bg-fuchsia-500/30">
      <SiteNav />

      <header className="relative border-b border-slate-800/80 px-6 pb-20 pt-32 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,121,249,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute left-[12%] top-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[8%] top-36 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <Link
            href="/resources"
            className="mb-10 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-fuchsia-300"
          >
            <ArrowLeft size={14} /> Resource library
          </Link>

          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-200">
                  Paper 05 / 2019
                </span>
                <span className="font-mono text-xs text-slate-500">OpenAI</span>
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">
                Language Models Are
                <span className="mt-2 block bg-gradient-to-r from-fuchsia-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  Unsupervised Multitask Learners
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400 md:text-xl">
                GPT-2 asks a foundational question: can next-token prediction over sufficiently varied web text make one model infer
                tasks directly from language, without gradient updates or task-specific heads?
              </p>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
                <SourceLink href={links.pdf}>Read the paper</SourceLink>
                <SourceLink href={links.overview}>OpenAI overview</SourceLink>
              </div>

              <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["1.5B", "parameters"],
                  ["48", "decoder blocks"],
                  ["8M+", "documents"],
                  ["0", "task updates"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-800 bg-[#101722]/90 p-4">
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="overflow-hidden rounded-3xl border border-fuchsia-300/20 bg-[#101722] shadow-[0_30px_100px_-52px_rgba(232,121,249,0.85)]">
                <div className="flex items-center justify-between border-b border-slate-800 bg-[#0b1119] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">latent_task_router.py</span>
                </div>

                <div className="space-y-5 p-5 sm:p-7">
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
                    <span className="text-fuchsia-300">$</span> infer --task from-context
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-[#0b1119] p-5 font-mono text-sm leading-7">
                    <p className="text-slate-500">[document]</p>
                    <p className="mt-2 text-slate-300">A model was trained on millions of web pages...</p>
                    <p className="mt-4 text-cyan-300">TL;DR:</p>
                    <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-4 text-fuchsia-200">
                      <Sparkles size={16} />
                      <span>The prompt format selects a learned behavior.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">training</p>
                      <p className="mt-2 text-sm font-bold text-slate-200">predict text</p>
                    </div>
                    <ArrowRight className="text-slate-600" size={18} />
                    <div className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-300/5 p-4 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300">emergent</p>
                      <p className="mt-2 text-sm font-bold text-slate-200">perform tasks</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    <span>weights frozen</span>
                    <span className="text-cyan-300">zero-shot enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-16 z-30 border-b border-slate-800/90 bg-[#0d1117]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 py-4 sm:px-8">
          {sections.map(([href, label], index) => (
            <a
              key={href}
              href={`#${href}`}
              className="flex shrink-0 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-fuchsia-300"
            >
              <span className="text-slate-700">{String(index + 1).padStart(2, "0")}</span> {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="thesis" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="01 / Thesis"
            title="The task can live inside the text"
            description={
              <>
                Standard multitask systems explicitly label the task and optimize each objective. GPT-2 proposes that naturally
                occurring text already contains demonstrations of translation, summarization, question answering, and many other
                behaviors. A high-capacity language model can learn those patterns through one shared objective.
              </>
            }
          />

          <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-300/5 text-rose-300">
                  <GitBranch size={23} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-300">explicit multitask</span>
              </div>
              <h3 className="mt-6 text-2xl font-black">One labeled pipeline per task</h3>
              <div className="mt-6 space-y-3">
                {["translation dataset + loss", "QA dataset + loss", "summarization dataset + loss"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0b1119] px-4 py-3 text-sm text-slate-400">
                    <CircleDot size={15} className="text-rose-300" /> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <ArrowRight className="text-slate-700" size={28} />
            </div>

            <div className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[0.04] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-300">
                  <MessageSquareText size={23} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-300">GPT-2 hypothesis</span>
              </div>
              <h3 className="mt-6 text-2xl font-black">One stream, tasks expressed as language</h3>
              <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0b1119] p-5 font-mono text-sm leading-7">
                <span className="text-cyan-300">task cue</span>
                <span className="text-slate-600"> + </span>
                <span className="text-slate-300">input</span>
                <span className="text-slate-600"> + </span>
                <span className="text-fuchsia-300">output</span>
                <p className="mt-4 border-t border-slate-800 pt-4 text-xs text-slate-500">all optimized as next-token prediction</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["No task labels", "The pre-training corpus is not annotated with a finite list of tasks.", Braces],
              ["No parameter updates", "Evaluation changes only the context presented to the frozen language model.", LockKeyhole],
              ["Capacity is the lever", "The paper tests whether task behavior strengthens as model size increases.", Gauge]
            ].map(([title, text, Icon]) => {
              const CardIcon = Icon as typeof Braces;
              return (
                <div key={String(title)} className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                  <CardIcon className="text-cyan-300" size={20} />
                  <p className="mt-5 font-black text-slate-100">{String(title)}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{String(text)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="webtext" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="02 / WebText"
            title="Diversity is part of the learning algorithm"
            description="The paper treats corpus construction as a systems decision. It replaces a single clean domain with a broad web distribution, then uses human link voting as a rough quality prior."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {webTextSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.index} className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#101722] p-6">
                  <div className="absolute right-4 top-3 font-mono text-5xl font-black text-white/[0.03]">{step.index}</div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/5 text-cyan-300">
                    <Icon size={20} />
                  </div>
                  <p className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-300">stage {step.index}</p>
                  <h3 className="mt-3 text-lg font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{step.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[0.04] p-6 sm:p-8">
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-fuchsia-300">WebText snapshot</p>
              <div className="mt-7 grid grid-cols-2 gap-4">
                {[
                  ["45M", "candidate links"],
                  ["8M+", "documents after cleaning"],
                  ["40 GB", "final text"],
                  ["3+", "minimum Reddit karma"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-800 bg-[#0b1119] p-4">
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100/70">
                <TriangleAlert className="mt-0.5 shrink-0 text-amber-300" size={18} />
                Reddit votes are not a neutral definition of quality. The filter imports the platform&apos;s demographic, cultural, and
                popularity biases into the training distribution.
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8">
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Why the corpus can teach tasks</p>
              <h3 className="mt-3 text-2xl font-black">Natural demonstrations are hidden in ordinary documents</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                A web page can contain a translated quotation, a question followed by an answer, an article followed by a short
                description, or instructions paired with an outcome. Predicting these sequences rewards the model for inferring the
                relation between the pieces even though no task identifier is supplied.
              </p>
              <div className="mt-6 space-y-3 font-mono text-xs">
                {[
                  ["quoted sentence", "translation"],
                  ["headline + article", "summarization"],
                  ["question + reply", "question answering"],
                  ["problem + solution", "procedural reasoning"]
                ].map(([source, behavior]) => (
                  <div key={source} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-slate-800 bg-[#0b1119] px-4 py-3">
                    <span className="text-slate-400">{source}</span>
                    <ChevronRight size={14} className="text-slate-700" />
                    <span className="text-fuchsia-300">{behavior}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tokenizer" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="03 / Input representation"
            title="Byte-level BPE removes the unknown-token wall"
            description="GPT-2 needs to assign probability to any Unicode string while keeping sequences shorter than raw bytes. Its tokenizer begins with 256 byte symbols, then learns frequent multi-byte merges."
          />

          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                representation trade-off
              </div>
              <div className="grid gap-px bg-slate-800 sm:grid-cols-3">
                {[
                  ["Word tokens", "short sequences", "cannot cover arbitrary strings", "text-rose-300"],
                  ["Raw bytes", "universal coverage", "very long sequences", "text-amber-300"],
                  ["Byte BPE", "coverage + compression", "GPT-2 choice", "text-cyan-300"]
                ].map(([title, win, cost, tone]) => (
                  <div key={title} className="bg-[#101722] p-5">
                    <p className={`font-mono text-xs font-black uppercase tracking-wider ${tone}`}>{title}</p>
                    <p className="mt-5 flex items-center gap-2 text-sm text-slate-300"><Check size={15} className="text-cyan-300" /> {win}</p>
                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><X size={15} className="text-rose-300" /> {cost}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">tokenization trace</p>
                <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-sm">
                  {["un", "super", "vised", " multi", "task", " learners", "!"].map((token, index) => (
                    <span
                      key={`${token}-${index}`}
                      className={`rounded-lg border px-3 py-2 ${index % 2 === 0 ? "border-fuchsia-300/25 bg-fuchsia-300/5 text-fuchsia-200" : "border-cyan-300/25 bg-cyan-300/5 text-cyan-200"}`}
                    >
                      {token.replace(" ", "_ ")}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-500">
                  This is an illustrative segmentation, not the exact GPT-2 encoding. Frequent sequences can become one token; rare
                  strings fall back toward bytes, so every input remains representable.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.04] p-6 sm:p-8">
                <TextCursorInput className="text-cyan-300" size={25} />
                <h3 className="mt-5 text-2xl font-black">Category-aware merge constraints</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Naive byte BPE wastes vocabulary slots on punctuation variants such as <span className="font-mono text-slate-200">dog.</span>,{" "}
                  <span className="font-mono text-slate-200">dog!</span>, and <span className="font-mono text-slate-200">dog?</span>.
                  GPT-2 blocks merges across character categories, with a special treatment for spaces, to reduce this fragmentation.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black text-fuchsia-300">50,257</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">final vocabulary</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-cyan-300">256</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">base bytes</p>
                  </div>
                </div>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-full bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-rose-400" />
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-500">
                  The representation is invertible, which lets the paper evaluate raw text across datasets without mapping unseen
                  strings to an unknown token.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="04 / Architecture"
            title="GPT-1, scaled and stabilized"
            description="The backbone remains a causal Transformer decoder. GPT-2 moves layer normalization before each sub-block, adds a final layer norm, expands context and vocabulary, and adjusts residual initialization for depth."
          />

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-fuchsia-300/20 bg-[#101722] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-fuchsia-300">decoder data path</p>
                <Cpu className="text-slate-600" size={22} />
              </div>

              <div className="mx-auto mt-8 max-w-lg space-y-3 text-center">
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 px-4 py-3 font-mono text-sm text-cyan-200">
                  byte-BPE token ids + positions
                </div>
                <ArrowDown className="mx-auto text-slate-700" size={18} />
                <div className="space-y-2 rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/[0.04] p-4">
                  <div className="rounded-xl border border-slate-700 bg-[#0b1119] px-4 py-3 text-sm font-bold text-slate-200">LN -&gt; masked self-attention -&gt; residual</div>
                  <div className="rounded-xl border border-slate-700 bg-[#0b1119] px-4 py-3 text-sm font-bold text-slate-200">LN -&gt; MLP -&gt; residual</div>
                  <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-300">repeat x 48</p>
                </div>
                <ArrowDown className="mx-auto text-slate-700" size={18} />
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 px-4 py-3 font-mono text-sm text-cyan-200">final LN -&gt; vocabulary logits</div>
                <ArrowDown className="mx-auto text-slate-700" size={18} />
                <div className="rounded-xl border border-slate-700 bg-[#0b1119] px-4 py-3 font-mono text-sm text-slate-300">softmax -&gt; next-token distribution</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                implementation sheet
              </div>
              <div className="divide-y divide-slate-800">
                {architectureRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[0.85fr_1.15fr] gap-4 px-6 py-4 text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-bold text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {modelConfigs.map((model, index) => (
              <div
                key={model.params}
                className={`relative overflow-hidden rounded-2xl border p-5 ${index === modelConfigs.length - 1 ? "border-fuchsia-300/30 bg-fuchsia-300/[0.06]" : "border-slate-800 bg-[#101722]"}`}
              >
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-300 to-fuchsia-400" style={{ width: `${25 * (index + 1)}%` }} />
                <p className="text-3xl font-black text-white">{model.params}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{model.role}</p>
                <div className="mt-5 flex justify-between text-sm">
                  <span className="text-slate-500">layers</span><span className="font-bold text-cyan-300">{model.layers}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-500">width</span><span className="font-bold text-fuchsia-300">{model.width}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="objective" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="05 / Mathematics"
            title="One objective absorbs every task"
            description="The model never receives a separate translation or QA loss. Every document is flattened into a causal sequence, and every token is trained to predict what comes next."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Equation
              label="autoregressive factorization"
              formula={formulas.factorization}
              tone="cyan"
              note="The joint probability of a sequence becomes a product of next-token conditionals. This makes both likelihood evaluation and left-to-right sampling tractable."
            />
            <Equation
              label="training loss"
              formula={formulas.objective}
              note="Minimizing cross-entropy rewards any representation that helps predict future text, including latent knowledge of formats, domains, and recurring input-output relations."
            />
            <Equation
              label="multitask reduction"
              formula={formulas.multitask}
              tone="rose"
              note="If task, input, and output are serialized in one text stream, supervised conditional prediction is embedded inside ordinary language modeling. The subset symbol is conceptual: the task is represented by context, not a separate model input."
            />
            <Equation
              label="causal self-attention"
              formula={formulas.attention}
              tone="cyan"
              note="The triangular mask prevents token t from reading future tokens. Every hidden state is therefore a valid summary of the prefix available at generation time."
            />
            <Equation
              label="pre-norm residual block"
              formula={formulas.prenorm}
              note="Layer normalization is applied before attention and the MLP. This differs from the post-norm layout used in the original Transformer and helps stabilize deeper residual stacks."
            />
            <Equation
              label="depth-aware initialization"
              formula={formulas.init}
              tone="rose"
              note="Scaling residual-path weights by the inverse square root of the number of residual layers limits variance accumulation as depth grows."
            />
          </div>

          <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.04] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                <Target size={26} />
              </div>
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">critical distinction</p>
                <h3 className="mt-2 text-xl font-black">Unsupervised training does not mean unconditioned behavior</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  The model is still conditioned at inference time. The conditioning signal is simply a sequence of natural-language
                  examples or cues instead of a task ID, output head, or gradient update.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-[#0b1119] px-5 py-4 font-mono text-xs text-fuchsia-300">
                context = task specification
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="interface" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="06 / Zero-shot interface"
            title="Prompting before it was called prompting"
            description="Each benchmark is converted into a plausible continuation pattern. This is zero-shot with respect to parameter updates, but it is not format-free: the authors choose cues and decoding rules that expose the desired behavior."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {promptRecipes.map((recipe, index) => (
              <article key={recipe.task} className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-fuchsia-300">0{index + 1}</span>
                    <h3 className="font-black">{recipe.task}</h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">frozen weights</span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 font-mono text-xs">
                    <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-cyan-200">{recipe.context}</div>
                    <ChevronRight size={16} className="text-slate-700" />
                    <div className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-300/5 p-4 text-fuchsia-200">{recipe.cue}</div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-[#0b1119] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">decode</p>
                      <p className="mt-2 text-sm font-bold text-slate-300">{recipe.decode}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-[#0b1119] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">score</p>
                      <p className="mt-2 text-sm font-bold text-slate-300">{recipe.metric}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["Language model", "stays unchanged", Cpu, "text-cyan-300"],
              ["Context", "describes the task", MessageSquareText, "text-fuchsia-300"],
              ["Decoder", "turns distribution into an answer", Workflow, "text-rose-300"]
            ].map(([title, text, Icon, tone]) => {
              const CardIcon = Icon as typeof Cpu;
              return (
                <div key={String(title)} className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                  <CardIcon className={String(tone)} size={20} />
                  <p className="mt-5 font-black">{String(title)}</p>
                  <p className="mt-2 text-sm text-slate-500">{String(text)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="scaling" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="07 / Capacity experiment"
            title="Scale is the independent variable"
            description="The four models share the same objective and data family. As parameter count grows, zero-shot behavior generally improves in a roughly log-linear trend across reading comprehension, translation, summarization, and factual QA."
          />

          <FigureCard
            src="/images/resources/gpt-2/zero-shot-scaling.png"
            width={1470}
            height={465}
            label="paper figure 1"
            title="Zero-shot task performance as a function of model size"
            caption="Every plotted task improves with capacity, but the absolute position matters: CoQA becomes competitive with early supervised baselines, while translation, summarization, and open-domain QA remain far from the strongest systems of the period."
          />

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <FigureCard
              src="/images/resources/gpt-2/webtext-underfit.png"
              width={690}
              height={609}
              label="paper figure 4"
              title="Train and held-out WebText perplexity fall together"
              caption="The curves remain close and both improve with model size. The authors interpret this as evidence that even the 1.5B model has not exhausted WebText rather than merely memorizing the training split."
            />

            <div className="space-y-5">
              <Equation
                label="perplexity"
                formula={formulas.perplexity}
                tone="cyan"
                note="Lower perplexity means the model assigns more probability to the observed sequence. Because tokenizations differ across benchmarks, the paper also reports bits per byte or character where appropriate."
              />
              <div className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[0.04] p-6 sm:p-8">
                <Activity className="text-fuchsia-300" size={24} />
                <h3 className="mt-5 text-2xl font-black">What the experiment actually establishes</h3>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-400">
                  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-cyan-300" size={17} /> More capacity consistently unlocks stronger zero-shot behavior under the tested setup.</li>
                  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-cyan-300" size={17} /> The same next-token objective supports multiple evaluation interfaces.</li>
                  <li className="flex gap-3"><X className="mt-1 shrink-0 text-rose-300" size={17} /> It does not show that scaling alone closes every task gap or produces robust general-purpose intelligence.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="08 / Evidence"
            title="The result matrix, not just the headline"
            description="GPT-2 reaches a new zero-shot language-modeling result on seven of eight datasets in the paper. Downstream task evidence is more mixed: the model often performs the behavior, but only some tasks become competitive."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {taskResults.map((result) => (
              <article key={result.task} className="flex min-w-0 flex-col rounded-3xl border border-slate-800 bg-[#101722] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">zero-shot task</p>
                    <h3 className="mt-2 text-lg font-black">{result.task}</h3>
                  </div>
                  <span className={`text-right text-2xl font-black ${result.tone === "cyan" ? "text-cyan-300" : "text-fuchsia-300"}`}>{result.score}</span>
                </div>
                <p className="mt-5 border-t border-slate-800 pt-5 text-sm font-bold leading-6 text-slate-300">{result.baseline}</p>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">{result.read}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-300">paper table 3 reconstructed</p>
                <h3 className="mt-2 text-xl font-black">Zero-shot language-modeling benchmarks</h3>
              </div>
              <p className="text-xs text-slate-600">Bold in the paper marks a new best result.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-[#0b1119] font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    {['Dataset / metric', 'Prior SOTA', '117M', '345M', '762M', '1,542M'].map((head) => (
                      <th key={head} className="px-5 py-4 font-bold">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {lmRows.map((row) => (
                    <tr key={row[0]} className="transition-colors hover:bg-white/[0.02]">
                      {row.map((cell, index) => (
                        <td key={`${row[0]}-${index}`} className={`px-5 py-4 ${index === 0 ? "font-bold text-slate-200" : index === 5 ? "font-black text-cyan-300" : "font-mono text-slate-500"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <FigureCard
              src="/images/resources/gpt-2/language-modeling-results.png"
              width={1470}
              height={279}
              label="original paper table"
              title="Table 3 as printed in the paper"
              caption="The main exception is 1 Billion Word, where GPT-2 remains behind the prior result. The paper attributes this partly to sentence shuffling and aggressive preprocessing that remove the long-range structure WebText models exploit."
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <FigureCard
              src="/images/resources/gpt-2/cbt-scaling.png"
              width={705}
              height={405}
              label="paper figure 2"
              title="Children's Book Test closes much of the human gap"
              caption="Common-noun and named-entity accuracy generally rise with model capacity. The paper reports the validation set because one test book, The Jungle Book, appeared in WebText."
            />
            <FigureCard
              src="/images/resources/gpt-2/winograd-scaling.png"
              width={705}
              height={525}
              label="paper figure 3"
              title="Winograd accuracy rises with capacity"
              caption="Both partial and full scoring improve. The 70.70% headline comes from a very small 273-example benchmark, so it should be read as promising evidence rather than a precise capability estimate."
            />
          </div>

          <div className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-6 sm:p-8">
            <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-start">
              <TriangleAlert className="text-amber-300" size={25} />
              <div>
                <h3 className="text-xl font-black text-amber-100">A benchmark win is not the same as broad task mastery</h3>
                <p className="mt-3 text-sm leading-7 text-amber-100/60">
                  On CoQA, inspection suggests simple retrieval heuristics such as returning a person name for a who-question. On
                  summarization, GPT-2 is only slightly above a random three-sentence baseline. On translation and QA, performance is
                  far below specialized systems. The paper is strongest as evidence of task emergence and scaling, not task completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overlap" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="09 / Generalization audit"
            title="Did GPT-2 learn, or did WebText contain the test set?"
            description="The paper explicitly measures data contamination with normalized 8-gram Bloom filters. This is an unusually important part of the work because web-scale corpora make accidental benchmark overlap likely."
          />

          <Equation
            label="test overlap estimator"
            formula={formulas.overlap}
            tone="cyan"
            note="Strings are lowercased and normalized to alphanumeric words separated by one space. The Bloom filter false-positive rate is bounded by 10^-8, and a one-million-string check produced zero positives."
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <FigureCard
              src="/images/resources/gpt-2/benchmark-overlap.png"
              width={1020}
              height={225}
              label="paper table 6"
              title="Test 8-grams found in each training source"
              caption="WebText overlap averages 3.2% across these language-modeling tests. The datasets' own train splits average 5.9%, showing that contamination is not unique to WebText."
            />

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="grid grid-cols-[1fr_0.7fr_0.7fr] border-b border-slate-800 bg-[#0b1119] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
                <span>test set</span><span>own train</span><span className="text-cyan-300">WebText</span>
              </div>
              <div className="divide-y divide-slate-800">
                {overlapRows.map(([name, own, web]) => (
                  <div key={name} className="grid grid-cols-[1fr_0.7fr_0.7fr] px-5 py-4 text-sm">
                    <span className="font-bold text-slate-300">{name}</span>
                    <span className="font-mono text-slate-600">{own}</span>
                    <span className="font-mono font-bold text-cyan-300">{web}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["CoQA", "About 15% of news documents appear in WebText; estimated aggregate gain is only 0.5 to 1.0 F1.", "small benefit"],
              ["LAMBADA", "Removing every overlapping example changes PPL 8.6 -> 8.7 and accuracy 63.2% -> 62.9%.", "result survives"],
              ["Winograd", "Ten schemas have an 8-gram match; two are spurious and only one remaining context reveals the answer.", "limited leakage"]
            ].map(([title, text, status]) => (
              <article key={title} className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black">{title}</h3>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-fuchsia-300">{status}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-500">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[0.04] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <ScanSearch className="shrink-0 text-fuchsia-300" size={28} />
              <p className="text-sm leading-7 text-slate-400">
                The authors conclude that overlap gives a small, consistent benefit but does not explain the overall result. Their
                broader recommendation is now standard evaluation hygiene: deduplicate training and test data with n-gram checks and,
                where possible, scalable fuzzy matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="generation" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="10 / Decoding"
            title="The model defines probabilities; the sampler defines behavior"
            description="GPT-2's qualitative output depends on a decoding policy. The paper uses greedy decoding for deterministic task outputs and small top-k candidate sets to trade diversity against repetition in open generation."
          />

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Equation
              label="top-k renormalization"
              formula={formulas.topk}
              tone="cyan"
              note="Tokens outside the k highest-probability candidates receive zero mass; the remaining probabilities are renormalized. The paper uses k = 40 for open-ended samples and k = 2 for CNN/Daily Mail summaries."
            />

            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8">
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-fuchsia-300">decoding map</p>
              <div className="mt-6 space-y-3">
                {[
                  ["Open generation", "top-k, k = 40", "more variation"],
                  ["Summarization", "top-k, k = 2", "less repetition"],
                  ["Translation", "greedy", "first sentence"],
                  ["CoQA", "greedy", "direct answer"]
                ].map(([task, decoder, output]) => (
                  <div key={task} className="grid grid-cols-[1fr_0.9fr_0.8fr] items-center gap-3 rounded-xl border border-slate-800 bg-[#0b1119] px-4 py-3 text-xs">
                    <span className="font-bold text-slate-300">{task}</span>
                    <span className="font-mono text-cyan-300">{decoder}</span>
                    <span className="text-right text-slate-600">{output}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-fuchsia-300/20 bg-[#101722]">
            <div className="grid gap-px bg-slate-800 lg:grid-cols-2">
              <div className="bg-[#101722] p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <Globe2 className="text-cyan-300" size={22} />
                  <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-300">what improved</p>
                </div>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-400">
                  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-cyan-300" size={17} /> Paragraph-level topic and style remain coherent for longer spans.</li>
                  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-cyan-300" size={17} /> The model can continue unfamiliar formats without an explicit schema.</li>
                  <li className="flex gap-3"><Check className="mt-1 shrink-0 text-cyan-300" size={17} /> Larger models produce visibly stronger non-cherry-picked completions.</li>
                </ul>
              </div>
              <div className="bg-[#101722] p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <TriangleAlert className="text-rose-300" size={22} />
                  <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-rose-300">what still fails</p>
                </div>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-400">
                  <li className="flex gap-3"><X className="mt-1 shrink-0 text-rose-300" size={17} /> Plausible prose can contain invented facts and broken causal structure.</li>
                  <li className="flex gap-3"><X className="mt-1 shrink-0 text-rose-300" size={17} /> Multiple samples from one context vary greatly in quality and consistency.</li>
                  <li className="flex gap-3"><X className="mt-1 shrink-0 text-rose-300" size={17} /> A fluent completion is not evidence that the model has verified its claims.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-32 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="11 / Critical reading"
            title="What GPT-2 proved, and what it did not"
            description="The paper changed the direction of language modeling by showing that scale and data diversity produce transferable behaviors. Its own discussion is clear that most zero-shot task performance was still rudimentary."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Prompt sensitivity", "Task behavior depends on hand-selected textual cues and output parsing. Zero-shot does not mean evaluator-independent.", MessageSquareText],
              ["Web bias", "Human filtering improves average quality but also transfers Reddit's selection biases into the corpus.", Globe2],
              ["Benchmark contamination", "Web-scale training makes overlap inevitable; exact 8-grams detect only one form of leakage.", ScanSearch],
              ["Weak absolute task scores", "Translation, summarization, and full-set factual QA remain far behind specialized systems.", Gauge],
              ["Unidirectional context", "Causal attention cannot use future tokens when encoding a position, unlike bidirectional representation models.", ArrowRight],
              ["Fluency is not truth", "The objective rewards likely continuations, not source attribution, factual verification, or calibrated abstention.", TriangleAlert]
            ].map(([title, text, Icon]) => {
              const CardIcon = Icon as typeof Gauge;
              return (
                <article key={String(title)} className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
                  <CardIcon className="text-fuchsia-300" size={22} />
                  <h3 className="mt-5 text-lg font-black">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{String(text)}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-300/[0.08] via-[#101722] to-cyan-300/[0.06]">
            <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-fuchsia-300">the durable idea</p>
                <p className="mt-4 text-4xl font-black leading-tight">Task learning can emerge from sequence prediction.</p>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-400">
                <p>
                  GPT-1 showed that a generative Transformer could be pre-trained and then fine-tuned. GPT-2 removes the fine-tuning
                  requirement from the experiment and asks what the frozen model already knows how to do.
                </p>
                <p>
                  The answer is not &quot;everything.&quot; It is that task behavior appears continuously with capacity, corpus diversity, and
                  the right textual interface. That observation is the conceptual bridge from representation pre-training to modern
                  general-purpose language models.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center"><SourceLink href={links.pdf}>Open original PDF</SourceLink></div>
          <PaperTimelineNav
            older={{ href: "/resources/gpt-1", title: "GPT-1", year: 2018 }}
            newer={{ href: "/resources/bert", title: "BERT", year: 2019 }}
          />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
