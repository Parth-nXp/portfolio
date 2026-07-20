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
  BookOpen,
  BrainCircuit,
  Braces,
  Check,
  Cpu,
  Database,
  ExternalLink,
  Filter,
  Gauge,
  GitBranch,
  Globe2,
  GraduationCap,
  Layers3,
  MessageSquareText,
  Network,
  ScanSearch,
  Sparkles,
  Target,
  TriangleAlert,
  Workflow,
  X,
  Zap
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  abstract: "https://arxiv.org/abs/2005.14165",
  pdf: "https://arxiv.org/pdf/2005.14165"
};

export const metadata: Metadata = {
  title: "GPT-3: A Complete Technical Deep Dive",
  description:
    "A visual reconstruction of GPT-3: 175B-parameter scaling, in-context learning, training data and compute, few-shot evaluation, benchmark results, synthetic tasks, contamination, and limitations."
};

const sections = [
  ["thesis", "Thesis"],
  ["protocol", "Protocol"],
  ["architecture", "Architecture"],
  ["data", "Data"],
  ["training", "Training"],
  ["scaling", "Scaling"],
  ["benchmarks", "Benchmarks"],
  ["synthetic", "Synthetic tasks"],
  ["generation", "Generation"],
  ["contamination", "Contamination"],
  ["limits", "Limits"]
];

const models = [
  ["Small", "125M", "12", "768", "12", "64", "0.5M", "6.0e-4"],
  ["Medium", "350M", "24", "1,024", "16", "64", "0.5M", "3.0e-4"],
  ["Large", "760M", "24", "1,536", "16", "96", "0.5M", "2.5e-4"],
  ["XL", "1.3B", "24", "2,048", "24", "128", "1M", "2.0e-4"],
  ["2.7B", "2.7B", "32", "2,560", "32", "80", "1M", "1.6e-4"],
  ["6.7B", "6.7B", "32", "4,096", "32", "128", "2M", "1.2e-4"],
  ["13B", "13.0B", "40", "5,140", "40", "128", "2M", "1.0e-4"],
  ["GPT-3", "175B", "96", "12,288", "96", "128", "3.2M", "0.6e-4"]
];

const datasetRows = [
  ["Filtered Common Crawl", "410B", "60%", "0.44"],
  ["WebText2", "19B", "22%", "2.9"],
  ["Books1", "12B", "8%", "1.9"],
  ["Books2", "55B", "8%", "0.43"],
  ["Wikipedia", "3B", "3%", "3.4"]
];

const trainingRows = [
  ["Tokens", "300 billion"],
  ["Context", "2,048 tokens"],
  ["Optimizer", "Adam, beta1 = 0.9, beta2 = 0.95, epsilon = 1e-8"],
  ["Gradient clip", "global norm 1.0"],
  ["Weight decay", "0.1"],
  ["Warmup", "375 million tokens"],
  ["LR schedule", "cosine decay to 10% over 260B tokens"],
  ["Batch ramp", "32K to full size over first 4B-12B tokens"],
  ["Packing", "full 2,048-token sequences separated by end-of-text"],
  ["Hardware", "V100 GPUs on a Microsoft high-bandwidth cluster"]
];

const evaluationModes = [
  {
    label: "Zero-shot",
    key: "K = 0",
    context: "task instruction",
    target: "unseen query",
    benefit: "No task examples",
    cost: "Format can remain ambiguous",
    icon: MessageSquareText
  },
  {
    label: "One-shot",
    key: "K = 1",
    context: "instruction + one solved example",
    target: "unseen query",
    benefit: "Clarifies expected format",
    cost: "One example can mislead",
    icon: Target
  },
  {
    label: "Few-shot",
    key: "K > 1",
    context: "instruction + K demonstrations",
    target: "unseen query",
    benefit: "Exposes the latent task",
    cost: "Limited by the 2,048-token window",
    icon: GraduationCap
  }
];

const headlineResults = [
  {
    task: "LAMBADA",
    score: "86.4%",
    setting: "few-shot accuracy",
    comparison: "Previous result: 68.0%",
    read: "Examples convert open continuation into an explicit one-word cloze format.",
    tone: "sky"
  },
  {
    task: "TriviaQA",
    score: "71.2%",
    setting: "few-shot exact match",
    comparison: "RAG open-domain result: 68.0%",
    read: "Strong closed-book factual recall, with smooth gains from zero to one to few-shot.",
    tone: "amber"
  },
  {
    task: "CoQA",
    score: "85.0 F1",
    setting: "few-shot reading comprehension",
    comparison: "Fine-tuned result: 90.7 F1",
    read: "The strongest reading result; free-form conversational output fits the causal interface.",
    tone: "sky"
  },
  {
    task: "SuperGLUE",
    score: "71.8",
    setting: "few-shot aggregate",
    comparison: "BERT-Large: 69.0",
    read: "No updates and 32 context examples, but large variation across component tasks.",
    tone: "amber"
  },
  {
    task: "Fr -> En",
    score: "39.2 BLEU",
    setting: "few-shot translation",
    comparison: "Prior supervised result: 35.0",
    read: "Translation into English is consistently stronger than translation out of English.",
    tone: "sky"
  },
  {
    task: "News detection",
    score: "52%",
    setting: "human detection accuracy",
    comparison: "Chance: 50%; bad control: 86%",
    read: "Short generated news became difficult for evaluators to distinguish from human text.",
    tone: "amber"
  }
];

