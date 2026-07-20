import Image from "next/image";
import katex from "katex";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  Braces,
  Check,
  ChevronRight,
  CircleGauge,
  Code2,
  Compass,
  Database,
  ExternalLink,
  Eye,
  FileQuestion,
  Fingerprint,
  Gauge,
  Globe2,
  Lightbulb,
  MessageSquareText,
  Network,
  Puzzle,
  RefreshCw,
  Scale,
  ScanSearch,
  ShieldAlert,
  Target,
  Terminal,
  TriangleAlert,
  UsersRound,
  WandSparkles,
  Wrench,
  X
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

export const metadata: Metadata = {
  title: "Sparks of AGI: A Complete Technical Reading",
  description: "An evidence-led reconstruction of Microsoft's early GPT-4 experiments across coding, mathematics, tools, theory of mind, truthfulness, planning, and the disputed AGI claim."
};

const links = {
  arxiv: "https://arxiv.org/abs/2303.12712",
  pdf: "https://arxiv.org/pdf/2303.12712v5",
  source: "https://arxiv.org/src/2303.12712v5",
  doi: "https://doi.org/10.48550/arXiv.2303.12712"
};

const sections = [
  ["contract", "experiment contract"],
  ["generality", "generality map"],
  ["coding", "coding"],
  ["math", "mathematics"],
  ["tools", "tools + world"],
  ["humans", "human models"],
  ["judgment", "judgment"],
  ["planning", "planning fault line"],
  ["society", "societal surface"],
  ["claim", "claim audit"],
  ["agenda", "research agenda"]
] as const;

const figures = {
  mosaic: { src: "/images/resources/sparks-of-agi/capability-mosaic.png", width: 1083, height: 1624 },
  unicorn: { src: "/images/resources/sparks-of-agi/unicorn-evolution.png", width: 1105, height: 495 },
  coding: { src: "/images/resources/sparks-of-agi/coding-benchmarks.png", width: 1083, height: 957 },
  visualization: { src: "/images/resources/sparks-of-agi/data-visualization.png", width: 1056, height: 1199 },
  composition: { src: "/images/resources/sparks-of-agi/visual-composition.png", width: 1083, height: 616 },
  math: { src: "/images/resources/sparks-of-agi/math-evidence.png", width: 1083, height: 935 },
  mathErrors: { src: "/images/resources/sparks-of-agi/math-error-profile.png", width: 1061, height: 297 },
  tool: { src: "/images/resources/sparks-of-agi/tool-use.png", width: 1039, height: 847 },
  email: { src: "/images/resources/sparks-of-agi/email-calendar.png", width: 1039, height: 1496 },
  world: { src: "/images/resources/sparks-of-agi/world-model.png", width: 1039, height: 1309 },
  mind: { src: "/images/resources/sparks-of-agi/theory-of-mind.png", width: 1134, height: 1380 },
  consistency: { src: "/images/resources/sparks-of-agi/process-consistency.png", width: 1039, height: 1166 },
  truth: { src: "/images/resources/sparks-of-agi/truthfulness.png", width: 1105, height: 1232 },
  localGlobal: { src: "/images/resources/sparks-of-agi/planning-local-global.png", width: 1067, height: 1155 },
  planning: { src: "/images/resources/sparks-of-agi/planning-failure.png", width: 1067, height: 1331 },
  bias: { src: "/images/resources/sparks-of-agi/bias-analysis.png", width: 1067, height: 1012 }
} as const;

type FigureKey = keyof typeof figures;

const codingRows = [
  ["GPT-4", "82%", "38.0%", "53.0%", "highlight"],
  ["text-davinci-003", "65%", "19.0%", "36.0%", ""],
  ["Codex", "39%", "13.0%", "23.0%", ""],
  ["CODEGEN-16B", "30%", "-", "-", ""],
  ["LeetCode users", "-", "38.2%", "-", "human"]
] as const;

const mathRows = [
  ["GPT-4", "87.1%", "42.5%", "82.7%", "highlight"],
  ["Minerva", "58.8%", "33.6%", "63.9%", ""],
  ["text-davinci-003", "61.3%", "23.5%", "54.2%", ""]
] as const;

const limitationRows = [
  ["Confidence calibration", "Confident language is not a reliable indicator of factual correctness."],
  ["Long-term memory", "A bounded, stateless context cannot carry an evolving history indefinitely."],
  ["Continual learning", "The deployed weights do not absorb new facts or feedback during normal use."],
  ["Personalization", "Meta-prompts are a limited substitute for durable user- or organization-specific adaptation."],
  ["Planning + conceptual leaps", "Global constraints and discontinuous insights expose weak search and backtracking."],
  ["Interpretability + consistency", "A persuasive explanation may be post-hoc and need not reveal the generating process."],
  ["Cognitive fallacies", "The model can inherit anchoring, confirmation, base-rate, and other reasoning failures."],
  ["Input sensitivity", "Small changes in wording or sequence can materially alter the response."]
] as const;

const authors = "Sebastien Bubeck, Varun Chandrasekaran, Ronen Eldan, Johannes Gehrke, Eric Horvitz, Ece Kamar, Peter Lee, Yin Tat Lee, Yuanzhi Li, Scott Lundberg, Harsha Nori, Hamid Palangi, Marco Tulio Ribeiro, and Yi Zhang";

