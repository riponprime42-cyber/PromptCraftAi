import { StyleOption } from "../types";
import { STYLES } from "../constants";

interface StyleSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onChange(style.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            selected === style.id
              ? "bg-neon-purple text-white border-neon-purple"
              : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
          }`}
        >
          {style.name}
        </button>
      ))}
    </div>
  );
}
