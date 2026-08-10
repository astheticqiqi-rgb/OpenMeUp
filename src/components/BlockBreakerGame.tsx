import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const playBeep = (freq: number, duration = 0.1, type: OscillatorType = 'sine') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

export const BlockBreakerGame: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'win'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paddleRef = useRef({ x: 160, width: 80, height: 12 });
  const ballRef = useRef({ x: 200, y: 220, dx: 3, dy: -3, radius: 7 });
  const bricksRef = useRef<Array<{ x: number; y: number; status: number; color: string }>>([]);

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_block_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const initBricks = () => {
    const rows = 4;
    const cols = 7;
    const brickWidth = 48;
    const brickHeight = 16;
    const padding = 6;
    const offsetLeft = 12;
    const offsetTop = 30;
    const colors = ['#ADC178', '#68704F', '#FFB7B2', '#E2ECE9'];

    const newBricks = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newBricks.push({
          x: c * (brickWidth + padding) + offsetLeft,
          y: r * (brickHeight + padding) + offsetTop,
          status: 1,
          color: colors[r % colors.length],
        });
      }
    }
    bricksRef.current = newBricks;
  };

  const handleStartGame = () => {
    setScore(0);
    setLives(3);
    paddleRef.current = { x: 160, width: 80, height: 12 };
    ballRef.current = { x: 200, y: 220, dx: 3.2, dy: -3.2, radius: 7 };
    initBricks();
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Bricks
      let activeBricksCount = 0;
      bricksRef.current.forEach((b) => {
        if (b.status === 1) {
          activeBricksCount++;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, 48, 16, 4);
          ctx.fill();
        }
      });

      if (activeBricksCount === 0) {
        if (soundEnabled) playBeep(880, 0.4, 'sine');
        confetti({ particleCount: 80, spread: 70 });
        setGameState('win');
        return;
      }

      // Draw Paddle
      const paddle = paddleRef.current;
      ctx.fillStyle = '#ADC178';
      ctx.beginPath();
      ctx.roundRect(paddle.x, canvas.height - 20, paddle.width, paddle.height, 6);
      ctx.fill();

      // Draw Ball
      const ball = ballRef.current;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Ball Movement
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall Bounce
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
        if (soundEnabled) playBeep(300, 0.05);
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
        if (soundEnabled) playBeep(300, 0.05);
      }

      // Paddle Bounce
      if (
        ball.y + ball.radius >= canvas.height - 20 &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        ball.dy = -Math.abs(ball.dy);
        const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.dx = hitPos * 4.5;
        if (soundEnabled) playBeep(450, 0.08);
      }

      // Bottom Loss
      if (ball.y + ball.radius > canvas.height) {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameover');
          } else {
            // Reset ball position
            ballRef.current = { x: 200, y: 220, dx: 3.2, dy: -3.2, radius: 7 };
          }
          return newLives;
        });
        if (soundEnabled) playBeep(150, 0.2, 'sawtooth');
      }

      // Brick Collisions
      bricksRef.current.forEach((b) => {
        if (b.status === 1) {
          if (
            ball.x > b.x &&
            ball.x < b.x + 48 &&
            ball.y - ball.radius < b.y + 16 &&
            ball.y + ball.radius > b.y
          ) {
            b.status = 0;
            ball.dy = -ball.dy;
            setScore((s) => {
              const ns = s + 50;
              if (ns > highScore) {
                setHighScore(ns);
                localStorage.setItem('openmeup_block_highscore', ns.toString());
              }
              return ns;
            });
            if (soundEnabled) playBeep(600, 0.08);
          }
        }
      });

      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, [gameState, soundEnabled, highScore]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    paddleRef.current.x = Math.max(0, Math.min(canvas.width - paddleRef.current.width, touchX - paddleRef.current.width / 2));
  };

  return (
    <div className="w-full bg-white border border-[#ADC178]/40 shadow-xl rounded-3xl p-6 flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-md mb-2 text-xs font-bold text-[#68704F]">
        <div className="flex items-center gap-1">
          <span>❤️ Lives: {lives}</span>
          <span className="ml-3">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🏆 High: {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 className="w-4 h-4 text-stone-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-md aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden shadow-inner border-2 border-[#ADC178]">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onPointerMove={handlePointerMove}
          className="w-full h-full block cursor-ew-resize touch-none"
        />

        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic mb-2 text-[#E2ECE9]">🧱 Cozy Block Breaker</h3>
            <p className="text-xs text-stone-300 mb-4">
              Slide your paddle to bounce the glowing sphere and break all colorful blocks!
            </p>
            <button
              onClick={handleStartGame}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4" /> Start Game
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic text-pink-300 mb-1">Out of Lives!</h3>
            <p className="text-sm font-bold mb-4">Final Score: {score}</p>
            <button
              onClick={handleStartGame}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {gameState === 'win' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic text-emerald-300 mb-1">You Cleared All Blocks! 🎉</h3>
            <p className="text-sm font-bold mb-4">Final Score: {score}</p>
            <button
              onClick={handleStartGame}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>
      <span className="text-[10px] text-stone-400 mt-2">Move mouse or drag finger to control paddle</span>
    </div>
  );
};
