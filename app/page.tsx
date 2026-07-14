"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  BrainCircuit,
  Code2,
  Container,
  Cpu,
  ExternalLink,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  Rocket,
  Server,
  Terminal
} from "lucide-react";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";

const skillsData = [
  {
    title: "ML & AI",
    icon: <BrainCircuit className="text-purple-400" size={28} />,
    items: ["Large Language Models", "Agentic AI", "Deep Learning", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Generative AI", "Multimodal Learning"]
  },
  {
    title: "Frameworks & Libraries",
    icon: <Cpu className="text-blue-400" size={28} />,
    items: ["LangChain", "LangGraph", "PyTorch", "TensorFlow", "Keras", "Scikit-learn", "Pandas", "NumPy", "HuggingFace", "JAX"]
  },
  {
    title: "Programming",
    icon: <Code2 className="text-emerald-400" size={28} />,
    items: ["Python", "SQL", "C", "C++", "Go"]
  },
  {
    title: "MLOps & Infrastructure",
    icon: <Container className="text-orange-400" size={28} />,
    items: ["Docker", "Kubernetes", "Model Deployment", "MLflow", "Airflow", "CI/CD", "Model Monitoring", "Amazon SageMaker", "Google Cloud Vertex AI", "Azure ML"]
  },
  {
    title: "Systems & Backend",
    icon: <Network className="text-cyan-400" size={28} />,
    items: ["Distributed Systems", "Model Serving", "System Design", "Data Pipelines", "REST APIs", "gRPC", "Apache Spark", "Kafka"]
  }
];

const publications = [
  {
    title: "Privacy-preserving distributed learning: Techniques, applications, and future challenges",
    authors: "P. Sharma et. al.",
    journal: "IEEE Potentials",
    doi: "https://doi.org/10.1109/MPOT.2026.3702285"
  },
  {
    title: "Modelling Behaviour of Sensors using a Novel beta-divergence based Adaptive Filter",
    authors: "P. Sharma et. al.",
    journal: "IEEE Sensors Journal",
    doi: "https://doi.org/10.1109/JSEN.2024.3448529"
  },
  {
    title: "A Novel Family of Robust Incremental Adaptive Algorithms for Distributed Estimation based on Bregman Divergence",
    authors: "P. Sharma et. al.",
    journal: "IEEE Sensors Letters",
    doi: "https://doi.org/10.1109/LSENS.2023.3296396"
  },
  {
    title: "Development of Amari Alpha Divergence based Gradient-Descent Least Mean Square Algorithm",
    authors: "P. Sharma et. al.",
    journal: "IEEE Transactions on Circuits and Systems II: Express Briefs",
    doi: "https://doi.org/10.1109/TCSII.2023.3257328"
  }
];

const systemStats = [
  { label: "LLMs", value: "GenAI Systems", icon: <BrainCircuit className="text-purple-400" size={18} /> },
  { label: "Training", value: "Scalable", icon: <Gauge className="text-emerald-400" size={18} /> },
  { label: "Deployment", value: "Production AI", icon: <Rocket className="text-blue-400" size={18} /> }
];

export default function Home() {
  const roleText = "AI Data Scientist @ Teradata";
  const [typedRole, setTypedRole] = useState("");
  const [profileVisits, setProfileVisits] = useState<number | null>(null);
  const [visitSource, setVisitSource] = useState("syncing");

  useEffect(() => {
    let index = 0;

    const typingTimer = window.setInterval(() => {
      index += 1;
      setTypedRole(roleText.slice(0, index));

      if (index === roleText.length) {
        window.clearInterval(typingTimer);
      }
    }, 75);

    return () => window.clearInterval(typingTimer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function syncProfileVisits() {
      const visitKey = "parth_portfolio_visit_registered";
      const hasVisited = window.localStorage.getItem(visitKey);
      const method = hasVisited ? "GET" : "POST";

      if (!hasVisited) {
        window.localStorage.setItem(visitKey, "true");
      }

      try {
        const response = await fetch("/api/profile-visits", {
          method,
          cache: "no-store"
        });
        const data = (await response.json()) as { count?: number; source?: string };

        if (isMounted) {
          setProfileVisits(typeof data.count === "number" ? data.count : null);
          setVisitSource(data.source === "persistent" ? "persistent" : "live session");
        }
      } catch {
        if (isMounted) {
          setVisitSource("offline");
        }
      }
    }

    syncProfileVisits();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] text-white font-sans selection:bg-blue-500/30">
      <SiteNav />

      <section className="relative flex min-h-screen items-center px-8 pb-20 pt-36">
        <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute right-0 top-28 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 shadow-[0_0_30px_-15px_rgba(59,130,246,0.9)]">
                <Terminal className="text-blue-300" size={20} />
              </div>
              <span className="font-mono text-sm uppercase tracking-[0.25em] text-blue-300">
                {typedRole}
                <span className="ml-1 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-blue-300" />
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
              Parth Sharma,
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
                Ph.D.
              </span>
            </h1>

            <p className="mb-8 max-w-3xl text-lg font-light leading-relaxed text-gray-400 md:text-xl">
              An ML engineer specializing in large language models and generative AI, with expertise in transformer architectures, scalable training, parameter-efficient fine-tuning, and production deployment of AI systems.
            </p>

            <div className="grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {systemStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gray-800 bg-[#161b22]/80 p-4">
                  <div className="mb-3">{stat.icon}</div>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-500">{stat.label}</p>
                  <p className="mt-1 font-bold text-gray-100">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] shadow-[0_0_70px_-35px_rgba(59,130,246,0.8)]">
              <div className="flex items-center justify-between border-b border-gray-800 bg-[#0d1117] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-gray-500">identity kernel</span>
              </div>

              <div className="space-y-5 p-6">
                <div className="rounded-xl border border-blue-400/20 bg-blue-500/5 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-blue-300">parth.sharma</span>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-300">ai mode</span>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    <p className="text-gray-500">&gt; <span className="text-blue-300">AI Data Scientist</span> @ <span className="text-cyan-300">Teradata</span></p>
                    <p className="text-gray-500">&gt; <span className="text-gray-200">ML Ph.D.</span> @ <span className="text-purple-300">IIT Roorkee</span></p>
                    <p className="text-gray-500">&gt; builds: <span className="text-gray-200">LLM systems, GenAI pipelines, scalable ML</span></p>
                    <p className="text-cyan-300">&gt; shipping models from research signal to production impact</p>
                  </div>
                </div>

                <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4 shadow-[0_0_28px_-22px_rgba(34,211,238,0.9)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">profile telemetry</span>
                    </div>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-200">
                      live
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-end gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">profile visits</p>
                      <p className="mt-1 font-mono text-3xl font-black text-white">
                        {profileVisits === null ? "--" : profileVisits.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <p className="text-gray-500">source</p>
                      <p className="mt-1 text-cyan-300">{visitSource}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["LLM/SLM", "Optimize"],
                    ["PEFT", "Adapt"],
                    ["MLOps", "Ship"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-gray-800 bg-[#0d1117] p-3 text-center font-mono text-xs">
                      <p className="text-gray-500">{label}</p>
                      <p className="mt-1 font-bold text-gray-300">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#0d1117] p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-200">
                    <GitBranch className="text-purple-400" size={18} />
                    Work signature
                  </div>
                  <div className="space-y-3">
                    {[
                      { step: "01", title: "Inference gets leaner", detail: "Quantization for low-latency, cost-efficient LLM/SLM serving", icon: <Gauge size={20} /> },
                      { step: "02", title: "Models get context", detail: "Multimodal AI with vision, spatial geometry, and domain signals", icon: <BrainCircuit size={20} /> },
                      { step: "03", title: "Pipelines get shipped", detail: "Data curation, training, evaluation, and deployment loops", icon: <Server size={20} /> }
                    ].map((node) => (
                      <div key={node.step} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#161b22] p-3">
                        <span className="font-mono text-xs text-blue-400">{node.step}</span>
                        <span className="text-cyan-300">{node.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-gray-100">{node.title}</p>
                          <p className="text-xs text-gray-500">{node.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="skills" className="relative z-10 mx-auto max-w-7xl border-t border-gray-800/50 px-8 py-24">
        <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-blue-400">Technical Stack</p>
            <h2 className="text-3xl font-bold md:text-4xl">Tools I Use to Build AI Systems</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-blue-300">
            <Layers3 size={16} />
            skills matrix
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {skillsData.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] p-7 transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_45px_-24px_rgba(59,130,246,0.8)] ${
                index < 3 ? "lg:col-span-2" : "lg:col-span-3"
              }`}
            >
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute right-5 top-5 font-mono text-xs text-gray-700">0{index + 1}</div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-gray-800 bg-[#0d1117] shadow-[0_0_30px_-18px_rgba(59,130,246,0.8)] transition-colors group-hover:border-blue-400/40">
                {category.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-100">{category.title}</h3>
              <div className="mb-6 h-1 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-70" />
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-gray-700/80 bg-[#0d1117] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-blue-400/50 hover:bg-blue-400/5 hover:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="publications" className="relative z-10 mx-auto mb-20 max-w-5xl border-t border-gray-800/50 px-8 py-24">
        <div className="absolute right-0 top-16 h-96 w-96 rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="relative mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-purple-400">Publications</p>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Selected Research Papers</h2>
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500" />
          </div>
          <div className="rounded-full border border-purple-400/20 bg-purple-400/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-purple-300">
            peer reviewed
          </div>
        </div>

        <div className="relative space-y-5">
          {publications.map((pub, index) => (
            <motion.article
              key={pub.doi}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15 }}
              className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] transition-all hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_0_45px_-24px_rgba(168,85,247,0.75)] sm:grid-cols-[96px_1fr]"
            >
              <div className="hidden border-r border-gray-800 bg-[#0d1117] p-6 sm:flex sm:flex-col sm:items-center sm:justify-center">
                <span className="mb-3 font-mono text-2xl font-black text-gray-700">0{index + 1}</span>
                <BookOpen className="text-gray-600 transition-colors group-hover:text-purple-400" size={24} />
              </div>
              <div className="p-7">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-purple-300">
                    {pub.journal}
                  </span>
                  <span className="font-mono text-xs text-gray-600 sm:hidden">0{index + 1}</span>
                </div>
                <a href={pub.doi} target="_blank" rel="noopener noreferrer" className="group/link mb-2 inline-flex items-start gap-2">
                  <h3 className="text-lg font-bold leading-snug text-gray-100 transition-colors group-hover/link:text-blue-400 md:text-xl">
                    {pub.title}
                  </h3>
                  <ExternalLink className="mt-1 flex-shrink-0 text-gray-600 transition-colors group-hover/link:text-blue-400" size={18} />
                </a>
                <div className="mt-4 flex flex-col gap-2 border-t border-gray-800 pt-4 font-mono text-sm sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-purple-400">{pub.authors}</span>
                  <span className="hidden text-gray-600 sm:inline">/</span>
                  <span className="text-gray-500">open DOI</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
