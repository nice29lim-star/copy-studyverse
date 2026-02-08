
import React, { useState } from 'react';
import { AppState, VisionResult, RoadmapResult } from '../types';
import * as Icons from './icons';
import { generateVisionStatement, generateRoadmap } from '../services/geminiService';

interface RoadmapProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Roadmap: React.FC<RoadmapProps> = ({ state, updateState }) => {
  const [step, setStep] = useState<'vision_form' | 'vision_result' | 'roadmap_form' | 'roadmap_result'>(
    state.vision ? (state.roadmap ? 'roadmap_result' : 'vision_result') : 'vision_form'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [visionInputs, setVisionInputs] = useState({
    role: '',
    strengths: ['', '', ''],
    values: ['', ''],
    problem: '',
    tone: 'passionate'
  });
  const [roadmapContext, setRoadmapContext] = useState({
    weeklyHours: 4,
    constraints: '',
    priority: ''
  });

  const runVisionGen = async () => {
    setIsGenerating(true);
    try {
      const result = await generateVisionStatement(visionInputs);
      updateState(prev => ({ ...prev, vision: result }));
      setStep('vision_result');
    } catch (err) {
      alert("AI 비전 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const runRoadmapGen = async () => {
    if (!state.vision) return;
    setIsGenerating(true);
    try {
      const result = await generateRoadmap(state.vision, roadmapContext);
      updateState(prev => ({ ...prev, roadmap: result }));
      setStep('roadmap_result');
    } catch (err) {
      alert("AI 로드맵 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center animate-in">
        <div className="relative mb-10">
          <Icons.Sparkles className="w-24 h-24 text-blue-600 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100 rounded-full blur-[64px] opacity-40"></div>
        </div>
        <h2 className="text-3xl font-black mb-3">미래를 큐레이팅 중입니다</h2>
        <p className="text-slate-500 font-bold italic tracking-tight">AI 코치가 {state.user.nickname}님의 강점과 가치를 연결하고 있습니다...</p>
      </div>
    );
  }

  if (step === 'vision_form') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in">
        <div className="text-center mb-10">
           <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
             <Icons.Compass className="w-10 h-10" />
           </div>
           <h2 className="text-4xl font-black text-slate-900 mb-2">나만의 북극성, 비전 만들기</h2>
           <p className="text-slate-500 font-bold">방향을 잃지 않도록 나만의 정의를 내려보세요.</p>
        </div>

        <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-200 shadow-xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">목표하는 구체적 역할</label>
              <input 
                type="text" 
                value={visionInputs.role}
                onChange={e => setVisionInputs({ ...visionInputs, role: e.target.value })}
                placeholder="예: 실버 세대를 위한 AI 앱 기획자"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold"
              />
            </div>
            <div className="space-y-4">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">중요하게 생각하는 가치 (2가지)</label>
               <div className="flex gap-2">
                 {[0, 1].map(i => (
                    <input key={i} type="text" value={visionInputs.values[i]} onChange={e => {
                      const next = [...visionInputs.values]; next[i] = e.target.value;
                      setVisionInputs({ ...visionInputs, values: next });
                    }} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold text-xs" placeholder={`가치 ${i+1}`} />
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">나의 핵심 강점 (3가지)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {visionInputs.strengths.map((s, i) => (
                <input key={i} type="text" value={s} onChange={e => {
                  const next = [...visionInputs.strengths]; next[i] = e.target.value;
                  setVisionInputs({ ...visionInputs, strengths: next });
                }} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold text-xs" placeholder={`강점 ${i+1}`} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">해결하고 싶은 세상의 문제</label>
            <textarea 
              value={visionInputs.problem}
              onChange={e => setVisionInputs({ ...visionInputs, problem: e.target.value })}
              rows={3}
              placeholder="당신이 바꿀 미래의 한 조각은 무엇인가요?"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold text-sm resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">문장의 분위기</label>
            <div className="flex gap-3">
               {(['passionate', 'professional', 'calm'] as const).map(t => (
                 <button 
                  key={t}
                  onClick={() => setVisionInputs({ ...visionInputs, tone: t })}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-black border transition-all ${visionInputs.tone === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                 >
                   {t === 'passionate' ? '🔥 열정적인' : t === 'professional' ? '👔 전문적인' : '🍵 차분한'}
                 </button>
               ))}
            </div>
          </div>

          <button 
            onClick={runVisionGen}
            className="w-full bg-indigo-600 text-white py-6 rounded-3xl text-xl font-black shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            <Icons.Sparkles className="w-7 h-7" /> 비전선언문 생성하기
          </button>
        </div>
      </div>
    );
  }

  if (step === 'vision_result' && state.vision) {
    return (
      <div className="max-w-3xl mx-auto space-y-10 animate-in pb-20">
        <div className="bg-white p-16 md:p-24 rounded-[4rem] border-8 border-indigo-50 shadow-2xl text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-4 bg-indigo-600"></div>
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-10">
             <Icons.Target className="w-10 h-10 text-indigo-600" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">Official Vision Statement</span>
          <h2 className="text-4xl font-black text-slate-900 mb-10 leading-tight">{state.vision.title}</h2>
          <div className="text-xl leading-[2] text-slate-600 font-medium whitespace-pre-wrap mb-16 px-4">
            {state.vision.body}
          </div>
          <div className="w-full h-px bg-slate-100 mb-16"></div>
          <div className="bg-indigo-50/50 p-8 rounded-3xl w-full border border-indigo-100/50">
            <p className="text-2xl md:text-3xl font-black text-indigo-600 italic tracking-tight">"{state.vision.slogan}"</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button onClick={() => setStep('roadmap_form')} className="flex-[2] bg-slate-900 text-white py-6 rounded-3xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            실행 로드맵 만들기 <Icons.Zap className="w-5 h-5 fill-current" />
          </button>
          <button onClick={() => setStep('vision_form')} className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-3xl font-black hover:bg-slate-50 transition-all">다시 만들기</button>
        </div>
      </div>
    );
  }

  if (step === 'roadmap_form') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in">
         <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Icons.Zap className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">실행을 위한 로드맵</h2>
            <p className="text-slate-500 font-bold">비전을 현실로 바꿀 1년의 계획을 제안합니다.</p>
         </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">주당 학습 가용 시간</label>
            <div className="grid grid-cols-3 gap-2">
              {[4, 8, 12, 16, 20, 24].map(h => (
                <button 
                  key={h}
                  onClick={() => setRoadmapContext({ ...roadmapContext, weeklyHours: h })}
                  className={`py-4 rounded-2xl text-xs font-black border transition-all ${roadmapContext.weeklyHours === h ? 'bg-purple-600 text-white border-purple-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                >
                  {h}시간
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">현재의 제약 사항</label>
            <input type="text" value={roadmapContext.constraints} onChange={e => setRoadmapContext({ ...roadmapContext, constraints: e.target.value })} placeholder="예: 학원 병행, 영어 실력 부족, 고1 말 시험 기간 등" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-purple-100 font-bold text-sm" />
          </div>
          <button onClick={runRoadmapGen} className="w-full bg-purple-600 text-white py-6 rounded-3xl text-xl font-black shadow-2xl shadow-purple-200 hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            로드맵 자동 생성 <Icons.Sparkles className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'roadmap_result' && state.roadmap) {
    return (
      <div className="max-w-5xl mx-auto space-y-12 animate-in pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['m3', 'm6', 'm12'] as const).map((period, idx) => {
            const data = state.roadmap?.[period];
            if (!data) return null;
            
            return (
              <div key={period} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-2xl transition-all relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all ${idx === 0 ? 'text-blue-600' : idx === 1 ? 'text-indigo-600' : 'text-purple-600'}`}>
                   <Icons.Flag className="w-32 h-32" />
                </div>
                <div className="inline-block px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black mb-6 uppercase tracking-widest">{period === 'm3' ? 'Stage 1' : period === 'm6' ? 'Stage 2' : 'Stage 3'}</div>
                <h3 className="text-xl font-black text-slate-900 mb-8 leading-tight min-h-[3.5rem]">{data.headline}</h3>
                <div className="space-y-10 relative">
                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                  {data.steps && data.steps.map((s, i) => (
                    <div key={i} className="relative pl-10">
                      <div className="absolute left-0 top-1.5 w-5 h-5 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center z-10 group-hover:border-blue-500 transition-all">
                         <div className="w-2 h-2 bg-slate-200 rounded-full group-hover:bg-blue-500"></div>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">{s.month}</div>
                      <div className="text-sm text-slate-800 font-bold leading-relaxed">{s.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
           <button onClick={() => {
               updateState(prev => ({...prev, vision: null, roadmap: null}));
               setStep('vision_form');
            }} className="text-slate-400 font-bold hover:text-slate-800 flex items-center gap-2">
             <Icons.RefreshCw className="w-4 h-4" /> 다시 설계하기
           </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Roadmap;
