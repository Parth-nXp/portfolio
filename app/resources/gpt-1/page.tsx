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
  Check,
  ChevronRight,
  CircleDot,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  MessageSquareCode,
  Network,
  ScanSearch,
  Sparkles,
  Target,
  TriangleAlert,
  Workflow,
  X
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  pdf: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf",
  overview: "https://openai.com/index/language-unsupervised/"
};

export const metadata: Metadata = {
  title: "GPT-1: A Complete Technical Deep Dive",
  description:
    "A visual, equation-first reconstruction of GPT-1: causal language-model pre-training, task-aware fine-tuning, transfer results, zero-shot analysis, ablations, and limitations."
};

const sections = [
  ["thesis", "The thesis"],
  ["architecture", "Architecture"],
  ["pretraining", "Pre-training"],
  ["finetuning", "Fine-tuning"],
  ["formats", "Task formats"],
  ["training", "Training"],
  ["results", "Results"],
  ["transfer", "Transfer"],
  ["ablations", "Ablations"],
  ["limits", "Limits"]
];

const resultRows = [
  ["MultiNLI", "accuracy", "80.6 / 80.1", "82.1 / 81.4", "+1.5 / +1.3", "win"],
  ["SNLI", "accuracy", "89.3", "89.9", "+0.6", "win"],
  ["SciTail", "accuracy", "83.3", "88.3", "+5.0", "win"],
  ["QNLI", "accuracy", "82.3", "88.1", "+5.8", "win"],
  ["RTE", "accuracy", "61.7", "56.0", "-5.7", "loss"],
  ["Story Cloze", "accuracy", "77.6", "86.5", "+8.9", "win"],
  ["RACE", "accuracy", "53.3", "59.0", "+5.7", "win"],
  ["MRPC", "F1", "86.0", "82.3", "-3.7", "loss"],
  ["STS-B", "Pearson", "81.0", "82.0", "+1.0", "win"],
  ["QQP", "F1", "66.1", "70.3", "+4.2", "win"],
  ["SST-2", "accuracy", "93.2", "91.3", "-1.9", "loss"],
  ["CoLA", "Matthews", "35.0", "45.4", "+10.4", "win"]
];

const ablationRows = [
  ["Transformer + auxiliary LM", "74.7", "45.4", "91.3", "82.3", "82.0", "70.3", "81.8", "88.1", "56.0"],
  ["Transformer, no pre-training", "59.9", "18.9", "84.0", "79.4", "30.9", "65.5", "75.7", "71.2", "53.8"],
  ["Transformer, no auxiliary LM", "75.0", "47.9", "92.0", "84.9", "83.2", "69.8", "81.1", "86.9", "54.4"],
  ["LSTM + auxiliary LM", "69.1", "30.3", "90.5", "83.2", "71.8", "68.1", "73.7", "81.1", "54.6"]
];

const taskFormats = [
  {
    label: "Classification",
    tokens: ["start", "text", "extract"],
    detail: "Read the final extract token and project its top-layer state into the class space."
  },
  {
    label: "Entailment",
    tokens: ["start", "premise", "delimiter", "hypothesis", "extract"],
    detail: "Pack both sequences into one causal stream so later tokens can condition on the premise."
  },
  {
    label: "Similarity",
    tokens: ["A -> B", "B -> A", "add", "extract"],
    detail: "Run both sentence orders independently, then add the resulting representations."
  },
  {
    label: "Multiple choice",
    tokens: ["context", "question", "delimiter", "answer i", "extract"],
    detail: "Score each candidate sequence independently and normalize the candidate scores."
  }
];

const trainingRows = [
  ["Backbone", "12-layer decoder-only Transformer"],
  ["Hidden / heads", "768 dimensions / 12 heads"],
  ["Feed-forward", "3,072 inner dimensions, GELU"],
  ["Context", "512 BPE tokens"],
  ["Tokenizer", "40,000 BPE merges"],
  ["Batch", "64 contiguous sequences x 512 tokens"],
  ["Schedule", "100 epochs, 2,000-step warmup, cosine decay"],
  ["Peak learning rate", "2.5 x 10^-4 with Adam"],
  ["Regularization", "0.1 dropout, modified L2 = 0.01"],
  ["Initialization", "Normal(0, 0.02)"],
  ["Fine-tuning", "3 epochs, batch 32, LR 6.25 x 10^-5"],
  ["Joint objective", "lambda = 0.5, classifier dropout = 0.1"]
];

