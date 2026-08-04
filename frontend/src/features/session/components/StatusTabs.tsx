export type StatusFilter = "upcoming" | "completed" | "cancelled";

interface StatusTabsProps {
    activeTab: StatusFilter;
    onTabChange: (tab: StatusFilter) => void;
}

const tabs: { value: StatusFilter; label: string }[] = [
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

export function StatusTabs({ activeTab, onTabChange }: StatusTabsProps) {
    return (
        <div className="inline-flex rounded-lg border border-gray-700 bg-black p-1">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all ${activeTab === tab.value
                        ? "bg-white text-black"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
