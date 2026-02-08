
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, TabId } from './types';
import { STORAGE_KEY, initialAppState } from './constants';
import Dashboard from './components/Dashboard';
import Diagnosis from './components/Diagnosis';
import Planner from './components/Planner';
import Roadmap from './components/Roadmap';
import Records from './components/Records';
import Literacy from './components/Literacy';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import SettingsModal from './components/SettingsModal';
import { navItems } from './constants';

const App: React.FC = () => {
    const [state, setState] = useState<AppState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : initialAppState;
        } catch (error) {
            console.error("Failed to parse state from localStorage", error);
            return initialAppState;
        }
    });

    const [activeTab, setActiveTab] = useState<TabId>('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [state]);

    const updateState = useCallback((updater: (prevState: AppState) => AppState) => {
        setState(updater);
    }, []);
    
    const handleSetNickname = (nickname: string) => {
        updateState(prev => ({ ...prev, user: { ...prev.user, nickname } }));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <Dashboard state={state} onNavigate={setActiveTab} />;
            case 'diagnosis': return <Diagnosis state={state} updateState={updateState} onNavigate={setActiveTab} />;
            case 'planner': return <Planner state={state} updateState={updateState} />;
            case 'roadmap': return <Roadmap state={state} updateState={updateState} />;
            case 'records': return <Records state={state} updateState={updateState} />;
            case 'literacy': return <Literacy state={state} updateState={updateState} />;
            default: return <Dashboard state={state} onNavigate={setActiveTab} />;
        }
    };
    
    const currentNavItem = navItems.find(i => i.id === activeTab);

    return (
        <div className="min-h-screen flex bg-slate-50">
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onSettingsClick={() => setIsSettingsOpen(true)} 
            />

            <div className="flex-1 flex flex-col md:ml-64 pb-20 md:pb-0">
                <Header 
                    onMenuClick={() => setIsSidebarOpen(true)} 
                    title={currentNavItem?.label || 'Dashboard'} 
                />
                <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
                    {renderContent()}
                </main>
            </div>

            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                nickname={state.user.nickname}
                onNicknameChange={handleSetNickname}
            />
        </div>
    );
};

export default App;
