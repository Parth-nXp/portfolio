import Image from "next/image";
import katex from "katex";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleGauge,
  Database,
  Eye,
  ExternalLink,
  FileQuestion,
  Gauge,
  Globe2,
  GraduationCap,
  ImageIcon,
  Languages,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  RefreshCw,
  Scale,
  ScanSearch,
  ShieldCheck,
  Target,
  TriangleAlert,
  UsersRound,
  X,
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  arxiv: "https://arxiv.org/abs/2303.08774",
  html: "https://arxiv.org/html/2303.08774v6",
  pdf: "https://arxiv.org/pdf/2303.08774v6",
  source: "https://arxiv.org/src/2303.08774v6",
  doi: "https://doi.org/10.48550/arXiv.2303.08774"
};

export const metadata: Metadata = {
  title: "GPT-4 Technical Report: A Complete Deep Dive",
  description:
    "A visual reconstruction of the GPT-4 Technical Report: multimodal inputs, predictable scaling, exams, benchmarks, multilingual transfer, visual reasoning, RLHF, RBRMs, factuality, calibration, safety, and limitations."
};

const sections = [
  ["scope", "Evidence boundary"],
  ["interface", "Model interface"],
  ["scaling", "Predictable scaling"],
  ["exams", "Human exams"],
  ["benchmarks", "ML benchmarks"],
  ["languages", "Multilingual"],
  ["vision", "Visual reasoning"],
  ["posttraining", "Post-training"],
  ["reliability", "Reliability"],
  ["safety", "Safety system"],
  ["limits", "Limits"]
];

const figures = {
  lossScaling: { src: "/images/resources/gpt-4/loss-scaling.png", width: 1200, height: 645 },
  humanevalScaling: { src: "/images/resources/gpt-4/humaneval-scaling.png", width: 1200, height: 636 },
  inverseScaling: { src: "/images/resources/gpt-4/inverse-scaling.png", width: 795, height: 510 },
  exams: { src: "/images/resources/gpt-4/exam-percentiles.png", width: 1200, height: 1035 },
  multilingual: { src: "/images/resources/gpt-4/multilingual-mmlu.png", width: 1230, height: 1230 },
  visualComic: { src: "/images/resources/gpt-4/visual-comic.png", width: 1185, height: 1425 },
  visualChart: { src: "/images/resources/gpt-4/visual-chart-reasoning.png", width: 1185, height: 1380 },
  visualPaper: { src: "/images/resources/gpt-4/visual-paper-reading.png", width: 1290, height: 1815 },
  factuality: { src: "/images/resources/gpt-4/factuality.png", width: 1200, height: 795 },
  truthfulqa: { src: "/images/resources/gpt-4/truthfulqa.png", width: 1050, height: 705 },
  calibration: { src: "/images/resources/gpt-4/calibration.png", width: 1395, height: 585 },
  safety: { src: "/images/resources/gpt-4/safety-behavior.png", width: 1080, height: 675 },
  rbrm: { src: "/images/resources/gpt-4/rbrm-example.png", width: 1440, height: 930 }
};

const examRows = [
  ["Uniform Bar Exam", "298 / 400", "~90th", "213 / 400", "~10th"],
  ["LSAT", "163", "~88th", "149", "~40th"],
  ["SAT EBRW", "710 / 800", "~93rd", "670 / 800", "~87th"],
  ["SAT Math", "700 / 800", "~89th", "590 / 800", "~70th"],
  ["GRE Quantitative", "163 / 170", "~80th", "147 / 170", "~25th"],
  ["GRE Verbal", "169 / 170", "~99th", "154 / 170", "~63rd"],
  ["USABO Semifinal", "87 / 150", "99th-100th", "43 / 150", "31st-33rd"],
  ["Codeforces", "392", "below 5th", "260", "below 5th"]
];

const benchmarkRows = [
  ["MMLU", "86.4%", "70.0%", "70.7%", "75.2%", "5-shot"],
  ["HellaSwag", "95.3%", "85.5%", "84.2%", "85.6%", "10-shot"],
  ["ARC Challenge", "96.3%", "85.2%", "85.2%", "86.5%", "25-shot"],
  ["WinoGrande", "87.5%", "81.6%", "85.1%", "85.1%", "5-shot"],
  ["HumanEval", "67.0%", "48.1%", "26.2%", "65.8%", "0-shot"],
  ["DROP", "80.9", "64.1", "70.8", "88.4", "3-shot"],
  ["GSM-8K", "92.0%*", "57.1%", "58.8%", "87.3%", "5-shot CoT"]
];

