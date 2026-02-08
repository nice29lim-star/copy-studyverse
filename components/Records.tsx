
import React, { useState } from 'react';
import { AppState, Reflection } from '../types';
import * as Icons from './icons';
import { REC_TEMPLATES } from '../constants';

interface RecordsProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Records: React.FC<RecordsProps> = ({ state, updateState }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Reflection>>({
    mode: '3min',
    template: 'basic',
    oneLine: '',
    mood: 3,
    win: '',
    lesson: '',
    tomorrow: '',
    hard: '',
    good: '',
    regret: '',
    gratitude: ['', '', '']
  });

  const handleSave = () => {
    if (!form.oneLine) return;
    const newRef: Reflection = {
      ...form,
      date: new Date().toISOString()
    } as Reflection;
    updateState(prev => ({ ...prev, records: [newRef, ...prev.records] }));
    setIsAdding(false);
    setForm({ 
        ...form, 
        oneLine: '', 
        win: '', 
        lesson: '', 
        tomorrow: '', 
        hard: '', 
        good: '', 
        regret: '',
        gratitude: ['', '', '']
    });
  };

  const templates = REC_TEMPLATES[form.template as keyof typeof REC_TEMPLATES] || REC_TEMPLATES.basic;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">나의 학습 기록</h2>
           <p className="text-slate-500 font-bold text-sm italic">성찰은 다음 성장을 위한 가장 강력한 도구입니다.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-200 hover:scale-105 transition-all"
          >
            <Icons.Plus className="w-5 h-5" /> 오늘 회고 쓰기
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
          <button onClick={() => setIsAdding(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 transition-all">
             <Icons.X className="w-8 h-8" />
          </button>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-slate-100 pb-8">
             <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {(['3min', '10min'] as const).map(m => (
                  <button 
                    key={m} 
                    onClick={() => setForm({ ...form, mode: m })}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${form.mode === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {m === '3min' ? '⚡ 3분 빠른 회고' : '🧘 10분 깊은 회고'}
                  </button>
                ))}
             </div>
             <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {(['basic', 'emotion', 'study'] as const).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setForm({ ...form, template: t })}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${form.template === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {t === 'basic' ? '기본형' : t === 'emotion' ? '감정형' : '학습형'}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-10">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                 <Icons.Layout className="w-4 h-4" /> {templates.labels[0]}
              </label>
              <input 
                type="text" 
                value={form.oneLine} 
                onChange={e => setForm({ ...form, oneLine: e.target.value })}
                className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-blue-600 outline-none text-2xl font-black text-slate-900 transition-all placeholder:text-slate-200"
                placeholder="오늘 하루를 한 줄로 표현한다면?"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">오늘의 기분</label>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map(m => (
                  <button 
                    key={m} 
                    onClick={() => setForm({ ...form, mood: m })}
                    className={`py-5 text-4xl rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${form.mood === m ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    {['😢', '😕', '😐', '😊', '😄'][m-1]}
                    <span className="text-[10px] font-black text-slate-400">{['속상함', '우울함', '평범함', '즐거움', '최고임'][m-1]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">{templates.labels[1]}</label>
                <textarea 
                  value={form.win} 
                  onChange={e => setForm({ ...form, win: e.target.value })} 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-100 resize-none h-32 font-bold text-sm"
                  placeholder="작은 성취라도 좋아요."
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">{templates.labels[2]}</label>
                <textarea 
                  value={form.lesson} 
                  onChange={e => setForm({ ...form, lesson: e.target.value })} 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-100 resize-none h-32 font-bold text-sm"
                  placeholder="무엇을 깨달았나요?"
                />
              </div>
            </div>

            {form.mode === '10min' && (
              <div className="animate-in space-y-10 pt-10 border-t border-slate-50">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-3">
                      <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest">힘들었던 순간</label>
                      <input type="text" value={form.hard} onChange={e => setForm({...form, hard: e.target.value})} className="w-full px-5 py-3 bg-red-50/30 border border-red-50 rounded-2xl outline-none text-xs font-bold" />
                   </div>
                   <div className="space-y-3">
                      <label className="block text-[10px] font-black text-green-400 uppercase tracking-widest">잘한 선택</label>
                      <input type="text" value={form.good} onChange={e => setForm({...form, good: e.target.value})} className="w-full px-5 py-3 bg-green-50/30 border border-green-50 rounded-2xl outline-none text-xs font-bold" />
                   </div>
                   <div className="space-y-3">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">아쉬운 선택</label>
                      <input type="text" value={form.regret} onChange={e => setForm({...form, regret: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-xs font-bold" />
                   </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">감사한 일 3가지</label>
                    <div className="space-y-3">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="text-sm font-black text-slate-200">{i+1}</span>
                          <input 
                            type="text" 
                            className="flex-1 bg-slate-50/50 border-b border-slate-100 px-2 py-1 outline-none focus:border-indigo-400 text-sm font-medium"
                             value={form.gratitude?.[i] || ''}
                            onChange={e => {
                                const newGratitude = [...(form.gratitude || ['', '', ''])];
                                newGratitude[i] = e.target.value;
                                setForm({ ...form, gratitude: newGratitude });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            )}

            <div className="flex gap-4 pt-8">
              <button 
                onClick={() => setIsAdding(false)} 
                className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[1.75rem] font-black hover:bg-slate-200 transition-all"
              >
                나중에 쓸게요
              </button>
              <button 
                onClick={handleSave} 
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.75rem] font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                성찰 완료하기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.records.length === 0 ? (
            <div className="col-span-2 text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-6">🏜️</div>
              <p className="text-slate-400 font-bold">아직 기록된 여정이 없습니다.<br />오늘 하루를 돌아보며 마침표를 찍어보세요.</p>
            </div>
          ) : (
            state.records.map((rec, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 flex items-center gap-2 mb-2 tracking-widest">
                      <Icons.Calendar className="w-3.5 h-3.5" /> {new Date(rec.date).toLocaleDateString()}
                      <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-slate-500">{rec.mode === '3min' ? '⚡' : '🧘'}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-all">{rec.oneLine}</h3>
                  </div>
                  <div className="text-4xl shadow-inner bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-100">
                    {['😢', '😕', '😐', '😊', '😄'][(rec.mood || 3) - 1]}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-tighter">성과</div>
                    <p className="text-slate-700 font-bold line-clamp-2 leading-relaxed">{rec.win}</p>
                  </div>
                  <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-tighter">깨달음</div>
                    <p className="text-slate-700 font-bold line-clamp-2 leading-relaxed">{rec.lesson}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Records;
