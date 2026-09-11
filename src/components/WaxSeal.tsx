import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles } from 'lucide-react';

interface WaxSealProps {
  isSealed: boolean;
  date?: string;
  onBreakSeal?: () => void;
  interactive?: boolean;
}

export const WaxSeal: React.FC<WaxSealProps> = ({ isSealed, date, onBreakSeal, interactive = true }) => {
  if (!isSealed) return null;

  return (
    <motion.div
      initial={{ scale: 2.2, opacity: 0, rotate: -15 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="relative flex flex-col items-center justify-center select-none"
    >
      {/* Red/Gold Wax Ribbon Behind Seal */}
      <div className="absolute -top-6 flex space-x-3 pointer-events-none opacity-85">
        <div className="w-4 h-16 bg-gradient-to-b from-[#8B1E1E] to-[#5C1010] transform -rotate-12 shadow-md rounded-b-sm border-r border-[#D4AF37]/30" />
        <div className="w-4 h-16 bg-gradient-to-b from-[#8B1E1E] to-[#5C1010] transform rotate-12 shadow-md rounded-b-sm border-l border-[#D4AF37]/30" />
      </div>

      {/* Main Golden Wax Seal Body */}
      <div 
        className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-default z-10 shadow-2xl transition-transform hover:scale-105"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #F5D77F 0%, #D4AF37 40%, #AA7C11 80%, #6E4D05 100%)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(0,0,0,0.5)',
          border: '3px solid #EED48F',
        }}
      >
        {/* Organic irregular wax perimeter ripples */}
        <div className="absolute inset-0 rounded-full border border-[#8C6207]/40 pointer-events-none" />
        <div className="absolute -inset-1 rounded-full border border-[#F3E5AB]/30 opacity-70 pointer-events-none" />

        {/* Inner Debossed Ring */}
        <div 
          className="w-18 h-18 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-[#6E4D05]/50"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #C49B27 0%, #A47814 100%)',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(255,255,255,0.4)',
          }}
        >
          {/* Classical Letter "L" Monogram */}
          <span 
            className="font-script text-3xl font-bold text-[#422C02] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] leading-none select-none"
            style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.5)' }}
          >
            L
          </span>
          <span className="font-cinzel text-[7px] tracking-widest text-[#422C02] font-semibold uppercase mt-0.5 opacity-85">
            ARCHIVE
          </span>
        </div>
      </div>

      {/* Date Seal Tag */}
      {date && (
        <div className="mt-2 px-2.5 py-0.5 rounded bg-[#2A241A] border border-[#D4AF37]/40 text-[#D4AF37] font-cinzel text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          <span>SEALED {date}</span>
        </div>
      )}

      {interactive && onBreakSeal && (
        <button
          onClick={onBreakSeal}
          title="Break seal to resume editing"
          className="mt-1.5 text-[11px] font-classic text-[#8C6A2A] hover:text-[#D4AF37] underline transition-colors cursor-pointer"
        >
          Break seal to edit
        </button>
      )}
    </motion.div>
  );
};
