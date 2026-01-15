"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAction } from "convex/react";
import { Camera, Loader2, Send, Trash2, ImageIcon } from "lucide-react";
import { MathContent } from "@/components/MathContent";
import { api } from "@/convex/_generated/api";

type AttachmentPayload = {
  name: string;
  mimeType: string;
  data: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachment?: { name: string; preview?: string };
};

export default function SolverPage() {
  const solveExercise = useAction(api.solver.solveExercise);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [inputText]);

  const toBase64 = (file: File) =>
    new Promise<AttachmentPayload>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result?.toString() || "";
        const base64 = result.split(",")[1] || "";
        resolve({
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          data: base64,
        });
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") return;

    setPendingFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPendingPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPendingPreview(null);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const hasContent = inputText.trim() || pendingFile;
    if (!hasContent || isSubmitting) return;

    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: inputText.trim(),
      attachment: pendingFile
        ? { name: pendingFile.name, preview: pendingPreview || undefined }
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSubmitting(true);

    const currentText = inputText.trim();
    const currentFile = pendingFile;

    setInputText("");
    setPendingFile(null);
    setPendingPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const attachments = currentFile ? [await toBase64(currentFile)] : undefined;

      // Build context from previous messages (last 4 exchanges max)
      const contextMessages = messages.slice(-8);
      const contextPrompt =
        contextMessages.length > 0
          ? contextMessages
              .map((m) => `${m.role === "user" ? "Użytkownik" : "Asystent"}: ${m.content}`)
              .join("\n") +
            "\n\nUżytkownik: " +
            (currentText || "(załącznik)")
          : currentText || undefined;

      const result = await solveExercise({
        prompt: contextPrompt,
        attachments,
      });

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: result },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Błąd podczas generowania odpowiedzi. Spróbuj ponownie.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }, [inputText, pendingFile, pendingPreview, isSubmitting, messages, solveExercise]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearPendingFile = () => {
    setPendingFile(null);
    setPendingPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearChat = () => {
    setMessages([]);
    setInputText("");
    setPendingFile(null);
    setPendingPreview(null);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--background)]">
      {/* Header - minimal */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm">
        <h1 className="text-lg font-bold">Solver</h1>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Wyczyść
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <h2 className="text-xl font-bold mb-2">Szybki Solver</h2>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              Zrób zdjęcie zadania lub wpisz pytanie. Możesz zadawać pytania uzupełniające.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[var(--primary)] text-[var(--background)] rounded-br-md"
                      : "bg-[var(--surface)] border border-[var(--border)] rounded-bl-md"
                  }`}
                >
                  {msg.attachment && (
                    <div className="mb-2">
                      {msg.attachment.preview ? (
                        <img
                          src={msg.attachment.preview}
                          alt={msg.attachment.name}
                          className="max-h-32 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-sm opacity-80">
                          <ImageIcon className="w-4 h-4" />
                          {msg.attachment.name}
                        </div>
                      )}
                    </div>
                  )}
                  {msg.role === "assistant" ? (
                    <MathContent content={msg.content} />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content || "(zdjęcie)"}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isSubmitting && (
              <div className="flex justify-start">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analizuję...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area - fixed bottom */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm p-3 pb-safe">
        {/* Pending file preview */}
        {pendingFile && (
          <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
            {pendingPreview ? (
              <img src={pendingPreview} alt="Preview" className="w-12 h-12 rounded object-cover" />
            ) : (
              <div className="w-12 h-12 rounded bg-[var(--primary)]/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[var(--primary)]" />
              </div>
            )}
            <span className="flex-1 text-sm truncate">{pendingFile.name}</span>
            <button onClick={clearPendingFile} className="p-1 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          {/* Camera button */}
          <button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.setAttribute("capture", "environment");
                fileInputRef.current.click();
                setTimeout(() => fileInputRef.current?.removeAttribute("capture"), 100);
              }
            }}
            disabled={isSubmitting}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--primary)] text-[var(--background)] flex items-center justify-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Gallery button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center transition-all hover:border-[var(--primary)] disabled:opacity-50"
          >
            <ImageIcon className="w-5 h-5 text-[var(--text-muted)]" />
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Wpisz pytanie..."
            rows={1}
            disabled={isSubmitting}
            className="flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none transition-colors disabled:opacity-50"
            style={{ maxHeight: 120 }}
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!inputText.trim() && !pendingFile)}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--primary)] text-[var(--background)] flex items-center justify-center transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
