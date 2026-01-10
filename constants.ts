
import { EmojiData } from './types';

export const ADJECTIVES = [
  "Aggressive", "Mildly", "Suspiciously", "Caffeinated", "Sleepy", 
  "Chaotic", "Distinguished", "Unbothered", "Deranged", "Radiant", 
  "Glitchy", "Crunchy", "Spicy", "Melancholic", "Ascended",
  "Anxious", "Electric", "Velvet", "Gothic", "Wholesome",
  "Low-Battery", "Turbo", "Stinky", "Cosmic", "Petty"
];

export const NOUNS = [
  "Chaos", "Energy", "Cuddles", "Panic", "Silence", 
  "Vibes", "Aura", "Gremlin", "Potato", "Wizard", 
  "Main Character", "NPC", "Void", "Cloud", "Scream",
  "Noodle", "Spirit", "Goblin", "Shadow", "Manifestation"
];

export const EMOJI_LIBRARY: EmojiData[] = [
  // Faces & Moods
  { char: "🫠", category: "faces", keywords: ["melting", "hot", "embarrassed", "mood"] },
  { char: "🤡", category: "faces", keywords: ["clown", "funny", "joke"] },
  { char: "💀", category: "faces", keywords: ["dead", "skull", "laughing"] },
  { char: "👹", category: "faces", keywords: ["ogre", "scary", "mask"] },
  { char: "👽", category: "faces", keywords: ["alien", "space", "weird"] },
  { char: "👾", category: "faces", keywords: ["pixel", "game", "monster"] },
  { char: "🧠", category: "faces", keywords: ["brain", "smart", "think"] },
  { char: "🧿", category: "faces", keywords: ["evil eye", "protection", "blue"] },
  { char: "🫠", category: "faces", keywords: ["melting", "vibe"] },
  { char: "🫡", category: "faces", keywords: ["salute", "respect"] },
  { char: "🫣", category: "faces", keywords: ["peeking", "shy", "scared"] },
  { char: "🫢", category: "faces", keywords: ["gasp", "surprise"] },
  
  // Animals
  { char: "🦕", category: "animals", keywords: ["dinosaur", "blue", "old"] },
  { char: "🐈", category: "animals", keywords: ["cat", "pet", "meow"] },
  { char: "🐕", category: "animals", keywords: ["dog", "pet", "woof"] },
  { char: "frog", category: "animals", keywords: ["frog", "green", "jump"] },
  { char: "🦆", category: "animals", keywords: ["duck", "bird", "quack"] },
  { char: "🦋", category: "animals", keywords: ["butterfly", "fly", "blue"] },
  { char: "🦖", category: "animals", keywords: ["trex", "dino", "green"] },
  { char: "🐙", category: "animals", keywords: ["octopus", "sea", "pink"] },
  { char: "🐌", category: "animals", keywords: ["snail", "slow", "bug"] },
  { char: "🦦", category: "animals", keywords: ["otter", "water", "cute"] },
  
  // Food & Drink
  { char: "🍕", category: "food", keywords: ["pizza", "cheese", "fast food"] },
  { char: "🧃", category: "food", keywords: ["juice", "box", "drink"] },
  { char: "🥐", category: "food", keywords: ["croissant", "bread", "french"] },
  { char: "🍭", category: "food", keywords: ["lollipop", "sweet", "candy"] },
  { char: "🍄", category: "food", keywords: ["mushroom", "magic", "nature"] },
  { char: "🍒", category: "food", keywords: ["cherry", "fruit", "red"] },
  { char: "🥑", category: "food", keywords: ["avocado", "green", "healthy"] },
  { char: " Ramen", category: "food", keywords: ["noodles", "ramen", "soup"] },
  { char: "🍦", category: "food", keywords: ["ice cream", "cold", "sweet"] },
  { char: "🥯", category: "food", keywords: ["bagel", "bread", "breakfast"] },
  
  // Magic & Nature
  { char: "🌈", category: "nature", keywords: ["rainbow", "sky", "color"] },
  { char: "🔥", category: "nature", keywords: ["fire", "hot", "lit"] },
  { char: "✨", category: "nature", keywords: ["sparkles", "magic", "clean"] },
  { char: "🧿", category: "nature", keywords: ["nazar", "eye", "blue"] },
  { char: "🌸", category: "nature", keywords: ["flower", "pink", "spring"] },
  { char: "🌪️", category: "nature", keywords: ["tornado", "wind", "storm"] },
  { char: "🌊", category: "nature", keywords: ["wave", "ocean", "water"] },
  { char: "🫧", category: "nature", keywords: ["bubbles", "clean", "float"] },
  { char: "🧊", category: "nature", keywords: ["ice", "cube", "cold"] },
  { char: "🌵", category: "nature", keywords: ["cactus", "desert", "green"] },
  
  // Objects & Vibes
  { char: "💅", category: "vibes", keywords: ["nails", "slay", "diva"] },
  { char: "💃", category: "vibes", keywords: ["dance", "party", "lady"] },
  { char: "🕺", category: "vibes", keywords: ["dance", "party", "man"] },
  { char: "🎡", category: "vibes", keywords: ["ferris wheel", "fair", "park"] },
  { char: "🛹", category: "vibes", keywords: ["skateboard", "skate", "cool"] },
  { char: "🕹️", category: "vibes", keywords: ["joystick", "game", "retro"] },
  { char: "📼", category: "vibes", keywords: ["vhs", "tape", "retro"] },
  { char: "💎", category: "vibes", keywords: ["gem", "diamond", "shiny"] },
  { char: "🧸", category: "vibes", keywords: ["teddy", "bear", "toy"] },
  { char: "🎈", category: "vibes", keywords: ["balloon", "party", "red"] },
  { char: "🔮", category: "vibes", keywords: ["crystal ball", "magic", "future"] },
  { char: "💿", category: "vibes", keywords: ["cd", "music", "retro"] }
];

// Fallback for older code that expects a flat list
export const EMOJIS = EMOJI_LIBRARY.map(e => e.char);
