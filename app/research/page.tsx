"use client";

import { motion } from "framer-motion";
import {
  FileText, Globe2, Copyright,
  ExternalLink, Fingerprint, Network, BrainCircuit
} from "lucide-react";
import { useState } from "react";
import SiteNav from "../components/SiteNav";

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

export default function Research() {
  const [activeTab, setActiveTab] = useState("patents");

  return (
    <main className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-purple-500/30 pb-24">
      <SiteNav />

      {/* ================= HERO HEADER ================= */}
      <header className="max-w-5xl mx-auto px-8 pb-12 pt-36 relative">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Research & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Publications.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light max-w-3xl">
          Advancing the frontier of Machine Learning through innovative algorithms, resilient architecture, and robust optimization techniques.
        </p>
      </header>

      {/* ================= TAB NAVIGATION ================= */}
      <section className="max-w-5xl mx-auto px-8 mb-12 relative z-10">
        <div className="flex flex-wrap gap-4 border-b border-gray-800 pb-4">
          <button
            onClick={() => setActiveTab("patents")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-mono text-sm transition-all ${activeTab === "patents" ? "bg-purple-500/10 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
          >
            <Copyright size={18} />
            <span>Patents ({patents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("journals")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-mono text-sm transition-all ${activeTab === "journals" ? "bg-blue-500/10 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
          >
            <FileText size={18} />
            <span>Journals ({journals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("conferences")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-mono text-sm transition-all ${activeTab === "conferences" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patents.map((patent, index) => (
              <div key={index} className="bg-[#161b22] border border-gray-800 rounded-xl p-8 hover:border-purple-500/30 transition-colors group flex flex-col">
                <div className="mb-4 bg-[#0d1117] w-12 h-12 rounded-lg flex items-center justify-center border border-gray-800">
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
              <div key={index} className="bg-[#161b22] border border-gray-800 rounded-xl p-8 hover:border-blue-500/30 transition-all group flex flex-col md:flex-row gap-6 md:items-stretch">
                <div className="hidden md:flex flex-col items-center justify-center min-w-[80px] border-r border-gray-800 pr-6">
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
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded">IF: {journal.if}</span>
                    <span className="text-gray-500 italic">{journal.journal}</span>
                    <span className="text-gray-400 md:hidden">{journal.year}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Book Chapter Included in Journals for cleanliness */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 hover:border-orange-500/30 transition-all group flex flex-col md:flex-row gap-6 md:items-stretch">
              <div className="hidden md:flex flex-col items-center justify-center min-w-[80px] border-r border-gray-800 pr-6">
                <span className="text-2xl font-black text-gray-700">2021</span>
              </div>
              <div className="flex-grow">
                <a href="https://doi.org/10.1007/978-981-16-1295-4_35" target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 mb-2 group/link">
                  <h3 className="text-lg md:text-xl font-bold text-gray-200 leading-snug group-hover/link:text-orange-400 transition-colors">HMM Model for Brain Tumor Detection and Classification.</h3>
                  <ExternalLink className="text-gray-600 mt-1 flex-shrink-0 group-hover/link:text-orange-400 transition-colors" size={18} />
                </a>
                <p className="text-sm text-gray-400 mb-4">Parth Sharma and Rakesh Sharma</p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className="px-2 py-1 bg-orange-500/10 text-orange-300 border border-orange-500/20 rounded">Book Chapter</span>
                  <span className="text-gray-500 italic">Springer Intelligent Computing and Communication Systems</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CONFERENCES TAB */}
        {activeTab === "conferences" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {conferences.map((conf, index) => (
              <div key={index} className="bg-[#161b22] border border-gray-800 rounded-lg p-6 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row gap-6">
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
    </main>
  );
}
