import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle2, Circle, Plus, Smile, Sparkles, Sun, Droplets, SmilePlus } from 'lucide-react';
import { DEFAULT_REMINDERS, DailyReminder } from '../data/content';
import confetti from 'canvas-confetti';

const playChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
};

export const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<DailyReminder[]>(DEFAULT_REMINDERS);
  const [mood, setMood] = useState<string>('cozy');
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('openmeup_reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveReminders = (items: DailyReminder[]) => {
    setReminders(items);
    localStorage.setItem('openmeup_reminders', JSON.stringify(items));
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) => {
      if (r.id === id) {
        const nextState = !r.completed;
        if (nextState) playChime();
        return { ...r, completed: nextState };
      }
      return r;
    });

    saveReminders(updated);

    if (updated.every((r) => r.completed)) {
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const newItem: DailyReminder = {
      id: Date.now().toString(),
      text: newText,
      category: 'heart',
      completed: false,
    };
    saveReminders([...reminders, newItem]);
    setNewText('');
  };

  const completedCount = reminders.filter((r) => r.completed).length;
  const progressPercent = reminders.length > 0 ? Math.round((completedCount / reminders.length) * 100) : 0;

  const moods = [
    { id: 'cozy', label: 'Cozy & Calm', icon: '🍵' },
    { id: 'happy', label: 'Happy & Loved', icon: '🌸' },
    { id: 'peaceful', label: 'Peaceful', icon: '🌿' },
    { id: 'grateful', label: 'Grateful', icon: '✨' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#ADC178] text-xs font-bold mb-2 shadow-sm">
          <Sun className="w-4 h-4 text-[#ADC178]" /> Daily Self-Care
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold italic tracking-tight text-white font-serif-title">Cozy Daily Reminders</h2>
        <p className="text-white/80 text-xs sm:text-sm mt-1">
          Take care of your mind, body, and gentle heart today.
        </p>
      </div>

      {/* Mood Tracker */}
      <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl mb-8 text-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#68704F] mb-3 text-center">
          How is your heart feeling right now?
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                mood === m.id
                  ? 'bg-[#68704F] text-white shadow-md scale-105'
                  : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <span className="text-base">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl mb-8 text-slate-800">
        <div className="flex justify-between items-center text-xs font-bold text-[#68704F] mb-2">
          <span>Daily Wellness Goal</span>
          <span>{completedCount} / {reminders.length} Completed ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#ADC178] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl p-6 mb-8 divide-y divide-stone-100 text-slate-800">
        {reminders.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleReminder(item.id)}
            className="flex items-center justify-between py-3.5 px-2 hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[#68704F] fill-[#ADC178] shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-stone-300 group-hover:text-[#ADC178] shrink-0" />
              )}
              <span className={`text-sm font-medium transition-all ${item.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                {item.text}
              </span>
            </div>
            {item.completed && <Sparkles className="w-4 h-4 text-[#ADC178] animate-bounce" />}
          </div>
        ))}
      </div>

      {/* Add Custom Reminder Form */}
      <form onSubmit={handleAddCustom} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a custom daily reminder..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-white/40 text-xs focus:ring-2 focus:ring-[#ADC178] focus:outline-none bg-white/95 backdrop-blur-md shadow-md"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-[#ADC178] hover:bg-white text-[#4a5038] text-xs font-bold rounded-2xl shadow-md transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>
    </div>
  );
};
