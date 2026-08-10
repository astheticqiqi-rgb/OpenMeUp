export interface MemoryPhoto {
  id: string;
  title: string;
  date: string;
  location: string;
  caption: string;
  imageUrl: string;
  tag: 'cozy' | 'travel' | 'funny' | 'celebration' | 'sweet';
}

export interface BibleVerse {
  id: string;
  reference: string;
  text: string;
  category: 'Love' | 'Peace' | 'Hope' | 'Strength' | 'Joy';
  reflection: string;
}

export interface DailyReminder {
  id: string;
  text: string;
  category: 'mindfulness' | 'body' | 'heart';
  completed: boolean;
}

export interface PuzzlePreset {
  id: string;
  name: string;
  image: string;
  gridSize: number;
}
