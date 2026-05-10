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
  "Python, SQL, JavaScript, TypeScript, C++",
  "PyTorch, scikit-learn, NumPy, Pandas, LLMs, feature engineering, PySpark",
  "ETL and ELT, data pipelines, FAISS, RAG pipelines, Hugging Face Transformers",
  "AWS, Azure, Docker, Terraform, FastAPI, ONNX, Kafka, Spark",
  "Git, GitHub, MLflow, pytest, Linux, Tableau",
  "GenAI: Claude, OpenAI GPT, Google Gemini, Llama, GitHub Copilot, prompt engineering, model fine-tuning",
];

const experience = [
  {
    title: "M-City, UMTRI, Ann Arbor, MI",
    role: "Research Associate",
    period: "Sep 2025 - Present",
    description: "Working on autonomous vehicle perception and planning at the University of Michigan's Mobility Transformation Center. Focus on building reliable evaluation systems and improving model robustness in complex driving scenarios.",
    points: [
      "Built an automated perception to planning evaluation pipeline (ROS, Open3D, Python), reducing manual test effort by 70% and enabling batched A/B model comparisons across hundreds of test cases.",
      "Trained a multi-task perception and short-horizon motion-forecast model (PyTorch) that cut 0-3s trajectory error by 15% and reduced collision-warning events by 9% in closed-loop simulations against safety benchmarks.",
      "Added distribution-shift monitoring and regression tests (MLflow, TensorBoard) to detect model degradation across sensor conditions and speed rollbacks with automated alerts for out-of-distribution scenarios.",
    ],
  },
  {
    title: "Vestas Wind Technology, Chennai, India",
    role: "Data Scientist Intern",
    period: "Jun 2024 - Jul 2025",
    description: "Developed ML solutions for predictive maintenance at a leading wind turbine manufacturer. Built forecasting models for critical component failure prediction and streamlined maintenance planning across hundreds of turbines.",
    points: [
      "Developed gearbox-failure forecasting using SCADA telemetry and maintenance logs with engineered time-series features (lags, rolling statistics) and an LSTM + XGBoost ensemble; achieved AUC 0.82 with median alert lead time of 18 days, enabling proactive maintenance scheduling.",
      "Productionized streaming inference pipeline (Kafka → Spark → ONNX Runtime) with 80 ms median latency serving 50+ turbines in real-time. Automated weekly retraining via Airflow with performance monitoring, reducing unplanned downtime by 25% across fleet.",
      "Integrated spare-parts demand forecasting with the maintenance pipeline using demand-driven feature engineering, lowering parts overstock by 15% and improving inventory efficiency while maintaining zero-stock events.",
    ],
  },
  {
    title: "Computer Society, MIT, Chennai, India",
    role: "ML Engineer",
    period: "Mar 2021 - Jun 2024",
    description: "Led machine learning infrastructure and semantic search development for MIT's student tech community. Built production systems for document retrieval and optimized model serving for low-latency inference.",
    points: [
      "Built a production semantic-search service using a dual-encoder + cross-encoder re-ranker architecture with FAISS indexing, achieving 28% Top-1 improvement over TF-IDF baseline and median latency under 120 ms at peak load.",
      "Applied knowledge distillation (teacher-student learning) and INT8 quantization (PyTorch to ONNX Runtime) to achieve 3x throughput increase and 2.5x reduction in CPU inference cost, enabling cost-effective scaling.",
      "Deployed end-to-end system via Docker containers with FastAPI backend, automated CI/CD via GitHub Actions, and comprehensive MLflow logging for reproducible A/B testing and model version control.",
    ],
  },
  {
    title: "MES section IIT Madras, Chennai, India",
    role: "Research Intern",
    period: "Jun 2023 - Aug 2023",
    description: "Developed sensor-based quality prediction systems for precision manufacturing. Combined signal processing with deep learning to detect anomalies in real-time and reduce manufacturing defects.",
    points: [
      "Trained a hole-quality predictor from multi-modal sensor data (vibration, force, acoustic) using 1D-CNN feature extractor + GBDT classifier; achieved R² ≈ 0.72 on validation set with 30% reduction in rework rate during pilot deployment.",
      "Deployed lightweight on-device anomaly detection (edge embeddings to isolation forest) on Jetson Nano and Raspberry Pi with latency under 50ms, reducing tool-wear related failures by 22% through real-time alerts to operators.",
      "Packaged reproducible experiments using PyTorch and MLflow tracking across lab and shop-floor datasets, establishing validation protocols across different manufacturing conditions and sensor calibrations.",
    ],
  },
];

