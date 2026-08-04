import type { ReactNode } from "react";
import { Compass, Users } from "lucide-react";

import type { RoomListTab } from "./RoomViewTabs";

type RoomsSidebarProps = {
  activeTab: RoomListTab;
  onTabChange: (tab: RoomListTab) => void;
  isSignedIn: boolean;
  footerSlot?: ReactNode;
};

export function RoomsSidebar({
  activeTab,
  onTabChange,
  isSignedIn,
  footerSlot,
}: RoomsSidebarProps) {
  const items: Array<{
    id: RoomListTab;
    title: string;
    icon: ReactNode;
    disabled?: boolean;
  }> = [
    {
      id: "public",
      title: "Discover Rooms",
      icon: <Compass className="h-5 w-5" />,
    },
    {
      id: "mine",
      title: "My Rooms",
      icon: <Users className="h-5 w-5" />,
      disabled: !isSignedIn,
    },
  ];

  return (
    <aside className="hidden md:flex w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl h-[calc(100vh-64px)] sticky top-16 flex-col">
      <nav className="flex-1 space-y-1 px-3 py-6">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const isDisabled = Boolean(item.disabled);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              disabled={isDisabled}
              className={[
                "group relative w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 text-left",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-200",
                isDisabled ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-500" : "",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              )}
              <span
                className={[
                  "transition-colors duration-300 flex items-center justify-center",
                  isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.title}</span>
              {item.id === "mine" && !isSignedIn ? (
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Sign in
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {footerSlot ? (
        <div className="p-4 border-t border-white/5">{footerSlot}</div>
      ) : null}
    </aside>
  );
}

