/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Letter, LetterCategory, AmbientSound, Critique } from './types';
import { INITIAL_LETTERS } from './data/initialLetters';
import { Header } from './components/Header';
import { ArchiveSidebar } from './components/ArchiveSidebar';
import { WritingDesk } from './components/WritingDesk';
import { MarginaliaPanel } from './components/MarginaliaPanel';
import { CritiquesFeed } from './components/CritiquesFeed';
import { audioAtmosphere } from './utils/audio';
import { Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY_LETTERS = 'letters_sanctuary_foliosafe_v1';
const STORAGE_KEY_ACTIVE_ID = 'letters_sanctuary_active_id_v1';

export default function App() {
  // Load letters from localStorage or fallback to initial letters
  const [letters, setLetters] = useState<Letter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LETTERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading letters from localStorage:', e);
    }
    return INITIAL_LETTERS;
  });

  // Active letter ID
  const [activeLetterId, setActiveLetterId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (savedId && letters.some((l) => l.id === savedId)) {
        return savedId;
      }
    } catch {
      // ignore
    }
    return letters[0]?.id || 'letter-literature-1';
  });

  // Sidebar visibility states
  const [isArchiveOpen, setIsArchiveOpen] = useState(true);
  const [isMarginaliaOpen, setIsMarginaliaOpen] = useState(false);

  // Audio track state
  const [currentTrack, setCurrentTrack] = useState<AmbientSound>('none');

  // Seal toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find currently active letter
  const activeLetter = letters.find((l) => l.id === activeLetterId) || letters[0];

  // Autosave to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(letters));
      if (activeLetterId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeLetterId);
      }
    } catch (err) {
      console.error('Autosave failed:', err);
    }
  }, [letters, activeLetterId]);

  // Handle letter updates
  const handleUpdateLetter = (updatedFields: Partial<Letter>) => {
    setLetters((prev) =>
      prev.map((l) => {
        if (l.id === activeLetterId) {
          const updated = {
            ...l,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
          // Auto-derive title if untitled or empty
          if (updatedFields.recipient && (!l.title || l.title.startsWith('Correspondence to'))) {
            updated.title = `Correspondence to ${updatedFields.recipient}`;
          }
          return updated;
        }
        return l;
      })
    );
  };

  // Create new letter
  const handleNewLetter = (category: LetterCategory) => {
    const newId = `letter-${Date.now()}`;
    const newLetter: Letter = {
      id: newId,
      title: `Draft in ${category}`,
      category,
      recipient: '',
      dateLocation: `${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      body: '',
      sender: 'From: ',
      font: 'serif',
      texture: 'vellum',
      isTypewriterMode: false,
      hasDropCap: true,
      isSealed: false,
      marginalia: '',
      critiques: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLetters((prev) => [newLetter, ...prev]);
    setActiveLetterId(newId);
    setToastMessage(`New ${category} folio prepared on the desk.`);
  };

  // Duplicate letter
  const handleDuplicateLetter = (letterToCopy: Letter) => {
    const newId = `letter-${Date.now()}`;
    const copy: Letter = {
      ...letterToCopy,
      id: newId,
      title: `${letterToCopy.title} (Copy)`,
      isSealed: false,
      sealedDate: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLetters((prev) => [copy, ...prev]);
    setActiveLetterId(newId);
    setToastMessage(`Folio duplicated into "${copy.title}".`);
  };

  // Delete letter
  const handleDeleteLetter = (id: string) => {
    setLetters((prev) => {
      const remaining = prev.filter((l) => l.id !== id);
      if (remaining.length === 0) {
        return INITIAL_LETTERS;
      }
      if (activeLetterId === id) {
        setActiveLetterId(remaining[0].id);
      }
      return remaining;
    });
    setToastMessage('Folio removed from the archive.');
  };

  // Seal manuscript with golden wax seal
  const handleSealLetter = () => {
    if (!activeLetter) return;

    // Lock letter and stamp wax seal
    const today = new Date().toISOString().split('T')[0];
    handleUpdateLetter({
      isSealed: true,
      sealedDate: today,
    });

    // Play tactile sound
    audioAtmosphere.playTypewriterClack();
    setToastMessage('Golden wax seal stamped. Manuscript sealed and locked.');
  };

  // Break seal to re-enable editing
  const handleBreakSeal = () => {
    handleUpdateLetter({
      isSealed: false,
    });
    setToastMessage('Seal broken. Workspace unlocked for manuscript revision.');
  };

  // Public Critique Like Toggle
  const handleToggleLike = (critiqueId: string) => {
    if (!activeLetter) return;
    const updatedCritiques = activeLetter.critiques.map((c) => {
      if (c.id === critiqueId) {
        const isLiked = !c.isLiked;
        return {
          ...c,
          isLiked,
          likes: isLiked ? c.likes + 1 : c.likes - 1,
        };
      }
      return c;
    });
    handleUpdateLetter({ critiques: updatedCritiques });
  };

  // Public Critique Add
  const handleAddCritique = (author: string, role: string, content: string) => {
    if (!activeLetter) return;
    const newCritique: Critique = {
      id: `critique-${Date.now()}`,
      author,
      role,
      avatarColor: ['#734E2F', '#8E4A49', '#3A506B', '#2B4C3F', '#6B3A50', '#5C3875'][
        Math.floor(Math.random() * 6)
      ],
      content,
      likes: 1,
      isLiked: true,
      timestamp: 'Just now',
    };
    handleUpdateLetter({
      critiques: [newCritique, ...activeLetter.critiques],
    });
    setToastMessage('Appraisal recorded in the public salon feed.');
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1E1E1E] text-[#E6DEC9] font-classic select-text">
      {/* Top Application Header */}
      <Header
        letter={activeLetter}
        onUpdateLetter={handleUpdateLetter}
        isArchiveOpen={isArchiveOpen}
        onToggleArchive={() => setIsArchiveOpen(!isArchiveOpen)}
        isMarginaliaOpen={isMarginaliaOpen}
        onToggleMarginalia={() => setIsMarginaliaOpen(!isMarginaliaOpen)}
        onSealLetter={handleSealLetter}
        onBreakSeal={handleBreakSeal}
        currentTrack={currentTrack}
        onTrackChange={(track) => setCurrentTrack(track)}
      />

      {/* Main Sanctuary Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: The Archive Sidebar */}
        <ArchiveSidebar
          isOpen={isArchiveOpen}
          onToggle={() => setIsArchiveOpen(false)}
          letters={letters}
          activeLetterId={activeLetterId}
          onSelectLetter={(letter) => setActiveLetterId(letter.id)}
          onNewLetter={handleNewLetter}
          onDeleteLetter={handleDeleteLetter}
          onDuplicateLetter={handleDuplicateLetter}
        />

        {/* Center: Author Workspace (The Writing Desk) */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#1E1E1E]">
          <WritingDesk
            letter={activeLetter}
            onChange={handleUpdateLetter}
            onBreakSeal={handleBreakSeal}
          />

          {/* Public Literary Critiques Feed (Below the main paper canvas) */}
          <CritiquesFeed
            critiques={activeLetter.critiques}
            onToggleLike={handleToggleLike}
            onAddCritique={handleAddCritique}
          />
        </main>

        {/* Right: Editor's Marginalia Panel */}
        <MarginaliaPanel
          isOpen={isMarginaliaOpen}
          onClose={() => setIsMarginaliaOpen(false)}
          marginalia={activeLetter.marginalia}
          onChange={(val) => handleUpdateLetter({ marginalia: val })}
          isSealed={activeLetter.isSealed}
        />
      </div>

      {/* Atmospheric Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#181818] border border-[#D4AF37] text-[#D4AF37] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-cinzel text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-neutral-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
