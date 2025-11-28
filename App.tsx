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
  ShieldCheck, Cpu, Activity, Lock, Unlock, CheckCircle, Volume2, VolumeX, Keyboard as KeyboardIcon,
  MessageSquareHeart, Trash2, PenTool, Sparkles, Mic, MicOff
} from 'lucide-react';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const IDLE_TIMEOUT_MS = 30000; 

// --- TYPE DEFINITION CHO SPEECH API (Để tránh lỗi đỏ TypeScript) ---
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface GuestEntry {
  id: number;
  name: string;
  message: string;
  emoji: string;
  timestamp: string;
}

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
  
  const [input, setInput] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false); 
  
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

  // --- STATE SỔ LƯU BÚT ---
  const [guestEntries, setGuestEntries] = useState<GuestEntry[]>([]);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestMsg, setNewGuestMsg] = useState('');
  const [newGuestEmoji, setNewGuestEmoji] = useState('❤️');
  const [adminClickCount, setAdminClickCount] = useState(0); 
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // State cho Thu âm
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // --- LOAD/SAVE SỔ LƯU BÚT ---
  useEffect(() => {
    const saved = localStorage.getItem('digital_guestbook_data');
    if (saved) {
      setGuestEntries(JSON.parse(saved));
    } else {
      setGuestEntries([
        { id: 1, name: 'Thầy Hiệu Trưởng', message: 'Chúc ngày hội thành công rực rỡ!', emoji: '🎉', timestamp: '28/11' },
        { id: 2, name: 'Học sinh lớp 9/1', message: 'Gian hàng trường mình xịn quá!', emoji: '😍', timestamp: '28/11' }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('digital_guestbook_data', JSON.stringify(guestEntries));
  }, [guestEntries]);

  // --- XỬ LÝ GIỌNG NÓI (SPEECH TO TEXT) ---
  const handleVoiceInput = () => {
    // Kiểm tra trình duyệt có hỗ trợ không
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt này không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge.");
      return;
    }

    if (isListening) {
      // Nếu đang nghe thì dừng lại
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // Bắt đầu nghe
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN'; // Ngôn ngữ Tiếng Việt
    recognition.interimResults = false; // Chỉ lấy kết quả cuối cùng
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Cộng dồn vào lời nhắn hiện tại
      setNewGuestMsg(prev => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Lỗi nhận diện giọng nói:", event.error);
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleAddGuestEntry = () => {
    if (!newGuestName.trim() || !newGuestMsg.trim()) return;
    const newEntry: GuestEntry = {
      id: Date.now(),
      name: newGuestName,
      message: newGuestMsg,
      emoji: newGuestEmoji,
      timestamp: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
    };
    setGuestEntries([newEntry, ...guestEntries]);
    setNewGuestName('');
    setNewGuestMsg('');
    setIsGuestbookOpen(false);
    setShowKeyboard(false);
  };

  const handleDeleteEntry = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa lời chúc này không?")) {
        const updated = guestEntries.filter(e => e.id !== id);
        setGuestEntries(updated);
    }
  };

  const handleTitleClick = () => {
    setAdminClickCount(prev => prev + 1);
    if (adminClickCount + 1 >= 5) {
      setIsAdminMode(!isAdminMode);
      setAdminClickCount(0);
      alert(isAdminMode ? "Đã TẮT chế độ Admin" : "Đã BẬT chế độ Admin (Hiện nút xóa)");
    }
  };

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
    if (!isIdle && !isUnlocking && !isSuccess && !iframeUrl && !showKeyboard && !isGuestbookOpen) {
      timerRef.current = setTimeout(() => {
        console.log("--> Timeout. Kích hoạt Screensaver.");
        setCurrentView(AppView.HOME);
        setSelectedProject(null);
        setIframeUrl(null);
        setIsGuestbookOpen(false); 
        setIsAboutVideoFullscreen(false);
        setShowKeyboard(false); 
        setIsIdle(true);
      }, IDLE_TIMEOUT_MS);
    }
  }, [isIdle, isUnlocking, isSuccess, iframeUrl, showKeyboard, isGuestbookOpen]);

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
    if (!isGuestbookOpen) {
        setInput(vietnameseInput);
        if(keyboardRef.current && vietnameseInput !== keyboardInput) {
           keyboardRef.current.setInput(vietnameseInput);
        }
    }
  };

  const onKeyPress = (button: string) => {
    if (button === "{enter}") {
      setInput(prev => prev + "\n");
    } else if (button === "{bksp}") {
      setInput(prev => prev.slice(0, -1));
    }
  };

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

  // ... (Giữ nguyên các hàm Render Màn hình chờ, Unlock, Success...)
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
    <div className="flex flex-col items-center justify-center min-h-full py-20 px-4 text-center animate-in fade-in zoom-in duration-1000 relative">
      <div className="mb-2 inline-flex items-center justify-center p-3 rounded-full bg-primary/20 border border-primary/50 animate-bounce"><span className="text-primary font-bold tracking-widest uppercase text-sm">Ngày Hội Chuyển Đổi Số 2025</span></div>
      
      {/* MARQUEE SỔ LƯU BÚT */}
      <div className="w-full max-w-4xl mb-4 overflow-hidden relative h-10 bg-white/5 rounded-full border border-white/10 flex items-center">
         <div className="absolute left-4 z-10 flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider bg-slate-900 pr-2">
            <MessageSquareHeart size={16} /> Lưu bút
         </div>
         <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex gap-8 pl-32">
            {guestEntries.map(entry => (
               <div key={entry.id} className="flex items-center gap-2 text-white/80">
                  <span className="text-xl">{entry.emoji}</span>
                  <span className="font-bold text-primary">{entry.name}:</span>
                  <span>"{entry.message}"</span>
                  <span className="text-xs text-white/30">({entry.timestamp})</span>
               </div>
            ))}
            {guestEntries.map(entry => (
               <div key={`dup-${entry.id}`} className="flex items-center gap-2 text-white/80">
                  <span className="text-xl">{entry.emoji}</span>
                  <span className="font-bold text-primary">{entry.name}:</span>
                  <span>"{entry.message}"</span>
                  <span className="text-xs text-white/30">({entry.timestamp})</span>
               </div>
            ))}
         </div>
      </div>

      <div className="flex flex-col items-center mb-8"><h2 className="text-lg md:text-3xl font-bold text-white/80 uppercase tracking-widest mb-3 drop-shadow-md">Ủy ban nhân dân Phường Hòa Khánh</h2><h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400 drop-shadow-lg leading-tight max-w-6xl">TRƯỜNG TRUNG HỌC CƠ SỞ <br className="hidden md:block" /> NGUYỄN BỈNH KHIÊM</h1></div>
      
      <div className="flex gap-4 mb-12">
         <button onClick={() => setIsGuestbookOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/30 transition-all hover:-translate-y-1">
            <PenTool size={20} />
            Ký Sổ Lưu Bút
         </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
        <button onClick={() => setCurrentView(AppView.GALLERY)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20"><Award size={32} className="text-white" /></div><h3 className="text-xl font-bold text-white">Sản phẩm STEM/AI</h3><p className="text-sm text-white/40 mt-2">Mô hình & Sáng tạo</p></button>
        <button onClick={() => setCurrentView(AppView.SCHEDULE)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20"><Clock size={32} className="text-white" /></div><h3 className="text-xl font-bold text-white">Lịch trình</h3><p className="text-sm text-white/40 mt-2">Hoạt động gian hàng</p></button>
        <button onClick={() => setCurrentView(AppView.AI_GUIDE)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20"><Bot size={32} className="text-white" /></div><h3 className="text-xl font-bold text-white">Hỏi đáp AI</h3><p className="text-sm text-white/40 mt-2">Trợ lý ảo thông minh</p></button>
        <button onClick={() => setCurrentView(AppView.ABOUT)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/20"><MapPin size={32} className="text-white" /></div><h3 className="text-xl font-bold text-white">Giới thiệu</h3><p className="text-sm text-white/40 mt-2">Về trường & Vị trí</p></button>
      </div>

      {/* --- MODAL SỔ LƯU BÚT --- */}
      {isGuestbookOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-white/20 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
              <div 
                className="p-6 border-b border-white/10 bg-white/5 select-none cursor-pointer active:scale-95 transition-transform"
                onClick={handleTitleClick}
              >
                 <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <MessageSquareHeart className="text-pink-500" /> Sổ Lưu Bút Điện Tử
                    {isAdminMode && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">ADMIN MODE</span>}
                 </h3>
                 <p className="text-white/50 text-sm mt-1">Chia sẻ cảm nghĩ của bạn về gian hàng nhé!</p>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                 <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div>
                       <label className="text-xs text-white/50 uppercase font-bold mb-1 block">Tên của bạn</label>
                       <input 
                          type="text" 
                          value={newGuestName}
                          onChange={(e) => setNewGuestName(e.target.value)}
                          placeholder="Nhập tên..."
                          className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                       />
                    </div>
                    <div>
                       <label className="text-xs text-white/50 uppercase font-bold mb-1 block">Lời nhắn gửi (Nói hoặc viết)</label>
                       <div className="relative">
                          <textarea 
                              value={newGuestMsg}
                              onChange={(e) => setNewGuestMsg(e.target.value)}
                              placeholder="Viết lời chúc..."
                              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 pr-12 text-white focus:border-pink-500 outline-none h-24 resize-none"
                          />
                          {/* NÚT MICROPHONE CHO SỔ LƯU BÚT */}
                          <button
                            onClick={handleVoiceInput}
                            className={`absolute right-3 top-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                            title="Nói để nhập liệu"
                          >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                          </button>
                       </div>
                       {isListening && <p className="text-xs text-red-400 mt-1 animate-pulse">Đang nghe... hãy nói lời chúc của bạn</p>}
                    </div>
                    <div>
                       <label className="text-xs text-white/50 uppercase font-bold mb-2 block">Cảm xúc</label>
                       <div className="flex gap-2">
                          {['❤️', '😍', '👍', '🔥', '🎉', '🚀', '⭐', '🍀'].map(emoji => (
                             <button key={emoji} onClick={() => setNewGuestEmoji(emoji)} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${newGuestEmoji === emoji ? 'bg-pink-500 scale-110 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}>{emoji}</button>
                          ))}
                       </div>
                    </div>
                    <button onClick={handleAddGuestEntry} disabled={!newGuestName.trim() || !newGuestMsg.trim()} className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl font-bold text-white shadow-lg hover:shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2">Gửi Lời Chúc</button>
                 </div>

                 <div className="space-y-3">
                    <h4 className="text-white font-bold mb-2">Lời chúc gần đây</h4>
                    {guestEntries.map(entry => (
                       <div key={entry.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex gap-4 group hover:bg-white/10 transition-colors">
                          <div className="text-3xl pt-1">{entry.emoji}</div>
                          <div className="flex-1">
                             <div className="flex justify-between items-start"><h5 className="font-bold text-pink-400">{entry.name}</h5><span className="text-xs text-white/30">{entry.timestamp}</span></div>
                             <p className="text-white/80 mt-1">{entry.message}</p>
                          </div>
                          {isAdminMode && (<button onClick={() => handleDeleteEntry(entry.id)} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors h-fit self-center"><Trash2 size={18} /></button>)}
                       </div>
                    ))}
                 </div>
              </div>
              <button onClick={() => setIsGuestbookOpen(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"><X size={20} /></button>
           </div>
        </div>
      )}
    </div>
  );
  
  // ... (Giữ nguyên các hàm renderGallery, renderSchedule, renderAIGuide, renderAbout, return)
  // LƯU Ý: Phần return cuối cùng của App thầy giữ nguyên như cũ, chỉ thay đổi phần renderHome ở trên là đủ.
  // Nhưng để đảm bảo, tôi paste lại phần return bên dưới:

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

      {/* Popup Video Intro */}
      {isAboutVideoFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-in fade-in duration-300">
          <button onClick={() => setIsAboutVideoFullscreen(false)} className="absolute top-6 right-6 z-[10000] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/20" title="Đóng"><Minimize size={24} /></button>
          <video src="/intro.mp4" className="w-full h-full object-contain" controls autoPlay />
        </div>
      )}

      {/* Popup Iframe Sản phẩm */}
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
                    <div className="absolute -bottom-10 w-full text-center"><span className="text-primary font-mono text-xs tracking-[0.3em] animate-pulse">SCANNING...</span></div>
                </div>
                <div className="text-center md:text-left max-w-md space-y-6">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-primary mb-2"><div className="p-2 bg-primary/20 rounded-lg"><Scan size={32} /></div><span className="text-xl font-bold uppercase tracking-widest">Truy cập bảo mật</span></div>
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
