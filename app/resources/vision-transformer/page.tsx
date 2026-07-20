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
  Database,
  ExternalLink,
  Eye,
  Gauge,
  Grid3X3,
  ImageIcon,
  Maximize2,
  Network,
  Target,
  TriangleAlert,
  Workflow
} from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SocialFooter from "../../components/SocialFooter";
import PaperTimelineNav from "../../components/PaperTimelineNav";

const links = {
  arxiv: "https://arxiv.org/abs/2010.11929",
  html: "https://arxiv.org/html/2010.11929v2",
  pdf: "https://arxiv.org/pdf/2010.11929v2",
  doi: "https://doi.org/10.48550/arXiv.2010.11929",
  code: "https://github.com/google-research/vision_transformer"
};

export const metadata: Metadata = {
  title: "Vision Transformer: A Complete Technical Deep Dive",
  description:
    "A visual, equation-first reconstruction of Vision Transformer: patch tokenization, encoder architecture, data scaling, transfer learning, benchmark results, learned representations, and ablations."
};

const sections = [
  ["thesis", "The thesis"],
  ["tokens", "Patch tokens"],
  ["encoder", "Encoder"],
  ["family", "Model family"],
  ["training", "Training"],
  ["scale", "Data + compute"],
  ["results", "Results"],
  ["inspection", "Inside ViT"],
  ["ablations", "Ablations"],
  ["limits", "Limits"]
];

const modelRows = [
  ["ViT-Base", "12", "768", "3072", "12", "86M"],
  ["ViT-Large", "24", "1024", "4096", "16", "307M"],
  ["ViT-Huge", "32", "1280", "5120", "16", "632M"]
];

const resultRows = [
  ["ViT-H/14", "JFT-300M", "88.55", "90.72", "94.55", "97.56", "99.68", "77.63", "2.5k"],
  ["ViT-L/16", "JFT-300M", "87.76", "90.54", "93.90", "97.32", "99.74", "76.28", "0.68k"],
  ["ViT-L/16", "ImageNet-21k", "85.30", "88.62", "93.25", "94.67", "99.61", "72.72", "0.23k"],
  ["BiT-L R152x4", "JFT-300M", "87.54", "90.54", "93.51", "96.62", "99.63", "76.29", "9.9k"],
  ["Noisy Student", "JFT-300M unlabeled", "88.4 / 88.5", "90.55", "-", "-", "-", "-", "12.3k"]
];

const positionRows = [
  ["No position embedding", "0.61382", "-", "-"],
  ["1D learned", "0.64206", "0.63964", "0.64292"],
  ["2D learned", "0.64001", "0.64046", "0.64022"],
  ["Relative", "0.64032", "-", "-"]
];

const figures = {
  architecture: { src: "/images/resources/vision-transformer/architecture.png", width: 1116, height: 582 },
  vtab: { src: "/images/resources/vision-transformer/vtab-groups.png", width: 1185, height: 321 },
  dataScale: { src: "/images/resources/vision-transformer/data-scale.png", width: 1200, height: 405 },
  compute: { src: "/images/resources/vision-transformer/compute-frontier.png", width: 1170, height: 462 },
  attention: { src: "/images/resources/vision-transformer/attention-examples.png", width: 345, height: 579 },
  learned: { src: "/images/resources/vision-transformer/learned-representations.png", width: 1200, height: 399 },
  scaling: { src: "/images/resources/vision-transformer/scaling-ablation.png", width: 1080, height: 384 },
  pooling: { src: "/images/resources/vision-transformer/cls-vs-gap.png", width: 795, height: 399 },
  throughput: { src: "/images/resources/vision-transformer/throughput-memory.png", width: 1050, height: 462 }
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
      <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
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
  tone?: "cyan" | "rose" | "yellow";
}) {
  const tones = {
    cyan: "border-cyan-300/20 bg-cyan-300/5 text-cyan-50",
    rose: "border-rose-300/20 bg-rose-300/5 text-rose-50",
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
  figure,
  label,
  caption,
  className = "",
  imageClassName = ""
}: {
  figure: { src: string; width: number; height: number };
  label: string;
  caption: ReactNode;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <figure className={"min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722] " + className}>
      <div className="bg-white p-3 sm:p-5">
        <Image
          src={figure.src}
          alt={label}
          width={figure.width}
          height={figure.height}
          sizes="(min-width: 1280px) 1100px, 100vw"
          className={"mx-auto h-auto w-full object-contain " + imageClassName}
        />
      </div>
      <figcaption className="border-t border-slate-800 px-5 py-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">{label}</p>
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
      className="group flex items-center justify-between gap-5 rounded-xl border border-slate-800 bg-[#0d1117] px-4 py-4 transition-colors hover:border-cyan-300/35"
    >
      <span className="text-sm font-bold text-slate-200">{children}</span>
      <ExternalLink className="shrink-0 text-slate-600 transition-colors group-hover:text-cyan-300" size={16} />
    </a>
  );
}

