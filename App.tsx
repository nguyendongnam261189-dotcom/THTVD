import React, { useState } from 'react';
import { AppView, Project } from './types';
import { SCHOOL_NAME, BOOTH_NUMBER, PROJECTS, SCHEDULE } from './constants';
import Background from './components/Background';
import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import { generateResponse } from './services/geminiService';
import { Mic, Send, Bot, Clock, MapPin, X, Award, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
      {role: 'model', text: `Chào bạn! Tôi là trợ lý ảo của ${SCHOOL_NAME}. Bạn cần tìm hiểu thông tin gì về gian hàng hay các sản phẩm STEM của chúng tôi?`}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMsg = input;
      setInput('');
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      setIsLoading(true);

      const response = await generateResponse(userMsg);
      
      setMessages(prev => [...prev, { role: 'model', text: response }]);
      setIsLoading(false);
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-full py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="mb-6 inline-flex items-center justify-center p-3 rounded-full bg-primary/20 border border-primary/50 animate-bounce">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">Ngày Hội Chuyển Đổi Số 2025</span>
        </div>
        
        <div className="flex flex-col items-center mb-8">
            <h2 className="text-lg md:text-3xl font-bold text-white/80 uppercase tracking-widest mb-3 drop-shadow-md">
                Ủy ban nhân dân Phường Hòa Khánh
            </h2>
            <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400 drop-shadow-lg leading-tight max-w-6xl">
                Trường Trung Học Cơ Sở <br className="hidden md:block" /> Nguyễn Bỉnh Khiêm
            </h1>
        </div>

        <p className="text-2xl text-white/60 mb-12 max-w-2xl font-light">
            Chào mừng đến với gian hàng số <span className="text-accent font-bold">{BOOTH_NUMBER}</span>. Khám phá sự sáng tạo và công nghệ của học sinh chúng tôi.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
            <button onClick={() => setCurrentView(AppView.GALLERY)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                    <Award size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Sản phẩm STEM</h3>
                <p className="text-sm text-white/40 mt-2">Mô hình & Sáng tạo</p>
            </button>
            <button onClick={() => setCurrentView(AppView.SCHEDULE)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
                    <Clock size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Lịch trình</h3>
                <p className="text-sm text-white/40 mt-2">Hoạt động gian hàng</p>
            </button>
             <button onClick={() => setCurrentView(AppView.AI_GUIDE)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                    <Bot size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Hỏi đáp AI</h3>
                <p className="text-sm text-white/40 mt-2">Trợ lý ảo thông minh</p>
            </button>
            <button onClick={() => setCurrentView(AppView.ABOUT)} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 p-8 rounded-3xl backdrop-blur-sm transition-all hover:-translate-y-2 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/20">
                    <MapPin size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Giới thiệu</h3>
                <p className="text-sm text-white/40 mt-2">Về trường & Vị trí</p>
            </button>
        </div>
    </div>
  );

  const renderGallery = () => (
    <div className="w-full max-w-6xl mx-auto pt-20 pb-48 px-6 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-white">Sản phẩm trưng bày</h2>
            <span className="text-white/50">{PROJECTS.length} dự án</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map(project => (
                <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => setSelectedProject(project)}
                />
            ))}
        </div>
        
        {/* Project Modal */}
        {selectedProject && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProject(null)}>
                <div className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                    <div className="w-full md:w-1/2 h-64 md:h-auto">
                        <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-8 w-full md:w-1/2 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">{selectedProject.category}</span>
                            <span className="text-white/40 text-sm">ID: {selectedProject.id}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h2>
                        <p className="text-white/70 text-lg leading-relaxed mb-8 flex-grow">{selectedProject.description}</p>
                        
                        <div className="mt-auto pt-6 border-t border-white/10">
                            <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Thực hiện bởi</p>
                            <p className="text-lg text-white font-medium">{selectedProject.authors}</p>
                        </div>
                        <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );

  const renderSchedule = () => (
      <div className="w-full max-w-4xl mx-auto pt-20 pb-48 px-6 animate-in slide-in-from-right duration-500">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Lịch trình hoạt động</h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
            {SCHEDULE.map((item, index) => (
                <div key={item.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                        <Clock size={16} className={item.isHighlight ? "text-accent" : "text-white/50"} />
                    </div>
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border ${item.isHighlight ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30' : 'bg-white/5 border-white/10'} backdrop-blur-sm shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                        <div className="flex items-center justify-between mb-2">
                            <time className="font-mono text-sm text-primary">{item.time}</time>
                            {item.isHighlight && <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-white/60 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <MapPin size={12} />
                            {item.location}
                        </div>
                    </div>
                </div>
            ))}
          </div>
      </div>
  );

  const renderAIGuide = () => (
    <div className="w-full max-w-3xl mx-auto pt-20 pb-48 px-6 h-full flex flex-col animate-in slide-in-from-bottom duration-500">
        <div className="text-center mb-8 shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <Bot size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Trợ lý Ảo AI</h2>
            <p className="text-white/50">Hỏi tôi về lịch trình, sản phẩm hoặc thông tin về trường</p>
        </div>

        <div className="flex-1 min-h-0 bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === 'user' 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="bg-white/10 text-white/50 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center">
                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
            </div>
            
            <form onSubmit={handleChatSubmit} className="p-4 bg-white/5 border-t border-white/10 flex gap-3 shrink-0">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-black/40 transition-all"
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center w-14"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center gap-2 shrink-0">
            {["Lịch thi đấu Robotic khi nào?", "Gian hàng có gì?", "Giới thiệu trường"].map(suggestion => (
                <button 
                    key={suggestion} 
                    onClick={() => { setInput(suggestion); }}
                    className="text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    </div>
  );

  const renderAbout = () => (
      <div className="w-full max-w-5xl mx-auto pt-20 pb-48 px-6 animate-in slide-in-from-right duration-500 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="https://picsum.photos/800/800?random=10" alt="School Activity" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent">
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-bold text-white mb-1">Chuyển đổi số trong giáo dục</h3>
                        <p className="text-white/60 text-sm">Hướng tới tương lai 4.0</p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="w-full md:w-1/2 space-y-8">
              <div>
                  <h2 className="text-4xl font-bold text-white mb-4">Về chúng tôi</h2>
                  <p className="text-white/70 text-lg leading-relaxed">
                      {SCHOOL_NAME} tự hào là đơn vị tiên phong trong việc ứng dụng công nghệ thông tin và chuyển đổi số trong giảng dạy. Tại ngày hội năm nay, chúng tôi mang đến những giải pháp giáo dục sáng tạo, từ mô hình STEM thực tiễn đến các ứng dụng phần mềm quản lý thông minh.
                  </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <h4 className="text-3xl font-bold text-primary mb-1">20+</h4>
                      <p className="text-white/40 text-sm">Sản phẩm STEM</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <h4 className="text-3xl font-bold text-accent mb-1">05</h4>
                      <p className="text-white/40 text-sm">Đội thi Robotics</p>
                  </div>
              </div>

              <div className="flex gap-4">
                  <button onClick={() => setCurrentView(AppView.GALLERY)} className="flex items-center gap-2 px-6 py-3 bg-white text-dark font-bold rounded-xl hover:bg-white/90 transition-colors">
                      Xem sản phẩm <ChevronRight size={18} />
                  </button>
                  <button onClick={() => setCurrentView(AppView.AI_GUIDE)} className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors">
                      Hỏi trợ lý AI
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="relative h-screen w-full font-sans selection:bg-primary/30 text-white overflow-hidden">
      <Background />
      
      <main className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth pb-0">
        {currentView === AppView.HOME && renderHome()}
        {currentView === AppView.GALLERY && renderGallery()}
        {currentView === AppView.SCHEDULE && renderSchedule()}
        {currentView === AppView.AI_GUIDE && renderAIGuide()}
        {currentView === AppView.ABOUT && renderAbout()}
      </main>

      <Navigation currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;