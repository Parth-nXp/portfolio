import Image from "next/image";
import katex from "katex";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleUserRound,
  Cpu,
  Database,
  ExternalLink,
  FileCheck2,
  Gauge,
  GitBranch,
  GraduationCap,
  HeartHandshake,
  MessageSquareText,
  Network,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  UsersRound,
  X
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  arxiv: "https://arxiv.org/abs/2203.02155",
  pdf: "https://arxiv.org/pdf/2203.02155",
  proceedings:
    "https://proceedings.neurips.cc/paper_files/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract.html",
  code: "https://github.com/openai/following-instructions-human-feedback",
  doi: "https://doi.org/10.48550/arXiv.2203.02155"
};

export const metadata: Metadata = {
  title: "InstructGPT: A Complete Technical Deep Dive",
  description:
    "A visual, equation-first reconstruction of InstructGPT: demonstrations, reward modeling, PPO, PPO-ptx, human evaluation, alignment tax, safety findings, and limitations."
};

const sections = [
  ["thesis", "The objective gap"],
  ["pipeline", "RLHF pipeline"],
  ["data", "Human data"],
  ["sft", "Supervised policy"],
  ["reward", "Reward model"],
  ["ppo", "PPO + ptx"],
  ["recipe", "Training recipe"],
  ["evaluation", "Evaluation"],
  ["results", "Core results"],
  ["tax", "Alignment tax"],
  ["limits", "Limits"]
];

const figures = {
  pipeline: {
    src: "/images/resources/instructgpt/figure-2-pipeline.png",
    width: 1266,
    height: 741
  },
  preference: {
    src: "/images/resources/instructgpt/figure-1-preference.png",
    width: 1236,
    height: 561
  },
  heldout: {
    src: "/images/resources/instructgpt/figure-3-heldout.png",
    width: 1236,
    height: 990
  },
  behavior: {
    src: "/images/resources/instructgpt/figure-4-behavior.png",
    width: 1260,
    height: 396
  },
  truthfulqa: {
    src: "/images/resources/instructgpt/figure-6-truthfulqa.png",
    width: 1170,
    height: 561
  },
  toxicity: {
    src: "/images/resources/instructgpt/figure-7-toxicity.png",
    width: 1236,
    height: 591
  },
  capabilities: {
    src: "/images/resources/instructgpt/figure-28-capabilities.png",
    width: 1260,
    height: 1395
  },
  alignmentTax: {
    src: "/images/resources/instructgpt/figure-33-34-alignment-tax.png",
    width: 1260,
    height: 1629
  },
  toxicityResponse: {
    src: "/images/resources/instructgpt/figure-39-toxicity-response.png",
    width: 1260,
    height: 1374
  }
};

const dataRows = [
  ["SFT", "train", "labeler", "11,295", "demonstration"],
  ["SFT", "train", "customer", "1,430", "demonstration"],
  ["SFT", "validation", "labeler + customer", "1,653", "demonstration"],
  ["RM", "train", "labeler", "6,623", "ranked outputs"],
  ["RM", "train", "customer", "26,584", "ranked outputs"],
  ["RM", "validation", "labeler + customer", "17,887", "ranked outputs"],
  ["PPO", "train", "customer", "31,144", "prompt only"],
  ["PPO", "validation", "customer", "16,185", "prompt only"],
  ["evaluation", "test", "held-out customers", "3,196", "prompt only"]
];

const useCases = [
  ["Generation", 45.6],
  ["Open QA", 12.4],
  ["Brainstorming", 11.2],
  ["Chat", 8.4],
  ["Rewrite", 6.6],
  ["Summarization", 4.2],
  ["Classification", 3.5],
  ["Other", 3.5],
  ["Closed QA", 2.6],
  ["Extract", 1.9]
] as const;

const trainingRows = [
  ["Backbone", "GPT-3 architecture at 1.3B, 6B, and 175B parameters"],
  ["Context budget", "2,048 tokens: prompts <= 1,024 and responses <= 1,024"],
  ["Precision", "FP16 weights and activations; FP32 master weights"],
  ["Optimizer", "Adam, beta1 = 0.9, beta2 = 0.95"],
  ["SFT", "16 epochs; dropout 0.2; LR 9.65e-6 (1.3B/6B), 5.03e-6 (175B)"],
  ["PPO initializer", "2 SFT epochs + 10% pretraining; peak LR 5e-6 / 1.04e-5 / 2.45e-6"],
  ["Reward model", "One shared 6B RM; one epoch; LR 9e-6; batch 64 prompts"],
  ["Rollouts", "256K episodes over about 31K unique customer prompts"],
  ["PPO batching", "512 prompts; 8 minibatches of 64; one inner epoch"],
  ["PPO controls", "clip 0.2; temperature 1; beta = 0.02; EMA = 0.992"],
  ["PPO-ptx", "8x pretraining examples; gradient coefficient gamma = 27.8"],
  ["Value model", "6B, initialized from RM; no GAE discount"],
  ["Policy LR search", "1.3B/6B: 2.55e-6 to 2.55e-5; 175B: 2.55e-6 or 3.74e-6"],
  ["Value learning rates", "1.3B / 6B: 9e-6; 175B: 5e-6"]
];

