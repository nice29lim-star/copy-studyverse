
import React from 'react';
import * as Icons from './icons';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    nickname: string;
    onNicknameChange: (nickname: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, nickname, onNicknameChange }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
                >
                    <Icons.X className="w-5 h-5 text-slate-400" />
                </button>
                <h2 className="text-xl font-bold mb-6">설정</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">별명</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => onNicknameChange(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
