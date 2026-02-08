
import React from 'react';
import { TabId } from '../../types';
import { navItems } from '../../constants';

interface MobileNavProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex md:hidden z-50">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default MobileNav;
