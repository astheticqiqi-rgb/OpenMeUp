import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Gamepad } from 'lucide-react';

export const BaseballGame: React.FC = () => {
  const [iframeKey, setIframeKey] = useState(0);

  const flappyUrl = 'https://flappybird.guru/';

  return (
    <div className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[32px] p-6 flex flex-col items-center text-slate-800">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between w-full mb-4 pb-3 border-b border-stone-200 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐤</span>
          <div className="text-left">
            <h3 className="font-bold text-lg text-[#4a5038] font-serif-title leading-tight">Flappy Bird Game</h3>
            <p className="text-[11px] text-stone-500">Flap your wings and fly through green pipes!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#ADC178] text-[#4a5038] shadow-sm flex items-center gap-1">
            <Gamepad className="w-3.5 h-3.5" /> FlappyBird.guru
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        {/* Iframe Viewport Container */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-sky-100 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#ADC178] group">
          <iframe
            key={iframeKey}
            src={flappyUrl}
            title="Flappy Bird Game"
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
            href={flappyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#ADC178] hover:bg-[#68704F] text-[#4a5038] hover:text-white font-bold transition-all shadow-md cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Full Tab</span>
          </a>
        </div>
      </div>
    </div>
  );
};

