import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: Props) {
  return (
    <div className="mb-6 relative">
      <Search className="absolute left-3 top-3 w-4 h-4 text-primary" />
      <input
        type="text"
        placeholder="Search here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-2 bg-primary/10 border-2 border-primary/30 hover:border-primary/50 rounded-lg text-sm text-foreground placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition"
      />
    </div>
  );
}
