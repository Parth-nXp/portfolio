"use client";

import { motion } from "framer-motion";
import {
  FileText, Globe2, Copyright,
  ExternalLink, Fingerprint, Network, BrainCircuit
} from "lucide-react";
import { useState } from "react";
import SiteNav from "../components/SiteNav";
import SocialFooter from "../components/SocialFooter";

// ==========================================
// DATA PAYLOADS
// ==========================================

const patents = [
  {
    title: "Method and System for Scene Aware Coverage Prediction using Vision Transformer.",
    authors: "Parth Sharma, Shubham Khunteta, Yeswanth Reddy Guddeti, Akash Agarwal, and Ashok Kumar Reddy Chavva",
    year: "2025",
    id: "Provisional Filed No. 202541056211",
    icon: <Fingerprint className="text-purple-400" size={24} />
  },
  {
    title: "Large Wireless Channel Model: Generating Site-Specific Wireless Channel based on Site Context using a novel Wireless-AI-Transformer.",
    authors: "Shubham Khunteta, Yeswanth Reddy Guddeti, Parth Sharma, Ashok Kumar Reddy Chavva, Akash Agarwal, Anshuman Nigam, and Akshay Dharamraj C.",
    year: "2025",
    id: "Provisional Filed No. 202541055579",
    icon: <Network className="text-blue-400" size={24} />
  },
  {
    title: "Representing Multipath Component with Embedding Vector.",
    authors: "Shubham Khunteta, Parth Sharma, Yeswanth Reddy Guddeti, and Ashok Kumar Reddy Chavva",
    year: "2025",
    id: "Provisional Filed No. 202541062485",
    icon: <BrainCircuit className="text-emerald-400" size={24} />
  }
];

const journals = [
  {
    title: "Block Amari Alpha Least Mean Square Algorithm based Channel Estimation.",
    authors: "Shekhar Pratap Singh, Parth Sharma, and Pyari Mohan Pradhan",
    journal: "AEU - International Journal of Electronics and Communications",
    year: "2025",
    if: "3.2",
    link: "https://doi.org/10.1016/j.aeue.2025.156011"
  },
  {
    title: "Amari Alpha Divergence based Channel Estimation for Pilot Contaminated Multicell MIMO system.",
    authors: "Shekhar Pratap Singh, Parth Sharma and Pyari Mohan Pradhan",
    journal: "IEEE Communications Letters",
    year: "2024",
    if: "4.4",
    link: "https://doi.org/10.1109/lcomm.2024.3492280"
  },
  {
    title: "MQTT based Adaptive Estimation over Distributed Network using Raspberry Pi Pico W.",
    authors: "Prantaneel Debnath, Anshul Gusain, Parth Sharma, and Pyari Mohan Pradhan",
    journal: "IEEE Embedded Systems Letters",
    year: "2024",
    if: "2.0",
    link: "https://doi.org/10.1109/les.2024.3473017"
  },
  {
    title: "Modelling Behaviour of Sensors using a Novel beta-divergence based Adaptive Filter.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    journal: "IEEE Sensors Journal",
    year: "2024",
    if: "4.5",
    link: "https://doi.org/10.1109/JSEN.2024.3448529"
  },
  {
    title: "A Novel Family of Robust Incremental Adaptive Algorithms for Distributed Estimation based on Bregman Divergence.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    journal: "IEEE Sensors Letters",
    year: "2023",
    if: "2.2",
    link: "https://doi.org/10.1109/LSENS.2023.3296396"
  },
  {
    title: "Development of Amari Alpha Divergence based Gradient-Descent Least Mean Square Algorithm.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    journal: "IEEE Transactions on Circuits and Systems II: Express Briefs",
    year: "2023",
    if: "4.9",
    link: "https://doi.org/10.1109/TCSII.2023.3257328"
  }
];

