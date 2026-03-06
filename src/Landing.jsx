import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TigonLogoMark } from "./components/TigonBrand";

const featureList = [
  {
    title: "Secure Payments",
    description: "Bank-grade security rails for every transaction, webhook, and payout.",
    details:
      "Fraud monitoring, encrypted sessions, and role-based access keep your financial data protected at every step.",
    icon: LockIcon,
  },
  {
    title: "Smart Analytics",
    description: "Real-time revenue intelligence with anomaly detection and insights.",
    details:
      "Track daily patterns and identify spending spikes instantly so your budgeting decisions are data-driven.",
    icon: ChartIcon,
  },
  {
    title: "Global Transfers",
    description: "Move funds across markets with fast settlement and transparent fees.",
    details:
      "Monitor transfer timelines and fee breakdowns before confirming to avoid hidden international costs.",
    icon: GlobeIcon,
  },
  {
    title: "Instant Settlements",
    description: "Automated treasury workflows and same-day settlement capabilities.",
    details:
      "Automate recurring cash-flow operations and keep your balance updated with near real-time settlement status.",
    icon: BoltIcon,
  },
];

const logos = ["Atlas", "NovaPay", "Quanta", "Helio", "Lumen", "Aegis"];
const tips = [
  "Set a monthly savings target before logging expenses.",
  "Review your top spending category every Sunday.",
  "Keep fixed and variable costs tracked separately.",
];

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.5 4.5 0 10-9 0V10.5m-1.5 0h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014.5 19.5V12A1.5 1.5 0 016 10.5z" />
    </svg>
  );
}

function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5h16.5M7.5 15l3-3 2.25 2.25 4.5-4.5" />
    </svg>
  );
}

function GlobeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75c4.556 0 8.25 3.694 8.25 8.25S16.556 20.25 12 20.25 3.75 16.556 3.75 12 7.444 3.75 12 3.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15M12 3.75c2.18 2.357 3.3 5.14 3.3 8.25s-1.12 5.893-3.3 8.25M12 3.75c-2.18 2.357-3.3 5.14-3.3 8.25s1.12 5.893 3.3 8.25" />
    </svg>
  );
}

function BoltIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 3.75L6.75 12h4.5l-.75 8.25L17.25 12h-4.5l.75-8.25z" />
    </svg>
  );
}

