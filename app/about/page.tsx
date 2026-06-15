"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Award,
  BookCheck,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Database,
  Gauge,
  GraduationCap,
  Mic,
  Presentation,
  Rocket,
  Users
} from "lucide-react";
import SiteNav from "../components/SiteNav";
import SocialFooter from "../components/SocialFooter";

const experience = [
  {
    role: "AI Data Scientist",
    company: "Teradata",
    location: "Remote",
    time: "Apr 2026 - Present",
    bullets: [
      "Optimizing LLM/SLM inference with advanced quantization to achieve scalable, low-latency, cost-efficient production AI."
    ],
    stack: []
  },
  {
    role: "Ph.D. Research Intern",
    company: "Samsung R&D Institute India",
    location: "Bengaluru",
    time: "Feb 2025 - Nov 2025",
    bullets: [
      "Designed a multimodal foundation model (ALIGN) integrating visual scene features and spatial geometry for location-specific channel generation; led to an IP filing and advancement to the second round of the Samsung Best Paper Award (SBPA).",
      "Built a transformer-style multi-task encoder-decoder (MPC2Vec) for multipath representation, unifying embedding learning, path presence classification, and regression; led to an IP filing.",
      "Developed Vision Transformer-based architectures for spatial AI tasks in coverage prediction, combining scene images with transmitter-conditioned inputs for robust cross-site generalization; led to an IP filing.",
      "Proposed a roadmap for a domain-adapted large language model (ModemInsight) leveraging multimodal telecom log data to automate bug triage, failure analysis, and Q&A in Beyond-5G systems."
    ],
    stack: ["PyTorch", "Hugging Face", "Sionna (NVIDIA)", "OpenCV", "Pandas", "torchvision", "NumPy", "Timm", "LoRA/QLoRA", "LlamaIndex"]
  },
  {
    role: "Junior Research Fellow",
    company: "Indian Institute of Technology Roorkee",
    location: "Roorkee",
    time: "Nov 2020 - Aug 2022",
    bullets: [
      "Project: Design and Development of IoT-based Smart Home Automation System (Sponsored by Sikonic Holding Co. Ltd., South Korea).",
      "Designed and developed hardware-software solutions for smart home automation, integrating low-cost sensors, embedded controllers, and IoT connectivity.",
      "Evaluated and compared IoT communication protocols (MQTT, CoAP, HTTP) for low-latency, reliable automation applications.",
      "Built a functional Android application for device control using MIT App Inventor.",
      "Mentored and collaborated with interns to deliver a complete end-to-end prototype for the industry sponsor."
    ],
    stack: ["C / C++", "Arduino IDE", "Eclipse Mosquitto", "Wireshark", "MIT App Inventor"]
  },
  {
    role: "Summer Intern",
    company: "Wipro Consumer Care & Lighting",
    location: "India",
    time: "May 2017 - Jul 2017",
    bullets: [
      "Gained hands-on exposure to lighting production systems and equipment operation, ensuring compliance with safety and quality standards.",
      "Learned fundamentals of industrial process management and equipment maintenance in a large-scale manufacturing environment."
    ],
    stack: ["SAP ERP", "CMMS", "Microsoft Excel", "SCADA Systems", "Six Sigma", "ISO Compliance"]
  }
];

