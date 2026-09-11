import React, { useState } from 'react';
import { 
  BookMarked, 
  Folder, 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  ChevronLeft, 
  ChevronRight, 
  Scroll, 
  Lock, 
  Sparkles,
  Heart,
  FileText,
  Landmark,
  Feather
} from 'lucide-react';
import { Letter, LetterCategory } from '../types';

interface ArchiveSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  letters: Letter[];
  activeLetterId: string;
  onSelectLetter: (letter: Letter) => void;
  onNewLetter: (category: LetterCategory) => void;
  onDeleteLetter: (id: string) => void;
  onDuplicateLetter: (letter: Letter) => void;
}

export const ArchiveSidebar: React.FC<ArchiveSidebarProps> = ({
  isOpen,
  onToggle,
  letters,
  activeLetterId,
  onSelectLetter,
  onNewLetter,
  onDeleteLetter,
  onDuplicateLetter,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<LetterCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newLetterCategory, setNewLetterCategory] = useState<LetterCategory>('Literature');

  const categories: { name: LetterCategory; icon: React.ReactNode; color: string }[] = [
    { name: 'Literature', icon: <BookMarked className="w-4 h-4" />, color: '#B38B4D' },
    { name: 'Politics', icon: <Landmark className="w-4 h-4" />, color: '#7E9F8E' },
    { name: 'Poetry', icon: <Feather className="w-4 h-4" />, color: '#A084B7' },
    { name: 'Romance', icon: <Heart className="w-4 h-4" />, color: '#C06C84' },
  ];

  const filteredLetters = letters.filter((letter) => {
    const matchesCategory = selectedFolder === 'All' || letter.category === selectedFolder;
    const matchesSearch = 
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (cat: LetterCategory) => {
    return letters.filter((l) => l.category === cat).length;
  };

  return (
    <>
      {/* Sidebar Container */}
      <aside 
        id="archive-sidebar"
        aria-label="The Archive"
        className={`bg-[#161616] border-r border-[#D4AF37]/35 flex flex-col h-full shadow-2xl transition-all duration-300 z-30 flex-shrink-0 ${
          isOpen ? 'w-72 md:w-80' : 'w-0 overflow-hidden border-r-0'
        }`}
      >
        {/* Archive Title & Actions */}
        <div className="p-4 border-b border-[#D4AF37]/25 bg-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#272115] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-sm">
              <Scroll className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-sm tracking-widest text-[#D4AF37] uppercase">
                The Archive
              </h2>
              <p className="text-[10px] text-neutral-400 font-sans tracking-wide">
                {letters.length} Literary Folios Preserved
              </p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1 rounded text-neutral-400 hover:text-[#D4AF37] hover:bg-neutral-800 transition-colors"
            title="Collapse Archive"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* New Letter CTA */}
        <div className="p-3 border-b border-neutral-800/80">
          <button
            id="new-letter-button"
            onClick={() => setShowNewModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-gradient-to-r from-[#C49B27] via-[#D4AF37] to-[#B38B1C] text-[#1E1E1E] font-cinzel font-bold text-xs tracking-wider shadow-md hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Pen New Letter</span>
          </button>
        </div>

        {/* Categories Folders */}
        <div className="p-3 border-b border-neutral-800/80">
          <div className="text-[10px] font-cinzel text-neutral-400 uppercase tracking-widest mb-2 px-1">
            Archival Folders
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setSelectedFolder('All')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-all cursor-pointer ${
                selectedFolder === 'All'
                  ? 'bg-[#2B2314] text-[#D4AF37] border border-[#D4AF37]/50 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#202020]'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Folder className="w-3.5 h-3.5" />
                <span className="font-classic text-xs">All Folios</span>
              </div>
              <span className="text-[10px] opacity-75 font-mono">{letters.length}</span>
            </button>

            {categories.map((cat) => {
              const count = getCategoryCount(cat.name);
              const isSelected = selectedFolder === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedFolder(cat.name)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2B2314] text-[#D4AF37] border border-[#D4AF37]/50 font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#202020]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#D4AF37]">{cat.icon}</span>
                    <span className="font-classic text-xs truncate">{cat.name}</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Letters */}
        <div className="p-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search correspondence..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#1F1F1F] border border-neutral-700/80 rounded text-xs text-[#E6DEC9] placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        {/* Letters List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5">
          {filteredLetters.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Scroll className="w-8 h-8 mx-auto text-neutral-600 mb-2 opacity-50" />
              <p className="text-xs font-classic text-neutral-400">
                No archived letters found in this folder.
              </p>
              <button
                onClick={() => onNewLetter(selectedFolder === 'All' ? 'Literature' : selectedFolder)}
                className="mt-3 text-xs text-[#D4AF37] underline font-cinzel hover:text-[#F3E5AB]"
              >
                Begin writing now
              </button>
            </div>
          ) : (
            filteredLetters.map((letter) => {
              const isActive = letter.id === activeLetterId;
              return (
                <div
                  key={letter.id}
                  onClick={() => onSelectLetter(letter)}
                  className={`group relative p-2.5 rounded border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#272115] border-[#D4AF37] text-[#FFF] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                      : 'bg-[#1C1C1C] border-neutral-800/90 text-neutral-300 hover:border-neutral-700 hover:bg-[#222222]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className={`font-classic text-sm font-semibold truncate ${isActive ? 'text-[#F5E5C0]' : 'text-neutral-200'}`}>
                      {letter.title || 'Untitled Letter'}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {letter.isSealed && (
                        <span title="Wax Sealed Document">
                          <Lock className="w-3 h-3 text-[#D4AF37]" />
                        </span>
                      )}
                      <span className="text-[9px] font-cinzel px-1.5 py-0.2 rounded bg-black/40 text-[#D4AF37] border border-[#D4AF37]/25">
                        {letter.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 font-sans truncate mb-1">
                    {letter.recipient ? `To: ${letter.recipient}` : 'No recipient designated'}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-neutral-500">
                    <span className="font-mono text-[9px] truncate">
                      {letter.dateLocation || new Date(letter.updatedAt).toLocaleDateString()}
                    </span>

                    {/* Quick action icons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateLetter(letter);
                        }}
                        title="Duplicate Letter"
                        className="p-1 hover:text-[#D4AF37] transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Archive Notice: Permanently remove "${letter.title}"?`)) {
                            onDeleteLetter(letter.id);
                          }
                        }}
                        title="Delete from Archive"
                        className="p-1 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* New Letter Category Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#181818] border border-[#D4AF37] rounded-lg w-full max-w-sm p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-3">
              <Scroll className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-cinzel text-base font-bold text-[#D4AF37]">
                Commence New Manuscript
              </h3>
            </div>
            <p className="text-xs text-neutral-300 font-classic mb-4 leading-relaxed">
              Designate the literary category for your next correspondence to ensure archival order:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setNewLetterCategory(cat.name)}
                  className={`flex items-center gap-2 p-2.5 rounded border text-left transition-all cursor-pointer ${
                    newLetterCategory === cat.name
                      ? 'bg-[#292215] border-[#D4AF37] text-[#D4AF37] font-semibold'
                      : 'bg-[#202020] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-[#D4AF37]">{cat.icon}</span>
                  <span className="font-classic text-sm">{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 rounded border border-neutral-700 text-xs text-neutral-400 hover:text-neutral-200 font-cinzel cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onNewLetter(newLetterCategory);
                  setShowNewModal(false);
                }}
                className="px-4 py-1.5 rounded bg-gradient-to-r from-[#C49B27] to-[#D4AF37] text-[#1A1A1A] font-cinzel font-bold text-xs tracking-wider shadow-md hover:brightness-110 cursor-pointer"
              >
                Begin Manuscript
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
