import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Dog, Heart, Apple } from 'lucide-react';
import puppyImg from '../assets/images/cute_puppy_card_1786352817541.jpg';

const playEatSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
};

export const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [foodType, setFoodType] = useState<'puppy' | 'heart' | 'apple'>('puppy');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeRef = useRef<Array<{ x: number; y: number }>>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });

  const gridSize = 18;
  const tileCount = 20;

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnFood = () => {
    foodRef.current = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  };

  const handleStartGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    spawnFood();
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && dirRef.current.y === 0) {
        dirRef.current = { x: 0, y: -1 };
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && dirRef.current.y === 0) {
        dirRef.current = { x: 0, y: 1 };
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && dirRef.current.x === 0) {
        dirRef.current = { x: -1, y: 0 };
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && dirRef.current.x === 0) {
        dirRef.current = { x: 1, y: 0 };
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const interval = setInterval(() => {
      // Move Snake
      const head = {
        x: snakeRef.current[0].x + dirRef.current.x,
        y: snakeRef.current[0].y + dirRef.current.y,
      };

      // Check Wall Collisions
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameState('gameover');
        return;
      }

      // Check Self Collisions
      if (snakeRef.current.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameover');
        return;
      }

      snakeRef.current.unshift(head);

      // Check Food Collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        if (soundEnabled) playEatSound();
        setScore((prev) => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('openmeup_snake_highscore', newScore.toString());
          }
          return newScore;
        });
        spawnFood();
      } else {
        snakeRef.current.pop();
      }

      // Render Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.fillStyle = '#E2ECE9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Food
      const fx = foodRef.current.x * gridSize;
      const fy = foodRef.current.y * gridSize;

      if (foodType === 'puppy') {
        const img = new Image();
        img.src = puppyImg;
        if (img.complete) {
          ctx.drawImage(img, fx, fy, gridSize, gridSize);
        } else {
          ctx.fillStyle = '#D7CCC8';
          ctx.beginPath();
          ctx.arc(fx + gridSize / 2, fy + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (foodType === 'heart') {
        ctx.fillStyle = '#E91E63';
        ctx.beginPath();
        ctx.arc(fx + gridSize / 2, fy + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(fx + gridSize / 2, fy + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Snake Segments
      snakeRef.current.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#68704F' : '#ADC178';
        ctx.beginPath();
        ctx.roundRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2, 4);
        ctx.fill();
      });
    }, 130);

    return () => clearInterval(interval);
  }, [gameState, foodType, soundEnabled, highScore]);

  const changeDir = (x: number, y: number) => {
    if (x !== 0 && dirRef.current.x === 0) dirRef.current = { x, y };
    if (y !== 0 && dirRef.current.y === 0) dirRef.current = { x, y };
  };

  return (
    <div className="w-full bg-white border border-[#ADC178]/40 shadow-xl rounded-3xl p-6 flex flex-col items-center">
      {/* Top Food Selector & Scores */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-md mb-3 gap-2">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl">
          <button
            onClick={() => setFoodType('puppy')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${foodType === 'puppy' ? 'bg-[#68704F] text-white' : 'text-stone-600'}`}
          >
            <img src={puppyImg} alt="Puppy" className="w-4 h-4 rounded-full object-cover inline-block" />
            <span>Puppy</span>
          </button>
          <button
            onClick={() => setFoodType('heart')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${foodType === 'heart' ? 'bg-[#68704F] text-white' : 'text-stone-600'}`}
          >
            ❤️ Heart
          </button>
          <button
            onClick={() => setFoodType('apple')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${foodType === 'apple' ? 'bg-[#68704F] text-white' : 'text-stone-600'}`}
          >
            🍏 Apple
          </button>
        </div>

        <div className="text-xs font-bold text-[#68704F]">
          <span>Score: {score} | 🏆 High: {highScore}</span>
        </div>
      </div>

      {/* Snake Canvas Viewport */}
      <div className="relative w-full max-w-md aspect-square bg-[#E2ECE9] rounded-2xl overflow-hidden shadow-inner border-2 border-[#ADC178]">
        <canvas ref={canvasRef} width={360} height={360} className="w-full h-full block" />

        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic mb-2 text-[#E2ECE9]">🐍 Cozy Snake</h3>
            <p className="text-xs text-stone-200 mb-4 max-w-xs">
              Guide the cozy snake to collect tasty puppy treats and hearts without hitting the walls!
            </p>
            <button
              onClick={handleStartGame}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4" /> Start Snake
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic text-pink-300 mb-1">Game Over!</h3>
            <p className="text-sm font-bold mb-4">Final Score: {score}</p>
            <button
              onClick={handleStartGame}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-Screen D-Pad for Touch Controls */}
      <div className="mt-4 flex flex-col items-center gap-1">
        <button
          onClick={() => changeDir(0, -1)}
          className="w-10 h-10 bg-white border border-stone-300 rounded-xl shadow flex items-center justify-center font-bold text-stone-700 active:bg-stone-100"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => changeDir(-1, 0)}
            className="w-10 h-10 bg-white border border-stone-300 rounded-xl shadow flex items-center justify-center font-bold text-stone-700 active:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeDir(1, 0)}
            className="w-10 h-10 bg-white border border-stone-300 rounded-xl shadow flex items-center justify-center font-bold text-stone-700 active:bg-stone-100"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => changeDir(0, 1)}
          className="w-10 h-10 bg-white border border-stone-300 rounded-xl shadow flex items-center justify-center font-bold text-stone-700 active:bg-stone-100"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