function MathBlock({ formula }: { formula: string }) {
  return <div className="overflow-x-auto py-1 text-center text-lg text-white [scrollbar-width:none] sm:text-2xl [&::-webkit-scrollbar]:hidden" dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { displayMode: true, throwOnError: false }) }} />;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-12 max-w-4xl">
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function PaperFigure({ image, title, caption, className = "" }: { image: FigureKey; title: string; caption: string; className?: string }) {
  const figure = figures[image];
  return (
    <figure className={`min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-[#111722] ${className}`}>
      <div className="border-b border-slate-800 bg-white p-3 sm:p-5">
        <Image src={figure.src} alt={title} width={figure.width} height={figure.height} sizes="(max-width: 1024px) 100vw, 50vw" className="h-auto w-full" />
      </div>
      <figcaption className="p-5">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-300">primary paper evidence</p>
        <h3 className="mt-2 text-base font-black text-white">{title}</h3>
        <p className="mt-2 text-xs leading-6 text-slate-500">{caption}</p>
      </figcaption>
    </figure>
  );
}

function Metric({ value, label, note, tone = "cyan" }: { value: string; label: string; note: string; tone?: "cyan" | "fuchsia" | "amber" }) {
  const tones = { cyan: "text-cyan-300", fuchsia: "text-fuchsia-300", amber: "text-amber-200" };
  return (
    <div className="border-l border-slate-800 px-5 first:border-l-0">
      <p className={`text-3xl font-black ${tones[tone]}`}>{value}</p>
      <p className="mt-2 text-sm font-black text-white">{label}</p>
      <p className="mt-2 text-xs leading-5 text-slate-600">{note}</p>
    </div>
  );
}

