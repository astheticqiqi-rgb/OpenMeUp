import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const playBaseballSound = (type: 'pitch' | 'hit' | 'homerun' | 'miss') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'pitch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'hit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'homerun') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.1);
      osc.frequency.setValueAtTime(783, now + 0.2);
      osc.frequency.setValueAtTime(1046, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'miss') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {}
};

export const BaseballGame: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [homeRuns, setHomeRuns] = useState(0);
  const [outs, setOuts] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [resultMessage, setResultMessage] = useState<string>('Tap "Swing Bat" when the pitch arrives!');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballRef = useRef({ x: 80, y: 150, radius: 6, isPitching: false, speed: 4 });
  const batRef = useRef({ isSwinging: false, swingAngle: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_baseball_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const handleStartDerby = () => {
    setHomeRuns(0);
    setOuts(0);
    setResultMessage('Get ready for the first pitch!');
    setGameState('playing');
    pitchBall();
  };

  const pitchBall = () => {
    ballRef.current = {
      x: 80,
      y: 150,
      radius: 6,
      isPitching: true,
      speed: 3.5 + Math.random() * 2.5,
    };
    batRef.current = { isSwinging: false, swingAngle: 0 };
    if (soundEnabled) playBaseballSound('pitch');
  };

  const handleSwing = () => {
    if (gameState !== 'playing' || !ballRef.current.isPitching || batRef.current.isSwinging) return;

    batRef.current.isSwinging = true;
    const distToStrike = Math.abs(ballRef.current.x - 310);

    ballRef.current.isPitching = false;

    if (distToStrike < 12) {
      // Perfect Home Run!
      if (soundEnabled) playBaseballSound('homerun');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setResultMessage('🚀 HOME RUN! Over the center field fence!');
      setHomeRuns((prev) => {
        const newHR = prev + 1;
        if (newHR > highScore) {
          setHighScore(newHR);
          localStorage.setItem('openmeup_baseball_highscore', newHR.toString());
        }
        return newHR;
      });
    } else if (distToStrike < 28) {
      // Solid Hit
      if (soundEnabled) playBaseballSound('hit');
      setResultMessage('⚾ Solid Double into the gap!');
    } else if (distToStrike < 45) {
      // Foul Ball
      if (soundEnabled) playBaseballSound('hit');
      setResultMessage('⚾ Foul Ball down the line!');
    } else {
      // Strike / Out
      if (soundEnabled) playBaseballSound('miss');
      setResultMessage('❌ Swing and a Miss! Strike!');
      setOuts((prev) => {
        const newOuts = prev + 1;
        if (newOuts >= 5) {
          setGameState('gameover');
        }
        return newOuts;
      });
    }

    setTimeout(() => {
      if (outs < 4 && gameState === 'playing') {
        pitchBall();
      }
    }, 1800);
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

      // Grass Outfield
      ctx.fillStyle = '#65934A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dirt Diamond
      ctx.fillStyle = '#C29B62';
      ctx.beginPath();
      ctx.moveTo(200, 260); // Home Plate
      ctx.lineTo(340, 180); // 1st Base
      ctx.lineTo(200, 100); // 2nd Base
      ctx.lineTo(60, 180);  // 3rd Base
      ctx.closePath();
      ctx.fill();

      // Bases
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(195, 255, 10, 10); // Home
      ctx.fillRect(335, 175, 10, 10); // 1st
      ctx.fillRect(195, 95, 10, 10);  // 2nd
      ctx.fillRect(55, 175, 10, 10);  // 3rd

      // Outfield Wall
      ctx.strokeStyle = '#ADC178';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(200, 300, 260, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();

      // Pitcher
      ctx.fillStyle = '#1C1917';
      ctx.beginPath();
      ctx.arc(80, 150, 10, 0, Math.PI * 2);
      ctx.fill();

      // Batter & Strike Zone Marker
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(300, 130, 20, 40);

      // Draw Bat
      ctx.save();
      ctx.translate(320, 150);
      if (batRef.current.isSwinging) {
        ctx.rotate(-Math.PI / 3);
      } else {
        ctx.rotate(Math.PI / 6);
      }
      ctx.fillStyle = '#C29B62';
      ctx.fillRect(0, -3, 35, 6);
      ctx.restore();

      // Pitch Movement
      if (ballRef.current.isPitching) {
        ballRef.current.x += ballRef.current.speed;
        if (ballRef.current.x > canvas.width - 20) {
          ballRef.current.isPitching = false;
          if (soundEnabled) playBaseballSound('miss');
          setResultMessage('❌ Called Strike! Pitch went past.');
          setOuts((prev) => {
            const newOuts = prev + 1;
            if (newOuts >= 5) setGameState('gameover');
            return newOuts;
          });
          setTimeout(() => pitchBall(), 1500);
        }
      }

      // Draw Baseball
      if (ballRef.current.isPitching) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, [gameState, soundEnabled]);

  return (
    <div className="w-full bg-white border border-[#ADC178]/40 shadow-xl rounded-3xl p-6 flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-md mb-2 text-xs font-bold text-[#68704F]">
        <span>🚀 Home Runs: {homeRuns} | Outs: {outs}/5</span>
        <div className="flex items-center gap-2">
          <span>🏆 Derby High: {highScore}</span>
          <button onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 className="w-4 h-4 text-stone-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-md aspect-[4/3] bg-emerald-800 rounded-2xl overflow-hidden shadow-inner border-2 border-[#ADC178]">
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full block" />

        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic mb-2 text-[#E2ECE9]">⚾ Home Run Derby</h3>
            <p className="text-xs text-stone-300 mb-4 max-w-xs">
              Time your swing as the pitch crosses the strike zone to smash massive Home Runs!
            </p>
            <button
              onClick={handleStartDerby}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4" /> Start Derby
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
            <h3 className="text-2xl font-bold font-aesthetic text-amber-300 mb-1">Derby Completed! 🏆</h3>
            <p className="text-base font-bold text-white mb-4">Total Home Runs: {homeRuns}</p>
            <button
              onClick={handleStartDerby}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Derby Again
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-md mt-3 flex flex-col items-center gap-2">
        <p className="text-xs font-bold text-[#68704F] text-center">{resultMessage}</p>

        {gameState === 'playing' && (
          <button
            onClick={handleSwing}
            className="w-full py-3 bg-[#68704F] hover:bg-[#535A3F] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> SWING BAT!
          </button>
        )}
      </div>
    </div>
  );
};
