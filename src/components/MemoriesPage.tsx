import React, { useState, useEffect } from 'react';
import { Camera, Heart, Plus, MapPin, Calendar, Tag, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { DEFAULT_MEMORIES, MemoryPhoto } from '../data/content';
import confetti from 'canvas-confetti';

export const MemoriesPage: React.FC = () => {
  const [memories, setMemories] = useState<MemoryPhoto[]>(DEFAULT_MEMORIES);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<MemoryPhoto | null>(null);
  const [likes, setLikes] = useState<{ [key: string]: number }>({ '1': 12, '2': 8, '3': 15 });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState<'cozy' | 'travel' | 'funny' | 'celebration' | 'sweet'>('sweet');

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_user_memories');
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    const newItem: MemoryPhoto = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate || 'Today',
      location: newLocation || 'Sweet Spot',
      caption: newCaption || 'Another precious moment!',
      imageUrl: newImageUrl,
      tag: newTag,
    };

    const updated = [newItem, ...memories];
    setMemories(updated);
    localStorage.setItem('openmeup_user_memories', JSON.stringify(updated));

    // Reset Form
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewCaption('');
    setNewImageUrl('');
    setIsAdding(false);

    confetti({ particleCount: 60, spread: 60 });
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const tags = ['all', 'cozy', 'sweet', 'travel', 'funny', 'celebration'];

  const filtered = selectedTag === 'all'
    ? memories
    : memories.filter((m) => m.tag === selectedTag);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#ADC178] text-xs font-bold mb-2 shadow-sm">
            <Camera className="w-4 h-4 text-[#ADC178]" /> Photo Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold italic tracking-tight text-white font-serif-title">Our Sweet Memories</h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            Polaroid moments, happy smiles, and timeless snapshots of love.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ADC178] hover:bg-white text-[#4a5038] text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Memory
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedTag === t
                ? 'bg-[#ADC178] text-[#4a5038] shadow-md'
                : 'bg-white/10 backdrop-blur-md text-white/80 border border-white/20 hover:bg-white/20'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group bg-white/95 backdrop-blur-xl p-4 pb-6 rounded-[28px] border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative text-slate-800"
          >
            {/* Polaroid Image Container */}
            <div className="w-full aspect-square bg-stone-100 rounded-2xl overflow-hidden mb-4 relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold capitalize">
                {item.tag}
              </span>
            </div>

            {/* Polaroid Text & Caption */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold italic text-xl text-[#68704F] leading-tight mb-1 font-serif-title">{item.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-stone-500 mb-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#ADC178]" /> {item.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#ADC178]" /> {item.location}</span>
                </div>
              </div>

              <button
                onClick={(e) => handleLike(item.id, e)}
                className="flex items-center gap-1 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-pink-600" />
                <span>{likes[item.id] || 1}</span>
              </button>
            </div>

            <p className="text-stone-600 text-xs font-handwriting text-lg line-clamp-2 mt-1">
              "{item.caption}"
            </p>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#ADC178] animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold font-aesthetic text-[#68704F]">Add a Photo Memory</h3>
              <button onClick={() => setIsAdding(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Memory Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sunday Picnic in the Park"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Image URL:</label>
                <input
                  type="url"
                  required
                  placeholder="Paste image link (e.g. Unsplash URL)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">Date:</label>
                  <input
                    type="text"
                    placeholder="e.g., May 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">Location:</label>
                  <input
                    type="text"
                    placeholder="e.g., Lake Side"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Caption / Note:</label>
                <textarea
                  rows={3}
                  placeholder="Write a sweet reflection..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Category Tag:</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none"
                >
                  <option value="sweet">Sweet</option>
                  <option value="cozy">Cozy</option>
                  <option value="travel">Travel</option>
                  <option value="funny">Funny</option>
                  <option value="celebration">Celebration</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#68704F] hover:bg-[#535A3F] text-white font-bold rounded-xl text-xs shadow-md transition-colors mt-2"
              >
                Save Photo Memory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 bg-stone-100 hover:bg-stone-200 p-2 rounded-full text-stone-600 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full aspect-square bg-stone-100 rounded-2xl overflow-hidden mb-4">
              <img src={activePhoto.imageUrl} alt={activePhoto.title} className="w-full h-full object-cover" />
            </div>

            <h3 className="text-2xl font-aesthetic text-[#68704F] mb-1">{activePhoto.title}</h3>
            <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
              <span>{activePhoto.date}</span> • <span>{activePhoto.location}</span>
            </div>
            <p className="text-stone-700 text-base font-handwriting leading-relaxed bg-[#F8FAF8] p-4 rounded-2xl border border-stone-200">
              "{activePhoto.caption}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