const zeroShotTasks = [
  ["CoLA", "Threshold the average token log-probability to separate acceptable from unacceptable sentences."],
  ["SST-2", "Append the word 'very' and compare the probabilities of positive and negative completions."],
  ["RACE", "Choose the answer with the highest average token log-probability after document and question."],
  ["Winograd", "Substitute each candidate referent and select the continuation with higher model probability."]
];

const formulas = {
  lm: String.raw`L_1(\mathcal{U}) = \sum_i \log P\!\left(u_i \mid u_{i-k},\ldots,u_{i-1};\Theta\right)`,
  model: String.raw`h_0 = U W_e + W_p,\qquad h_\ell = \operatorname{block}(h_{\ell-1}),\qquad P(u)=\operatorname{softmax}(h_n W_e^{\mathsf T})`,
  supervised: String.raw`P\!\left(y\mid x^1,\ldots,x^m\right)=\operatorname{softmax}\!\left(h_l^m W_y\right)`,
  objective: String.raw`L_3(\mathcal{C}) = L_2(\mathcal{C}) + \lambda L_1(\mathcal{C}),\qquad \lambda = 0.5`,
  causal: String.raw`\operatorname{Attn}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_k}}+M_{\mathrm{causal}}\right)V`
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
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-emerald-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({
  label,
  formula,
  note,
  tone = "emerald"
}: {
  label: string;
  formula: string;
  note?: ReactNode;
  tone?: "emerald" | "sky" | "rose";
}) {
  const tones = {
    emerald: "border-emerald-300/20 bg-emerald-300/5 text-emerald-50",
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
  caption
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  title: string;
  caption: ReactNode;
}) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
      <div className="flex min-h-52 items-center justify-center bg-white p-4 sm:p-7">
        <Image src={src} alt={title} width={width} height={height} className="h-auto max-h-[760px] w-full object-contain" />
      </div>
      <figcaption className="border-t border-slate-800 p-5 sm:p-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">{label}</p>
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
      className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-emerald-300 transition-colors hover:text-white"
    >
      {children} <ExternalLink size={13} />
    </a>
  );
}

