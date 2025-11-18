import { useState } from "react";
import {
  MdOutlineQuestionAnswer,
  MdOutlineLightbulb,
  MdLabelOutline,
  MdPersonOutline,
  MdOutlineArticle,
  MdOutlineCheckCircle,
} from "react-icons/md";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Questions");

  const menuItems = [
    { icon: MdOutlineQuestionAnswer, label: "Questions", count: null },
    { icon: MdOutlineLightbulb, label: "AI Assist", count: null },
    { icon: MdLabelOutline, label: "Tags", count: null },
    { icon: MdPersonOutline, label: "Users", count: null },
  ];

  return (
    <aside className="hidden md:flex flex-col items-start bg-black border-r border-zinc-800 p-6 h-screen sticky top-0 md:w-56 lg:w-64">

      <div className="w-full  border-zinc-800 " />

      <nav className="w-full space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${isActive ? "" : "group-hover:scale-110"}`}
                size={20}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
              {item.count && (
                <span className="ml-auto text-xs bg-zinc-800 px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-zinc-800 w-full space-y-2">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider px-4 mb-2">
          Personal
        </p>

        <button
          onClick={() => setActiveItem("My questions")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
            activeItem === "My questions"
              ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <MdOutlineArticle className={`w-5 h-5`} size={20} aria-hidden="true" />
          <span>My questions</span>
        </button>

        <button
          onClick={() => setActiveItem("Answered by me")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
            activeItem === "Answered by me"
              ? "bg-linear-to-r from-orange-600 to-pink-600 text-white shadow-lg shadow-orange-500/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <MdOutlineCheckCircle className={`w-5 h-5`} size={20} aria-hidden="true" />
          <span>Answered by me</span>
        </button>
      </div>
    </aside>
  );
}
