import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Plus, RefreshCw, Star, Trash2, Search, Gift, Volume2, VolumeX, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface JarNote {
  id: string;
  text: string;
  category: 'Encouragement' | 'Affirmation' | 'Sweet Memory' | 'Gratitude' | 'Daily Hug';
  color: 'sage' | 'rose' | 'gold' | 'lavender' | 'sky';
  dateAdded: string;
  isFavorite?: boolean;
}

const DEFAULT_JAR_NOTES: JarNote[] = [
  {
    id: 'j1',
    text: 'You make my world so much brighter just by being in it. ☀️',
    category: 'Affirmation',
    color: 'gold',
    dateAdded: 'Today',
    isFavorite: true,
  },
  {
    id: 'j2',
    text: 'Remember to take a soft, deep breath right now. You are doing so well! 🌿',
    category: 'Encouragement',
    color: 'sage',
    dateAdded: 'Today',
  },
  {
    id: 'j3',
    text: 'I love the sound of your laugh—it is my absolute favorite sound in the world. 💛',
    category: 'Sweet Memory',
    color: 'rose',
    dateAdded: 'Today',
    isFavorite: true,
  },
  {
    id: 'j4',
    text: 'Don’t forget to drink some water and get cozy sleep tonight! 🌙',
    category: 'Daily Hug',
    color: 'sky',
    dateAdded: 'Today',
  },
  {
    id: 'j5',
    text: 'You are so much stronger and kinder than you give yourself credit for. ✨',
    category: 'Encouragement',
    color: 'lavender',
    dateAdded: 'Today',
  },
  {
    id: 'j6',
    text: 'Sending you a huge, warm, squishy virtual hug right this second! 🫂',
    category: 'Daily Hug',
    color: 'rose',
    dateAdded: 'Today',
  },
  {
    id: 'j7',
    text: 'I am so proud of how hard you try and the beautiful heart you have. 🌸',
    category: 'Gratitude',
    color: 'sage',
    dateAdded: 'Today',
  },
  {
    id: 'j8',
    text: 'Thank you for being my favorite person to share moments and smiles with. ☕',
    category: 'Gratitude',
    color: 'gold',
    dateAdded: 'Today',
    isFavorite: true,
  },
];

const COLOR_MAP: Record<JarNote['color'], { bg: string; text: string; border: string; badge: string; shadow: string }> = {
  sage: { bg: 'bg-[#ADC178]/20', text: 'text-[#4a5038]', border: 'border-[#ADC178]/50', badge: 'bg-[#ADC178] text-[#4a5038]', shadow: 'shadow-[#ADC178]/20' },
  rose: { bg: 'bg-rose-100/90', text: 'text-rose-900', border: 'border-rose-300', badge: 'bg-rose-400 text-white', shadow: 'shadow-rose-200' },
  gold: { bg: 'bg-amber-100/90', text: 'text-amber-900', border: 'border-amber-300', badge: 'bg-amber-400 text-amber-950', shadow: 'shadow-amber-200' },
  lavender: { bg: 'bg-purple-100/90', text: 'text-purple-900', border: 'border-purple-300', badge: 'bg-purple-400 text-white', shadow: 'shadow-purple-200' },
  sky: { bg: 'bg-sky-100/90', text: 'text-sky-900', border: 'border-sky-300', badge: 'bg-sky-400 text-sky-950', shadow: 'shadow-sky-200' },
};

const playRustleSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {}
};

