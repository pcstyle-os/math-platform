"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Atom,
  Brain,
  Calculator,
  CircuitBoard,
  Crown,
  Fingerprint,
  Flame,
  Infinity,
  Layers,
  LineChart,
  Orbit,
  Sparkles,
  Star,
  Stars,
  Target,
  Wand2,
} from "lucide-react";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

const courseTracks = [
  "All",
  "Foundations",
  "Number Sense",
  "Algebra",
  "Geometry",
  "Trigonometry",
  "Calculus",
  "Statistics",
  "Discrete",
  "Applied",
  "Math + CS",
] as const;

const levels = ["All", "Beginner", "Intermediate", "Advanced"] as const;

type Course = {
  id: string;
  title: string;
  track: (typeof courseTracks)[number];
  level: (typeof levels)[number];
  time: string;
  labs: number;
  theory: number;
  xp: number;
  tags: string[];
  description: string;
};

const courseBlueprints: Array<{
  track: Exclude<(typeof courseTracks)[number], "All">;
  level: Exclude<(typeof levels)[number], "All">;
  items: string[];
}> = [
  {
    track: "Foundations",
    level: "Beginner",
    items: [
      "Pattern Recognition",
      "Mathematical Language",
      "Proof Intuition",
      "Estimation Craft",
      "Units + Dimensionality",
      "Logic Basics",
      "Mental Math Systems",
      "Visualization Toolkit",
    ],
  },
  {
    track: "Number Sense",
    level: "Beginner",
    items: [
      "Fractions From First Principles",
      "Decimals + Percent Mastery",
      "Ratio & Proportion Engine",
      "Signed Numbers",
      "Powers + Roots",
      "Modular Thinking",
      "Number Line Fluency",
      "Approximation & Error",
    ],
  },
  {
    track: "Algebra",
    level: "Intermediate",
    items: [
      "Linear Systems Studio",
      "Quadratic Worlds",
      "Functions & Transformations",
      "Inequalities Lab",
      "Polynomials + Factor Art",
      "Rational Expressions",
      "Exponential Models",
      "Logarithmic Intuition",
    ],
  },
  {
    track: "Geometry",
    level: "Intermediate",
    items: [
      "Geometric Proof Lab",
      "Triangle Power",
      "Circle Mechanics",
      "Coordinate Geometry",
      "Vectors & Projections",
      "Area + Volume Engine",
      "Similarity + Scaling",
      "Transformations",
    ],
  },
  {
    track: "Trigonometry",
    level: "Intermediate",
    items: [
      "Unit Circle Mastery",
      "Trigonometric Identities",
      "Wave Modeling",
      "Inverse Trig Sense",
      "Law of Sines/Cosines",
      "Trig Equations",
      "Polar Coordinates",
      "Complex Plane Trig",
    ],
  },
  {
    track: "Calculus",
    level: "Advanced",
    items: [
      "Limits + Continuity",
      "Derivative Intuition",
      "Derivative Applications",
      "Integral Worlds",
      "Area + Accumulation",
      "Differential Equations",
      "Series + Convergence",
      "Multivariable Foundations",
    ],
  },
  {
    track: "Statistics",
    level: "Intermediate",
    items: [
      "Data Storytelling",
      "Probability Basics",
      "Distributions Lab",
      "Sampling + Inference",
      "Hypothesis Testing",
      "Regression Studio",
      "Bayesian Thinking",
      "Experimental Design",
    ],
  },
  {
    track: "Discrete",
    level: "Intermediate",
    items: [
      "Combinatorics Engine",
      "Graph Theory",
      "Recurrence Relations",
      "Logic + Set Systems",
      "Counting Proofs",
      "Algorithms & Big-O",
      "Number Theory Core",
      "Cryptography Basics",
    ],
  },
  {
    track: "Applied",
    level: "Advanced",
    items: [
      "Optimization Studio",
      "Game Theory",
      "Chaos & Fractals",
      "Signals + Fourier",
      "Linear Algebra",
      "Vector Calculus",
      "Numerical Methods",
      "Modeling in Nature",
    ],
  },
  {
    track: "Math + CS",
    level: "Advanced",
    items: [
      "Data Structures Math",
      "Machine Learning Math",
      "Graph Algorithms",
      "Information Theory",
      "Computational Geometry",
      "Complexity Theory",
      "Optimization for ML",
      "Quantum Computing Basics",
    ],
  },
];

