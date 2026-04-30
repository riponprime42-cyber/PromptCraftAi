import { motion, AnimatePresence } from "motion/react";
import { Copy, RefreshCw, Check, Share2, Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { GeneratedPrompt } from "../types";

interface PromptResultCardProps {
  prompt: GeneratedPrompt;
  onRegenerate: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  showActions?: boolean;
}

export default function PromptResultCard({ 
  prompt, 
  onRegenerate, 
  onDelete, 
  onToggleFavorite, 
  showActions = true 
}: PromptResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 neon-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            prompt.type === 'video' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-neon-purple/20 text-neon-purple'
          }`}>
            {prompt.type}
          </span>
          <span className="text-gray-500 text-xs font-mono">• {prompt.ratio}</span>
        </div>
        <div className="text-gray-500 text-[10px] font-mono">
          {new Date(prompt.createdAt).toLocaleTimeString()}
        </div>
      </div>

      <div className="relative group">
        <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed bg-black/40 rounded-xl p-4 min-h-[100px]">
          {prompt.output}
        </pre>
      </div>

      {showActions && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-all"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={14} className="text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={onRegenerate}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              title="Regenerate"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className={`p-1.5 rounded-lg transition-all ${
                  prompt.isFavorite ? 'text-neon-pink bg-neon-pink/10' : 'text-gray-500 bg-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Heart size={14} fill={prompt.isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
            {onDelete && (
                <button
                onClick={onDelete}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
