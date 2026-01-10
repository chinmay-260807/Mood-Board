
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { RefreshCw, Lock, Unlock, Share2, Download, Trash2, Github, Heart, Image as ImageIcon, Check, FileDown, Search, Filter, GripVertical, GripHorizontal } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { MoodState, ColorItem, EmojiItem, SavedMood, EmojiData } from './types';
import { generateTitle, generateColors, generateEmojis } from './services/moodGenerator';
import { audioService } from './services/audioService';
import { EMOJI_LIBRARY } from './constants';

const CATEGORIES = ['all', 'faces', 'animals', 'food', 'nature', 'vibes'];

const AnimatedBackground: React.FC<{ colors: ColorItem[], isDarkMode: boolean }> = ({ colors, isDarkMode }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-opacity duration-1000 ${isDarkMode ? 'opacity-20' : 'opacity-30'}`}>
      {colors.slice(0, 4).map((color, i) => (
        <div
          key={`bg-blob-${i}`}
          className={`absolute rounded-full filter blur-[100px] animate-blob ${isDarkMode ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
          style={{
            backgroundColor: color.hex,
            width: '45vw',
            height: '45vw',
            left: `${10 + (i * 25)}%`,
            top: `${15 + (i % 2 * 30)}%`,
            animationDelay: `${i * -5}s`,
            animationDuration: `${20 + i * 5}s`
          }}
        />
      ))}
    </div>
  );
};

