"use client";

import { useMemo, useState } from "react";
import { useAction } from "convex/react";
import { FileText, Image, Loader2, Trash2, Wand2 } from "lucide-react";
import { Header } from "@/components/Header";
import { MathContent } from "@/components/MathContent";
import { api } from "@/convex/_generated/api";

type AttachmentPayload = {
  name: string;
  mimeType: string;
  data: string;
};

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export default function SolverPage() {
  const solveExercise = useAction(api.solver.solveExercise);
  const [question, setQuestion] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasAttachments = attachments.length > 0;
  const canSubmit = hasAttachments || question.trim().length > 0;

  const totalSize = useMemo(
    () => attachments.reduce((sum, file) => sum + file.size, 0),
    [attachments],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const allowed = incoming.filter((file) => file.type.startsWith("image/") || file.type === "application/pdf");
    const rejected = incoming.filter((file) => !allowed.includes(file));
    if (rejected.length > 0) {
      setErrorMessage("Dozwolone są wyłącznie obrazy oraz pliki PDF.");
    }
    setAttachments((prev) => [...prev, ...allowed]);
  };

  const toBase64 = (file: File) =>
    new Promise<AttachmentPayload>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result?.toString() || "";
        const base64 = result.split(",")[1] || "";
        resolve({ name: file.name, mimeType: file.type || "application/octet-stream", data: base64 });
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleSolve = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setResponse(null);

    try {
      const payload = await Promise.all(attachments.map(toBase64));
      const result = await solveExercise({
        prompt: question.trim() || undefined,
        attachments: payload.length > 0 ? payload : undefined,
      });
      setResponse(result);
    } catch (error) {
      setErrorMessage("Nie udało się wygenerować odpowiedzi. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16 w-full">
        <div className="mb-10 space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <Wand2 className="w-4 h-4" />
            AI Solver
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Solver zadań z obrazem, PDF i tekstem
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg">
            Prześlij zdjęcie zadania, dodaj notatki tekstowe lub PDF. Otrzymasz zwięzłe rozwiązanie z pełnym zapisem
            matematycznym w KaTeX.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8">
          <div className="card-premium space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Treść zadania (opcjonalnie)
              </label>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={5}
                placeholder="Wpisz zadanie lub kontekst (np. 'Oblicz granicę...')."
                className="w-full rounded-[var(--radius)] p-4 text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Załączniki (obrazy i PDF)
              </label>
              <div className="border border-dashed border-[var(--border)] rounded-[var(--radius)] p-6 text-center space-y-3">
                <div className="flex items-center justify-center gap-3 text-[var(--text-muted)]">
                  <Image className="w-5 h-5" />
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  Przeciągnij pliki lub wybierz z dysku (obsługa wielu plików).
                </p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={(event) => handleFiles(event.target.files)}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[var(--primary)] file:text-[var(--background)] file:rounded-[var(--radius)]"
                />
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  <span>Lista załączników</span>
                  <span>{formatBytes(totalSize)}</span>
                </div>
                <ul className="space-y-2">
                  {attachments.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--border)] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold">{file.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{formatBytes(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachments((prev) => prev.filter((_, fileIndex) => fileIndex !== index))}
                        className="flex items-center gap-2 text-xs font-bold uppercase text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        Usuń
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-[var(--radius)] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              className="btn-premium w-full flex items-center justify-center gap-3 text-sm sm:text-base"
              onClick={handleSolve}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {isSubmitting ? "Analizuję..." : "Rozwiąż zadanie"}
            </button>
          </div>

          <div className="card-premium min-h-[320px]">
            <h2 className="text-lg font-bold mb-4">Odpowiedź</h2>
            {response ? (
              <MathContent content={response} />
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                Tutaj pojawi się rozwiązanie z formatowaniem matematycznym.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
