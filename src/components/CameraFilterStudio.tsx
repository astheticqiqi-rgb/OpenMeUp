import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Download, Sparkles, Image as ImageIcon, Heart, Check, Sliders, Wand2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryPhoto } from '../data/content';

interface CameraFilterStudioProps {
  onClose: () => void;
  onSaveToMemories?: (memory: MemoryPhoto) => void;
  onUseForPuzzle?: (imageUrl: string) => void;
}

export interface FilterOption {
  id: string;
  name: string;
  icon: string;
  cssFilter: string;
  canvasFilter: string;
}

const FILTERS: FilterOption[] = [
  {
    id: 'normal',
    name: 'Normal',
    icon: '✨',
    cssFilter: 'none',
    canvasFilter: 'none',
  },
  {
    id: 'cozy-sage',
    name: 'Cozy Sage 🌿',
    icon: '🌿',
    cssFilter: 'sepia(0.25) hue-rotate(60deg) saturate(1.25) contrast(1.05)',
    canvasFilter: 'sepia(25%) hue-rotate(60deg) saturate(125%) contrast(105%)',
  },
  {
    id: 'warm-vintage',
    name: 'Warm Vintage ☕',
    icon: '☕',
    cssFilter: 'sepia(0.4) contrast(1.15) brightness(0.95) saturate(1.1)',
    canvasFilter: 'sepia(40%) contrast(115%) brightness(95%) saturate(110%)',
  },
  {
    id: 'pastel-bloom',
    name: 'Pastel Bloom 🌸',
    icon: '🌸',
    cssFilter: 'brightness(1.1) saturate(1.35) hue-rotate(-15deg) contrast(0.98)',
    canvasFilter: 'brightness(110%) saturate(135%) hue-rotate(-15deg) contrast(98%)',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour 🌅',
    icon: '🌅',
    cssFilter: 'sepia(0.3) saturate(1.5) brightness(1.05) hue-rotate(-20deg)',
    canvasFilter: 'sepia(30%) saturate(150%) brightness(105%) hue-rotate(-20deg)',
  },
  {
    id: 'noir-bw',
    name: 'Noir B&W 🖤',
    icon: '🖤',
    cssFilter: 'grayscale(1) contrast(1.25) brightness(0.95)',
    canvasFilter: 'grayscale(100%) contrast(125%) brightness(95%)',
  },
  {
    id: 'soft-dream',
    name: 'Soft Dream ☁️',
    icon: '☁️',
    cssFilter: 'contrast(0.95) brightness(1.12) saturate(1.25)',
    canvasFilter: 'contrast(95%) brightness(112%) saturate(125%)',
  },
];

const STICKERS = [
  { id: 'none', label: 'No Sticker', icon: '❌' },
  { id: 'date', label: 'Date Stamp', icon: '📅' },
  { id: 'puppy', label: 'Puppy Badge', icon: '🐶' },
  { id: 'cozy', label: 'Cozy Vibes', icon: '🌿' },
  { id: 'love', label: 'Love Stamp', icon: '♥' },
];