const resultCards = [
  {
    value: "85 \u00b1 3%",
    label: "175B InstructGPT over 175B GPT-3",
    note: "Direct human preference on the API prompt distribution.",
    tone: "teal"
  },
  {
    value: "71 \u00b1 4%",
    label: "175B InstructGPT over prompted GPT-3",
    note: "RLHF still beats a carefully engineered few-shot instruction prefix.",
    tone: "rose"
  },
  {
    value: "21% vs 41%",
    label: "closed-domain hallucination rate",
    note: "InstructGPT fabricates unsupported information about half as often.",
    tone: "teal"
  },
  {
    value: "~25% fewer",
    label: "toxic outputs when told to be respectful",
    note: "The improvement is conditional and disappears without that instruction.",
    tone: "rose"
  }
] as const;

const formulas = {
  pretrain: String.raw`\max_\theta\;\mathbb{E}_{x\sim D_{\mathrm{web}}}\!\left[\sum_t \log p_\theta(x_t\mid x_{<t})\right]`,
  intent: String.raw`\max_\phi\;\mathbb{E}_{x\sim D_{\mathrm{prompt}},\;y\sim\pi_\phi(\cdot\mid x)}\!\left[U_{\mathrm{human}}(x,y)\right]`,
  sft: String.raw`\mathcal{L}_{\mathrm{SFT}}(\phi)=-\mathbb{E}_{(x,y^*)\sim D_{\mathrm{demo}}}\!\left[\sum_t\log\pi_\phi(y_t^*\mid x,y_{<t}^*)\right]`,
  preference: String.raw`P_\theta(y_w\succ y_l\mid x)=\sigma\!\left(r_\theta(x,y_w)-r_\theta(x,y_l)\right)`,
  reward: String.raw`\mathcal{L}_{\mathrm{RM}}(\theta)=-\frac{1}{\binom{K}{2}}\,\mathbb{E}_{(x,y_w,y_l)\sim D}\!\left[\log\sigma\!\left(r_\theta(x,y_w)-r_\theta(x,y_l)\right)\right]`,
  ppo: String.raw`\mathbb{E}_{(x,y)\sim D_{\pi_\phi}}\!\left[r_\theta(x,y)-\beta\log\frac{\pi_\phi(y\mid x)}{\pi_{\mathrm{SFT}}(y\mid x)}\right]`,
  ppoptx: String.raw`\max_\phi\;\underbrace{\mathbb{E}_{D_{\pi_\phi}}\!\left[r_\theta(x,y)-\beta\log\frac{\pi_\phi(y\mid x)}{\pi_{\mathrm{SFT}}(y\mid x)}\right]}_{\text{human-preference objective}}+\gamma\underbrace{\mathbb{E}_{x\sim D_{\mathrm{pretrain}}}\!\left[\log\pi_\phi(x)\right]}_{\text{capability-preservation objective}}`,
  calibration: String.raw`\mathbb{E}_{(x,y^*)\sim D_{\mathrm{demo}}}\!\left[r_\theta(x,y^*)\right]=0`
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
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-teal-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({
  label,
  formula,
  note,
  tone = "teal"
}: {
  label: string;
  formula: string;
  note?: ReactNode;
  tone?: "teal" | "rose" | "sky";
}) {
  const tones = {
    teal: "border-teal-300/20 bg-teal-300/5 text-teal-50",
    rose: "border-rose-300/20 bg-rose-300/5 text-rose-50",
    sky: "border-sky-300/20 bg-sky-300/5 text-sky-50"
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
      <div className="flex min-h-52 items-center justify-center bg-white p-3 sm:p-5">
        <Image
          src={figure.src}
          alt={title}
          width={figure.width}
          height={figure.height}
          className={"h-auto max-h-[920px] w-full object-contain " + imageClassName}
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
      className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-teal-300 transition-colors hover:text-white"
    >
      {children} <ExternalLink size={13} />
    </a>
  );
}

function AlignmentConsole() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-teal-300/20 bg-[#101722] shadow-[0_0_100px_-48px_rgba(45,212,191,0.9)]">
      <div className="absolute right-0 top-0 h-40 w-40 bg-rose-400/10 blur-3xl" />
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">alignment runtime</span>
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="rounded-xl border border-slate-800 bg-[#0b1017] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">customer prompt</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-200">Explain why the moon appears larger near the horizon.</p>
        </div>

        <div className="my-3 flex justify-center text-slate-700"><ArrowDown size={18} /></div>

        <div className="grid grid-cols-2 gap-3">
          {[
            ["A", "clear, useful", "border-teal-300/35 text-teal-200"],
            ["B", "confident error", "border-rose-300/25 text-rose-200"],
            ["C", "correct, vague", "border-sky-300/25 text-sky-200"],
            ["D", "off-task", "border-slate-700 text-slate-500"]
          ].map(([id, note, tone]) => (
            <div key={id} className={"rounded-xl border bg-[#0b1017] p-3 " + tone}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black">{id}</span>
                {id === "A" ? <Check size={13} /> : <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">{note}</p>
            </div>
          ))}
        </div>

        <div className="my-3 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
          <span className="h-px w-8 bg-slate-800" /> human rank <span className="h-px w-8 bg-slate-800" />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-slate-800 bg-[#0b1017] p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">preference</p>
            <p className="mt-2 font-mono text-sm font-black text-teal-300">A &gt; C &gt; B &gt; D</p>
          </div>
          <ArrowRight className="text-slate-700" size={17} />
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">policy update</p>
            <p className="mt-2 font-mono text-sm font-black text-rose-300">PPO + KL</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-teal-300/15 bg-teal-300/5 px-4 py-3">
          <Activity className="text-teal-300" size={16} />
          <div className="min-w-0 flex-1">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
              <span>intent fit</span><span className="text-teal-300">optimized</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[86%] bg-gradient-to-r from-teal-300 to-rose-300" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstructGPTPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] font-sans text-white selection:bg-teal-400/30">
      <SiteNav />

      <header className="relative border-b border-slate-800 px-5 pb-20 pt-28 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.028)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-teal-300/25 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.82fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.22em]">
              <span className="rounded-full border border-teal-300/25 bg-teal-300/5 px-3 py-1.5 text-teal-300">NeurIPS 2022</span>
              <span className="rounded-full border border-slate-700 px-3 py-1.5 text-slate-500">RLHF</span>
              <span className="rounded-full border border-slate-700 px-3 py-1.5 text-slate-500">GPT-3 -&gt; aligned policy</span>
            </div>

            <p className="mt-8 font-mono text-sm font-black uppercase tracking-[0.3em] text-teal-300">InstructGPT</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
              Training language models to follow instructions
              <span className="block bg-gradient-to-r from-teal-300 via-sky-300 to-rose-300 bg-clip-text text-transparent">with human feedback.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
              A complete reconstruction of the system that turned demonstrations and preference rankings into an instruction-following policy, then measured where alignment helped, where it taxed capability, and where it failed.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={links.arxiv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-teal-300 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-950 transition-colors hover:bg-white">
                <BookOpen size={15} /> Read paper <ExternalLink size={13} />
              </a>
              <a href="#pipeline" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-300 transition-colors hover:border-rose-300/50 hover:text-white">
                Trace the system <ArrowDown size={14} />
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-4">
              {[
                ["3", "training stages"],
                ["40", "contract labelers"],
                ["1.3B", "smallest policy"],
                ["175B", "largest policy"]
              ].map(([value, label]) => (
                <div key={label} className="bg-[#101722] px-4 py-5">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <AlignmentConsole />
        </div>
      </header>

      <nav aria-label="On this page" className="sticky top-20 z-30 border-b border-slate-800 bg-[#0d1117]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map(([href, label], index) => (
            <a key={href} href={`#${href}`} className="shrink-0 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 transition-colors hover:bg-teal-300/5 hover:text-teal-300">
              <span className="mr-2 text-slate-800">{String(index + 1).padStart(2, "0")}</span>{label}
            </a>
          ))}
        </div>
      </nav>

      <section id="thesis" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="01 / the objective gap"
            title="Prediction is not the same objective as intent."
            description="GPT-3 learned to continue internet text. Users wanted a system that inferred a task, followed constraints, stayed truthful, and avoided harm. InstructGPT does not replace pre-training; it adds a human-defined optimization layer on top of it."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Equation label="what pre-training optimizes" formula={formulas.pretrain} note="Maximize the likelihood of the next token under a broad web distribution. This builds capability, but the objective contains no direct representation of a particular user's intent." tone="sky" />
            <Equation label="what alignment wants" formula={formulas.intent} note="The utility is not directly available. The paper approximates it with demonstrations first, then a reward model learned from pairwise human preferences." tone="rose" />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: HeartHandshake, title: "Helpful", body: "Infer the requested task, satisfy explicit constraints, and produce a useful answer." },
              { icon: FileCheck2, title: "Honest", body: "Avoid fabricating information or misleading the user; measured only through partial truthfulness proxies." },
              { icon: ShieldCheck, title: "Harmless", body: "Avoid behavior that could cause harm, while recognizing that harm depends on deployment context." }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <Icon className="text-teal-300" size={22} />
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">critical scope</p>
            <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-300">
              The paper aligns models to the preferences of a specific group of labelers and researchers on a specific API prompt distribution. It does not claim to recover universal human values, and it explicitly treats that distinction as a central limitation.
            </p>
          </div>
        </div>
      </section>

      <section id="pipeline" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="02 / system map"
            title="One policy, trained through three different signals."
            description="The method converts increasingly cheap forms of human supervision into a scalar learning signal: expensive demonstrations teach the initial behavior, rankings teach a reward model, and that model scores many policy rollouts without a human in every loop."
          />

          <FigureCard image="pipeline" title="The complete InstructGPT training pipeline" caption="The paper's Figure 2. Blue arrows mark where collected data trains a model: demonstrations train SFT, rankings train the reward model, and reward scores train the policy with PPO." />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              { n: "01", icon: GraduationCap, title: "Demonstrate", data: "~13K prompts", model: "GPT-3 -> SFT", body: "A labeler writes the desired response. Token-level supervised learning gives the policy a strong behavioral prior." },
              { n: "02", icon: Scale, title: "Compare", data: "~33K prompts", model: "SFT -> 6B RM", body: "A labeler ranks 4-9 sampled outputs. Every ordered pair teaches a scalar reward model which answer should score higher." },
              { n: "03", icon: RefreshCw, title: "Optimize", data: "~31K prompts", model: "SFT -> PPO-ptx", body: "The policy answers a prompt, the RM scores the full answer, and PPO updates the policy while KL and pretraining terms restrain drift." }
            ].map(({ n, icon: Icon, title, data, model, body }) => (
              <div key={n} className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <span className="absolute right-5 top-4 font-mono text-4xl font-black text-slate-800">{n}</span>
                <Icon className="text-teal-300" size={22} />
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-teal-300/15 bg-teal-300/5 px-3 py-1 font-mono text-[10px] text-teal-200">{data}</span>
                  <span className="rounded-full border border-rose-300/15 bg-rose-300/5 px-3 py-1 font-mono text-[10px] text-rose-200">{model}</span>
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-400">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-[#101722] p-6 font-mono text-xs font-black uppercase tracking-[0.17em] text-slate-500 sm:flex-row">
            <span className="text-sky-300">human behavior</span><ArrowRight size={15} /><span>human preferences</span><ArrowRight size={15} /><span className="text-rose-300">learned reward</span><ArrowRight size={15} /><span className="text-teal-300">policy gradient</span>
          </div>
        </div>
      </section>

      <section id="data" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="03 / human data engine"
            title="Three datasets, three supervision contracts."
            description="Prompts came from labelers and customers using early InstructGPT models in the API Playground. Splits were made by user ID, prompts were deduplicated, training prompts were filtered for personal information, and each user contributed at most 200 prompts."
          />

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101722]">
            <div className="overflow-x-auto">
              <table className="min-w-[820px] w-full text-left">
                <thead className="border-b border-slate-800 bg-[#0b1017] font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  <tr><th className="px-5 py-4">dataset</th><th className="px-5 py-4">split</th><th className="px-5 py-4">source</th><th className="px-5 py-4 text-right">prompts</th><th className="px-5 py-4">human signal</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {dataRows.map((row) => (
                    <tr key={row.join("-")} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-4 font-mono font-black text-teal-300">{row[0]}</td>
                      <td className="px-5 py-4 text-slate-400">{row[1]}</td>
                      <td className="px-5 py-4 text-slate-400">{row[2]}</td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-white">{row[3]}</td>
                      <td className="px-5 py-4 text-slate-500">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">RM prompt distribution</p><h3 className="mt-2 text-2xl font-black">Real usage was mostly generative.</h3></div>
                <BarChart3 className="shrink-0 text-slate-700" size={24} />
              </div>
              <div className="mt-7 space-y-4">
                {useCases.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3">
                    <span className="text-xs text-slate-400">{label}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-sky-300" style={{ width: `${Math.max(value * 2, 4)}%` }} /></div>
                    <span className="text-right font-mono text-[10px] text-slate-500">{value}%</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-6 text-slate-600">Generation plus brainstorming accounts for 56.8% of labeled RM prompts; classification plus open and closed QA accounts for 18.5%.</p>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6">
                <UsersRound className="text-rose-300" size={24} />
                <p className="mt-5 text-4xl font-black">~40</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-rose-200">screened contractors</p>
                <p className="mt-5 text-sm leading-7 text-slate-400">A small, trained group selected through screening, onboarded with detailed instructions, and supported through a shared researcher chat.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><p className="text-2xl font-black text-teal-300">72.6 &plusmn; 1.5%</p><p className="mt-2 text-xs leading-5 text-slate-500">agreement among training labelers</p></div>
                <div className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><p className="text-2xl font-black text-sky-300">77.3 &plusmn; 1.3%</p><p className="mt-2 text-xs leading-5 text-slate-500">agreement among held-out labelers</p></div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">language coverage</p>
                <p className="mt-3 text-3xl font-black">&gt;96% English</p>
                <p className="mt-2 text-xs leading-6 text-slate-500">Non-English and code behavior is therefore out-of-distribution generalization, not broad supervised coverage.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sft" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="04 / supervised policy" title="Behavior cloning creates the policy prior." description="For each prompt, a labeler writes the response they want the model to produce. The GPT-3 policy is then fine-tuned with ordinary teacher-forced language modeling on those demonstrations." />

          <Equation label="supervised fine-tuning objective" formula={formulas.sft} note={<><span className="font-mono text-teal-300">x</span> is a prompt and <span className="font-mono text-rose-300">y*</span> is the labeler demonstration. Every demonstration token contributes a cross-entropy term.</>} />

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">data path</p>
              <div className="mt-6 space-y-3">
                {[
                  [MessageSquareText, "Prompt", "Summarize this report in three bullets."],
                  [CircleUserRound, "Labeler", "Writes a truthful, concise target response."],
                  [Bot, "SFT policy", "Learns the response token by token."]
                ].map(([icon, title, body], index) => {
                  const Icon = icon as typeof MessageSquareText;
                  return <div key={String(title)}><div className="flex items-start gap-4 rounded-xl border border-slate-800 bg-[#0b1017] p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-teal-300/20 bg-teal-300/5 text-teal-300"><Icon size={16} /></div><div><p className="text-sm font-black">{String(title)}</p><p className="mt-1 text-xs leading-5 text-slate-500">{String(body)}</p></div></div>{index < 2 && <div className="ml-8 h-3 w-px bg-slate-800" />}</div>;
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
              <div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">important distinction</p><h3 className="mt-2 text-2xl font-black">The paper uses two SFT recipes.</h3></div><GitBranch className="shrink-0 text-slate-700" size={25} /></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-sky-300/20 bg-sky-300/5 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">reported SFT baseline</p><p className="mt-3 text-3xl font-black">16 epochs</p><p className="mt-3 text-xs leading-6 text-slate-400">Cosine LR decay and residual dropout 0.2. Checkpoint selection uses validation reward-model score rather than validation loss.</p></div>
                <div className="rounded-xl border border-rose-300/20 bg-rose-300/5 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose-300">PPO initializer</p><p className="mt-3 text-3xl font-black">2 epochs + 10%</p><p className="mt-3 text-xs leading-6 text-slate-400">Two demonstration epochs with a 10% pretraining-data mix. This separate checkpoint initializes the RL policies.</p></div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-500">The 16-epoch SFT model overfits demonstration validation loss after one epoch, yet later checkpoints improve reward-model score and human preference. The evaluation target, not language-model loss alone, determines selection.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="reward" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="05 / reward modeling" title="Turn rankings into a differentiable preference function." description="The reward model reads a prompt and one complete response, then emits a scalar. It is trained so that a response preferred by a labeler scores above a rejected response." />

          <div className="grid gap-5 lg:grid-cols-2">
            <Equation label="Bradley-Terry preference probability" formula={formulas.preference} note="Only the reward difference matters. A one-unit score gap implies odds of e to 1 for the preferred completion." tone="sky" />
            <Equation label="paper equation 1 / RM loss" formula={formulas.reward} note="For each prompt, all pairwise comparisons from one K-way ranking are kept together as a single batch element. This prevents repeated completions from becoming correlated pseudo-examples across updates." tone="rose" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">one ranking task</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["A", "1", "+2.7", "border-teal-300/35"],
                  ["C", "2", "+1.3", "border-sky-300/25"],
                  ["B", "3", "-0.4", "border-amber-300/25"],
                  ["D", "4", "-2.1", "border-rose-300/25"]
                ].map(([id, rank, score, tone]) => (
                  <div key={id} className={"rounded-xl border bg-[#0b1017] p-4 " + tone}><div className="flex items-center justify-between"><span className="font-mono text-lg font-black">{id}</span><span className="font-mono text-[9px] text-slate-600">rank {rank}</span></div><p className="mt-6 font-mono text-xl font-black text-teal-300">{score}</p><p className="mt-1 text-[10px] text-slate-600">learned reward</p></div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-slate-800 bg-[#0b1017] p-4 text-center font-mono text-xs text-slate-400">
                A &gt; C &gt; B &gt; D <span className="mx-2 text-slate-700">-&gt;</span> <span className="text-rose-300">6 pairwise constraints</span>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-500">With K between 4 and 9, one ranking produces between 6 and 36 pairs. A batch of 64 prompts can therefore contain at most 64 x 36 = 2,304 comparisons while requiring only K reward-model forward passes per prompt.</p>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-[#101722] p-6"><BrainCircuit className="text-teal-300" size={23} /><p className="mt-5 text-4xl font-black">6B</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">one RM for every policy size</p><p className="mt-4 text-sm leading-7 text-slate-400">The GPT-3 unembedding is replaced by a scalar projection. The same 6B RM scores 1.3B, 6B, and 175B policies; 175B RMs were less stable and far more expensive.</p></div>
              <Equation label="reward calibration before RL" formula={formulas.calibration} note="Pairwise loss is invariant to adding a constant to all rewards. A learned bias fixes the mean reward of labeler demonstrations at zero before PPO." />
              <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-300">generalization check</p><p className="mt-3 text-2xl font-black">72.4% -&gt; 69.6%</p><p className="mt-2 text-xs leading-6 text-slate-400">RM preference accuracy moves only modestly from training-labeler groups to held-out labeler groups in five-fold cross-validation.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="ppo" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="06 / policy optimization" title="Optimize reward without letting the policy drift freely." description="Each prompt-response interaction is a one-step contextual bandit episode. The reward model scores the response, PPO updates the policy, and a token-level KL penalty anchors the policy to its supervised initializer." />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [MessageSquareText, "Prompt", "sample x from the PPO dataset"],
              [Bot, "Rollout", "sample y from the current policy"],
              [Gauge, "Score", "compute scalar RM reward"],
              [RefreshCw, "Update", "PPO step with KL restraint"]
            ].map(([icon, title, body], index) => {
              const Icon = icon as typeof MessageSquareText;
              return <div key={String(title)} className="relative rounded-2xl border border-slate-800 bg-[#101722] p-5"><span className="absolute right-4 top-4 font-mono text-2xl font-black text-slate-800">0{index + 1}</span><Icon className="text-teal-300" size={20} /><h3 className="mt-5 font-black">{String(title)}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{String(body)}</p></div>;
            })}
          </div>

          <div className="mt-8 space-y-5">
            <Equation label="PPO reward with reference-policy KL" formula={formulas.ppo} note={<><span className="font-mono text-teal-300">r_theta</span> rewards human-preferred behavior. The log ratio penalizes tokens the policy makes much more likely than the SFT reference. The paper uses <span className="font-mono text-rose-300">beta = 0.02</span>.</>} />
            <Equation label="paper equation 2 / PPO-ptx objective" formula={formulas.ppoptx} note={<><span className="font-mono text-rose-300">gamma = 0</span> gives PPO. <span className="font-mono text-teal-300">gamma = 27.8</span> gives PPO-ptx, the model called InstructGPT by default in the paper. The pretraining term actively rehearses broad language capabilities while the policy moves toward preference reward.</>} tone="rose" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: Target, title: "Reward", key: "r_theta(x, y)", body: "What the 6B reward model predicts the labelers would prefer." },
              { icon: Network, title: "KL anchor", key: "beta = 0.02", body: "How strongly the policy is penalized for departing from the SFT initializer." },
              { icon: Database, title: "Pretraining rehearsal", key: "gamma = 27.8", body: "How strongly PPO-ptx preserves likelihood on the original GPT-3 data distribution." }
            ].map(({ icon: Icon, title, key, body }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6"><Icon className="text-rose-300" size={21} /><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-2 font-mono text-sm font-black text-teal-300">{key}</p><p className="mt-4 text-sm leading-7 text-slate-400">{body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section id="recipe" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="07 / implementation ledger" title="The full training recipe, not just the diagram." description="The paper fixes the reward model and value-function size across policy scales, which makes the comparison between 1.3B, 6B, and 175B policies easier to interpret." />

          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 md:grid-cols-2">
            {trainingRows.map(([label, value]) => (
              <div key={label} className="grid min-h-24 grid-cols-[8.5rem_1fr] gap-4 bg-[#101722] p-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-teal-300">{label}</p>
                <p className="text-sm leading-6 text-slate-400">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["4.9 PF-days", "175B SFT training", "~0.13% of GPT-3 pretraining compute"],
              ["60 PF-days", "175B PPO-ptx training", "~1.65% of GPT-3 pretraining compute"],
              ["3,640 PF-days", "GPT-3 pretraining", "the capability foundation"]
            ].map(([value, label, note], index) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-[#101722] p-6"><Cpu className={index === 2 ? "text-rose-300" : "text-teal-300"} size={21} /><p className="mt-5 text-3xl font-black">{value}</p><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-4 text-xs leading-6 text-slate-600">{note}</p></div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-500">The compute comparison is the paper&apos;s argument for leverage: at this scale, making an existing model substantially more useful through alignment cost far less than pretraining another frontier model.</p>
        </div>
      </section>

      <section id="evaluation" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="08 / evaluation protocol" title="Measure intent on real prompts, then probe safety and capability." description="The primary outcome is human preference on prompts from held-out customers. Public benchmarks are secondary probes for truthfulness, toxicity, bias, and capability retention; the paper explicitly argues that they do not represent most API usage." />

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: UsersRound, title: "API preference", body: "Training and held-out labelers rank outputs on InstructGPT and GPT-3 prompt distributions. The 175B SFT model is the shared reference." },
              { icon: ShieldCheck, title: "Behavior proxies", body: "TruthfulQA, RealToxicityPrompts, Winogender, CrowS-Pairs, hallucination labels, constraint following, and assistant appropriateness." },
              { icon: BarChart3, title: "Capability checks", body: "DROP, SQuAD v2, HellaSwag, QuAC, RTE, SST, WSC, French-to-English translation, CNN/DM, and TL;DR." }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6"><Icon className="text-teal-300" size={22} /><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{body}</p></div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <FigureCard image="heldout" title="Preference gains survive held-out labelers and prompt distributions" caption="Figure 3. The ordering GPT-3 -> prompted GPT-3 -> SFT -> PPO/PPO-ptx remains visible across workers and distributions, reducing the likelihood that the result is only a training-labeler artifact." />
            <div className="space-y-6">
              <FigureCard image="behavior" title="What changes behaviorally" caption="Figure 4. PPO models attempt the requested task more often, follow explicit constraints more often, hallucinate less on closed-domain tasks, and use language judged more appropriate for a customer assistant." />
              <div className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">measurement caveat</p>
                <p className="mt-4 text-sm leading-7 text-slate-400">Labelers see the prompt but not the customer&apos;s full context. Their judgment of user intent can therefore diverge from what the customer actually meant. The evaluation measures agreement with the study&apos;s reference group, not direct satisfaction from every original user.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="09 / empirical result" title="Alignment quality beats a 100x scale increase." description="The paper's headline is not that scale stops mattering. It is that, at a fixed interface and prompt distribution, changing the training objective can matter more to users than increasing parameter count from 1.3B to 175B." />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resultCards.map((result) => (
              <div key={result.label} className={`rounded-2xl border p-5 ${result.tone === "teal" ? "border-teal-300/20 bg-teal-300/5" : "border-rose-300/20 bg-rose-300/5"}`}>
                <p className={`text-3xl font-black ${result.tone === "teal" ? "text-teal-300" : "text-rose-300"}`}>{result.value}</p>
                <p className="mt-3 text-sm font-black leading-6 text-white">{result.label}</p>
                <p className="mt-3 text-xs leading-6 text-slate-500">{result.note}</p>
              </div>
            ))}
          </div>

          <FigureCard image="preference" title="Human preference versus the 175B supervised baseline" caption="Figure 1. Every PPO and PPO-ptx point sits above the 0.5 indifference line. Crucially, 1.3B PPO-ptx is preferred over 175B GPT-3 even though it has over 100 times fewer parameters." className="mt-8" />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <FigureCard image="truthfulqa" title="Truthfulness improves, especially under PPO" caption="Figure 6. Gray bars measure truthfulness; colored bars require both truthfulness and informativeness. A prompt that permits 'I have no comment' changes the tradeoff: PPO models become more truthful but sometimes less informative." />
            <FigureCard image="toxicity" title="Toxicity gains depend on the instruction" caption="Figure 7. On 1,729 labeled prompts, InstructGPT is less toxic than GPT-3 when explicitly asked to be respectful, but similar without that prompt. The condition is part of the result, not a footnote." />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["78 \u00b1 4%", "preferred over FLAN 175B"],
              ["79 \u00b1 4%", "preferred over T0 175B"],
              ["no significant gain", "on Winogender or CrowS-Pairs bias"]
            ].map(([value, label]) => <div key={label} className="rounded-2xl border border-slate-800 bg-[#101722] p-6"><p className="text-2xl font-black text-teal-300">{value}</p><p className="mt-3 text-sm leading-6 text-slate-500">{label}</p></div>)}
          </div>
        </div>
      </section>

      <section id="tax" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="10 / alignment tax" title="Preference optimization can erase capabilities." description="Plain PPO improves reward and human preference but regresses on several public NLP tasks. PPO-ptx adds pretraining gradients so the policy rehearses broad capabilities while learning the new behavioral objective." />

          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <FigureCard image="capabilities" title="Zero-shot capability after each training stage" caption="Figure 28. Plain PPO often underperforms GPT-3 on DROP, SQuAD v2, QuAC, and translation. PPO-ptx recovers much of the gap and surpasses GPT-3 on HellaSwag, but does not remove every regression." />
            <div className="space-y-6">
              <FigureCard image="alignmentTax" title="Why pretraining mix is not equivalent to a larger KL penalty" caption="Figures 33 and 34. Increasing the pretraining coefficient can recover DROP and SQuAD while retaining useful validation reward. Increasing KL alone never fully recovers those tasks and eventually collapses reward." />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-teal-300/20 bg-teal-300/5 p-5"><Check className="text-teal-300" size={20} /><h3 className="mt-4 font-black">PPO-ptx preserves</h3><p className="mt-2 text-xs leading-6 text-slate-400">Direct gradients on the original language-model distribution, including capabilities not exercised by the API prompts.</p></div>
                <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-5"><X className="text-rose-300" size={20} /><h3 className="mt-4 font-black">KL only restrains</h3><p className="mt-2 text-xs leading-6 text-slate-400">Distance from a reference policy. Staying nearby is not the same as practicing the original prediction task.</p></div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-300/5 p-6">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">engineering interpretation</p>
            <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-300">Multi-objective fine-tuning needs an explicit preservation signal. A regularizer around parameters or outputs can slow forgetting, but representative rehearsal data protects capabilities at the points where they are actually expressed.</p>
          </div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-36 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="11 / failure surface" title="Instruction following is not the same as safety." description="The models are more steerable, but steerability works in both directions. When prompted to be biased or toxic, InstructGPT can comply more effectively than GPT-3. The paper's safest reading keeps this failure mode central." />

          <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
            <FigureCard image="toxicityResponse" title="A respectful model can still be steered toward toxicity" caption="Figure 39. Output toxicity tracks prompt toxicity. Under a respectful instruction PPO-ptx is generally less toxic; under a biased instruction it can produce highly toxic text even from low-toxicity prompts." />
            <div className="grid content-start gap-4 sm:grid-cols-2">
              {[
                { icon: TriangleAlert, title: "Simple mistakes", body: "The policy accepts false premises, over-hedges obvious answers, and degrades as explicit constraints accumulate." },
                { icon: Scale, title: "Preference provenance", body: "Behavior reflects roughly 40 contractors, researcher-written instructions, API customer prompts, and product-interface choices." },
                { icon: ShieldCheck, title: "No robust refusal layer", body: "This iteration usually follows harmful requests instead of refusing them; harmlessness does not dominate user instruction." },
                { icon: Sparkles, title: "Reward-model proxy", body: "Optimizing a learned judge can exploit errors outside the comparison-data distribution. PPO also remains sensitive to training duration and learning rate." },
                { icon: UsersRound, title: "Representation", body: "Labelers were mostly English-speaking and based in the US or Southeast Asia. Their preferences cannot represent all affected groups." },
                { icon: Database, title: "Pretraining tradeoff", body: "Mixing original web data reduces capability loss but can reintroduce undesirable behavior present in that data." }
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><Icon className="text-rose-300" size={20} /><h3 className="mt-4 font-black">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{body}</p></div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-teal-300/20 bg-teal-300/5 p-6">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">what the paper establishes</p>
              <div className="mt-5 space-y-3">
                {[
                  "Human feedback can substantially improve instruction following across diverse user tasks.",
                  "A small aligned model can be preferred to a base model more than 100 times larger.",
                  "Preference gains generalize to held-out labelers from the same sourcing process.",
                  "Pretraining rehearsal can reduce, but not eliminate, the alignment tax."
                ].map((item) => <div key={item} className="flex gap-3"><Check className="mt-1 shrink-0 text-teal-300" size={15} /><p className="text-sm leading-7 text-slate-300">{item}</p></div>)}
              </div>
            </div>
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">what it does not establish</p>
              <div className="mt-5 space-y-3">
                {[
                  "That the learned reward represents a universal or democratically legitimate value function.",
                  "That stronger instruction following guarantees truthfulness, harmlessness, or robust refusal.",
                  "That bias is solved; the tested bias benchmarks show no significant improvement.",
                  "That public-task regressions are fully removed or that the method is stable out of distribution."
                ].map((item) => <div key={item} className="flex gap-3"><X className="mt-1 shrink-0 text-rose-300" size={15} /><p className="text-sm leading-7 text-slate-300">{item}</p></div>)}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">reading checkpoint</p>
              <h3 className="mt-3 text-3xl font-black">You can now reconstruct InstructGPT end to end.</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "separate SFT, RM, and PPO data contracts",
                  "derive the pairwise RM objective",
                  "explain the KL and pretraining terms",
                  "reproduce the main training ledger",
                  "read preference and safety results conditionally",
                  "distinguish alignment from universal values"
                ].map((item) => <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#101722] p-4"><ChevronRight className="mt-0.5 shrink-0 text-teal-300" size={15} /><span className="text-sm leading-6 text-slate-400">{item}</span></div>)}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">primary sources</p>
              <div className="mt-4 space-y-3">
                <SourceLink href={links.arxiv}>Official arXiv abstract</SourceLink>
                <SourceLink href={links.pdf}>Original paper PDF</SourceLink>
                <SourceLink href={links.proceedings}>NeurIPS proceedings</SourceLink>
                <SourceLink href={links.code}>Released model samples</SourceLink>
                <SourceLink href={links.doi}>arXiv DOI record</SourceLink>
              </div>
              <div className="mt-7 rounded-2xl border border-slate-800 bg-[#101722] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">paper</p>
                <p className="mt-2 text-sm font-black leading-6 text-slate-300">Training language models to follow instructions with human feedback</p>
                <p className="mt-3 text-xs leading-6 text-slate-600">Long Ouyang, Jeff Wu, Xu Jiang, Diogo Almeida, Carroll Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, and collaborators.</p>
              </div>
            </div>
          </div>

          <PaperTimelineNav older={{ href: "/resources/vision-transformer", title: "Vision Transformer", year: 2021 }} newer={{ href: "/resources/gpt-4", title: "GPT-4", year: 2023 }} />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
