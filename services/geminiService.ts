
import { GoogleGenAI, Type } from "@google/genai";
import { VisionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AIPlannerPrompt {
    time: string;
    subjects: string;
    goal: string;
}

interface VisionPrompt {
    role: string;
    strengths: string[];
    values: string[];
    problem: string;
    tone: string;
}

interface RoadmapContext {
    weeklyHours: number;
    constraints: string;
    priority: string;
}

export const generateAIPlanner = async (promptData: AIPlannerPrompt) => {
    try {
        const promptText = `사용 가능한 시간: ${promptData.time}시간, 우선순위 과목: ${promptData.subjects}, 목표: ${promptData.goal}를 바탕으로 5개의 구체적인 학습 과제를 제안하세요.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: promptText,
            config: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            priority: { type: Type.STRING, description: "우선순위 (상, 중, 하)" },
                            time: { type: Type.STRING, description: "소요 시간 (분)" },
                            text: { type: Type.STRING, description: "구체적인 할 일" },
                            goal: { type: Type.STRING, description: "기대 성과" }
                        },
                        required: ["priority", "time", "text", "goal"]
                    }
                }
            }
        });
        
        const text = response.text;
        if (!text) {
            throw new Error("API response is empty.");
        }
        return JSON.parse(text);
    } catch (err) {
        console.error('AI Planner Error:', err);
        throw new Error("AI 계획 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
};

export const generateVisionStatement = async (inputs: VisionPrompt) => {
    try {
        const promptText = `역할: ${inputs.role}, 강점: ${inputs.strengths.join(', ')}, 가치: ${inputs.values.join(', ')}, 문제: ${inputs.problem}를 바탕으로 ${inputs.tone} 분위기의 비전 선언문을 작성하세요.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: promptText,
            config: {
                temperature: 1,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        body: { type: Type.STRING },
                        slogan: { type: Type.STRING }
                    },
                    required: ["title", "body", "slogan"]
                }
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("API response is empty.");
        }
        return JSON.parse(text);
    } catch (err) {
        console.error('Vision Error:', err);
        throw new Error("AI 비전 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
};

export const generateRoadmap = async (vision: VisionResult, context: RoadmapContext) => {
    try {
        const promptText = `내 비전은 "${vision.title}: ${vision.slogan}" 이고, 내용은 "${vision.body}" 이야. 주당 학습 시간은 ${context.weeklyHours}시간, 현재 제약사항은 "${context.constraints}", 우선순위는 "${context.priority}"야. 이 비전을 달성하기 위한 1년간의 구체적인 학습 로드맵을 3개월, 6개월, 12개월의 3단계로 나누어 제안해줘. 각 단계는 headline과 세부 steps (month, content)로 구성해줘.`;

        const periodSchema = {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING, description: "해당 기간의 핵심 목표 요약" },
                steps: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            month: { type: Type.STRING, description: "해당 월(예: 1-3개월차)" },
                            content: { type: Type.STRING, description: "해당 월의 구체적인 실행 계획" }
                        },
                        required: ["month", "content"]
                    }
                }
            },
            required: ["headline", "steps"]
        };

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: promptText,
            config: {
                temperature: 0.7,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        m3: periodSchema,
                        m6: periodSchema,
                        m12: periodSchema,
                    },
                    required: ["m3", "m6", "m12"]
                }
            }
        });
        
        const text = response.text;
        if (!text) {
            throw new Error("API response is empty.");
        }
        return JSON.parse(text);

    } catch (err) {
        console.error('Roadmap Error:', err);
        throw new Error("AI 로드맵 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
};