export const CameraFilterStudio: React.FC<CameraFilterStudioProps> = ({
  onClose,
  onSaveToMemories,
  onUseForPuzzle,
}) => {
  const [sourceMode, setSourceMode] = useState<'camera' | 'upload'>('camera');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(FILTERS[1]); // Default Cozy Sage
  const [selectedSticker, setSelectedSticker] = useState<string>('date');
  const [isFlash, setIsFlash] = useState(false);

  // Form details when saving to Memories
  const [title, setTitle] = useState('Camera Booth Snap 📸');
  const [caption, setCaption] = useState('Captured with cozy filters & love!');
  const [tag, setTag] = useState<'cozy' | 'sweet' | 'travel' | 'funny' | 'celebration'>('cozy');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or upload a photo instead.');
    }
  };

  useEffect(() => {
    if (sourceMode === 'camera' && !capturedImage) {
      startCamera();
    } else if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [sourceMode, capturedImage]);

  const handleTakeSnap = () => {
    if (!videoRef.current) return;
    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 250);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Draw image
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUploadedImage(dataUrl);
        setSourceMode('upload');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const activePhoto = capturedImage || uploadedImage;

  // Render final image with filter & sticker onto canvas for export
  const generateFinalCanvasDataUrl = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!activePhoto) {
        resolve('');
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activePhoto;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(activePhoto);
          return;
        }

        // Apply filter
        if (selectedFilter.canvasFilter !== 'none') {
          ctx.filter = selectedFilter.canvasFilter;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none'; // reset filter for stickers

        // Draw sticker / overlay text
        const fontSize = Math.max(16, Math.floor(canvas.height / 22));
        ctx.font = `bold ${fontSize}px sans-serif`;

        if (selectedSticker === 'date') {
          const dateText = `AUG ${new Date().getFullYear()} ♥ OPENMEUP`;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(20, canvas.height - fontSize * 2.2, ctx.measureText(dateText).width + 30, fontSize * 1.6);
          ctx.fillStyle = '#ADC178';
          ctx.fillText(dateText, 35, canvas.height - fontSize * 1.1);
        } else if (selectedSticker === 'puppy') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          const text = '🐶 Puppy Approved';
          ctx.fillRect(canvas.width - ctx.measureText(text).width - 40, 20, ctx.measureText(text).width + 25, fontSize * 1.5);
          ctx.fillStyle = '#4a5038';
          ctx.fillText(text, canvas.width - ctx.measureText(text).width - 28, 20 + fontSize);
        } else if (selectedSticker === 'cozy') {
          ctx.fillStyle = 'rgba(74, 80, 56, 0.85)';
          const text = '🌿 Cozy Vibes';
          ctx.fillRect(20, 20, ctx.measureText(text).width + 25, fontSize * 1.5);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(text, 32, 20 + fontSize);
        } else if (selectedSticker === 'love') {
          ctx.fillStyle = 'rgba(244, 114, 182, 0.85)';
          const text = '♥ Sweet Moments';
          ctx.fillRect(canvas.width - ctx.measureText(text).width - 40, canvas.height - fontSize * 2.2, ctx.measureText(text).width + 25, fontSize * 1.5);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(text, canvas.width - ctx.measureText(text).width - 28, canvas.height - fontSize * 1.1);
        }

        resolve(canvas.toDataURL('image/png'));
      };
    });
  };

  const handleSaveMemory = async () => {
    const finalUrl = await generateFinalCanvasDataUrl();
    if (!finalUrl) return;

    const newMemory: MemoryPhoto = {
      id: `cam-${Date.now()}`,
      title: title.trim() || 'Camera Snap',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: 'Cozy Photo Booth 📸',
      caption: caption.trim() || 'Captured with cozy filters!',
      imageUrl: finalUrl,
      tag: tag,
    };

    if (onSaveToMemories) {
      onSaveToMemories(newMemory);
    } else {
      // Fallback save to localStorage
      const existing = localStorage.getItem('openmeup_user_memories');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('openmeup_user_memories', JSON.stringify([newMemory, ...list]));
    }

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    onClose();
  };

  const handleSendToPuzzle = async () => {
    const finalUrl = await generateFinalCanvasDataUrl();
    if (!finalUrl) return;

    if (onUseForPuzzle) {
      onUseForPuzzle(finalUrl);
      onClose();
    }
  };

  const handleDownload = async () => {
    const finalUrl = await generateFinalCanvasDataUrl();
    if (!finalUrl) return;

    const a = document.createElement('a');
    a.href = finalUrl;
    a.download = `cozy-photo-${Date.now()}.png`;
    a.click();
  };

  const retake = () => {
    setCapturedImage(null);
    setUploadedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-2xl max-w-2xl w-full p-5 sm:p-8 text-slate-800 relative my-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#ADC178] text-[#4a5038] flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold italic font-serif-title text-[#68704F]">Camera & Filter Studio</h2>
              <p className="text-xs text-stone-500 font-medium">Snap or upload photos with cozy aesthetic filters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Selector & Input Controls */}
        {!activePhoto && (
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => {
                setSourceMode('camera');
                setUploadedImage(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                sourceMode === 'camera'
                  ? 'bg-[#68704F] text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Camera className="w-4 h-4" /> Live Webcam
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                sourceMode === 'upload'
                  ? 'bg-[#68704F] text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Upload Photo
            </button>
          </div>
        )}

        {/* Live Video / Captured Image Frame */}
        <div className="relative w-full max-w-md mx-auto aspect-[4/3] bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-6">
          {/* Flash Effect */}
          {isFlash && <div className="absolute inset-0 bg-white z-40 animate-ping" />}

          {!activePhoto ? (
            sourceMode === 'camera' ? (
              cameraError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-stone-800">
                  <Camera className="w-12 h-12 text-rose-400 mb-2 opacity-60" />
                  <p className="text-xs font-medium text-stone-300 mb-4">{cameraError}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#ADC178] text-[#4a5038] text-xs font-bold shadow-md hover:bg-white transition-colors cursor-pointer"
                  >
                    Upload Photo Instead
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100 transition-all duration-300"
                    style={{ filter: selectedFilter.cssFilter }}
                  />
                  {/* Shutter Button Overlay */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={handleTakeSnap}
                      className="w-16 h-16 rounded-full bg-white border-4 border-[#ADC178] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                      title="Take Snapshot"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#68704F] group-hover:bg-[#ADC178] transition-colors" />
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-stone-400 bg-stone-800">
                <ImageIcon className="w-12 h-12 mb-2 text-[#ADC178]" />
                <p className="text-xs font-medium mb-3 text-stone-300">Choose a photo from your computer</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#ADC178] text-[#4a5038] text-xs font-bold shadow-md hover:bg-white transition-colors cursor-pointer"
                >
                  Browse Files
                </button>
              </div>
            )
          ) : (
            <div className="relative w-full h-full">
              <img
                src={activePhoto}
                alt="Captured"
                className="w-full h-full object-cover transition-all duration-300"
                style={{ filter: selectedFilter.cssFilter }}
              />

              {/* Sticker Overlay Preview */}
              {selectedSticker === 'date' && (
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[#ADC178] font-bold text-xs tracking-wider">
                  AUG {new Date().getFullYear()} ♥ OPENMEUP
                </div>
              )}
              {selectedSticker === 'puppy' && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[#4a5038] font-bold text-xs shadow-md">
                  🐶 Puppy Approved
                </div>
              )}
              {selectedSticker === 'cozy' && (
                <div className="absolute top-3 left-3 bg-[#4a5038]/90 backdrop-blur-md px-3 py-1 rounded-lg text-white font-bold text-xs shadow-md">
                  🌿 Cozy Vibes
                </div>
              )}
              {selectedSticker === 'love' && (
                <div className="absolute bottom-3 right-3 bg-pink-500/90 backdrop-blur-md px-3 py-1 rounded-lg text-white font-bold text-xs shadow-md">
                  ♥ Sweet Moments
                </div>
              )}

              {/* Retake Button */}
              <button
                onClick={retake}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
                title="Retake or Change Photo"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Filter Selection Slider/Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#68704F] uppercase tracking-wider">
            <Wand2 className="w-4 h-4 text-[#ADC178]" /> Select Aesthetic Filter:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter.id === f.id
                    ? 'bg-[#68704F] text-white shadow-md scale-105'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{f.icon}</span>
                <span>{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sticker / Stamp Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#68704F] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#ADC178]" /> Add Photo Badge / Stamp:
          </div>
          <div className="flex flex-wrap gap-2">
            {STICKERS.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedSticker(st.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSticker === st.id
                    ? 'bg-[#ADC178] text-[#4a5038] shadow-md border border-[#ADC178]'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save Options & Form (Shown when captured or uploaded) */}
        {activePhoto && (
          <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-stone-200 mb-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#68704F]">Memory Details:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Memory Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none bg-white"
              />
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none bg-white"
              >
                <option value="cozy">Cozy Tag</option>
                <option value="sweet">Sweet Tag</option>
                <option value="travel">Travel Tag</option>
                <option value="funny">Funny Tag</option>
                <option value="celebration">Celebration Tag</option>
              </select>
            </div>
            <textarea
              rows={2}
              placeholder="Caption or sweet reflection..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#68704F] focus:outline-none bg-white"
            />
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {activePhoto && (
            <>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download
              </button>

              {onUseForPuzzle && (
                <button
                  onClick={handleSendToPuzzle}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#ADC178] hover:bg-[#68704F] text-[#4a5038] hover:text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  <ArrowRight className="w-4 h-4" /> Play in Puzzle
                </button>
              )}

              <button
                onClick={handleSaveMemory}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#68704F] hover:bg-[#535A3F] text-white text-xs font-bold transition-colors shadow-lg cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" /> Save to Memories
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
