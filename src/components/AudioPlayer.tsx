import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, SkipForward, FolderPlus, ListMusic, Trash2, X } from 'lucide-react';

export interface AudioPlayerProps {
  autoPlayOnInteraction?: boolean;
}

export interface CustomTrack {
  id: string;
  name: string;
  desc: string;
  url: string;
  isCustom: boolean;
}

const BUILT_IN_TRACKS: CustomTrack[] = [
  { id: 'lofi', name: 'Cozy Lofi Chords', desc: 'Soft warm vinyl pads & ambient beats', url: '', isCustom: false },
  { id: 'piano', name: 'Gentle Rain & Piano', desc: 'Relaxing ambient piano notes', url: '', isCustom: false },
  { id: 'acoustic', name: 'Sweet Acoustic Breeze', desc: 'Uplifting warm acoustic harmony', url: '', isCustom: false },
];

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ autoPlayOnInteraction }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [tracks, setTracks] = useState<CustomTrack[]>(BUILT_IN_TRACKS);
  const [currentTrackId, setCurrentTrackId] = useState<string>('lofi');
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const activeTrack = tracks.find((t) => t.id === currentTrackId) || tracks[0];

  // Initialize Web Audio API for synth ambient tracks
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Play procedural synth chords for built-in tracks
  const playChordSequence = () => {
    if (activeTrack.isCustom) return;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    let chordFreqs: number[][] = [];
    if (activeTrack.id === 'lofi') {
      chordFreqs = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];
    } else if (activeTrack.id === 'piano') {
      chordFreqs = [
        [329.63, 392.00, 523.25, 659.25],
        [293.66, 349.23, 440.00, 587.33],
        [261.63, 329.63, 392.00, 523.25],
        [246.94, 293.66, 392.00, 493.88],
      ];
    } else {
      chordFreqs = [
        [196.00, 293.66, 392.00, 493.88],
        [164.81, 246.94, 329.63, 392.00],
        [174.61, 261.63, 349.23, 440.00],
        [196.00, 293.66, 392.00, 440.00],
      ];
    }

    const currentVolume = isMuted ? 0 : volume * 0.18;
    const chord = chordFreqs[Math.floor(Math.random() * chordFreqs.length)];

    chord.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = activeTrack.id === 'lofi' ? 'sine' : activeTrack.id === 'piano' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

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

  // Handle custom track audio element
  useEffect(() => {
    if (activeTrack.isCustom && activeTrack.url) {
      if (!customAudioRef.current) {
        customAudioRef.current = new Audio();
      }
      const audio = customAudioRef.current;
      audio.src = activeTrack.url;
      audio.volume = isMuted ? 0 : volume;
      audio.loop = true;

      if (isPlaying) {
        audio.play().catch(console.error);
      } else {
        audio.pause();
      }
    } else {
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
    }
  }, [activeTrack, isPlaying]);

  // Update volume on custom audio
  useEffect(() => {
    if (customAudioRef.current) {
      customAudioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Interval loop for procedural ambient tracks
  useEffect(() => {
    if (isPlaying && !activeTrack.isCustom) {
      initAudio();
      playChordSequence();
      const interval = window.setInterval(() => {
        playChordSequence();
      }, 2400);
      return () => window.clearInterval(interval);
    }
  }, [isPlaying, currentTrackId, volume, isMuted]);

  const togglePlay = () => {
    if (!activeTrack.isCustom) {
      initAudio();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrackId(tracks[nextIndex].id);
  };

  // Import custom audio files from computer or folder
  const handleMusicImport = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newTracks: CustomTrack[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
        const objectUrl = URL.createObjectURL(file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        newTracks.push({
          id: `custom-${Date.now()}-${Math.random()}`,
          name: cleanName,
          desc: `Imported • ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          url: objectUrl,
          isCustom: true,
        });
      }
    });

    if (newTracks.length > 0) {
      setTracks((prev) => [...prev, ...newTracks]);
      setCurrentTrackId(newTracks[0].id);
      setIsPlaying(true);
      setIsPlaylistOpen(true);
    }
  };

  const removeCustomTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tracks.filter((t) => t.id !== id);
    setTracks(updated);
    if (currentTrackId === id) {
      setCurrentTrackId(updated[0]?.id || 'lofi');
    }
  };

  return (
    <div className="relative">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
        multiple
        onChange={(e) => handleMusicImport(e.target.files)}
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
        multiple
        {...({ webkitdirectory: '', directory: '' } as any)}
        onChange={(e) => handleMusicImport(e.target.files)}
        className="hidden"
      />

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

        {/* Track Title & Desc Display */}
        <div className="hidden sm:flex flex-col text-left max-w-[180px] md:max-w-[220px]">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
            <Music className={`w-3 h-3 text-[#ADC178] shrink-0 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span className="truncate">{activeTrack.name}</span>
          </span>
          <span className="text-[10px] text-white/60 truncate">
            {activeTrack.desc}
          </span>
        </div>

        {/* Equalizer animation */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-4 px-1">
            <span className="w-1 bg-[#ADC178] rounded-full animate-pulse h-3" />
            <span className="w-1 bg-white rounded-full animate-pulse h-4 delay-75" />
            <span className="w-1 bg-[#ADC178] rounded-full animate-pulse h-2 delay-150" />
          </div>
        )}

        {/* Import Folder / Files & Playlist Toggle */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-[#ADC178] hover:text-[#4a5038] text-white text-[11px] font-bold transition-all cursor-pointer border border-white/20"
            title="Import Music Folder from PC"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Import Music</span>
          </button>

          <button
            onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isPlaylistOpen ? 'bg-[#ADC178] text-[#4a5038]' : 'text-white/80 hover:text-white hover:bg-white/15'
            }`}
            title="Open Playlist"
          >
            <ListMusic className="w-4 h-4" />
          </button>

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

      {/* Playlist Popover Dropdown */}
      {isPlaylistOpen && (
        <div className="absolute top-12 right-0 w-80 bg-stone-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-4 text-white z-50 text-left animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-[#ADC178] uppercase tracking-wider flex items-center gap-1.5">
              <ListMusic className="w-4 h-4" /> Music Playlist ({tracks.length})
            </span>
            <button
              onClick={() => setIsPlaylistOpen(false)}
              className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => folderInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#ADC178] hover:bg-white text-[#4a5038] text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Import Folder</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/20"
            >
              <span>Import Files</span>
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
            {tracks.map((track) => (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrackId(track.id);
                  setIsPlaying(true);
                }}
                className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-medium cursor-pointer transition-all ${
                  currentTrackId === track.id
                    ? 'bg-[#ADC178]/25 text-[#ADC178] border border-[#ADC178]/40'
                    : 'bg-white/5 hover:bg-white/10 text-white/80'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <Music className={`w-3.5 h-3.5 shrink-0 ${currentTrackId === track.id ? 'text-[#ADC178]' : 'text-white/40'}`} />
                  <div className="truncate">
                    <p className="font-bold truncate">{track.name}</p>
                    <p className="text-[10px] text-white/50 truncate">{track.desc}</p>
                  </div>
                </div>

                {track.isCustom && (
                  <button
                    onClick={(e) => removeCustomTrack(track.id, e)}
                    className="p-1 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove imported song"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

