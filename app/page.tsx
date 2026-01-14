
"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useConvexAuth } from "convex/react";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 border border-[#ff00ff] group-hover:bg-[#ff00ff] group-hover:shadow-[0_0_20px_#ff00ff] transition-all duration-300">
            <Brain className="w-6 h-6 text-[#ff00ff] group-hover:text-black transition-colors" />
          </div>
          <span className="text-2xl font-bold text-[#ff00ff] tracking-wider">
            MATHPREP<span className="text-white">_AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-400 font-medium">
          <a href="#features" className="hover:text-[#ff00ff] transition-colors uppercase tracking-wider text-sm">
            &lt;Cechy /&gt;
          </a>
          <a href="#" className="hover:text-[#ff00ff] transition-colors uppercase tracking-wider text-sm">
            &lt;Cennik /&gt;
          </a>
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="btn-premium py-2 px-5 text-sm"
          >
            {isLoading ? "..." : isAuthenticated ? "Dashboard" : "Inicjuj"}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-40 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#ff00ff]/30 bg-[#ff00ff]/5 text-[#ff00ff] text-sm font-medium mb-8 tracking-wider">
            <Sparkles className="w-4 h-4" />
            &lt;GEMINI_1.5_FLASH /&gt;
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
            <span className="text-[#ff00ff]">&lt;</span>
            MACHINE_LEARNING
            <span className="text-[#ff00ff]"> /&gt;</span>
            <br />
            <span className="text-[#ff00ff]">FOR_MATH</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-mono">
            // Prześlij swój podręcznik lub notatki w formacie PDF.
            <br />
            // Nasz system wygeneruje trzystopniowy plan nauki.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/dashboard" className="btn-premium group w-full sm:w-auto animate-pulse-glow">
              INICJUJ_SYSTEM
              <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-3 border border-gray-700 text-gray-400 font-semibold hover:border-[#00ffff] hover:text-[#00ffff] transition-all w-full sm:w-auto uppercase tracking-wider">
              Zobacz_Przykład
            </button>
          </div>
        </motion.div>

        {/* Feature Preview Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 w-full px-4">
          {[
            {
              icon: BookOpen,
              title: "OBSZERNA_TEORIA",
              desc: "// Głęboka analiza materiałów źródłowych i ekstrakcja wszystkich wzorów."
            },
            {
              icon: Sparkles,
              title: "ZADANIA_Z_PRZEWODNIKIEM",
              desc: "// Rozwiązania krok po kroku, które nauczą Cię jak myśleć."
            },
            {
              icon: Brain,
              title: "EGZAMINY_PRÓBNE",
              desc: "// Generujemy testy sprawdzające wiedzę, bazując na Twoich materiałach."
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-premium text-left group"
            >
              <div className="p-3 border border-[#ff00ff]/30 w-fit mb-4 group-hover:bg-[#ff00ff]/10 transition-colors">
                <f.icon className="w-6 h-6 text-[#ff00ff]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#ff00ff]">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed font-mono text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="py-10 border-t border-[#ff00ff]/20 text-center text-gray-600 text-sm font-mono">
        &lt;!-- © 2026 MATHPREP_AI // pcstyle --&gt;
      </footer>
    </div>
  );
}
