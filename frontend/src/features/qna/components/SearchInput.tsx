import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChange,
  className = "mb-6",
  placeholder = "Search questions...",
}: Props) {
  return (
    <div className={`relative group ${className}`}>
      <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-indigo-400/70 group-hover:text-indigo-400 transition-colors duration-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 shadow-inner backdrop-blur-xl"
      />
    </div>
  );
}
