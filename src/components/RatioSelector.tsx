import { motion } from "motion/react";
import { AspectRatio } from "../types";
import { ASPECT_RATIOS } from "../constants";

interface RatioSelectorProps {
  selected: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

export default function RatioSelector({ selected, onChange }: RatioSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {ASPECT_RATIOS.map((item) => (
        <button
          key={item.label}
          onClick={() => onChange(item.label)}
          className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
            selected === item.label
              ? "bg-neon-purple/20 border-neon-purple text-neon-purple"
              : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
          }`}
        >
          <div 
            className={`rounded-sm border-2 transition-colors ${
              selected === item.label ? "border-neon-purple" : "border-gray-500 group-hover:border-gray-400"
            }`}
            style={{ width: `${item.width}px`, height: `${item.height}px` }}
          />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