const education = [
  {
    degree: "Ph.D in Communication, Network & Signal Processing (ECE)",
    institution: "Indian Institute of Technology Roorkee",
    institutionUrl: "https://www.iitr.ac.in/",
    time: "Feb 2021 - Nov 2025",
    supervisor: "Prof. Pyari Mohan Pradhan",
    supervisorUrl: "https://ece.iitr.ac.in/pyari-mohan-pradhan/",
    thesis: "Information-Theoretic Divergence Measure based Algorithms for Adaptive Filtering and Distributed Estimation.",
    bullets: [
      "Developed a novel gradient descent optimization algorithm using Amari-alpha divergence to robustly train machine learning models under error-in-variables (EIV) conditions, ensuring stable parameter learning even when both features and labels are corrupted by noise.",
      "Created a beta-divergence-driven loss function and optimization scheme to train machine learning models with high robustness and low complexity, enabling reliable learning under non-Gaussian and heavy-tailed data distributions in real-time AI systems.",
      "Developed divergence-based distributed optimization algorithms using generalized Bregman divergences to enable stable and accurate decentralized training of machine learning models under impulsive noise and adversarial disturbances.",
      "Introduced sparsity-aware and block-sparse distributed learning frameworks that exploit structured sparsity to accelerate convergence and minimize communication, enabling efficient training of large-scale AI models in tasks such as echo cancellation and sparse system identification.",
      "Implemented a communication-efficient distributed training scheme that integrates gradient compression and selective aggregation, reducing bandwidth cost while preserving accuracy in large-scale decentralized AI systems.",
      "Published 6 journal articles and 10 IEEE conference papers on distributed and decentralized AI, with 6 additional journals and 1 patent currently under review."
    ],
    stack: ["MATLAB", "NumPy", "Wolfram Mathematica", "NetworkX", "PyTorch", "TensorFlow", "padasip", "LaTeX", "Git / GitHub"]
  },
  {
    degree: "M.Tech in Communication Systems & Networks (ECE)",
    institution: "National Institute of Technology Hamirpur",
    institutionUrl: "https://www.nith.ac.in/",
    time: "Aug 2018 - May 2020",
    supervisor: "Prof. Rakesh Sharma",
    supervisorUrl: "https://portfolios.nith.ac.in/index.php?/nith/sh-rakesh-sharma685",
    thesis: "Analysis of Machine Learning Algorithms for Brain Tumor Detection.",
    bullets: [
      "Designed a Hidden Markov Model (HMM) for brain tumor detection on the BRATS 2013 dataset, published as a book chapter in Springer's Intelligent Computing and Communication Systems (2021).",
      "Built a deep learning model using U-Net for tumor segmentation on the LGG MRI dataset, achieving strong Dice scores and robustness to variations in tumor shape, size, and location."
    ],
    stack: ["Keras", "TensorFlow", "NiBabel", "MATLAB", "Scikit-learn", "Hmmlearn", "OpenCV", "PyTorch"]
  },
  {
    degree: "B.Tech in Electronics & Communication Engineering",
    institution: "JN Government Engineering College Sundernagar",
    institutionUrl: "http://www.jngec.ac.in/",
    time: "Aug 2014 - May 2018",
    thesis: "Facial Keypoint Detection System.",
    bullets: [
      "Built a deep learning model using MobileNetV2 with direct coordinate regression on the LaPa dataset for facial keypoint detection, achieving robustness against occlusions, illumination changes, and age diversity."
    ],
    stack: ["Keras", "TensorFlow", "Caffe", "OpenCV", "Dlib", "NumPy", "Pandas"]
  }
];

const linkedNames = {
  "Indian Institute of Technology Roorkee": "https://www.iitr.ac.in/",
  "IIT Roorkee": "https://www.iitr.ac.in/",
  "National Institute of Technology Hamirpur": "https://www.nith.ac.in/",
  "NIT Hamirpur": "https://www.nith.ac.in/",
  "JN Government Engineering College Sundernagar": "http://www.jngec.ac.in/",
  "MRA DAV Public School": "https://mradavsolan.net.in/",
  "DAV Centenary Public School": "http://davschoolrajgarh.com/",
  "Sawdah Farooq": "https://www.linkedin.com/in/sawdah-farooq-237a91204/",
  "Anshul Gusain": "https://www.linkedin.com/in/anshul-gusain-50368b237/",
  "Prantaneel Debnath": "https://www.linkedin.com/in/prantaneel/",
  "Prem Chand Panwar": "https://www.linkedin.com/in/prem-panwar-9a72b415a/",
  "Gorla Pavan Kumar Reddy": "https://www.linkedin.com/in/gorla-pavan-kumar-reddy-71902917b/",
  "Sahil Singh Balyan": "https://www.linkedin.com/in/sahil-singh-balyan-4933101b2/",
  "Ishan Pandey": "https://www.linkedin.com/in/ishan-pandey-106977174/"
};

const achievements = [
  "Best Paper Award at 2025 IEEE 2nd International Conference on Communication Engineering and Emerging Technologies (ICoCET 2025), Kuala Lumpur, Malaysia.",
  "Abstract shortlisted for the second round of the prestigious Samsung Best Paper Awards (SBPA); invited to submit full paper.",
  "Student Travel Grant ($100) from IEEE Communication Society for attending IEEE ANTS 2024.",
  "Mukhyamantri Protsahan Yojana Scholarship (INR 75,000) from Himachal Pradesh Government (2022).",
  "94.85 Percentile in Graduate Aptitude Test in Engineering (GATE) 2018.",
  "Second Position in Robosprint Event (2015).",
  "95.76 Percentile in Joint Entrance Examination (JEE) Main 2014.",
  "BUEST Master Mind-Himachal Level II Winner (Scholarship worth INR 25,000 in 2014)."
];

