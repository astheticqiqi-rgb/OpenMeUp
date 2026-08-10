import React, { useState } from 'react';
import { Gamepad2, Heart, Sparkles, Target, Flame, Trophy } from 'lucide-react';
import { MarioShooterGame } from './MarioShooterGame';
import { BlockBreakerGame } from './BlockBreakerGame';
import { BaseballGame } from './BaseballGame';
import { SnakeGame } from './SnakeGame';
import { JigsawPuzzleGame } from './JigsawPuzzleGame';

export const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'mario' | 'block' | 'baseball' | 'snake' | 'jigsaw'>('mario');

  const gamesList = [
    { id: 'mario', title: 'Super Mario & Defender', icon: '🍄', desc: 'Jump, collect coins & shoot fireball hearts!' },
    { id: 'block', title: 'Block Breaker', icon: '🧱', desc: 'Bounce the glowing sphere & smash blocks!' },
    { id: 'baseball', title: 'Home Run Derby', icon: '⚾', desc: 'Time your swing & smash baseballs over the fence!' },
    { id: 'snake', title: 'Cozy Snake', icon: '🐍', desc: 'Snake game with customizable puppy treats!' },
    { id: 'jigsaw', title: 'Photo Jigsaw', icon: '🧩', desc: 'Swap photo tiles to solve sweet memory pictures!' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#ADC178] text-xs font-bold mb-2 shadow-sm">
          <Gamepad2 className="w-4 h-4 text-[#ADC178]" /> Cozy Arcade Hub
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold italic tracking-tight text-white font-serif-title">Play & Smile Together</h2>
        <p className="text-white/80 text-xs sm:text-sm mt-1">
          Enjoy cute retro mini games crafted with love, high scores, and sound effects!
        </p>
      </div>

      {/* Arcade Tabs Nav */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 mb-8 no-scrollbar justify-start sm:justify-center">
        {gamesList.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeGame === g.id
                ? 'bg-[#ADC178] text-[#4a5038] shadow-lg scale-105'
                : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 border border-white/20'
            }`}
          >
            <span className="text-base">{g.icon}</span>
            <span>{g.title}</span>
          </button>
        ))}
      </div>

      {/* Active Game Display */}
      <div className="flex justify-center">
        {activeGame === 'mario' && <MarioShooterGame />}
        {activeGame === 'block' && <BlockBreakerGame />}
        {activeGame === 'baseball' && <BaseballGame />}
        {activeGame === 'snake' && <SnakeGame />}
        {activeGame === 'jigsaw' && <JigsawPuzzleGame />}
      </div>
    </div>
  );
};