const riskRows = [
  ["Hallucination", "Confident open- and closed-domain errors remain possible."],
  ["Harmful content", "Greater instruction following can make unsafe assistance more effective."],
  ["Bias + allocation", "Stereotypes, refusals, and unequal quality can affect groups differently."],
  ["Disinformation", "Realistic, targeted content lowers the cost of influence operations."],
  ["Proliferation", "Difficult-to-find public information can be compiled for non-experts."],
  ["Privacy", "Public information can be synthesized to infer personal or geographic details."],
  ["Cybersecurity", "Useful for explanation and phishing copy; weak at novel exploitation."],
  ["Agentic behavior", "Long-horizon planning and resource acquisition require explicit evaluation."],
  ["Tool interaction", "Browsing, code, and external systems can amplify both utility and risk."],
  ["Economic impact", "Automation can change tasks, wages, firm power, and inequality."],
  ["Acceleration", "A capable release can alter competitive development incentives."],
  ["Overreliance", "Fluent, mostly-correct behavior can make residual mistakes harder to detect."]
];

const formulas = {
  pretrain: String.raw`\max_\theta\;\mathbb{E}_{x\sim D}\!\left[\sum_t \log p_\theta(x_t\mid x_{<t})\right]`,
  scaling: String.raw`L(C)=aC^b+c`,
  capability: String.raw`-\mathbb{E}_{p\in P}\!\left[\log\operatorname{pass\_rate}_p(C)\right]=\alpha^*C^{-k}`,
  ece: String.raw`\operatorname{ECE}=\sum_{m=1}^{M}\frac{|B_m|}{n}\left|\operatorname{acc}(B_m)-\operatorname{conf}(B_m)\right|`
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

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: ReactNode }) {
  return (
    <div className="mb-10 min-w-0 max-w-4xl">
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-emerald-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({ label, formula, note, tone = "emerald" }: { label: string; formula: string; note?: ReactNode; tone?: "emerald" | "indigo" | "rose" }) {
  const tones = {
    emerald: "border-emerald-300/20 bg-emerald-300/5 text-emerald-50",
    indigo: "border-indigo-300/20 bg-indigo-300/5 text-indigo-50",
    rose: "border-rose-300/20 bg-rose-300/5 text-rose-50"
  };
  return (
    <div className={"min-w-0 overflow-hidden rounded-2xl border " + tones[tone]}>
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="overflow-x-auto px-5 py-7">
        <DisplayMath formula={formula} />
        {note && <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400">{note}</p>}
      </div>
    </div>
  );
}

function FigureCard({ image, title, caption, className = "", imageClassName = "" }: { image: keyof typeof figures; title: string; caption: ReactNode; className?: string; imageClassName?: string }) {
  const figure = figures[image];
  return (
    <figure className={"min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722] " + className}>
      <div className="flex min-h-52 items-center justify-center bg-white p-3 sm:p-5">
        <Image src={figure.src} alt={title} width={figure.width} height={figure.height} className={"h-auto max-h-[940px] w-full object-contain " + imageClassName} />
      </div>
      <figcaption className="border-t border-slate-800 p-5">
        <p className="font-bold text-slate-100">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{caption}</p>
      </figcaption>
    </figure>
  );
}

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-300 transition-colors hover:text-white">{children} <ExternalLink size={13} /></a>;
}

function EvidenceConsole() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-[#101722] shadow-[0_0_100px_-48px_rgba(52,211,153,0.9)]">
      <div className="absolute -right-10 top-10 h-40 w-40 bg-indigo-400/10 blur-3xl" />
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /></div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">capability observatory</span>
      </div>
      <div className="relative p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-indigo-300/20 bg-indigo-300/5 p-4"><MessageSquareText className="text-indigo-300" size={18} /><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">input 01</p><p className="mt-1 text-sm font-black">interlaced text</p></div>
          <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4"><ImageIcon className="text-emerald-300" size={18} /><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">input 02</p><p className="mt-1 text-sm font-black">visual evidence</p></div>
        </div>
        <div className="my-3 flex justify-center text-slate-700"><ArrowDown size={18} /></div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[#0b1017] p-6 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <LockKeyhole className="relative mx-auto text-rose-300" size={25} />
          <p className="relative mt-4 text-xl font-black">GPT-4 core</p>
          <p className="relative mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">transformer / implementation withheld</p>
          <div className="relative mt-5 grid grid-cols-3 gap-2">
            {["size", "compute", "data recipe"].map((item) => <span key={item} className="rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-2 font-mono text-[9px] uppercase text-slate-600">{item}</span>)}
          </div>
        </div>
        <div className="my-3 flex justify-center text-slate-700"><ArrowDown size={18} /></div>
        <div className="rounded-xl border border-slate-800 bg-[#0b1017] p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Bot className="text-emerald-300" size={18} /><span className="text-sm font-black">text output</span></div><span className="font-mono text-[10px] text-emerald-300">READY</span></div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[92%] bg-gradient-to-r from-emerald-300 via-indigo-300 to-rose-300" /></div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[["86.4%", "MMLU"], ["67.0%", "HumanEval"], ["~90th", "Bar exam"]].map(([value, label]) => <div key={label} className="rounded-xl border border-slate-800 bg-[#0b1017] p-3"><p className="font-mono text-lg font-black text-white">{value}</p><p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-slate-600">{label}</p></div>)}
        </div>
      </div>
    </div>
  );
}

export default function GPT4Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] font-sans text-white selection:bg-emerald-400/30">
      <SiteNav />

      <header className="relative border-b border-slate-800 px-5 pb-20 pt-28 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.028)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.82fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.22em]"><span className="rounded-full border border-emerald-300/25 bg-emerald-300/5 px-3 py-1.5 text-emerald-300">OpenAI 2023</span><span className="rounded-full border border-slate-700 px-3 py-1.5 text-slate-500">Multimodal</span><span className="rounded-full border border-slate-700 px-3 py-1.5 text-slate-500">Technical report v6</span></div>
            <p className="mt-8 font-mono text-sm font-black uppercase tracking-[0.3em] text-emerald-300">GPT-4</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">A frontier model,<span className="block bg-gradient-to-r from-emerald-300 via-indigo-300 to-rose-300 bg-clip-text text-transparent">measured from the outside.</span></h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">A complete reading of the GPT-4 Technical Report: what enters the model, which capabilities scale predictably, what the evaluations establish, how post-training changes behavior, and why deployment safety cannot be reduced to one benchmark.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href={links.arxiv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-950 transition-colors hover:bg-white"><BookOpen size={15} /> Read report <ExternalLink size={13} /></a><a href="#scaling" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-300 transition-colors hover:border-indigo-300/50 hover:text-white">Trace the evidence <ArrowDown size={14} /></a></div>
            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-4">{[["1 / 1000", "forecast compute"], ["26", "MMLU languages"], [">50", "expert red teamers"], ["100", "report pages"]].map(([value, label]) => <div key={label} className="bg-[#101722] px-4 py-5"><p className="text-2xl font-black text-white">{value}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">{label}</p></div>)}</div>
          </div>
          <EvidenceConsole />
        </div>
      </header>

      <nav aria-label="On this page" className="sticky top-20 z-30 border-b border-slate-800 bg-[#0d1117]/95 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">{sections.map(([href, label], index) => <a key={href} href={`#${href}`} className="shrink-0 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 transition-colors hover:bg-emerald-300/5 hover:text-emerald-300"><span className="mr-2 text-slate-800">{String(index + 1).padStart(2, "0")}</span>{label}</a>)}</div></nav>

      <section id="scope" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="01 / evidence boundary" title="The missing specification is a reported design choice." description="The report is rich in behavioral evidence and sparse in implementation detail. Competitive pressure and safety implications are given as the reasons for withholding information that would normally make a technical report reproducible." />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6"><Eye className="text-emerald-300" size={23} /><p className="mt-5 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">disclosed</p><div className="mt-5 space-y-3">{["Transformer-style autoregressive objective", "image + text input and text output interface", "public and licensed pretraining-data sources", "RLHF and rule-based reward-model post-training", "scaling, capability, calibration, and safety evaluations", "system-card risks and deployment mitigations"].map(item => <div key={item} className="flex gap-3"><Check className="mt-0.5 shrink-0 text-emerald-300" size={15} /><span className="text-sm leading-6 text-slate-300">{item}</span></div>)}</div></div>
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><LockKeyhole className="text-rose-300" size={23} /><p className="mt-5 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">withheld</p><div className="mt-5 space-y-3">{["model size and detailed architecture", "hardware and training compute", "dataset construction and mixture", "optimizer and full training method", "vision encoder or fusion mechanism", "reproducible systems configuration"].map(item => <div key={item} className="flex gap-3"><X className="mt-0.5 shrink-0 text-rose-300" size={15} /><span className="text-sm leading-6 text-slate-300">{item}</span></div>)}</div></div>
          </div>
          <div className="mt-8 rounded-2xl border border-indigo-300/20 bg-indigo-300/5 p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-indigo-300">how to read the report</p><p className="mt-3 max-w-5xl text-sm leading-7 text-slate-300">Treat GPT-4 as a measured system rather than a reproducible recipe. The report supports claims about observed behavior under stated evaluations; it does not support claims about parameter count, mixture-of-experts routing, exact training data, or the internal image architecture.</p></div>
        </div>
      </section>

      <section id="interface" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="02 / model contract" title="Interlace images and text; generate text autoregressively." description="The report defines GPT-4 by its external contract. A prompt may contain arbitrarily interlaced images and text. The model then emits text tokens, and standard prompting techniques such as few-shot examples and chain-of-thought remain applicable." />
          <Equation label="disclosed pretraining objective" formula={formulas.pretrain} note="GPT-4 is still a next-token predictor. Multimodality changes the conditioning context, but the report describes text generation with the same autoregressive output contract." />
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr] lg:items-center">
            <div className="rounded-2xl border border-indigo-300/20 bg-indigo-300/5 p-6"><MessageSquareText className="text-indigo-300" size={22} /><h3 className="mt-5 text-xl font-black">Text segments</h3><p className="mt-3 text-sm leading-7 text-slate-400">Instructions, demonstrations, questions, document text, and intermediate context.</p></div>
            <ArrowRight className="hidden text-slate-700 lg:block" size={20} />
            <div className="rounded-2xl border border-slate-700 bg-[#101722] p-7 text-center"><Layers3 className="mx-auto text-emerald-300" size={26} /><h3 className="mt-4 text-2xl font-black">Multimodal Transformer</h3><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">fusion details undisclosed</p></div>
            <ArrowRight className="hidden text-slate-700 lg:block" size={20} />
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6"><Bot className="text-emerald-300" size={22} /><h3 className="mt-5 text-xl font-black">Text sequence</h3><p className="mt-3 text-sm leading-7 text-slate-400">Answers, explanations, code, summaries, and structured natural-language output.</p></div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">{[[ImageIcon, "Photographs", "visual objects and scenes"], [ScanSearch, "Documents", "screenshots, text, and layouts"], [BarChart3, "Diagrams", "charts, figures, and spatial relations"]].map(([icon, title, body]) => { const Icon = icon as typeof ImageIcon; return <div key={String(title)} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><Icon className="text-indigo-300" size={19} /><p className="mt-4 font-black">{String(title)}</p><p className="mt-2 text-xs text-slate-500">{String(body)}</p></div>; })}</div>
        </div>
      </section>

      <section id="scaling" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="03 / predictable scaling" title="Forecast the final run before it finishes." description="The central systems claim is not simply that bigger models perform better. It is that infrastructure and optimization were stable enough for small-run scaling laws to predict final loss and selected capabilities before the GPT-4 run completed." />
          <div className="grid gap-5 lg:grid-cols-2"><Equation label="loss forecast" formula={formulas.scaling} note={<><span className="font-mono text-emerald-300">C</span> is training compute, <span className="font-mono text-indigo-300">aC^b</span> is the reducible power-law component, and <span className="font-mono text-rose-300">c</span> is irreducible loss. The fit uses runs with at most 1/10,000 of GPT-4 compute.</>} /><Equation label="capability forecast" formula={formulas.capability} note="The paper models mean log pass rate over a subset of HumanEval problems. Runs using at most 1/1,000 of GPT-4 compute forecast the final point." tone="indigo" /></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2"><FigureCard image="lossScaling" title="Final code loss lands on the forecast" caption="Figure 1. The dotted power-law curve is fitted without GPT-4. The green GPT-4 observation closely matches the ex-ante prediction on an internal code dataset excluded from training." /><FigureCard image="humanevalScaling" title="Selected coding capability is forecastable" caption="Figure 2. Mean log pass rate on 23 HumanEval problems follows the extrapolated trend. The paper reports similarly strong predictions across most difficulty buckets, except underperformance on the easiest bucket." /></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.68fr_1.32fr]"><FigureCard image="inverseScaling" title="Scaling can reverse a negative trend" caption="Figure 3. Hindsight Neglect worsens over several smaller models before GPT-4 reverses the trend, showing why smooth loss prediction does not make every emergent behavior predictable." /><div className="rounded-2xl border border-slate-800 bg-[#101722] p-7"><TriangleAlert className="text-rose-300" size={23} /><h3 className="mt-5 text-2xl font-black">Loss is easier to predict than behavior.</h3><div className="mt-6 space-y-4">{["Aggregate loss is dense, low-noise, and measured over many tokens.", "HumanEval pass rate is sparse, problem-dependent, and difficult to estimate near zero.", "Individual tasks can worsen with scale even while aggregate capability improves.", "Forecasts were registered before completion, reducing hindsight selection for the reported targets."].map((item, index) => <div key={item} className="flex gap-4"><span className="font-mono text-xs font-black text-emerald-300">0{index + 1}</span><p className="text-sm leading-7 text-slate-400">{item}</p></div>)}</div></div></div>
        </div>
      </section>

      <section id="exams" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="04 / professional + academic exams" title="Human-level on many tests, uneven across domains." description="The team simulated exam conditions using held-out tests, exam-specific grading, separate prompts for multiple-choice and free response, and images where required. For contamination analysis, it reports the lower of the full-test score and an uncontaminated extrapolation." />
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><FigureCard image="exams" title="GPT-4 versus GPT-3.5 exam percentiles" caption="Figure 4. GPT-4 improves on most exams, but the profile is not uniformly expert: Codeforces remains below the 5th percentile and several AP English and math exams remain modest." /><div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101722]"><div className="overflow-x-auto"><table className="min-w-[670px] w-full text-left"><thead className="border-b border-slate-800 bg-[#0b1017] font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600"><tr><th className="px-4 py-4">exam</th><th className="px-4 py-4">GPT-4</th><th className="px-4 py-4">percentile</th><th className="px-4 py-4">GPT-3.5</th><th className="px-4 py-4">percentile</th></tr></thead><tbody className="divide-y divide-slate-800 text-sm">{examRows.map(row => <tr key={row[0]}><td className="px-4 py-4 font-bold text-slate-200">{row[0]}</td><td className="px-4 py-4 font-mono text-emerald-300">{row[1]}</td><td className="px-4 py-4 text-slate-400">{row[2]}</td><td className="px-4 py-4 font-mono text-indigo-300">{row[3]}</td><td className="px-4 py-4 text-slate-500">{row[4]}</td></tr>)}</tbody></table></div></div></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{[["298 / 400", "Uniform Bar Exam", "about the 90th percentile"], ["169 / 170", "GRE Verbal", "about the 99th percentile"], ["392", "Codeforces rating", "still below the 5th percentile"]].map(([value, label, note], index) => <div key={label} className={`rounded-2xl border p-6 ${index === 2 ? "border-rose-300/20 bg-rose-300/5" : "border-emerald-300/20 bg-emerald-300/5"}`}><p className={`text-3xl font-black ${index === 2 ? "text-rose-300" : "text-emerald-300"}`}>{value}</p><p className="mt-3 font-black">{label}</p><p className="mt-2 text-xs text-slate-500">{note}</p></div>)}</div>
          <div className="mt-5 rounded-2xl border border-indigo-300/20 bg-indigo-300/5 p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-indigo-300">post-training control</p><p className="mt-3 text-sm leading-7 text-slate-300">Across the report&apos;s multiple-choice exams, the base model averages 73.7% and the RLHF model 74.0%. The exam capability is therefore attributed primarily to pretraining, not to instruction-following post-training.</p></div>
        </div>
      </section>

      <section id="benchmarks" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="05 / machine-learning benchmarks" title="Broad few-shot gains, with contamination caveats attached." description="GPT-4 beats the compared few-shot language models on every listed benchmark and benchmark-specific state of the art on all but DROP. The prompting setup, contamination checks, and explicit training exceptions are part of the result." />
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101722]"><div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left"><thead className="border-b border-slate-800 bg-[#0b1017] font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600"><tr><th className="px-5 py-4">benchmark</th><th className="px-5 py-4">GPT-4</th><th className="px-5 py-4">GPT-3.5</th><th className="px-5 py-4">external LM</th><th className="px-5 py-4">task SOTA</th><th className="px-5 py-4">protocol</th></tr></thead><tbody className="divide-y divide-slate-800 text-sm">{benchmarkRows.map(row => <tr key={row[0]} className="transition-colors hover:bg-white/[0.02]"><td className="px-5 py-4 font-black text-white">{row[0]}</td><td className="px-5 py-4 font-mono font-black text-emerald-300">{row[1]}</td><td className="px-5 py-4 font-mono text-indigo-300">{row[2]}</td><td className="px-5 py-4 text-slate-400">{row[3]}</td><td className="px-5 py-4 text-slate-400">{row[4]}</td><td className="px-5 py-4 text-slate-500">{row[5]}</td></tr>)}</tbody></table></div></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5"><Check className="text-emerald-300" size={19} /><h3 className="mt-4 font-black">Private holdouts</h3><p className="mt-2 text-xs leading-6 text-slate-400">HellaSwag uses a secret holdout and closely matches validation performance.</p></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-5"><TriangleAlert className="text-rose-300" size={19} /><h3 className="mt-4 font-black">Excluded benchmark</h3><p className="mt-2 text-xs leading-6 text-slate-400">BIG-bench is omitted after portions are found in the training mixture.</p></div><div className="rounded-2xl border border-indigo-300/20 bg-indigo-300/5 p-5"><Database className="text-indigo-300" size={19} /><h3 className="mt-4 font-black">Intentional math mix</h3><p className="mt-2 text-xs leading-6 text-slate-400">MATH and GSM-8K training data are mixed into pretraining; GSM-8K&apos;s 92.0% is starred accordingly.</p></div></div>
        </div>
      </section>

      <section id="languages" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="06 / multilingual transfer" title="English-trained capability transfers across translated MMLU." description="The report machine-translates MMLU into 26 languages and evaluates with a three-shot prompt. GPT-4 exceeds the previous models' English performance in 24 languages, including Latvian, Welsh, and Swahili." />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.65fr]"><FigureCard image="multilingual" title="Three-shot MMLU across 26 languages" caption="Figure 5. English GPT-4 reaches 85.5% in this three-shot multilingual protocol; the long tail remains well above random chance, though performance declines to 62.0% for Telugu." /><div className="space-y-5"><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6"><Globe2 className="text-emerald-300" size={23} /><p className="mt-5 text-5xl font-black">24 / 26</p><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-200">languages above prior English SOTA</p></div><div className="rounded-2xl border border-slate-800 bg-[#101722] p-6"><Languages className="text-indigo-300" size={22} /><h3 className="mt-5 text-xl font-black">What was translated</h3><p className="mt-3 text-sm leading-7 text-slate-400">The instruction, question, and answer text. The A-D labels and the literal token “Answer” remain in English for prompt consistency.</p></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><TriangleAlert className="text-rose-300" size={22} /><h3 className="mt-5 text-xl font-black">What can confound it</h3><p className="mt-3 text-sm leading-7 text-slate-400">Machine translation can lose nuance, preserve helpful English proper nouns, and create longer token sequences. The paper uses three-shot rather than five-shot to fit all languages.</p></div></div></div>
        </div>
      </section>

      <section id="vision" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="07 / visual inputs" title="Read the pixels, then reason in language." description="The examples test more than image labeling: humor, chart arithmetic, document reading, diagrams, screenshots, and cross-modal explanation. They demonstrate the interface, not a comprehensive vision benchmark." />
          <div className="grid gap-6 lg:grid-cols-2"><FigureCard image="visualChart" title="Chart reading plus arithmetic" caption="Appendix Table 14. GPT-4 reads 79.84 g and 69.62 g from the image, states the steps, and returns 149.46 g." /><FigureCard image="visualPaper" title="Pixel-to-paper technical summarization" caption="Appendix Table 17. Given screenshots from the InstructGPT paper, GPT-4 summarizes the thesis and reconstructs the SFT -> RM -> PPO pipeline shown in Figure 2." /></div>
          <FigureCard image="visualComic" title="Panel-level visual explanation" caption="Table 3. GPT-4 identifies the mismatch between a large VGA connector and a modern phone connector, then explains why the three-panel package image is absurd." className="mt-6 lg:mx-auto lg:max-w-3xl" />
          <div className="mt-8 rounded-2xl border border-indigo-300/20 bg-indigo-300/5 p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-indigo-300">evidence boundary</p><p className="mt-3 text-sm leading-7 text-slate-300">The report gives qualitative visual examples and points to a separate blog for preliminary academic benchmarks. It does not disclose the visual encoder, fusion topology, image resolution, image-token budget, or a broad quantitative vision evaluation.</p></div>
        </div>
      </section>

      <section id="posttraining" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="08 / behavioral post-training" title="RLHF provides intent; RBRMs sharpen the policy boundary." description="GPT-4 follows the InstructGPT sequence of supervised demonstrations, preference modeling, and PPO. The new safety layer uses GPT-4 itself as a zero-shot classifier over human-written rubrics to add targeted reward signals." />
          <div className="grid gap-4 lg:grid-cols-4">{[[GraduationCap, "SFT", "imitate human demonstrations"], [Scale, "Reward model", "predict average labeler preference"], [RefreshCw, "PPO", "optimize the SFT policy"], [ShieldCheck, "RBRM", "score rubric-defined safety behavior"]].map(([icon, title, body], index) => { const Icon = icon as typeof GraduationCap; return <div key={String(title)} className="relative rounded-2xl border border-slate-800 bg-[#101722] p-5"><span className="absolute right-4 top-4 font-mono text-2xl font-black text-slate-800">0{index + 1}</span><Icon className={index === 3 ? "text-rose-300" : "text-emerald-300"} size={20} /><h3 className="mt-5 font-black">{String(title)}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{String(body)}</p></div>; })}</div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.8fr]"><FigureCard image="rbrm" title="A rule-based reward model is a prompted classifier" caption="System Card Figure 6. The policy response, optional user prompt, and a detailed human-written rubric are passed to zero-shot GPT-4. Its class label becomes an additional reward signal during PPO." /><div className="space-y-5"><div className="rounded-2xl border border-slate-800 bg-[#101722] p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">RBRM labels</p><div className="mt-5 space-y-3">{["desired-style refusal", "undesired or evasive refusal", "response with disallowed content", "safe, useful non-refusal"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0b1017] px-4 py-3"><span className="font-mono text-xs font-black text-indigo-300">{String.fromCharCode(65 + index)}</span><span className="text-sm text-slate-400">{item}</span></div>)}</div></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-300">boundary-data loop</p><p className="mt-4 text-sm leading-7 text-slate-400">Models rewrite unsafe prompts into maximally similar safe boundary prompts. Known-safe examples penalize over-refusal; adversarial rankings from labelers train robustness against jailbreak attempts.</p></div></div></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{[["70.2%", "preferred over GPT-3.5 RLHF"], ["61.1%", "preferred over GPT-3.5 Turbo RLHF"], ["5,214", "blind-labeled user prompts"]].map(([value, label]) => <div key={label} className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6"><p className="text-3xl font-black text-emerald-300">{value}</p><p className="mt-3 text-sm text-slate-400">{label}</p></div>)}</div>
        </div>
      </section>

      <section id="reliability" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="09 / reliability" title="More factual, still fallible, and less calibrated after PPO." description="GPT-4 improves substantially on adversarial factuality and TruthfulQA. Yet it still hallucinates, accepts false premises, makes reasoning and coding errors, and can express high confidence when wrong." />
          <div className="grid gap-6 lg:grid-cols-2"><FigureCard image="factuality" title="Internal adversarial factuality improves across topics" caption="Figure 6. GPT-4 scores 19 percentage points above the latest evaluated GPT-3.5 version on open-domain factuality. The System Card separately reports a 29-point gain on closed-domain hallucination evaluations." /><FigureCard image="truthfulqa" title="Post-training drives the TruthfulQA gain" caption="Figure 7. Base GPT-4 is only slightly ahead of GPT-3.5; the largest movement appears after RLHF. The report notes that RLHF data was not checked for TruthfulQA contamination." /></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><FigureCard image="calibration" title="Post-training damages confidence calibration" caption="Figure 8. On an MMLU subset, expected calibration error rises from 0.007 for the pre-trained model to 0.074 after PPO. The post-trained model is frequently more confident than its empirical accuracy supports." /><div className="space-y-5"><Equation label="expected calibration error" formula={formulas.ece} note="Within each confidence bin, compare mean confidence with empirical accuracy, then weight the gap by bin frequency." tone="indigo" /><div className="grid grid-cols-2 gap-4"><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5"><p className="text-3xl font-black text-emerald-300">0.007</p><p className="mt-2 text-xs text-slate-500">pre-trained ECE</p></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-5"><p className="text-3xl font-black text-rose-300">0.074</p><p className="mt-2 text-xs text-slate-500">post-trained ECE</p></div></div><div className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">practical consequence</p><p className="mt-3 text-sm leading-7 text-slate-400">Preference optimization can make answers more useful and truthful on average while making the confidence signal less trustworthy. Factuality and calibration are distinct objectives.</p></div></div></div>
        </div>
      </section>

      <section id="safety" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="10 / layered safety system" title="Model behavior is one control inside a larger deployment loop." description="The safety process combines domain-expert red teaming, model and human evaluations, targeted SFT/RLHF data, RBRM rewards, classifiers, policy enforcement, monitoring, and iterative updates from real usage." />
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><div className="space-y-5"><div className="rounded-2xl border border-indigo-300/20 bg-indigo-300/5 p-6"><UsersRound className="text-indigo-300" size={23} /><p className="mt-5 text-4xl font-black">&gt;50</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-200">domain experts</p><p className="mt-4 text-sm leading-7 text-slate-400">Red teamers covered cybersecurity, biorisk, international security, long-term alignment, law, healthcare, education, economics, and other high-risk domains.</p></div><FigureCard image="safety" title="Incorrect behavior falls on difficult prompts" caption="Figure 9. GPT-4 has a lower incorrect-behavior rate than text-davinci-003 and GPT-3.5 Turbo on both sensitive and disallowed prompt sets." /></div><div className="grid content-start gap-4 sm:grid-cols-2">{[["82% lower", "responses to disallowed requests", "versus GPT-3.5"], ["29% better", "policy adherence on sensitive requests", "medical advice, self-harm, and related cases"], ["0.73%", "toxic generations", "versus 6.48% for GPT-3.5"], ["19 / 29 pts", "open / closed factuality gains", "versus the latest GPT-3.5 model"]].map(([value, label, note], index) => <div key={label} className={`rounded-2xl border p-6 ${index === 2 ? "border-rose-300/20 bg-rose-300/5" : "border-emerald-300/20 bg-emerald-300/5"}`}><p className={`text-3xl font-black ${index === 2 ? "text-rose-300" : "text-emerald-300"}`}>{value}</p><p className="mt-3 font-black leading-6">{label}</p><p className="mt-2 text-xs leading-5 text-slate-500">{note}</p></div>)}</div></div>
          <div className="mt-8 grid gap-3 md:grid-cols-4">{[[ScanSearch, "Red team", "find domain-specific failures"], [BrainCircuit, "Mitigate", "train SFT, RM, PPO, and RBRM"], [Gauge, "Monitor", "classifiers, review, and policy enforcement"], [RefreshCw, "Iterate", "feed deployment evidence back into training"]].map(([icon, title, body], index) => { const Icon = icon as typeof ScanSearch; return <div key={String(title)} className="relative rounded-2xl border border-slate-800 bg-[#101722] p-5"><span className="absolute right-4 top-4 font-mono text-2xl font-black text-slate-800">0{index + 1}</span><Icon className="text-emerald-300" size={19} /><h3 className="mt-4 font-black">{String(title)}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{String(body)}</p></div>; })}</div>
          <div className="mt-8 rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">residual attack surface</p><p className="mt-3 text-sm leading-7 text-slate-300">The report explicitly demonstrates jailbreaks that bypass launch mitigations. Fine-tuning changes default behavior but leaves harmful pre-trained capabilities latent, so model-level refusal must be backed by monitoring, access controls, product design, and rapid response.</p></div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-36 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="11 / limits + risk surface" title="Capability is broad; reliability remains conditional." description="GPT-4 is less capable than humans in many real-world settings and inherits familiar language-model failure modes. Its stronger reasoning, persuasion, and tool use also create risk surfaces that weaker models did not expose as sharply." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{riskRows.map(([title, body], index) => <div key={title} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><div className="flex items-center justify-between"><TriangleAlert className={index < 4 ? "text-rose-300" : index < 8 ? "text-indigo-300" : "text-emerald-300"} size={19} /><span className="font-mono text-[10px] text-slate-700">{String(index + 1).padStart(2, "0")}</span></div><h3 className="mt-4 font-black">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{body}</p></div>)}</div>
          <div className="mt-8 grid gap-5 md:grid-cols-3"><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><FileQuestion className="text-rose-300" size={21} /><h3 className="mt-5 font-black">Knowledge cutoff</h3><p className="mt-3 text-sm leading-7 text-slate-400">Most pretraining data ends in September 2021, with only a small amount of later pre- and post-training data.</p></div><div className="rounded-2xl border border-indigo-300/20 bg-indigo-300/5 p-6"><CircleGauge className="text-indigo-300" size={21} /><h3 className="mt-5 font-black">No learning from use</h3><p className="mt-3 text-sm leading-7 text-slate-400">The deployed model does not update its knowledge or permanently learn from a conversation&apos;s experience.</p></div><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6"><Target className="text-emerald-300" size={21} /><h3 className="mt-5 font-black">ARC preliminary result</h3><p className="mt-3 text-sm leading-7 text-slate-400">Early models without task-specific fine-tuning were ineffective at autonomous replication and resource acquisition; the test did not cover the final deployed model.</p></div></div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">what the report establishes</p><div className="mt-5 space-y-3">{["Selected loss and capability metrics can be forecast from much smaller runs.", "GPT-4 improves substantially across exams, NLP benchmarks, languages, and visual tasks.", "Post-training materially improves instruction following, factuality, and safety behavior.", "A model-assisted safety pipeline can encode finer behavior rules than preference data alone."].map(item => <div key={item} className="flex gap-3"><Check className="mt-1 shrink-0 text-emerald-300" size={15} /><p className="text-sm leading-7 text-slate-300">{item}</p></div>)}</div></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">what it does not establish</p><div className="mt-5 space-y-3">{["A reproducible architecture, training recipe, compute budget, or data mixture.", "That every capability follows a smooth or predictable scaling law.", "That benchmark strength implies dependable factuality or calibrated confidence.", "That launch mitigations eliminate jailbreaks, bias, misuse, or systemic deployment risk."].map(item => <div key={item} className="flex gap-3"><X className="mt-1 shrink-0 text-rose-300" size={15} /><p className="text-sm leading-7 text-slate-300">{item}</p></div>)}</div></div></div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]"><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">reading checkpoint</p><h3 className="mt-3 text-3xl font-black">You can now read GPT-4 as a complete measured system.</h3><div className="mt-6 grid gap-3 sm:grid-cols-2">{["separate disclosed evidence from withheld design", "derive both reported scaling relationships", "read exams and benchmarks with contamination controls", "trace text-image input into text generation", "reconstruct RLHF plus RBRM post-training", "separate factuality, calibration, and safety"].map(item => <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#101722] p-4"><ChevronRight className="mt-0.5 shrink-0 text-emerald-300" size={15} /><span className="text-sm leading-6 text-slate-400">{item}</span></div>)}</div></div><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">primary sources</p><div className="mt-4 space-y-3"><SourceLink href={links.arxiv}>Official arXiv abstract</SourceLink><SourceLink href={links.html}>Official arXiv HTML</SourceLink><SourceLink href={links.pdf}>Version 6 PDF</SourceLink><SourceLink href={links.source}>TeX source package</SourceLink><SourceLink href={links.doi}>arXiv DOI record</SourceLink></div><div className="mt-7 rounded-2xl border border-slate-800 bg-[#101722] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">paper</p><p className="mt-2 text-sm font-black leading-6 text-slate-300">GPT-4 Technical Report</p><p className="mt-3 text-xs leading-6 text-slate-600">OpenAI. Submitted March 2023; version 6 revised March 2024. The accompanying system card begins on page 40 of the 100-page report.</p></div></div></div>
          <PaperTimelineNav older={{ href: "/resources/instructgpt", title: "InstructGPT", year: 2022 }} newer={{ href: "/resources/sparks-of-agi", title: "Sparks of AGI", year: 2023 }} />
        </div>
      </section>
      <SocialFooter />
    </main>
  );
}
