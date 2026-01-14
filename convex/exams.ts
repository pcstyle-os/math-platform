
import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { authKit } from "./auth";
import { GoogleGenAI, Type } from "@google/genai";

// --- Tool Definition ---

const createLearningPathTool = {
    name: 'createLearningPath',
    description: 'Creates a structured 3-phase math learning path (Theory, Guided Practice, Exam) based on provided materials.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            examTitle: {
                type: Type.STRING,
                description: 'A concise Polish title for this learning material.',
            },
            phase1_theory: {
                type: Type.ARRAY,
                description: 'Phase 1: Review of key concepts, formulas, and definitions found in the source material.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        topic: { type: Type.STRING, description: 'Name of the concept' },
                        content: { type: Type.STRING, description: 'Detailed explanation including formulas.' },
                    },
                    required: ['topic', 'content'],
                },
            },
            phase2_guided: {
                type: Type.ARRAY,
                description: 'Phase 2: Example exercises with step-by-step walkthroughs.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: 'The math problem' },
                        steps: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'List of logical steps to solve the problem',
                        },
                        solution: { type: Type.STRING, description: 'The final answer' },
                        tips: { type: Type.STRING, description: 'Helpful hints or common pitfalls' },
                    },
                    required: ['question', 'steps', 'solution'],
                },
            },
            phase3_exam: {
                type: Type.ARRAY,
                description: 'Phase 3: A test for the user to solve independently.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        answer: { type: Type.STRING, description: 'The correct answer for grading' },
                    },
                    required: ['question', 'answer'],
                },
            },
        },
        required: ['examTitle', 'phase1_theory', 'phase2_guided', 'phase3_exam'],
    },
};

// --- Mutations & Queries ---

export const getExams = query({
    args: {},
    handler: async (ctx) => {
        const user = await authKit.getAuthUser(ctx);
        if (!user) return [];
        return await ctx.db
            .query("exams")
            .withIndex("by_user", (q) => q.eq("userId", user.id))
            .order("desc")
            .collect();
    },
});

export const getExam = query({
    args: { id: v.id("exams") },
    handler: async (ctx, args) => {
        const user = await authKit.getAuthUser(ctx);
        const exam = await ctx.db.get(args.id);
        if (!exam || !user || exam.userId !== user.id) return null;
        return exam;
    },
});

export const createExam = mutation({
    args: { title: v.string(), storageIds: v.array(v.id("_storage")) },
    handler: async (ctx, args) => {
        const user = await authKit.getAuthUser(ctx);
        if (!user) throw new Error("Unauthorized");

        const examId = await ctx.db.insert("exams", {
            userId: user.id,
            title: args.title,
            status: "generating",
            storageIds: args.storageIds,
            createdAt: Date.now(),
        });

        return examId;
    },
});

export const updateExamStatus = mutation({
    args: {
        id: v.id("exams"),
        status: v.union(v.literal("ready"), v.literal("error")),
        data: v.optional(v.any()),
        error: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: args.status,
            data: args.data,
            error: args.error,
        });
    },
});

// --- File Storage ---

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

// --- AI Action ---

export const generateExam = action({
    args: { examId: v.id("exams"), storageIds: v.array(v.id("_storage")) },
    handler: async (ctx, args) => {
        try {
            // Fetch all PDFs and convert to base64
            const pdfParts = [];
            for (const storageId of args.storageIds) {
                const pdfBlob = await ctx.storage.get(storageId);
                if (!pdfBlob) throw new Error(`PDF not found in storage: ${storageId}`);
                const pdfBuffer = await pdfBlob.arrayBuffer();
                const base64 = btoa(
                    new Uint8Array(pdfBuffer)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                pdfParts.push({
                    inlineData: {
                        data: base64,
                        mimeType: "application/pdf",
                    },
                });
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) throw new Error("GEMINI_API_KEY not set");

            const ai = new GoogleGenAI({ apiKey });
            
            // Build prompt with all PDFs
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    ...pdfParts,
                    {
                        role: 'user',
                        parts: [
                            {
                                text: `Przeanalizuj te pliki PDF (${pdfParts.length} plik${pdfParts.length > 1 ? 'ów' : ''}) i stwórz SZCZEGÓŁOWY plan nauki matematyki po polsku. Bądź bardzo obszerny i połącz informacje ze wszystkich plików. Użyj narzędzia 'createLearningPath' aby zwrócić dane.`,
                            },
                        ],
                    },
                ],
                config: {
                    tools: [{ functionDeclarations: [createLearningPathTool] }],
                    thinkingConfig: { thinkingBudget: 4096 },
                },
            });

            const functionCalls = response.functionCalls;
            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                if (call.name === 'createLearningPath') {
                    const data = call.args;
                    
                    await ctx.runMutation(api.exams.updateExamStatus, {
                        id: args.examId,
                        status: "ready",
                        data: data,
                    });
                    return;
                }
            }

            throw new Error("Model nie wywołał oczekiwanej funkcji createLearningPath.");

        } catch (e) {
            console.error(e);
            await ctx.runMutation(api.exams.updateExamStatus, {
                id: args.examId,
                status: "error",
                error: (e as Error).message,
            });
        }
    },
});

