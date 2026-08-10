import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Trophy, Heart, Flame, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import puppyImg from '../assets/images/cute_puppy_card_1786352817541.jpg';

interface Card {
  id: number;
  symbol: string;
  imageUrl?: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_SYMBOLS = [
  { symbol: '🐶', name: 'Cute Puppy', imageUrl: puppyImg },
  { symbol: '💖', name: 'Warm Heart', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=300&auto=format&fit=crop' },
  { symbol: '☕', name: 'Cozy Coffee', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop' },
  { symbol: '🍕', name: 'Pizza Slice', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop' },
  { symbol: '🌸', name: 'Cherry Blossom', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=300&auto=format&fit=crop' },
  { symbol: '🎂', name: 'Birthday Cake', imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop' },
  { symbol: '🍩', name: 'Sweet Donut', imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=300&auto=format&fit=crop' },
  { symbol: '🌟', name: 'Glowing Star', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop' },
];

export const WarmthCardMatchGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(12); // 6 pairs
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(() => {
    const saved = localStorage.getItem('warmth_card_match_best');
    return saved ? parseInt(saved, 10) : null;
  });

  // Initialize deck
  const initGame = (size = gridSize) => {
    const pairCount = size / 2;
    const selectedSymbols = CARD_SYMBOLS.slice(0, pairCount);
    
    // Create double set for matching pairs
    const deck: Card[] = [];
    selectedSymbols.forEach((item, index) => {
      deck.push({
        id: index * 2,
        symbol: item.symbol,
        imageUrl: item.imageUrl,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: index * 2 + 1,
        symbol: item.symbol,
        imageUrl: item.imageUrl,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsTimerRunning(false);
    setIsWon(false);
  };

  useEffect(() => {
    initGame(gridSize);
  }, [gridSize]);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isWon]);

  // Card click handler
  const handleCardClick = (index: number) => {
    if (isWon) return;
    if (cards[index].isMatched || cards[index].isFlipped) return;
    if (flippedIndices.length >= 2) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    // Flip selected card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If two cards flipped, check match
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].symbol === newCards[secondIdx].symbol) {
        // Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...card, isMatched: true, isFlipped: true }
                : card
            )
          );
          setFlippedIndices([]);
          setMatches((m) => {
            const nextMatches = m + 1;
            const totalPairs = gridSize / 2;
            if (nextMatches >= totalPairs) {
              handleWin();
            }
            return nextMatches;
          });
        }, 300);
      } else {
        // Not a match, flip back after delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleWin = () => {
    setIsWon(true);
    setIsTimerRunning(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ADC178', '#DDA15E', '#BC6C25', '#F4A261', '#E76F51'],
    });

    const finalMoves = moves + 1;
    if (!bestScore || finalMoves < bestScore) {
      setBestScore(finalMoves);
      localStorage.setItem('warmth_card_match_best', finalMoves.toString());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 shadow-2xl text-white text-center">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎴</span>
            <h3 className="text-xl font-bold italic text-[#ADC178] font-serif-title">Warmth Card Match</h3>
          </div>
          <p className="text-xs text-white/70">Flip cards to match warm memory pairs!</p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-2xl border border-white/10 text-xs font-semibold">
          <div className="flex items-center gap-1 text-[#ADC178]">
            <Flame className="w-3.5 h-3.5" />
            <span>Moves: {moves}</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1 text-sky-300">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timer)}</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1 text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best: {bestScore ?? '-'}</span>
          </div>
        </div>
      </div>

      {/* Difficulty & Restart Bar */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/15">
          {[8, 12, 16].map((size) => (
            <button
              key={size}
              onClick={() => {
                setGridSize(size);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                gridSize === size
                  ? 'bg-[#ADC178] text-[#4a5038] shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {size / 2} Pairs ({size})
            </button>
          ))}
        </div>

        <button
          onClick={() => initGame(gridSize)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer border border-white/20 active:scale-95 shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Card Grid */}
      <div
        className={`grid gap-3 sm:gap-4 mb-4 ${
          gridSize === 8
            ? 'grid-cols-4'
            : gridSize === 12
            ? 'grid-cols-3 sm:grid-cols-4'
            : 'grid-cols-4 sm:grid-cols-4'
        }`}
      >
        {cards.map((card, index) => {
          const isSelected = card.isFlipped || card.isMatched;

          return (
            <div
              key={`${card.id}-${index}`}
              onClick={() => handleCardClick(index)}
              className="aspect-square relative cursor-pointer perspective-1000 group"
            >
              <div
                className={`w-full h-full rounded-2xl transition-all duration-500 transform-style-3d shadow-lg border ${
                  isSelected
                    ? 'rotate-y-180 bg-white/95 text-stone-800 border-[#ADC178]'
                    : 'bg-white/15 hover:bg-white/25 text-white border-white/20 group-hover:scale-105'
                } flex flex-col items-center justify-center p-2 relative overflow-hidden`}
              >
                {/* Back side of card (unflipped) */}
                {!isSelected && (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="text-2xl opacity-80 group-hover:scale-110 transition-transform">🎴</span>
                    <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase">Match</span>
                  </div>
                )}

                {/* Front side of card (flipped) */}
                {isSelected && (
                  <div className="flex flex-col items-center justify-center gap-1 animate-in zoom-in-75 duration-300 w-full h-full p-1">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl shadow-md border border-[#ADC178]/40"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl">{card.symbol}</span>
                    )}
                    <span className="text-[10px] font-bold text-[#4a5038] truncate max-w-full">
                      {card.name}
                    </span>
                  </div>
                )}

                {/* Matched badge */}
                {card.isMatched && (
                  <div className="absolute top-1 right-1 p-0.5 rounded-full bg-[#ADC178] text-[#4a5038]">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Victory Banner */}
      {isWon && (
        <div className="mt-6 p-5 rounded-3xl bg-[#ADC178]/20 border border-[#ADC178]/50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#ADC178] text-[#4a5038] flex items-center justify-center mb-2 shadow-lg">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold italic text-[#ADC178] font-serif-title mb-1">
            Warmth Match Complete! 🎉
          </h4>
          <p className="text-xs text-white/80 max-w-md mb-4">
            You matched all {gridSize / 2} pairs in <span className="text-[#ADC178] font-bold">{moves} moves</span> and <span className="text-sky-300 font-bold">{formatTime(timer)}</span>!
          </p>
          <button
            onClick={() => initGame(gridSize)}
            className="px-5 py-2.5 rounded-full bg-[#ADC178] hover:bg-white text-[#4a5038] text-xs font-bold shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            Play Again 🎴
          </button>
        </div>
      )}
    </div>
  );
};
