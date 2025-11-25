import React from 'react';
import { Home, Grid, Calendar, Bot, Info, ArrowLeft } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const isHome = currentView === AppView.HOME;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center items-end z-50 pointer-events-none">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex gap-4 pointer-events-auto">
        {!isHome && (
            <button
            onClick={() => onNavigate(AppView.HOME)}
            className="flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all active:scale-95 bg-white/5 border border-white/5"
            >
            <Home size={28} />
            <span className="text-xs font-medium mt-1">Trang chủ</span>
            </button>
        )}

        <NavButton 
            active={currentView === AppView.GALLERY} 
            onClick={() => onNavigate(AppView.GALLERY)} 
            icon={<Grid size={24} />} 
            label="Sản phẩm" 
        />
        <NavButton 
            active={currentView === AppView.SCHEDULE} 
            onClick={() => onNavigate(AppView.SCHEDULE)} 
            icon={<Calendar size={24} />} 
            label="Lịch trình" 
        />
        <NavButton 
            active={currentView === AppView.AI_GUIDE} 
            onClick={() => onNavigate(AppView.AI_GUIDE)} 
            icon={<Bot size={24} />} 
            label="Trợ lý AI" 
            special
        />
        <NavButton 
            active={currentView === AppView.ABOUT} 
            onClick={() => onNavigate(AppView.ABOUT)} 
            icon={<Info size={24} />} 
            label="Giới thiệu" 
        />
      </div>
    </div>
  );
};

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    special?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, special }) => (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all active:scale-95
        ${active 
            ? 'bg-primary text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] scale-110 -translate-y-2' 
            : special 
                ? 'bg-gradient-to-br from-secondary to-purple-600 text-white shadow-lg border border-white/10'
                : 'hover:bg-white/10 text-white/60 hover:text-white'
        }
      `}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
);

export default Navigation;