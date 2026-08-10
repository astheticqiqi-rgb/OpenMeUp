import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, ArrowLeft, ArrowRight, ArrowUp, Target, Heart, Crosshair } from 'lucide-react';
import confetti from 'canvas-confetti';

const playSound = (type: 'jump' | 'shoot' | 'coin' | 'hit' | 'win') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'jump') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'shoot') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987, now);
      osc.frequency.setValueAtTime(1318, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'hit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'win') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.1);
      osc.frequency.setValueAtTime(783, now + 0.2);
      osc.frequency.setValueAtTime(1046, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {}
};

export const MarioShooterGame: React.FC = () => {
  const [gameMode, setGameMode] = useState<'mario' | 'shooter'>('mario');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef({ left: false, right: false, up: false, shoot: false });

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_mario_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const updateHighScore = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('openmeup_mario_highscore', newScore.toString());
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code) && gameState === 'playing') keysRef.current.up = true;
      if (['KeyF', 'KeyX', 'ShiftLeft'].includes(e.code) && gameState === 'playing') keysRef.current.shoot = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) keysRef.current.up = false;
      if (['KeyF', 'KeyX', 'ShiftLeft'].includes(e.code)) keysRef.current.shoot = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localScore = 0;

    let player = { x: 40, y: 200, width: 28, height: 32, vx: 0, vy: 0, isGrounded: false, facing: 'right' };
    let bullets: Array<{ x: number; y: number; vx: number }> = [];
    let enemies: Array<{ x: number; y: number; width: number; height: number; speed: number; type: 'goomba' | 'target' }> = [];
    let coins: Array<{ x: number; y: number; collected: boolean }> = [];
    let frameCount = 0;
    let lastShootTime = 0;

    // Generate initial coins
    for (let i = 0; i < 6; i++) {
      coins.push({ x: 100 + i * 50, y: 160 - Math.sin(i) * 30, collected: false });
    }

    const loop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky Background
      ctx.fillStyle = gameMode === 'mario' ? '#70C5FF' : '#2D3748';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(80 + (frameCount * 0.2) % 450 - 50, 50, 20, 0, Math.PI * 2);
      ctx.arc(100 + (frameCount * 0.2) % 450 - 50, 45, 25, 0, Math.PI * 2);
      ctx.arc(120 + (frameCount * 0.2) % 450 - 50, 50, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw Ground
      ctx.fillStyle = '#65934A';
      ctx.fillRect(0, 240, canvas.width, 60);
      ctx.fillStyle = '#8B5A2B';
      ctx.fillRect(0, 252, canvas.width, 48);

      // Player Movement
      if (keysRef.current.left) {
        player.vx = -3.8;
        player.facing = 'left';
      } else if (keysRef.current.right) {
        player.vx = 3.8;
        player.facing = 'right';
      } else {
        player.vx = 0;
      }

      if (keysRef.current.up && player.isGrounded) {
        player.vy = -9.2;
        player.isGrounded = false;
        if (soundEnabled) playSound('jump');
      }

      // Shooting logic
      if (keysRef.current.shoot && frameCount - lastShootTime > 12) {
        lastShootTime = frameCount;
        bullets.push({
          x: player.x + (player.facing === 'right' ? player.width : 0),
          y: player.y + 12,
          vx: player.facing === 'right' ? 7 : -7,
        });
        if (soundEnabled) playSound('shoot');
      }

      player.vy += 0.45; // Gravity
      player.x += player.vx;
      player.y += player.vy;

      // Bound player inside screen
      player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

      if (player.y + player.height >= 240) {
        player.y = 240 - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      // Draw Player (Mario character style)
      ctx.fillStyle = '#D32F2F'; // Red shirt
      ctx.fillRect(player.x, player.y + 10, player.width, player.height - 10);
      ctx.fillStyle = '#1976D2'; // Blue overalls
      ctx.fillRect(player.x + 4, player.y + 18, player.width - 8, 12);
      ctx.fillStyle = '#FFCC80'; // Face
      ctx.fillRect(player.x + 4, player.y, player.width - 8, 12);
      ctx.fillStyle = '#D32F2F'; // Red Cap
      ctx.fillRect(player.x + 2, player.y - 2, player.width - 2, 6);

      // Spawn Enemies / Targets
      if (frameCount % 90 === 0) {
        enemies.push({
          x: canvas.width + 20,
          y: gameMode === 'mario' ? 218 : 60 + Math.random() * 120,
          width: 22,
          height: 22,
          speed: 1.5 + Math.random() * 1.5,
          type: gameMode === 'mario' ? 'goomba' : 'target',
        });
      }

      // Update & Draw Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;

        // Draw bullet fireball
        ctx.fillStyle = '#FF9800';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
        ctx.fill();

        if (b.x < 0 || b.x > canvas.width) {
          bullets.splice(i, 1);
        }
      }

      // Update & Draw Coins
      coins.forEach((c) => {
        if (!c.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFA500';
          ctx.fillRect(c.x - 2, c.y - 4, 4, 8);

          // Collision with player
          if (
            Math.abs(player.x + player.width / 2 - c.x) < 16 &&
            Math.abs(player.y + player.height / 2 - c.y) < 16
          ) {
            c.collected = true;
            localScore += 100;
            updateHighScore(localScore);
            if (soundEnabled) playSound('coin');
          }
        }
      });

      // Respawn coins if all collected
      if (coins.every((c) => c.collected)) {
        coins.forEach((c) => (c.collected = false));
      }

      // Update & Draw Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.x -= e.speed;

        // Draw Enemy
        if (e.type === 'goomba') {
          ctx.fillStyle = '#8D6E63'; // Goomba brown
          ctx.fillRect(e.x, e.y, e.width, e.height);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(e.x + 3, e.y + 4, 4, 6);
          ctx.fillRect(e.x + 15, e.y + 4, 4, 6);
        } else {
          // Heart Target
          ctx.fillStyle = '#E91E63';
          ctx.beginPath();
          ctx.arc(e.x + 11, e.y + 11, 10, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bullet hit enemy
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          if (
            b.x > e.x &&
            b.x < e.x + e.width &&
            b.y > e.y &&
            b.y < e.y + e.height
          ) {
            enemies.splice(i, 1);
            bullets.splice(j, 1);
            localScore += 150;
            updateHighScore(localScore);
            if (soundEnabled) playSound('hit');
            break;
          }
        }

        // Player collision with enemy
        if (
          e &&
          player.x < e.x + e.width &&
          player.x + player.width > e.x &&
          player.y < e.y + e.height &&
          player.y + player.height > e.y
        ) {
          // Player stomps goomba
          if (player.vy > 0 && player.y + player.height - player.vy <= e.y + 8) {
            enemies.splice(i, 1);
            player.vy = -6;
            localScore += 200;
            updateHighScore(localScore);
            if (soundEnabled) playSound('jump');
          } else {
            // Game Over
            if (soundEnabled) playSound('hit');
            setGameState('gameover');
            return;
          }
        }

        if (e && e.x < -30) {
          enemies.splice(i, 1);
        }
      }

      // Draw Onscreen HUD
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`SCORE: ${localScore}`, 12, 20);
      ctx.fillText(`MODE: ${gameMode === 'mario' ? 'MARIO RUN' : 'DEFENDER'}`, 280, 20);

      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, [gameState, gameMode, soundEnabled]);

  const handleStartGame = () => {
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[32px] p-6 flex flex-col items-center text-slate-800">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-md mb-3 text-xs font-bold text-[#4a5038]">
        <div className="flex gap-2">
          <button
            onClick={() => setGameMode('mario')}
            className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${gameMode === 'mario' ? 'bg-[#68704F] text-white border-[#68704F] shadow-sm' : 'bg-stone-100 text-stone-600'}`}
          >
            🍄 Mario Runner
          </button>
          <button
            onClick={() => setGameMode('shooter')}
            className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${gameMode === 'shooter' ? 'bg-[#68704F] text-white border-[#68704F] shadow-sm' : 'bg-stone-100 text-stone-600'}`}
          >
            🎯 Heart Defender
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>🏆 High: {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-stone-500 hover:text-[#68704F]">
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full max-w-md aspect-[4/3] bg-sky-200 rounded-2xl overflow-hidden shadow-inner border-2 border-[#ADC178]">
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full block" />

        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic mb-1 text-[#E2ECE9]">Super Mario & Heart Defender</h3>
            <p className="text-xs text-stone-200 mb-4 max-w-xs">
              Run, jump over Goombas, collect gold coins, and fire fireball hearts!
            </p>
            <button
              onClick={handleStartGame}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4" /> Start Playing
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic text-pink-300 mb-1">Game Over!</h3>
            <p className="text-sm font-bold text-white mb-4">Final Score: {score}</p>
            <button
              onClick={handleStartGame}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Touch / Button Controls */}
      <div className="w-full max-w-md mt-4 flex items-center justify-between gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
        <div className="flex gap-2">
          <button
            onMouseDown={() => (keysRef.current.left = true)}
            onMouseUp={() => (keysRef.current.left = false)}
            onTouchStart={() => (keysRef.current.left = true)}
            onTouchEnd={() => (keysRef.current.left = false)}
            className="w-11 h-11 bg-white border border-stone-300 rounded-xl flex items-center justify-center shadow active:bg-stone-200 font-bold text-stone-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onMouseDown={() => (keysRef.current.right = true)}
            onMouseUp={() => (keysRef.current.right = false)}
            onTouchStart={() => (keysRef.current.right = true)}
            onTouchEnd={() => (keysRef.current.right = false)}
            className="w-11 h-11 bg-white border border-stone-300 rounded-xl flex items-center justify-center shadow active:bg-stone-200 font-bold text-stone-700"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onMouseDown={() => (keysRef.current.shoot = true)}
            onMouseUp={() => (keysRef.current.shoot = false)}
            onTouchStart={() => (keysRef.current.shoot = true)}
            onTouchEnd={() => (keysRef.current.shoot = false)}
            className="px-4 h-11 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-1 shadow active:scale-95 text-xs"
          >
            <Crosshair className="w-4 h-4" /> Shoot
          </button>

          <button
            onMouseDown={() => (keysRef.current.up = true)}
            onMouseUp={() => (keysRef.current.up = false)}
            onTouchStart={() => (keysRef.current.up = true)}
            onTouchEnd={() => (keysRef.current.up = false)}
            className="px-4 h-11 bg-[#68704F] hover:bg-[#535A3F] text-white font-bold rounded-xl flex items-center justify-center gap-1 shadow active:scale-95 text-xs"
          >
            <ArrowUp className="w-4 h-4" /> Jump
          </button>
        </div>
      </div>
      <span className="text-[10px] text-stone-400 mt-2">Keyboard: Arrow Keys / WASD + Space (Jump) + Shift / F (Shoot)</span>
    </div>
  );
};