function EvidenceLabel({ children, tone = "measured" }: { children: ReactNode; tone?: "measured" | "probe" | "interpretation" | "caveat" }) {
  const tones = {
    measured: "border-cyan-300/20 bg-cyan-300/5 text-cyan-300",
    probe: "border-fuchsia-300/20 bg-fuchsia-300/5 text-fuchsia-300",
    interpretation: "border-amber-200/20 bg-amber-200/5 text-amber-200",
    caveat: "border-rose-300/20 bg-rose-300/5 text-rose-300"
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-[0.17em] ${tones[tone]}`}>{children}</span>;
}

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111722] px-4 py-3 text-sm font-bold text-slate-400 transition-colors hover:border-cyan-300/40 hover:text-white"><span>{children}</span><ExternalLink size={14} /></a>;
}

function ProbeConsole() {
  const probes = [
    [Code2, "code", "82% HumanEval"],
    [BrainCircuit, "reasoning", "87.1% GSM8K"],
    [Wrench, "tools", "search / calc / APIs"],
    [UsersRound, "social model", "beliefs / emotion"],
    [Puzzle, "planning", "global constraints fail"]
  ] as const;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-fuchsia-300/25 bg-[#111725] shadow-[0_30px_100px_-45px_rgba(217,70,239,0.55)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-cyan-300" /></div>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600">capability probe array</span>
      </div>
      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-between"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-300">subject / early GPT-4</p><span className="font-mono text-[9px] text-amber-200">TEXT ONLY</span></div>
        <div className="relative mt-6 space-y-3">
          <div className="absolute bottom-6 left-[17px] top-6 w-px bg-gradient-to-b from-cyan-300 via-fuchsia-300 to-amber-200" />
          {probes.map(([Icon, label, value], index) => <div key={label} className="relative flex items-center gap-4 rounded-xl border border-slate-800 bg-[#0c1119] p-3.5"><div className={`z-10 grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${index === 4 ? "border-amber-200/25 bg-amber-200/10 text-amber-200" : index % 2 ? "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-300" : "border-cyan-300/25 bg-cyan-300/10 text-cyan-300"}`}><Icon size={16} /></div><div className="min-w-0 flex-1"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">probe {String(index + 1).padStart(2, "0")}</p><p className="mt-1 truncate text-sm font-black text-slate-200">{label}</p></div><p className="hidden text-right font-mono text-[10px] text-slate-500 sm:block">{value}</p></div>)}
        </div>
        <div className="mt-5 rounded-xl border border-amber-200/20 bg-amber-200/5 p-4"><div className="flex items-center justify-between"><span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">AGI inference</span><ScanSearch className="text-amber-200" size={17} /></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[72%] bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200" /></div><p className="mt-3 text-xs leading-5 text-slate-500">Broad behavioral evidence. Contested definition. Incomplete system.</p></div>
      </div>
    </div>
  );
}

export default function SparksOfAGIPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d1117] text-slate-100 selection:bg-fuchsia-300 selection:text-slate-950">
      <SiteNav />

      <header className="relative border-b border-slate-800 px-5 pb-20 pt-32 sm:px-8 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.025)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="pointer-events-none absolute right-[12%] top-28 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 left-[8%] h-56 w-56 rounded-full bg-cyan-300/10 blur-[110px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.82fr]">
          <div>
            <div className="flex flex-wrap gap-3"><EvidenceLabel>Microsoft Research / 2023</EvidenceLabel><EvidenceLabel tone="probe">155-page investigation</EvidenceLabel><EvidenceLabel tone="caveat">early model</EvidenceLabel></div>
            <p className="mt-8 font-mono text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Sparks of Artificial General Intelligence</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.01] tracking-tight sm:text-6xl md:text-7xl">Intelligence,<span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">under a microscope.</span></h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">A technical reading of the experiments behind the paper&apos;s most provocative claim: an early GPT-4 showed broad, flexible competence across domains, yet remained unreliable, stateless, and weak at global planning.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href={links.arxiv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-950 transition-colors hover:bg-white"><BookOpen size={15} /> Read paper <ExternalLink size={13} /></a><a href="#contract" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-300 transition-colors hover:border-fuchsia-300/50 hover:text-white">Audit the claim <ArrowDown size={14} /></a></div>
            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-y-6 border-y border-slate-800 py-6 sm:grid-cols-4 sm:gap-y-0"><Metric value="155" label="pages" note="experiments + appendices" /><Metric value="14" label="authors" note="Microsoft Research" tone="fuchsia" /><Metric value="100" label="fresh problems" note="post-cutoff LeetCode" /><Metric value="v5" label="paper version" note="13 April 2023" tone="amber" /></div>
          </div>
          <ProbeConsole />
        </div>
      </header>

      <nav aria-label="On this page" className="sticky top-20 z-30 border-b border-slate-800 bg-[#0d1117]/95 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">{sections.map(([href, label], index) => <a key={href} href={`#${href}`} className="shrink-0 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 transition-colors hover:bg-cyan-300/5 hover:text-cyan-300"><span className="mr-2 text-slate-800">{String(index + 1).padStart(2, "0")}</span>{label}</a>)}</div></nav>

      <section id="contract" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="01 / experiment contract" title="This is a capability investigation, not a model specification." description="The researchers did not know the full training corpus and tested a moving, pre-release, text-only GPT-4. They therefore replaced benchmark-first evaluation with novel prompts, mutations, comparisons, and deliberate searches for failure." />
          <div className="grid gap-5 lg:grid-cols-4">
            {[ [Fingerprint, "Unknown training overlap", "Assume existing benchmarks or close variants may have appeared in pretraining.", "caveat"], [RefreshCw, "Changing model", "The system was refined during the study, so responses and quantitative results are snapshots.", "caveat"], [Eye, "Behavioral access", "The study observes prompts and outputs, not weights, activations, data lineage, or training dynamics.", "probe"], [Scale, "Informal method", "The authors explicitly acknowledge subjectivity and the absence of a single rigorous AGI test.", "interpretation"] ].map(([Icon, title, body, tone]) => { const ItemIcon = Icon as typeof Fingerprint; return <div key={title as string} className="rounded-2xl border border-slate-800 bg-[#111722] p-5"><ItemIcon className={tone === "caveat" ? "text-rose-300" : tone === "probe" ? "text-fuchsia-300" : "text-amber-200"} size={20} /><h3 className="mt-5 font-black">{title as string}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{body as string}</p></div>; })}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <PaperFigure image="mosaic" title="The opening capability mosaic" caption="Figure 1.1 combines a rhyming proof, TikZ drawing, program synthesis, and functional reasoning. It establishes breadth through composed tasks, not one aggregate score." />
            <div className="space-y-6">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6"><EvidenceLabel>study loop</EvidenceLabel><div className="mt-6 grid gap-3 sm:grid-cols-5">{[ [MessageSquareText, "invent"], [Bot, "observe"], [WandSparkles, "mutate"], [TriangleAlert, "break"], [Lightbulb, "interpret"] ].map(([Icon, label], index) => { const StepIcon = Icon as typeof Bot; return <div key={label as string} className="relative rounded-xl border border-slate-800 bg-[#0d1117] p-4 text-center"><StepIcon className="mx-auto text-cyan-300" size={18} /><p className="mt-3 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">{label as string}</p>{index < 4 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-slate-700 sm:block" size={14} />}</div>; })}</div><p className="mt-5 text-sm leading-7 text-slate-400">A strong response is only the beginning. The authors alter numbers, remove code fragments, change style, demand explanations, introduce tools, and probe whether behavior remains coherent.</p></div>
              <PaperFigure image="unicorn" title="A moving experimental target" caption="Figure 1.3 shows the same TikZ prompt over roughly one month of model refinement. The improving output is evidence that the tested system was not a fixed release artifact." />
              <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><div className="flex items-center gap-3"><TriangleAlert className="text-rose-300" size={20} /><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">interpretation boundary</p></div><p className="mt-4 text-sm leading-7 text-slate-300">The paper can demonstrate surprising behavior from this early system. It cannot, by this method alone, prove human-equivalent understanding, identify a mechanism inside the network, or establish a settled definition of AGI.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="generality" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="02 / generality map" title="The central result is compositional breadth." description="The paper's case is cumulative: language becomes an interface for combining disciplines, representations, tools, and social contexts. The interesting behavior lies in transfer between domains rather than isolated task mastery." />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
            {[ [Braces, "Representation", "Translate intent into text, code, SVG, TikZ, ABC music, tables, and plots."], [Network, "Composition", "Combine mathematics with poetry, code with visualization, and sketches with image generation."], [Compass, "Interaction", "Use environment feedback, tools, APIs, and dialogue as part of a longer task."], [UsersRound, "Social inference", "Track beliefs, emotions, intentions, audience context, and explanation demands."] ].map(([Icon, title, body], index) => { const ItemIcon = Icon as typeof Braces; return <div key={title as string} className="bg-[#111722] p-6"><span className="font-mono text-[10px] text-slate-700">0{index + 1}</span><ItemIcon className={index % 2 ? "mt-8 text-fuchsia-300" : "mt-8 text-cyan-300"} size={23} /><h3 className="mt-5 font-black">{title as string}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{body as string}</p></div>; })}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><PaperFigure image="composition" title="Text-to-structure-to-visual composition" caption="Figure 2.7 shows artifacts produced through generated code. This is visual imagination expressed through a language interface, not image perception by the text-only model." /><div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/5 p-6"><EvidenceLabel tone="caveat">critical distinction</EvidenceLabel><h3 className="mt-5 text-2xl font-black">The tested model did not receive pixels.</h3><p className="mt-4 text-sm leading-7 text-slate-300">The paper&apos;s “vision” examples ask GPT-4 to generate and manipulate symbolic drawing programs such as TikZ, SVG, JavaScript, and plotting code. The authors infer a spatial or visual world model from those outputs, but the experimental interface itself is text-only.</p><div className="mt-6 flex items-center gap-3 font-mono text-xs text-slate-500"><Terminal className="text-fuchsia-300" size={17} /><span>natural language</span><ArrowRight size={13} /><span>code</span><ArrowRight size={13} /><span>rendered artifact</span></div></div></div>
        </div>
      </section>

      <section id="coding" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="03 / coding" title="Fresh problems test transfer beyond memorized benchmarks." description="The study combines HumanEval with 100 LeetCode problems posted after the model's stated pretraining period. It then expands beyond challenge solving into visualization, front-end games, machine-learning modules, reverse engineering, and code execution." />
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111722]"><div className="overflow-x-auto"><table className="min-w-[760px] w-full text-left"><thead className="border-b border-slate-800 bg-[#0b1017] font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600"><tr><th className="px-5 py-4">system</th><th className="px-5 py-4">HumanEval pass@1</th><th className="px-5 py-4">LeetCode pass@1</th><th className="px-5 py-4">LeetCode pass@5</th></tr></thead><tbody className="divide-y divide-slate-800 text-sm">{codingRows.map(row => <tr key={row[0]} className={row[4] === "highlight" ? "bg-cyan-300/[0.04]" : row[4] === "human" ? "bg-amber-200/[0.03]" : ""}><td className="px-5 py-4 font-black text-white">{row[0]}</td><td className={`px-5 py-4 font-mono ${row[4] === "highlight" ? "text-cyan-300" : "text-slate-400"}`}>{row[1]}</td><td className={`px-5 py-4 font-mono ${row[4] === "highlight" ? "text-cyan-300" : row[4] === "human" ? "text-amber-200" : "text-slate-400"}`}>{row[2]}</td><td className={`px-5 py-4 font-mono ${row[4] === "highlight" ? "text-cyan-300" : "text-slate-400"}`}>{row[3]}</td></tr>)}</tbody></table></div></div>
          <div className="mt-5 rounded-2xl border border-amber-200/20 bg-amber-200/5 p-5"><p className="text-sm leading-7 text-slate-300"><strong className="text-amber-200">Read the human comparison carefully.</strong> LeetCode&apos;s human sample excludes users who solve nothing, and the paper reports human pass@1 only. GPT-4&apos;s 38.0% overall pass@1 is comparable to the reported 38.2%, but these are not controlled human-subject experiments.</p></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2"><PaperFigure image="coding" title="HumanEval and fresh LeetCode results" caption="Tables 1 and 2. The new LeetCode set is the stronger contamination control; difficulty still matters sharply, with GPT-4 pass@1 falling from 68.2% on easy to 10.7% on hard problems." /><PaperFigure image="visualization" title="Iterative data visualization" caption="Figure 3.2 demonstrates specification following, code generation, rendered-output inspection through human feedback, and iterative correction of axes, legends, and emphasis." /></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{[ [Code2, "Generate", "Implement algorithms and focused programs from natural-language requirements."], [Eye, "Understand", "Explain code, simulate execution, reason about alignment, assembly, and pseudocode."], [RefreshCw, "Repair", "Use compiler errors and human feedback to revise generated programs over multiple turns."] ].map(([Icon, title, body]) => { const ItemIcon = Icon as typeof Code2; return <div key={title as string} className="rounded-2xl border border-slate-800 bg-[#111722] p-5"><ItemIcon className="text-fuchsia-300" size={20} /><h3 className="mt-4 font-black">{title as string}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{body as string}</p></div>; })}</div>
        </div>
      </section>

      <section id="math" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="04 / mathematics" title="Strategy improves faster than calculation reliability." description="GPT-4 often identifies a viable method, builds models, and transfers solution templates. Its dominant MATH failure in the authors' manual audit is arithmetic execution, producing a characteristic split between conceptual approach and final-answer reliability." />
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111722]"><table className="w-full text-left"><thead className="border-b border-slate-800 bg-[#0b1017] font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600"><tr><th className="px-4 py-4">model</th><th className="px-4 py-4">GSM8K</th><th className="px-4 py-4">MATH</th><th className="px-4 py-4">MMLU-STEM</th></tr></thead><tbody className="divide-y divide-slate-800 text-sm">{mathRows.map(row => <tr key={row[0]} className={row[4] === "highlight" ? "bg-fuchsia-300/[0.04]" : ""}><td className="px-4 py-4 font-black">{row[0]}</td>{row.slice(1, 4).map(value => <td key={value} className={`px-4 py-4 font-mono ${row[4] === "highlight" ? "text-fuchsia-300" : "text-slate-400"}`}>{value}</td>)}</tr>)}</tbody></table><div className="border-t border-slate-800 p-5"><p className="text-xs leading-6 text-slate-500">Single-attempt accuracy from the early model. The authors direct readers to OpenAI&apos;s technical report for definitive release-model benchmarks.</p></div></div><PaperFigure image="mathErrors" title="What goes wrong on MATH" caption="Table 4 manually classifies 100 wrong answers: 68% arithmetic or counting mistakes, 22% wrong approaches, and 10% problem misunderstanding." /></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><PaperFigure image="math" title="Mutation tests and benchmark context" caption="Figure 4.2 varies values in a polynomial problem: GPT-4 reaches 75.2% while text-davinci-003 reaches 0.2%, evidence for applying a reusable solution method rather than recalling one exact statement." /><div className="space-y-5"><div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6"><EvidenceLabel>observed pattern</EvidenceLabel><p className="mt-4 text-4xl font-black text-cyan-300">75.2%</p><p className="mt-2 font-black">mutated polynomial problems</p><p className="mt-3 text-xs leading-6 text-slate-500">The input values are randomized while the underlying method remains stable.</p></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><EvidenceLabel tone="caveat">failure profile</EvidenceLabel><p className="mt-4 text-sm leading-7 text-slate-300">A correct derivation can still terminate in a wrong number. Code execution, calculators, verification passes, or explicit decomposition can repair some failures, but the base response should not be treated as a proof checker.</p></div></div></div>
        </div>
      </section>

      <section id="tools" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="05 / tools + world interaction" title="Language becomes a control plane." description="The researchers expose search, calculation, character indexing, terminal commands, email and calendar APIs, and simulated environments through text. GPT-4 can route calls and integrate observations, but success depends on scaffolding, feedback, and explicit permission to use tools." />
          <div className="grid gap-4 md:grid-cols-5">{[ [Globe2, "SEARCH"], [Gauge, "CALC"], [Terminal, "SHELL"], [MessageSquareText, "EMAIL"], [Compass, "ENV"] ].map(([Icon, label], index) => { const ItemIcon = Icon as typeof Globe2; return <div key={label as string} className="relative rounded-2xl border border-slate-800 bg-[#111722] p-5 text-center"><ItemIcon className={`mx-auto ${index % 2 ? "text-fuchsia-300" : "text-cyan-300"}`} size={22} /><p className="mt-4 font-mono text-[10px] font-black tracking-[0.18em] text-slate-400">{label as string}</p>{index < 4 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-slate-700 md:block" size={15} />}</div>; })}</div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2"><PaperFigure image="tool" title="Minimal tool-routing demonstrations" caption="Figure 5.2 shows search for current knowledge, calculator use, and character indexing. The prompt defines tool syntax and the environment returns observations." /><PaperFigure image="email" title="Email and calendar execution" caption="Figure 5.4 combines API calls across a multi-step scheduling task, using returned IDs and state to continue the interaction." /></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]"><PaperFigure image="world" title="Interactive map reconstruction" caption="Figure 5.8 compares the true explored map with GPT-4's reconstructed representation after navigation through textual observations." /><div className="space-y-5"><div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6"><EvidenceLabel tone="probe">what the loop adds</EvidenceLabel><div className="mt-5 space-y-3">{["current information beyond the frozen weights", "exact arithmetic and executable computation", "environmental state and error feedback", "an external memory encoded in tool outputs"].map(item => <div key={item} className="flex gap-3"><Check className="mt-1 shrink-0 text-cyan-300" size={15} /><p className="text-sm leading-6 text-slate-300">{item}</p></div>)}</div></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><EvidenceLabel tone="caveat">what remains weak</EvidenceLabel><div className="mt-5 space-y-3">{["deciding when a tool is necessary", "sequencing unfamiliar functions correctly", "recovering from repeated execution patterns", "distinguishing scaffolded agency from autonomous agency"].map(item => <div key={item} className="flex gap-3"><X className="mt-1 shrink-0 text-rose-300" size={15} /><p className="text-sm leading-6 text-slate-300">{item}</p></div>)}</div></div></div></div>
        </div>
      </section>

      <section id="humans" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="06 / human models + explanations" title="Social inference is strong; introspective access is not guaranteed." description="The paper probes false belief, emotion, intention, conflict, and audience-aware explanation. It then asks a harder question: does an explanation track the process that produced an answer, or merely construct a plausible story afterward?" />
          <div className="grid gap-6 lg:grid-cols-2"><PaperFigure image="mind" title="False belief and emotional-state probes" caption="Figures 6.1 and 6.2. GPT-4 tracks what one character can know and infers emotional state from dialogue. The study also includes more realistic family and relationship scenarios." /><div className="space-y-5"><div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/5 p-6"><EvidenceLabel tone="probe">theory-of-mind evidence</EvidenceLabel><h3 className="mt-5 text-2xl font-black">Represent another agent&apos;s information state.</h3><p className="mt-4 text-sm leading-7 text-slate-300">The model separates reality from a character&apos;s belief, infers motives from puzzling actions, and proposes context-sensitive responses in social situations.</p></div><div className="rounded-2xl border border-amber-200/20 bg-amber-200/5 p-6"><EvidenceLabel tone="interpretation">scope limit</EvidenceLabel><p className="mt-4 text-sm leading-7 text-slate-300">The authors call the level advanced, but also state that the tests are neither exhaustive nor comprehensive. They do not test sarcasm, irony, humor, deception, facial expression, gesture, or tone of voice.</p></div><div className="rounded-2xl border border-slate-800 bg-[#111722] p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">three explanation standards</p><div className="mt-5 space-y-4">{[ ["Output-consistent", "The explanation supports the answer that was produced."], ["Process-consistent", "Changing the proposed reason should predictably change the output."], ["Causally faithful", "The explanation reflects the actual internal computation, which black-box dialogue cannot directly establish."] ].map(([title, body], index) => <div key={title} className="flex gap-4"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-xs font-black ${index === 2 ? "bg-rose-300/10 text-rose-300" : index === 1 ? "bg-fuchsia-300/10 text-fuchsia-300" : "bg-cyan-300/10 text-cyan-300"}`}>{index + 1}</span><div><p className="font-black">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{body}</p></div></div>)}</div></div></div></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"><PaperFigure image="consistency" title="Editing and concept-override tests" caption="Figure 6.10 tests whether a stated explanation predicts behavior. Editing the input and overriding background knowledge create observable interventions, but successful prediction is still not direct access to internal reasoning." /><div className="rounded-2xl border border-slate-800 bg-[#111722] p-6"><Fingerprint className="text-fuchsia-300" size={23} /><h3 className="mt-5 text-2xl font-black">Explanations are outputs too.</h3><p className="mt-4 text-sm leading-7 text-slate-400">Fluency, detail, and self-consistency can make an account useful without making it mechanistically faithful. The paper&apos;s intervention tests raise the standard beyond “sounds plausible,” while also documenting examples of process inconsistency.</p><div className="mt-6 rounded-xl border border-rose-300/20 bg-rose-300/5 p-4"><p className="text-xs leading-6 text-slate-300">Do not use a generated chain of thought as privileged telemetry from the model&apos;s hidden computation. Treat it as another behavior to validate.</p></div></div></div>
        </div>
      </section>

      <section id="judgment" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="07 / discrimination + truthfulness" title="Generation quality and judgment quality reinforce each other, imperfectly." description="The paper studies zero-shot PII detection, TruthfulQA, semantic similarity, and GPT-4 as an evaluator. These experiments show contextual discrimination beyond pattern rules while also exposing metric failure and self-evaluation bias." />
          <div className="grid gap-4 md:grid-cols-4"><Metric value="77.4%" label="exact PII count" note="GPT-4 on 6,764 TAB sentences" /><Metric value="40.8%" label="Presidio baseline" note="custom NER + regular expressions" tone="amber" /><Metric value="87.76%" label="self-answer picked" note="Judge GPT-4 versus GPT-3" tone="fuchsia" /><Metric value="50.8%" label="human overlap" note="unconstrained human decisions" tone="amber" /></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><PaperFigure image="truth" title="TruthfulQA comparisons" caption="Figures 7.3 and 7.4. GPT-4 improves over GPT-3 under ROUGE, BLEU, and BLEURT and across many categories, but lexical metrics can mark a semantically correct long answer as wrong." /><div className="space-y-5"><div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6"><EvidenceLabel>contextual discrimination</EvidenceLabel><p className="mt-4 text-sm leading-7 text-slate-300">On PII counting, GPT-4 can infer an implicit location from a currency mention and outperform a purpose-built detector. The task definition is broad and context-sensitive, which favors semantic world knowledge.</p></div><div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/5 p-6"><EvidenceLabel tone="probe">LLM as judge</EvidenceLabel><p className="mt-4 text-sm leading-7 text-slate-300">Judge GPT-4 compares each candidate to a reference after listing similarities and differences. When humans are forced to choose one answer, their selection closely matches the model; with “both” and “neither” available, agreement drops.</p></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><EvidenceLabel tone="caveat">evaluation leakage</EvidenceLabel><p className="mt-4 text-sm leading-7 text-slate-300">The judge selects GPT-4&apos;s own answer 87.76% of the time. That may reflect better answers, shared style, or evaluator preference. Independent judges and human rubrics are needed before interpreting self-preference as correctness.</p></div></div></div>
        </div>
      </section>

      <section id="planning" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="08 / autoregressive fault line" title="Local fluency does not guarantee global search." description="The model can satisfy constraints that are checkable while generating each next token, yet fail when an early decision must anticipate a distant requirement. The authors connect this pattern to missing backtracking, working memory, and slow deliberation." />
          <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/5 p-6 sm:p-8"><EvidenceLabel tone="interpretation">autoregressive factorization</EvidenceLabel><MathBlock formula={String.raw`p(x_{1:T}) = \prod_{t=1}^{T} p\!\left(x_t \mid x_{<t}\right)`} /><p className="mx-auto max-w-4xl text-center text-sm leading-7 text-slate-400">Each token is chosen from the prefix already written. The equation defines sequence likelihood; it does not itself prove that Transformers cannot plan. The paper&apos;s architectural diagnosis is an interpretation of observed failure patterns.</p></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2"><PaperFigure image="localGlobal" title="Local constraint success, global constraint failure" caption="The acrostic story succeeds because each next sentence can satisfy the next required letter. The reversible first/last sentence fails because the opening must be chosen with a distant ending in mind." /><PaperFigure image="planning" title="Prompting for a plan does not create reliable search" caption="The dialogue repeatedly proposes plans that violate the actual reversible-word constraint. Fluent repair language masks the absence of a valid construction." /></div>
          <div className="mt-8 grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">incremental tasks</p><p className="mt-4 text-sm leading-7 text-slate-300">Progress can be made token by token: summarization, routine procedures, a known rhyme scheme, or a standard solution template.</p></div><div className="rounded-2xl border border-amber-200/20 bg-amber-200/5 p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">discontinuous tasks</p><p className="mt-4 text-sm leading-7 text-slate-300">Success requires a conceptual leap, search, revision, or a global invariant: a novel proof idea, constrained composition, hypothesis, or non-obvious plan.</p></div></div>
          <div className="mt-6 rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><div className="flex gap-3"><FileQuestion className="mt-1 shrink-0 text-rose-300" size={19} /><p className="text-sm leading-7 text-slate-300"><strong className="text-white">Causal caution:</strong> the examples establish a behavioral weakness in this system. They do not isolate whether it comes from next-token training, decoding, prompt format, missing inference-time search, limited context, post-training, or some combination.</p></div></div>
        </div>
      </section>

      <section id="society" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="09 / societal surface" title="General capability expands both utility and attack surface." description="The paper treats social outcomes as deployment questions rather than fixed model properties. It covers erroneous generations, targeted misinformation, manipulation, bias, labor and expertise, economic concentration, and unequal access." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[ [ShieldAlert, "Persuasive error", "Confident hallucinations can be costly when users cannot verify claims."], [Target, "Targeted influence", "Generated messages can adapt framing to audiences at low marginal cost."], [UsersRound, "Bias", "Training distributions can reproduce stereotypes even when the model can discuss them."], [Globe2, "AI divide", "Access, expertise, compute, and organizational capacity may concentrate benefits."] ].map(([Icon, title, body], index) => { const ItemIcon = Icon as typeof ShieldAlert; return <div key={title as string} className="rounded-2xl border border-slate-800 bg-[#111722] p-5"><ItemIcon className={index % 2 ? "text-fuchsia-300" : "text-rose-300"} size={21} /><h3 className="mt-5 font-black">{title as string}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{body as string}</p></div>; })}</div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><PaperFigure image="bias" title="Bias recognition is not bias elimination" caption="Figure 9.4 shows GPT-4 generating multiple analogy completions and discussing their possible offensiveness. Reflective commentary does not guarantee unbiased default generations." /><div className="rounded-2xl border border-slate-800 bg-[#111722] p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">deployment stack</p><div className="mt-6 space-y-3">{[ ["model behavior", "capability, refusal, calibration, bias"], ["application design", "retrieval, verification, permissions, UX"], ["operations", "monitoring, incident response, red teaming"], ["institutions", "access rules, accountability, labor transitions"], ["users", "domain expertise, skepticism, fact-checking"] ].map(([title, body], index) => <div key={title} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#0d1117] p-4"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-xs font-black ${index % 2 ? "bg-fuchsia-300/10 text-fuchsia-300" : "bg-cyan-300/10 text-cyan-300"}`}>{index + 1}</span><div><p className="font-black">{title}</p><p className="mt-1 text-xs text-slate-500">{body}</p></div></div>)}</div></div></div>
        </div>
      </section>

      <section id="claim" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="10 / claim audit" title="“Sparks” is an interpretation of breadth, not a solved definition." description="The authors use an informal AGI frame centered on broad reasoning, planning, and learning from experience at or above human level. Their own evidence shows GPT-4 is strong on the first, uneven on the second, and largely missing the third." />
          <div className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6"><EvidenceLabel>what the paper establishes</EvidenceLabel><div className="mt-6 space-y-4">{["One text interface supports useful behavior across unusually many domains.", "Novel and mutated probes provide evidence beyond exact benchmark recall.", "Coding, math, tools, social inference, and judgment improve substantially over prior models.", "Capability remains jagged: impressive abstraction coexists with elementary arithmetic and planning failures.", "Tool scaffolds can compensate for frozen knowledge, calculation, and environmental access."].map(item => <div key={item} className="flex gap-3"><Check className="mt-1 shrink-0 text-cyan-300" size={15} /><p className="text-sm leading-7 text-slate-300">{item}</p></div>)}</div></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6"><EvidenceLabel tone="caveat">what it does not establish</EvidenceLabel><div className="mt-6 space-y-4">{["A universally accepted operational test or threshold for AGI.", "That the final deployed GPT-4 behaves like this changing early model.", "Controlled human equivalence across every domain discussed.", "A causal account of which architecture or training mechanism produces each behavior.", "Continual learning, durable memory, autonomous goals, or reliable long-horizon agency."].map(item => <div key={item} className="flex gap-3"><X className="mt-1 shrink-0 text-rose-300" size={15} /><p className="text-sm leading-7 text-slate-300">{item}</p></div>)}</div></div></div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 md:grid-cols-3">{[ ["Paper's working frame", "Reasoning, planning, and learning from experience with broad human-level capability."], ["Goal-oriented frame", "Achieve goals across a wide range of environments; raises agency and universality questions."], ["Skill-acquisition frame", "Acquire new skills efficiently from experience; directly exposes a weakness of fixed LLMs."] ].map(([title, body], index) => <div key={title} className="bg-[#111722] p-6"><p className={`font-mono text-[10px] font-black uppercase tracking-[0.18em] ${index === 0 ? "text-cyan-300" : index === 1 ? "text-fuchsia-300" : "text-amber-200"}`}>definition {index + 1}</p><h3 className="mt-4 font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{body}</p></div>)}</div>
          <div className="mt-8 rounded-2xl border border-amber-200/20 bg-amber-200/5 p-6"><div className="flex items-start gap-4"><Lightbulb className="mt-1 shrink-0 text-amber-200" size={22} /><div><p className="font-black text-amber-100">The strongest defensible reading</p><p className="mt-3 text-sm leading-7 text-slate-300">The paper documents a qualitative regime change in general-purpose language-model behavior. Calling that change an early form of AGI depends on the definition one adopts; the behavioral evidence is more durable than the label.</p></div></div></div>
        </div>
      </section>

      <section id="agenda" className="scroll-mt-36 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="11 / research agenda" title="The missing pieces become the roadmap." description="The conclusion turns the observed failures into a systems agenda: calibrated uncertainty, persistent state, adaptation, deliberate search, stronger verification, and architectures that can revise rather than only continue." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{limitationRows.map(([title, body], index) => <div key={title} className="rounded-2xl border border-slate-800 bg-[#111722] p-5"><div className="flex items-center justify-between"><CircleGauge className={index % 3 === 0 ? "text-cyan-300" : index % 3 === 1 ? "text-fuchsia-300" : "text-amber-200"} size={19} /><span className="font-mono text-[10px] text-slate-700">{String(index + 1).padStart(2, "0")}</span></div><h3 className="mt-4 font-black">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{body}</p></div>)}</div>
          <div className="mt-10 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/5 p-6 sm:p-8"><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-300">proposed system extensions</p><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{[ [Wrench, "External tools", "Calculators, retrieval, databases, code execution, and verifiers."], [BrainCircuit, "Slow thinking", "A controller that searches, checks, revises, and uses next-token prediction as a subroutine."], [Database, "Long-term memory", "Persistent context beyond a transient token window."], [Network, "Hierarchical generation", "Plan ideas, paragraphs, and structure before committing token by token."] ].map(([Icon, title, body]) => { const ItemIcon = Icon as typeof Wrench; return <div key={title as string}><ItemIcon className="text-fuchsia-300" size={21} /><h3 className="mt-4 font-black">{title as string}</h3><p className="mt-3 text-xs leading-6 text-slate-400">{body as string}</p></div>; })}</div></div>
          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.82fr]"><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">reading checkpoint</p><h3 className="mt-3 text-3xl font-black">You can now separate the experiments from the headline.</h3><div className="mt-6 grid gap-3 sm:grid-cols-2">{["identify the exact early-model scope", "explain the authors' probe methodology", "read coding and math results with controls", "trace language into tool and world interaction", "distinguish social inference from inner access", "audit the autoregressive planning claim", "interpret LLM-as-judge results cautiously", "state what the AGI evidence cannot prove"].map(item => <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#111722] p-4"><ChevronRight className="mt-0.5 shrink-0 text-cyan-300" size={15} /><span className="text-sm leading-6 text-slate-400">{item}</span></div>)}</div></div><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">primary sources</p><div className="mt-4 space-y-3"><SourceLink href={links.arxiv}>Official arXiv abstract</SourceLink><SourceLink href={links.pdf}>Version 5 PDF</SourceLink><SourceLink href={links.source}>TeX source package</SourceLink><SourceLink href={links.doi}>arXiv DOI record</SourceLink></div><div className="mt-7 rounded-2xl border border-slate-800 bg-[#111722] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">paper</p><p className="mt-2 text-sm font-black leading-6 text-slate-300">Sparks of Artificial General Intelligence: Early experiments with GPT-4</p><p className="mt-3 text-xs leading-6 text-slate-600">{authors}. Microsoft Research. Submitted 22 March 2023; version 5 revised 13 April 2023.</p></div></div></div>
          <PaperTimelineNav older={{ href: "/resources/gpt-4", title: "GPT-4 Technical Report", year: 2023 }} newer={{ href: "/resources/llada", title: "LLaDA", year: 2025 }} />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