const projects = [
  {
    name: "Pasupathy-ai",
    tag: "RAG | GenAI",
    intention:
      "Build a RAG-powered personal AI assistant that answers questions grounded in user-provided documents and knowledge, eliminating hallucinations through retrieved context.",
    description: "A full-stack RAG application combining modern LLMs with semantic search. Users can upload documents and ask questions; the system retrieves relevant passages and passes them as context to Claude/Gemini for grounded responses.",
    achievement:
      "Built with React 18, TypeScript, Flask, FAISS, and Google Gemini; deployed with Docker on AWS Elastic Beanstalk (backend), S3 + CloudFront (frontend). Production metrics: 60-minute initial embedding build with HuggingFace models, 5-second FAISS index load, 2-5s query latency (embedding + retrieval + generation), 2 GB memory footprint, 500 MB index storage.",
    details: "Key challenges: (1) Efficient embedding generation at scale—used batch processing to reduce latency; (2) FAISS retrieval quality—tuned IVF parameters for 95%+ recall at competitive latency; (3) Deployed with autoscaling on Beanstalk to handle variable load; (4) Frontend caching strategy reduced redundant API calls by 40%.",
  },
  {
    name: "CLEVER: Cluster Level Eviction for Vector Embedding Retrieval",
    tag: "MLOps | ANN",
    intention:
      "Benchmark approximate nearest neighbor (ANN) performance and semantic caching strategies under realistic LLM chat workloads to identify optimal trade-offs between latency, cost, and recall.",
    description: "A comprehensive benchmarking framework evaluating ANN indices and caching strategies on 579K real LLM queries from LMSYS Chat 1M. Compares Flat, IVF, HNSW, and LSH over a semantic-similarity caching layer.",
    achievement:
      "Built framework on LMSYS Chat 1M (579,753 unique queries, 384-dimensional embeddings from SentenceTransformers). Evaluated retrieval strategies: HNSW achieved 0.996 recall at 0.56 ms latency (11,056 QPS) vs Flat's 1.000 recall at 17.39 ms (58 QPS). Semantic routing achieved 59.1% cache hit rate with 80.3% semantic quality retention and 60.3% latency savings at similarity threshold 0.76.",
    details: "Findings: For production RAG systems, HNSW+semantic-caching beats exact search on latency by ~30x while maintaining practical recall. Used MLflow and custom dashboards to visualize trade-off curves. Code packaged for researchers; benchmarking utilities enable easy evaluation of new ANN methods.",
  },
  {
    name: "Attribution-Guided Masking for Robust Cross-Domain Sentiment Classification",
    tag: "Research | NLP",
    intention:
      "Address domain shift in sentiment classification by identifying and penalizing highly domain-specific tokens during fine-tuning, enabling better zero-shot generalization across domains.",
    description: "A novel training method (AGM) that uses gradient-based input attribution to flag tokens that excessively influence predictions. By masking these during training, the model learns more robust, domain-invariant features.",
    achievement:
      "Published on arXiv (2605.03091). Evaluated zero-shot across 4 target domains (8 random seeds each). On Sentiment140: AGM achieved Delta 0.244 vs baselines DANN 0.264, DRO 0.248, Fisher 0.247, IRM 0.238. Token-level attribution analysis confirmed suppression of domain-specific markers (mentions, hashtags, slang) while preserving sentiment signals.",
    details: "Method: (1) Fine-tune BERT with standard cross-entropy; (2) Compute input gradients to estimate token importance; (3) Mask high-attribution tokens and re-train with masked-langauge-modeling regularization; (4) Repeat until convergence. Improves zero-shot generalization by ~6% on held-out domains compared to standard ERM.",
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
            <a href="/resume.pdf" className="transition hover:text-white" download>
              Resume
            </a>
          </nav>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div ref={heroWrapRef} className="relative z-10 max-w-3xl">
            <div ref={heroKickerRef} className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
              <Sparkles className="h-4 w-4" /> ML systems, forecasting, LLMs, and production ML deployment
            </div>

            <h1 ref={heroTitleRef} className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Building reliable ML systems and software products that ship with confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              I'm Arvind, a Machine Learning Engineer and MS Data Science student at the University of Michigan focused on designing and deploying scalable ML systems. My work spans end-to-end machine learning pipelines, RAG systems, forecasting architectures, high-throughput data workflows, telemetry processing, and production-oriented ML deployment.
            </p>

            <div ref={heroMetricsRef} className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
              {[
                "PyTorch, FAISS, Spark, Kafka, FastAPI",
                "LLMs, RAG, forecasting, and anomaly detection",
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
                <a href="/resume.pdf" download>
                  Resume <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href="mailto:savyo@umich.edu">Contact Me <Mail className="h-4 w-4" /></a>
              </Button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["ML Systems", "Forecasting, anomaly detection, reproducible evaluation, and closed-loop testing"],
                ["GenAI + RAG", "LLMs, embeddings, FAISS, semantic search, and grounded response design"],
                ["Cloud Infrastructure", "AWS, Azure, Docker, Spark, Kafka, Databricks, and MLflow"],
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
                <p className="mt-2 text-lg font-semibold">ML engineer + SWE</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Practical ML systems, robust APIs, and scalable data workflows for production use.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.26em] text-white/45">Strengths</p>
                <p className="mt-2 text-lg font-semibold">ML research + production</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Forecasting, semantic search, RAG systems, and deployment workflows that ship reliably.
                </p>
              </div>
            </div>
          </div>
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
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Built for ML engineering and production software systems.</h2>
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

      <section id="projects" className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Projects</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">ML systems, GenAI, and research.</h2>
          </div>
          <div className="hidden text-sm text-white/50 lg:block">Recent projects and research work.</div>
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
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Publication</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Research on domain-robust NLP.</h2>
          </div>
          <div className="flex gap-2 flex-col">
            <a href="https://scholar.google.com/citations?user=HfY9ZRoAAAAJ&hl=en" target="_blank" rel="noreferrer" className="text-sm text-amber-300 hover:text-amber-200 transition">Google Scholar</a>
          </div>
        </div>
        <div className="mt-6">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="text-xs uppercase tracking-[0.28em] text-amber-200/75 mb-2">NLP | Domain Generalization</div>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-white text-2xl">
                  <a 
                    href="https://arxiv.org/abs/2605.03091" 
                    target="_blank" 
                    rel="noreferrer"
                    className="hover:text-amber-300 transition"
                  >
                    Attribution-Guided Masking for Robust Cross-Domain Sentiment Classification
                  </a>
                </CardTitle>
                <Button asChild size="sm" variant="secondary">
                  <a href="https://arxiv.org/abs/2605.03091" target="_blank" rel="noreferrer">
                    <ArrowUpRight className="h-3 w-3" /> arXiv
                  </a>
                </Button>
              </div>
              <p className="mt-2 text-sm text-white/50">arXiv:2605.03091 (2026)</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-white/90 mb-2">Overview</p>
                <p className="text-sm leading-7 text-white/70">
                  This paper addresses domain shift in sentiment classification—a key challenge when models trained on one domain (e.g., movie reviews) fail on new domains (tweets, product reviews). We propose Attribution-Guided Masking (AGM), a training procedure that identifies and suppresses highly domain-specific tokens to learn domain-invariant sentiment features.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90 mb-2">Method</p>
                <p className="text-sm leading-7 text-white/70">
                  The approach uses gradient-based input attribution to measure token importance during fine-tuning. Tokens with high attribution (strongly influencing predictions) indicate domain-specific patterns. We mask these tokens and apply masked-language-modeling regularization, forcing the model to rely on more transferable sentiment signals rather than domain artifacts.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90 mb-2">Results</p>
                <p className="text-sm leading-7 text-white/70">
                  Evaluated zero-shot across 4 target domains with 8 random seeds. On Sentiment140 target: AGM achieved maximum divergence (Delta) of 0.244 compared to strong baselines—DANN (0.264), DRO (0.248), Fish (0.247), and IRM (0.238). Attribution analysis confirmed suppression of domain-specific tokens (e.g., emojis, mentions, hashtags) while preserving core sentiment vocabulary. Results show ~6% improvement in zero-shot generalization vs. standard empirical risk minimization.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90 mb-2">Impact</p>
                <p className="text-sm leading-7 text-white/70">
                  This work opens new directions for building more robust, domain-agnostic NLP models. The attribution-masking framework is model-agnostic and can extend to other text classification tasks. Key takeaway: training procedures that encourage interpretability (via attribution) can simultaneously improve generalization.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 lg:px-12">
        <Card className="border-amber-400/20 bg-gradient-to-r from-amber-400/10 via-white/[0.04] to-cyan-400/10">
          <CardContent className="flex flex-col items-start justify-between gap-6 p-7 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-amber-200/80">Ready to collaborate?</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Let's work on ML systems and production AI together.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
                Reach out if you're looking for ML engineering expertise in forecasting, RAG systems, distributed data infrastructure, or production ML deployment.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href="/resume.pdf" download>Resume</a>
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
              <Button asChild variant="secondary">
                <a href="https://x.com/Memoirs/status/2051927470941610228" target="_blank" rel="noreferrer"><ArrowUpRight className="h-4 w-4" /> Featured on X</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