const courseCatalog: Course[] = courseBlueprints.flatMap((track, trackIndex) =>
  track.items.map((title, index) => ({
    id: `${track.track}-${index}`,
    title,
    track: track.track,
    level: track.level,
    time: `${30 + ((trackIndex + index) % 6) * 10} min`,
    labs: 4 + ((index + 2) % 4),
    theory: 6 + ((trackIndex + index) % 5),
    xp: 120 + ((trackIndex + 1) * 20 + index * 6),
    tags: [
      track.track,
      track.level,
      index % 2 === 0 ? "Visual" : "Applied",
      index % 3 === 0 ? "Puzzle" : "Interactive",
    ],
    description: `Build intuition for ${title.toLowerCase()} with visual proofs, micro-labs, and spaced drills.`,
  })),
);

const theoryCapsules = [
  {
    title: "Foundational Truths",
    summary: "Axioms, inference, and the art of proving things without hand-waving.",
    points: [
      "Logic layers and proof recipes",
      "Constructive vs. contradiction",
      "How to spot invariants",
    ],
  },
  {
    title: "Function Thinking",
    summary: "Every phenomenon is a function in disguise. Learn the grammar.",
    points: ["Domain/codomain intuition", "Transformations", "Inverse sense"],
  },
  {
    title: "Geometry of Change",
    summary: "Limits, derivatives, and integrals as geometric stories.",
    points: ["Slope as local behavior", "Accumulation as memory", "Optimization"],
  },
  {
    title: "Randomness Engine",
    summary: "Probability as structure, not chaos. Expectation, variance, and belief.",
    points: ["Distributions", "Bayes intuition", "Risk vs. signal"],
  },
  {
    title: "Discrete Structures",
    summary: "Finite worlds, infinite consequences: graphs, counting, and recursion.",
    points: ["Graph flows", "Counting strategies", "Recurrence systems"],
  },
  {
    title: "Linear Worlds",
    summary: "Vectors, matrices, and linear transformations that power modern ML.",
    points: ["Basis intuition", "Eigen stories", "High-dimensional geometry"],
  },
];

