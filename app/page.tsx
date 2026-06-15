"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, BrainCircuit, Code2, Container, Network, Cpu, BookOpen, ExternalLink, Microscope } from "lucide-react";
import SiteNav from "./components/SiteNav";
import SocialFooter from "./components/SocialFooter";

// --- DATA PAYLOADS ---

const skillsData = [
  {
    title: "ML & AI",
    icon: <BrainCircuit className="text-purple-400 mb-4" size={28} />,
    items: ["Large Language Models", "Agentic AI", "Deep Learning", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "Generative AI", "Multimodal Learning"]
  },
  {
    title: "Frameworks & Libraries",
    icon: <Cpu className="text-blue-400 mb-4" size={28} />,
    items: ["LangChain", "LangGraph", "PyTorch", "TensorFlow", "Keras", "Scikit-learn", "Pandas", "NumPy", "HuggingFace", "JAX"]
  },
  {
    title: "Programming",
    icon: <Code2 className="text-emerald-400 mb-4" size={28} />,
    items: ["Python", "SQL", "C", "C++", "Go"]
  },
  {
    title: "MLOps & Infrastructure",
    icon: <Container className="text-orange-400 mb-4" size={28} />,
    items: ["Docker", "Kubernetes", "Model Deployment", "MLflow", "Airflow", "CI/CD", "Model Monitoring", "Amazon SageMaker", "Google Cloud Vertex AI", "Azure ML"]
  },
  {
    title: "Systems & Backend",
    icon: <Network className="text-cyan-400 mb-4" size={28} />,
    items: ["Distributed Systems", "Model Serving", "System Design", "Data Pipelines", "REST APIs", "gRPC", "Apache Spark", "Kafka"]
  },
  {
    title: "Research Area",
    icon: <Microscope className="text-pink-400 mb-4" size={28} />,
    items: [
      "LLM",
      "Multimodal",
      "Distributed Optimization",
      "Gradient Descent Algorithms",
      "Compressive Sensing",
      "Foundation Models"
    ]
  }
];

const publications = [
  {
    title: "Modelling Behaviour of Sensors using a Novel β-divergence based Adaptive Filter",
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

export default function Home() {
  const roleText = "AI Data Scientist @ Teradata";
  const [typedRole, setTypedRole] = useState("");

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

  return (
    <main className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-blue-500/30">
      <SiteNav />
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 text-center max-w-4xl mt-12"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-2 mb-6"
          >
            <Terminal className="text-blue-400" size={20} />
            <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">
              {typedRole}
              <span className="ml-1 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-blue-400" />
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Parth Sharma, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Ph.D.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            An ML engineer specializing in large language models and generative AI, with expertise in transformer architectures, scalable training, parameter-efficient fine-tuning, and production deployment of AI systems.
          </p>
        </motion.div>
      </section>

      {/* ================= SKILLS MATRIX ================= */}
      <section id="skills" className="py-24 px-8 max-w-7xl mx-auto relative z-10 border-t border-gray-800/50">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Stack</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#161b22] border border-gray-800 rounded-xl p-8 hover:border-blue-500/30 transition-colors"
            >
              {category.icon}
              <h3 className="text-xl font-bold mb-6 text-gray-100">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 bg-[#0d1117] border border-gray-700 text-gray-300 text-sm rounded-md hover:border-blue-500/50 hover:text-blue-400 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PUBLICATIONS ================= */}
      <section id="publications" className="py-24 px-8 max-w-5xl mx-auto relative z-10 border-t border-gray-800/50 mb-20">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected Publications</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full" />
        </div>

        <div className="space-y-6">
          {publications.map((pub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2 }}
              className="group flex gap-6 items-start bg-[#161b22] border border-gray-800 rounded-xl p-8 hover:border-purple-500/30 transition-all hover:shadow-[0_0_30px_-15px_rgba(168,85,247,0.2)]"
            >
              <div className="hidden sm:flex mt-1">
                <BookOpen className="text-gray-500 group-hover:text-purple-400 transition-colors" size={24} />
              </div>
              <div>
  <a 
    href={pub.doi} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="inline-flex items-start gap-2 mb-2 group/link"
  >
    <h3 className="text-lg md:text-xl font-semibold text-gray-200 leading-snug group-hover/link:text-blue-400 transition-colors">
      {pub.title}
    </h3>
    <ExternalLink className="text-gray-600 mt-1 flex-shrink-0 group-hover/link:text-blue-400 transition-colors" size={18} />
  </a>
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-mono">
                  <span className="text-purple-400">{pub.authors}</span>
                  <span className="hidden sm:inline text-gray-600">|</span>
                  <span className="text-gray-400 italic">in {pub.journal}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <SocialFooter />

    </main>
  );
}