export default function Landing({ onGetStarted, theme, toggleTheme }) {
  const isDark = theme === "dark";
  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  const headingWords = useMemo(() => ["Financial Management", "Simplified & Secure"], []);
  const [activeFeature, setActiveFeature] = useState(featureList[0]);
  const [tipIndex, setTipIndex] = useState(0);
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(32000);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const savings = Math.max(income - expenses, 0);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  const handleLearnMore = () => {
    const section = document.getElementById("features");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onCardMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setTilt({ rotateX: (0.5 - y) * 8, rotateY: (x - 0.5) * 10 });
  };

  const pageBg = isDark ? "bg-slate-900/70" : "bg-slate-50/70";
  const textMain = isDark ? "text-white" : "text-slate-900";
  const textSub = isDark ? "text-slate-300" : "text-slate-600";
  const borderTone = isDark ? "border-blue-900/50" : "border-slate-300";
  const headerBg = isDark ? "bg-slate-900/80" : "bg-white/90";
  const heroGradient = isDark
    ? "from-slate-900 via-blue-900 to-slate-900"
    : "from-white via-blue-100 to-slate-100";
  const sectionAlt = isDark ? "bg-slate-800/45" : "bg-blue-50/75";
  const panelBg = isDark ? "bg-blue-900/30" : "bg-white";
  const panelBorder = isDark ? "border-blue-700/50" : "border-blue-200";

  return (
    <div className={`relative overflow-hidden ${pageBg} ${textMain} font-sans antialiased`}>
      <header className={`sticky top-0 z-50 border-b ${borderTone} ${headerBg} backdrop-blur-lg`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#hero" className={`flex items-center gap-3 text-xl font-black tracking-tight ${textMain}`}>
              <TigonLogoMark size={48} />
              <span>
                Tigon <span className="text-blue-500">Finance</span>
              </span>
            </a>
            <nav className={`hidden items-center gap-8 text-sm font-semibold md:flex ${textSub}`}>
              <a href="#features" className="transition hover:text-blue-500">Features</a>
              <a href="#simulator" className="transition hover:text-blue-500">Simulator</a>
              <a href="#contact" className="transition hover:text-blue-500">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`h-10 rounded-xl border px-3 text-xs font-bold transition ${isDark ? "border-blue-700 bg-blue-900/50 text-blue-200 hover:bg-blue-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"}`}
                aria-label="Toggle theme"
              >
                {isDark ? "DARK" : "LIGHT"}
              </button>
              <button
                onClick={onGetStarted}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      </header>

      <section id="hero" className="relative overflow-hidden py-24 md:py-32">
        <MotionDiv
          className={`absolute inset-0 -z-10 bg-gradient-to-br ${heroGradient}`}
          animate={{ backgroundPosition: ["0% 0%", "100% 40%", "0% 0%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className={`absolute left-10 top-20 h-40 w-40 rounded-full blur-3xl ${isDark ? "bg-blue-500/20" : "bg-blue-300/30"}`} />
          <div className={`absolute right-20 bottom-20 h-52 w-52 rounded-full blur-3xl ${isDark ? "bg-blue-400/10" : "bg-cyan-300/30"}`} />
        </div>

        <div className="container mx-auto px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <MotionDiv
              className="max-w-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? "border-blue-700 bg-blue-900/40 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
                Smart Finance Platform
              </span>

              <div className="mt-6 space-y-2">
                {headingWords.map((line) => (
                  <h1 key={line} className={`text-5xl font-black leading-tight md:text-6xl ${textMain}`}>
                    {line}
                  </h1>
                ))}
              </div>

              <p className={`mt-6 max-w-lg text-lg leading-relaxed ${textSub}`}>
                Manage your finances with ease. Track expenses, monitor income, and get AI-powered insights to help you save more.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={onGetStarted}
                  className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/40"
                >
                  Get Started
                </button>
                <button
                  onClick={handleLearnMore}
                  className={`rounded-xl border px-8 py-3.5 text-sm font-bold transition ${isDark ? "border-blue-600 text-blue-300 hover:bg-blue-900/40" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                >
                  Learn More
                </button>
              </div>

              <div className={`mt-8 rounded-xl border p-4 ${isDark ? "border-blue-700/40 bg-blue-900/20" : "border-blue-200 bg-white"}`}>
                <p className={`text-xs uppercase tracking-wider ${isDark ? "text-blue-300" : "text-blue-700"}`}>Live tip</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className={`mt-2 text-sm ${textSub}`}
                  >
                    {tips[tipIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </MotionDiv>

            <div className="flex items-center justify-center">
              <MotionDiv
                onMouseMove={onCardMove}
                onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
                style={{ transform: `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)` }}
                className={`w-full max-w-md rounded-2xl border p-8 backdrop-blur-sm transition-transform duration-150 ${panelBorder} ${panelBg}`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <p className={`text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-700"}`}>Dashboard Overview</p>
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <div className={`rounded-xl p-4 border ${isDark ? "bg-slate-800/50 border-blue-700/30" : "bg-slate-50 border-slate-200"}`}>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Total Balance</p>
                  <p className={`mt-2 text-3xl font-bold ${textMain}`}>Rs 45,230.50</p>
                  <div className="mt-4 flex h-20 items-end gap-2">
                    {[30, 45, 35, 55, 65, 50, 70].map((h, idx) => (
                      <MotionDiv
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: idx * 0.05, duration: 0.4 }}
                        className="flex-1 rounded-t-lg bg-blue-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className={`rounded-lg border p-3 ${isDark ? "bg-blue-900/50 border-blue-700/30" : "bg-blue-50 border-blue-200"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Monthly Savings</p>
                    <p className="mt-1 font-semibold text-green-500">+Rs 8,500</p>
                  </div>
                  <div className={`rounded-lg border p-3 ${isDark ? "bg-blue-900/50 border-blue-700/30" : "bg-blue-50 border-blue-200"}`}>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Expenses</p>
                    <p className="mt-1 font-semibold text-orange-500">Rs 12,300</p>
                  </div>
                </div>
              </MotionDiv>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={`py-24 ${sectionAlt}`}>
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-500">Key Features</p>
            <h2 className={`mt-3 text-4xl font-black md:text-5xl ${textMain}`}>Manage Your Money Better</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featureList.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeFeature.title === item.title;
              return (
                <MotionButton
                  key={item.title}
                  type="button"
                  onClick={() => setActiveFeature(item)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  className={`rounded-xl border p-6 text-left transition ${
                    isActive
                      ? isDark
                        ? "border-blue-500 bg-blue-900/60"
                        : "border-blue-400 bg-blue-100"
                      : isDark
                      ? "border-blue-700/50 bg-blue-900/30 hover:border-blue-600 hover:bg-blue-900/50"
                      : "border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className={`text-lg font-bold ${textMain}`}>{item.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${textSub}`}>{item.description}</p>
                </MotionButton>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mx-auto mt-8 max-w-4xl rounded-xl border p-5 ${isDark ? "border-blue-700/50 bg-slate-900/60" : "border-blue-200 bg-white"}`}
            >
              <p className={`text-xs uppercase tracking-wider ${isDark ? "text-blue-300" : "text-blue-700"}`}>Selected feature</p>
              <h4 className={`mt-1 text-xl font-bold ${textMain}`}>{activeFeature.title}</h4>
              <p className={`mt-2 ${textSub}`}>{activeFeature.details}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="simulator" className="py-24">
        <div className="container mx-auto px-6">
          <div className={`mx-auto max-w-4xl rounded-2xl border p-8 ${isDark ? "border-blue-700/50 bg-gradient-to-br from-blue-950/50 to-slate-900/80" : "border-blue-200 bg-gradient-to-br from-white to-blue-50"}`}>
            <h3 className={`text-3xl font-black ${textMain}`}>Savings Simulator</h3>
            <p className={`mt-2 ${textSub}`}>Adjust values and see your projected monthly savings update live.</p>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <label className={`text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                  Monthly Income: Rs {income.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="1000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="mt-3 w-full accent-blue-500"
                />

                <label className={`mt-6 block text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                  Monthly Expenses: Rs {expenses.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="180000"
                  step="1000"
                  value={expenses}
                  onChange={(e) => setExpenses(Number(e.target.value))}
                  className="mt-3 w-full accent-orange-500"
                />
              </div>

              <div className={`rounded-xl border p-5 ${isDark ? "border-blue-700/40 bg-slate-900/60" : "border-blue-200 bg-white"}`}>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Projected savings</p>
                <p className="mt-2 text-4xl font-black text-green-500">Rs {savings.toLocaleString()}</p>
                <p className={`mt-1 text-sm ${textSub}`}>Savings rate: {savingsRate}%</p>

                <div className={`mt-5 h-3 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                  <MotionDiv
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(savingsRate, 100)}%` }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="py-24">
        <div className="container mx-auto px-6">
          <div className={`rounded-2xl border px-6 py-12 ${isDark ? "border-blue-700/50 bg-gradient-to-br from-blue-900/40 to-slate-900" : "border-blue-200 bg-gradient-to-br from-white to-blue-50"}`}>
            <h3 className={`text-center text-2xl font-bold md:text-3xl ${textMain}`}>Trusted by Smart Investors</h3>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {logos.map((logo) => (
                <MotionDiv
                  whileHover={{ y: -4, scale: 1.03 }}
                  key={logo}
                  className={`rounded-lg border px-4 py-4 text-center text-sm font-semibold transition ${isDark ? "border-blue-700/30 bg-blue-900/20 text-slate-400 hover:border-blue-600 hover:text-blue-300" : "border-blue-200 bg-white text-slate-500 hover:border-blue-400 hover:text-blue-700"}`}
                >
                  {logo}
                </MotionDiv>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className={`py-24 ${isDark ? "bg-gradient-to-br from-blue-900 to-slate-900" : "bg-gradient-to-br from-blue-100 to-slate-100"}`}>
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className={`text-4xl font-black md:text-5xl ${textMain}`}>Start Your Finance Journey</h2>
            <p className={`mt-5 text-lg ${textSub}`}>
              Take control of your money today. Join thousands who are already managing their finances smarter.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={onGetStarted}
                className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/40"
              >
                Get Started Free
              </button>
              <button
                onClick={handleLearnMore}
                className={`rounded-xl border px-8 py-3.5 text-sm font-bold transition ${isDark ? "border-blue-600 bg-transparent text-blue-300 hover:bg-blue-900/40" : "border-blue-300 bg-white text-blue-700 hover:bg-blue-100"}`}
              >
                Explore Features
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