const qaRows = [
  ["Natural Questions", "14.6", "23.0", "29.9", "36.6"],
  ["WebQuestions", "14.4", "25.3", "41.5", "44.7"],
  ["TriviaQA", "64.3", "68.0", "71.2", "68.0"]
];

const readingRows = [
  ["CoQA", "81.5", "84.0", "85.0", "90.7"],
  ["DROP", "23.6", "34.3", "36.5", "89.1"],
  ["QuAC", "41.5", "43.3", "44.3", "74.4"],
  ["SQuADv2", "59.5", "65.4", "69.8", "93.0"],
  ["RACE-h", "45.5", "45.9", "46.8", "90.0"],
  ["RACE-m", "58.4", "57.4", "58.1", "93.1"]
];

const arithmeticRows = [
  ["2D+", "76.9", "99.6", "100.0"],
  ["2D-", "58.0", "86.4", "98.9"],
  ["3D+", "34.2", "65.5", "80.4"],
  ["3D-", "48.3", "78.7", "94.2"],
  ["4D+", "4.0", "14.0", "25.5"],
  ["4D-", "7.5", "14.0", "26.8"],
  ["5D+", "0.7", "3.5", "9.3"],
  ["5D-", "0.8", "3.8", "9.9"],
  ["2Dx", "19.8", "27.4", "29.2"],
  ["1D composite", "9.8", "14.3", "21.3"]
];

const superglueRows = [
  ["BoolQ", "76.4", "69.0", "89.0"],
  ["CB accuracy", "75.6", "77.4", "91.0"],
  ["COPA", "92.0", "75.7", "93.9"],
  ["RTE", "69.0", "70.6", "94.8"],
  ["WiC", "49.4", "69.6", "76.1"],
  ["WSC", "80.1", "64.6", "93.8"],
  ["MultiRC F1a", "75.4", "70.0", "88.2"],
  ["ReCoRD F1", "91.1", "72.0", "93.3"]
];

const contaminationCases = [
  ["PIQA", "29% flagged", "3-point drop", "Result marked with an asterisk; statistical selection bias could not be ruled out."],
  ["Winograd", "45% flagged", "2.6-point drop", "132 schemas occurred in training in a different format; result marked with an asterisk."],
  ["LAMBADA", "genuine overlap", "<0.5-point shift", "Substantial overlap existed, but the cleaned subset remained close to the full score."],
  ["Reading sets", ">90% flagged", "questions absent", "Source passages appeared in training, but inspected question-answer pairs did not."],
  ["WMT16 De-En", "25% flagged", "1-2 BLEU", "Matches were monolingual news fragments rather than paired translation examples."],
  ["Wikipedia LMs", "nearly complete", "not reported", "Four Wikipedia benchmarks and CBT were omitted because a clean evaluation was impossible."]
];

