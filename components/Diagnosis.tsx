
import React, { useState } from 'react';
import { AppState, TabId } from '../types';
import { DIAGNOSIS_DATA, HOLLAND_TYPE_DB, SRL_CHALLENGE_DB } from '../constants';
import * as Icons from './icons';

interface DiagnosisProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onNavigate: (tab: TabId) => void;
}

const Diagnosis: React.FC<DiagnosisProps> = ({ state, updateState, onNavigate }) => {
  const { user } = state;
  const [step, setStep] = useState<'start' | 'test' | 'loading' | 'result'>(
    state.diagnosis.holland ? 'result' : 'start'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const questions = [...DIAGNOSIS_DATA.holland, ...DIAGNOSIS_DATA.srl];

  const handleAnswer = (value: number) => {
    const q = questions[currentIndex];
    setAnswers(prev => ({ ...prev, [q.id]: value }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      processResults();
    }
  };

  const processResults = () => {
    setStep('loading');
    setTimeout(() => {
      const hollandScores: Record<string, number[]> = {};
      const srlScores: Record<string, number[]> = {};

      questions.forEach(q => {
        const val = answers[q.id] || 3;
        const target = q.domain === 'HOLLAND' ? hollandScores : srlScores;
        if (!target[q.scale]) target[q.scale] = [];
        target[q.scale].push(val);
      });

      const avg = (arr: number[]) => Math.round(((arr.reduce((a, b) => a + b, 0) / arr.length - 1) / 4) * 100);

      const hResults: Record<string, number> = {};
      Object.keys(hollandScores).forEach(k => hResults[k] = avg(hollandScores[k]));
      
      const sResults: Record<string, number> = {};
      Object.keys(srlScores).forEach(k => sResults[k] = avg(srlScores[k]));

      const sortedH = Object.entries(hResults).sort((a, b) => b[1] - a[1]);
      const sortedS = Object.entries(sResults).sort((a, b) => b[1] - a[1]);

      const hCode = sortedH[0][0] + sortedH[1][0];

      updateState(prev => ({
        ...prev,
        diagnosis: {
          holland: { scores: hResults, top1: sortedH[0][0], top2: sortedH[1][0], code: hCode },
          srl: { scores: sResults, strength: sortedS[0][0], bottleneck: sortedS[sortedS.length - 1][0] },
          lastTest: new Date().toISOString()
        }
      }));
      setStep('result');
    }, 2500);
  };

  if (step === 'start') {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center animate-in">
        <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">🎯</div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">나를 알아가는<br />가장 스마트한 방법</h2>
        <p className="text-slate-500 mb-12 font-medium">Holland 적성 코드와 자기조절 학습 역량을<br />통합 진단하고 맞춤형 성장 리포트를 받아보세요.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          {[
            { icon: '⏱️', label: '소요시간', val: '약 3분', color: 'blue' },
            { icon: '📊', label: '검사내용', val: '적성+학습', color: 'indigo' },
            { icon: '🎁', label: '결과물', val: '맞춤 솔루션', color: 'purple' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
              <div className="text-lg font-black text-slate-900">{item.val}</div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setStep('test')}
          className="w-full max-w-sm bg-blue-600 text-white py-5 rounded-3xl text-xl font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
        >
          🚀 검사 시작하기
        </button>
      </div>
    );
  }

  if (step === 'test') {
    const q = questions[currentIndex];
    const pct = Math.round(((currentIndex) / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto animate-in">
        <div className="mb-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            {q.domain === 'HOLLAND' ? 'Part 1. Holland 적성' : 'Part 2. 자기조절 학습'}
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-black text-slate-400">{currentIndex + 1} / {questions.length}</span>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200 shadow-xl mb-8 relative overflow-hidden">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-16 break-keep">{q.text}</h3>
          
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map(val => (
              <button
                key={val}
                onClick={() => handleAnswer(val)}
                className={`flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all ${answers[q.id] === val ? 'border-blue-600 bg-blue-50' : 'border-slate-50 hover:border-slate-300 bg-slate-50'}`}
              >
                <span className="text-3xl">{['😟', '🙁', '😐', '🙂', '😊'][val - 1]}</span>
                <span className="text-[10px] font-black text-slate-500 whitespace-nowrap tracking-tight">{['전혀 아님', '아님', '보통', '그럼', '매우 그럼'][val - 1]}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 px-4 disabled:opacity-0"
        >
          <Icons.ChevronLeft className="w-5 h-5" /> 이전 질문으로
        </button>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-in">
        <Icons.Loader2 className="w-20 h-20 text-blue-600 animate-spin mb-8" />
        <h2 className="text-2xl font-black mb-2">데이터 분석 중</h2>
        <p className="text-slate-500 font-medium">당신만의 성격 코드와 학습 솔루션을 매칭하고 있습니다...</p>
      </div>
    );
  }

  const result = state.diagnosis;
  const hInfo = HOLLAND_TYPE_DB[result.holland?.code || ''] || HOLLAND_TYPE_DB['DEFAULT'];
  const sInfo = SRL_CHALLENGE_DB[result.srl?.bottleneck || 'TM'];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Holland Report */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b-2 border-blue-600">
            <h3 className="text-2xl font-black text-blue-600 flex items-center gap-3">
              <Icons.Target /> Holland 진로 탐색 리포트
            </h3>
            <p className="text-slate-400 text-xs font-bold mt-1">나의 적성과 흥미에 맞는 진로 찾기</p>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center border border-slate-100">
              <span className="text-sm font-bold text-slate-600">학생명: {user.nickname}</span>
              <span className="text-sm font-black text-blue-600">유형: {hInfo.name}</span>
            </div>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-indigo-500 pl-3">
                <Icons.Sparkles className="w-5 h-5 text-indigo-500" /> 나의 핵심 특성
              </h4>
              <div className="flex flex-wrap gap-2">
                {hInfo.traits.map((trait: string, i: number) => (
                  <span key={i} className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold">{trait}</span>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-yellow-500 pl-3">
                <Icons.Award className="w-5 h-5 text-yellow-500" /> 강점
              </h4>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 leading-relaxed">
                {hInfo.strength}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-orange-500 pl-3">
                <Icons.AlertTriangle className="w-5 h-5 text-orange-500" /> 주의할 점
              </h4>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 leading-relaxed">
                {hInfo.challenge}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-blue-400 pl-3">
                <Icons.Compass className="w-5 h-5 text-blue-400" /> 추천 직업
              </h4>
              <div className="flex flex-wrap gap-2">
                {hInfo.careers.map((career: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100">{career}</span>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-3">
                <Icons.Book className="w-5 h-5 text-blue-600" /> 학습 팁
              </h4>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 leading-relaxed">
                {hInfo.tip}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-rose-500 pl-3">
                <Icons.Rocket className="w-5 h-5 text-rose-500" /> 실천 과제
              </h4>
              <div className="space-y-3">
                {hInfo.actions.map((action: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-sm font-bold text-slate-800">
                    <Icons.Check className="w-4 h-4 text-orange-500 shrink-0" /> {action}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right: SRL Report */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b-2 border-indigo-600">
            <h3 className="text-2xl font-black text-indigo-600 flex items-center gap-3">
              <Icons.Edit2 /> 자기주도학습 개선 리포트
            </h3>
            <p className="text-slate-400 text-xs font-bold mt-1">7일간의 학습 습관 개선 챌린지</p>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center border border-slate-100">
              <span className="text-sm font-bold text-slate-600">학생명: {user.nickname}</span>
              <span className="text-sm font-black text-indigo-600">개선 영역: {sInfo.name} 개선 챌린지</span>
            </div>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-rose-500 pl-3">
                <Icons.AlertCircle className="w-5 h-5 text-rose-500" /> 현재 문제점
              </h4>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 leading-relaxed">
                {sInfo.problem}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4 border-l-4 border-indigo-500 pl-3">
                <Icons.Flag className="w-5 h-5 text-indigo-500" /> 개선 목표
              </h4>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 leading-relaxed">
                {sInfo.goal}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6 border-l-4 border-blue-500 pl-3">
                <Icons.Calendar className="w-5 h-5 text-blue-500" /> 7일 챌린지
              </h4>
              <div className="space-y-6">
                {sInfo.challenges.map((c, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black shrink-0 text-sm shadow-lg shadow-indigo-100">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-4">
                        <h5 className="text-base font-black text-slate-900">{c.title}</h5>
                        
                        <div className="bg-indigo-50 p-4 rounded-xl space-y-2 border border-indigo-100/30">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">미션</p>
                          <p className="text-xs font-bold text-slate-800 leading-relaxed">{c.mission}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">왜 중요할까?</p>
                          <p className="text-[10px] font-bold text-slate-500 italic">{c.why}</p>
                        </div>

                        <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2 text-green-700">
                          <Icons.Search className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black">{c.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          onClick={() => setStep('start')}
          className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-3xl font-black hover:bg-slate-50"
        >
          검사 다시 하기
        </button>
        <button className="flex-[2] py-4 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
          <Icons.Download className="w-5 h-5" /> 리포트 이미지 저장
        </button>
      </div>
    </div>
  );
};

export default Diagnosis;
