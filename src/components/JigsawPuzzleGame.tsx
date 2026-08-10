import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Trophy, Upload, ImagePlus, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PUZZLE_PRESETS } from '../data/content';
import { PuzzlePreset } from '../types';
import { CameraFilterStudio } from './CameraFilterStudio';

export const JigsawPuzzleGame: React.FC = () => {
  const [presets, setPresets] = useState<PuzzlePreset[]>(PUZZLE_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState<PuzzlePreset>(PUZZLE_PRESETS[0]);
  const [gridSize, setGridSize] = useState<number>(PUZZLE_PRESETS[0].gridSize);
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCameraStudioOpen, setIsCameraStudioOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initializePuzzle = () => {
    const total = gridSize * gridSize;
    const initial = Array.from({ length: total }, (_, i) => i);
    let shuffled = [...initial];
    // Ensure the initial shuffle isn't already solved
    while (JSON.stringify(shuffled) === JSON.stringify(initial)) {
      shuffled.sort(() => Math.random() - 0.5);
    }
    setPieces(shuffled);
    setSelectedPiece(null);
    setMoves(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    setGridSize(selectedPreset.gridSize);
  }, [selectedPreset]);

  useEffect(() => {
    initializePuzzle();
  }, [selectedPreset, gridSize]);

  const handleTileClick = (index: number) => {
    if (isCompleted) return;

    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      // Swap piece at selectedPiece with tile at index
      const newPieces = [...pieces];
      const temp = newPieces[selectedPiece];
      newPieces[selectedPiece] = newPieces[index];
      newPieces[index] = temp;

      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves((m) => m + 1);

      // Check win condition
      const isSolved = newPieces.every((val, i) => val === i);
      if (isSolved) {
        setIsCompleted(true);
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const customPreset: PuzzlePreset = {
        id: `custom-${Date.now()}`,
        name: `My Imported Photo 📷`,
        image: dataUrl,
        gridSize: 3,
      };

      setPresets((prev) => [customPreset, ...prev]);
      setSelectedPreset(customPreset);
      setGridSize(3);
    };
    reader.readAsDataURL(file);
    // Reset input value
    e.target.value = '';
  };

  return (
    <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-2xl border border-white/50 max-w-xl mx-auto text-center text-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-serif-title font-bold text-lg text-[#68704F] text-left">
            {selectedPreset.name}
          </h3>
          <p className="text-[11px] text-stone-500 text-left">
            Click two tiles to swap their positions until the picture is whole!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#68704F] bg-[#ADC178]/20 px-3 py-1.5 rounded-full border border-[#ADC178]/30">
            Moves: {moves}
          </span>
          <button
            onClick={initializePuzzle}
            className="p-2 rounded-full bg-[#ADC178] text-[#4a5038] hover:bg-[#68704F] hover:text-white transition-all shadow-md cursor-pointer"
            title="Restart Puzzle"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Chooser & Import / Camera Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 justify-start sm:justify-center no-scrollbar">
        <button
          onClick={() => setIsCameraStudioOpen(true)}
          className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full font-bold bg-[#68704F] hover:bg-[#535A3F] text-white shadow-md transition-all cursor-pointer shrink-0"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Camera Snap</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full font-bold bg-[#ADC178] hover:bg-[#68704F] text-white shadow-md transition-all cursor-pointer shrink-0"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          <span>Import File</span>
        </button>

        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPreset(p)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer shrink-0 ${
              selectedPreset.id === p.id
                ? 'bg-[#68704F] text-white shadow-md'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Difficulty / Grid Size Selector */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Grid Size:</span>
        {[3, 4, 5].map((size) => (
          <button
            key={size}
            onClick={() => setGridSize(size)}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              gridSize === size
                ? 'bg-[#68704F] text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
            }`}
          >
            {size}x{size}
          </button>
        ))}
      </div>

      {/* Puzzle Board Grid */}
      <div
        className="grid gap-1 bg-[#4a5038] p-2 rounded-2xl shadow-inner mx-auto aspect-square max-w-[360px] relative overflow-hidden border border-white/20"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {pieces.map((pieceVal, tileIdx) => {
          const row = Math.floor(pieceVal / gridSize);
          const col = pieceVal % gridSize;
          const isSelected = selectedPiece === tileIdx;
          const isCorrect = pieceVal === tileIdx;

          return (
            <button
              key={tileIdx}
              onClick={() => handleTileClick(tileIdx)}
              className={`relative aspect-square w-full rounded-lg overflow-hidden transition-all duration-200 border-2 cursor-pointer ${
                isSelected
                  ? 'border-rose-500 scale-95 shadow-2xl z-10'
                  : isCorrect && isCompleted
                  ? 'border-emerald-400'
                  : 'border-white/50 hover:opacity-90'
              }`}
              style={{
                backgroundImage: `url(${selectedPreset.image})`,
                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
              }}
            >
              {!isCompleted && (
                <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/50 text-white px-1 rounded">
                  {pieceVal + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className="mt-4 p-4 rounded-2xl bg-[#ADC178]/20 border border-[#ADC178] text-center animate-bounce">
          <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-1" />
          <h4 className="font-serif-title font-bold text-sm text-[#68704F]">Wonderful Job! 🎉</h4>
          <p className="text-xs text-[#68704F]/90 font-medium">You completed the puzzle in {moves} moves!</p>
        </div>
      )}

      {/* Camera & Filter Studio Modal */}
      {isCameraStudioOpen && (
        <CameraFilterStudio
          onClose={() => setIsCameraStudioOpen(false)}
          onUseForPuzzle={(filteredDataUrl) => {
            const customPreset: PuzzlePreset = {
              id: `custom-cam-${Date.now()}`,
              name: `Camera Snap 📷`,
              image: filteredDataUrl,
              gridSize: gridSize,
            };
            setPresets((prev) => [customPreset, ...prev]);
            setSelectedPreset(customPreset);
            setIsCameraStudioOpen(false);
          }}
        />
      )}
    </div>
  );
};

