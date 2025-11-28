import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppView, Project } from './types';
import { SCHOOL_NAME, BOOTH_NUMBER, PROJECTS, SCHEDULE } from './constants';
import Background from './components/Background';
import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import { generateResponse } from './services/geminiService';
import {
  Send, Bot, Clock, MapPin, X, Award, ChevronRight, AlertCircle, ExternalLink,
  Maximize, Minimize, BrainCircuit, Box, Home, Fingerprint, Scan, Smartphone, Wifi,
  ShieldCheck, Cpu, Activity, Lock, Unlock, CheckCircle, Volume2, VolumeX, Keyboard as KeyboardIcon
} from 'lucide-react';

// Thư viện bàn phím ảo
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const IDLE_TIMEOUT_MS = 30000; 

// --- HÀM XỬ LÝ GÕ TIẾNG VIỆT (TELEX FULL) ---
const toVietnamese = (str: string) => {
  let result = str;
  result = result.replace(/aa/g, "â").replace(/AA/g, "Â");
  result = result.replace(/aw/g, "ă").replace(/AW/g, "Ă");
  result = result.replace(/ee/g, "ê").replace(/EE/g, "Ê");
  result = result.replace(/oo/g, "ô").replace(/OO/g, "Ô");
  result = result.replace(/ow/g, "ơ").replace(/OW/g, "Ơ");
  result = result.replace(/uw/g, "ư").replace(/UW/g, "Ư");
  result = result.replace(/dd/g, "đ").replace(/DD/g, "Đ");
  
  const vowelTable = [
    ['a', 'á', 'à', 'ả', 'ã', 'ạ'], ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'], ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
    ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'], ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
    ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
    ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'], ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'], ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
    ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'], ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
    ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
    ['A', 'Á', 'À', 'Ả', 'Ã', 'Ạ'], ['Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ'], ['Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ'],
    ['E', 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ'], ['Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ'],
    ['I', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị'],
    ['O', 'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ'], ['Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ'], ['Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ'],
    ['U', 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ'], ['Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự'],
    ['Y', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ']
  ];

  const toneMap: Record<string, number> = { 's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5 };

  for (const row of vowelTable) {
     const baseChar = row[0]; 
     for (const [key, index] of Object.entries(toneMap)) {
         const regex = new RegExp(`${baseChar}${key}`, 'g');
         const targetChar = row[index]; 
         result = result.replace(regex, targetChar);
     }
  }
  return result; 
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<'STEM' | 'AI'>('STEM');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  
  // Chat & Keyboard State
  const [input, setInput] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false); // Mặc định là TẮT
  
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: `Chào bạn! Tôi là trợ lý ảo của ${SCHOOL_NAME}. Bạn cần tìm hiểu thông tin gì về gian hàng hay các sản phẩm STEM của chúng tôi?`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<any>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAboutVideoFullscreen, setIsAboutVideoFullscreen] = useState(false);

  const [isIdle, setIsIdle] = useState(true); 
  const [isUnlocking, setIsUnlocking] = useState(false); 
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // --- NHẠC NỀN ---
  useEffect(() => {
    bgMusicRef.current = new Audio('/background.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.2;
    return () => { if (bgMusicRef.current) bgMusicRef.current.pause(); };
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (!isIdle && !isUnlocking && !isSuccess) {
        bgMusicRef.current.play().catch(() => {});
      } else {
        bgMusicRef.current.pause();
      }
      bgMusicRef.current.muted = isMuted;
    }
  }, [isIdle, isUnlocking, isSuccess, isMuted]);

  const toggleMute = () => setIsMuted(!isMuted);

  // --- GIỌNG NÓI ---
  const speakWelcome = () => {
    const audio = new Audio('/welcome.mp3');
    audio.play().catch(() => {
      window.speechSynthesis.cancel();
      const text = "Xác thực thành công. Chào mừng đến với gian hàng chuyển đổi số.";
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const vnVoice = voices.find(v => v.lang.includes('vi'));
      if (vnVoice) utterance.voice = vnVoice;
      utterance.rate = 1.2; 
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    });
  };

  // --- BỘ ĐẾM GIỜ ---
  const resetIdleTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isIdle && !isUnlocking && !isSuccess && !iframeUrl && !showKeyboard) {
      timerRef.current = setTimeout(() => {
        console.log("--> Timeout. Kích hoạt Screensaver.");
        setCurrentView(AppView.HOME);
        setSelectedProject(null);
        setIframeUrl(null);
        setIsAboutVideoFullscreen(false);
        setShowKeyboard(false); 
        setIsIdle(true);
      }, IDLE_TIMEOUT_MS);
    }
  }, [isIdle, isUnlocking, isSuccess, iframeUrl, showKeyboard]);

  const wakeUp = () => {
    if (isUnlocking || isSuccess) return; 
    setIsIdle(false);
    setIsUnlocking(true); 
    setTimeout(() => { setIsUnlocking(false); setIsSuccess(true); speakWelcome(); }, 2500);
    setTimeout(() => { setIsSuccess(false); resetIdleTimer(); }, 7500);
  };

  // --- BẮT SỰ KIỆN ---
  useEffect(() => {
    const options = { capture: true };
    const events = ['mousedown', 'mousemove', 'click', 'touchstart', 'touchmove', 'keydown', 'scroll', 'wheel'];
    const handleActivity = () => { if (!isIdle && !isUnlocking && !isSuccess) resetIdleTimer(); };
    if (!isIdle && !isUnlocking && !isSuccess) resetIdleTimer();
    events.forEach(event => window.addEventListener(event, handleActivity, options));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, handleActivity, options));
    };
  }, [isIdle, isUnlocking, isSuccess, resetIdleTimer]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, showKeyboard]);
  
  // --- LOGIC BÀN PHÍM ẢO ---
  const onKeyboardChange = (keyboardInput: string) => {
    const vietnameseInput = toVietnamese(keyboardInput);
    setInput(vietnameseInput);
    if(keyboardRef.current && vietnameseInput !== keyboardInput) {
       keyboardRef.current.setInput(vietnameseInput);
    }
  };

  const onKeyPress = (button: string) => {
    if (button === "{enter}") {
      const newValue = input + "\n";
      setInput(newValue);
      if(keyboardRef.current) keyboardRef.current.setInput(newValue);
    }
    else if (button === "{bksp}") {
      const newValue = input.slice(0, -1);
      setInput(newValue);
      if(keyboardRef.current) keyboardRef.current.setInput(newValue);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.simple-keyboard') && !target.closest('textarea') && !target.closest('.keyboard-toggle-btn')) {
        setShowKeyboard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    setShowKeyboard(false);
    const userMsg = input;
    setInput('');
    if(keyboardRef.current) keyboardRef.current.setInput(""); 

    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    const response = await generateResponse(userMsg);
    setMessages((prev) => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const isGoogleSite = (url: string) => {
    return url.includes('sites.google.com') || url.includes('canva.com') || url.includes('drive.google.com');
  };

  // ... (Các phần Render giữ nguyên như cũ)
  if (isIdle) {
    return (
      <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center cursor-pointer animate-in fade-in duration-1000 group overflow-hidden" onClick={wakeUp}>
        <video src="/intro.mp4" className="absolute inset-0 w-full h-full object-cover opacity-80" autoPlay loop playsInline />
        <div className="absolute inset-0 bg-black/20" /> 
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-[500px] h-[500px] border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" /><div className="absolute w-[450px] h-[450px] border border-dashed border-primary/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" /></div>
        <div className="absolute bottom-24 flex flex-col items-center gap-3 animate-bounce z-10">
          <div className="p-5 rounded-full bg-black/40 backdrop-blur-xl border border-primary text-primary shadow-[0_0_50px_rgba(14,165,233,0.5)] group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"><Fingerprint size={64} className="animate-pulse" /><div className="absolute top-0 left-0 w-full h-1 bg-white/50 blur-sm animate-[bounce_1.5s_infinite]" /></div>
          <div className="bg-black/50 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full text-white font-bold text-sm uppercase tracking-[0.3em] shadow-xl">Chạm để xác thực</div>
        </div>
      </div>
    );
  }

  if (isUnlocking) {
    return (
      <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center text-center font-mono overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative mb-8 z-10 animate-in zoom-in duration-500">
          <div className="relative w-40 h-40 flex items-center justify-center"><div className="absolute inset-0 border-4 border-primary rounded-full animate-[spin_3s_linear_infinite] border-t-transparent border-l-transparent" /><div className="absolute inset-2 border-2 border-secondary rounded-full animate-[spin_4s_linear_infinite_reverse] border-b-transparent" /><Bot size={80} className="text-white drop-shadow-[0_0_20px_rgba(14,165,233,1)] animate-pulse" /></div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-primary/50 blur-xl rounded-[100%]" /> 
        </div>
        <div className="z-10 space-y-4"><h2 className="text-2xl font-bold text-primary tracking-widest animate-pulse uppercase">Đang xác thực dữ liệu...</h2><div className="flex flex-col gap-1 items-center text-white/50 text-xs"><p>Verifying user biometric...</p><p>Connecting to STEM Server...</p><p>Loading modules...</p></div></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center text-center font-mono overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.2)_0%,_transparent_70%)]" />
        <div className="z-10 animate-in zoom-in duration-300 flex flex-col items-center">
          <div className="relative mb-6"><div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-50 rounded-full animate-pulse" /><div className="relative w-32 h-32 bg-emerald-500/10 border-4 border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)]"><CheckCircle size={64} className="text-emerald-400" /></div><div className="absolute inset-0 border border-emerald-500/50 rounded-full animate-[ping_1.5s_ease-out_infinite]" /></div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-2xl">Xác thực thành công</h1><p className="text-emerald-400 text-lg tracking-[0.2em] font-bold">ACCESS GRANTED</p><div className="mt-8 text-white/60 animate-bounce">Đang truy cập vào hệ thống...</div>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-full py-20 px-4 text-center animate-in fade-in zoom-in duration-1000">
      <div className="mb-6 inline-flex items-center justify-center p-3 rounded-full bg-primary/20 border border-primary/50 animate-bounce"><span className="text-primary font-bold tracking-widest uppercase text-sm">Ngày Hội Chuyển Đổi Số 2025</span></div>
      <div className="flex flex-col items-center mb-8"><h2 className="text-lg md:text-3xl font-bold text-white/80 uppercase tracking-widest mb-3 drop-shadow-md">Ủy ban nhân dân Phường Hòa Khánh</h2><h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400 drop-shadow-lg leading-tight max-w-6xl">TRƯỜNG TRUNG HỌC CƠ SỞ <br className="hidden md:block" /> NGUYỄN BỈNH KHIÊM</h1></div>
      <p className="text-2xl text-white/60 mb-12 max-w-2xl font-light">Chào mừng đến với gian hàng số <span className="text-accent font-bold">{BOOTH_NUMBER}</span>. Khám phá sự sáng tạo và công nghệ của học sinh, giáo viên chúng tôi.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
        <button onClick={() => setCurrentView(AppView.GALLERY)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20"><Award size={32} className="text-white" /></div><h3 className="text-xl font-bold text-white">Sản phẩm STEM/AI</h3><p className="text-sm text-white/40 mt-2">Mô hình & Sáng tạo</p></button>
        <button onClick={() => setCurrentView(AppView.SCHEDULE)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20"><Clock size={32} className="text-white" /></div><h3 className="text-xl font-bold text-white">Lịch trình</h3><p className="text-sm text-white/40 mt-2">Hoạt động gian hàng</p></button>
        <button onClick={() => setCurrentView(AppView.AI_GUIDE)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20"><Bot size={32} className="text-white" /></div><h3 className="text-xl font-bold text-white">Hỏi đáp AI</h3><p className="text-sm text-white/40 mt-2">Trợ lý ảo thông minh</p></button>
        <button onClick={() => setCurrentView(AppView.ABOUT)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/20"><MapPin size={32} className="text-white" /></div><h3 className="text-xl font-bold text-white">Giới thiệu</h3><p className="text-sm text-white/40 mt-2">Về trường & Vị trí</p></button>
      </div>
    </div>
  );
  
  const renderGallery = () => {
    let categories: string[] = ['All'];
    if (selectedGroup === 'STEM') { categories = ['All', 'Environment', 'Technology', 'IT', 'Math']; } else { categories = ['All', 'Technology', 'IT', 'Math', 'NaturalScience', 'SocialScience']; }
    const filteredProjects = PROJECTS.filter((p) => { const matchGroup = p.group === selectedGroup; const matchCategory = filterCategory === 'All' || p.category === filterCategory; return matchGroup && matchCategory; });
    const getCategoryLabel = (cat: string) => { switch (cat) { case 'All': return 'Tất cả'; case 'Environment': return 'Môi trường'; case 'Technology': return 'Công nghệ'; case 'IT': return 'Tin học'; case 'Math': return 'Toán học'; case 'NaturalScience': return 'KHTN'; case 'SocialScience': return 'KHXH'; default: return cat; } };
    return (
      <div className="w-full max-w-6xl mx-auto pt-20 pb-48 px-6 animate-in slide-in-from-right duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex flex-col items-start gap-2"><h2 className="text-4xl font-bold text-white">Sản phẩm trưng bày</h2><p className="text-white/50 text-sm">Khám phá các mô hình sáng tạo và ứng dụng công nghệ</p></div>
          <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-white/10">
            <button onClick={() => { setSelectedGroup('STEM'); setFilterCategory('All'); }} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${selectedGroup === 'STEM' ? 'bg-primary text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><Box size={18} /> Sản phẩm STEM</button>
            <button onClick={() => { setSelectedGroup('AI'); setFilterCategory('All'); }} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${selectedGroup === 'AI' ? 'bg-secondary text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><BrainCircuit size={18} /> Ứng dụng AI</button>
          </div>
        </div>
        <div className="flex bg-white/5 rounded-xl p-1 backdrop-blur-md overflow-x-auto max-w-full mb-8 border border-white/5 no-scrollbar">
          {categories.map((cat) => (<button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterCategory === cat ? 'bg-white/20 text-white shadow-sm border border-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>{getCategoryLabel(cat)}</button>))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (filteredProjects.map((project) => (<ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />))) : (<div className="col-span-full py-20 text-center text-white/30"><AlertCircle className="mx-auto mb-4 w-12 h-12 opacity-50" /><p>Không tìm thấy sản phẩm nào trong danh mục này.</p></div>)}
        </div>
        {selectedProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProject(null)}>
            <div className="bg-slate-900 border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <div className="w-full md:w-3/5 bg-black relative aspect-video md:aspect-auto"><img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" /></div>
              <div className="w-full md:w-2/5 p-8 flex flex-col bg-slate-900 overflow-y-auto">
                <div className="flex items-center justify-between mb-6"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedProject.group === 'AI' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>{getCategoryLabel(selectedProject.category)}</span><button onClick={() => setSelectedProject(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"><X size={20} /></button></div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{selectedProject.title}</h2><p className="text-white/70 text-base leading-relaxed mb-6 flex-grow">{selectedProject.description}</p>
                <div className="space-y-4 mt-auto"><div className="border-t border-white/10 pt-4"><p className="text-xs text-white/40 uppercase tracking-widest mb-1">Thực hiện bởi</p><p className="text-base text-white font-medium">{selectedProject.authors}</p></div>{selectedProject.demoUrl && (<button onClick={() => setIframeUrl(selectedProject.demoUrl!)} className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1"><ExternalLink size={20} /> Trải nghiệm sản phẩm</button>)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSchedule = () => (<div className="w-full max-w-4xl mx-auto pt-20 pb-48 px-6 animate-in slide-in-from-right duration-500"><h2 className="text-4xl font-bold text-white mb-12 text-center">Lịch trình hoạt động</h2><div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">{SCHEDULE.map((item) => (<div key={item.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}><div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform"><Clock size={16} className={item.isHighlight ? 'text-accent' : 'text-white/50'} /></div><div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border ${item.isHighlight ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30' : 'bg-white/5 border-white/10'} backdrop-blur-sm shadow-xl transition-all duration-300 hover:-translate-y-1`}><div className="flex items-center justify-between mb-2"><time className="font-mono text-sm text-primary">{item.time}</time>{item.isHighlight && <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />}</div><h3 className="text-xl font-bold text-white mb-2">{item.title}</h3><p className="text-white/60 text-sm mb-3">{item.description}</p><div className="flex items-center gap-2 text-xs text-white/40"><MapPin size={12} /> {item.location}</div></div></div>))}</div></div>);
  const renderAbout = () => (<div className="w-full max-w-5xl mx-auto pt-20 pb-48 px-6 animate-in slide-in-from-right duration-500 flex flex-col md:flex-row gap-12 items-center"><div className="w-full md:w-1/2 relative group"><div className="relative aspect-video rounded-3xl border border-white/10 shadow-2xl bg-black flex items-center justify-center overflow-hidden"><video src="/intro.mp4" className="absolute inset-0 w-full h-full object-contain" controls playsInline /><button onClick={() => setIsAboutVideoFullscreen(true)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm border border-white/10 transition-all z-10 opacity-0 group-hover:opacity-100" title="Phóng to video"><Maximize size={20} /></button></div></div><div className="w-full md:w-1/2 space-y-8"><div><h2 className="text-4xl font-bold text-white mb-4">Kết quả thực hiện nhiệm vụ <br /><span className="text-primary text-2xl">Năm học 2024 - 2025</span></h2><p className="text-white/70 text-lg leading-relaxed">Năm học 2024-2025 khép lại, ghi dấu một chặng đường nỗ lực không ngừng của tập thể {SCHOOL_NAME}. Nhà trường đã đạt được nhiều thành tích xuất sắc trong công tác dạy và học, cũng như các hoạt động phong trào, chuyển đổi số và STEM.</p></div><div className="grid grid-cols-2 gap-4"><div className="bg-white/5 border border-white/10 p-5 rounded-2xl"><h4 className="text-3xl font-bold text-primary mb-1">34</h4><p className="text-white/40 text-sm">Giải HSG Thành phố</p></div><div className="bg-white/5 border border-white/10 p-5 rounded-2xl"><h4 className="text-3xl font-bold text-accent mb-1">44</h4><p className="text-white/40 text-sm">Giải HSG Cấp Quận</p></div></div><div className="flex gap-4"><button onClick={() => setCurrentView(AppView.GALLERY)} className="flex items-center gap-2 px-6 py-3 bg-white text-dark font-bold rounded-xl hover:bg-white/90 transition-colors">Xem sản phẩm <ChevronRight size={18} /></button><button onClick={() => setCurrentView(AppView.AI_GUIDE)} className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors">Hỏi trợ lý AI</button></div></div></div>);

  // --- RENDER CHAT AI VỚI BÀN PHÍM ẢO (SỬA ĐỔI) ---
  const renderAIGuide = () => (
    <div className="w-full max-w-3xl mx-auto pt-20 pb-48 px-6 h-full flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="text-center mb-6 shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mx-auto flex items-center justify-center mb-3 shadow-[0_0_40px_rgba(16,185,129,0.3)]"><Bot size={32} className="text-white" /></div>
        <h2 className="text-2xl font-bold text-white">Trợ lý Ảo AI</h2><p className="text-white/50 text-sm">Hỏi tôi về lịch trình, sản phẩm hoặc thông tin về trường</p>
      </div>
      <div className="flex-1 min-h-0 bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col backdrop-blur-sm mb-6 transition-all duration-300 relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-md' : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'}`}>{msg.text}</div>
            </div>
          ))}
          {isLoading && (<div className="flex justify-start"><div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-4 animate-in fade-in slide-in-from-left duration-300"><div className="relative w-8 h-8 flex items-center justify-center"><div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-[spin_3s_linear_infinite]" /><div className="absolute inset-1 border-2 border-t-emerald-400 rounded-full animate-spin" /><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /></div><span className="text-emerald-400 text-xs font-mono animate-pulse uppercase tracking-wider">AI đang phân tích...</span></div></div>)}
          <div ref={chatEndRef} />
        </div>

        {/* BÀN PHÍM ẢO: TẮT ONFOCUS TỰ ĐỘNG, CHỈ HIỆN KHI CẦN */}
        {showKeyboard && (
          <div className="absolute bottom-[80px] left-0 right-0 bg-slate-900 border-t border-white/20 p-2 z-50 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="simple-keyboard-theme-dark text-black"> 
                <Keyboard
                  keyboardRef={r => (keyboardRef.current = r)}
                  onChange={onKeyboardChange}
                  onKeyPress={onKeyPress}
                  inputName="chatInput"
                  layout={{
                    default: [
                      "1 2 3 4 5 6 7 8 9 0 - = {bksp}", 
                      "q w e r t y u i o p [ ] \\",
                      "a s d f g h j k l ; '",
                      "{shift} z x c v b n m , . /",
                      "{space} {enter}" 
                    ],
                    shift: [
                      "! @ # $ % ^ & * ( ) _ + {bksp}",
                      "Q W E R T Y U I O P { } |",
                      "A S D F G H J K L : \"",
                      "{shift} Z X C V B N M < > ?",
                      "{space} {enter}"
                    ]
                  }}
                  display={{
                    "{bksp}": "⌫ Xóa",
                    "{enter}": "↵ Xuống dòng", 
                    "{shift}": "⇧ Shift",
                    "{space}": "Dấu cách",
                  }}
                />
            </div>
          </div>
        )}

        <form onSubmit={handleChatSubmit} className="p-4 bg-white/5 border-t border-white/10 flex gap-3 shrink-0 relative z-50">
          <div className="flex-1 relative">
             {/* TEXTAREA: BỎ ONFOCUS AUTO SHOW */}
             <textarea
                value={input}
                onFocus={() => {}} // KHÔNG TỰ ĐỘNG HIỆN BÀN PHÍM NỮA
                onChange={(e) => {
                    const val = toVietnamese(e.target.value); 
                    setInput(val);
                    if(keyboardRef.current) keyboardRef.current.setInput(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit();
                  }
                }}
                placeholder="Nhập câu hỏi (gõ aa->â, dd->đ...)"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-black/40 transition-all resize-none h-14 scrollbar-hide"
              />
              {/* NÚT BẬT/TẮT BÀN PHÍM THỦ CÔNG */}
              <button 
                type="button" 
                onClick={() => setShowKeyboard(!showKeyboard)} // Bấm là hiện/ẩn
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white bg-white/5 rounded-lg keyboard-toggle-btn"
                title="Bật/Tắt bàn phím ảo"
              >
                <KeyboardIcon size={20} className={showKeyboard ? "text-primary" : ""} />
              </button>
          </div>
          <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center w-14 h-14"><Send size={24} /></button>
        </form>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2 shrink-0">
        {['Lịch thi đấu Robotic khi nào?', 'Danh sách sản phẩm STEM?', 'Giới thiệu trường'].map(suggestion => (
          <button key={suggestion} onClick={() => { setInput(suggestion); handleChatSubmit(); }} className="text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">{suggestion}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-full font-sans selection:bg-primary/30 text-white overflow-hidden">
      <Background />
      <button onClick={toggleFullscreen} className="fixed top-4 right-4 z-[55] p-3 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/20" title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}>{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}</button>
      
      {!isIdle && !isUnlocking && !isSuccess && (
        <button onClick={toggleMute} className="fixed top-4 left-4 z-[55] p-3 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white transition-all border border-white/5 hover:border-white/20 flex items-center gap-2">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}<span className="text-xs font-medium hidden md:block">{isMuted ? 'Bật nhạc' : 'Tắt nhạc'}</span>
        </button>
      )}

      <main className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth pb-0">
        {currentView === AppView.HOME && renderHome()}
        {currentView === AppView.GALLERY && renderGallery()}
        {currentView === AppView.SCHEDULE && renderSchedule()}
        {currentView === AppView.AI_GUIDE && renderAIGuide()}
        {currentView === AppView.ABOUT && renderAbout()}
      </main>

      {isAboutVideoFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-in fade-in duration-300">
          <button onClick={() => setIsAboutVideoFullscreen(false)} className="absolute top-6 right-6 z-[10000] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/20" title="Đóng"><Minimize size={24} /></button>
          <video src="/intro.mp4" className="w-full h-full object-contain" controls autoPlay />
        </div>
      )}

      {iframeUrl && (
        <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-white/10 shrink-0">
            <h3 className="text-white font-medium truncate flex-1 pl-2">Trải nghiệm sản phẩm</h3>
            <div className="flex items-center gap-2">
              <a href={iframeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold rounded-lg transition-colors border border-primary/20"><ExternalLink size={14} /> Mở cửa sổ ngoài</a>
              <button onClick={() => setIframeUrl(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><X size={24} /></button>
            </div>
          </div>
          
          <div className="flex-1 w-full bg-slate-900 relative flex items-center justify-center overflow-hidden">
            {isGoogleSite(iframeUrl) ? (
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-12 p-8 animate-in zoom-in duration-500 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
                <div className="relative group">
                    <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                    <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl" />

                    <div className="bg-white p-4 rounded-xl shadow-[0_0_50px_rgba(14,165,233,0.3)] relative overflow-hidden">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(iframeUrl)}`} alt="Scan QR" className="w-64 h-64 md:w-80 md:h-80 object-contain z-10 relative" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,1)] z-20 animate-[bounce_2s_infinite]" />
                    </div>
                    
                    <div className="absolute -bottom-10 w-full text-center">
                        <span className="text-primary font-mono text-xs tracking-[0.3em] animate-pulse">SCANNING...</span>
                    </div>
                </div>

                <div className="text-center md:text-left max-w-md space-y-6">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-primary mb-2">
                    <div className="p-2 bg-primary/20 rounded-lg"><Scan size={32} /></div>
                    <span className="text-xl font-bold uppercase tracking-widest">Truy cập bảo mật</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">Trải nghiệm sản phẩm trên <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Thiết bị di động</span></h3>
                  <p className="text-white/60 text-lg leading-relaxed">Trang web này sử dụng công nghệ bảo mật cao của Google. Vui lòng quét mã để mở khóa nội dung đầy đủ trên điện thoại của bạn.</p>
                  <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                     <div className="flex items-center gap-2 text-sm text-white/40 bg-white/5 px-4 py-2 rounded-full border border-white/5"><Wifi size={16} /> <span>Yêu cầu kết nối mạng</span></div>
                     <div className="flex items-center gap-2 text-sm text-white/40 bg-white/5 px-4 py-2 rounded-full border border-white/5"><Smartphone size={16} /> <span>Hỗ trợ iOS/Android</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <iframe src={iframeUrl} className="w-full h-full border-0 bg-white" title="Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            )}
          </div>
        </div>
      )}

      {!isIdle && !isUnlocking && !isSuccess && (
         <Navigation currentView={currentView} onNavigate={setCurrentView} />
      )}
    </div>
  );
};

export default App;
