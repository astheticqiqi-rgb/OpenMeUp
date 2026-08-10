import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, ExternalLink, Maximize2, RefreshCw, Gamepad } from 'lucide-react';

export const MarioShooterGame: React.FC = () => {
  const [viewMode, setViewMode] = useState<'embed' | 'canvas'>('embed');
  const [iframeKey, setIframeKey] = useState(0);

  const marioUrl = 'https://supermario-game.com/';

  return (
    <div className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[32px] p-6 flex flex-col items-center text-slate-800">
      {/* Game Mode Selector Header */}
      <div className="flex flex-wrap items-center justify-between w-full mb-4 pb-3 border-b border-stone-200 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍄</span>
          <div className="text-left">
            <h3 className="font-bold text-lg text-[#4a5038] font-serif-title leading-tight">Super Mario Game</h3>
            <p className="text-[11px] text-stone-500">Play classic Super Mario online right here!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('embed')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'embed'
                ? 'bg-[#ADC178] text-[#4a5038] shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Gamepad className="w-3.5 h-3.5" /> SuperMario-Game.com
          </button>
          <button
            onClick={() => setViewMode('canvas')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'canvas'
                ? 'bg-[#ADC178] text-[#4a5038] shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🕹️ Mini Canvas Runner
          </button>
        </div>
      </div>

      {viewMode === 'embed' ? (
        <div className="w-full flex flex-col items-center">
          {/* Iframe Viewport Container */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-[#ADC178] group">
            <iframe
              key={iframeKey}
              src={marioUrl}
              title="Super Mario Game Online"
              className="w-full h-full border-none"
              allow="autoplay; keyboard; fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>

          {/* Action Toolbar below game */}
          <div className="w-full flex items-center justify-between mt-3 px-2 text-xs font-semibold text-stone-600">
            <button
              onClick={() => setIframeKey((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Game</span>
            </button>

            <a
              href={marioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#ADC178] hover:bg-[#68704F] text-[#4a5038] hover:text-white font-bold transition-all shadow-md cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Full Tab</span>
            </a>
          </div>
        </div>
      ) : (
        <CanvasMarioRunner />
      )}
    </div>
  );
};

// Fallback Canvas Mario Runner
const CanvasMarioRunner: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef({ left: false, right: false, up: false, shoot: false });

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_mario_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localScore = 0;
    let player = { x: 40, y: 200, width: 28, height: 32, vx: 0, vy: 0, isGrounded: false };
    let frameCount = 0;

    const loop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#70C5FF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#65934A';
      ctx.fillRect(0, 240, canvas.width, 60);

      player.vy += 0.45;
      player.x += player.vx;
      player.y += player.vy;

      if (player.y + player.height >= 240) {
        player.y = 240 - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      ctx.fillStyle = '#D32F2F';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full aspect-[4/3] bg-sky-200 rounded-2xl overflow-hidden shadow-inner border-2 border-[#ADC178]">
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full block" />
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Mario Mini Runner</h3>
            <button
              onClick={() => setGameState('playing')}
              className="bg-[#ADC178] text-[#4a5038] px-6 py-2 rounded-full font-bold shadow-lg"
            >
              Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

