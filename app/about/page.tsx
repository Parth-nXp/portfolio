"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Award,
  BookCheck,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Mic,
  Presentation,
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
    <main className="min-h-screen bg-[#0d1117] pb-24 text-white font-sans selection:bg-blue-500/30">
      <SiteNav />

      <header className="relative mx-auto max-w-4xl px-8 pb-12 pt-36">
        <div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
        <div className="relative z-10">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-blue-400">
            About Me
          </p>
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight md:text-6xl">
            Namaste! Welcome to my <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Journey.</span>
          </h1>
          <div className="space-y-6 text-lg font-light leading-relaxed text-gray-300">
            <p>
              I am Parth, an AI Data Scientist working on large language models, generative AI, and scalable machine learning systems that help organizations unlock insights from data.
            </p>
            <p>
              My work focuses on training and fine-tuning LLMs, building high-quality training datasets, and developing evaluation frameworks to improve model reliability, accuracy, and real-world performance. I am particularly interested in efficient model adaptation, distributed training, and inference optimization, enabling AI systems to be deployed at scale in production environments.
            </p>
            <p>
              I also work on end-to-end AI pipelines, covering data curation, model training, evaluation, and production deployment for enterprise AI applications. I enjoy collaborating with cross-functional teams to transform research ideas into scalable, production-ready AI solutions.
            </p>
            <p className="font-medium text-white">
              Ultimately, I am passionate about building trustworthy and efficient AI systems that empower organizations to make faster, smarter, and more confident data-driven decisions.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-8 py-16">
        <div className="mb-12 flex items-center space-x-3">
          <Briefcase className="text-blue-400" size={32} />
          <h2 className="text-3xl font-bold">Experience</h2>
        </div>

        <div className="relative ml-4 space-y-12 border-l border-gray-800 pl-8">
          {experience.map((exp, index) => (
            <motion.div
              key={`${exp.role}-${exp.company}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-[#0d1117] bg-blue-500" />

              <div className="rounded-xl border border-gray-800 bg-[#161b22] p-6 transition-colors hover:border-blue-500/30">
                <span className="mb-2 block font-mono text-sm tracking-wide text-blue-400">{exp.time}</span>
                <h3 className="mb-1 text-2xl font-bold text-white">{exp.role}</h3>
                <h4 className="mb-4 text-lg text-gray-400">
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
                      <span key={tech} className="rounded-md border border-gray-700 bg-[#0d1117] px-2 py-1 font-mono text-xs text-gray-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-8 py-16">
        <div className="mb-12 flex items-center space-x-3">
          <GraduationCap className="text-purple-400" size={32} />
          <h2 className="text-3xl font-bold">Education</h2>
        </div>

        <div className="relative ml-4 space-y-12 border-l border-gray-800 pl-8">
          {education.map((edu, index) => (
            <motion.div
              key={`${edu.degree}-${edu.institution}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-[#0d1117] bg-purple-500" />

              <div className="rounded-xl border border-gray-800 bg-[#161b22] p-6 transition-colors hover:border-purple-500/30">
                <span className="mb-2 block font-mono text-sm tracking-wide text-purple-400">{edu.time}</span>
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
                  <div className="mb-6 rounded-lg border border-gray-800/50 bg-[#0d1117] p-4">
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
                    <span key={tech} className="rounded-md border border-gray-700 bg-[#0d1117] px-2 py-1 font-mono text-xs text-gray-400">
                      {tech}
                    </span>
                  ))}
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

      <section className="mx-auto max-w-6xl px-8 py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-[#161b22] p-8 transition-colors hover:border-emerald-500/30">
            <div className="mb-6 flex items-center space-x-3">
              <Award className="text-emerald-400" size={28} />
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

          <div className="rounded-xl border border-gray-800 bg-[#161b22] p-8 transition-colors hover:border-amber-500/30">
            <div className="mb-6 flex items-center space-x-3">
              <BookCheck className="text-amber-400" size={28} />
              <h3 className="text-2xl font-bold">Scientific Reviewer</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {scientificRoles.map((item) => (
                <div key={item} className="flex items-start space-x-2 rounded-md border border-gray-800/50 bg-[#0d1117] p-2 text-xs text-gray-300 md:text-sm">
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

      <section className="mx-auto max-w-4xl px-8 py-16">
        <div className="mb-12 flex items-center space-x-3">
          <Users className="text-cyan-400" size={32} />
          <h2 className="text-3xl font-bold">Leadership & Teaching</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {leadership.map((group) => (
            <div key={group.category} className="rounded-xl border border-gray-800 bg-[#161b22] p-8 transition-colors hover:border-cyan-500/30">
              <h3 className="mb-6 border-b border-gray-800 pb-3 text-xl font-bold text-gray-100">{group.category}</h3>
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

      <section className="mx-auto max-w-4xl border-t border-gray-800/50 px-8 py-16">
        <div className="mb-8 flex items-center space-x-3">
          <Presentation className="text-pink-400" size={32} />
          <h2 className="text-3xl font-bold">Conferences & Workshops</h2>
        </div>
        <p className="mb-8 font-mono text-sm text-gray-400">
          Actively presented, attended, and collaborated at 14+ international engineering conferences and symposiums between 2016 and 2025, including IEEE ICoCET (Malaysia), IEEE ANTS, ICCTA (Egypt), and ICPC2T.
        </p>

        <Link
          href="/research"
          className="group flex items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 transition-colors hover:border-blue-400/50 hover:bg-blue-500/15"
        >
          <Mic className="mr-2 text-blue-400" size={20} />
          <span className="text-sm font-medium text-blue-200 transition-colors group-hover:text-blue-100">
            View my research, publications, and academic work.
          </span>
        </Link>
      </section>

      <SocialFooter />
    </main>
  );
}
