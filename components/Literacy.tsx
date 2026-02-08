
import React, { useState, useMemo } from 'react';
import { AppState } from '../types';
import * as Icons from './icons';
import { LITERACY_TEST_DATA } from '../constants';

interface LiteracyProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Literacy: React.FC<LiteracyProps> = ({ state, updateState }) => {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>(
    state.literacy.length > 0 ? 'result' : 'intro'
  );
  const [currentPassageIdx, setCurrentPassageIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showPassageMobile, setShowPassageMobile] = useState(true);

  const passages = LITERACY_TEST_DATA.passages;
  const currentPassage = passages[currentPassageIdx];
  const currentQuestion = currentPassage.questions[currentQuestionIdx];

  const totalQuestions = useMemo(() => 
    passages.reduce((sum, p) => sum + p.questions.length, 0), 
  [passages]);

  const progressCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentPassageIdx; i++) {
      count += passages[i].questions.length;
    }
    return count + currentQuestionIdx + 1;
  }, [currentPassageIdx, currentQuestionIdx, passages]);

  const handleSelect = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIdx }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < currentPassage.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else if (currentPassageIdx < passages.length - 1) {
      setCurrentPassageIdx(prev => prev + 1);
      setCurrentQuestionIdx(0);
      setShowPassageMobile(true);
    } else {
      calculateResults();
    }
  };
  
  const calculateResults = () => {
    let factScore = 0, infScore = 0, appScore = 0;
    let totalCorrect = 0;
  
    passages.forEach(p => {
      p.questions.forEach(q => {
        if (answers[q.id] === q.answer) {
          totalCorrect++;
        }
      });
    });

    const level = totalCorrect >= 14 ? '심화' : totalCorrect >= 10 ? '우수' : totalCorrect >= 6 ? '보통' : '기초';

    const result = {
      date: new Date().toISOString(),
      score: totalCorrect,
      level
    };

    updateState(prev => ({ ...prev, literacy: [result, ...prev.literacy] }));
    setStep('result');
  };

  if (step === 'intro') {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center animate-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Icons.BookOpen className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">StudyVerse 문해력 진단</h2>
        <p className="text-slate-500 mb-12 font-medium leading-relaxed">
          사실력, 추론력, 응용력을 종합적으로 평가하여<br />당신만의 독해 스타일과 맞춤형 학습 방향을 제시합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          {[
            { title: "사실력 (Fact)", desc: "지문의 정보를 정확하게 파악하는 능력", icon: "📍" },
            { title: "추론력 (Inference)", desc: "문맥을 통해 숨겨진 의미를 찾아내는 능력", icon: "🧠" },
            { title: "응용력 (Apply)", desc: "습득한 정보를 새로운 상황에 적용하는 능력", icon: "🚀" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h4 className="font-black text-slate-800 mb-2">{item.title}</h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setStep('test')} 
          className="w-full max-w-sm py-5 bg-emerald-600 text-white rounded-3xl text-xl font-black shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
        >
          진단 시작하기 ({totalQuestions}문항)
        </button>
      </div>
    );
  }

  if (step === 'test') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                지문 {currentPassageIdx + 1} / {passages.length}
              </span>
              <h3 className="text-sm font-black text-slate-400">{currentPassage.title}</h3>
           </div>
           <div className="flex items-center gap-4">
              <div className="hidden md:block w-48 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(progressCount / totalQuestions) * 100}%` }} />
              </div>
              <span className="text-xs font-black text-emerald-600">{progressCount} / {totalQuestions}</span>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Passage Area */}
          <div className={`flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col ${showPassageMobile ? 'flex' : 'hidden lg:flex'}`}>
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
               <h4 className="font-black text-slate-800 flex items-center gap-2">
                 <Icons.Book className="w-4 h-4 text-emerald-600" /> 본문 읽기
               </h4>
               <button onClick={() => setShowPassageMobile(false)} className="lg:hidden text-xs font-black text-emerald-600">문제 풀러가기</button>
            </div>
            <div className="p-8 md:p-10 flex-1 overflow-y-auto max-h-[500px] lg:max-h-[600px] leading-[2] text-slate-700 font-medium whitespace-pre-wrap">
              {currentPassage.content}
            </div>
          </div>

          {/* Question Area */}
          <div className={`flex-1 space-y-6 flex flex-col ${!showPassageMobile ? 'flex' : 'hidden lg:flex'}`}>
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10 flex-1 relative overflow-hidden">
              <button onClick={() => setShowPassageMobile(true)} className="lg:hidden absolute top-6 right-6 text-xs font-black text-emerald-600 flex items-center gap-1">
                <Icons.BookOpen className="w-4 h-4" /> 본문보기
              </button>

              <div className="mb-8">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                  currentQuestion.type === '사실력' ? 'bg-blue-50 text-blue-600' : 
                  currentQuestion.type === '추론력' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {currentQuestion.type}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-4 leading-snug break-keep">
                  {currentQuestion.text}
                </h3>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-4 ${
                      answers[currentQuestion.id] === idx 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-100' 
                      : 'border-slate-50 bg-slate-50 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                      answers[currentQuestion.id] === idx ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined}
              className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl disabled:opacity-30 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]"
            >
              {progressCount === totalQuestions ? '최종 결과 분석하기' : '다음 문항'} <Icons.ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const latestResult = state.literacy[0];
  const totalCorrect = latestResult?.score || 0;
  
  const getScoreByType = (type: '사실력' | '추론력' | '응용력') => {
      return passages.reduce((sum, passage) => {
          return sum + passage.questions.filter(q => q.type === type && answers[q.id] === q.answer).length
      }, 0);
  }
  const factCorrect = getScoreByType('사실력');
  const infCorrect = getScoreByType('추론력');
  const appCorrect = getScoreByType('응용력');

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in pb-20">
      <div className="text-center">
        <div className="inline-block p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4 shadow-inner">
          <Icons.CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2">분석이 완료되었습니다!</h2>
        <p className="text-slate-500 font-medium">당신의 독해 역량과 학습 가이드를 확인하세요.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200 shadow-xl text-center">
         <div className="inline-block px-5 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black mb-6 border border-emerald-100">
           독해 레벨: {latestResult?.level || '분석중'}
         </div>
         <div className="text-6xl font-black text-slate-900 mb-2">{totalCorrect}<span className="text-2xl text-slate-300 ml-1">/ {totalQuestions}</span></div>
         <p className="text-slate-400 font-bold text-sm mb-12">전체 정답 수</p>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { label: "사실력", val: `${factCorrect}/${passages.reduce((s,p) => s+p.questions.filter(q=>q.type==='사실력').length,0)}`, color: "blue" },
              { label: "추론력", val: `${infCorrect}/${passages.reduce((s,p) => s+p.questions.filter(q=>q.type==='추론력').length,0)}`, color: "purple" },
              { label: "응용력", val: `${appCorrect}/${passages.reduce((s,p) => s+p.questions.filter(q=>q.type==='응용력').length,0)}`, color: "orange" }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">{stat.label}</p>
                 <p className={`text-2xl font-black ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`}>{stat.val}</p>
              </div>
            ))}
         </div>
      </div>

      <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Icons.BarChart className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <Icons.Layout className="w-5 h-5 text-emerald-200" /> 맞춤형 학습 진단
          </h3>
          <p className="text-emerald-50 text-sm font-medium leading-relaxed mb-8">
            {totalCorrect >= 14 
              ? "논리적 추론과 복합 상황 응용력이 매우 뛰어납니다. 고난도 비문학 지문이나 전문 서적을 통해 독해의 깊이를 더해보세요." 
              : totalCorrect >= 10 
              ? "기본적인 정보 파악은 훌륭합니다. 다만 긴 지문에서의 문맥적 추론 시 디테일을 놓치는 경우가 있으니, 문단별 요약 습관을 길러보세요."
              : "사실 정보를 찾는 연습이 우선 필요합니다. 지문 속에서 답의 근거가 되는 핵심 문장을 밑줄 치며 읽는 연습부터 시작해 보세요."}
          </p>
          <button 
            onClick={() => {
                setStep('intro');
                setAnswers({});
                setCurrentPassageIdx(0);
                setCurrentQuestionIdx(0);
            }} 
            className="bg-white text-emerald-600 px-8 py-3.5 rounded-2xl font-black hover:bg-emerald-50 transition-all shadow-lg"
          >
            다시 테스트하기
          </button>
        </div>
      </div>

    </div>
  );
};

export default Literacy;
