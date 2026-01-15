import { GoogleGenAI, createPartFromBase64, createPartFromText } from "@google/genai";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("GEMINI_API_KEY not set", { status: 500 });
  }

  const body = await req.json();
  const { prompt, attachments, systemPrompt, knowledgeContext } = body as {
    prompt?: string;
    attachments?: { name: string; mimeType: string; data: string }[];
    systemPrompt?: string;
    knowledgeContext?: string;
  };

  const ai = new GoogleGenAI({ apiKey });

  const parts: ReturnType<typeof createPartFromText>[] = [];

  // Add knowledge context if available
  if (knowledgeContext) {
    parts.push(createPartFromText(`[Kontekst z bazy wiedzy użytkownika]\n${knowledgeContext}\n\n`));
  }

  if (prompt) {
    parts.push(createPartFromText(prompt));
  }

  if (attachments && attachments.length > 0) {
    for (const attachment of attachments) {
      parts.push(createPartFromText(`Plik: ${attachment.name}`));
      parts.push(createPartFromBase64(attachment.data, attachment.mimeType));
    }
  }

  const defaultSystemPrompt = `Jesteś szybkim i dokładnym solverem zadań matematycznych. Analizuj obrazy, PDF i tekst.
ZASADY:
1. Zwracaj wynik w Markdown + LaTeX ($...$ i $$...$$).
2. Odpowiedź ma być konkretna: wynik + kluczowe kroki rozwiązania.
3. Bez emoji.
4. Jeśli brakuje danych lub obraz jest nieczytelny, krótko napisz czego brakuje.`;

  const finalSystemPrompt = systemPrompt || defaultSystemPrompt;

  // Create streaming response
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await ai.models.generateContentStream({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts }],
          config: {
            systemInstruction: finalSystemPrompt,
          },
        });

        const encoder = new TextEncoder();

        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        controller.enqueue(new TextEncoder().encode(`\n\n[Błąd: ${errorMessage}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
