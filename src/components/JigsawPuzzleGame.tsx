import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Eye, Trophy, Sparkles, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Tile {
  id: number;
  currentPos: number;
  correctPos: number;
}

export const JigsawPuzzleGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<3 | 4>(3);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop'
  );
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const photoOptions = [
    { id: '1', name: 'Puppy Meadow', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop' },
    { id: '2', name: 'Cozy Coffee', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop' },
    { id: '3', name: 'Golden Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
  ];

  const initPuzzle = () => {
    const total = gridSize * gridSize;
    const initialTiles: Tile[] = [];
    for (let i = 0; i < total; i++) {
      initialTiles.push({ id: i, currentPos: i, correctPos: i });
    }

    // Shuffle tiles
    const shuffled = [...initialTiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].currentPos, shuffled[j].currentPos] = [shuffled[j].currentPos, shuffled[i].currentPos];
    }

    setTiles(shuffled);
    setSelectedIndex(null);
    setMoves(0);
    setIsSolved(false);
    setGameStarted(true);
  };

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      // Swap tiles at selectedIndex and index
      const newTiles = [...tiles];
      const temp = newTiles[selectedIndex].currentPos;
      newTiles[selectedIndex].currentPos = newTiles[index].currentPos;
      newTiles[index].currentPos = temp;

      setTiles(newTiles);
      setSelectedIndex(null);
      setMoves((m) => m + 1);

      // Check if puzzle is solved
      const solved = newTiles.every((tile, idx) => tile.currentPos === idx);
      if (solved) {
        setIsSolved(true);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="w-full bg-white border border-[#ADC178]/40 shadow-xl rounded-3xl p-6 flex flex-col items-center">
      {/* Top Photo & Grid Size Selector */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-md mb-4 gap-2">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl">
          {photoOptions.map((photo) => (
            <button
              key={photo.id}
              onClick={() => {
                setSelectedPhoto(photo.url);
                setGameStarted(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${selectedPhoto === photo.url ? 'bg-[#68704F] text-white' : 'text-stone-600'}`}
            >
              {photo.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setGridSize(gridSize === 3 ? 4 : 3);
              setGameStarted(false);
            }}
            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
          >
            Grid: {gridSize}x{gridSize}
          </button>
        </div>
      </div>

      {/* Main Puzzle Board View */}
      <div className="relative w-full max-w-md aspect-square bg-stone-100 rounded-2xl overflow-hidden shadow-inner border-2 border-[#ADC178] p-2">
        {!gameStarted ? (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center z-10">
            <h3 className="text-2xl font-bold font-aesthetic mb-2 text-[#E2ECE9]">🧩 Jigsaw Photo Puzzle</h3>
            <p className="text-xs text-stone-200 mb-4 max-w-xs">
              Click two tiles to swap their positions and reconstruct the photo memory!
            </p>
            <button
              onClick={initPuzzle}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Play className="w-4 h-4" /> Start Jigsaw
            </button>
          </div>
        ) : (
          <div
            className="grid gap-1 w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((tile, idx) => {
              const row = Math.floor(tile.currentPos / gridSize);
              const col = tile.currentPos % gridSize;
              const bgPosX = (col / (gridSize - 1)) * 100;
              const bgPosY = (row / (gridSize - 1)) * 100;

              return (
                <div
                  key={tile.id}
                  onClick={() => handleTileClick(idx)}
                  className={`relative w-full h-full rounded-lg overflow-hidden cursor-pointer transition-all ${selectedIndex === idx ? 'ring-4 ring-[#68704F] scale-95 z-10' : 'hover:opacity-90'}`}
                  style={{
                    backgroundImage: `url(${selectedPhoto})`,
                    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                  }}
                >
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/50 text-white px-1 rounded font-bold">
                    {tile.currentPos + 1}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {isSolved && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center z-20">
            <h3 className="text-2xl font-bold font-aesthetic text-emerald-300 mb-1">Puzzle Solved! 🎉</h3>
            <p className="text-sm font-bold mb-4">Completed in {moves} swaps!</p>
            <button
              onClick={initPuzzle}
              className="bg-[#ADC178] hover:bg-[#68704F] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* Controls HUD */}
      {gameStarted && (
        <div className="flex items-center justify-between w-full max-w-md mt-3 px-2 text-xs font-bold text-stone-600">
          <span>Swaps: {moves}</span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1 text-[#68704F] hover:underline"
          >
            <Eye className="w-4 h-4" /> {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button onClick={initPuzzle} className="text-stone-400 hover:text-stone-600">
            Reshuffle
          </button>
        </div>
      )}

      {showPreview && (
        <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border-2 border-[#ADC178] shadow">
          <img src={selectedPhoto} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};
