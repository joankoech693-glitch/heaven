import React, { useState } from 'react';
import { 
  Scroll, 
  PanelLeft, 
  PanelRight, 
  Type, 
  FileCheck, 
  Sparkles, 
  Stamp, 
  Keyboard, 
  Palette, 
  Check, 
  ChevronDown,
  Layers,
  Lock,
  Unlock
} from 'lucide-react';
import { Letter, FontOption, PaperTexture, AmbientSound } from '../types';
import { AmbientAudioControl } from './AmbientAudioControl';

interface HeaderProps {
  letter: Letter;
  onUpdateLetter: (updated: Partial<Letter>) => void;
  isArchiveOpen: boolean;
  onToggleArchive: () => void;
  isMarginaliaOpen: boolean;
  onToggleMarginalia: () => void;
  onSealLetter: () => void;
  onBreakSeal: () => void;
  currentTrack: AmbientSound;
  onTrackChange: (track: AmbientSound) => void;
}

export const Header: React.FC<HeaderProps> = ({
  letter,
  onUpdateLetter,
  isArchiveOpen,
  onToggleArchive,
  isMarginaliaOpen,
  onToggleMarginalia,
  onSealLetter,
  onBreakSeal,
  currentTrack,
  onTrackChange,
}) => {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showTextureMenu, setShowTextureMenu] = useState(false);

  const fonts: { id: FontOption; name: string; sample: string }[] = [
    { id: 'serif', name: 'Classic Serif', sample: 'Traditional novel framework' },
    { id: 'script', name: 'Elegant Script', sample: 'Cursive display calligraphy' },
    { id: 'mono', name: 'Mechanical Monospace', sample: 'Typewriter precision alignment' },
  ];

  const textures: { id: PaperTexture; name: string; desc: string }[] = [
    { id: 'lined', name: 'Lined Journal Paper', desc: 'Ruled notebook guide lines' },
    { id: 'vellum', name: 'Blank Heavy Cotton Vellum', desc: 'Smooth archival cream finish' },
    { id: 'torn', name: 'Torn Border Stationery', desc: 'Aged antique deckled edge' },
  ];

  return (
    <header className="w-full bg-[#161616] border-b border-[#D4AF37]/35 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 shadow-xl z-40 select-none">
      {/* Left: Sidebar Toggle & Brand Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="toggle-archive-button"
          onClick={onToggleArchive}
          className={`p-2 rounded border transition-all cursor-pointer ${
            isArchiveOpen
              ? 'bg-[#292215] border-[#D4AF37] text-[#D4AF37]'
              : 'border-neutral-700 text-neutral-400 hover:border-[#D4AF37]/60 hover:text-[#D4AF37]'
          }`}
          title={isArchiveOpen ? 'Hide Archive' : 'Open Archive'}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E2C366] via-[#D4AF37] to-[#8C6207] p-[1px] shadow-[0_0_12px_rgba(212,175,55,0.3)]">
            <div className="w-full h-full bg-[#181818] rounded flex items-center justify-center">
              <span className="font-script text-xl text-[#D4AF37] font-bold leading-none">
                L
              </span>
            </div>
          </div>
          <div>
            <h1 className="font-cinzel text-base sm:text-lg font-bold tracking-widest text-[#D4AF37] uppercase leading-none">
              Letters
            </h1>
            <span className="text-[9px] font-classic text-neutral-400 tracking-wider hidden sm:block">
              Writing Sanctuary
            </span>
          </div>
        </div>
      </div>

      {/* Center / Controls: Vintage Customization */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
        {/* Font Selector Dropdown */}
        <div className="relative">
          <button
            id="font-selector-button"
            onClick={() => {
              setShowFontMenu(!showFontMenu);
              setShowTextureMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1C1C1C] border border-neutral-700 hover:border-[#D4AF37]/60 text-xs font-cinzel text-[#E6DEC9] transition-all cursor-pointer"
            title="Font Typography"
          >
            <Type className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden md:inline font-medium">
              {fonts.find((f) => f.id === letter.font)?.name || 'Classic Serif'}
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {showFontMenu && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 rounded-lg bg-[#141414] border border-[#D4AF37]/50 shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="text-[10px] font-cinzel text-[#D4AF37] uppercase tracking-wider px-2 py-1 mb-1 border-b border-neutral-800">
                Manuscript Typography
              </div>
              {fonts.map((f) => {
                const isSelected = letter.font === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      onUpdateLetter({ font: f.id });
                      setShowFontMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded mb-1 flex items-start justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#292215] border border-[#D4AF37]/50 text-[#D4AF37]'
                        : 'hover:bg-[#202020] text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{f.name}</div>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">{f.sample}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Paper Texture Dropdown */}
        <div className="relative">
          <button
            id="texture-selector-button"
            onClick={() => {
              setShowTextureMenu(!showTextureMenu);
              setShowFontMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1C1C1C] border border-neutral-700 hover:border-[#D4AF37]/60 text-xs font-cinzel text-[#E6DEC9] transition-all cursor-pointer"
            title="Paper Canvas Texture"
          >
            <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden md:inline font-medium">
              {textures.find((t) => t.id === letter.texture)?.name || 'Vellum'}
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {showTextureMenu && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 rounded-lg bg-[#141414] border border-[#D4AF37]/50 shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="text-[10px] font-cinzel text-[#D4AF37] uppercase tracking-wider px-2 py-1 mb-1 border-b border-neutral-800">
                Paper Stationery
              </div>
              {textures.map((t) => {
                const isSelected = letter.texture === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onUpdateLetter({ texture: t.id });
                      setShowTextureMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded mb-1 flex items-start justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#292215] border border-[#D4AF37]/50 text-[#D4AF37]'
                        : 'hover:bg-[#202020] text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{t.name}</div>
                      <div className="text-[10px] text-neutral-400 font-sans mt-0.5">{t.desc}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Typewriter Mode Toggle */}
        <button
          id="toggle-typewriter-mode"
          onClick={() => onUpdateLetter({ isTypewriterMode: !letter.isTypewriterMode })}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-all text-xs font-cinzel cursor-pointer ${
            letter.isTypewriterMode
              ? 'bg-[#292215] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
              : 'bg-[#1C1C1C] border-neutral-700 text-neutral-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
          }`}
          title="Toggle Typewriter Monospace Alignment"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Typewriter Mode</span>
        </button>

        {/* Drop Caps Toggle */}
        <button
          id="toggle-dropcaps"
          onClick={() => onUpdateLetter({ hasDropCap: !letter.hasDropCap })}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-all text-xs font-cinzel cursor-pointer ${
            letter.hasDropCap
              ? 'bg-[#292215] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
              : 'bg-[#1C1C1C] border-neutral-700 text-neutral-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
          }`}
          title="Toggle Golden Decorative Drop Cap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Drop Cap</span>
        </button>
      </div>

      {/* Right: Audio, Marginalia & Wax Seal Export */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ambient Audio */}
        <AmbientAudioControl
          currentTrack={currentTrack}
          onTrackChange={onTrackChange}
        />

        {/* Marginalia Toggle */}
        <button
          id="toggle-marginalia-button"
          onClick={onToggleMarginalia}
          className={`p-2 rounded border transition-all cursor-pointer ${
            isMarginaliaOpen
              ? 'bg-[#292215] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
              : 'bg-[#1C1C1C] border-neutral-700 text-neutral-400 hover:border-[#D4AF37]/60 hover:text-[#D4AF37]'
          }`}
          title={isMarginaliaOpen ? 'Close Marginalia' : "Open Editor's Marginalia"}
        >
          <PanelRight className="w-4 h-4" />
        </button>

        {/* Prominent Gold Button: Seal Letter / Break Seal */}
        {letter.isSealed ? (
          <button
            id="break-seal-header-button"
            onClick={onBreakSeal}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded bg-[#292215] border border-[#D4AF37] text-[#D4AF37] font-cinzel font-bold text-xs tracking-wider shadow-[0_0_12px_rgba(212,175,55,0.25)] hover:bg-[#342a18] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title="Break golden wax seal to resume editing manuscript"
          >
            <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Break Seal</span>
          </button>
        ) : (
          <button
            id="seal-letter-button"
            onClick={onSealLetter}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded bg-gradient-to-r from-[#C49B27] via-[#D4AF37] to-[#B38B1C] text-[#1A1A1A] font-cinzel font-bold text-xs tracking-wider shadow-[0_0_16px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title="Stamp golden wax seal and lock manuscript from editing"
          >
            <Stamp className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Seal Letter</span>
          </button>
        )}
      </div>
    </header>
  );
};
