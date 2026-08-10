import React, { useState, useEffect } from 'react';
import { BookOpen, Bookmark, Heart, Sparkles, Copy, Check, Share2, Shuffle } from 'lucide-react';
import { DEFAULT_BIBLE_VERSES, BibleVerse } from '../data/content';
import confetti from 'canvas-confetti';

export const BiblePage: React.FC = () => {
  const [verses, setVerses] = useState<BibleVerse[]>(DEFAULT_BIBLE_VERSES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_bible_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const toggleBookmark = (id: string) => {
    let updated: string[];
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((b) => b !== id);
    } else {
      updated = [...bookmarks, id];
      confetti({ particleCount: 40, spread: 50 });
    }
    setBookmarks(updated);
    localStorage.setItem('openmeup_bible_bookmarks', JSON.stringify(updated));
  };

  const handleCopy = (verse: BibleVerse) => {
    navigator.clipboard.writeText(`"${verse.text}" — ${verse.reference}`);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'Saved', 'Love', 'Peace', 'Hope', 'Strength', 'Joy'];

  const filteredVerses = verses.filter((v) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Saved') return bookmarks.includes(v.id);
    return v.category === selectedCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#ADC178] text-xs font-bold mb-2 shadow-sm">
          <BookOpen className="w-4 h-4 text-[#ADC178]" /> Scripture & Encouragement
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold italic tracking-tight text-white font-serif-title">Daily Verses & Reflections</h2>
        <p className="text-white/80 text-xs sm:text-sm mt-1">
          Quiet moments of hope, peace, love, and grace for your heart today.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#ADC178] text-[#4a5038] shadow-md'
                : 'bg-white/10 backdrop-blur-md text-white/80 border border-white/20 hover:bg-white/20'
            }`}
          >
            {cat === 'Saved' ? `🔖 Saved (${bookmarks.length})` : cat}
          </button>
        ))}
      </div>

      {/* Verses Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVerses.map((verse) => {
          const isSaved = bookmarks.includes(verse.id);

          return (
            <div
              key={verse.id}
              className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-xl hover:shadow-2xl rounded-[32px] p-6 flex flex-col justify-between transition-all hover:-translate-y-1 relative text-slate-800"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#68704f]/15 text-[#68704F] border border-[#ADC178]/40">
                    {verse.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(verse)}
                      className="p-1.5 text-stone-400 hover:text-[#68704F] rounded-full transition-colors cursor-pointer"
                      title="Copy verse"
                    >
                      {copiedId === verse.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => toggleBookmark(verse.id)}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isSaved ? 'text-amber-500 fill-amber-500' : 'text-stone-400 hover:text-stone-600'
                      }`}
                      title="Bookmark verse"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                <p className="text-stone-800 text-base font-serif-title leading-relaxed mb-4 italic">
                  "{verse.text}"
                </p>
                <p className="text-xs font-bold text-[#68704F] mb-4">— {verse.reference}</p>
              </div>

              <div className="pt-4 border-t border-[#ADC178]/20 bg-[#68704f]/5 -mx-6 -mb-6 p-6 rounded-b-[32px]">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1">
                  Gentle Reflection
                </span>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {verse.reflection}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVerses.length === 0 && (
        <div className="text-center py-12 bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/50 text-slate-800">
          <p className="text-stone-600 text-sm">No saved verses yet! Click the bookmark icon on any verse to save it here.</p>
        </div>
      )}
    </div>
  );
};
