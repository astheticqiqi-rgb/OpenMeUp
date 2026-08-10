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

export const DEFAULT_MEMORIES: MemoryPhoto[] = [
  {
    id: '1',
    title: 'Warm Coffee & Laughs',
    date: 'Autumn Afternoon',
    location: 'Our Favorite Cafe',
    caption: 'That cozy spot by the window where hours felt like seconds.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    tag: 'cozy'
  },
  {
    id: '2',
    title: 'Puppy Park Date',
    date: 'Sunny Saturday',
    location: 'Grassy Meadow',
    caption: 'Chasing puppies and taking endless sweet photos under the tree.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop',
    tag: 'sweet'
  },
  {
    id: '3',
    title: 'Sunset Beach Walk',
    date: 'Summer Evening',
    location: 'Golden Coast',
    caption: 'Golden hour waves, cool sea breeze, and hands warm together.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    tag: 'travel'
  },
  {
    id: '4',
    title: 'Late Night Games & Pizza',
    date: 'Cozy Weekend',
    location: 'Living Room Fort',
    caption: 'Competing in classic games while eating slices on the floor.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    tag: 'funny'
  },
  {
    id: '5',
    title: 'Birthday Candle Wish',
    date: 'Special Day',
    location: 'Home Sweet Home',
    caption: 'Blowing out candles with the biggest smile on your face.',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    tag: 'celebration'
  }
];

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
