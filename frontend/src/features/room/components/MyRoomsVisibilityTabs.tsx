export type MyRoomsVisibilityFilter = "all" | "public" | "private";

const OPTIONS: { value: MyRoomsVisibilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

type MyRoomsVisibilityTabsProps = {
  value: MyRoomsVisibilityFilter;
  onChange: (value: MyRoomsVisibilityFilter) => void;
};

export function MyRoomsVisibilityTabs({
  value,
  onChange,
}: MyRoomsVisibilityTabsProps) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${
            value === option.value
              ? "bg-white text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