function TransferConsole() {
  const tokens = [
    ["The", "1.00"],
    ["model", "0.81"],
    ["learns", "0.67"],
    ["to", "0.93"],
    ["transfer", "0.76"]
  ];

  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-emerald-300/20 bg-[#101722] shadow-[0_0_100px_-45px_rgba(110,231,183,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">transfer runtime</span>
        </div>
        <span className="font-mono text-[10px] text-slate-600">openai / 2018</span>
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="relative">
          <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">stage 01 / pre-train</span>
              <span className="font-mono text-[10px] text-emerald-300">BooksCorpus</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tokens.map(([token, opacity], index) => (
                <div key={token} className="min-w-[52px] flex-1 rounded-lg border border-slate-800 bg-[#101722] px-3 py-2">
                  <p className="font-mono text-xs text-slate-300">{token}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-emerald-300"
                      style={{ width: `${Number(opacity) * 100 - index * 3}%`, opacity: Number(opacity) }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] text-slate-600">objective: predict token t from tokens &lt; t</p>
          </div>

          <div className="flex justify-center py-3 text-emerald-300">
            <ArrowDown size={18} />
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.04] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200">shared backbone</span>
              <span className="font-mono text-[10px] text-slate-500">12 x decoder block</span>
            </div>
            <div className="mt-4 grid grid-cols-6 gap-1.5">
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={index}
                  className="flex h-9 items-center justify-center rounded-md border border-emerald-300/15 bg-[#0d1117] font-mono text-[9px] text-emerald-300"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center py-3 text-sky-300">
            <ArrowDown size={18} />
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.04] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-200">stage 02 / fine-tune</p>
              <p className="mt-3 text-sm font-black">formatted input + linear head</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Transfer every Transformer layer.</p>
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-emerald-300/20 bg-[#0d1117] px-5 py-4 text-center">
              <div>
                <p className="font-mono text-2xl font-black text-emerald-300">9 / 12</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-600">task wins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GptOnePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] font-sans text-white selection:bg-emerald-400/30">
      <SiteNav />

      <header className="relative border-b border-slate-800 px-5 pb-16 pt-32 sm:px-8 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(110,231,183,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(110,231,183,0.025)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.22em]">
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/5 px-3 py-1.5 text-emerald-300">paper reconstruction</span>
              <span className="text-slate-600">OpenAI / 2018</span>
            </div>

            <h1 className="mt-7 text-6xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">GPT-1.</h1>
            <p className="mt-3 max-w-3xl text-3xl font-black leading-tight text-emerald-300 sm:text-4xl">
              Predict next. Transfer everything.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
              The 2018 paper that turned a causal language model into a reusable NLP backbone: pre-train once on raw
              books, reshape every downstream task as a token sequence, and fine-tune the entire Transformer.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={links.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#0d1117] transition-colors hover:bg-white"
              >
                Read original PDF <ExternalLink size={14} />
              </a>
              <a
                href="#thesis"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#101722] px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-300 transition-colors hover:border-emerald-300/50 hover:text-white"
              >
                Decode the paper <ArrowDown size={14} />
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-4">
              {[
                ["12", "decoder layers"],
                ["512", "token context"],
                ["40k", "BPE merges"],
                ["9 / 12", "SOTA tasks"]
              ].map(([value, label]) => (
                <div key={label} className="bg-[#101722] p-4">
                  <p className="font-mono text-xl font-black text-emerald-300">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <TransferConsole />
        </div>
      </header>

      <nav className="sticky top-16 z-30 overflow-x-auto border-b border-slate-800 bg-[#0d1117]/95 px-5 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex w-max min-w-full max-w-7xl items-center gap-7 py-4">
          {sections.map(([href, label], index) => (
            <a
              key={href}
              href={`#${href}`}
              className="whitespace-nowrap font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 transition-colors hover:text-emerald-300"
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
            eyebrow="01 / the thesis"
            title="One language model, many discriminative tasks."
            description={
              <>
                Before GPT-1, high-performing NLP systems were usually assembled around a specific supervised task.
                This paper asks whether raw text can first teach a general representation, then let a small amount of
                labeled data specialize it.
              </>
            }
          />

          <div className="grid gap-5 lg:grid-cols-[0.9fr_auto_1.1fr] lg:items-stretch">
            <article className="rounded-3xl border border-rose-300/15 bg-[#101722] p-7">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">task-specific era</p>
              <div className="mt-6 space-y-3">
                {["labeled dataset", "custom architecture", "task objective", "single output"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0d1117] p-4">
                    <span className="font-mono text-[10px] text-rose-300">0{index + 1}</span>
                    <span className="text-sm font-bold text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <div className="hidden items-center justify-center text-emerald-300 lg:flex">
              <ArrowRight size={26} />
            </div>

            <article className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.035] p-7">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">generative pre-training</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5">
                  <Database className="text-emerald-300" size={22} />
                  <p className="mt-4 font-black">Raw books</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">No task labels required.</p>
                </div>
                <ArrowRight className="hidden text-emerald-300 sm:block" size={18} />
                <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5">
                  <Layers3 className="text-sky-300" size={22} />
                  <p className="mt-4 font-black">Shared stack</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">All 12 layers transfer.</p>
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-slate-800 bg-[#0d1117] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {["entailment", "similarity", "classification", "question answering"].map((task) => (
                    <span key={task} className="rounded-full border border-emerald-300/15 bg-emerald-300/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-emerald-200">
                      {task}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="mt-8 rounded-3xl border border-sky-300/20 bg-sky-300/[0.035] p-7 md:p-9">
            <Sparkles className="text-sky-300" size={26} />
            <h3 className="mt-5 text-2xl font-black">The central bet is representation transfer.</h3>
            <p className="mt-4 max-w-5xl text-base leading-8 text-slate-300">
              Next-token prediction is not the end task. It is the scalable source of supervision. The useful artifact is
              the sequence of hidden states learned while solving it, because those states encode information that can
              be reused by discriminative classifiers.
            </p>
          </div>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="02 / architecture"
            title="A decoder-only Transformer with a causal field of view."
            description={
              <>
                GPT-1 keeps the Transformer decoder&apos;s masked self-attention and removes encoder-decoder attention.
                Every position can read its full left context, but never the token it is being trained to predict.
              </>
            }
          />

          <div className="grid gap-8 lg:grid-cols-[1.03fr_0.97fr]">
            <div className="space-y-5">
              <Equation
                label="masked multi-head self-attention"
                formula={formulas.causal}
                note={
                  <>
                    The upper-triangular entries of <span className="font-mono text-emerald-200">M_causal</span> are
                    negative infinity before softmax. Token position <span className="font-mono text-emerald-200">t</span> can
                    therefore attend only to positions at or before <span className="font-mono text-emerald-200">t</span>.
                  </>
                }
              />
              <Equation
                label="embedding, stack, and tied output projection"
                formula={formulas.model}
                tone="sky"
                note={
                  <>
                    Token embeddings <span className="font-mono text-sky-200">W_e</span> and learned positional embeddings
                    <span className="font-mono text-sky-200"> W_p</span> form the input. The same token embedding matrix is
                    reused to project the final hidden state into vocabulary logits.
                  </>
                }
              />
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">causal attention map</p>
                <p className="font-mono text-[10px] text-slate-600">rows query / columns key</p>
              </div>
              <div className="mt-6 grid grid-cols-[auto_repeat(6,minmax(0,1fr))] gap-1.5">
                <div />
                {["t1", "t2", "t3", "t4", "t5", "t6"].map((token) => (
                  <div key={token} className="pb-1 text-center font-mono text-[9px] text-slate-600">{token}</div>
                ))}
                {Array.from({ length: 6 }, (_, row) => (
                  <div key={`row-${row}`} className="contents">
                    <div className="flex items-center pr-2 font-mono text-[9px] text-slate-600">t{row + 1}</div>
                    {Array.from({ length: 6 }, (_, column) => {
                      const visible = column <= row;
                      return (
                        <div
                          key={`${row}-${column}`}
                          className={
                            "aspect-square rounded-md border " +
                            (visible
                              ? "border-emerald-300/20 bg-emerald-300/15"
                              : "border-slate-800 bg-[#0d1117] text-slate-800")
                          }
                        >
                          <div className="flex h-full items-center justify-center">
                            {visible ? <CircleDot className="text-emerald-300" size={11} /> : <X size={9} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-px overflow-hidden rounded-2xl bg-slate-800 sm:grid-cols-2">
                {[
                  ["12", "Transformer blocks"],
                  ["768", "hidden width"],
                  ["12", "attention heads"],
                  ["3,072", "MLP inner width"]
                ].map(([value, label]) => (
                  <div key={label} className="bg-[#0d1117] p-4">
                    <p className="font-mono text-xl font-black text-emerald-300">{value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: LockKeyhole, title: "Causal mask", text: "Prevents target leakage and makes the model a valid left-to-right density estimator." },
              { icon: GitBranch, title: "Residual stack", text: "Each block combines masked multi-head attention, a position-wise MLP, residual paths, and normalization." },
              { icon: Network, title: "No recurrence", text: "All positions in the context are processed in parallel during training, unlike an LSTM language model." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                  <Icon className="text-emerald-300" size={23} />
                  <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pretraining" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="03 / generative pre-training"
            title="Raw text becomes its own supervision signal."
            description={
              <>
                For every token in BooksCorpus, the preceding window is the input and the observed next token is the
                label. Sliding that objective across millions of sequences supplies dense supervision without manual
                annotation.
              </>
            }
          />

          <Equation
            label="maximum-likelihood language-model objective"
            formula={formulas.lm}
            note={
              <>
                <span className="font-mono text-emerald-200">U</span> is the unlabeled token corpus,
                <span className="font-mono text-emerald-200"> k</span> is the context window, and
                <span className="font-mono text-emerald-200"> Theta</span> contains every Transformer parameter. Maximizing
                this sum is equivalent to minimizing causal cross-entropy over the next token.
              </>
            }
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="rounded-3xl border border-emerald-300/20 bg-[#101722] p-7">
              <BookOpen className="text-emerald-300" size={27} />
              <p className="mt-5 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">pre-training corpus</p>
              <h3 className="mt-3 text-3xl font-black">BooksCorpus</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                More than 7,000 unpublished books provide long, contiguous passages. That continuity matters: the model
                can learn dependencies across hundreds of tokens instead of seeing only shuffled sentence fragments.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-800">
                <div className="bg-[#0d1117] p-5">
                  <p className="font-mono text-2xl font-black text-emerald-300">7,000+</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">unique books</p>
                </div>
                <div className="bg-[#0d1117] p-5">
                  <p className="font-mono text-2xl font-black text-sky-300">18.4</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">token perplexity</p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-800 bg-[#101722] p-7">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">one training example, shifted</p>
              <div className="mt-6 overflow-x-auto">
                <div className="min-w-[620px]">
                  <div className="grid grid-cols-7 gap-2">
                    {["The", "model", "learns", "from", "raw", "text", "<eos>"].map((token, index) => (
                      <div key={index} className="rounded-lg border border-slate-800 bg-[#0d1117] p-3 text-center font-mono text-xs text-slate-300">
                        {token}
                      </div>
                    ))}
                  </div>
                  <div className="my-3 flex justify-center text-sky-300"><ArrowDown size={17} /></div>
                  <div className="grid grid-cols-7 gap-2">
                    {["model", "learns", "from", "raw", "text", "<eos>", "<next>"].map((token, index) => (
                      <div key={index} className="rounded-lg border border-sky-300/15 bg-sky-300/5 p-3 text-center font-mono text-xs text-sky-200">
                        {token}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-800 bg-[#0d1117] p-5">
                <Target className="mt-0.5 shrink-0 text-sky-300" size={20} />
                <p className="text-sm leading-7 text-slate-400">
                  One sequence yields a target at every position. A 512-token sample can therefore contribute hundreds
                  of supervised prediction events in a single forward pass.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="finetuning" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="04 / supervised adaptation"
            title="Fine-tune the stack, add almost nothing."
            description={
              <>
                A labeled example is converted into one token sequence. The final token&apos;s top-layer hidden state is
                passed through a learned linear classifier, while every pre-trained Transformer weight remains trainable.
              </>
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Equation
              label="supervised prediction head"
              formula={formulas.supervised}
              tone="sky"
              note="The final hidden state h_l^m summarizes the formatted input. W_y is the only task-specific projection matrix."
            />
            <Equation
              label="joint fine-tuning objective"
              formula={formulas.objective}
              note="The supervised log-likelihood is optimized together with the language-model objective on the labeled input text."
            />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              ["01", "format", "Turn the example into a token sequence."],
              ["02", "restore", "Initialize all 12 layers from pre-training."],
              ["03", "attach", "Add W_y and task delimiter embeddings."],
              ["04", "adapt", "Optimize backbone and head end to end."]
            ].map(([number, title, detail]) => (
              <article key={number} className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <span className="absolute right-4 top-3 font-mono text-4xl font-black text-slate-800">{number}</span>
                <p className="relative font-mono text-xs font-black uppercase tracking-wider text-emerald-300">{title}</p>
                <p className="relative mt-7 text-sm leading-7 text-slate-400">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.035] p-7 md:p-9">
            <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-[#0d1117] text-emerald-300">
                <Workflow size={26} />
              </div>
              <div>
                <h3 className="text-2xl font-black">The interface is text, not architecture surgery.</h3>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
                  The model changes tasks by changing the sequence layout. This keeps the backbone identical across
                  classification, entailment, similarity, and multiple-choice reasoning.
                </p>
              </div>
              <div className="font-mono text-right">
                <p className="text-3xl font-black text-emerald-300">W_y</p>
                <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">new task head</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="formats" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="05 / task-aware input transformations"
            title="Four task families become one sequence interface."
            description={
              <>
                GPT-1&apos;s most practical trick is structural: special start, delimiter, and extract tokens let one
                left-to-right model consume datasets that were not originally written as language-model problems.
              </>
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {taskFormats.map((format, index) => (
              <article key={format.label} className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-black">{format.label}</h3>
                  <span className="font-mono text-xs font-black text-emerald-300">0{index + 1}</span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {format.tokens.map((token, tokenIndex) => (
                    <div key={`${format.label}-${token}-${tokenIndex}`} className="contents">
                      <span
                        className={
                          "rounded-lg border px-3 py-2 font-mono text-[10px] " +
                          (token === "extract"
                            ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                            : token === "delimiter"
                              ? "border-sky-300/25 bg-sky-300/5 text-sky-200"
                              : "border-slate-700 bg-[#0d1117] text-slate-400")
                        }
                      >
                        {token}
                      </span>
                      {tokenIndex < format.tokens.length - 1 && <ChevronRight className="text-slate-700" size={13} />}
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-500">{format.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <FigureCard
              src="/images/resources/gpt-1/architecture-task-formats.png"
              width={1137}
              height={507}
              label="Figure 1 / original paper"
              title="Transformer backbone and task-specific input transformations"
              caption="The left panel shows the 12-layer masked Transformer. The right panels show classification, entailment, similarity, and multiple-choice examples as structured token sequences."
            />
          </div>

          <div className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-300/5 p-6">
            <h3 className="text-lg font-black text-sky-100">Why order matters in a causal model.</h3>
            <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-400">
              The extract token sits last because its hidden state must be able to attend to the entire example. Similarity
              is evaluated in both directions because a causal model otherwise privileges whichever sentence appears
              second. The formatting is doing real representational work.
            </p>
          </div>
        </div>
      </section>

      <section id="training" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="06 / optimization recipe"
            title="A small model by modern standards, trained as a complete system."
            description={
              <>
                The reported recipe couples a 117M-parameter-class decoder with long contiguous samples, tied token
                embeddings, warmup, cosine annealing, and a short supervised adaptation phase.
              </>
            }
          />

          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="border-b border-slate-800 px-6 py-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">implementation sheet</p>
                <h3 className="mt-2 text-xl font-black">Architecture and optimization</h3>
              </div>
              <div className="divide-y divide-slate-800">
                {trainingRows.map(([label, value]) => (
                  <div key={label} className="grid gap-1 px-6 py-4 sm:grid-cols-[0.38fr_0.62fr] sm:gap-5">
                    <p className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-600">{label}</p>
                    <p className="text-sm font-bold text-slate-300">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <article className="rounded-3xl border border-emerald-300/20 bg-[#101722] p-7">
                <Gauge className="text-emerald-300" size={26} />
                <h3 className="mt-5 text-2xl font-black">Pre-training schedule</h3>
                <div className="mt-6">
                  <div className="flex items-end gap-1.5">
                    {Array.from({ length: 24 }, (_, index) => {
                      const height = index < 4 ? 18 + index * 13 : Math.max(10, 61 - (index - 4) * 2.6);
                      return <div key={index} className="flex-1 rounded-t bg-emerald-300/70" style={{ height }} />;
                    })}
                  </div>
                  <div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-600">
                    <span>warmup / 2k</span>
                    <span>cosine to zero / 100 epochs</span>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-sky-300/20 bg-[#101722] p-7">
                <Cpu className="text-sky-300" size={26} />
                <h3 className="mt-5 text-2xl font-black">Fine-tuning is intentionally short.</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Most tasks use only three epochs. The learning rate falls to 6.25 x 10^-5, batch size becomes 32, and
                  warmup occupies 0.2% of updates before linear decay.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-slate-800">
                  {[["3", "epochs"], ["32", "batch"], ["0.5", "lambda"]].map(([value, label]) => (
                    <div key={label} className="bg-[#0d1117] p-4 text-center">
                      <p className="font-mono text-xl font-black text-sky-300">{value}</p>
                      <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">{label}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-slate-800 bg-[#101722] p-7">
                <BrainCircuit className="text-rose-300" size={25} />
                <h3 className="mt-5 text-xl font-black">What is actually transferred?</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Token embeddings, positional embeddings, attention projections, MLP weights, and every normalization
                  parameter. The model is not used as a frozen feature extractor in the main setup.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="07 / benchmark evidence"
            title="Nine wins across twelve transferred tasks."
            description={
              <>
                The paper evaluates natural-language inference, question answering, semantic similarity, and
                classification. The strongest gains appear where long-range context and broad linguistic knowledge matter.
              </>
            }
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["+8.9", "Story Cloze", "largest task gain"],
              ["+5.7", "RACE", "full benchmark"],
              ["+1.5", "MultiNLI-m", "matched accuracy"],
              ["72.8", "GLUE", "vs 68.9 prior"]
            ].map(([value, label, detail]) => (
              <div key={label} className="bg-[#101722] p-6">
                <p className="font-mono text-3xl font-black text-emerald-300">{value}</p>
                <h3 className="mt-3 font-black">{label}</h3>
                <p className="mt-1 text-xs text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="flex flex-col gap-2 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">12-task result ledger</p>
                <h3 className="mt-2 text-xl font-black">Best previously reported result vs GPT-1</h3>
              </div>
              <p className="font-mono text-[10px] text-slate-600">higher is better</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-xs">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">
                  <tr>
                    {['Task', 'Metric', 'Previous', 'GPT-1', 'Delta', 'Verdict'].map((heading) => (
                      <th key={heading} className="px-5 py-4 font-bold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultRows.map((row) => {
                    const win = row[5] === "win";
                    return (
                      <tr key={row[0]} className="border-b border-slate-800 last:border-0">
                        <td className="px-5 py-4 font-black text-white">{row[0]}</td>
                        <td className="px-5 py-4 font-mono text-slate-600">{row[1]}</td>
                        <td className="px-5 py-4 font-mono text-slate-500">{row[2]}</td>
                        <td className="px-5 py-4 font-mono font-black text-slate-200">{row[3]}</td>
                        <td className={"px-5 py-4 font-mono font-black " + (win ? "text-emerald-300" : "text-rose-300")}>{row[4]}</td>
                        <td className="px-5 py-4">
                          <span className={"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider " + (win ? "border-emerald-300/20 bg-emerald-300/5 text-emerald-300" : "border-rose-300/20 bg-rose-300/5 text-rose-300")}>
                            {win ? <Check size={10} /> : <X size={10} />} {row[5]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.92fr]">
            <article className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.035] p-7">
              <ScanSearch className="text-emerald-300" size={26} />
              <h3 className="mt-5 text-2xl font-black">Where transfer helps most</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Story Cloze requires narrative completion, RACE requires document-level reasoning, and CoLA probes
                grammatical acceptability. Gains across these unlike tasks support the claim that the pre-trained stack
                contains reusable linguistic structure rather than one narrow classifier trick.
              </p>
            </article>
            <article className="rounded-3xl border border-rose-300/20 bg-rose-300/[0.035] p-7">
              <TriangleAlert className="text-rose-300" size={26} />
              <h3 className="mt-5 text-2xl font-black">The sweep is not universal.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                GPT-1 trails the previous best on RTE, MRPC, and SST-2. Small datasets are especially unstable during
                full-model fine-tuning, and pre-training does not erase every task-specific advantage.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="transfer" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="08 / what the model learns"
            title="Transfer improves layer by layer, before labels arrive."
            description={
              <>
                The analysis asks two deeper questions: how much of the pre-trained network should move into the target
                task, and whether useful task behavior emerges during language-model training alone.
              </>
            }
          />

          <FigureCard
            src="/images/resources/gpt-1/transfer-zero-shot.png"
            width={1194}
            height={489}
            label="Figure 2 / original paper"
            title="Transferred layers and zero-shot task performance"
            caption="Left: MultiNLI accuracy rises as more pre-trained Transformer layers are transferred, reaching roughly a nine-point gain with the full stack. Right: zero-shot heuristic performance generally improves as language-model pre-training proceeds."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-emerald-300/20 bg-[#101722] p-7">
              <Layers3 className="text-emerald-300" size={26} />
              <h3 className="mt-5 text-2xl font-black">Every transferred layer helps.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                The MultiNLI curve rises steadily from embedding-only transfer to the complete 12-layer model. Useful
                abstractions are distributed through depth, not isolated in the token embedding table or final block.
              </p>
              <div className="mt-6 flex items-end gap-1.5">
                {[14, 20, 26, 33, 39, 46, 51, 57, 63, 69, 75, 82, 88].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t bg-emerald-300/75" style={{ height }} />
                ))}
              </div>
            </article>
            <article className="rounded-3xl border border-sky-300/20 bg-[#101722] p-7">
              <Activity className="text-sky-300" size={26} />
              <h3 className="mt-5 text-2xl font-black">Competence appears during pre-training.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Without supervised updates, simple likelihood-based rules become better at semantic similarity,
                sentiment, linguistic acceptability, and question answering as the LM objective improves.
              </p>
              <div className="mt-6 h-24 overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117] p-4">
                <svg viewBox="0 0 300 60" className="h-full w-full" role="img" aria-label="Rising zero-shot performance curves">
                  <polyline points="0,53 40,48 80,43 120,35 160,30 200,23 250,15 300,8" fill="none" stroke="#7dd3fc" strokeWidth="3" />
                  <polyline points="0,55 40,52 80,46 120,42 160,35 200,33 250,24 300,20" fill="none" stroke="#6ee7b7" strokeWidth="3" opacity="0.8" />
                </svg>
              </div>
            </article>
          </div>

          <div className="mt-8">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">paper&apos;s zero-shot probes</p>
            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {zeroShotTasks.map(([task, method], index) => (
                <article key={task} className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black">{task}</p>
                    <span className="font-mono text-[10px] text-sky-300">0{index + 1}</span>
                  </div>
                  <p className="mt-4 text-xs leading-6 text-slate-500">{method}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6">
            <h3 className="text-lg font-black text-rose-100">These are scoring heuristics, not modern prompting.</h3>
            <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-400">
              GPT-1 is not following natural-language instructions or generating free-form answers here. Researchers
              manually convert each task into a comparison of sequence likelihoods, then measure whether that score
              improves over the course of pre-training.
            </p>
          </div>
        </div>
      </section>

      <section id="ablations" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="09 / causal evidence"
            title="Pre-training is the main effect. Architecture comes second."
            description={
              <>
                The ablations remove the unsupervised initialization, replace the Transformer with an LSTM, and remove
                the auxiliary language-model loss during fine-tuning. The first two interventions cause the decisive drops.
              </>
            }
          />

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">Table 5 / ablation study</p>
              <h3 className="mt-2 text-xl font-black">GLUE development scores and unweighted average</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left text-xs">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">
                  <tr>
                    {['Model', 'Avg', 'CoLA', 'SST-2', 'MRPC', 'STS-B', 'QQP', 'MNLI', 'QNLI', 'RTE'].map((heading) => (
                      <th key={heading} className="px-4 py-4 font-bold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ablationRows.map((row, rowIndex) => (
                    <tr key={row[0]} className={"border-b border-slate-800 last:border-0 " + (rowIndex === 0 ? "bg-emerald-300/[0.04]" : "")}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={
                            "px-4 py-5 " +
                            (cellIndex === 0
                              ? "font-black text-white"
                              : rowIndex === 0
                                ? "font-mono font-black text-emerald-200"
                                : "font-mono text-slate-400")
                          }
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["-14.8", "without pre-training", "59.9 vs 74.7 average. The unlabeled-data stage supplies the dominant gain."],
              ["-5.6", "with an LSTM", "69.1 vs 74.7 average. The Transformer transfers more effectively at similar scale."],
              ["+0.3", "without auxiliary LM", "75.0 vs 74.7 average. The joint loss does not win the unweighted mean."]
            ].map(([value, title, detail], index) => (
              <article key={title} className={"rounded-2xl border bg-[#101722] p-6 " + (index === 2 ? "border-sky-300/20" : "border-slate-800")}>
                <p className={"font-mono text-3xl font-black " + (index === 2 ? "text-sky-300" : "text-emerald-300")}>{value}</p>
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-sky-300/20 bg-sky-300/[0.035] p-7 md:p-9">
            <FileText className="text-sky-300" size={26} />
            <h3 className="mt-5 text-2xl font-black">Read the auxiliary-objective claim precisely.</h3>
            <p className="mt-4 max-w-5xl text-base leading-8 text-slate-300">
              Removing the auxiliary LM objective slightly improves the unweighted average from 74.7 to 75.0, so the
              table does not support a blanket overall gain. The full objective does improve the larger QQP and MNLI
              tasks, and the authors report better convergence and generalization on larger datasets. Both statements can
              be true because the average gives every task equal weight.
            </p>
          </div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-36 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="10 / boundary conditions"
            title="The blueprint is historic, but not yet modern GPT behavior."
            description={
              <>
                GPT-1 establishes generative pre-training plus full-model transfer. It does not yet provide instruction
                following, in-context learning at scale, bidirectional encoding, or long-context generation.
              </>
            }
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-2">
            {[
              { icon: LockKeyhole, title: "Unidirectional context", text: "A token can only read its left context. Some understanding tasks benefit from observing both directions before encoding a token." },
              { icon: Gauge, title: "512-token ceiling", text: "Long books teach broad dependencies, but each optimization sample exposes at most 512 BPE tokens to the model." },
              { icon: Database, title: "Corpus dependence", text: "BooksCorpus is long-form fiction and prose. Its domain composition and biases constrain what the model learns." },
              { icon: MessageSquareCode, title: "Supervised adaptation", text: "Each target task still needs labeled examples, custom sequence formatting, and end-to-end parameter updates." },
              { icon: TriangleAlert, title: "Three benchmark losses", text: "RTE, MRPC, and SST-2 remain below the strongest prior systems in the reported comparison." },
              { icon: BrainCircuit, title: "Heuristic zero-shot", text: "The zero-shot probes rely on manually designed likelihood comparisons, not instruction following or open-ended reasoning." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="bg-[#101722] p-7">
                  <Icon className="text-rose-300" size={24} />
                  <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.035] p-7 md:p-9">
            <Target className="text-emerald-300" size={27} />
            <h3 className="mt-5 text-2xl font-black">What the paper actually proves.</h3>
            <p className="mt-4 max-w-5xl text-base leading-8 text-slate-300">
              A generative Transformer trained on unlabeled text can serve as a general-purpose initialization for many
              discriminative language tasks. Transferring the complete stack is substantially better than training from
              scratch, and task-specific architectures can often be replaced by task-specific sequence layouts.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.75fr]">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">reading checkpoint</p>
              <h3 className="mt-3 text-3xl font-black">You can now reconstruct GPT-1 end to end.</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "derive the causal LM objective",
                  "trace one token through 12 blocks",
                  "format four downstream task families",
                  "reproduce the training recipe",
                  "read all 12 benchmark outcomes",
                  "separate transfer evidence from hype"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#101722] p-4">
                    <ChevronRight className="mt-0.5 shrink-0 text-emerald-300" size={15} />
                    <span className="text-sm leading-6 text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">primary sources</p>
              <div className="mt-4 space-y-3">
                <SourceLink href={links.pdf}>Original OpenAI paper</SourceLink>
                <SourceLink href={links.overview}>OpenAI research overview</SourceLink>
              </div>
              <div className="mt-7 rounded-2xl border border-slate-800 bg-[#101722] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">paper</p>
                <p className="mt-2 text-sm font-black leading-6 text-slate-300">Improving Language Understanding by Generative Pre-Training</p>
                <p className="mt-3 text-xs leading-6 text-slate-600">Alec Radford, Karthik Narasimhan, Tim Salimans, and Ilya Sutskever</p>
              </div>
            </div>
          </div>

          <PaperTimelineNav
            older={{ href: "/resources/attention-is-all-you-need", title: "Attention Is All You Need", year: 2017 }}
            newer={{ href: "/resources/gpt-2", title: "GPT-2", year: 2019 }}
          />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