const labCards = [
  {
    title: "Function Forge",
    description: "Dial slope + intercept to sculpt a line. Watch outputs shift.",
    icon: Target,
  },
  {
    title: "Prime Pulse",
    description: "Test numbers for primality and feel the pattern gaps.",
    icon: Sparkles,
  },
  {
    title: "Probability Mixer",
    description: "Blend outcomes and sense expectation as a weighted beat.",
    icon: LineChart,
  },
  {
    title: "Sequence Synth",
    description: "Generate arithmetic, geometric, and Fibonacci sequences.",
    icon: Infinity,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function isPrime(value: number) {
  if (value <= 1) return false;
  if (value <= 3) return true;
  if (value % 2 === 0 || value % 3 === 0) return false;
  for (let i = 5; i * i <= value; i += 6) {
    if (value % i === 0 || value % (i + 2) === 0) return false;
  }
  return true;
}

export default function CoursesLearnPage() {
  const isLowPerformance = usePerformanceMode();
  const [activeTrack, setActiveTrack] = useState<(typeof courseTracks)[number]>("All");
  const [activeLevel, setActiveLevel] = useState<(typeof levels)[number]>("All");
  const [openTheory, setOpenTheory] = useState<number | null>(0);
  const [slope, setSlope] = useState(1.2);
  const [intercept, setIntercept] = useState(0.6);
  const [primeInput, setPrimeInput] = useState(37);
  const [probability, setProbability] = useState(0.62);
  const [sequenceType, setSequenceType] = useState<"arithmetic" | "geometric" | "fibonacci">(
    "arithmetic",
  );

  const filteredCourses = useMemo(() => {
    return courseCatalog.filter((course) => {
      const matchesTrack = activeTrack === "All" || course.track === activeTrack;
      const matchesLevel = activeLevel === "All" || course.level === activeLevel;
      return matchesTrack && matchesLevel;
    });
  }, [activeTrack, activeLevel]);

  const sequenceValues = useMemo(() => {
    if (sequenceType === "arithmetic") {
      return [2, 5, 8, 11, 14, 17];
    }
    if (sequenceType === "geometric") {
      return [3, 6, 12, 24, 48, 96];
    }
    return [1, 1, 2, 3, 5, 8];
  }, [sequenceType]);

  const animationProps = isLowPerformance
    ? { initial: false, animate: "show" as const }
    : { initial: "hidden" as const, animate: "show" as const };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,255,0.25),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,_rgba(0,255,255,0.15),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.8),_rgba(0,0,0,1))]" />
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-24">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
                <Sparkles className="h-4 w-4 text-primary" />
                Neuro-Delight Learning Engine
              </div>
              <h1 className="text-4xl font-bold uppercase tracking-[0.12em] text-primary sm:text-5xl">
                Courses that feel like a dopamine cascade.
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                A massive constellation of math courses with crisp theory, interactive micro-labs,
                and progress feedback loops inspired by the best of Brilliant.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/learn" className="btn-premium">
                  Start a challenge
                </Link>
                <button className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary border border-primary/40 hover:border-primary transition">
                  View all tracks
                </button>
              </div>
            </div>

            <div className="glass border border-primary/40 p-6 shadow-[0_0_40px_rgba(255,0,255,0.2)]">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                <Brain className="h-4 w-4" /> Neural Status
              </div>
              <div className="mt-6 grid gap-4">
                {[
                  { label: "Streak", value: "21 days", icon: Flame },
                  { label: "Energy", value: "87%", icon: Orbit },
                  { label: "Unlocked", value: "80+ courses", icon: Crown },
                  { label: "Difficulty", value: "Adaptive", icon: Wand2 },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between border border-[var(--border)]/70 bg-black/40 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                      <stat.icon className="h-4 w-4 text-primary" />
                      {stat.label}
                    </div>
                    <div className="text-sm font-semibold text-primary">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            {...animationProps}
            variants={containerVariants}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              {
                title: "Theory Capsules",
                description: "Concise, layered explanations with multiple proof modes.",
                icon: Layers,
              },
              {
                title: "Interactive Labs",
                description: "Manipulate variables and feel the math respond.",
                icon: CircuitBoard,
              },
              {
                title: "Skill Graph",
                description: "Track mastery across hundreds of interconnected nodes.",
                icon: Fingerprint,
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={isLowPerformance ? undefined : { y: -6 }}
                className="glass border border-[var(--border)] p-6 transition"
              >
                <card.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold uppercase tracking-[0.2em]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold uppercase tracking-[0.2em] text-primary">
              Theory Atlas
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every course starts with layered theory: intuition, formalism, then application.
              Expand to explore the key pillars.
            </p>
            <div className="mt-8 space-y-4">
              {theoryCapsules.map((capsule, index) => (
                <div key={capsule.title} className="glass border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setOpenTheory(openTheory === index ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-primary">
                        {capsule.title}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">{capsule.summary}</div>
                    </div>
                    <span className="text-primary text-lg">{openTheory === index ? "-" : "+"}</span>
                  </button>
                  {openTheory === index && (
                    <div className="border-t border-[var(--border)] px-5 py-4">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {capsule.points.map((point) => (
                          <li key={point} className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-primary" /> {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold uppercase tracking-[0.2em] text-primary">
              Interactive Micro-Labs
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Hands-on examples turn abstract theory into visceral intuition.
            </p>

            <div className="mt-6 grid gap-4">
              {labCards.map((lab) => (
                <div key={lab.title} className="glass border border-[var(--border)] p-4">
                  <div className="flex items-start gap-3">
                    <lab.icon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-primary">
                        {lab.title}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{lab.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-6">
              <div className="glass border border-[var(--border)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
                  <Target className="h-4 w-4" /> Function Forge
                </div>
                <div className="mt-4 grid gap-4">
                  <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <label className="flex flex-col gap-2">
                      Slope: {slope.toFixed(2)}
                      <input
                        type="range"
                        min="-3"
                        max="3"
                        step="0.1"
                        value={slope}
                        onChange={(event) => setSlope(Number(event.target.value))}
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      Intercept: {intercept.toFixed(2)}
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={intercept}
                        onChange={(event) => setIntercept(Number(event.target.value))}
                      />
                    </label>
                  </div>
                  <div className="border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-primary">
                    y = {slope.toFixed(2)}x {intercept >= 0 ? "+" : "-"}{" "}
                    {Math.abs(intercept).toFixed(2)}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {[0, 1, 2].map((x) => (
                      <div key={x}>
                        x={x}, y={(slope * x + intercept).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass border border-[var(--border)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-4 w-4" /> Prime Pulse
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="number"
                    value={primeInput}
                    onChange={(event) => setPrimeInput(Number(event.target.value))}
                    className="w-24 px-3 py-2 text-sm"
                  />
                  <div className="text-sm text-muted-foreground">
                    {isPrime(primeInput)
                      ? "Prime detected. Sharp, rare signal."
                      : "Composite. Try another frequency."}
                  </div>
                </div>
              </div>

              <div className="glass border border-[var(--border)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
                  <LineChart className="h-4 w-4" /> Probability Mixer
                </div>
                <div className="mt-4 space-y-3">
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Success Probability: {(probability * 100).toFixed(0)}%
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={probability}
                      onChange={(event) => setProbability(Number(event.target.value))}
                    />
                  </label>
                  <div className="text-sm text-primary">
                    Expected wins over 10 trials: {(probability * 10).toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="glass border border-[var(--border)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
                  <Infinity className="h-4 w-4" /> Sequence Synth
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(["arithmetic", "geometric", "fibonacci"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSequenceType(type)}
                        className={`px-3 py-2 text-xs uppercase tracking-[0.2em] border transition ${
                          sequenceType === type
                            ? "border-primary text-primary"
                            : "border-[var(--border)] text-muted-foreground"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-primary">
                    {sequenceValues.map((value, index) => (
                      <span
                        key={`${value}-${index}`}
                        className="border border-primary/40 px-2 py-1"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold uppercase tracking-[0.2em] text-primary">
              Course Galaxy
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a track, choose a level, and dive into dozens of tight, addictive courses.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {courseTracks.map((track) => (
              <button
                key={track}
                type="button"
                onClick={() => setActiveTrack(track)}
                className={`px-3 py-2 text-xs uppercase tracking-[0.2em] border transition ${
                  activeTrack === track
                    ? "border-primary text-primary"
                    : "border-[var(--border)] text-muted-foreground"
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setActiveLevel(level)}
              className={`px-3 py-2 text-xs uppercase tracking-[0.2em] border transition ${
                activeLevel === level
                  ? "border-primary text-primary"
                  : "border-[var(--border)] text-muted-foreground"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <motion.div
          {...animationProps}
          variants={containerVariants}
          className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredCourses.map((course) => (
            <motion.article
              key={course.id}
              variants={itemVariants}
              whileHover={isLowPerformance ? undefined : { y: -4 }}
              className="glass border border-[var(--border)] p-5 transition"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-primary">
                <span>{course.track}</span>
                <span>{course.level}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold uppercase tracking-[0.1em]">
                {course.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="border border-[var(--border)] px-2 py-1">{course.time}</span>
                <span className="border border-[var(--border)] px-2 py-1">
                  {course.theory} theory
                </span>
                <span className="border border-[var(--border)] px-2 py-1">{course.labs} labs</span>
                <span className="border border-primary/40 px-2 py-1 text-primary">
                  {course.xp} XP
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {course.tags.map((tag) => (
                  <span key={tag} className="border border-[var(--border)] px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Adaptive Mastery",
              description:
                "Courses reorder themselves based on your speed, accuracy, and attention signals.",
              icon: Atom,
            },
            {
              title: "Deep Focus",
              description:
                "Every session is built with micro-rests and deliberate challenge tuning.",
              icon: Calculator,
            },
            {
              title: "Momentum Rewards",
              description: "Earn streak boosts, glow badges, and unlock hidden labs.",
              icon: Stars,
            },
          ].map((card) => (
            <div key={card.title} className="glass border border-[var(--border)] p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
                <card.icon className="h-4 w-4" /> {card.title}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