const scientificRoles = [
  "IEEE Transactions on Signal Processing",
  "IEEE Sensors Journal",
  "IEEE Transactions on Circuits and Systems II: Express Briefs",
  "Journal on Advances in Signal Processing (Springer)",
  "EURASIP Journal on Wireless Communications and Networking (Springer)",
  "Signal, Image and Video Processing (Springer)",
  "International Journal of Sensors and Sensor Networks",
  "The World Conference on Computational Science and Technology (WcCST-2026)",
  "International Conference on Smart Technologies and Intelligent Computing (INCSTIC-2025)",
  "IEEE International Conference on Advancement in Computation & Computer Technologies (InCACCT-2025)",
  "International Conference on Artificial Intelligence, Device Computing, Communication, and Signal Processing (AIDCCSP 2024)",
  "IEEE International Conference on Electrical, Electronics, Communication and Computers (ELEXCOM'23)"
];

const leadership = [
  {
    category: "Mentorship",
    items: [
      "Internship (Sawdah Farooq): Security enhancement in MQTT protocol using QKD.",
      "B.Tech Project (Anshul Gusain, Prantaneel Debnath): Secured MQTT based Distributed Tracking over WSN - Hardware Implementation.",
      "M.Tech Thesis (Prem Chand Panwar): Hardware Implementation of Parameter Estimation over WSN.",
      "M.Tech Thesis (Gorla Pavan Kumar Reddy): Kernel Function based Gradient Descent Constrained LMS Algorithm.",
      "B.Tech LBP (Anshul Gusain): Hardware Implementation of Consensus Algorithm over WSN.",
      "SPARK Internship (Sahil Singh Balyan): IoT based Home Automation Realization using MQTT.",
      "Internship (Ishan Pandey): Comparison of IoT Protocols for the Application of Home Automation."
    ]
  },
  {
    category: "Teaching Assistantships",
    items: [
      "Adaptive Signal Processing (ECN-614) @ IIT Roorkee",
      "Digital Communication and Signal Processing Techniques (ECN-510) @ IIT Roorkee",
      "Digital Communication Laboratory (ECN-510) @ IIT Roorkee",
      "Electronics Engineering Lab (EC-101) @ NIT Hamirpur",
      "Digital Signal Processing Lab (EC-317) @ NIT Hamirpur"
    ]
  }
];

const aboutStats = [
  { label: "Current Role", value: "AI Data Scientist", icon: <Rocket className="text-blue-400" size={18} /> },
  { label: "Core Work", value: "LLM Systems", icon: <BrainCircuit className="text-purple-400" size={18} /> },
  { label: "Pipeline", value: "Data to Deploy", icon: <Database className="text-cyan-400" size={18} /> }
];

