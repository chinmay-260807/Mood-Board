
export interface ColorItem {
  id: string;
  hex: string;
  isLocked: boolean;
}

export interface EmojiData {
  char: string;
  category: string;
  keywords: string[];
}

export interface EmojiItem {
  id: string;
  char: string;
  isLocked: boolean;
}

export interface MoodState {
  title: string;
  isTitleLocked: boolean;
  colors: ColorItem[];
  emojis: EmojiItem[];
}

export interface SavedMood extends MoodState {
  id: string;
  timestamp: number;
}