export const WarmthJarPage: React.FC = () => {
  const [notes, setNotes] = useState<JarNote[]>(DEFAULT_JAR_NOTES);
  const [pulledNote, setPulledNote] = useState<JarNote | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // New Note State
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<JarNote['category']>('Encouragement');
  const [newColor, setNewColor] = useState<JarNote['color']>('gold');

  // Search / Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_warmth_jar_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveNotes = (updated: JarNote[]) => {
    setNotes(updated);
    localStorage.setItem('openmeup_warmth_jar_notes', JSON.stringify(updated));
  };

  const handlePullNote = () => {
    if (notes.length === 0) return;
    setIsShaking(true);
    setIsOpening(true);
    playRustleSound();

    setTimeout(() => {
      setIsShaking(false);
      const randomIndex = Math.floor(Math.random() * notes.length);
      const chosen = notes[randomIndex];
      setPulledNote(chosen);
      setIsOpening(false);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ADC178', '#FFD1DC', '#FDFD96', '#C7CEEA'],
      });
    }, 600);
  };

  const handleShakeJar = () => {
    setIsShaking(true);
    playRustleSound();
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const item: JarNote = {
      id: Date.now().toString(),
      text: newText.trim(),
      category: newCategory,
      color: newColor,
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    saveNotes([item, ...notes]);
    setNewText('');
    setIsAdding(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  const toggleFavorite = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
    saveNotes(updated);
    if (pulledNote && pulledNote.id === id) {
      setPulledNote({ ...pulledNote, isFavorite: !pulledNote.isFavorite });
    }
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
    if (pulledNote && pulledNote.id === id) {
      setPulledNote(null);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.text.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'favorites') return matchesSearch && n.isFavorite;
    return matchesSearch && n.category === selectedFilter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#ADC178] text-xs font-bold mb-2 shadow-sm">
          <Flame className="w-4 h-4 text-[#ADC178]" /> Jar of Heartfelt Thoughts
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold italic tracking-tight text-white font-serif-title">
          The Warmth Jar
        </h2>
        <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Reach in and pull out a cozy folded love note whenever you need a smile, comfort, or sweet reminder! 🫙✨
        </p>
      </div>

      {/* Main Interactive Jar Section */}
      <div className="bg-white/95 backdrop-blur-2xl rounded-[36px] p-6 sm:p-8 border border-white/50 shadow-2xl mb-8 text-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Jar Visual */}
        <div className="flex flex-col items-center justify-center relative w-full md:w-1/2">
          {/* Jar Lid & Glass Body Container */}
          <div
            onClick={handlePullNote}
            className={`relative cursor-pointer group transition-transform duration-300 ${
              isShaking ? 'animate-bounce' : 'hover:scale-105'
            }`}
            title="Click the jar to draw a warm note!"
          >
            {/* Wooden Lid */}
            <div className="w-32 h-6 bg-[#8B5A2B] rounded-t-xl border-2 border-[#5c3a1a] shadow-md mx-auto relative z-20 flex items-center justify-center">
              <div className="w-24 h-1 bg-[#A06C3B] rounded-full" />
            </div>
            {/* Jar Neck */}
            <div className="w-36 h-4 bg-white/40 border-x-2 border-stone-300/80 mx-auto relative z-10 backdrop-blur-sm" />

            {/* Glass Jar Body */}
            <div className="w-52 h-64 bg-gradient-to-b from-white/60 via-white/30 to-white/60 rounded-b-[48px] rounded-t-xl border-4 border-stone-200/90 shadow-2xl relative overflow-hidden backdrop-blur-md p-3 flex flex-wrap content-end justify-center gap-1.5">
              {/* Glass Glare Reflections */}
              <div className="absolute top-2 left-3 w-3 h-48 bg-white/50 rounded-full blur-[1px] pointer-events-none" />
              <div className="absolute top-2 right-4 w-1.5 h-48 bg-white/30 rounded-full blur-[1px] pointer-events-none" />

              {/* Tag hanging on string */}
              <div className="absolute top-3 right-6 bg-amber-100/90 border border-amber-300 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm transform rotate-12 z-20">
                Warmth ✨
              </div>

              {/* Folded Paper Notes inside Jar */}
              {notes.map((note, index) => {
                const colors = ['bg-[#ADC178]', 'bg-rose-300', 'bg-amber-300', 'bg-purple-300', 'bg-sky-300'];
                const colorBg = colors[index % colors.length];
                const rotation = (index * 27) % 360;
                return (
                  <div
                    key={note.id}
                    className={`w-9 h-6 ${colorBg} rounded-md shadow-sm border border-black/10 transition-transform duration-300 flex items-center justify-center text-[8px] font-bold text-stone-700 opacity-90 group-hover:scale-110`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    💌
                  </div>
                );
              })}

              {notes.length === 0 && (
                <div className="text-center text-xs text-stone-400 my-auto">Jar is empty! Add a note below.</div>
              )}
            </div>
          </div>

          {/* Jar Control Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handlePullNote}
              disabled={isOpening}
              className="px-6 py-3 bg-[#ADC178] hover:bg-[#68704F] text-[#4a5038] hover:text-white text-xs font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <Gift className="w-4 h-4" />
              <span>{isOpening ? 'Opening Note...' : 'Pull a Warm Note 💌'}</span>
            </button>

            <button
              onClick={handleShakeJar}
              className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl transition-all shadow-sm cursor-pointer"
              title="Shake the Jar!"
            >
              <RefreshCw className={`w-4 h-4 ${isShaking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Pulled Note Display or Jar Stats */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {pulledNote ? (
            <div className={`p-6 rounded-3xl border-2 shadow-xl ${COLOR_MAP[pulledNote.color].bg} ${COLOR_MAP[pulledNote.color].border} relative animate-fade-in transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${COLOR_MAP[pulledNote.color].badge}`}>
                  {pulledNote.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(pulledNote.id)}
                    className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                    title="Bookmark Note"
                  >
                    <Star className={`w-4 h-4 ${pulledNote.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => setPulledNote(null)}
                    className="text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              <p className={`text-base sm:text-lg font-serif-title font-bold leading-relaxed mb-4 ${COLOR_MAP[pulledNote.color].text}`}>
                "{pulledNote.text}"
              </p>

              <div className="flex items-center justify-between text-[11px] opacity-70 font-medium pt-3 border-t border-black/10">
                <span>Notes in Jar: {notes.length}</span>
                <span>Pulled with Love ❤️</span>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 border-2 border-dashed border-stone-200 p-8 rounded-3xl text-center flex flex-col items-center justify-center min-h-[220px]">
              <div className="w-12 h-12 rounded-2xl bg-[#ADC178]/20 text-[#68704F] flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-[#ADC178]" />
              </div>
              <h3 className="font-bold text-stone-700 text-sm mb-1 font-serif-title">Draw a Note From the Jar</h3>
              <p className="text-xs text-stone-500 max-w-xs mb-4">
                Click the "Pull a Warm Note" button or tap the glass jar to reveal a cozy surprise message.
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Drop Your Own Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add New Note Modal / Accordion */}
      {isAdding && (
        <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 border border-white/50 shadow-2xl mb-8 animate-fade-in text-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-base text-[#4a5038] font-serif-title flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#ADC178]" /> Drop a New Note into the Jar
            </h3>
            <button onClick={() => setIsAdding(false)} className="text-stone-400 hover:text-stone-600 text-xs font-bold">
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Your Warm Message</label>
              <textarea
                required
                rows={3}
                placeholder="Write a sweet reminder, compliment, or happy thought..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#ADC178] focus:outline-none bg-stone-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#ADC178] bg-stone-50 font-medium"
                >
                  <option value="Encouragement">Encouragement</option>
                  <option value="Affirmation">Affirmation</option>
                  <option value="Sweet Memory">Sweet Memory</option>
                  <option value="Gratitude">Gratitude</option>
                  <option value="Daily Hug">Daily Hug</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Paper Color</label>
                <div className="flex items-center gap-2 pt-1">
                  {(['gold', 'sage', 'rose', 'lavender', 'sky'] as const).map((col) => (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setNewColor(col)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer border ${
                        newColor === col ? 'scale-125 ring-2 ring-stone-700' : 'opacity-80'
                      } ${COLOR_MAP[col].bg} ${COLOR_MAP[col].border}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#ADC178] hover:bg-[#68704F] text-[#4a5038] hover:text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Place in Jar 🫙
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jar Collection Gallery */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[36px] p-6 sm:p-8 border border-white/50 shadow-2xl text-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
          <div>
            <h3 className="font-bold text-lg text-[#4a5038] font-serif-title flex items-center gap-2">
              <span>🫙 Notes Inside Your Jar</span>
              <span className="text-xs font-normal text-stone-500">({filteredNotes.length})</span>
            </h3>
            <p className="text-xs text-stone-500">Browse all the heartfelt messages resting inside your jar.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#ADC178]"
              />
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-2 bg-[#ADC178] hover:bg-[#68704F] text-[#4a5038] hover:text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> Add Note
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'favorites', 'Encouragement', 'Affirmation', 'Sweet Memory', 'Gratitude', 'Daily Hug'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-[#68704F] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Notes' : cat === 'favorites' ? '⭐ Saved Favorites' : cat}
            </button>
          ))}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const style = COLOR_MAP[note.color];
            return (
              <div
                key={note.id}
                className={`p-4 rounded-2xl border ${style.bg} ${style.border} shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.badge}`}>
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleFavorite(note.id)}
                      className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-stone-300 hover:text-rose-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className={`text-xs font-medium leading-relaxed my-2 ${style.text}`}>"{note.text}"</p>

                <div className="flex items-center justify-between text-[10px] opacity-60 pt-2 border-t border-black/5">
                  <span>{note.dateAdded}</span>
                  <button
                    onClick={() => setPulledNote(note)}
                    className="font-bold text-[#68704F] hover:underline cursor-pointer"
                  >
                    Read Large 📖
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 text-stone-400 text-xs">No notes found matching your search.</div>
        )}
      </div>
    </div>
  );
};
