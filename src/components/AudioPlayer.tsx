import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, SkipForward, Sparkles } from 'lucide-react';

export interface AudioPlayerProps {
  autoPlayOnInteraction?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ autoPlayOnInteraction }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [currentTrack, setCurrentTrack] = useState<'lofi' | 'piano' | 'acoustic'>('lofi');
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isSetupRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const tracks = [
    { id: 'lofi', name: 'Cozy Lofi Chords', desc: 'Soft warm vinyl pads & ambient beats' },
    { id: 'piano', name: 'Gentle Rain & Piano', desc: 'Relaxing ambient piano notes' },
    { id: 'acoustic', name: 'Sweet Acoustic Breeze', desc: 'Uplifting warm acoustic harmony' },
  ];

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playChordSequence = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Frequencies for cozy chords (Cmaj7, Am7, Fmaj7, G6)
    let chordFreqs: number[][] = [];
    if (currentTrack === 'lofi') {
      chordFreqs = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];
    } else if (currentTrack === 'piano') {
      chordFreqs = [
        [329.63, 392.00, 523.25, 659.25], // E, G, C, E
        [293.66, 349.23, 440.00, 587.33], // D, F, A, D
        [261.63, 329.63, 392.00, 523.25], // C, E, G, C
        [246.94, 293.66, 392.00, 493.88], // B, D, G, B
      ];
    } else {
      chordFreqs = [
        [196.00, 293.66, 392.00, 493.88], // G, D, G, B
        [164.81, 246.94, 329.63, 392.00], // E, B, E, G
        [174.61, 261.63, 349.23, 440.00], // F, C, F, A
        [196.00, 293.66, 392.00, 440.00], // G, D, G, A
      ];
    }

    const currentVolume = isMuted ? 0 : volume * 0.18;

    // Pick a random chord from set
    const chord = chordFreqs[Math.floor(Math.random() * chordFreqs.length)];

    chord.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm sine / triangle mix
        osc.type = currentTrack === 'lofi' ? 'sine' : currentTrack === 'piano' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Soft envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(currentVolume, now + 0.3 + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8 + idx * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + 3.0);
      } catch {}
    });
  };

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      playChordSequence();
      const interval = window.setInterval(() => {
        playChordSequence();
      }, 2400);
      return () => window.clearInterval(interval);
    }
  }, [isPlaying, currentTrack, volume, isMuted]);

  const togglePlay = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex].id as any);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-3 transition-all hover:bg-white/15">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-[#ADC178] hover:bg-white text-[#4a5038] flex items-center justify-center transition-colors shadow-md cursor-pointer"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
        </button>

        <button
          onClick={nextTrack}
          className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
          title="Next Track"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="hidden sm:flex flex-col text-left">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Music className={`w-3 h-3 text-[#ADC178] ${isPlaying ? 'animate-bounce' : ''}`} />
          {tracks.find(t => t.id === currentTrack)?.name}
        </span>
        <span className="text-[10px] text-white/60">
          {tracks.find(t => t.id === currentTrack)?.desc}
        </span>
      </div>

      {/* Visual equalizer bars when playing */}
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-4 px-1">
          <span className="w-1 bg-[#ADC178] rounded-full animate-pulse h-3" />
          <span className="w-1 bg-white rounded-full animate-pulse h-4 delay-75" />
          <span className="w-1 bg-[#ADC178] rounded-full animate-pulse h-2 delay-150" />
        </div>
      )}

      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-white/70 hover:text-white p-1 rounded-full cursor-pointer"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-14 h-1 accent-[#ADC178] bg-white/20 rounded-lg cursor-pointer hidden md:block"
        />
      </div>
    </div>
  );
};