function PatchLaboratory() {
  const tileTones = [
    "bg-cyan-300/25",
    "bg-blue-400/20",
    "bg-rose-300/25",
    "bg-yellow-200/20",
    "bg-emerald-300/20"
  ];

  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#101722] shadow-[0_0_90px_-45px_rgba(34,211,238,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
          patch tokenizer
        </div>
        <span className="font-mono text-[10px] text-slate-600">ViT-B/16</span>
      </div>

      <div className="p-6">
        <div className="grid gap-6 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
          <div>
            <div className="grid aspect-square max-w-[240px] grid-cols-7 gap-1 rounded-2xl border border-slate-700 bg-[#0b1119] p-2">
              {Array.from({ length: 49 }, (_, index) => (
                <span
                  key={index}
                  className={
                    "rounded-[3px] border border-white/5 " +
                    tileTones[(index + Math.floor(index / 7) * 2) % tileTones.length]
                  }
                />
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
              display grid / actual grid 14 x 14
            </p>
          </div>

          <div className="space-y-3">
            {[
              ["input", "224 x 224 x 3", "text-slate-300"],
              ["patch", "16 x 16 x 3", "text-yellow-200"],
              ["sequence", "196 + [CLS]", "text-cyan-300"],
              ["embedding", "197 x D", "text-rose-300"]
            ].map(([label, value, tone], index) => (
              <div key={label} className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-slate-700">0{index + 1}</span>
                <div className="h-px flex-1 bg-slate-800" />
                <div className="min-w-[118px]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">{label}</p>
                  <p className={"mt-1 font-mono text-xs font-black " + tone}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-5 text-cyan-50">
          <DisplayMath formula={"N=\\frac{224\\cdot224}{16^2}=196"} className="text-base md:text-lg" />
        </div>
      </div>
    </div>
  );
}

export default function VisionTransformerPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0d1117] font-sans text-white selection:bg-cyan-300/30">
      <SiteNav />

      <header className="relative overflow-hidden border-b border-slate-800 px-5 pb-24 pt-36 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute right-[12%] top-[18%] h-80 w-80 bg-cyan-300/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 left-[18%] h-64 w-64 bg-rose-300/10 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-slate-500 transition-colors hover:text-cyan-300"
          >
            <ArrowLeft size={14} />
            Back to resources
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                  complete paper reconstruction
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">arxiv:2010.11929v2</span>
              </div>

              <h1 className="mt-7 text-6xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
                ViT<span className="text-yellow-200">.</span>
              </h1>
              <h2 className="mt-6 max-w-3xl text-2xl font-black leading-tight text-white md:text-3xl">
                Turn pixels into tokens. Let every patch talk.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400 md:text-lg">
                A tensor-level guide to patch projection, class tokens, global self-attention, positional structure,
                large-scale supervised pre-training, transfer learning, compute efficiency, and the experiments that
                moved Transformers into computer vision.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={links.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#071116] transition-colors hover:bg-cyan-200"
                >
                  Read original PDF
                  <BookOpen size={16} />
                </a>
                <a
                  href={links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#101722] px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-200 transition-colors hover:border-cyan-300/50 hover:text-cyan-200"
                >
                  Official HTML
                  <ExternalLink size={15} />
                </a>
              </div>

              <p className="mt-7 max-w-3xl font-mono text-xs leading-6 text-slate-600">
                Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, et al.
                <br />
                Google Research, Brain Team / ICLR 2021
              </p>
            </div>

            <PatchLaboratory />
          </div>

          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 lg:grid-cols-4">
            {[
              ["16 x 16", "canonical patch", "ViT-L/16"],
              ["196", "image tokens", "at 224 resolution"],
              ["632M", "largest model", "ViT-Huge"],
              ["88.55", "ImageNet top-1", "ViT-H/14 + JFT"]
            ].map(([value, label, detail]) => (
              <div key={label} className="bg-[#101722] p-5">
                <p className="font-mono text-2xl font-black text-cyan-300">{value}</p>
                <p className="mt-2 text-sm font-black text-white">{label}</p>
                <p className="mt-1 text-xs text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky top-[77px] z-40 border-b border-slate-800 bg-[#0d1117]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map(([id, label], index) => (
            <a
              key={id}
              href={"#" + id}
              className="shrink-0 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 transition-colors hover:bg-cyan-300/5 hover:text-cyan-300"
            >
              {String(index + 1).padStart(2, "0")} {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="thesis" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="01 / the central bet"
            title="Trade convolutional priors for scalable attention."
            description={
              <>
                ViT does not invent a vision-specific Transformer. It makes the smallest possible interface change:
                convert an image into a token sequence, then reuse the encoder architecture already proven in NLP.
                The cost is data hunger; the reward is a cleaner scaling path.
              </>
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="overflow-hidden rounded-3xl border border-yellow-200/20 bg-[#101722]">
              <div className="flex items-center justify-between border-b border-slate-800 bg-yellow-200/5 px-6 py-5">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-yellow-200">CNN prior</p>
                  <h3 className="mt-2 text-2xl font-black">Structure is built in.</h3>
                </div>
                <Grid3X3 className="text-yellow-200" size={28} />
              </div>
              <div className="grid gap-px bg-slate-800 sm:grid-cols-3">
                {[
                  ["locality", "small receptive fields"],
                  ["equivariance", "shared filters"],
                  ["2D topology", "native grid"]
                ].map(([title, detail]) => (
                  <div key={title} className="bg-[#101722] p-5">
                    <p className="text-sm font-black text-white">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
                  </div>
                ))}
              </div>
              <p className="p-6 text-sm leading-7 text-slate-400">
                These assumptions improve sample efficiency. On ImageNet-scale pre-training, comparable ResNets
                generalize better than large ViTs because they do not need to discover basic visual structure from scratch.
              </p>
            </article>

            <article className="overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#101722]">
              <div className="flex items-center justify-between border-b border-slate-800 bg-cyan-300/5 px-6 py-5">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">ViT prior</p>
                  <h3 className="mt-2 text-2xl font-black">Structure is learned.</h3>
                </div>
                <Network className="text-cyan-300" size={28} />
              </div>
              <div className="grid gap-px bg-slate-800 sm:grid-cols-3">
                {[
                  ["global", "all-patch attention"],
                  ["uniform", "same encoder block"],
                  ["scalable", "standard TPU kernels"]
                ].map(([title, detail]) => (
                  <div key={title} className="bg-[#101722] p-5">
                    <p className="text-sm font-black text-white">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
                  </div>
                ))}
              </div>
              <p className="p-6 text-sm leading-7 text-slate-400">
                Once pre-training grows from 1.3M to 14M and then 303M images, the weaker prior stops being a liability.
                Larger ViTs overtake the CNN baselines and stay favorable on the accuracy-per-compute frontier.
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">paper in one line</p>
            <p className="mt-3 max-w-5xl text-xl font-black leading-relaxed text-white md:text-2xl">
              Patches make images compatible with Transformers; scale makes Transformers competitive with convolution.
            </p>
          </div>
        </div>
      </section>

      <section id="tokens" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="02 / image to sequence"
            title="A patch is the visual equivalent of a token."
            description={
              <>
                Start with <InlineMath formula={"\\mathbf{x}\\in\\mathbb{R}^{H\\times W\\times C}"} />. Split it into
                non-overlapping <InlineMath formula={"P\\times P"} /> regions, flatten each region, and project every
                flattened vector into the Transformer width <InlineMath formula={"D"} />.
              </>
            }
          />

          <FigureCard
            figure={figures.architecture}
            label="Figure 1 / original model overview"
            caption="The full interface: image patches become vectors, receive position embeddings, pass through a standard pre-LN Transformer encoder, and the class token feeds the prediction head."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Equation
              label="patch count and flattened patch matrix"
              formula={"N=\\frac{HW}{P^2},\\qquad \\mathbf{x}_p\\in\\mathbb{R}^{N\\times(P^2C)}"}
              note={
                <>
                  At 224 x 224 with 16 x 16 patches, the 2D image becomes 196 patch tokens. The sequence length is
                  controlled by patch size, not by pixel count directly.
                </>
              }
            />
            <Equation
              label="embedded input sequence / equation 1"
              formula={"\\mathbf{z}_0=[\\mathbf{x}_{\\mathrm{class}};\\,\\mathbf{x}_p^1\\mathbf{E};\\,\\ldots;\\,\\mathbf{x}_p^N\\mathbf{E}]+\\mathbf{E}_{\\mathrm{pos}}"}
              note={
                <>
                  <InlineMath formula={"\\mathbf{E}\\in\\mathbb{R}^{(P^2C)\\times D}"} /> is the learned patch projection.
                  A learnable class token is prepended, then a learnable position vector is added to every sequence element.
                </>
              }
              tone="rose"
            />
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["01", "cut", "Partition the image into non-overlapping P x P regions."],
              ["02", "flatten", "Convert each local RGB block into a vector of length P squared times C."],
              ["03", "project", "Apply the same learned linear map to every flattened patch."],
              ["04", "position", "Prepend [CLS] and add a learned sequence position to every token."]
            ].map(([step, title, detail]) => (
              <article key={step} className="bg-[#101722] p-6">
                <span className="font-mono text-xs font-black text-cyan-300">{step}</span>
                <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-yellow-200/20 bg-yellow-200/5 p-6">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-200/25 bg-yellow-200/10 text-yellow-200">
                <Gauge size={25} />
              </div>
              <div>
                <h3 className="text-lg font-black">Patch size is a compute dial.</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Halving <InlineMath formula={"P"} /> doubles each grid dimension, quadruples the number of tokens, and
                  increases the dominant attention interaction count by roughly sixteen times because self-attention is
                  quadratic in sequence length.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="encoder" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="03 / transformer core"
            title="The encoder is standard. The ordering is pre-LN."
            description={
              <>
                Each layer alternates global multi-head self-attention and a two-layer GELU MLP. Layer normalization
                happens before each sublayer, while residual connections carry the unmodified stream around it.
              </>
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <Equation
              label="attention residual / equation 2"
              formula={"\\mathbf{z}'_\\ell=\\operatorname{MSA}(\\operatorname{LN}(\\mathbf{z}_{\\ell-1}))+\\mathbf{z}_{\\ell-1}"}
              note="Global attention lets every patch exchange information with every other patch in one layer."
            />
            <Equation
              label="mlp residual / equation 3"
              formula={"\\mathbf{z}_\\ell=\\operatorname{MLP}(\\operatorname{LN}(\\mathbf{z}'_\\ell))+\\mathbf{z}'_\\ell"}
              note="The token-wise MLP expands to the model's hidden MLP size, applies GELU, and projects back to D."
              tone="rose"
            />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <Equation
              label="scaled dot-product attention / appendix equation 6"
              formula={"\\mathbf{A}=\\operatorname{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^{\\mathsf T}}{\\sqrt{D_h}}\\right),\\qquad \\operatorname{SA}(\\mathbf{z})=\\mathbf{A}\\mathbf{V}"}
              note="For each head, Q, K, and V are linear projections of the complete patch sequence. The attention matrix is (N + 1) by (N + 1)."
              tone="yellow"
            />
            <Equation
              label="image representation / equation 4"
              formula={"\\mathbf{y}=\\operatorname{LN}(\\mathbf{z}_L^0)"}
              note="Only the final state at sequence index zero, the learned class token, is handed to the classifier."
            />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Network,
                title: "Global from layer one",
                text: "No receptive-field growth is required. A low-level patch can immediately communicate with a distant patch."
              },
              {
                icon: Activity,
                title: "Token-wise MLP",
                text: "Attention mixes information across positions; the MLP transforms each resulting token independently."
              },
              {
                icon: Target,
                title: "One readout token",
                text: "The [CLS] token learns to aggregate the evidence needed by the image-level classification objective."
              }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                  <Icon className="text-cyan-300" size={22} />
                  <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="family" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="04 / model family"
            title="BERT sizes, vision patch rates."
            description={
              <>
                Base and Large copy the corresponding BERT encoder dimensions; Huge extends the same scaling pattern.
                The suffix identifies patch size, so model width and visual sequence length remain separate choices.
              </>
            }
          />

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Table 1 / architecture variants</p>
              <h3 className="mt-2 text-xl font-black">Depth, width, heads, and parameter count</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                  <tr>
                    {["Model", "Layers", "Hidden D", "MLP", "Heads", "Params"].map((heading) => (
                      <th key={heading} className="px-5 py-4 font-bold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modelRows.map((row, index) => (
                    <tr key={row[0]} className={"border-b border-slate-800 last:border-0 " + (index === 2 ? "bg-cyan-300/[0.04]" : "")}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className={"px-5 py-5 " + (cellIndex === 0 ? "font-black text-white" : "font-mono text-slate-400")}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              ["ViT-B/32", "49", "2.4k", "Cheap sequence, coarse visual units."],
              ["ViT-B/16", "196", "38.4k", "Four times more tokens and sixteen times more token pairs."],
              ["ViT-H/14", "256", "65.5k", "Large encoder plus the densest canonical patch grid."]
            ].map(([name, tokens, pairs, detail]) => (
              <article key={name} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-lg font-black text-cyan-300">{name}</h3>
                  <Grid3X3 className="text-slate-700" size={20} />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-mono text-2xl font-black text-white">{tokens}</p>
                    <p className="mt-1 text-xs text-slate-600">patch tokens</p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-black text-white">{pairs}</p>
                    <p className="mt-1 text-xs text-slate-600">token pairs</p>
                  </div>
                </div>
                <p className="mt-5 border-t border-slate-800 pt-5 text-sm leading-6 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-rose-300/20 bg-[#101722] p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-300/10 text-rose-300">
                <Workflow size={28} />
              </div>
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">hybrid branch</p>
                <h3 className="mt-2 text-2xl font-black">A ResNet stem can create the token map.</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  The hybrid replaces raw patches with patches from a CNN feature map. At small compute budgets this
                  local visual prior helps, but the controlled scaling study shows the advantage disappearing as model
                  size grows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="training" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="05 / pre-train then transfer"
            title="Learn broadly at 224. Adapt sharply at higher resolution."
            description={
              <>
                The main experiments use supervised pre-training, followed by task-specific fine-tuning. Higher
                fine-tuning resolution preserves patch size but creates more tokens, so the learned 2D position grid must
                be interpolated.
              </>
            }
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-3">
            {[
              ["1.3M", "ImageNet", "1k classes", "small regime"],
              ["14M", "ImageNet-21k", "21k classes", "public scale"],
              ["303M", "JFT-300M", "18k classes", "full ViT regime"]
            ].map(([size, dataset, classes, note]) => (
              <article key={dataset} className="bg-[#101722] p-6">
                <p className="font-mono text-3xl font-black text-cyan-300">{size}</p>
                <h3 className="mt-3 text-lg font-black">{dataset}</h3>
                <p className="mt-1 font-mono text-xs text-slate-600">{classes}</p>
                <p className="mt-5 border-t border-slate-800 pt-4 text-sm text-slate-500">{note}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#101722]">
              <div className="border-b border-slate-800 bg-cyan-300/5 px-6 py-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">pre-training</p>
                <h3 className="mt-2 text-2xl font-black">Build a transferable visual representation.</h3>
              </div>
              <div className="grid gap-px bg-slate-800 sm:grid-cols-2">
                {[
                  ["optimizer", "Adam", "beta 1 = 0.9 / beta 2 = 0.999"],
                  ["batch", "4096", "all reported pre-training"],
                  ["schedule", "10k warmup", "then linear decay"],
                  ["regularization", "weight decay 0.1", "JFT configuration"],
                  ["resolution", "224 x 224", "all pre-training"],
                  ["duration", "7 or 14 epochs", "JFT model sweep"]
                ].map(([label, value, detail]) => (
                  <div key={label} className="bg-[#101722] p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">{label}</p>
                    <p className="mt-2 font-mono text-sm font-black text-cyan-300">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-3xl border border-rose-300/20 bg-[#101722]">
              <div className="border-b border-slate-800 bg-rose-300/5 px-6 py-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">fine-tuning</p>
                <h3 className="mt-2 text-2xl font-black">Replace the head, preserve the encoder.</h3>
              </div>
              <div className="grid gap-px bg-slate-800 sm:grid-cols-2">
                {[
                  ["optimizer", "SGD + momentum", "momentum 0.9"],
                  ["batch", "512", "all downstream models"],
                  ["head", "D x K linear", "zero initialized"],
                  ["schedule", "cosine decay", "no weight decay"],
                  ["default size", "384 x 384", "most transfer tasks"],
                  ["ImageNet max", "512 / 518", "L/16 and H/14"]
                ].map(([label, value, detail]) => (
                  <div key={label} className="bg-[#101722] p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">{label}</p>
                    <p className="mt-2 font-mono text-sm font-black text-rose-300">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{detail}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Equation
              label="new downstream classifier"
              formula={"\\widehat{\\mathbf{y}}=\\mathbf{W}_{\\mathrm{task}}\\,\\operatorname{LN}(\\mathbf{z}_L^0),\\qquad \\mathbf{W}_{\\mathrm{task}}\\in\\mathbb{R}^{K\\times D}"}
              note="The pre-training MLP head is removed entirely. A zero-initialized linear head maps the transferred class-token representation to K downstream classes."
              tone="rose"
            />
            <div className="rounded-2xl border border-yellow-200/20 bg-yellow-200/5 p-6">
              <Maximize2 className="text-yellow-200" size={24} />
              <h3 className="mt-5 text-xl font-black">Resolution transfer changes sequence length.</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                A ViT-L/16 model moves from a 14 x 14 patch grid at 224 pixels to 32 x 32 at 512 pixels. The encoder
                accepts the longer sequence, while the original learned position map is interpolated in 2D to match it.
              </p>
              <div className="mt-5 flex items-center gap-3 font-mono text-xs">
                <span className="rounded-lg border border-slate-700 bg-[#101722] px-3 py-2 text-cyan-300">196 patches</span>
                <ArrowRight className="text-slate-600" size={16} />
                <span className="rounded-lg border border-slate-700 bg-[#101722] px-3 py-2 text-yellow-200">1024 patches</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="scale" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="06 / the scaling result"
            title="Data decides whether the weak prior is a bug or a feature."
            description={
              <>
                ViT is not uniformly better than a ResNet. The crossover depends on pre-training scale: convolution wins
                in the small-data region; global Transformers keep improving as data and model size grow.
              </>
            }
          />

          <FigureCard
            figure={figures.dataScale}
            label="Figures 3 and 4 / data requirements"
            caption="Left: larger ViTs become useful only as pre-training grows from ImageNet to ImageNet-21k and JFT-300M. Right: ResNets lead on smaller JFT subsets but plateau earlier; ViT-L/16 keeps gaining."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["ImageNet", "CNN advantage", "Large ViTs overfit and can trail smaller ViTs even after regularization."],
              ["ImageNet-21k", "crossover", "Base and Large ViTs become competitive as the data bottleneck loosens."],
              ["JFT-300M", "ViT advantage", "The largest models finally exploit their capacity and overtake the ResNet region."]
            ].map(([dataset, verdict, detail]) => (
              <article key={dataset} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">{dataset}</p>
                <h3 className="mt-3 text-xl font-black text-cyan-300">{verdict}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <FigureCard
            figure={figures.compute}
            label="Figure 5 / controlled compute frontier"
            caption="Across the controlled JFT study, ViTs sit above comparable ResNets on transfer accuracy for a given pre-training budget. Hybrids help at the small end, then converge toward pure ViT."
            className="mt-8"
          />

          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-3">
            {[
              ["2-4x", "less compute", "Reported compute reduction for matching average five-dataset performance."],
              ["small budget", "hybrid helps", "A convolutional stem supplies useful locality before sufficient Transformer scale."],
              ["large budget", "no saturation", "Pure ViT keeps improving over the explored range and closes the hybrid gap."]
            ].map(([metric, title, detail]) => (
              <div key={title} className="bg-[#101722] p-6">
                <p className="font-mono text-2xl font-black text-yellow-200">{metric}</p>
                <h3 className="mt-2 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="07 / benchmark evidence"
            title="One JFT checkpoint transfers across very different visual tasks."
            description={
              <>
                The strongest ViT-H/14 result is not a single-dataset win. The same pre-trained representation is
                fine-tuned across natural images, fine-grained categories, and the 19-task VTAB transfer suite.
              </>
            }
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-4">
            {[
              ["88.55", "ImageNet", "top-1 accuracy"],
              ["90.72", "ImageNet-ReaL", "cleaned labels"],
              ["94.55", "CIFAR-100", "100 classes"],
              ["77.63", "VTAB", "19-task mean"]
            ].map(([value, task, detail]) => (
              <div key={task} className="bg-[#101722] p-6">
                <p className="font-mono text-3xl font-black text-cyan-300">{value}</p>
                <h3 className="mt-3 text-base font-black">{task}</h3>
                <p className="mt-1 text-xs text-slate-600">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Table 2 / state-of-the-art comparison</p>
              <h3 className="mt-2 text-xl font-black">Fine-tuning accuracy and pre-training cost</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1240px] text-left text-xs">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">
                  <tr>
                    {["Model", "Pre-train", "ImageNet", "ReaL", "C100", "Pets", "Flowers", "VTAB", "TPUv3 core-days"].map((heading) => (
                      <th key={heading} className="px-4 py-4 font-bold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultRows.map((row, rowIndex) => (
                    <tr key={row[0] + row[1]} className={"border-b border-slate-800 last:border-0 " + (rowIndex === 0 ? "bg-cyan-300/[0.05]" : "")}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={
                            "px-4 py-5 " +
                            (cellIndex === 0
                              ? "font-black text-white"
                              : cellIndex === 1
                                ? "font-mono text-slate-500"
                                : rowIndex === 0
                                  ? "font-mono font-black text-cyan-200"
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

          <FigureCard
            figure={figures.vtab}
            label="Figure 2 / VTAB group breakdown"
            caption="ViT-H/14 leads the prior transfer baselines on Natural and Structured tasks. The Specialized group, covering medical and satellite imagery, is much closer between ViT and BiT."
            className="mt-8"
          />

          <div className="mt-8 rounded-2xl border border-yellow-200/20 bg-yellow-200/5 p-6">
            <h3 className="text-lg font-black text-yellow-100">Read the compute column with the accuracy column.</h3>
            <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-400">
              ViT-L/16 beats BiT-L across all reported transfer tasks while using 0.68k versus 9.9k TPUv3 core-days.
              ViT-H/14 raises accuracy further at 2.5k core-days. The paper cautions that optimizer and schedule choices
              also affect this comparison, which motivates its controlled compute study.
            </p>
          </div>
        </div>
      </section>

      <section id="inspection" className="scroll-mt-36 border-b border-slate-800 bg-[#0f141c] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="08 / internal representations"
            title="ViT reconstructs visual structure from the objective."
            description={
              <>
                The model begins with no handcrafted 2D position geometry beyond patch extraction. After training, its
                patch filters, position vectors, and attention distances reveal that local texture, grid topology, and
                global context have all emerged.
              </>
            }
          />

          <FigureCard
            figure={figures.learned}
            label="Figure 7 / filters, positions, and attention distance"
            caption="Left: principal components of the learned RGB patch projection. Center: position-vector similarity recovers rows, columns, and spatial distance. Right: some attention heads are global in the earliest layers while others stay local."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              ["patch basis", "The linear stem learns edge-, color-, and texture-like basis functions inside a patch."],
              ["2D topology", "Nearby patches receive similar learned position vectors even though the default embedding is a 1D raster sequence."],
              ["mixed range", "Early heads divide into local and global behavior; average attention distance generally increases with depth."]
            ].map(([title, detail], index) => (
              <article key={title} className="rounded-2xl border border-slate-800 bg-[#101722] p-6">
                <span className="font-mono text-xs font-black text-cyan-300">0{index + 1}</span>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
            <FigureCard
              figure={figures.attention}
              label="Figure 6 / class-token attention"
              caption="Representative output-token attention concentrates on semantically relevant image regions."
              imageClassName="max-w-[300px]"
            />
            <div className="rounded-3xl border border-cyan-300/20 bg-[#101722] p-7">
              <Eye className="text-cyan-300" size={26} />
              <h3 className="mt-5 text-2xl font-black">Global attention is used, not merely available.</h3>
              <p className="mt-4 text-sm leading-8 text-slate-400">
                If ViT behaved like a convolutional network, all early attention heads would remain local. Instead, some
                first-layer heads already span most of the image. Other heads stay sharply local, effectively learning a
                role similar to early convolutional filters without having that behavior hard-coded.
              </p>
              <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-slate-800 sm:grid-cols-2">
                <div className="bg-[#0d1117] p-5">
                  <p className="font-mono text-xl font-black text-cyan-300">near 0 px</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">some heads remain local in shallow layers</p>
                </div>
                <div className="bg-[#0d1117] p-5">
                  <p className="font-mono text-xl font-black text-rose-300">100+ px</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">other heads integrate almost the full image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ablations" className="scroll-mt-36 border-b border-slate-800 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="09 / what actually mattered"
            title="Depth, patch density, position, and optimization tell different stories."
            description={
              <>
                The appendix separates architectural necessity from training convention. Position information matters,
                but sophisticated position encodings barely move the result; class-token pooling works, but so does
                global average pooling once its learning rate is tuned.
              </>
            }
          />

          <div className="grid gap-8 lg:grid-cols-2">
            <FigureCard
              figure={figures.scaling}
              label="Figure 8 / scaling dimensions"
              caption="Scaling every dimension works, but depth gives the largest early gains. Smaller patches also improve robustly because they increase sequence length without adding parameters."
            />
            <FigureCard
              figure={figures.pooling}
              label="Figure 9 / class token versus average pooling"
              caption="The apparent failure of global average pooling disappears after changing its learning rate. The extra class token is a design choice, not the source of ViT's accuracy."
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#101722]">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Table 8 / positional embedding ablation</p>
              <h3 className="mt-2 text-xl font-black">ImageNet five-shot linear accuracy</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 bg-[#0d1117] font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  <tr>
                    {["Position method", "Input stem", "Every layer", "Shared every layer"].map((heading) => (
                      <th key={heading} className="px-5 py-4 font-bold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {positionRows.map((row, rowIndex) => (
                    <tr key={row[0]} className={"border-b border-slate-800 last:border-0 " + (rowIndex === 1 ? "bg-cyan-300/[0.05]" : "")}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className={"px-5 py-5 " + (cellIndex === 0 ? "font-black text-white" : "font-mono text-slate-400")}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["position is required", "0.6138 -> 0.6421", "Removing position information hurts clearly."],
              ["1D is enough", "0.64206", "Learned raster-order positions slightly lead the tested alternatives."],
              ["depth before width", "strongest gain", "Depth scaling changes performance more than width in the tested regime."],
              ["smaller patches", "gain without params", "More tokens improve accuracy even though the parameter count stays fixed."]
            ].map(([title, metric, detail]) => (
              <article key={title} className="rounded-2xl border border-slate-800 bg-[#101722] p-5">
                <p className="font-mono text-lg font-black text-yellow-200">{metric}</p>
                <h3 className="mt-3 text-base font-black">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <FigureCard
              figure={figures.throughput}
              label="Figure 12 / empirical throughput and memory"
              caption="On TPUv3, ViT inference speed is comparable to similarly sized ResNets across input resolutions, while the large ViT variants fit substantially larger per-core batches."
            />
            <article className="rounded-3xl border border-rose-300/20 bg-[#101722] p-7">
              <BrainCircuit className="text-rose-300" size={26} />
              <p className="mt-5 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-300">preliminary self-supervision</p>
              <h3 className="mt-3 text-2xl font-black">Masked patch prediction worked, but did not close the gap.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                The appendix corrupts 50% of patch embeddings using an 80/10/10 mask-random-keep policy and predicts
                each patch&apos;s quantized mean color. ViT-B/16 reaches 79.9% ImageNet accuracy.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-800">
                <div className="bg-[#0d1117] p-5">
                  <p className="font-mono text-2xl font-black text-cyan-300">+2%</p>
                  <p className="mt-2 text-xs text-slate-500">over training from scratch</p>
                </div>
                <div className="bg-[#0d1117] p-5">
                  <p className="font-mono text-2xl font-black text-rose-300">-4%</p>
                  <p className="mt-2 text-xs text-slate-500">behind supervised pre-training</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="limits" className="scroll-mt-36 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="10 / boundary conditions"
            title="The breakthrough is conditional, not universal."
            description={
              <>
                The paper demonstrates a powerful scaling direction, but its strongest claim depends on hundreds of
                millions of labeled images, expensive pre-training, and classification-focused evaluation.
              </>
            }
          />

          <div className="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 md:grid-cols-2">
            {[
              {
                icon: Database,
                title: "Data hunger",
                text: "Without a convolutional prior, large ViTs overfit smaller datasets. The strongest checkpoint uses the private JFT-300M dataset."
              },
              {
                icon: Gauge,
                title: "Quadratic token mixing",
                text: "Higher resolution or smaller patches increase sequence length rapidly, and full attention scales quadratically in that length."
              },
              {
                icon: ImageIcon,
                title: "Classification scope",
                text: "The main paper centers image classification and transfer; detection and segmentation are explicitly left as future work."
              },
              {
                icon: BrainCircuit,
                title: "Supervised dependence",
                text: "The paper's early masked-patch objective improves over scratch training but remains behind supervised large-scale pre-training."
              }
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

          <div className="mt-8 rounded-3xl border border-yellow-200/20 bg-yellow-200/5 p-7 md:p-9">
            <TriangleAlert className="text-yellow-200" size={27} />
            <h3 className="mt-5 text-2xl font-black">What the paper actually proves.</h3>
            <p className="mt-4 max-w-5xl text-base leading-8 text-slate-300">
              A nearly unmodified Transformer encoder can become a state-of-the-art image classifier when images are
              represented as patch sequences and pre-training is sufficiently large. It does not prove that visual
              inductive bias is useless; its own experiments show that convolution remains valuable in the low-data and
              low-compute regimes.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">reading checkpoint</p>
              <h3 className="mt-3 text-3xl font-black">You can now reconstruct ViT end to end.</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "derive the patch sequence length",
                  "write the complete encoder recurrence",
                  "explain the data-scale crossover",
                  "read the benchmark and compute table",
                  "interpret learned position geometry",
                  "separate architecture from optimizer effects"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#101722] p-4">
                    <ChevronRight className="mt-0.5 shrink-0 text-cyan-300" size={15} />
                    <span className="text-sm leading-6 text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">primary sources</p>
              <div className="mt-4 space-y-3">
                <SourceLink href={links.arxiv}>Official arXiv abstract</SourceLink>
                <SourceLink href={links.html}>Official arXiv HTML</SourceLink>
                <SourceLink href={links.pdf}>Camera-ready PDF</SourceLink>
                <SourceLink href={links.code}>Google Research implementation</SourceLink>
                <SourceLink href={links.doi}>arXiv DOI record</SourceLink>
              </div>
            </div>
          </div>

          <PaperTimelineNav
            older={{ href: "/resources/gpt-3", title: "GPT-3", year: 2020 }}
            newer={{ href: "/resources/instructgpt", title: "InstructGPT", year: 2022 }}
          />
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
