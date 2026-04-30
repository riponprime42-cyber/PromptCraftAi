import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Zap, 
  History, 
  X, 
  Plus, 
  Wand2, 
  ArrowRight,
  Settings,
  RefreshCw
} from "lucide-react";
import { PromptType, AspectRatio, GeneratedPrompt } from "./types";
import { STYLES } from "./constants";
import RatioSelector from "./components/RatioSelector";
import StyleSelector from "./components/StyleSelector";
import PromptResultCard from "./components/PromptResultCard";
import { generateAIPrompt } from "./services/geminiService";

export default function App() {
  const [view, setView] = useState<'hero' | 'app'>('hero');
  const [promptType, setPromptType] = useState<PromptType>('image');
  const [idea, setIdea] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [ratio, setRatio] = useState<AspectRatio>('16:9');
  const [loading, setLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<GeneratedPrompt | null>(null);
  const [history, setHistory] = useState<GeneratedPrompt[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('prompt_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const output = await generateAIPrompt(promptType, idea, selectedStyle, ratio);
      const newPrompt: GeneratedPrompt = {
        id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
        type: promptType,
        input: idea,
        style: selectedStyle,
        ratio,
        output,
        createdAt: Date.now(),
      };
      
      setCurrentPrompt(newPrompt);
      setHistory(prev => [newPrompt, ...prev].slice(0, 50)); // Keep last 50
    } finally {
      setLoading(false);
    }
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(p => p.id !== id));
    if (currentPrompt?.id === id) setCurrentPrompt(null);
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    if (currentPrompt?.id === id) {
      setCurrentPrompt(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  if (view === 'hero') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/20 blur-[120px] rounded-full animate-pulse animate-delay-1000" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center text-center max-w-3xl"
        >
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple to-neon-blue blur-xl opacity-50 animate-pulse" />
            <div className="relative w-full h-full bg-dark-bg border border-white/20 rounded-3xl flex items-center justify-center">
              <Wand2 size={48} className="text-neon-purple" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 mb-6 py-4">
            PromptCraft AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
            Generate Powerful Prompts for AI Images & Videos Instantly. Built for creators who dream bigger.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('app')}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Get Started</span>
            <ArrowRight size={20} className="relative z-10 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </motion.button>
        </motion.div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 text-gray-500">
          <div className="flex items-center gap-2 text-sm italic">
            <Sparkles size={16} /> Image Prompt Generator
          </div>
          <div className="flex items-center gap-2 text-sm italic">
            <VideoIcon size={16} /> Video Prompt Generator
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('hero')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
            <Wand2 size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">PromptCraft AI</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-all ${showHistory ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <History size={20} />
          </button>
          <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-12 space-y-8">
          <section className="space-y-6">
            {/* Prompt Type Toggle */}
            <div className="flex p-1 bg-white/5 rounded-2xl w-fit mx-auto sm:mx-0">
              <button
                onClick={() => setPromptType('image')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  promptType === 'image' ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ImageIcon size={18} />
                Image Prompt
              </button>
              <button
                onClick={() => setPromptType('video')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  promptType === 'video' ? 'bg-neon-blue text-white shadow-lg shadow-neon-blue/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                <VideoIcon size={18} />
                Video Prompt
              </button>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <Plus size={14} /> Describe your idea
                </label>
                <span className="text-[10px] uppercase tracking-widest text-gray-600">Free Text Input</span>
              </div>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={promptType === 'image' ? "e.g. A cyberpunk city at night with floating cars..." : "e.g. A peaceful sunrise over a futuristic mountain lake..."}
                className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-6 text-xl text-white placeholder:text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-neon-purple/30 transition-all font-display"
              />
            </div>

            {/* Config Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400">Select Style</label>
                <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400">Aspect Ratio</label>
                <RatioSelector selected={ratio} onChange={setRatio} />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !idea.trim()}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg shadow-2xl relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <RefreshCw className="animate-spin" size={20} />
                    Crafting perfection...
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Zap size={20} fill="currentColor" />
                    Generate Prompt
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </section>

          {/* Results Section */}
          <AnimatePresence>
            {currentPrompt && (
              <section className="space-y-4 mt-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles size={20} className="text-neon-purple" />
                    Generated Prompt
                  </h2>
                </div>
                <PromptResultCard 
                  prompt={currentPrompt} 
                  onRegenerate={handleGenerate}
                  onToggleFavorite={() => toggleFavorite(currentPrompt.id)}
                  onDelete={() => deleteFromHistory(currentPrompt.id)}
                />
              </section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* History Sidebar/Drawer */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-dark-surface border-l border-white/10 z-[60] flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.4)]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <History size={20} className="text-neon-purple" />
                  Your History
                </h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <History size={48} />
                    <p>No history yet. Start generating!</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="group relative">
                      <div className="absolute -left-3 top-0 bottom-0 w-1 bg-neon-purple scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-full" />
                      <PromptResultCard 
                        prompt={item} 
                        onRegenerate={() => {
                          setIdea(item.input);
                          setPromptType(item.type);
                          setSelectedStyle(item.style);
                          setRatio(item.ratio);
                          setShowHistory(false);
                        }}
                        onDelete={() => deleteFromHistory(item.id)}
                        onToggleFavorite={() => toggleFavorite(item.id)}
                      />
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Footer / Credits */}
      <footer className="mt-20 border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-6 mb-4">
          <a href="#" className="hover:text-neon-purple transition-colors">Documentation</a>
          <a href="#" className="hover:text-neon-purple transition-colors">API</a>
          <a href="#" className="hover:text-neon-purple transition-colors">Community</a>
        </div>
        <p>© 2026 PromptCraft AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}
