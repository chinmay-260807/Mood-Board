
import { ADJECTIVES, NOUNS, EMOJI_LIBRARY } from '../constants';
import { ColorItem, EmojiItem } from '../types';

const generateRandomHex = (): string => {
  // Use HSL to ensure vibrant, non-muddy colors
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30); // 60-90%
  const l = 40 + Math.floor(Math.random() * 20); // 40-60%
  
  // Convert HSL to Hex (simplified representation)
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const generateTitle = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
};

export const generateColors = (count: number): ColorItem[] => {
  return Array.from({ length: count }).map(() => ({
    id: Math.random().toString(36).substr(2, 9),
    hex: generateRandomHex(),
    isLocked: false,
  }));
};

export const generateEmojis = (
  count: number, 
  filter?: { category?: string; search?: string }
): EmojiItem[] => {
  let pool = [...EMOJI_LIBRARY];

  if (filter?.category && filter.category !== 'all') {
    pool = pool.filter(e => e.category === filter.category);
  }

  if (filter?.search) {
    const term = filter.search.toLowerCase();
    pool = pool.filter(e => 
      e.char.includes(term) || 
      e.keywords.some(k => k.includes(term)) ||
      e.category.includes(term)
    );
  }

  // Fallback to full pool if search/filter is too restrictive
  if (pool.length === 0) {
    pool = [...EMOJI_LIBRARY];
  }

  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(e => ({
    id: Math.random().toString(36).substr(2, 9),
    char: e.char,
    isLocked: false,
  }));
};
