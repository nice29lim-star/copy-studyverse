
import React, { useState } from 'react';
import { AppState, TodoItem } from '../types';
import * as Icons from './icons';
import { generateAIPlanner } from '../services/geminiService';

interface AIPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    updateState: (updater: (prevState: AppState) => AppState) => void;
    currentGoal: string;
}

const AIPlannerModal: React.FC<AIPlannerModalProps> = ({ isOpen, onClose, updateState, currentGoal }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiForm, setAiForm] = useState({ time: '4', subjects: '', goal: currentGoal });

    const runAIPlanner = async () => {
        setIsGenerating(true);
        try {
            const result = await generateAIPlanner(aiForm);
            // FIX: Updated mapping to use `r.text` instead of `r.todo` based on the new schema.
            const newTodos: TodoItem[] = result.map((r: any, i: number) => ({
                id: Date.now() + i,
                priority: r.priority,
                time: r.time.toString(),
                text: r.text,
                goal: r.goal,
                done: false
            }));
            updateState(prev => ({
                ...prev,
                planner: {
                    ...prev.planner,
                    todos: [...prev.planner.todos, ...newTodos],
                    goal: aiForm.goal || prev.planner.goal
                }
            }));
            onClose();
        } catch (err) {
            alert(err instanceof Error ? err.message : "AI 계획 생성 중 알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-in">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"
                >
                    <Icons.X className="w-5 h-5 text-slate-400" />
                </button>
                <h3 className="text-2xl font-black mb-6">AI 학습 계획 생성</h3>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase mb-2">사용 가능한 시간 (시간)</label>
                        <input
                            type="number"
                            value={aiForm.time}
                            onChange={(e) => setAiForm({ ...aiForm, time: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase mb-2">우선순위 과목</label>
                        <input
                            type="text"
                            value={aiForm.subjects}
                            onChange={(e) => setAiForm({ ...aiForm, subjects: e.target.value })}
                            placeholder="예: 수학, 영어, 과학"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase mb-2">오늘의 학습 목표</label>
                        <input
                            type="text"
                            value={aiForm.goal}
                            onChange={(e) => setAiForm({ ...aiForm, goal: e.target.value })}
                            placeholder="예: 수학 문제집 50문제"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    onClick={runAIPlanner}
                    disabled={isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Icons.Loader2 className="w-5 h-5 animate-spin" />
                            <span>생성 중...</span>
                        </>
                    ) : (
                        <>
                            <Icons.Sparkles className="w-5 h-5" />
                            <span>AI 계획 생성</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AIPlannerModal;
