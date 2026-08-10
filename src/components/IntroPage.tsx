import React, { useState } from 'react';
import { Heart, Sparkles, Mail, Volume2, ArrowRight, Dog, Star } from 'lucide-react';

interface IntroPageProps {
  onOpenApp: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onOpenApp }) => {
  const [isOpenAnimation, setIsOpenAnimation] = useState(false);

  const handleOpenClick = () => {
    setIsOpenAnimation(true);
    // Play sweet chime
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.4); // C6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}

    setTimeout(() => {
      onOpenApp();
    }, 700);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 text-white font-sans"
      style={{ background: 'linear-gradient(135deg, #68704f 0%, #4a5038 100%)' }}
    >
      {/* Decorative Frosted Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#ADC178]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Background Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#ADC178]/50 animate-float-heart"
            style={{
              left: `${(i * 8.5) % 95}%`,
              bottom: `-20px`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${6 + (i % 4)}s`,
              fontSize: `${18 + (i % 3) * 8}px`
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#ADC178] rounded-full animate-sparkle shadow-[0_0_8px_#ADC178]"
            style={{
              top: `${15 + (i * 10)}%`,
              left: `${10 + (i * 11)}%`,
              animationDelay: `${i * 0.4}s`
            }}
          />
        ))}
      </div>

      {/* Envelope Glass Container */}
      <div className={`max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl p-8 text-center relative z-10 transition-all duration-700 transform ${isOpenAnimation ? 'scale-105 opacity-0 -translate-y-8' : 'scale-100 opacity-100'}`}>
        {/* Puppy Stamp Header */}
        <div className="relative mx-auto w-24 h-28 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-2 mb-6 flex flex-col items-center justify-center shadow-lg hover:rotate-2 transition-transform">
          <div className="absolute -top-3 -right-3 bg-white/20 backdrop-blur-md text-white p-1.5 rounded-full shadow border border-white/30">
            <Dog className="w-4 h-4 text-[#ADC178]" />
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
            <span className="text-2xl">🐶</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-[#ADC178] uppercase">OPEN ME</span>
          <span className="text-[8px] text-white/50">COZY STAMP</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold italic tracking-tight text-white mb-3 font-serif-title drop-shadow-md">
          OpenMeUp
        </h1>
        <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">
          A cozy frosted companion of love, arcade games, sweet memories, daily bible verses, and warm reminders.
        </p>

        {/* Decorative Envelope Visual */}
        <div className="relative w-full h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-8 overflow-hidden group cursor-pointer shadow-inner" onClick={handleOpenClick}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#ADC178]/20 to-white/10 opacity-60" />
          <Mail className="w-12 h-12 text-[#ADC178] group-hover:scale-110 transition-transform duration-300" />
          
          {/* Wax Seal Badge */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 group-hover:scale-125 transition-transform">
            <Heart className="w-5 h-5 fill-[#ADC178] text-[#ADC178]" />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenClick}
          className="w-full py-3.5 px-6 rounded-full bg-[#ADC178] hover:bg-white text-[#4a5038] font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer animate-pulse-glow"
        >
          <span>Open My Letter & Experience</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-4 text-xs text-white/60 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#ADC178]" /> Turn on sound for cozy background audio
        </p>
      </div>

      <footer className="mt-8 text-xs text-white/60 font-medium text-center">
        Frosted Glass Design Theme • Cozy Companion v2.4 🌿
      </footer>
    </div>
  );
};
