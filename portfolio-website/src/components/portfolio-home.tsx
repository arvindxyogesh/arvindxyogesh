"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Brain,
  Code2,
  Mail,
  Sparkles,
  Wind,
} from "lucide-react";

import { HeroScene } from "@/components/hero-scene";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const skills = [
  `Machine Learning & AI: Python, PyTorch, TensorFlow, LLMs, RAG, reinforcement learning, CNNs, transformers, scikit-learn, MLflow, TensorBoard`,
  `Software Systems & Simulation: C++, ROS, Open3D, closed-loop simulation, evaluation pipelines, distributed systems, Linux, Bash`,
  `AI Infrastructure & Deployment: CUDA-accelerated inference, ONNX Runtime, Kafka, Spark, PySpark, Airflow, Docker, AWS, Git, FastAPI, FAISS, SQL`,
];

const experience = [
  {
    title: "M-City, University of Michigan",
    role: "Student ML Researcher",
    period: "Sep 2025 - Present",
    description: "Ann Arbor",
    points: [
      "Built an automated perception-to-planning evaluation pipeline using ROS, Open3D, and Python, reducing manual testing effort by 70% and enabling batched A/B model evaluation.",
      "Trained a multi-task perception and short-horizon forecasting model in PyTorch, reducing 0–3s trajectory prediction error by 15% and lowering collision-warning events by 9% in closed-loop simulations.",
      "Added multimodal experiment tracking, distribution-shift monitoring, and regression testing using MLflow and TensorBoard to improve model reliability and rollback validation.",
    ],
  },
  {
    title: "Vestas Wind Technology",
    role: "Data Scientist Intern",
    period: "Jun 2024 - Jul 2025",
    description: "Chennai, India",
    points: [
      "Developed gearbox-failure forecasting models using SCADA telemetry, maintenance logs, and engineered time-series features, achieving 0.82 AUC with median alert lead times of approximately 18 days.",
      "Productionized streaming inference pipelines using Kafka, Spark, ONNX Runtime, and Airflow-managed retraining workflows, achieving 80 ms median latency.",
      "Reduced unplanned turbine downtime by 25% and integrated spare-parts demand forecasting into maintenance scheduling, reducing inventory overstock by 15%.",
    ],
  },
  {
    title: "Computer Society, MIT",
    role: "ML Engineer",
    period: "Mar 2021 - Jun 2024",
    description: "Chennai, India",
    points: [
      "Built a semantic retrieval pipeline using sentence-transformers, LLM reranking, and vector search, improving Top-1 relevance by 28%, tripling throughput, and reducing CPU cost by 2.5x.",
      "Developed a real-time ADAS perception pipeline using Kafka, Spark Structured Streaming, and CUDA-accelerated inference services, achieving 20 FPS with p95 end-to-end latency below 150 ms.",
      "Designed robotic machining analytics models combining 1D-CNNs and gradient-boosted trees for defect prediction, and integrated MLflow telemetry to accelerate defect triage and improve reproducibility.",
    ],
  },
];

