
import React from 'react';
import { TabId } from '../../types';
import { navItems } from '../../constants';
import * as Icons from '../icons';

interface SidebarProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    onSettingsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, onSettingsClick }) => {
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/seed/studyverse-logo/32/32" alt="Logo" className="w-8 h-8 rounded-lg" />
                        <span className="text-xl font-bold">StudyVerse</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={() => { onSettingsClick(); setIsSidebarOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        <Icons.Settings className="w-5 h-5 text-slate-400" />
                        설정
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
