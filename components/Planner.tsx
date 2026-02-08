
import React, { useState } from 'react';
import { AppState, TodoItem } from '../types';
import * as Icons from './icons';
import { generateAIPlanner } from '../services/geminiService';
import { QUOTES } from '../constants';

interface PlannerProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Planner: React.FC<PlannerProps> = ({ state, updateState }) => {
  const { planner } = state;
  const [newTodo, setNewTodo] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quote, setQuote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const [aiForm, setAiForm] = useState({
    time: '4',
    subjects: '',
    goal: planner.goal
  });

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const item: TodoItem = {
      id: Date.now(),
      priority: '중',
      time: '30',
      text: newTodo,
      goal: '',
      done: false
    };
    updateState(prev => ({
      ...prev,
      planner: { ...prev.planner, todos: [...prev.planner.todos, item] }
    }));
    setNewTodo('');
  };

  const updateTodo = (id: number, field: keyof TodoItem, value: any) => {
    updateState(prev => ({
      ...prev,
      planner: {
        ...prev.planner,
        todos: prev.planner.todos.map(t => t.id === id ? { ...t, [field]: value } : t)
      }
    }));
  };

  const deleteTodo = (id: number) => {
    updateState(prev => ({
      ...prev,
      planner: {
        ...prev.planner,
        todos: prev.planner.todos.filter(t => t.id !== id)
      }
    }));
  };

  const runAIPlanner = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAIPlanner(aiForm);
      const newTodos: TodoItem[] = result.map((r: any, i: number) => ({
        id: Date.now() + i,
        priority: r.priority,
        time: r.time,
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
      setIsAIModalOpen(false);
    } catch (err) {
      alert("AI 계획 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">스터디 플래너</h2>
           <p className="text-slate-500 font-bold text-sm">오늘 하루의 성공을 설계하세요.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-[1.25rem] font-black shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
          >
            <Icons.Sparkles className="w-5 h-5" /> AI 자동 계획
          </button>
          <button 
            onClick={() => setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])}
            className="p-4 bg-white border border-slate-200 rounded-[1.25rem] text-slate-400 hover:text-blue-600 shadow-sm"
          >
            <Icons.RefreshCw className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 shadow-sm col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Icons.Check className="w-32 h-32 text-blue-600" />
          </div>
          <div className="flex gap-4 items-center mb-6">
            <input 
              type="date" 
              value={planner.date}
              onChange={(e) => updateState(prev => ({ ...prev, planner: { ...prev.planner, date: e.target.value } }))}
              className="bg-white px-4 py-2 rounded-xl text-xs font-black text-blue-600 outline-none border border-blue-200"
            />
            <input 
              type="text"
              value={planner.dday}
              onChange={(e) => updateState(prev => ({ ...prev, planner: { ...prev.planner, dday: e.target.value } }))}
              placeholder="D-Day"
              className="bg-white px-4 py-2 rounded-xl text-xs font-black text-slate-400 outline-none border border-blue-200 w-24"
            />
          </div>
          <label className="block text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest">오늘의 핵심 목표</label>
          <input 
            type="text" 
            value={planner.goal}
            onChange={(e) => updateState(prev => ({ ...prev, planner: { ...prev.planner, goal: e.target.value } }))}
            placeholder="오늘 꼭 이루고 싶은 한 가지"
            className="w-full bg-transparent text-2xl font-black text-blue-900 outline-none placeholder:text-blue-200 border-b-2 border-transparent focus:border-blue-200 transition-all"
          />
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 p-4 opacity-20">
            <Icons.AlertCircle className="w-12 h-12" />
          </div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">오늘의 한마디</label>
          <p className="text-sm font-bold leading-relaxed italic opacity-90">"{quote}"</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex gap-4">
            <input 
              type="text" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="할 일을 입력하고 Enter를 누르세요..."
              className="flex-1 bg-white px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 border border-slate-200 font-bold"
            />
            <button 
              onClick={handleAddTodo}
              className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              <Icons.Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-20 text-center">우선순위</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-24">시간</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">할 일</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 hidden md:table-cell">상세 목표</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-20 text-center">완료</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {planner.todos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-slate-300">
                    <div className="text-5xl mb-6">🖋️</div>
                    <p className="font-bold">아직 계획된 일정이 없습니다.</p>
                  </td>
                </tr>
              ) : (
                planner.todos.map((todo) => (
                  <tr key={todo.id} className={`group hover:bg-slate-50/50 transition-all ${todo.done ? 'bg-slate-50/30' : ''}`}>
                    <td className="p-4 text-center">
                       <select 
                        value={todo.priority}
                        onChange={(e) => updateTodo(todo.id, 'priority', e.target.value)}
                        className={`text-[10px] font-black px-2 py-1 rounded-lg border appearance-none text-center outline-none ${todo.priority === '상' ? 'bg-red-50 text-red-600 border-red-100' : todo.priority === '중' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                       >
                         <option value="상">상</option>
                         <option value="중">중</option>
                         <option value="하">하</option>
                       </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                        <Icons.Clock className="w-3.5 h-3.5" />
                        <input 
                          type="text" 
                          value={todo.time} 
                          onChange={(e) => updateTodo(todo.id, 'time', e.target.value)}
                          className="w-10 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 rounded"
                        />분
                      </div>
                    </td>
                    <td className="p-4">
                      <input 
                        type="text" 
                        value={todo.text}
                        onChange={(e) => updateTodo(todo.id, 'text', e.target.value)}
                        className={`w-full bg-transparent font-bold text-sm outline-none transition-all ${todo.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}
                      />
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <input 
                        type="text" 
                        value={todo.goal}
                        onChange={(e) => updateTodo(todo.id, 'goal', e.target.value)}
                        placeholder="기대 결과"
                        className="w-full bg-transparent text-xs font-medium text-slate-400 outline-none italic"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => updateTodo(todo.id, 'done', !todo.done)}
                        className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center mx-auto transition-all ${todo.done ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'border-slate-200 bg-white hover:border-blue-400'}`}
                      >
                        {todo.done && <Icons.Check className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1 w-full">
            <h4 className="text-sm font-black text-slate-800 mb-2">오늘의 만족도</h4>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map(val => (
                <button 
                  key={val} 
                  onClick={() => updateState(prev => ({ ...prev, planner: { ...prev.planner, rating: val } }))}
                  className={`text-3xl transition-all hover:scale-125 ${planner.rating >= val ? 'text-yellow-400 scale-110' : 'text-slate-200'}`}
                >
                  <Icons.Star fill={planner.rating >= val ? "currentColor" : "none"} className="w-8 h-8" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-8 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200">
              <Icons.Download className="w-5 h-5" /> 이미지 저장
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-8 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200">
              <Icons.Copy className="w-5 h-5" /> 텍스트 복사
            </button>
          </div>
        </div>
      </div>

      {isAIModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative animate-in border border-white/20">
            <button onClick={() => setIsAIModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><Icons.Plus className="w-8 h-8 rotate-45" /></button>
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
              <Icons.Sparkles className="text-blue-600" /> AI 자동 계획
            </h2>
            <p className="text-slate-400 text-sm font-bold mb-8 italic">시간과 과목만 입력하면 학습 최적 경로를 제안합니다.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-widest">공부 가능 시간</label>
                <div className="grid grid-cols-4 gap-2">
                   {[2, 3, 4, 6, 8, 10, 12, 14].map(h => (
                     <button 
                      key={h}
                      onClick={() => setAiForm({ ...aiForm, time: h.toString() })}
                      className={`py-3 rounded-xl text-xs font-black transition-all border ${aiForm.time === h.toString() ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                     >
                       {h}h
                     </button>
                   ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-widest">우선 과목</label>
                <input 
                  type="text"
                  value={aiForm.subjects}
                  onChange={(e) => setAiForm({ ...aiForm, subjects: e.target.value })}
                  placeholder="예: 국어, 영어, 물리 심화"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold"
                />
              </div>
              <div className="flex gap-3 mt-10">
                <button 
                  onClick={() => setIsAIModalOpen(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black"
                >
                  취소
                </button>
                <button 
                  onClick={runAIPlanner}
                  disabled={isGenerating}
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  {isGenerating ? <Icons.Loader2 className="w-6 h-6 animate-spin" /> : '최적 계획 생성'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
