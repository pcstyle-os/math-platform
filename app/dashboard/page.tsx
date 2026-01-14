
"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Plus, Clock, FileText, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

export default function Dashboard() {
    const exams = useQuery(api.exams.getExams);

    if (exams === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[#ff00ff] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[#ff00ff]">&lt;MOJE_PROJEKTY /&gt;</h1>
                    <p className="text-gray-500 font-mono text-sm">// Zarządzaj swoimi planami nauki</p>
                </div>
                <Link href="/create" className="btn-premium">
                    <Plus className="w-5 h-5 mr-2" />
                    NOWY_PLAN
                </Link>
            </div>

            {exams.length === 0 ? (
                <div className="text-center py-20 card-premium">
                    <div className="p-4 border border-[#ff00ff]/30 w-fit mx-auto mb-6">
                        <FileText className="w-8 h-8 text-[#ff00ff]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#ff00ff]">NULL_PROJECTS</h3>
                    <p className="text-gray-500 mb-8 font-mono text-sm">// Nie wygenerowałeś jeszcze żadnego planu nauki.</p>
                    <Link href="/create" className="btn-premium">
                        INICJUJ_PIERWSZY_PLAN
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam, idx) => (
                        <motion.div
                            key={exam._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="card-premium flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-3 py-1 border text-xs font-bold uppercase tracking-wider ${exam.status === 'ready' ? 'border-emerald-500 text-emerald-500' :
                                        exam.status === 'generating' ? 'border-amber-500 text-amber-500 animate-pulse' :
                                            'border-red-500 text-red-500'
                                        }`}>
                                        {exam.status === 'ready' ? 'GOTOWY' :
                                            exam.status === 'generating' ? 'GENEROWANIE...' : 'BŁĄD'}
                                    </div>
                                    <Clock className="w-4 h-4 text-gray-600" />
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-[#ff00ff] transition-colors">
                                    {exam.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-6 font-mono">
                                    // {formatDistanceToNow(new Date(exam.createdAt), { addSuffix: true, locale: pl })}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-[#ff00ff]/20">
                                <span className="text-xs text-gray-500 font-mono">
                                    [{exam.data?.phase1_theory.length || 0}] zagadnień
                                </span>
                                <Link
                                    href={`/exam/${exam._id}`}
                                    className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider ${exam.status === 'ready' ? 'text-[#ff00ff] hover:text-[#00ffff]' : 'text-gray-700 cursor-not-allowed'
                                        }`}
                                    onClick={(e) => exam.status !== 'ready' && e.preventDefault()}
                                >
                                    OTWÓRZ <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
