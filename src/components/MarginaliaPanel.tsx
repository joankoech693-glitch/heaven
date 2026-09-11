import React from 'react';
import { Lock, Feather, BookOpen, AlertCircle, Sparkles, X } from 'lucide-react';

interface MarginaliaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  marginalia: string;
  onChange: (val: string) => void;
  isSealed: boolean;
}

export const MarginaliaPanel: React.FC<MarginaliaPanelProps> = ({
  isOpen,
  onClose,
  marginalia,
  onChange,
  isSealed,
}) => {
  if (!isOpen) return null;

  return (
    <aside 
      id="marginalia-sidebar"
      aria-label="Editor's Marginalia"
      className="w-80 md:w-96 bg-[#161616] border-l border-[#D4AF37]/35 flex flex-col h-full shadow-2xl z-30 transition-all duration-300 select-none flex-shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#D4AF37]/25 bg-[#1B1B1B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2A2315] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <Feather className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm text-[#D4AF37] font-semibold tracking-wide flex items-center gap-1.5">
              Editor's Marginalia
            </h2>
            <p className="text-[10px] text-neutral-400 font-sans">
              Private Author Commentary & Plot Notes
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-neutral-400 hover:text-[#D4AF37] hover:bg-neutral-800 transition-colors"
          title="Close Marginalia"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Confidentiality Notice */}
      <div className="mx-4 mt-3 px-3 py-2 rounded bg-[#221C14] border border-[#D4AF37]/20 flex items-start gap-2">
        <Lock className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-[#E0CEAA] font-classic italic leading-snug">
          Confidential sanctuary: These marginal annotations remain private and strictly preserved for author eyes only.
        </p>
      </div>

      {/* Main Marginalia Editor */}
      <div className="flex-1 p-4 flex flex-col">
        <label htmlFor="marginalia-textarea" className="block text-[11px] font-cinzel text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Draft Notes & Scene Structure</span>
          <span className="text-[10px] text-[#D4AF37]">Autosaved</span>
        </label>
        
        <div className="relative flex-1 flex flex-col">
          <textarea
            id="marginalia-textarea"
            disabled={isSealed}
            value={marginalia}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Record character motivations, foreshadowing, historical citations, or critical self-reflections..."
            className="w-full flex-1 p-3.5 rounded bg-[#1C1C1C] border border-neutral-700/80 text-[#E6DEC9] font-classic text-sm leading-relaxed focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 resize-none transition-colors selection:bg-[#D4AF37]/30"
          />
        </div>

        {/* Marginalia writing tips / Prompts */}
        <div className="mt-3 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 font-sans space-y-1.5">
          <div className="flex items-center gap-1.5 text-neutral-300 font-cinzel text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Epistolary Craft Checks:</span>
          </div>
          <p className="text-neutral-400 text-xs italic">
            • Does the cadence reflect the sender's social standing?
          </p>
          <p className="text-neutral-400 text-xs italic">
            • Is the temporal location established within the opening stanza?
          </p>
          <p className="text-neutral-400 text-xs italic">
            • What subtext remains unspoken between the lines?
          </p>
        </div>
      </div>
    </aside>
  );
};
