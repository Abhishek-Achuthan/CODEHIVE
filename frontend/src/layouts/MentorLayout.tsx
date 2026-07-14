import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, Clock } from "lucide-react";
import Header from "../shared/ui/Header";
import Footer from "../shared/ui/Footer";

interface MentorLayoutProps {
    children: ReactNode;
}

export default function MentorLayout({ children }: MentorLayoutProps) {
    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            <Header />

            <div className="flex">
                {/* Mentor Sidebar */}
                <aside className="w-64 border-r border-zinc-800 min-h-[calc(100vh-64px)] bg-[#121214]">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-indigo-400 mb-6">Mentor Panel</h2>

                        <nav className="space-y-2">
                            <NavLink
                                to="/mentor/dashboard"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                                        ? "bg-indigo-500/10 text-indigo-400"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                                    }`
                                }
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/sessions/hosting"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                                        ? "bg-indigo-500/10 text-indigo-400"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                                    }`
                                }
                            >
                                <Calendar className="w-5 h-5" />
                                Hosted Sessions
                            </NavLink>

                            <NavLink
                                to="/sessions/availability"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                                        ? "bg-indigo-500/10 text-indigo-400"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                                    }`
                                }
                            >
                                <Clock className="w-5 h-5" />
                                Availability
                            </NavLink>
                        </nav>

                        {/* Divider */}
                        <div className="my-6 border-t border-zinc-800"></div>

                        {/* Back to User View */}
                        <NavLink
                            to="/sessions"
                            className="flex items-center gap-3 p-3 rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors text-sm"
                        >
                            ← Back to User View
                        </NavLink>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">{children}</main>
            </div>

            <Footer />
        </div>
    );
}