const conferences = [
  {
    title: "Hardware Implementation of Distributed LMS Strategies for Efficient Wireless Sensor Network Estimation.",
    authors: "Parth Sharma*, Prem Chand Panwar*, and Pyari Mohan Pradhan (*Equal Contribution)",
    venue: "IEEE 2nd International Conference on Communication Engineering and Emerging Technologies (ICoCET), Kuala Lumpur, Malaysia",
    year: "2025",
    link: "https://doi.org/10.1109/ICoCET66176.2025.11233169"
  },
  {
    title: "Quantum-Secured Decentralized Diffusion Strategy for Facial Keypoint Detection in Multi-Agent Systems.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    venue: "IEEE 2nd International Conference on Communication Engineering and Emerging Technologies (ICoCET), Kuala Lumpur, Malaysia",
    year: "2025",
    link: "https://doi.org/10.1109/ICoCET66176.2025.11232693"
  },
  {
    title: "BrainDiffU-Net: A Distributed Diffusion-Based U-Net for Brain Tumor Segmentation.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    venue: "34th International Conference on Computer Theory and Applications (ICCTA), Alexandria, Egypt",
    year: "2024",
    link: "https://doi.org/10.1109/ICCTA64612.2024.10974899"
  },
  {
    title: "Dynamic Fourier Federated Learning for Fully Connected Distributed Network.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    venue: "18th IEEE International Conference on Advanced Networks and Telecommunications Systems (ANTS), Guwahati, India",
    year: "2024",
    link: "https://doi.org/10.1109/ANTS63515.2024.10898568"
  },
  {
    title: "Sparse Channel Modelling in IoT Networks using Diffusion beta-Divergence based Block Proportionate NLMS Algorithm.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    venue: "18th IEEE International Conference on Advanced Networks and Telecommunications Systems (ANTS), Guwahati, India",
    year: "2024",
    link: "https://doi.org/10.1109/ANTS63515.2024.10898800"
  },
  {
    title: "Enhanced Security Framework for MQTT Protocol based IoT Network using Quantum Key Distribution.",
    authors: "Sawdah Farooq, Parth Sharma and Pyari Mohan Pradhan",
    venue: "IEEE 27th International Symposium on Wireless Personal Multimedia Communications (WPMC), Greater Noida, India",
    year: "2024",
    link: "https://doi.org/10.1109/WPMC63271.2024.10863467"
  },
  {
    title: "Bregman Divergence Based Approach for Adaptive System Identification and Line Enhancement.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    venue: "IEEE 3rd International Conference on Power, Control and Computing Technologies (ICPC2T), Raipur, India",
    year: "2024",
    link: "https://doi.org/10.1109/ICPC2T60072.2024.10474616"
  },
  {
    title: "A Hybrid CDG-CSF Based Approach for Enhancing Lifetime of Wireless Sensor Network.",
    authors: "Ghodke Vijay Kumar, Parth Sharma, and Pyari Mohan Pradhan",
    venue: "IEEE 7th International Conference on Computer Applications in Electrical Engineering-Recent Advances (CERA), Roorkee, India",
    year: "2023",
    link: "https://doi.org/10.1109/CERA59325.2023.10455557"
  },
  {
    title: "Robust adaptive system identification and noise filtering using Bregman divergence based algorithms.",
    authors: "Parth Sharma and Pyari Mohan Pradhan",
    venue: "IEEE International Conference on Electrical, Electronics, Communication and Computers (ELEXCOM), Roorkee, India",
    year: "2023",
    link: "https://doi.org/10.1109/ELEXCOM58812.2023.10370461"
  },
  {
    title: "Hardware implementation and comparison of IoT Data Protocol for Home Automation Application.",
    authors: "Parth Sharma, Ishan Pandey, and Pyari Mohan Pradhan",
    venue: "IEEE Delhi Section International Conference on Electrical, Electronics and Computer Engineering (DELCON), New Delhi, India",
    year: "2022",
    link: "https://doi.org/10.1109/DELCON54057.2022.9752957"
  }
];

const bookChapters = [
  {
    title: "HMM Model for Brain Tumor Detection and Classification.",
    authors: "Parth Sharma and Rakesh Sharma",
    publisher: "Springer Intelligent Computing and Communication Systems",
    year: "2021",
    link: "https://doi.org/10.1007/978-981-16-1295-4_35"
  }
];

const researchStats = [
  { label: "Patents", value: patents.length, accent: "text-purple-300" },
  { label: "Journals", value: journals.length, accent: "text-blue-300" },
  { label: "Books", value: bookChapters.length, accent: "text-orange-300" },
  { label: "Conferences", value: conferences.length, accent: "text-emerald-300" }
];

const scholarUrl = "https://scholar.google.com/citations?user=Dw0a4zgAAAAJ&hl=en&authuser=1";

