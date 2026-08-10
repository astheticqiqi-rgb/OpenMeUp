import React, { useState, useEffect } from 'react';
import { Heart, Edit3, Copy, Download, RefreshCw, Dog, Flower2, Star, Sparkles, Check, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEFAULT_LETTER } from '../data/content';

export const LetterPage: React.FC = () => {
  const [letter, setLetter] = useState(DEFAULT_LETTER);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_custom_letter');
    if (saved) {
      try {
        setLetter(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('openmeup_custom_letter', JSON.stringify(letter));
    setIsEditing(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    setLetter(DEFAULT_LETTER);
    localStorage.removeItem('openmeup_custom_letter');
    setIsEditing(false);
  };

  const handleCopy = () => {
    const fullText = `${letter.title}\nTo: ${letter.recipient}\nDate: ${letter.date}\n\n${letter.content}\n\nWith love,\n${letter.sender}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ADC178', '#68704F', '#ffffff', '#FFB7B2']
    });
  };

  const stamps = [
    { id: 'puppy', label: 'Cute Puppy', icon: '🐶' },
    { id: 'heart', label: 'Wax Heart', icon: '❤️' },
    { id: 'flower', label: 'Sage Blossom', icon: '🌸' },
    { id: 'star', label: 'Sparkle Star', icon: '✨' },
  ];

  const fontClasses = {
    handwriting: 'font-handwriting text-2xl leading-relaxed',
    script: 'font-script text-2xl leading-relaxed',
    serif: 'font-serif-title text-lg leading-loose',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-xl text-white">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#ADC178] uppercase tracking-wider">Font Style:</span>
          <button
            onClick={() => setLetter({ ...letter, fontStyle: 'handwriting' })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${letter.fontStyle === 'handwriting' ? 'bg-[#ADC178] text-[#4a5038] shadow-md' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          >
            Handwritten
          </button>
          <button
            onClick={() => setLetter({ ...letter, fontStyle: 'script' })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${letter.fontStyle === 'script' ? 'bg-[#ADC178] text-[#4a5038] shadow-md' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          >
            Script
          </button>
          <button
            onClick={() => setLetter({ ...letter, fontStyle: 'serif' })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${letter.fontStyle === 'serif' ? 'bg-[#ADC178] text-[#4a5038] shadow-md' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          >
            Classic Serif
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ADC178] hover:bg-white text-[#4a5038] text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Done Editing' : 'Personalize Letter'}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#ADC178]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={handleConfetti}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-400/30 text-xs font-bold transition-colors cursor-pointer"
            title="Send Love Sparkles"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            Celebrate
          </button>
        </div>
      </div>

      {/* Postage Stamp Selector (if editing) */}
      {isEditing && (
        <div className="mb-6 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-xl text-white animate-fadeIn">
          <h4 className="text-xs font-bold text-[#ADC178] mb-2 uppercase tracking-wider">Select Letter Stamp:</h4>
          <div className="flex flex-wrap gap-3">
            {stamps.map((st) => (
              <button
                key={st.id}
                onClick={() => setLetter({ ...letter, selectedStamp: st.id })}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${letter.selectedStamp === st.id ? 'border-[#ADC178] bg-[#ADC178]/25 font-bold text-white' : 'border-white/20 bg-white/5 hover:bg-white/10 text-white/80'}`}
              >
                <span className="text-xl">{st.icon}</span>
                <span className="text-xs">{st.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Letter Card */}
      <div className="relative bg-white/95 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[32px] p-8 sm:p-12 overflow-hidden transition-all text-slate-800">
        {/* Subtle Envelope Paper Lines Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ADC178_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Top Header with Stamp & Dates */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#ADC178]/30 pb-6 mb-8 gap-4">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={letter.title}
                onChange={(e) => setLetter({ ...letter, title: e.target.value })}
                className="text-2xl font-bold italic text-[#68704F] border-b border-[#ADC178] focus:outline-none w-full bg-transparent font-serif-title"
              />
            ) : (
              <h2 className="text-3xl sm:text-4xl font-bold italic tracking-tight text-[#68704F] font-serif-title">{letter.title}</h2>
            )}

            <div className="text-xs text-stone-500 font-medium mt-1 flex items-center gap-2">
              <span>To:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={letter.recipient}
                  onChange={(e) => setLetter({ ...letter, recipient: e.target.value })}
                  className="font-bold text-[#1C1917] border-b border-stone-300 focus:outline-none bg-transparent"
                />
              ) : (
                <span className="font-bold text-[#1C1917]">{letter.recipient}</span>
              )}
            </div>
          </div>

          {/* Stamp Badge */}
          <div className="relative w-20 h-24 bg-[#68704f]/10 backdrop-blur-md border border-[#ADC178]/40 rounded-2xl p-2 flex flex-col items-center justify-center shadow-md transform rotate-2">
            <span className="text-3xl mb-1">
              {stamps.find(s => s.id === letter.selectedStamp)?.icon || '🐶'}
            </span>
            <span className="text-[9px] font-bold text-[#68704F] tracking-widest uppercase">AIR MAIL</span>
            {isEditing ? (
              <input
                type="text"
                value={letter.date}
                onChange={(e) => setLetter({ ...letter, date: e.target.value })}
                className="text-[8px] text-stone-400 text-center border-b border-stone-200 focus:outline-none w-full mt-0.5 bg-transparent"
              />
            ) : (
              <span className="text-[9px] text-stone-400 mt-0.5">{letter.date}</span>
            )}
          </div>
        </div>

        {/* Letter Body */}
        <div className="my-6">
          {isEditing ? (
            <textarea
              rows={10}
              value={letter.content}
              onChange={(e) => setLetter({ ...letter, content: e.target.value })}
              className="w-full p-4 rounded-xl border border-[#ADC178] focus:outline-none focus:ring-2 focus:ring-[#68704F] text-stone-800 font-handwriting text-xl leading-relaxed bg-white/80"
            />
          ) : (
            <div className={`text-stone-800 whitespace-pre-line ${fontClasses[letter.fontStyle || 'handwriting']}`}>
              {letter.content}
            </div>
          )}
        </div>

        {/* Footer Sign-off */}
        <div className="mt-8 pt-6 border-t border-[#ADC178]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#68704F] fill-[#ADC178]" />
            <span className="text-sm font-medium text-stone-600">With all my heart,</span>
            {isEditing ? (
              <input
                type="text"
                value={letter.sender}
                onChange={(e) => setLetter({ ...letter, sender: e.target.value })}
                className="font-bold text-[#68704F] border-b border-[#ADC178] focus:outline-none bg-transparent"
              />
            ) : (
              <span className="font-bold text-[#68704F] text-lg italic font-serif-title">{letter.sender}</span>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#68704F] hover:bg-[#535A3F] text-white rounded-xl text-xs font-bold shadow transition-colors"
              >
                Save My Changes
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
                title="Reset to default"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
