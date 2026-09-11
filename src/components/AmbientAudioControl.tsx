import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Feather, Keyboard, Music, ChevronDown } from 'lucide-react';
import { AmbientSound } from '../types';
import { audioAtmosphere } from '../utils/audio';

interface AmbientAudioControlProps {
  currentTrack: AmbientSound;
  onTrackChange: (track: AmbientSound) => void;
}

export const AmbientAudioControl: React.FC<AmbientAudioControlProps> = ({
  currentTrack,
  onTrackChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);

  const handleSelectTrack = (track: AmbientSound) => {
    if (currentTrack === track) {
      audioAtmosphere.stopCurrent();
      onTrackChange('none');
    } else {
      audioAtmosphere.setTrack(track);
      onTrackChange(track);
    }
  };

  const handleMuteToggle = () => {
    const muted = audioAtmosphere.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    audioAtmosphere.setVolume(val / 100);
  };

  const trackLabels: Record<AmbientSound, { name: string; desc: string; icon: React.ReactNode }> = {
    typewriter: {
      name: 'Mechanical Typewriter',
      desc: 'Authentic keypress clicks & carriage rhythms',
      icon: <Keyboard className="w-4 h-4 text-[#D4AF37]" />,
    },
    rain: {
      name: 'Rain on Windowpane',
      desc: 'Gentle raindrops falling upon glass panes',
      icon: <CloudRain className="w-4 h-4 text-[#D4AF37]" />,
    },
    quill: {
      name: 'Scratchy Quill Pen',
      desc: 'Rhythmic nib friction against textured vellum',
      icon: <Feather className="w-4 h-4 text-[#D4AF37]" />,
    },
    none: {
      name: 'Silent Sanctuary',
      desc: 'Pure distraction-free quietude',
      icon: <Music className="w-4 h-4 text-neutral-400" />,
    },
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        id="ambient-audio-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all text-xs font-cinzel cursor-pointer ${
          currentTrack !== 'none'
            ? 'bg-[#2A241A] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
            : 'bg-[#181818] border-neutral-700 text-neutral-300 hover:border-[#D4AF37]/60 hover:text-[#D4AF37]'
        }`}
        title="Ambient Focus Sounds"
      >
        <div className="flex items-center gap-1.5">
          {currentTrack !== 'none' ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
            </span>
          ) : null}
          {trackLabels[currentTrack].icon}
        </div>
        <span className="hidden sm:inline font-medium">
          {currentTrack === 'none' ? 'Ambient Audio' : trackLabels[currentTrack].name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-72 rounded-lg bg-[#141414] border border-[#D4AF37]/50 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
            <span className="font-cinzel text-xs text-[#D4AF37] tracking-wider uppercase font-semibold">
              Atmospheric Soundscape
            </span>
            <button
              onClick={handleMuteToggle}
              className="p-1 rounded text-neutral-400 hover:text-[#D4AF37] transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Track Options */}
          <div className="space-y-1.5">
            {(['typewriter', 'rain', 'quill', 'none'] as AmbientSound[]).map((track) => {
              const active = currentTrack === track;
              const info = trackLabels[track];
              return (
                <button
                  key={track}
                  onClick={() => handleSelectTrack(track)}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-md text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-[#2B2314] border border-[#D4AF37]/60 text-[#F5E5C0]'
                      : 'hover:bg-[#202020] text-neutral-300 border border-transparent'
                  }`}
                >
                  <div className="mt-0.5">{info.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className={`text-xs font-classic font-semibold ${active ? 'text-[#D4AF37]' : 'text-neutral-200'}`}>
                        {info.name}
                      </div>
                      {active && (
                        <span className="text-[10px] text-[#D4AF37] font-cinzel uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-tight mt-0.5">
                      {info.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-cinzel mb-1">
              <span>Volume</span>
              <span>{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeSlider}
              className="w-full accent-[#D4AF37] bg-neutral-700 h-1 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
