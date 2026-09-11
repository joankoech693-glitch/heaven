import React, { useState } from 'react';
import { Heart, MessageSquare, Send, Sparkles, User, Award } from 'lucide-react';
import { Critique } from '../types';

interface CritiquesFeedProps {
  critiques: Critique[];
  onToggleLike: (critiqueId: string) => void;
  onAddCritique: (author: string, role: string, content: string) => void;
}

export const CritiquesFeed: React.FC<CritiquesFeedProps> = ({
  critiques,
  onToggleLike,
  onAddCritique,
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Salon Correspondent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddCritique(
      authorName.trim() || 'Anonymous Reader',
      authorRole,
      commentText.trim()
    );
    setCommentText('');
  };

  return (
    <section 
      id="public-critiques-feed"
      aria-label="Public Literary Critiques"
      className="w-full max-w-4xl mx-auto mt-12 mb-16 p-6 rounded-xl bg-[#181818]/90 border border-[#D4AF37]/35 shadow-2xl"
    >
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D4AF37]/25 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#272115] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cinzel text-base font-bold text-[#D4AF37] tracking-wider uppercase">
              Public Literary Critiques & Salon Feed
            </h3>
            <p className="text-xs text-neutral-400 font-classic">
              Discourse and appraisals from mock contemporaries & literary reviewers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#252015] border border-[#D4AF37]/30 text-[11px] font-cinzel text-[#D4AF37]">
            {critiques.length} Reflections
          </span>
        </div>
      </div>

      {/* Critiques List */}
      <div className="my-5 space-y-3.5">
        {critiques.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 font-classic italic">
            No public critiques have been entered yet. Be the first to append your thoughts to the salon folio.
          </div>
        ) : (
          critiques.map((critique) => (
            <div
              key={critique.id}
              className="p-4 rounded-lg bg-[#1D1D1D] border border-neutral-800 hover:border-[#D4AF37]/40 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-sm"
            >
              <div className="flex items-start gap-3 flex-1">
                {/* Avatar Badge */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-cinzel text-xs font-bold text-white shadow-inner flex-shrink-0 border border-white/20"
                  style={{ backgroundColor: critique.avatarColor || '#734E2F' }}
                >
                  {critique.author.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <span className="font-classic text-sm font-semibold text-[#E6DEC9]">
                      {critique.author}
                    </span>
                    <span className="text-[10px] font-cinzel px-1.5 py-0.5 rounded bg-black/40 text-[#D4AF37] border border-[#D4AF37]/20">
                      {critique.role}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono ml-auto">
                      {critique.timestamp}
                    </span>
                  </div>

                  <p className="font-classic text-neutral-300 text-sm leading-relaxed">
                    "{critique.content}"
                  </p>
                </div>
              </div>

              {/* Gold-Rimmed Like Button */}
              <button
                onClick={() => onToggleLike(critique.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all self-end sm:self-start cursor-pointer ${
                  critique.isLiked
                    ? 'bg-[#2E2413] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                    : 'bg-[#181818] border-neutral-700 text-neutral-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                }`}
                title={critique.isLiked ? 'Unlike critique' : 'Like critique'}
              >
                <Heart 
                  className={`w-3.5 h-3.5 transition-transform ${
                    critique.isLiked ? 'fill-[#D4AF37] text-[#D4AF37] scale-110' : ''
                  }`} 
                />
                <span className="font-cinzel text-xs font-bold">
                  {critique.likes}
                </span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Append New Critique Form */}
      <form onSubmit={handleSubmit} className="pt-4 border-t border-neutral-800/80">
        <div className="text-xs font-cinzel text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Contribute a Salon Appraisal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Reviewer Name (e.g. Lord Byron, Lady Catherine)"
            className="w-full px-3 py-1.5 bg-[#141414] border border-neutral-700 rounded text-xs text-[#E6DEC9] placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <select
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#141414] border border-neutral-700 rounded text-xs text-[#E6DEC9] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="Salon Correspondent">Salon Correspondent</option>
            <option value="Literary Reviewer">Literary Reviewer</option>
            <option value="Archival Fellow">Archival Fellow</option>
            <option value="Epistolary Collector">Epistolary Collector</option>
            <option value="Anonymous Contemporary">Anonymous Contemporary</option>
          </select>
        </div>

        <div className="relative">
          <textarea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Offer your literary commentary, appraisal of cadence, or critique of style..."
            className="w-full p-3 pr-20 bg-[#141414] border border-neutral-700 rounded text-xs text-[#E6DEC9] placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] resize-none"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="absolute right-2.5 bottom-3.5 px-3 py-1 rounded bg-[#272115] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#181818] text-xs font-cinzel font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Post</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </section>
  );
};
