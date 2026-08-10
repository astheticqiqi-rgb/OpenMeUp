import { PuzzlePreset } from '../types';
import memImg1 from '../assets/images/cozy_cafe_aesthetic_1786352347476.jpg';
import memImg2 from '../assets/images/regenerated_image_1786352002106.jpg';
import memImg3 from '../assets/images/regenerated_image_1786352003050.jpg';

export interface MemoryPhoto {
  id: string;
  title: string;
  date: string;
  location: string;
  caption: string;
  imageUrl: string;
  tag: 'cozy' | 'travel' | 'funny' | 'celebration' | 'sweet';
}

export const PUZZLE_PRESETS: PuzzlePreset[] = [
  {
    id: 'puz-1',
    name: 'Sunlit Sunflowers 🌻',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop',
    gridSize: 3
  },
  {
    id: 'puz-2',
    name: 'Cozy Coffee & Flowers ☕',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    gridSize: 3
  },
  {
    id: 'puz-3',
    name: 'Cute Golden Puppy 🐶',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop',
    gridSize: 4
  },
  {
    id: 'puz-4',
    name: 'Pastel Sunset Beach 🌅',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    gridSize: 4
  }
];

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

export const DEFAULT_LETTER = {
  recipient: 'My Favorite Person',
  sender: 'Always Yours',
  date: 'August 10, 2026',
  title: 'Open Me Up 💌',
  content: `I built this cozy little corner of the internet just for you! 

Every moment spent with you feels like a quiet sunbeam on a Sunday morning. Whether we are laughing at silly jokes, eating good food, or playing arcade games together, you bring so much warmth, comfort, and joy into my life.

I hope whenever you open this up, you're reminded of how deeply appreciated, loved, and special you truly are. Explore the little arcade games, read through the photo memories, check out today's Bible verses, and take a moment to breathe softly.

Thank you for being your wonderful, amazing self! Here's to making countless more sweet memories together. ✨🌿`,
  selectedStamp: 'puppy',
  fontStyle: 'handwriting' as 'handwriting' | 'script' | 'serif',
};

export const DEFAULT_MEMORIES: MemoryPhoto[] = [];

export const DEFAULT_BIBLE_VERSES: BibleVerse[] = [
  {
    id: 'v1',
    reference: '1 Corinthians 16:14',
    text: 'Do everything in love.',
    category: 'Love',
    reflection: 'Let gentleness and genuine care guide every word, action, and thought today.'
  },
  {
    id: 'v2',
    reference: 'Philippians 4:6-7',
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts.',
    category: 'Peace',
    reflection: 'Rest your mind. Let go of worry and trust that you are held in grace.'
  },
  {
    id: 'v3',
    reference: 'Psalm 118:24',
    text: 'This is the day that the LORD has made; let us rejoice and be glad in it.',
    category: 'Joy',
    reflection: 'Today is a gift. Look around for small reasons to smile and feel thankful.'
  },
  {
    id: 'v4',
    reference: 'Isaiah 40:31',
    text: 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    category: 'Strength',
    reflection: 'When you feel tired, take a pause. Strength comes softly when you quiet your heart.'
  },
  {
    id: 'v5',
    reference: 'Jeremiah 29:11',
    text: 'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.',
    category: 'Hope',
    reflection: 'Your steps are guided with love, purpose, and good hope ahead.'
  },
  {
    id: 'v6',
    reference: '1 John 4:19',
    text: 'We love because He first loved us.',
    category: 'Love',
    reflection: 'Love flows naturally when we remember how abundantly we are cherished.'
  }
];

export const DEFAULT_REMINDERS: DailyReminder[] = [
  { id: 'r1', text: 'Drink a big warm cup of water or tea 🍵', category: 'body', completed: false },
  { id: 'r2', text: 'Take 3 deep breaths and relax your shoulders 🌿', category: 'mindfulness', completed: false },
  { id: 'r3', text: 'Smile at yourself in the mirror and say something kind ✨', category: 'heart', completed: false },
  { id: 'r4', text: 'Stretch your arms up high and roll your neck gently 🧘‍♀️', category: 'body', completed: false },
  { id: 'r5', text: 'Write down 1 thing you are thankful for today 💛', category: 'mindfulness', completed: false },
  { id: 'r6', text: 'Remember that you are deeply loved and capable 🌸', category: 'heart', completed: false },
];
