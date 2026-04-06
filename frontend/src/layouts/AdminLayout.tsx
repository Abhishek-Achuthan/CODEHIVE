import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { IoGridOutline, IoPeopleOutline, IoSchoolOutline, IoDocumentTextOutline, IoWalletOutline, IoCalendarOutline, IoStatsChartOutline, IoLogOutOutline } from "react-icons/io5";
import { useLogout } from "../features/auth/hooks/useLogout";


interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

  const { logOut } = useLogout()

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-300">
      <aside className="w-64 bg-zinc-900/30 border-r border-white/10 flex flex-col">
        <div className="flex h-20 items-center justify-center border-b border-white/10 px-6">
          <span className="font-black text-2xl text-white tracking-tight">
            CODE<span className="text-indigo-500">HIVE</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { to: "/", icon: IoGridOutline, label: "Dashboard" },
            { to: "/admin/users", icon: IoPeopleOutline, label: "Users" },
            { to: "/admin/mentors", icon: IoSchoolOutline, label: "Mentors" },
            { to: "/admin/applications", icon: IoDocumentTextOutline, label: "Applications" },
            { to: "/admin/subscriptions", icon: IoWalletOutline, label: "Subscriptions" },
            { to: "/admin/plans", icon: IoCalendarOutline, label: "Plans" },
            { to: "/admin/reports", icon: IoStatsChartOutline, label: "Reports" },
          ].map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 font-semibold"
                    : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
          
          <button
            onClick={logOut}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-zinc-400 hover:bg-white/[0.05] hover:text-red-400 text-left mt-2"
          >
            <IoLogOutOutline className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
