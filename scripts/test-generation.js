
const { GoogleGenAI, Type } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load local env vars
dotenv.config({ path: path.join(__dirname, "../.env.local") });

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

async function testGeneration() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("BLAD: GEMINI_API_KEY nie zostal znaleziony w .env.local");
        process.exit(1);
    }

    const pdfPath = path.join(__dirname, "../example/example.pdf");
    if (!fs.existsSync(pdfPath)) {
        console.error(`BLAD: Nie znaleziono pliku @[example/example.pdf] pod sciezką: ${pdfPath}`);
        process.exit(1);
    }

    console.log("Wczytywanie pliku PDF...");
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64 = pdfBuffer.toString("base64");

    const ai = new GoogleGenAI({ apiKey });

    console.log("Uruchamianie Gemini 3 Flash z Tool Calling...");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                {
                    parts: [
                        {
                            inlineData: {
                                data: base64,
                                mimeType: "application/pdf",
                            },
                        },
                        {
                            text: `Przeanalizuj ten plik PDF i stwórz SZCZEGÓŁOWY plan nauki matematyki po polsku. Bądź bardzo obszerny. Użyj narzędzia 'createLearningPath' aby zwrócić dane.`,
                        }
                    ]
                }
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
                console.log("SUKCES: Pomyslnie wygenerowano dane przez Tool Calling.");
                console.log(`Tytul: ${data.examTitle}`);
                console.log(`Teoria: ${data.phase1_theory.length} tematów`);
                console.log(`Zadania: ${data.phase2_guided.length} ćwiczeń`);
                console.log(`Egzamin: ${data.phase3_exam.length} pytań`);

                fs.writeFileSync(path.join(__dirname, "last_test_result.json"), JSON.stringify(data, null, 2));
                console.log(`Wynik zapisany do scripts/last_test_result.json`);
                return;
            }
        }

        console.error("BLAD: Model nie wywolal oczekiwanej funkcji.");
        console.log("Surowa odpowiedź:", JSON.stringify(response, null, 2));

    } catch (err) {
        console.error("❌ BŁĄD PODCZAS GENERACJI:");
        console.error(err);
    }
}

testGeneration();

