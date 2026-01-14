
"use client";

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function CreateExam() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateUploadUrl = useMutation(api.exams.generateUploadUrl);
    const createExam = useMutation(api.exams.createExam);
    const generateExamAction = useAction(api.exams.generateExam);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            setFile(acceptedFiles[0]);
            if (!title) setTitle(acceptedFiles[0].name.replace(/\.pdf$/i, ""));
        },
    });

    const handleUpload = async () => {
        if (!file || !title) return;

        setIsUploading(true);
        setError(null);

        try {
            // 1. Get upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();

            // 3. Create exam record
            const examId = await createExam({ title, storageId });

            // 4. Trigger AI Action (non-blocking in UI, we redirect)
            generateExamAction({ examId, storageId }).catch(console.error);

            router.push("/dashboard");
        } catch (e) {
            console.error(e);
            setError("ERROR: Wystąpił błąd podczas przesyłania pliku. Spróbuj ponownie.");
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-[#ff00ff]">&lt;NOWY_PLAN /&gt;</h1>
                <p className="text-gray-500 font-mono text-sm">// Prześlij PDF z materiałami, a my zajmiemy się resztą.</p>
            </div>

            <div className="card-premium space-y-8">
                <div>
                    <label className="block text-sm font-medium text-[#ff00ff] mb-2 uppercase tracking-wider">
                        &gt; nazwa_projektu
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="np. Analiza Matematyczna - Kolokwium 1"
                        className="w-full px-4 py-3 rounded-none"
                    />
                </div>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed p-12 text-center transition-all cursor-pointer ${isDragActive ? 'border-[#ff00ff] bg-[#ff00ff]/5 shadow-[0_0_30px_rgba(255,0,255,0.2)]' : 'border-[#ff00ff]/30 hover:border-[#ff00ff]/60'
                        }`}
                >
                    <input {...getInputProps()} />
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className="p-4 border border-[#ff00ff]/30 mb-4">
                                    <Upload className="w-8 h-8 text-[#ff00ff]" />
                                </div>
                                <p className="text-lg font-medium mb-1">UPUŚĆ_PLIK</p>
                                <p className="text-sm text-gray-600 font-mono">// Obsługujemy tylko pliki PDF do 50MB</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="file"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center"
                            >
                                <div className="p-4 border border-[#ff00ff] bg-[#ff00ff]/10 mb-4 relative">
                                    <File className="w-8 h-8 text-[#ff00ff]" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="absolute -top-2 -right-2 p-1 bg-black border border-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                                <p className="text-lg font-bold mb-1 truncate max-w-xs text-[#ff00ff]">{file.name}</p>
                                <p className="text-sm text-gray-500 font-mono">[{(file.size / 1024 / 1024).toFixed(2)} MB]</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-4 border border-red-500 text-red-500 text-sm font-mono">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || !title || isUploading}
                    className="btn-premium w-full py-4 text-lg group"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            PRZESYŁANIE...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                            GENERUJ_PLAN_Z_AI
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