const projects = [
  {
    name: "Synapse – Open-Source LLM Gateway",
    tag: "LLM Infra | FastAPI | Semantic Caching",
    intention: "Build a self-hosted, OpenAI-API-compatible LLM gateway with semantic caching and observability.",
    description: "FastAPI + React + Redis + Postgres gateway that sits in front of the real OpenAI SDK, adding semantic response caching (Redis ANN vector search), streaming, per-key rate limiting/quotas, and cost/latency observability — verified with automated tests against the actual openai SDK, not just schema comparison.",
    achievement: "Designed a self-tuning cache-correctness controller using LLM-judge shadow verification to auto-calibrate similarity thresholds, holding precision at 98–100% under real GPU-served inference (Llama 3.1 8B, H200).",
    repo: "https://github.com/arvindxyogesh/Synapse",
    details: "Open-source, CI-tested gateway with Docker Compose deployment, an Alembic-managed Postgres schema, and a live React dashboard for charts, a chat playground, and API key management.",
  },
  {
    name: "Attribution-Guided Masking for Robust Cross-Domain Sentiment Classification",
    tag: "NLP | Domain Generalization | Research",
    intention: "Test whether gradient-based attribution can detect and correct cross-domain generalization failure in transformer sentiment classifiers.",
    description: "Co-developed Attribution-Guided Masking (AGM), a training-time regularizer that penalizes attribution mass on spurious tokens to improve robustness across sentiment domains.",
    achievement: "Reduced cross-domain generalization gap to 0.013–0.244 across 4 sentiment domains (IMDb, Amazon, Hotel, Sentiment140), matching or beating DANN, IRM, Group DRO, and Fish on 3 of 4 zero-shot transfer targets under a strict bootstrap-CI evaluation across 12 domain-transfer pairs.",
    repo: "https://github.com/arvindxyogesh/AGM-NLP",
    details: "Reports negative results in full — attribution alone is a poor post-hoc diagnostic of generalization failure — with ablations isolating attribution-guided masking as the actual driver of improvement.",
  },
  {
    name: "RoadSense – Real-Time ADAS Perception Pipeline",
    tag: "Streaming | CV | MLOps",
    intention: "Production-style streaming perception pipeline integrating ingest, GPU inference, and observability for ADAS workloads.",
    description: "Kafka + Spark Structured Streaming ingestion, CUDA-enabled PyTorch inference service, lane detection, and Streamlit dashboard for latency and throughput observability, containerized across four microservices with Docker Compose and Prometheus monitoring.",
    achievement: "Benchmarked Faster R-CNN and SSDLite MobileNetV3 on an NVIDIA H200 GPU, achieving 9.9ms and 14.9ms median latency (99.6 and 64.2 FPS), both clearing the 150ms real-time target.",
    repo: "https://github.com/arvindxyogesh/RoadSense",
    details: "Features batched GPU inference, Prometheus metrics, dataset download scripts (KITTI/nuScenes/BDD), and evaluation scripts for frame-level precision/recall.",
  },
  {
    name: "Telesentry – Vehicle Telemetry Anomaly Detection",
    tag: "Time-Series | Streaming | Anomaly Detection",
    intention: "Benchmark classical vs. deep sequence anomaly detectors for real-time vehicle telemetry.",
    description: "Compares Isolation Forest against an LSTM autoencoder and a self-attention/Transformer detector on a labeled, multi-type synthetic vehicle telemetry benchmark, then serves the winning model through a Kafka + Spark Structured Streaming pipeline behind a REST API and a live dashboard.",
    achievement: "The LSTM autoencoder reached 0.734 AUROC and 0.530 F1 on a held-out set of 46K rows across 8 unseen vehicles, catching failure modes — sensor drift, GPS spoofing, dropout bursts — that a fixed-threshold baseline misses entirely.",
    repo: "https://github.com/arvindxyogesh/Telesentry",
    details: "Five independently-labeled anomaly types with distinct multivariate signatures, 7 engineered rolling-window features, and models calibrated to a shared false-positive-rate target for a fair comparison.",
  },
  {
    name: "Robot Policy Learning for Continuous Control",
    tag: "Reinforcement Learning | Robotics | PyTorch",
    intention: "Train and evaluate continuous-control robot policies for simulated robotics environments.",
    description: "Implemented a PyTorch reinforcement learning codebase for continuous-control policy learning, including PPO actor-critic training, rollout collection, GAE advantage estimation, checkpointing, evaluation rollouts, and TensorBoard logging.",
    achievement: "Built an interview-ready robotics RL project with reproducible training scripts, configurable environments, and policy inference benchmarking for latency and real-time suitability.",
    repo: "https://github.com/arvindxyogesh/robot-policy-learning-continuous-control",
    details: "PPO training loop, actor-critic networks, rollout buffer, GAE, checkpoint loading, evaluation scripts, TensorBoard logging, and policy inference benchmarking.",
  },
  {
    name: "CLEVER – Cluster-Level Eviction for Vector Embedding Retrieval",
    tag: "MLOps | ANN",
    intention: "Benchmark ANN indexes and semantic caching on large LLM query workloads.",
    description: "Built a semantic caching and ANN benchmarking framework on the LMSYS Chat-1M dataset with over 579k unique queries and 384-dimensional embeddings.",
    achievement: "Benchmarked Flat, IVF, HNSW, and LSH vector indexes under realistic LLM retrieval workloads.",
    repo: "https://github.com/arvindxyogesh/CLEVER",
    details: "Designed a semantic-routing strategy achieving improved cache hit rates and latency reductions.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const resumeHref = "/resume.pdf?v=20260509";

export function PortfolioHome() {
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroKickerRef = useRef<HTMLDivElement | null>(null);
  const heroMetricsRef = useRef<HTMLDivElement | null>(null);
  const heroWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [heroKickerRef.current, heroTitleRef.current, heroMetricsRef.current],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" },
      );

      if (heroWrapRef.current) {
        // Parallax: lift hero content slightly as user scrolls
        gsap.to(heroWrapRef.current, {
          y: -120,
          ease: "none",
          scrollTrigger: {
            trigger: heroWrapRef.current,
            start: "top top",
            end: "+=500",
            scrub: 0.6,
          },
        });

        // Subtle scale and rotate on the knot/video area for depth
        const media = heroWrapRef.current.querySelector("video, img");
        if (media) {
          gsap.to(media, {
            scale: 1.03,
            rotation: 0.8,
            ease: "none",
            scrollTrigger: {
              trigger: heroWrapRef.current,
              start: "top top",
              end: "+=600",
              scrub: 0.8,
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_32%),radial-gradient(circle_at_right,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(180deg,_#050816_0%,_#0a1020_52%,_#050816_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-[0.28em] text-white/70 uppercase">
            Arvind Yogesh
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
            <a href="#about" className="transition hover:text-white">About</a>
            <a href="#skills" className="transition hover:text-white">Skills</a>
            <a href="#experience" className="transition hover:text-white">Experience</a>
            <a href="#projects" className="transition hover:text-white">Projects</a>
            <a href={resumeHref} className="transition hover:text-white" download>
              Resume
            </a>
          </nav>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div ref={heroWrapRef} className="relative z-10 max-w-3xl">
            <div ref={heroKickerRef} className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
              <Sparkles className="h-4 w-4" /> AI/ML Software Engineer • LLMs & RAG • Production ML Systems
            </div>

            <h1 ref={heroTitleRef} className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Building AI/ML systems and production software.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              I’m Arvind, an MS Data Science student at the University of Michigan building AI/ML systems end to end — from LLM-powered applications and retrieval-augmented generation to production ML infrastructure, generative models, and real-time inference. My work spans machine learning engineering, applied research, MLOps, and scalable AI deployment, with recent experience in robotic learning and perception systems at U-M&apos;s Mcity.
            </p>

            <div ref={heroMetricsRef} className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
              {[
                "PyTorch, FAISS, Spark, Kafka, FastAPI",
                "LLMs, RAG, forecasting, robotic learning, and anomaly detection",
                "Production ML deployment and distributed systems",
              ].map((metric) => (
                <div key={metric} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                  {metric}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600">
                <a href="https://d2wb2ysunmtcp0.cloudfront.net/" target="_blank" rel="noreferrer">Chat with my AI <ArrowUpRight className="h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg">
                <a href="#projects">View Projects <ArrowUpRight className="h-4 w-4" /></a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href={resumeHref} download>
                  Resume <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href="mailto:savyo@umich.edu">Contact Me <Mail className="h-4 w-4" /></a>
              </Button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["Machine Learning Engineering", "Deep learning, reinforcement learning, generative models, and applied research."],
                ["LLM & RAG Systems", "Retrieval-augmented generation, semantic search, vector indexes, and applied NLP."],
                ["AI Infrastructure", "CUDA-accelerated inference, ONNX Runtime, streaming systems, latency optimization, and model deployment."],
              ].map(([label, desc]) => (
                <Card key={label} className="border-white/10 bg-white/[0.04]">
                  <CardHeader className="p-5">
                    <CardTitle className="text-base text-white">{label}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative min-h-[480px] lg:min-h-[620px]">
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl" />
            <HeroScene />
            <div className="absolute inset-0 flex items-start justify-center pt-8 lg:pt-14">
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-amber-400/40 shadow-[0_20px_60px_rgba(251,191,36,0.2)]">
                <img
                  src="/profile.jpg"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="absolute inset-x-5 bottom-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.26em] text-white/45">Focus</p>
                  <p className="mt-2 text-lg font-semibold">AI/ML Software Engineer</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Machine learning engineering, LLM systems, and production AI infrastructure across research and industry.
                  </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.26em] text-white/45">Strengths</p>
                <p className="mt-2 text-lg font-semibold">ML engineering + applied research</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Forecasting, generative models, semantic search, RAG systems, and deployment workflows that ship reliably.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="leadership" className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Leadership</p>
        <div className="mt-4 space-y-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Computer Society, MIT Chennai</CardTitle>
                <span className="text-sm text-white/45">Aug 2022 - Apr 2024</span>
              </div>
              <CardDescription className="text-base text-white/75">SAE Autonomous Drone Competition – Project Manager & Applied Tech Lead</CardDescription>
              <CardContent className="pt-3">
                <ul className="list-disc pl-5 text-sm leading-7 text-white/70">
                  <li>Led a 12-member cross-functional team building an autonomous drone platform for SAE collegiate competitions, coordinating perception, navigation, embedded systems, and testing workflows; designed project roadmaps and sprint planning processes to improve development velocity and reduce integration bottlenecks across subteams.</li>
                  <li>Architected technical solutions and directed development of a computer-vision-assisted navigation pipeline using Python and OpenCV for obstacle awareness and flight-path stabilization.</li>
                </ul>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl px-6 pb-6 sm:px-10 lg:px-12">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }} className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: <BadgeCheck className="h-5 w-5" />, title: "Evaluation & Testing", text: "Production-grade ML evaluation harnesses, closed-loop testing, and regression detection to maintain model reliability." },
            { icon: <Brain className="h-5 w-5" />, title: "ML Systems", text: "Forecasting, anomaly detection, RAG, semantic search, and LLM pipelines that integrate smoothly into production workflows." },
            { icon: <Wind className="h-5 w-5" />, title: "Data Infrastructure", text: "Telemetry pipelines, distributed processing (Spark/Kafka), streaming inference, and deployable ML services." },
          ].map((card) => (
            <motion.article key={card.title} variants={item}>
              <Card className="h-full border-white/10 bg-white/[0.04]">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200">{card.icon}</div>
                  <CardTitle className="text-white">{card.title}</CardTitle>
                  <CardDescription className="text-base text-white/68">{card.text}</CardDescription>
                </CardHeader>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="skills" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Skills</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Built for AI/ML engineering, LLM systems, and production software.</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/68">
              The portfolio emphasizes concrete tools and clear categories so it reads well for ATS and for technical reviewers.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((skill) => (
              <Card key={skill} className="border-white/10 bg-white/[0.04]">
                <CardContent className="p-5 text-sm leading-6 text-white/75">{skill}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Experience</p>
        <div className="mt-4 space-y-4">
          {experience.map((entry) => (
            <Card key={entry.title} className="border-white/10 bg-white/[0.04]">
              <CardHeader className="gap-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-white">{entry.title}</CardTitle>
                  <span className="text-sm text-white/45">{entry.period}</span>
                </div>
                <CardDescription className="text-base text-white/75">{entry.role}</CardDescription>
                <p className="mt-2 text-sm leading-6 text-white/65">{entry.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-sm leading-7 text-white/70">
                  {entry.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 flex-none rounded-full bg-amber-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="education" className="mx-auto w-full max-w-7xl px-6 pb-12 sm:px-10 lg:px-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Education</p>
        <div className="mt-4 space-y-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">University of Michigan, Ann Arbor</CardTitle>
                <span className="text-sm text-white/45">Aug 2024 - Dec 2026</span>
              </div>
              <CardDescription className="text-base text-white/75">MS, Data Science (GPA: 3.87)</CardDescription>
              <p className="mt-2 text-sm leading-6 text-white/65">Coursework: Applied Machine Learning, Natural Language Processing, Statistical Inference, Advanced DBMS, Advanced Probability & Distribution, Regression Analysis, Reinforcement Learning</p>
            </CardHeader>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Madras Institute of Technology (MIT), Chennai</CardTitle>
                <span className="text-sm text-white/45">Aug 2020 - Jun 2024</span>
              </div>
              <CardDescription className="text-base text-white/75">BE, Mechanical Engineering (GPA: 3.90)</CardDescription>
              <p className="mt-2 text-sm leading-6 text-white/65">Coursework: Data Structures & Algorithms, Deep Learning, Software Engineering, Robotics Simulations</p>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="research" className="mx-auto w-full max-w-7xl px-6 pb-12 sm:px-10 lg:px-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Research Publication</p>
        <div className="mt-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white text-2xl">Attribution-Guided Masking for Robust Cross-Domain Sentiment Classification</CardTitle>
                  <p className="mt-2 text-sm text-white/50">Under Review – BlackboxNLP Workshop 2026</p>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <a href="https://arxiv.org/abs/2605.03091" target="_blank" rel="noreferrer">
                    <ArrowUpRight className="h-3 w-3" /> arXiv
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc pl-5 text-sm leading-7 text-white/70">
                <li>Proposed Attribution-Guided Masking (AGM), a training-time loss for suppressing domain-specific spurious tokens in cross-domain sentiment classification.</li>
                <li>Evaluated zero-shot across 4 domains and outperformed IRM, Fish, DRO, and DANN baselines on Sentiment140.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="projects" className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Projects</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Machine learning systems, LLM applications, and production AI.</h2>
          </div>
          <div className="hidden text-sm text-white/50 lg:block">Projects spanning LLM infrastructure, NLP research, real-time perception, anomaly detection, and applied robotics.</div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-1">
          {projects.map((project) => (
            <Card key={project.name} className="border-white/10 bg-white/[0.04]">
              <CardHeader>
                <div className="text-xs uppercase tracking-[0.28em] text-amber-200/75">{project.tag}</div>
                <CardTitle className="text-white">{project.name}</CardTitle>
                <CardDescription className="text-sm leading-7 text-white/72">
                  <span className="font-semibold text-white/90">Intention:</span> {project.intention}
                </CardDescription>
                <p className="mt-2 text-sm leading-7 text-white/70">{project.description}</p>
                <CardDescription className="text-sm leading-7 text-white/72 mt-3">
                  <span className="font-semibold text-white/90">Achievement:</span> {project.achievement}
                </CardDescription>
                <p className="mt-2 text-sm leading-7 text-white/65 italic">{project.details}</p>
                {project.repo && (
                  <div className="mt-4">
                    <Button asChild size="sm" variant="secondary">
                      <a href={project.repo} target="_blank" rel="noreferrer">
                        <ArrowUpRight className="h-3 w-3 mr-2 inline" /> View on GitHub
                      </a>
                    </Button>
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      

      <section className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 lg:px-12">
        <Card className="border-amber-400/20 bg-gradient-to-r from-amber-400/10 via-white/[0.04] to-cyan-400/10">
          <CardContent className="flex flex-col items-start justify-between gap-6 p-7 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-amber-200/80">Ready to collaborate?</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Let’s build AI/ML systems and production software together.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
                Reach out if you’re looking for work across machine learning engineering, LLM/RAG systems, MLOps, model evaluation, or production AI infrastructure.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={resumeHref} download>Resume</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="mailto:savyo@umich.edu"><Mail className="h-4 w-4" /> Email</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://github.com/arvindxyogesh" target="_blank" rel="noreferrer"><Code2 className="h-4 w-4" /> GitHub</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://www.linkedin.com/in/arvindxyogesh/" target="_blank" rel="noreferrer"><ArrowUpRight className="h-4 w-4" /> LinkedIn</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://d2wb2ysunmtcp0.cloudfront.net/" target="_blank" rel="noreferrer"><ArrowUpRight className="h-4 w-4" /> Chat with my AI</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://scholar.google.com/citations?user=HfY9ZRoAAAAJ&hl=en" target="_blank" rel="noreferrer"><ArrowUpRight className="h-4 w-4" /> Scholar</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="https://arxiv.org/abs/2605.03091" target="_blank" rel="noreferrer"><ArrowUpRight className="h-4 w-4" /> arXiv</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
