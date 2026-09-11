import React, { useRef, useEffect } from 'react';
import { Letter, LetterCategory, FontOption, PaperTexture } from '../types';
import { WaxSeal } from './WaxSeal';
import { audioAtmosphere } from '../utils/audio';
import { Lock, Sparkles, Feather, FileText, Calendar, UserCheck } from 'lucide-react';

interface WritingDeskProps {
  letter: Letter;
  onChange: (updated: Partial<Letter>) => void;
  onBreakSeal: () => void;
}

export const WritingDesk: React.FC<WritingDeskProps> = ({
  letter,
  onChange,
  onBreakSeal,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastKeyTime = useRef<number>(0);

  // Auto-resize textarea to fit content smoothly without internal scrollbar
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(380, textareaRef.current.scrollHeight)}px`;
    }
  }, [letter.body, letter.font, letter.isTypewriterMode]);

  // Handle typing sounds
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (letter.isSealed) return;
    const now = Date.now();
    if (now - lastKeyTime.current > 60) {
      lastKeyTime.current = now;
      if (letter.isTypewriterMode || letter.font === 'mono') {
        audioAtmosphere.playTypewriterClack();
      } else if (letter.font === 'script') {
        audioAtmosphere.playQuillScratch();
      }
    }
  };

  // Font CSS class
  const getFontClass = () => {
    if (letter.isTypewriterMode || letter.font === 'mono') {
      return 'font-mono-mech';
    }
    if (letter.font === 'script') {
      return 'font-script';
    }
    return 'font-classic';
  };

  // Paper Texture CSS class
  const getTextureClass = () => {
    if (letter.texture === 'lined') return 'paper-lined';
    if (letter.texture === 'torn') return 'paper-torn';
    return 'paper-vellum';
  };

  // Compute words and reading stats
  const wordCount = letter.body.trim() ? letter.body.trim().split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 180));

  // Extract first letter for drop cap
  const trimmedBody = letter.body.trim();
  const firstLetter = trimmedBody.charAt(0);
  const restOfBody = trimmedBody.slice(1);

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto px-3 sm:px-6 py-8 relative min-h-screen">
      {/* Sealed Banner Warning if Locked */}
      {letter.isSealed && (
        <div className="mb-4 px-4 py-2 rounded-full bg-[#272115] border border-[#D4AF37] text-[#D4AF37] font-cinzel text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <Lock className="w-3.5 h-3.5" />
          <span>Folio Sealed with Golden Wax — Editing Restricted</span>
          <button
            onClick={onBreakSeal}
            className="ml-2 underline font-semibold hover:text-[#F3E5AB] cursor-pointer"
          >
            Break Seal to Edit
          </button>
        </div>
      )}

      {/* Main Isolated Sheet of Paper */}
      <div
        id="letter-paper-canvas"
        className={`relative w-full max-w-3xl transition-all duration-300 rounded-sm p-8 sm:p-14 text-[#262016] ${getTextureClass()} ${
          letter.isTypewriterMode ? 'typewriter-lines' : ''
        }`}
        style={{
          minHeight: '840px',
        }}
      >
        {/* Subtle Ornamental Top Filigree Border */}
        <div className="w-full flex items-center justify-center mb-8 select-none opacity-40">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#8B734B] to-transparent" />
          <div className="mx-4 text-[#8B734B] font-cinzel text-xs tracking-widest uppercase flex items-center gap-1.5">
            <span>✦</span>
            <span>{letter.category}</span>
            <span>✦</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#8B734B] to-transparent" />
        </div>

        {/* Paper Header: Recipient & Date / Location */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-4 border-b border-[#8B734B]/20">
          {/* Recipient Input */}
          <div className="flex-1">
            <label className="block text-[10px] font-cinzel text-[#7C6645] uppercase tracking-wider mb-0.5 select-none">
              Salutation
            </label>
            {letter.isSealed ? (
              <div className={`text-xl sm:text-2xl font-bold text-[#1F1911] ${getFontClass()}`}>
                {letter.recipient ? `Dearest ${letter.recipient},` : 'Dearest,'}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className={`text-lg sm:text-xl font-bold text-[#4A3D29] ${getFontClass()} select-none`}>
                  Dearest
                </span>
                <input
                  id="recipient-input"
                  type="text"
                  value={letter.recipient}
                  disabled={letter.isSealed}
                  onChange={(e) => onChange({ recipient: e.target.value })}
                  placeholder="[Recipient Name]"
                  className={`flex-1 bg-transparent border-b border-dashed border-[#8B734B]/40 focus:border-[#D4AF37] focus:outline-none text-lg sm:text-xl font-bold text-[#1F1911] placeholder-[#8B734B]/40 ${getFontClass()}`}
                />
                <span className={`text-lg sm:text-xl font-bold text-[#4A3D29] ${getFontClass()} select-none`}>
                  ,
                </span>
              </div>
            )}
          </div>

          {/* Date & Location Input */}
          <div className="sm:text-right flex-shrink-0">
            <label className="block text-[10px] font-cinzel text-[#7C6645] uppercase tracking-wider mb-0.5 select-none">
              Date & Location
            </label>
            {letter.isSealed ? (
              <div className={`text-sm sm:text-base italic text-[#4A3D29] ${getFontClass()}`}>
                {letter.dateLocation || 'Undated Folio'}
              </div>
            ) : (
              <input
                id="datelocation-input"
                type="text"
                value={letter.dateLocation}
                disabled={letter.isSealed}
                onChange={(e) => onChange({ dateLocation: e.target.value })}
                placeholder="Paris, 14th of October 1888"
                className={`bg-transparent border-b border-dashed border-[#8B734B]/40 focus:border-[#D4AF37] focus:outline-none text-sm sm:text-base italic text-[#4A3D29] placeholder-[#8B734B]/40 sm:text-right ${getFontClass()}`}
              />
            )}
          </div>
        </div>

        {/* Paper Body Area */}
        <div className="relative mb-12 min-h-[360px]">
          {/* If Drop Cap is enabled and letter is sealed or displayed */}
          {letter.isSealed ? (
            <div className={`text-base sm:text-lg text-[#1F1911] leading-relaxed whitespace-pre-line ${getFontClass()}`}>
              {letter.hasDropCap && firstLetter ? (
                <div>
                  <span
                    className="float-left font-cinzel font-bold text-5xl sm:text-6xl text-[#D4AF37] mr-3 mt-1 leading-none select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
                    style={{
                      fontFamily: letter.font === 'script' ? 'Pinyon Script, cursive' : 'Cinzel, Georgia, serif',
                    }}
                  >
                    {firstLetter}
                  </span>
                  <span>{restOfBody}</span>
                </div>
              ) : (
                letter.body || 'No text written in this folio yet.'
              )}
            </div>
          ) : (
            <div className="relative">
              {/* Drop Cap Indicator if Active in Edit Mode */}
              {letter.hasDropCap && firstLetter && (
                <div 
                  className="absolute -left-1 -top-1 pointer-events-none select-none z-10"
                  title="Drop Cap Active"
                >
                  <span 
                    className="float-left font-cinzel font-bold text-4xl sm:text-5xl text-[#D4AF37] mr-3 mt-0 leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] opacity-90"
                    style={{
                      fontFamily: letter.font === 'script' ? 'Pinyon Script, cursive' : 'Cinzel, Georgia, serif',
                    }}
                  >
                    {firstLetter}
                  </span>
                </div>
              )}

              <textarea
                ref={textareaRef}
                id="letter-body-textarea"
                disabled={letter.isSealed}
                value={letter.body}
                onKeyDown={handleKeyDown}
                onChange={(e) => onChange({ body: e.target.value })}
                placeholder="Begin penning your manuscript here... Write with the unhurried grace of the Victorian epistolary masters."
                className={`w-full bg-transparent border-none focus:outline-none focus:ring-0 text-base sm:text-lg text-[#1F1911] leading-relaxed placeholder-[#8B734B]/40 resize-none overflow-hidden ${getFontClass()} ${
                  letter.hasDropCap && firstLetter ? 'indent-10' : ''
                }`}
                style={{
                  minHeight: '380px',
                }}
              />
            </div>
          )}
        </div>

        {/* Paper Footer: Signature & Wax Seal */}
        <div className="mt-8 pt-6 border-t border-[#8B734B]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Signature Box */}
          <div className="flex-1 max-w-sm">
            <label className="block text-[10px] font-cinzel text-[#7C6645] uppercase tracking-wider mb-1 select-none">
              Signatory
            </label>
            {letter.isSealed ? (
              <div className={`text-xl sm:text-2xl font-bold text-[#1F1911] italic ${getFontClass()}`}>
                {letter.sender || 'From: Anonymous'}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className={`text-base sm:text-lg font-semibold text-[#4A3D29] ${getFontClass()} select-none`}>
                  From:
                </span>
                <input
                  id="sender-input"
                  type="text"
                  value={letter.sender.replace(/^From:\s*/i, '')}
                  disabled={letter.isSealed}
                  onChange={(e) => onChange({ sender: `From: ${e.target.value}` })}
                  placeholder="[Character Name]"
                  className={`flex-1 bg-transparent border-b border-dashed border-[#8B734B]/40 focus:border-[#D4AF37] focus:outline-none text-base sm:text-lg font-bold text-[#1F1911] placeholder-[#8B734B]/40 ${getFontClass()}`}
                />
              </div>
            )}
          </div>

          {/* Golden Wax Seal Placement */}
          <div className="flex-shrink-0 flex items-center justify-center">
            {letter.isSealed ? (
              <WaxSeal
                isSealed={true}
                date={letter.sealedDate || new Date().toISOString().split('T')[0]}
                onBreakSeal={onBreakSeal}
                interactive={true}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3 border border-dashed border-[#8B734B]/30 rounded-full w-24 h-24 opacity-40 select-none">
                <span className="font-cinzel text-[9px] text-[#7C6645] uppercase tracking-wider text-center">
                  Wax Seal Location
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Subtle Watermark at bottom */}
        <div className="mt-8 text-center text-[10px] font-cinzel text-[#8B734B]/50 tracking-widest uppercase select-none">
          Letters Archive • Registered Epistolary Folio No. {letter.id.slice(-6).toUpperCase()}
        </div>
      </div>

      {/* Desk Stats Footer */}
      <div className="mt-6 flex items-center gap-4 text-xs font-cinzel text-neutral-400 select-none">
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{wordCount} Words</span>
        </span>
        <span>•</span>
        <span>{readingMinutes} min read</span>
        <span>•</span>
        <span className="text-[#D4AF37] capitalize font-medium">
          {letter.font === 'script' ? 'Elegant Script' : letter.font === 'mono' ? 'Mechanical Monospace' : 'Classic Serif'}
        </span>
      </div>
    </div>
  );
};
