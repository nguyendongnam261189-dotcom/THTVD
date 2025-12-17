import React, { useState } from 'react';
import { loginWithSchoolAccount, saveScriptUrl, getScriptUrl } from '../services/storage';
import { User } from '../types';
import { School, LogIn, User as UserIcon, Mail, Shield, GraduationCap, Settings, X, Save } from 'lucide-react';

interface AuthScreenProps {
    onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    
    // Settings Modal State
    const [showSettings, setShowSettings] = useState(false);
    const [scriptUrl, setScriptUrl] = useState('');

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email.trim() || !name.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            setIsLoading(false);
            return;
        }

        try {
            // Logic đăng nhập (Sẽ gọi Google Script nếu có cấu hình)
            const user = await loginWithSchoolAccount(email, name);
            onLogin(user);
        } catch (err: any) {
            setError('Đăng nhập thất bại: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSettings = () => {
        saveScriptUrl(scriptUrl);
        setShowSettings(false);
        setError(''); // Clear error to allow retry
    };

    // Hàm hỗ trợ điền nhanh thông tin Demo
    const quickFill = (role: 'ADMIN' | 'TEACHER') => {
        if (role === 'ADMIN') {
            setName('Ban Quản Trị');
            setEmail('admin@tvd.edu.vn');
        } else {
            setName('Cô Nguyễn Thị Lan');
            setEmail('gv.lan@tvd.edu.vn');
        }
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
             
             {/* Settings Button (Top Right) */}
             <button 
                onClick={() => { setScriptUrl(getScriptUrl()); setShowSettings(true); }}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors z-20"
                title="Cấu hình Kết nối Database"
             >
                <Settings size={20} />
             </button>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                        <School size={32} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Cổng Thông Tin CLB</h1>
                    <p className="text-white/50 text-sm">Tiểu học Trần Văn Dư</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-white/50 ml-1">Họ và tên giáo viên</label>
                        <div className="relative">
                            <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input 
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Nhập họ tên..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-white/50 ml-1">Email trường cấp</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input 
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="vidu: gv.toan@tvd.edu.vn"
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 placeholder:text-white/20"
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                            <p className="text-rose-400 text-xs text-center font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn size={18} />
                                Đăng nhập
                            </>
                        )}
                    </button>
                </form>

                {/* Quick Login for Demo/Testing */}
                <div className="mt-6">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-white/30 text-[10px] uppercase tracking-widest">Demo Nhanh</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button 
                            type="button"
                            onClick={() => quickFill('ADMIN')}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2 flex flex-col items-center gap-1 transition-colors group"
                        >
                            <Shield size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-white/60">Quản trị viên</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => quickFill('TEACHER')}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2 flex flex-col items-center gap-1 transition-colors group"
                        >
                            <GraduationCap size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs text-white/60">Giáo viên</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                    <p className="text-xs text-white/40">
                        {getScriptUrl() 
                            ? <span className="text-emerald-400 flex items-center justify-center gap-1">● Đã kết nối Database</span> 
                            : "Chế độ Local (Dữ liệu không đồng bộ)"}
                    </p>
                </div>
            </div>

            {/* --- SETTINGS MODAL --- */}
            {showSettings && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                     <div className="bg-surface w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Settings size={22} className="text-indigo-400"/>
                                Kết nối Database
                            </h3>
                            <button onClick={() => setShowSettings(false)} className="hover:bg-white/10 p-2 rounded-full"><X size={20}/></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/80">URL Google Apps Script</label>
                                <input 
                                    value={scriptUrl}
                                    onChange={e => setScriptUrl(e.target.value)}
                                    placeholder="https://script.google.com/macros/s/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                />
                                <div className="text-xs text-white/40 bg-white/5 p-3 rounded-lg leading-relaxed">
                                    Để đăng nhập bằng danh sách Google Sheet và lưu trữ dữ liệu chung cho toàn trường, hãy dán link Web App vào đây.
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleSaveSettings}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Save size={18} /> Lưu cấu hình
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthScreen;