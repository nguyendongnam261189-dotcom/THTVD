import React, { useState } from 'react';
import { Delete, ArrowUp, Check, X, Space } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, onDelete, onSubmit, onClose }) => {
  const [isShift, setIsShift] = useState(false);

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ư'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ơ'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'ê', 'â', 'ô']
  ];

  const handleKey = (key: string) => {
    onKeyPress(isShift ? key.toUpperCase() : key);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-2 pb-6 z-[100] animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] select-none">
      <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 mb-2">
        <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Bàn phím ảo</span>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/20 text-white transition-colors">
            <X size={20} />
        </button>
      </div>
      
      <div className="max-w-5xl mx-auto flex flex-col gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5 md:gap-2">
            {row.map((char) => (
              <button
                key={char}
                onClick={() => handleKey(char)}
                className="h-12 w-8 md:w-14 rounded-lg bg-white/10 hover:bg-white/20 active:bg-primary active:text-white text-white font-medium text-lg md:text-xl transition-all shadow-sm border-b-2 border-black/20 active:border-0 active:translate-y-[2px]"
              >
                {isShift ? char.toUpperCase() : char}
              </button>
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-1.5 md:gap-2 mt-1">
            {/* Shift Key */}
            <button
                onClick={() => setIsShift(!isShift)}
                className={`h-12 px-4 md:px-6 rounded-lg font-medium transition-all flex items-center justify-center border-b-2 border-black/20 active:border-0 active:translate-y-[2px] ${isShift ? 'bg-primary text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
            >
                <ArrowUp size={24} />
            </button>
            
            {/* Space Key */}
            <button
                onClick={() => handleKey(' ')}
                className="h-12 w-48 md:w-80 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-all border-b-2 border-black/20 active:border-0 active:translate-y-[2px] flex items-center justify-center"
            >
                <span className="text-xs text-white/30 uppercase tracking-widest">Khoảng cách</span>
            </button>

            {/* Backspace */}
            <button
                onClick={onDelete}
                className="h-12 px-4 md:px-6 rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-red-500/80 text-white transition-all flex items-center justify-center border-b-2 border-black/20 active:border-0 active:translate-y-[2px]"
            >
                <Delete size={24} />
            </button>

            {/* Enter/Submit */}
            <button
                onClick={onSubmit}
                className="h-12 px-4 md:px-8 rounded-lg bg-primary hover:bg-primary/80 active:bg-primary/90 text-white font-bold transition-all flex items-center justify-center border-b-2 border-blue-900/50 active:border-0 active:translate-y-[2px] ml-2"
            >
                <Check size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
