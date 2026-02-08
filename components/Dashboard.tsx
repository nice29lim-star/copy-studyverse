
import React from 'react';
import { AppState, TabId } from '../types';
import * as Icons from './icons';

interface DashboardProps {
    state: AppState;
    onNavigate: (tab: TabId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onNavigate }) => {
    const { user, diagnosis, planner, roadmap, records, literacy } = state;
    const hasDiagnosis = !!(diagnosis.holland && diagnosis.srl);
    const doneTodos = planner.todos.filter(t => t.done).length;
    const todoPct = planner.todos.length ? Math.round((doneTodos / planner.todos.length) * 100) : 0;
    const latestLiteracy = literacy[0];

    const badges = [
        { id: 'b1', name: '성향 파악', icon: Icons.Brain, unlocked: hasDiagnosis },
        { id: 'b2', name: '계획 실천', icon: Icons.CalendarCheck, unlocked: doneTodos > 0 },
        { id: 'b3', name: '비전 수립', icon: Icons.Map, unlocked: !!roadmap },
        { id: 'b4', name: '성장 기록', icon: Icons.FolderOpen, unlocked: records.length > 0 },
        { id: 'b5', name: '독해력 측정', icon: Icons.BookOpen, unlocked: literacy.length > 0 },
    ];

    const modules = [
        { id: 'diagnosis', icon: Icons.Brain, label: '진단', val: hasDiagnosis ? '완료' : '시작', desc: hasDiagnosis ? `유형 ${diagnosis.holland?.code}` : '3분 진단', color: 'blue' },
        { id: 'planner', icon: Icons.CalendarCheck, label: '플래너', val: `${doneTodos}/${planner.todos.length}`, desc: `진행률 ${todoPct}%`, color: 'indigo' },
        { id: 'roadmap', icon: Icons.Map, label: '로드맵', val: roadmap ? '완료' : '미정', desc: roadmap ? '비전 확인' : '진로 설계', color: 'purple' },
        { id: 'records', icon: Icons.FolderOpen, label: '기록', val: `${records.length}회`, desc: '학습 성찰', color: 'slate' },
        { id: 'literacy', icon: Icons.BookOpen, label: '문해력', val: latestLiteracy ? latestLiteracy.level : '미검사', desc: latestLiteracy ? `점수: ${latestLiteracy.score}/16` : '독해력 진단', color: 'emerald' },
    ];
    
    const activeTabColor = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-50 text-blue-600';
            case 'indigo': return 'bg-indigo-50 text-indigo-600';
            case 'purple': return 'bg-purple-50 text-purple-600';
            case 'slate': return 'bg-slate-100 text-slate-600';
            case 'emerald': return 'bg-emerald-50 text-emerald-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in">
            <div className="flex-1 space-y-8">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-blue-200/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-8 mb-8">
                            <img src="https://picsum.photos/seed/studyverse-hero/112/112" alt="StudyVerse Hero" className="w-28 h-28 rounded-3xl flex-shrink-0" style={{ animation: 'float 6s ease-in-out infinite' }}/>
                            <div>
                                <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold border border-white/20 mb-4 inline-block backdrop-blur-md">✨ StudyVerse v1.0</span>
                                <h2 className="text-3xl md:text-4xl font-black mb-2 leading-tight">{user.nickname}님의<br />스마트한 학습 여정</h2>
                                <p className="text-blue-100 text-sm md:text-base font-medium opacity-90">{hasDiagnosis ? '오늘도 목표를 향해 달려볼까요?' : '첫 진단으로 당신의 잠재력을 깨워보세요.'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                { label: '진단', val: hasDiagnosis ? diagnosis.holland?.code : '-', sub: 'Holland' },
                                { label: '플래너', val: `${doneTodos}/${planner.todos.length}`, sub: `${todoPct}%` },
                                { label: '기록', val: `${records.length}회`, sub: '연속 3일' }
                            ].map((kpi, i) => (
                                <div key={i} className="bg-white/10 rounded-3xl p-4 border border-white/10 backdrop-blur-md flex flex-col items-center hover:bg-white/20 transition-all cursor-default">
                                    <span className="text-[10px] uppercase font-black text-blue-100 mb-1 opacity-70 tracking-tighter">{kpi.label}</span>
                                    <span className="text-xl md:text-2xl font-black">{kpi.val}</span>
                                    <span className="text-[10px] text-blue-200 font-bold">{kpi.sub}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => onNavigate(hasDiagnosis ? 'planner' : 'diagnosis')}
                            className="w-full bg-white text-blue-600 py-5 rounded-3xl flex items-center justify-between px-8 font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-900/20"
                        >
                            <span>{hasDiagnosis ? '오늘의 계획 세우기' : '라이트 진단 시작하기'}</span>
                            <Icons.ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 px-1">
                        <Icons.Medal className="w-6 h-6 text-yellow-500" /> 나의 성장 뱃지
                    </h3>
                    <div className="grid grid-cols-5 gap-4">
                        {badges.map((b) => (
                            <div key={b.id} className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${b.unlocked ? 'bg-white border-slate-200 shadow-sm opacity-100' : 'bg-slate-50 border-transparent opacity-40 grayscale'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${b.unlocked ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                                    <b.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-600">{b.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => onNavigate(m.id)}
                            className="bg-white border border-slate-200 rounded-[2rem] p-6 text-left hover:border-blue-400 hover:shadow-xl transition-all group flex flex-col justify-between min-h-[160px]"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeTabColor(m.color)}`}>
                                    <m.icon className="w-7 h-7" />
                                </div>
                                <span className="px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-tight">{m.val}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-0.5">{m.label}</h3>
                                <p className="text-slate-500 text-xs font-medium mb-3">{m.desc}</p>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-blue-600 transition-all duration-1000`} 
                                        style={{ width: m.id === 'planner' ? `${todoPct}%` : m.id === 'diagnosis' && hasDiagnosis ? '100%' : '0%' }}
                                    />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full lg:w-80 space-y-8">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Icons.Activity className="w-5 h-5 text-blue-600" /> 오늘의 활동
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl">🔥</div>
                            <div>
                                <p className="text-xs font-black text-slate-800">학습 연속 3일째</p>
                                <p className="text-[10px] font-bold text-slate-400">꾸준함이 실력이 됩니다!</p>
                            </div>
                        </div>
                        {hasDiagnosis && (
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">🎯</div>
                                <div>
                                    <p className="text-xs font-black text-slate-800">진단 결과 기반 로드맵</p>
                                    <p className="text-[10px] font-bold text-slate-400">유형: {diagnosis.holland?.code}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Icons.Sparkles className="w-24 h-24 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Icons.Sparkles className="w-5 h-5 text-indigo-500" /> AI 코치
                    </h3>
                    <div className="space-y-4 relative z-10">
                        {[
                            "오늘의 학습 목표를 구체적으로 세워보세요.",
                            "집중이 흐트러질 땐 5분 명상을 추천합니다.",
                            "Holland 유형에 맞는 권장 도서를 확인하세요."
                        ].map((text, i) => (
                            <div key={i} className="flex gap-3 items-start group cursor-pointer">
                                <div className="mt-0.5 w-5 h-5 rounded-lg border-2 border-indigo-200 flex items-center justify-center group-hover:border-indigo-600 transition-all">
                                    <Icons.Check className="w-3 h-3 text-indigo-600 scale-0 group-hover:scale-100 transition-all" />
                                </div>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed group-hover:text-indigo-600">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
