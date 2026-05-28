export type RoomListTab = "public" | "mine";

interface RoomViewTabsProps {
  activeTab: RoomListTab;
  onTabChange: (tab: RoomListTab) => void;
}

const tabs: { value: RoomListTab; label: string }[] = [
  { value: "public", label: "Discover" },
  { value: "mine", label: "My Rooms" },
];

export const RoomViewTabs = ({ activeTab, onTabChange }: RoomViewTabsProps) => {
  return (
    <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onTabChange(tab.value)}
          className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${
            activeTab === tab.value
              ? "bg-white text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