export default function AboutPage() {
  const renderLinkedText = (text: string) => {
    const names = Object.keys(linkedNames).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(${names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

    return text.split(pattern).map((part, index) => {
      const href = linkedNames[part as keyof typeof linkedNames];

      if (!href) {
        return part;
      }

      return (
        <a
          key={`${part}-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 transition-colors hover:text-cyan-200 hover:underline"
        >
          {part}
        </a>
      );
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1117] pb-24 text-white font-sans selection:bg-blue-500/30">
      <SiteNav />

      <header className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-8 pb-20 pt-36 lg:grid-cols-[1fr_0.85fr]">
        <div className="absolute left-1/2 top-28 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute right-0 top-28 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 shadow-[0_0_30px_-15px_rgba(59,130,246,0.9)]">
              <BrainCircuit className="text-blue-300" size={20} />
            </div>
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-blue-300">
              AI Engineer Profile
            </span>
          </div>

          <h1 className="mb-8 text-5xl font-extrabold tracking-tight md:text-6xl">
            I turn model ideas into
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
              production AI systems.
            </span>
          </h1>

          <div className="max-w-3xl space-y-5 text-lg font-light leading-relaxed text-gray-300">
            <p>
              I am Parth, an AI Data Scientist focused on LLMs, generative AI, scalable training, evaluation, and production deployment. My work sits at the point where model quality, system performance, and real business use cases meet.
            </p>
            <p className="font-medium text-white">
              I like building AI pipelines that are not just impressive in demos, but measurable, reliable, optimized, and ready for teams to use.
            </p>
          </div>

          <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {aboutStats.map((stat) => (
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
          className="relative z-10"
        >
          <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] p-6 shadow-[0_0_70px_-35px_rgba(59,130,246,0.8)]">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/10" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />

            <div className="relative z-10 rounded-2xl border border-blue-400/20 bg-[#0d1117]/90 p-6 text-center shadow-[0_0_45px_-28px_rgba(59,130,246,0.9)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10">
                <BrainCircuit className="text-cyan-300" size={30} />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-300">Profile Core</p>
              <h2 className="mt-3 text-2xl font-bold">LLM Systems + MLOps</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Building the loop from data to model to deployed AI product.
              </p>
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
              {[
                ["LLM", "text-purple-300"],
                ["GenAI", "text-blue-300"],
                ["Eval", "text-emerald-300"],
                ["Deploy", "text-cyan-300"]
              ].map(([label, color]) => (
                <div key={label} className="rounded-xl border border-gray-800 bg-[#0d1117] p-4 text-center">
                  <p className={`font-mono text-sm font-bold uppercase tracking-widest ${color}`}>{label}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-6 rounded-xl border border-gray-800 bg-[#0d1117] p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-200">
                <Gauge className="text-purple-400" size={18} />
                operating principles
              </div>
              <div className="space-y-3">
                {["Measure model behavior", "Optimize inference paths", "Ship reliable AI"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#161b22] p-3">
                    <span className="font-mono text-xs text-blue-400">0{index + 1}</span>
                    <span className="text-sm font-bold text-gray-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <section className="relative mx-auto max-w-6xl border-t border-gray-800/50 px-8 py-20">
        <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="relative mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-blue-400">Experience</p>
            <h2 className="text-3xl font-bold md:text-4xl">AI Engineering Timeline</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-blue-300">
            <Briefcase size={16} />
            production path
          </div>
        </div>

        <div className="relative space-y-6">
          {experience.map((exp, index) => (
            <motion.div
              key={`${exp.role}-${exp.company}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_45px_-24px_rgba(59,130,246,0.75)] md:grid-cols-[150px_1fr]">
                <div className="border-b border-gray-800 bg-[#0d1117] p-6 md:border-b-0 md:border-r">
                  <span className="mb-3 block font-mono text-2xl font-black text-gray-700">0{index + 1}</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-blue-400">{exp.time}</span>
                </div>

                <div className="p-7">
                  <h3 className="mb-1 text-2xl font-bold text-white">{exp.role}</h3>
                  <h4 className="mb-5 text-lg text-gray-400">
                    {exp.company} <span className="ml-2 text-sm text-gray-600">({exp.location})</span>
                  </h4>

                  <ul className="mb-6 space-y-3">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start space-x-3 text-gray-300">
                        <ChevronRight className="mt-1 flex-shrink-0 text-blue-500" size={16} />
                        <span className="text-sm leading-relaxed md:text-base">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-gray-800/50 pt-4">
                      {exp.stack.map((tech) => (
                        <span key={tech} className="rounded-full border border-gray-700/80 bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-gray-400 transition-colors hover:border-blue-400/50 hover:text-blue-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl border-t border-gray-800/50 px-8 py-20">
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="relative mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-purple-400">Education</p>
            <h2 className="text-3xl font-bold md:text-4xl">Academic Foundation</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-purple-300">
            <GraduationCap size={16} />
            signal to ai
          </div>
        </div>

        <div className="relative space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={`${edu.degree}-${edu.institution}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-800 bg-[#101722] transition-all hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_0_45px_-24px_rgba(168,85,247,0.75)] md:grid-cols-[150px_1fr]">
                <div className="border-b border-gray-800 bg-[#0d1117] p-6 md:border-b-0 md:border-r">
                  <span className="mb-3 block font-mono text-2xl font-black text-gray-700">0{index + 1}</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-purple-400">{edu.time}</span>
                </div>

                <div className="p-7">
                  <h3 className="mb-1 text-2xl font-bold text-white">{edu.degree}</h3>
                  <h4 className="mb-4 text-lg text-gray-400">
                    <a
                      href={edu.institutionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-purple-300 hover:underline"
                    >
                      {edu.institution}
                    </a>
                  </h4>

                  {edu.thesis && (
                    <div className="mb-6 rounded-xl border border-gray-800/50 bg-[#0d1117] p-4">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-500">
                        {edu.supervisor ? (
                          <>
                            Supervisor:{" "}
                            <a
                              href={edu.supervisorUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-300 transition-colors hover:text-purple-200 hover:underline"
                            >
                              {edu.supervisor}
                            </a>
                          </>
                        ) : (
                          "Project Focus"
                        )}
                      </span>
                      <span className="text-sm italic text-gray-300">{edu.thesis}</span>
                    </div>
                  )}

                  <ul className="mb-6 space-y-3">
                    {edu.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start space-x-3 text-gray-300">
                        <ChevronRight className="mt-1 flex-shrink-0 text-purple-500" size={16} />
                        <span className="text-sm leading-relaxed md:text-base">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 border-t border-gray-800/50 pt-4">
                    {edu.stack.map((tech) => (
                      <span key={tech} className="rounded-full border border-gray-700/80 bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-gray-400 transition-colors hover:border-purple-400/50 hover:text-purple-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="relative">
            <div className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-[#0d1117] bg-purple-900" />
            <div className="font-mono text-sm text-gray-500">
              Prior Education: Intermediate (
              <a href="https://mradavsolan.net.in/" target="_blank" rel="noopener noreferrer" className="text-purple-300 transition-colors hover:text-purple-200 hover:underline">
                MRA DAV Public School
              </a>
              , 2014) & Matriculate (
              <a href="http://davschoolrajgarh.com/" target="_blank" rel="noopener noreferrer" className="text-purple-300 transition-colors hover:text-purple-200 hover:underline">
                DAV Centenary Public School
              </a>
              , 2012).
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-gray-800/50 px-8 py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="group rounded-2xl border border-gray-800 bg-[#101722] p-8 transition-all hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_0_45px_-24px_rgba(16,185,129,0.7)]">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-800 bg-[#0d1117]">
                <Award className="text-emerald-400" size={26} />
              </div>
              <h3 className="text-2xl font-bold">Key Achievements</h3>
            </div>
            <ul className="space-y-4">
              {achievements.map((item) => (
                <li key={item} className="flex items-start space-x-3 text-sm leading-relaxed text-gray-300">
                  <CheckCircle2 className="mt-0.5 flex-shrink-0 text-emerald-500" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="group rounded-2xl border border-gray-800 bg-[#101722] p-8 transition-all hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_0_45px_-24px_rgba(245,158,11,0.7)]">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-800 bg-[#0d1117]">
                <BookCheck className="text-amber-400" size={26} />
              </div>
              <h3 className="text-2xl font-bold">Scientific Reviewer</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {scientificRoles.map((item) => (
                <div key={item} className="flex items-start space-x-2 rounded-lg border border-gray-800/50 bg-[#0d1117] p-3 text-xs text-gray-300 transition-colors hover:border-amber-400/30 md:text-sm">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                  <span className="leading-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-800/50 pt-6">
              <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-200">
                <Users size={18} className="text-cyan-400" /> Memberships
              </h4>
              <div className="flex flex-wrap gap-2">
                {["IEEE Graduate Student Member", "IEEE Signal Processing Society", "IEEE Communications Society", "IEEE Young Professional", "IETE Member"].map((membership) => (
                  <span key={membership} className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                    {membership}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-gray-800/50 px-8 py-20">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-cyan-400">Leadership</p>
            <h2 className="text-3xl font-bold md:text-4xl">Mentorship & Teaching</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-cyan-300">
            <Users size={16} />
            people systems
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {leadership.map((group) => (
            <div key={group.category} className="rounded-2xl border border-gray-800 bg-[#101722] p-8 transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_45px_-24px_rgba(34,211,238,0.7)]">
              <h3 className="mb-6 border-b border-gray-800 pb-4 text-xl font-bold text-gray-100">{group.category}</h3>
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start space-x-3 text-sm leading-relaxed text-gray-300">
                    <ChevronRight className="mt-0.5 flex-shrink-0 text-cyan-500" size={16} />
                    <span>{renderLinkedText(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl border-t border-gray-800/50 px-8 py-20">
        <div className="rounded-2xl border border-gray-800 bg-[#101722] p-8 shadow-[0_0_60px_-35px_rgba(236,72,153,0.7)]">
          <div className="mb-8 flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-800 bg-[#0d1117]">
              <Presentation className="text-pink-400" size={26} />
            </div>
            <h2 className="text-3xl font-bold">Conferences & Workshops</h2>
          </div>
          <p className="mb-8 font-mono text-sm leading-relaxed text-gray-400">
            Actively presented, attended, and collaborated at 14+ international engineering conferences and symposiums between 2016 and 2025, including IEEE ICoCET (Malaysia), IEEE ANTS, ICCTA (Egypt), and ICPC2T.
          </p>

          <Link
            href="/research"
            className="group flex items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 transition-colors hover:border-blue-400/50 hover:bg-blue-500/15"
          >
            <Mic className="mr-2 text-blue-400" size={20} />
            <span className="text-sm font-medium text-blue-200 transition-colors group-hover:text-blue-100">
              View my research, publications, and academic work.
            </span>
          </Link>
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