const EmojiTooltip: React.FC<{ emojiChar: string; isVisible: boolean }> = ({ emojiChar, isVisible }) => {
  const data = useMemo(() => EMOJI_LIBRARY.find(e => e.char === emojiChar), [emojiChar]);
  
  if (!data || !isVisible) return null;

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 z-50 pointer-events-none border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in duration-200 origin-bottom">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
            {data.category}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {data.keywords.map((k, i) => (
            <span key={i} className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded">
              #{k}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-slate-800" />
    </div>
  );
};

const App: React.FC = () => {
  const [mood, setMood] = useState<MoodState | null>(null);
  const [savedMoods, setSavedMoods] = useState<SavedMood[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<'png' | 'jpeg' | null>(null);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  
  // Emoji Filtering State
  const [emojiSearch, setEmojiSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredEmojiId, setHoveredEmojiId] = useState<string | null>(null);

  // Drag and Drop State
  const [draggedColorIndex, setDraggedColorIndex] = useState<number | null>(null);
  const [draggedEmojiIndex, setDraggedEmojiIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const boardRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    const stored = localStorage.getItem('mood_history');
    if (stored) {
      try {
        setSavedMoods(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mood_history', JSON.stringify(savedMoods));
  }, [savedMoods]);

  const initMood = useCallback(() => {
    setMood({
      title: generateTitle(),
      isTitleLocked: false,
      colors: generateColors(5),
      emojis: generateEmojis(6),
    });
  }, []);

  useEffect(() => {
    initMood();
  }, [initMood]);

  // Reordering Logic
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragStartColor = (index: number) => {
    setDraggedColorIndex(index);
    audioService.playClick();
  };

  const handleDragStartEmoji = (index: number) => {
    setDraggedEmojiIndex(index);
    audioService.playClick();
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDropColor = (index: number) => {
    if (draggedColorIndex === null || !mood) return;
    const newColors = reorder(mood.colors, draggedColorIndex, index);
    setMood({ ...mood, colors: newColors });
    setDraggedColorIndex(null);
    setDragOverIndex(null);
    audioService.playPop(true);
  };

  const handleDropEmoji = (index: number) => {
    if (draggedEmojiIndex === null || !mood) return;
    const newEmojis = reorder(mood.emojis, draggedEmojiIndex, index);
    setMood({ ...mood, emojis: newEmojis });
    setDraggedEmojiIndex(null);
    setDragOverIndex(null);
    audioService.playPop(true);
  };

  const toggleLockColor = (id: string) => {
    if (!mood) return;
    const color = mood.colors.find(c => c.id === id);
    if (color) audioService.playPop(!color.isLocked);
    setMood({
      ...mood,
      colors: mood.colors.map(c => c.id === id ? { ...c, isLocked: !c.isLocked } : c)
    });
  };

  const toggleLockEmoji = (id: string) => {
    if (!mood) return;
    const emoji = mood.emojis.find(e => e.id === id);
    if (emoji) audioService.playPop(!emoji.isLocked);
    setMood({
      ...mood,
      emojis: mood.emojis.map(e => e.id === id ? { ...e, isLocked: !e.isLocked } : e)
    });
  };

  const toggleLockTitle = () => {
    if (!mood) return;
    audioService.playPop(!mood.isTitleLocked);
    setMood({ ...mood, isTitleLocked: !mood.isTitleLocked });
  };

  const shuffleAll = () => {
    if (!mood) return;
    audioService.playMagicWhoosh();
    
    setMood({
      title: mood.isTitleLocked ? mood.title : generateTitle(),
      isTitleLocked: mood.isTitleLocked,
      colors: mood.colors.map(c => c.isLocked ? c : { ...c, hex: `hsl(${Math.random() * 360}, ${60 + Math.random() * 30}%, ${40 + Math.random() * 20}%)` }),
      emojis: mood.emojis.map(e => {
        if (e.isLocked) return e;
        const available = generateEmojis(1, { 
          category: selectedCategory, 
          search: emojiSearch 
        })[0];
        return { ...e, char: available.char };
      })
    });
  };

  const handleDarkModeToggle = () => {
    audioService.playClick();
    setIsDarkMode(!isDarkMode);
  };

  const saveToFavorites = () => {
    if (!mood) return;
    audioService.playShuffle();
    const newSave: SavedMood = {
      ...mood,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setSavedMoods([newSave, ...savedMoods].slice(0, 10)); // Keep last 10
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const exportAsImage = async (format: 'png' | 'jpeg') => {
    if (!boardRef.current) return;
    setExportingFormat(format);
    audioService.playClick();
    
    try {
      const filter = (node: HTMLElement) => {
        const exclusionClasses = ['md:opacity-0', 'group-hover:opacity-100', 'bg-black/10', 'export-hide'];
        return !exclusionClasses.some(cls => node.classList?.contains(cls));
      };

      const options = { 
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        style: { borderRadius: '0px' },
        filter: filter
      };

      let dataUrl;
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(boardRef.current, options);
      } else {
        dataUrl = await htmlToImage.toJpeg(boardRef.current, options);
      }
      
      const link = document.createElement('a');
      link.download = `moodboard-${mood?.title.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed', error);
    } finally {
      setExportingFormat(null);
    }
  };

  const restoreMood = (m: SavedMood) => {
    audioService.playShuffle();
    setMood({
      title: m.title,
      isTitleLocked: m.isTitleLocked,
      colors: m.colors,
      emojis: m.emojis
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteSavedMood = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playClick();
    setSavedMoods(savedMoods.filter(m => m.id !== id));
  };

  const filteredPoolCount = useMemo(() => {
    let pool = [...EMOJI_LIBRARY];
    if (selectedCategory !== 'all') pool = pool.filter(e => e.category === selectedCategory);
    if (emojiSearch) {
      const term = emojiSearch.toLowerCase();
      pool = pool.filter(e => 
        e.char.includes(term) || 
        e.keywords.some(k => k.includes(term)) ||
        e.category.includes(term)
      );
    }
    return pool.length;
  }, [emojiSearch, selectedCategory]);

  if (!mood) return <div className="min-h-screen flex items-center justify-center">Loading Vibes...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-500 relative ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      {/* Dynamic Background */}
      <AnimatedBackground colors={mood.colors} isDarkMode={isDarkMode} />

      {/* Header */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-6">
            <span className="text-white text-2xl">✨</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">MoodBoard</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleDarkModeToggle}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full px-1 py-1 shadow-sm border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => exportAsImage('png')}
              disabled={!!exportingFormat}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-full text-xs md:text-sm font-semibold transition-all disabled:opacity-50"
              title="Download PNG"
            >
              {exportingFormat === 'png' ? <RefreshCw className="animate-spin" size={16} /> : <ImageIcon size={16} />} 
              <span className="hidden sm:inline">PNG</span>
            </button>
            <button 
              onClick={() => exportAsImage('jpeg')}
              disabled={!!exportingFormat}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-full text-xs md:text-sm font-semibold transition-all disabled:opacity-50"
              title="Download JPG"
            >
              {exportingFormat === 'jpeg' ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />} 
              <span className="hidden sm:inline">JPG</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col gap-12">
          
          {/* Main Content Area Refed for Export */}
          <div ref={boardRef} className="p-8 md:p-12 rounded-[3rem] transition-colors bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl border border-white/50 dark:border-slate-800/50">
            <div className="flex flex-col gap-12">
               {/* Title Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-4 group">
                  <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter">
                    "{mood.title}"
                  </h2>
                  <button 
                    onClick={toggleLockTitle}
                    className={`p-2 rounded-full transition-all export-hide ${mood.isTitleLocked ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700 md:opacity-0 group-hover:opacity-100'}`}
                  >
                    {mood.isTitleLocked ? <Lock size={24} /> : <Unlock size={24} />}
                  </button>
                </div>
                <p className="text-slate-500 font-medium text-lg export-hide">Drag elements to reorder, tap to lock</p>
              </div>

              {/* Board Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Color Palette */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Color Palette</h3>
                    <GripHorizontal size={14} className="text-slate-300 export-hide" />
                  </div>
                  <div className="flex h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800">
                    {mood.colors.map((color, idx) => (
                      <div 
                        key={color.id}
                        draggable
                        onDragStart={() => handleDragStartColor(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDropColor(idx)}
                        onDragEnd={() => { setDraggedColorIndex(null); setDragOverIndex(null); }}
                        onClick={() => toggleLockColor(color.id)}
                        className={`relative group flex-1 transition-all cursor-move hover:flex-[1.5] ${draggedColorIndex === idx ? 'opacity-50 grayscale' : ''} ${dragOverIndex === idx && draggedColorIndex !== idx ? 'ring-4 ring-indigo-400 z-20' : ''}`}
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity export-hide">
                          {color.isLocked ? <Lock className="text-white" /> : <Unlock className="text-white/50" />}
                        </div>
                        {color.isLocked && (
                          <div className="absolute top-4 right-4 text-white/80 export-hide">
                            <Lock size={16} />
                          </div>
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 export-hide">
                           <GripVertical size={16} className="text-white/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emojis Section with Search/Filter */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 export-hide">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Emotional Resonance</h3>
                      <GripVertical size={14} className="text-slate-300" />
                    </div>
                    
                    {/* Search & Filter Bar */}
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-4 py-1.5 shadow-sm border border-slate-200 dark:border-slate-700">
                      <Search size={14} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search emojis..." 
                        value={emojiSearch}
                        onChange={(e) => setEmojiSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs font-semibold w-24 md:w-32 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-2 export-hide">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          audioService.playClick();
                          setSelectedCategory(cat);
                        }}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedCategory === cat 
                          ? 'bg-indigo-500 text-white shadow-md scale-105' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  
                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-4 h-64 md:h-80">
                    {mood.emojis.map((emoji, idx) => (
                      <div 
                        key={emoji.id} 
                        className={`relative ${dragOverIndex === idx && draggedEmojiIndex !== idx ? 'scale-105' : ''} transition-transform`}
                        draggable
                        onDragStart={() => handleDragStartEmoji(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDropEmoji(idx)}
                        onDragEnd={() => { setDraggedEmojiIndex(null); setDragOverIndex(null); }}
                      >
                        <EmojiTooltip emojiChar={emoji.char} isVisible={hoveredEmojiId === emoji.id} />
                        <button
                          onMouseEnter={() => setHoveredEmojiId(emoji.id)}
                          onMouseLeave={() => setHoveredEmojiId(null)}
                          onClick={() => {
                            toggleLockEmoji(emoji.id);
                            if (window.matchMedia("(pointer: coarse)").matches) {
                              setHoveredEmojiId(emoji.id);
                              setTimeout(() => setHoveredEmojiId(null), 1500);
                            }
                          }}
                          className={`relative w-full h-full rounded-3xl flex items-center justify-center text-6xl md:text-7xl shadow-xl transition-all transform active:scale-95 group overflow-hidden cursor-move ${
                            emoji.isLocked 
                            ? 'bg-indigo-100/80 dark:bg-indigo-900/50 border-4 border-indigo-400' 
                            : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border-4 border-transparent'
                          } ${draggedEmojiIndex === idx ? 'opacity-30 blur-sm' : ''}`}
                        >
                          <span className={`transition-transform duration-500 pointer-events-none ${!emoji.isLocked ? 'float-animation' : 'scale-110'}`}>
                            {emoji.char}
                          </span>
                          <div className="absolute top-2 right-2 md:opacity-0 group-hover:opacity-100 transition-opacity export-hide">
                            {emoji.isLocked ? <Lock size={16} className="text-indigo-600" /> : <Unlock size={16} className="text-slate-400" />}
                          </div>
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 export-hide">
                            <GripVertical size={14} className="text-slate-300" />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center export-hide">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Pool: {filteredPoolCount} vibes available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex gap-4">
                <button 
                  onClick={saveToFavorites}
                  className="p-5 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 rounded-full font-black shadow-lg hover:scale-110 active:scale-95 transition-all group flex items-center gap-2 px-8"
                  title="Save to History"
                >
                  {showSavedFeedback ? <Check className="animate-bounce" /> : <Heart className="group-hover:fill-current transition-colors" />}
                  {showSavedFeedback ? 'SAVED!' : 'SAVE MOOD'}
                </button>
              </div>

              <button 
                onClick={shuffleAll}
                className="group flex items-center gap-3 px-12 py-6 bg-indigo-500 text-white rounded-full font-black text-2xl shadow-[0_10px_0_0_rgba(79,70,229,1)] hover:shadow-[0_5px_0_0_rgba(79,70,229,1)] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all"
              >
                <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
                SHUFFLE VIBES
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    audioService.playClick();
                    setEmojiSearch('');
                    setSelectedCategory('all');
                    setMood({
                      ...mood,
                      isTitleLocked: false,
                      colors: mood.colors.map(c => ({...c, isLocked: false})),
                      emojis: mood.emojis.map(e => ({...e, isLocked: false}))
                    });
                  }}
                  className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                  title="Reset Everything"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>

            {/* Quick Export Section */}
            <div className="flex flex-col items-center gap-4 py-4">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Download Creation</h4>
              <div className="flex gap-4">
                <button 
                  onClick={() => exportAsImage('png')}
                  disabled={!!exportingFormat}
                  className="group flex items-center gap-2 px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all disabled:opacity-50 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                >
                  {exportingFormat === 'png' ? <RefreshCw className="animate-spin" size={20} /> : <ImageIcon size={20} className="group-hover:text-indigo-500" />}
                  Download PNG
                </button>
                <button 
                  onClick={() => exportAsImage('jpeg')}
                  disabled={!!exportingFormat}
                  className="group flex items-center gap-2 px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all disabled:opacity-50 border-2 border-transparent hover:border-amber-200 dark:hover:border-amber-800"
                >
                  {exportingFormat === 'jpeg' ? <RefreshCw className="animate-spin" size={20} /> : <FileDown size={20} className="group-hover:text-amber-500" />}
                  Download JPG
                </button>
              </div>
            </div>
          </div>

          {/* History Section */}
          {savedMoods.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-black italic">Recent Hallucinations</h3>
                <button 
                  onClick={() => {
                    audioService.playClick();
                    setSavedMoods([]);
                  }}
                  className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Clear History
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {savedMoods.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => restoreMood(m)}
                    className="group relative cursor-pointer bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-3 border-2 border-transparent hover:border-indigo-400 transition-all hover:-translate-y-2"
                  >
                    <div className="flex h-12 gap-1 rounded-lg overflow-hidden mb-3">
                      {m.colors.map(c => (
                        <div key={c.id} className="flex-1" style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {m.emojis.slice(0, 3).map(e => (
                          <span key={e.id} className="text-xl">{e.char}</span>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => deleteSavedMood(m.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="mt-2 text-xs font-bold truncate leading-none text-slate-500">"{m.title}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-12 px-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400">
          <p className="font-medium">© 2024 Mood Moodboard — Built for pure vibes.</p>
          <div className="flex gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); audioService.playClick(); }} className="hover:text-indigo-500 transition-colors">Instagram</a>
            <a href="#" onClick={(e) => { e.preventDefault(); audioService.playClick(); }} className="hover:text-indigo-500 transition-colors">TikTok</a>
            <a href="#" onClick={(e) => { audioService.playClick(); }} className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
              <Github size={18} /> Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
