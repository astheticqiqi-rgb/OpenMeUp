import React, { useState } from 'react';
import { Mail, Gamepad2, Camera, BookOpen, Sun, Heart, Sparkles, Home, Music } from 'lucide-react';
import { IntroPage } from './components/IntroPage';
import { LetterPage } from './components/LetterPage';
import { GamesPage } from './components/GamesPage';
import { MemoriesPage } from './components/MemoriesPage';
import { BiblePage } from './components/BiblePage';
import { RemindersPage } from './components/RemindersPage';
import { AudioPlayer } from './components/AudioPlayer';

export default function App() {
  const [hasOpenedIntro, setHasOpenedIntro] = useState(false);
  const [activeTab, setActiveTab] = useState<'letter' | 'games' | 'memories' | 'bible' | 'reminders'>('letter');

  if (!hasOpenedIntro) {
    return <IntroPage onOpenApp={() => setHasOpenedIntro(true)} />;
  }

  const tabs = [
    { id: 'letter', label: 'Love Letter', icon: Mail },
    { id: 'games', label: 'Cozy Arcade', icon: Gamepad2 },
    { id: 'memories', label: 'Memories', icon: Camera },
    { id: 'bible', label: 'Bible Verses', icon: BookOpen },
    { id: 'reminders', label: 'Reminders', icon: Sun },
  ];

  return (
    <div
      className="min-h-screen text-white flex flex-col selection:bg-[#ADC178] selection:text-slate-900 relative font-sans overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #68704f 0%, #4a5038 100%)' }}
    >
      {/* Ambient Floating Hearts & Glow Accent Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#ADC178] animate-float-heart"
            style={{
              left: `${15 + i * 15}%`,
              bottom: `-20px`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${10 + i * 2}s`,
              fontSize: '28px',
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Decorative Frosted Orbs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-[#ADC178]/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Home Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHasOpenedIntro(false)}
              className="flex items-center gap-2.5 group cursor-pointer"
              title="Return to Welcome Envelope"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-[#ADC178] text-[#ADC178]" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold italic tracking-tight text-white font-serif-title">OpenMeUp</h1>
                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-widest block">Frosted Companion</span>
              </div>
            </button>

            {/* Back to Home Button */}
            <button
              onClick={() => setHasOpenedIntro(false)}
              className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-[#ADC178] border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm backdrop-blur-md"
            >
              <Home className="w-3.5 h-3.5" /> Back to Home
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 overflow-x-auto max-w-full no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white/20 text-white shadow-md border border-white/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#ADC178] shadow-[0_0_8px_#ADC178]" />}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Audio Synthesizer Player */}
          <div className="hidden lg:block">
            <AudioPlayer />
          </div>
        </div>
      </header>

      {/* Mobile Audio Player Bar */}
      <div className="lg:hidden bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-2 flex justify-center sticky top-[65px] z-30">
        <AudioPlayer />
      </div>

      {/* Main Tab Content View */}
      <main className="flex-1 relative z-10 py-6">
        {activeTab === 'letter' && <LetterPage />}
        {activeTab === 'games' && <GamesPage />}
        {activeTab === 'memories' && <MemoriesPage />}
        {activeTab === 'bible' && <BiblePage />}
        {activeTab === 'reminders' && <RemindersPage />}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-xl border-t border-white/15 py-6 text-center text-xs text-white/70 relative z-10 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="flex items-center gap-1.5 font-medium">
            Crafted with <Heart className="w-3.5 h-3.5 text-[#ADC178] fill-[#ADC178]" /> for my favorite person • OpenMeUp 🌿
          </p>

          <button
            onClick={() => setHasOpenedIntro(false)}
            className="text-[#ADC178] font-bold hover:text-white transition-colors text-xs flex items-center gap-1"
          >
            🏠 Re-open Envelope
          </button>
        </div>
      </footer>
    </div>
  );
}