export default function Research() {
  const [activeTab, setActiveTab] = useState("patents");

  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] text-white font-sans selection:bg-purple-500/30 pb-24">
      <SiteNav />

      {/* ================= HERO HEADER ================= */}
      <header className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-8 pb-16 pt-36 lg:grid-cols-[1fr_0.8fr]">
        <div className="absolute left-1/2 top-24 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute right-0 top-28 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-500/10 shadow-[0_0_30px_-15px_rgba(168,85,247,0.9)]">
              <FileText className="text-purple-300" size={20} />
            </div>
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-purple-300">Research Kernel</span>
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl">
            Research &
            <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Publications.
            </span>
          </h1>
          <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-400 md:text-xl">
            Advancing machine learning through robust optimization, distributed intelligence, adaptive algorithms, multimodal AI, and production-relevant model systems.
          </p>

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {researchStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-gray-800 bg-[#161b22]/80 p-4">
                <p className={`font-mono text-3xl font-black ${stat.accent}`}>{stat.value}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative z-10">
          <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] p-6 shadow-[0_0_70px_-35px_rgba(168,85,247,0.85)]">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/10" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/10" />

            <div className="relative z-10 rounded-2xl border border-purple-400/20 bg-[#0d1117]/90 p-6 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/10">
                <BrainCircuit className="text-purple-300" size={30} />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-purple-300">Research Graph</p>
              <h2 className="mt-3 text-2xl font-bold">Algorithms to AI Systems</h2>
              <a
                href={scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 block rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-left transition-all hover:border-blue-300/40 hover:bg-blue-500/15"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-300">Google Scholar</p>
                    <p className="mt-1 text-lg font-black text-white">Live Citation Count</p>
                  </div>
                  <ExternalLink className="text-blue-300 transition-transform group-hover:translate-x-1" size={18} />
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-800 bg-[#0d1117]/80 px-4 py-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-gray-500">source</span>
                  <span className="font-mono text-sm font-bold text-blue-300">opens live profile</span>
                </div>
              </a>
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
              {["Patents", "Journals", "Books", "Conferences"].map((label) => (
                <div key={label} className="rounded-xl border border-gray-800 bg-[#0d1117] p-4 text-center font-mono text-sm font-bold uppercase tracking-widest text-gray-300">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      {/* ================= TAB NAVIGATION ================= */}
      <section className="max-w-5xl mx-auto px-8 mb-12 relative z-10">
        <div className="flex flex-wrap gap-3 rounded-full border border-gray-800/70 bg-[#0b1220]/70 p-2 shadow-[0_0_35px_-25px_rgba(168,85,247,0.9)] backdrop-blur">
          <button
            onClick={() => setActiveTab("patents")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-mono text-sm transition-all ${activeTab === "patents" ? "bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-[0_0_20px_-14px_rgba(168,85,247,0.9)]" : "text-gray-400 hover:text-white hover:bg-gray-800/70"}`}
          >
            <Copyright size={18} />
            <span>Patents ({patents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("journals")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-mono text-sm transition-all ${activeTab === "journals" ? "bg-blue-500/10 text-blue-300 border border-blue-500/30 shadow-[0_0_20px_-14px_rgba(59,130,246,0.9)]" : "text-gray-400 hover:text-white hover:bg-gray-800/70"}`}
          >
            <FileText size={18} />
            <span>Journals ({journals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("books")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-mono text-sm transition-all ${activeTab === "books" ? "bg-orange-500/10 text-orange-300 border border-orange-500/30 shadow-[0_0_20px_-14px_rgba(249,115,22,0.9)]" : "text-gray-400 hover:text-white hover:bg-gray-800/70"}`}
          >
            <FileText size={18} />
            <span>Book Chapters ({bookChapters.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("conferences")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-mono text-sm transition-all ${activeTab === "conferences" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_20px_-14px_rgba(16,185,129,0.9)]" : "text-gray-400 hover:text-white hover:bg-gray-800/70"}`}
          >
            <Globe2 size={18} />
            <span>Conferences ({conferences.length})</span>
          </button>
        </div>
      </section>

      {/* ================= CONTENT RENDERING ================= */}
      <section className="max-w-5xl mx-auto px-8 relative z-10">

        {/* PATENTS TAB */}
        {activeTab === "patents" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {patents.map((patent, index) => (
              <div key={index} className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] p-8 transition-all hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_0_45px_-24px_rgba(168,85,247,0.75)]">
                <div className="absolute right-5 top-5 font-mono text-xs text-gray-700">0{index + 1}</div>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-gray-800 bg-[#0d1117] shadow-[0_0_30px_-18px_rgba(168,85,247,0.8)]">
                  {patent.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-200 group-hover:text-white leading-snug">{patent.title}</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-grow">{patent.authors}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-800/50 font-mono text-xs">
                  <span className="text-purple-400">{patent.id}</span>
                  <span className="px-2 py-1 bg-[#0d1117] border border-gray-700 rounded text-gray-400">{patent.year}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* JOURNALS TAB */}
        {activeTab === "journals" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {journals.map((journal, index) => (
              <div key={index} className="group flex flex-col gap-6 overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] p-8 transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_45px_-24px_rgba(59,130,246,0.75)] md:flex-row md:items-stretch">
                <div className="hidden min-w-[80px] flex-col items-center justify-center border-r border-gray-800 pr-6 md:flex">
                  <span className="text-2xl font-black text-gray-700">{journal.year}</span>
                </div>
                <div className="flex-grow">
                  {journal.link ? (
                    <a href={journal.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 mb-2 group/link">
                      <h3 className="text-lg md:text-xl font-bold text-gray-200 leading-snug group-hover/link:text-blue-400 transition-colors">{journal.title}</h3>
                      <ExternalLink className="text-gray-600 mt-1 flex-shrink-0 group-hover/link:text-blue-400 transition-colors" size={18} />
                    </a>
                  ) : (
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-200 leading-snug">{journal.title}</h3>
                  )}
                  <p className="text-sm text-gray-400 mb-4">{journal.authors}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">IF: {journal.if}</span>
                    <span className="text-gray-500 italic">{journal.journal}</span>
                    <span className="text-gray-400 md:hidden">{journal.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* BOOK CHAPTERS TAB */}
        {activeTab === "books" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {bookChapters.map((chapter) => (
              <div key={chapter.link} className="group flex flex-col gap-6 overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] p-8 transition-all hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_0_45px_-24px_rgba(249,115,22,0.75)] md:flex-row md:items-stretch">
                <div className="hidden min-w-[80px] flex-col items-center justify-center border-r border-gray-800 pr-6 md:flex">
                  <span className="text-2xl font-black text-gray-700">{chapter.year}</span>
                </div>
                <div className="flex-grow">
                  <a href={chapter.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 mb-2 group/link">
                    <h3 className="text-lg md:text-xl font-bold text-gray-200 leading-snug group-hover/link:text-orange-400 transition-colors">{chapter.title}</h3>
                    <ExternalLink className="text-gray-600 mt-1 flex-shrink-0 group-hover/link:text-orange-400 transition-colors" size={18} />
                  </a>
                  <p className="text-sm text-gray-400 mb-4">{chapter.authors}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 shadow-[0_0_22px_-12px_rgba(249,115,22,0.9)]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-300 text-[11px] font-black leading-none text-[#101722]">
                        S
                      </span>
                      <span className="font-serif text-sm font-semibold normal-case tracking-normal text-orange-200">
                        Springer
                      </span>
                    </span>
                    <span className="text-gray-500 italic">{chapter.publisher}</span>
                    <span className="text-gray-400 md:hidden">{chapter.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* CONFERENCES TAB */}
        {activeTab === "conferences" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {conferences.map((conf, index) => (
              <div key={index} className="flex flex-col gap-6 overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_0_45px_-24px_rgba(16,185,129,0.75)] md:flex-row">
                <div className="hidden md:flex flex-col items-center justify-center min-w-[80px] border-r border-gray-800 pr-6">
                  <span className="text-2xl font-black text-gray-700">{conf.year}</span>
                </div>
                <div>
                  <a href={conf.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 mb-2 group/link">
                    <h3 className="text-lg font-bold text-gray-200 leading-snug group-hover/link:text-emerald-400 transition-colors">{conf.title}</h3>
                    <ExternalLink className="text-gray-600 mt-1 flex-shrink-0 group-hover/link:text-emerald-400 transition-colors" size={16} />
                  </a>
                  <p className="text-sm text-gray-400 mb-2">{conf.authors}</p>
                  <div className="flex items-start gap-2">
                    <Globe2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={14} />
                    <span className="text-xs text-gray-500 font-mono leading-relaxed">{conf.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </section>
      <SocialFooter />
    </main>
  );
}