const formulas = {
  outer: String.raw`\mathcal{L}_{\mathrm{pretrain}}(\theta)=-\sum_{t=1}^{T}\log p_{\theta}(x_t\mid x_{<t})`,
  inner: String.raw`p_{\theta}\!\left(y_{K+1}\mid x_1,y_1,\ldots,x_K,y_K,x_{K+1}\right)`,
  noUpdate: String.raw`\theta_{\mathrm{test}}=\theta_{\mathrm{pretrain}},\qquad \Delta\theta=0`,
  attention: String.raw`\operatorname{Attn}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_h}}+M_{\mathrm{causal}}+M_{\mathrm{sparse}}\right)V`,
  ff: String.raw`d_{\mathrm{ff}}=4d_{\mathrm{model}}=49{,}152`,
  compute: String.raw`C\approx 6ND=6\,(1.746\times10^{11})(3\times10^{11})\approx3.14\times10^{23}\ \mathrm{FLOPs}`,
  scaling: String.raw`L(C)\approx L_{\infty}+aC^{-\alpha}`,
  context: String.raw`\mathcal{P}_K=[I;\,(x_1,y_1);\ldots;(x_K,y_K);\,x_{K+1}]`,
  clean: String.raw`\Delta_{\mathrm{clean}}=\operatorname{score}(D_{\mathrm{clean}})-\operatorname{score}(D_{\mathrm{all}})`
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
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-sky-300">{eyebrow}</p>
      <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 break-words text-base leading-8 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

function Equation({
  label,
  formula,
  note,
  tone = "sky"
}: {
  label: string;
  formula: string;
  note?: ReactNode;
  tone?: "sky" | "amber" | "rose";
}) {
  const tones = {
    sky: "border-sky-300/20 bg-sky-300/5 text-sky-50",
    amber: "border-amber-200/20 bg-amber-200/5 text-amber-50",
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
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">{label}</p>
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
      className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-sky-300 transition-colors hover:text-white"
    >
      {children} <ExternalLink size={13} />
    </a>
  );
}

function ResultTable({
  title,
  rows,
  headers,
  highlightIndex
}: {
  title: string;
  rows: string[][];
  headers: string[];
  highlightIndex?: number;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
      <div className="border-b border-slate-800 px-6 py-5">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-[#0b1119] font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
            <tr>{headers.map((head) => <th key={head} className="px-5 py-4 font-bold">{head}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((row) => (
              <tr key={row[0]} className="transition-colors hover:bg-white/[0.02]">
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className={`px-5 py-4 ${index === 0 ? "font-bold text-slate-200" : index === (highlightIndex ?? row.length - 2) ? "font-black text-sky-300" : "font-mono text-slate-500"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GPT3Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] font-sans text-white selection:bg-sky-500/30">
      <SiteNav />

      <header className="relative border-b border-slate-800/80 px-6 pb-20 pt-32 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute left-[8%] top-20 h-80 w-80 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[10%] top-32 h-80 w-80 rounded-full bg-amber-300/[0.07] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <Link href="/resources" className="mb-10 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-sky-300">
            <ArrowLeft size={14} /> Resource library
          </Link>

          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-200">
                  Paper 04 / 2020
                </span>
                <span className="font-mono text-xs text-slate-500">arXiv:2005.14165</span>
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">
                Language Models Are
                <span className="mt-2 block bg-gradient-to-r from-sky-300 via-blue-400 to-amber-200 bg-clip-text text-transparent">
                  Few-Shot Learners
                </span>
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400 md:text-xl">
                GPT-3 scales a causal language model to 175 billion parameters and asks whether a frozen model can infer a new task
                from instructions and demonstrations placed directly in its context.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
                <SourceLink href={links.abstract}>arXiv abstract</SourceLink>
                <SourceLink href={links.pdf}>Read the paper</SourceLink>
              </div>

              <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["175B", "parameters"],
                  ["300B", "training tokens"],
                  ["2,048", "context tokens"],
                  ["0", "test-time updates"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-800 bg-[#101722]/90 p-4">
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="overflow-hidden rounded-3xl border border-sky-300/20 bg-[#101722] shadow-[0_30px_100px_-52px_rgba(56,189,248,0.9)]">
                <div className="flex items-center justify-between border-b border-slate-800 bg-[#0b1119] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">context_compiler.log</span>
                </div>

                <div className="space-y-4 p-5 sm:p-7">
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
                    <span className="text-sky-300">$</span> run --mode few-shot --updates 0
                  </div>
                  <div className="space-y-3 rounded-2xl border border-slate-800 bg-[#0b1119] p-5 font-mono text-xs">
                    {[
                      ["demo_01", "sea otter -> loutre de mer"],
                      ["demo_02", "cheese -> fromage"],
                      ["query", "hello ->"]
                    ].map(([key, value], index) => (
                      <div key={key} className="grid grid-cols-[72px_1fr] gap-3">
                        <span className={index === 2 ? "text-amber-200" : "text-slate-600"}>{key}</span>
                        <span className={index === 2 ? "text-sky-200" : "text-slate-300"}>{value}</span>
                      </div>
                    ))}
                    <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-4 text-amber-100">
                      <Sparkles size={15} className="text-amber-200" /> bonjour
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="rounded-xl border border-sky-300/20 bg-sky-300/5 p-4 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-sky-300">outer loop</p>
                      <p className="mt-2 text-sm font-bold">learn weights</p>
                    </div>
                    <ArrowRight className="text-slate-700" size={18} />
                    <div className="rounded-xl border border-amber-200/20 bg-amber-200/5 p-4 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-amber-200">inner loop</p>
                      <p className="mt-2 text-sm font-bold">infer task</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    <span>theta frozen</span><span className="text-sky-300">context adapted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-16 z-30 border-b border-slate-800/90 bg-[#0d1117]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-6 py-4 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
          {sections.map(([href, label], index) => (
            <a key={href} href={`#${href}`} className="flex shrink-0 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-sky-300">
              <span className="text-slate-700">{String(index + 1).padStart(2, "0")}</span> {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="thesis" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="01 / Thesis"
            title="Learning happens at two different timescales"
            description="Pre-training changes the weights over hundreds of billions of tokens. In-context learning changes no weights at all: demonstrations inside one forward-pass context steer the frozen model toward a task-specific input-output mapping."
          />

          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-5">
              <div className="rounded-3xl border border-sky-300/20 bg-sky-300/[0.04] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-300/10 text-sky-300"><GitBranch size={23} /></div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">outer loop</span>
                </div>
                <h3 className="mt-6 text-2xl font-black">Gradient descent builds a repertoire</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">Across the mixed web corpus, next-token prediction encodes patterns for language, formats, facts, and recurring tasks into the parameters.</p>
              </div>
              <div className="rounded-3xl border border-amber-200/20 bg-amber-200/[0.04] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-200/10 text-amber-200"><BrainCircuit size={23} /></div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200">inner loop</span>
                </div>
                <h3 className="mt-6 text-2xl font-black">The prefix selects and configures a behavior</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">At inference time, the model recognizes the relation in K examples and continues the pattern for a new input without backpropagation.</p>
              </div>
            </div>

            <FigureCard
              src="/images/resources/gpt-3/meta-learning.png"
              width={1416}
              height={465}
              label="paper figure 1.1"
              title="Language-model meta-learning"
              caption="The horizontal arrow is ordinary unsupervised pre-training. Each sequence then contains its own vertical inner loop: demonstrations define a local pattern that the same fixed model continues."
            />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["Task-agnostic weights", "One parameter set is reused for translation, QA, cloze, reasoning, and synthetic transformations.", Layers3],
              ["Text as an API", "Instructions and examples become the task interface instead of a new output head.", Braces],
              ["Scale as the lever", "The paper tests whether larger models exploit demonstrations more effectively.", Gauge]
            ].map(([title, text, Icon]) => {
              const CardIcon = Icon as typeof Layers3;
              return <div key={String(title)} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><CardIcon className="text-sky-300" size={20} /><p className="mt-5 font-black">{String(title)}</p><p className="mt-2 text-sm leading-6 text-slate-500">{String(text)}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section id="protocol" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="02 / Evaluation protocol"
            title="Fine-tuning is replaced by context construction"
            description="For each evaluation example, the authors sample K demonstrations from the task training set, separate them with newlines, append the query, and score the completion. K varies by task and by how many examples fit inside 2,048 tokens."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {evaluationModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <article key={mode.label} className="rounded-3xl border border-slate-800 bg-[#101722] p-6">
                  <div className="flex items-start justify-between gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/5 text-sky-300"><Icon size={20} /></div><span className="font-mono text-xs font-black text-amber-200">{mode.key}</span></div>
                  <h3 className="mt-6 text-xl font-black">{mode.label}</h3>
                  <div className="mt-5 rounded-xl border border-slate-800 bg-[#0b1119] p-4 font-mono text-xs leading-6"><p className="text-slate-500">{mode.context}</p><p className="mt-2 text-sky-200">{mode.target} -&gt; completion</p></div>
                  <p className="mt-5 flex gap-2 text-sm text-slate-300"><Check className="mt-0.5 shrink-0 text-sky-300" size={16} />{mode.benefit}</p>
                  <p className="mt-3 flex gap-2 text-sm text-slate-500"><X className="mt-0.5 shrink-0 text-rose-300" size={16} />{mode.cost}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <FigureCard
              src="/images/resources/gpt-3/evaluation-settings.png"
              width={1416}
              height={1071}
              label="paper figure 2.1"
              title="Zero-, one-, and few-shot versus fine-tuning"
              caption="Only fine-tuning performs gradient updates. The other three settings differ solely in how much task evidence appears before the final query."
            />
            <div className="space-y-5">
              <Equation label="prompt serialization" formula={formulas.context} tone="amber" note="I is an optional instruction. Each solved pair is copied into the model context, followed by the unsolved query." />
              <Equation label="in-context prediction" formula={formulas.inner} note="The model predicts the next answer conditional on K solved examples. This is ordinary causal conditioning, even though its behavior resembles learning." />
              <Equation label="no test-time optimization" formula={formulas.noUpdate} tone="rose" note="The parameter vector is identical before and after every benchmark example. Adaptation exists in activations and attention state, not in the weights." />
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="03 / Architecture"
            title="A GPT-2 decoder expanded across depth and width"
            description="GPT-3 keeps GPT-2's pre-normalized causal Transformer and reversible byte-level BPE. The main architectural addition is alternating dense attention with locally banded sparse attention, while model parallelism spans both matrix width and layer depth."
          />

          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="rounded-3xl border border-sky-300/20 bg-[#101722] p-6 sm:p-8">
              <div className="flex items-center justify-between"><p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-sky-300">175B data path</p><Cpu size={22} className="text-slate-600" /></div>
              <div className="mx-auto mt-8 max-w-lg space-y-3 text-center">
                <div className="rounded-xl border border-sky-300/20 bg-sky-300/5 px-4 py-3 font-mono text-sm text-sky-200">byte-BPE tokens + positions</div>
                <ArrowDown className="mx-auto text-slate-700" size={18} />
                <div className="space-y-2 rounded-2xl border border-amber-200/20 bg-amber-200/[0.03] p-4">
                  <div className="rounded-xl border border-slate-700 bg-[#0b1119] px-4 py-3 text-sm font-bold">pre-LN -&gt; dense causal attention</div>
                  <div className="rounded-xl border border-slate-700 bg-[#0b1119] px-4 py-3 text-sm font-bold">pre-LN -&gt; locally banded sparse attention</div>
                  <div className="rounded-xl border border-slate-700 bg-[#0b1119] px-4 py-3 text-sm font-bold">4x-width MLP + residual paths</div>
                  <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200">alternate attention / repeat x 96</p>
                </div>
                <ArrowDown className="mx-auto text-slate-700" size={18} />
                <div className="rounded-xl border border-sky-300/20 bg-sky-300/5 px-4 py-3 font-mono text-sm text-sky-200">final LN -&gt; 50,257-token logits</div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {[["12,288", "model width"], ["49,152", "MLP width"], ["96", "attention heads"], ["128", "head width"]].map(([value,label]) => <div key={label} className="rounded-xl border border-slate-800 bg-[#0b1119] p-4"><p className="text-xl font-black text-amber-200">{value}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-600">{label}</p></div>)}
              </div>
            </div>

            <div className="space-y-5">
              <Equation label="alternating sparse attention" formula={formulas.attention} note="The causal mask blocks future tokens. The sparse mask restricts selected layers to a local band, lowering attention cost while dense layers retain global communication." />
              <Equation label="feed-forward expansion" formula={formulas.ff} tone="amber" note="Every Transformer MLP expands to four times the residual width before projecting back to d_model." />
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["96 blocks", "depth-parallel execution", Layers3],
                  ["175B weights", "width-parallel matrix multiplies", Network],
                  ["2,048 tokens", "shared training and test window", BookOpen],
                  ["3.2M tokens", "largest-model batch", Database]
                ].map(([title,text,Icon]) => {const CardIcon=Icon as typeof Layers3;return <div key={String(title)} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><CardIcon className="text-sky-300" size={19} /><p className="mt-4 font-black">{String(title)}</p><p className="mt-1 text-sm text-slate-500">{String(text)}</p></div>;})}
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">paper table 2.1 reconstructed</p><h3 className="mt-2 text-xl font-black">The eight-model scaling ladder</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-[#0b1119] font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><tr>{["Model","Params","Layers","d_model","Heads","d_head","Batch tokens","Peak LR"].map(h=><th key={h} className="px-5 py-4 font-bold">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-800">{models.map((row)=><tr key={row[0]} className={row[0]==="GPT-3"?"bg-sky-300/[0.04]":""}>{row.map((cell,index)=><td key={`${row[0]}-${index}`} className={`px-5 py-4 ${index===0?"font-bold text-slate-200":index===1?"font-black text-sky-300":"font-mono text-slate-500"}`}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="data" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="04 / Training corpus"
            title="Quality-weighted sampling, not proportional sampling"
            description="The raw Common Crawl source begins at 45 TB compressed and falls to 570 GB after filtering. Curated sources are deliberately oversampled, so a small corpus such as Wikipedia exerts more influence per token than its raw size would imply."
          />

          <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8">
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-sky-300">data pipeline</p>
              <div className="mt-7 space-y-4">
                {[
                  ["01", "Filter", "Train a quality classifier using WebText and curated corpora as positive examples.", Filter],
                  ["02", "Resample", "Keep higher-scoring Common Crawl documents with greater probability.", Activity],
                  ["03", "Fuzzy deduplicate", "Remove near-duplicate documents within and across sources.", Binary],
                  ["04", "Mix", "Oversample WebText2, Books1, and Wikipedia relative to their size.", Workflow]
                ].map(([index,title,text,Icon])=>{const CardIcon=Icon as typeof Filter;return <div key={String(index)} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-slate-800 bg-[#0b1119] p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/5 text-sky-300"><CardIcon size={18}/></div><div><p className="font-mono text-[10px] uppercase tracking-wider text-amber-200">{String(index)} / {String(title)}</p><p className="mt-2 text-sm leading-6 text-slate-500">{String(text)}</p></div></div>;})}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
              <div className="grid grid-cols-[1fr_0.7fr_0.7fr_0.65fr] border-b border-slate-800 bg-[#0b1119] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>Source</span><span>Tokens</span><span>Mix</span><span>Epochs</span></div>
              <div className="divide-y divide-slate-800">{datasetRows.map(([source,tokens,mix,epochs])=><div key={source} className="grid grid-cols-[1fr_0.7fr_0.7fr_0.65fr] items-center px-5 py-5 text-sm"><span className="font-bold text-slate-300">{source}</span><span className="font-mono text-slate-500">{tokens}</span><span className="font-mono font-black text-sky-300">{mix}</span><span className="font-mono text-amber-200">{epochs}</span></div>)}</div>
              <div className="border-t border-slate-800 p-5 text-sm leading-7 text-slate-500">The listed weights sum to 101% because the table reports rounded percentages.</div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-amber-200/20 bg-amber-200/[0.04] p-6 sm:p-8">
              <Globe2 className="text-amber-200" size={25}/><h3 className="mt-5 text-2xl font-black">The central trade-off</h3><p className="mt-4 text-sm leading-7 text-slate-400">Higher-quality sources are repeated up to 3.4 times, accepting some overfitting in exchange for a stronger training distribution. Common Crawl and Books2 remain below one epoch.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">{[["45 TB","raw crawl"],["570 GB","filtered crawl"],["41","monthly shards"],["2016-19","crawl period"]].map(([v,l])=><div key={l} className="rounded-xl border border-slate-800 bg-[#0b1119] p-4"><p className="text-xl font-black text-sky-300">{v}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-600">{l}</p></div>)}</div>
            </div>
            <FigureCard src="/images/resources/gpt-3/training-compute.png" width={1416} height={726} label="paper figure 2.2" title="Compute used during pre-training" caption="GPT-3 175B reaches roughly 3,640 PF-days, over an order of magnitude above GPT-3 13B. The comparison also shows that parameter count alone does not determine total training compute; token count matters equally." />
          </div>
        </div>
      </section>

      <section id="training" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="05 / Optimization" title="One causal loss, 300 billion token updates" description="Every model is trained for the same token budget. Larger models use larger batches and smaller peak learning rates, with gradient-noise measurements guiding the batch choice." />

          <div className="grid gap-5 lg:grid-cols-2">
            <Equation label="outer-loop language-model loss" formula={formulas.outer} note="The objective does not explicitly distinguish instructions, demonstrations, labels, facts, or prose. Every token contributes equally to next-token log-likelihood." />
            <Equation label="approximate training compute" formula={formulas.compute} tone="amber" note="Using the appendix approximation C = 6ND gives 3.14e23 FLOPs, or about 3,640 petaFLOP/s-days. Attention FLOPs are ignored because they are estimated below 10% of total compute." />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]"><div className="border-b border-slate-800 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">optimizer sheet</div><div className="divide-y divide-slate-800">{trainingRows.map(([label,value])=><div key={label} className="grid grid-cols-[0.75fr_1.25fr] gap-4 px-6 py-4 text-sm"><span className="text-slate-500">{label}</span><span className="font-bold text-slate-200">{value}</span></div>)}</div></div>
            <div className="space-y-5">
              {[
                ["0 -> 375M", "linear learning-rate warmup", "w-1/4"],
                ["375M -> 260B", "cosine decay toward 10%", "w-3/4"],
                ["260B -> 300B", "hold 10% learning rate", "w-full"]
              ].map(([range,label,width],index)=><div key={range} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><div className="flex items-center justify-between gap-4"><span className="font-mono text-xs font-black text-sky-300">{range}</span><span className="text-sm text-slate-400">{label}</span></div><div className="mt-4 h-1.5 rounded-full bg-slate-800"><div className={`h-full rounded-full bg-gradient-to-r ${index===2?"from-amber-200 to-sky-300":"from-sky-300 to-blue-500"} ${width}`} /></div></div>)}
              <div className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.04] p-5"><p className="font-black">Sequence packing</p><p className="mt-3 text-sm leading-7 text-slate-500">Short documents share a full 2,048-token sequence and are separated by an end-of-text token. No special cross-document attention mask is added; the model learns that the segments are unrelated.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="scaling" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="06 / Scaling" title="Loss follows compute; in-context learning follows capacity" description="Validation loss extends the existing power-law trend by roughly two orders of magnitude. More importantly, the gap between zero-shot and few-shot often widens with scale, showing that larger models extract more value from the same demonstrations." />
          <Equation label="empirical scaling-law form" formula={formulas.scaling} tone="amber" note="The fitted exponent is small, so each constant-factor improvement in loss demands a large multiplicative increase in compute. Smooth loss scaling does not imply every downstream capability scales smoothly." />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <FigureCard src="/images/resources/gpt-3/power-law-scaling.png" width={1416} height={765} label="paper figure 3.1" title="Validation loss follows a power law in compute" caption="Models from roughly 100K to 175B parameters stay close to one fitted curve. GPT-3 extends the observed regime without a sharp saturation point in validation loss." />
            <FigureCard src="/images/resources/gpt-3/aggregate-benchmarks.png" width={1416} height={648} label="paper figure 1.3" title="Few-shot gains accelerate with model size" caption="The aggregate spans 42 accuracy-denominated benchmarks and is not itself a rigorous benchmark. Its useful signal is the changing gap: few-shot improves faster than zero-shot as model size grows." />
          </div>

          <div className="mt-6 rounded-3xl border border-sky-300/20 bg-sky-300/[0.04] p-6 sm:p-8"><div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center"><Zap className="text-sky-300" size={28}/><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">the paper&apos;s key diagnostic</p><h3 className="mt-2 text-xl font-black">Does K become more useful when N becomes larger?</h3><p className="mt-3 text-sm leading-7 text-slate-400">If examples only provided extra text, the gain from K demonstrations would not systematically strengthen with model capacity. The widening few-shot gap is evidence that scale improves pattern recognition inside the context.</p></div><div className="rounded-xl border border-slate-800 bg-[#0b1119] px-5 py-4 font-mono text-xs text-amber-200">d score / dK rises with N</div></div></div>
        </div>
      </section>

      <section id="benchmarks" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="07 / Results" title="Strong transfer, uneven task fit" description="GPT-3 is competitive on cloze, factual QA, translation into English, CoQA, COPA, and ReCoRD. It remains weak on comparison-heavy tasks, difficult reading comprehension, and several benchmarks where bidirectional encoding or specialized supervision is advantageous." />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {headlineResults.map((result)=><article key={result.task} className="flex flex-col rounded-3xl border border-slate-800 bg-[#101722] p-6"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">{result.setting}</p><h3 className="mt-2 text-lg font-black">{result.task}</h3></div><span className={`text-right text-2xl font-black ${result.tone==="sky"?"text-sky-300":"text-amber-200"}`}>{result.score}</span></div><p className="mt-5 border-t border-slate-800 pt-5 text-sm font-bold text-slate-300">{result.comparison}</p><p className="mt-3 flex-1 text-sm leading-7 text-slate-500">{result.read}</p></article>)}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <ResultTable title="closed-book QA / exact match" headers={["Dataset","Zero","One","Few","Prior tuned"]} rows={qaRows} />
            <ResultTable title="reading comprehension / F1 or accuracy" headers={["Dataset","Zero","One","Few","Tuned SOTA"]} rows={readingRows} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <FigureCard src="/images/resources/gpt-3/triviaqa-scaling.png" width={1416} height={681} label="paper figure 3.3" title="TriviaQA knowledge scales smoothly" caption="Zero-, one-, and few-shot curves all improve with parameter count. At 175B, one-shot matches the paper's RAG reference and few-shot exceeds it without retrieval or task fine-tuning." />
            <FigureCard src="/images/resources/gpt-3/superglue-context.png" width={1416} height={672} label="paper figure 3.8" title="SuperGLUE improves with model size and K" caption="The right panel isolates in-context learning at 175B: fewer than eight demonstrations per task are enough to exceed the fine-tuned BERT-Large aggregate on the development evaluation used for the curve." />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <ResultTable title="SuperGLUE component scores" headers={["Task","GPT-3 few","BERT-L","Tuned SOTA"]} rows={superglueRows} highlightIndex={1} />
            <div className="space-y-5">
              <div className="rounded-3xl border border-sky-300/20 bg-sky-300/[0.04] p-6"><Check className="text-sky-300" size={21}/><h3 className="mt-5 text-xl font-black">Where the interface works</h3><p className="mt-3 text-sm leading-7 text-slate-400">COPA reaches 92.0 and ReCoRD reaches 91.1 F1. Both can be expressed naturally as completion or selection problems.</p></div>
              <div className="rounded-3xl border border-rose-300/20 bg-rose-300/[0.04] p-6"><X className="text-rose-300" size={21}/><h3 className="mt-5 text-xl font-black">Where it breaks</h3><p className="mt-3 text-sm leading-7 text-slate-400">WiC remains at 49.4%, near random chance. ANLI and comparison-heavy tasks also expose the cost of a unidirectional, completion-first interface.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="synthetic" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="08 / Synthetic probes" title="Can the model infer a task unlikely to exist in pre-training?" description="Arithmetic and character transformations are designed to separate task recognition from benchmark familiarity. They reveal striking 175B jumps, but also brittle algorithms that degrade quickly as digit length or transformation difficulty increases." />

          <div className="grid gap-6 lg:grid-cols-2">
            <FigureCard src="/images/resources/gpt-3/arithmetic-scaling.png" width={1416} height={711} label="paper figure 3.10" title="Few-shot arithmetic has a sharp 175B jump" caption="Two- and three-digit addition and subtraction rise dramatically between 13B and 175B. Four- and five-digit operations remain unreliable, showing limited systematic generalization." />
            <FigureCard src="/images/resources/gpt-3/word-scrambling.png" width={1416} height={711} label="paper figure 3.11" title="Character manipulation improves unevenly" caption="Random-symbol insertion reaches 67.2% few-shot, while reversed words remain near zero. Byte-level BPE does not guarantee a robust character-level algorithm." />
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]"><div className="border-b border-slate-800 px-6 py-5"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">paper table 3.9 reconstructed</p><h3 className="mt-2 text-xl font-black">GPT-3 175B arithmetic accuracy</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#0b1119] font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500"><tr>{["Operation","Zero-shot","One-shot","Few-shot"].map(h=><th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-800">{arithmeticRows.map(row=><tr key={row[0]}>{row.map((cell,index)=><td key={`${row[0]}-${index}`} className={`px-5 py-4 ${index===0?"font-bold text-slate-200":index===3?"font-black text-sky-300":"font-mono text-slate-500"}`}>{cell}</td>)}</tr>)}</tbody></table></div></div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["Task adaptation", "Few-shot beats one-shot and zero-shot across every arithmetic operation.", Check],
              ["Not simple recall", "Only 0.8% of sampled 3-digit additions and 0.1% of subtractions matched training searches.", ScanSearch],
              ["Not a reliable calculator", "Carrying errors and steep digit-length decay reveal an approximate learned procedure.", TriangleAlert]
            ].map(([title,text,Icon])=>{const CardIcon=Icon as typeof Check;return <div key={String(title)} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><CardIcon className="text-amber-200" size={20}/><p className="mt-5 font-black">{String(title)}</p><p className="mt-2 text-sm leading-6 text-slate-500">{String(text)}</p></div>;})}
          </div>
        </div>
      </section>

      <section id="generation" className="scroll-mt-32 border-b border-slate-800/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="09 / Open-ended generation" title="Scale makes synthetic news harder to detect" description="The authors condition each model on three example news articles plus a new title and subtitle. Human evaluators then classify roughly 200-word outputs as human- or machine-written without cherry-picked model samples." />

          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <FigureCard src="/images/resources/gpt-3/news-detection.png" width={1416} height={1068} label="paper figure 3.13" title="Human detection approaches chance at 175B" caption="Detection accuracy falls from 76% for the 125M model to 52% for GPT-3 175B. The deliberately bad control remains easy to identify at 86%, and random chance is 50%." />
            <div className="space-y-5">
              {[
                ["3 articles", "few-shot genre conditioning"],
                ["25 prompts", "titles and subtitles from newser.com"],
                ["~200 words", "mean generated article length"],
                ["52%", "human detection accuracy at 175B"]
              ].map(([value,label])=><div key={label} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><p className="text-3xl font-black text-sky-300">{value}</p><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p></div>)}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-amber-200/20 bg-amber-200/[0.04] p-6 sm:p-8"><div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-start"><TriangleAlert className="text-amber-200" size={25}/><div><h3 className="text-xl font-black text-amber-100">Indistinguishable style is not reliable information</h3><p className="mt-3 text-sm leading-7 text-amber-100/60">Evaluators can miss factual inaccuracies because the prose remains locally coherent. The model has no access to the event facts behind a new headline, so fluency can increase faster than truthfulness. The result is therefore both a quality measurement and a misuse warning.</p></div></div></div>
        </div>
      </section>

      <section id="contamination" className="scroll-mt-32 border-b border-slate-800/70 bg-[#0b1017] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="10 / Memorization audit" title="Web-scale evaluation requires a clean-subset test" description="A filtering bug left known benchmark overlaps in the training corpus, and retraining was too expensive. The paper therefore removes potentially contaminated evaluation examples and compares the clean-subset score with the full score." />
          <Equation label="clean-subset effect" formula={formulas.clean} tone="amber" note="Potentially dirty examples are identified primarily through normalized 13-gram overlap. A near-zero delta suggests overlap does not materially alter the reported score, but distribution shift between clean and dirty subsets remains a confounder." />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <FigureCard src="/images/resources/gpt-3/contamination-analysis.png" width={1416} height={576} label="paper figure 4.2" title="Most clean-subset score shifts cluster near zero" caption="The x-axis is the verified-clean fraction, not the dirty fraction. PIQA and Winograd receive explicit cautions; several highly flagged reading sets contain source passages but not their question-answer pairs." />
            <div className="rounded-3xl border border-slate-800 bg-[#101722] p-6 sm:p-8"><p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-sky-300">audit pipeline</p><div className="mt-6 space-y-3">{[
              ["01","Normalize","lowercase words, strip punctuation"],
              ["02","Match","find 13-grams in the full training corpus"],
              ["03","Clean","remove every potentially leaked example"],
              ["04","Compare","score clean subset versus all data"],
              ["05","Inspect","manually review suspicious shifts"]
            ].map(([i,t,d])=><div key={i} className="grid grid-cols-[36px_0.7fr_1.3fr] items-center gap-3 rounded-xl border border-slate-800 bg-[#0b1119] px-4 py-3 text-xs"><span className="font-mono text-sky-300">{i}</span><span className="font-bold text-slate-300">{t}</span><span className="text-slate-600">{d}</span></div>)}</div></div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{contaminationCases.map(([task,flag,effect,read])=><article key={task} className="rounded-2xl border border-slate-800 bg-[#101722] p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-black">{task}</h3><span className="text-right font-mono text-[9px] uppercase tracking-wider text-amber-200">{flag}</span></div><p className="mt-4 font-mono text-xs font-black text-sky-300">{effect}</p><p className="mt-3 text-sm leading-7 text-slate-500">{read}</p></article>)}</div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-32 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="11 / Critical reading" title="The breakthrough is real; the learning claim remains bounded" description="GPT-3 demonstrates that a frozen autoregressive model can use textual examples as a control interface. It does not establish robust task learning from scratch, reliable reasoning, grounding, or a complete replacement for fine-tuning." />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Recognition vs learning", "The model may identify a task family learned during pre-training rather than construct a genuinely new algorithm at inference time.", BrainCircuit],
              ["Unidirectional bottleneck", "Comparison, entailment, and careful rereading tasks can be poorly matched to left-to-right generation.", ArrowRight],
              ["Finite context", "Demonstrations compete with instructions and query content inside a 2,048-token window.", BookOpen],
              ["Objective mismatch", "Uniform next-token loss does not distinguish important facts from stylistic or incidental details.", Target],
              ["No grounding", "Text-only prediction lacks direct physical interaction, perception, and externally verified state.", Globe2],
              ["Cost and access", "175B inference is expensive, memory intensive, and difficult to deploy without model parallelism.", Cpu],
              ["Bias and misuse", "Web data transfers stereotypes and the improved generation quality lowers the barrier to synthetic content.", TriangleAlert],
              ["Calibration", "Fluent outputs can be wrong, contradictory, repetitive, or overconfident on novel inputs.", Gauge],
              ["Contamination uncertainty", "A clean-subset comparison cannot fully prove that memorization has no effect when subset difficulty shifts.", ScanSearch]
            ].map(([title,text,Icon])=>{const CardIcon=Icon as typeof BrainCircuit;return <article key={String(title)} className="rounded-3xl border border-slate-800 bg-[#101722] p-6"><CardIcon className="text-sky-300" size={22}/><h3 className="mt-5 text-lg font-black">{String(title)}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{String(text)}</p></article>;})}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-sky-300/25 bg-gradient-to-br from-sky-300/[0.08] via-[#101722] to-amber-200/[0.05]"><div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-center"><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">the durable idea</p><p className="mt-4 text-4xl font-black leading-tight">A prompt can be a temporary learning environment.</p></div><div className="space-y-4 text-sm leading-7 text-slate-400"><p>GPT-2 showed that task behavior can appear zero-shot. GPT-3 turns that observation into an experimental axis: zero, one, and many demonstrations, measured across a controlled eight-model scaling ladder.</p><p>The central result is not that 175B solves every benchmark. It is that the ability to infer and execute a pattern from context improves with model scale, establishing in-context learning as a practical model interface.</p></div></div></div>

          <div className="mt-8 flex justify-center"><SourceLink href={links.pdf}>Open original PDF</SourceLink></div>
          <PaperTimelineNav
            older={{ href: "/resources/bert", title: "BERT", year: 2019 }}
            newer={{ href: "/resources/vision-transformer", title: "Vision Transformer", year: 2021 }}
          />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
