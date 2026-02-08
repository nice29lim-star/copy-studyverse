
import React from 'react';
import * as Icons from '../icons';

interface HeaderProps {
    onMenuClick: () => void;
    title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                >
                    <Icons.Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold ml-2">
                    {title}
                </h1>
            </div>
        </header>
    );
};

export default Header;
