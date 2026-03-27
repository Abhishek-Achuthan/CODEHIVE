import { useEffect, useState } from "react";
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import MentorLayout from "../../../layouts/MentorLayout";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import type { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
    totalEarnings: number;
    upcomingSessions: number;
    completedSessions: number;
    totalStudents: number;
}

export default function MentorDashboardPage() {
    const navigate = useNavigate();
    const user = useAppSelector((state: RootState) => state.auth.user);
    const [stats, setStats] = useState<DashboardStats>({
        totalEarnings: 0,
        upcomingSessions: 0,
        completedSessions: 0,
        totalStudents: 0,
    });

    useEffect(() => {
        // Redirect if not an approved mentor
        if (user?.mentorStatus !== "approved") {
            navigate("/profile");
        }
    }, [user, navigate]);

    // TODO: Fetch actual stats from API
    useEffect(() => {
        // Placeholder - will be replaced with actual API call
        setStats({
            totalEarnings: 0,
            upcomingSessions: 0,
            completedSessions: 0,
            totalStudents: 0,
        });
    }, []);

    const statCards = [
        {
            title: "Total Earnings",
            value: `₹${stats.totalEarnings.toLocaleString()}`,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
        },
        {
            title: "Upcoming Sessions",
            value: stats.upcomingSessions,
            icon: Calendar,
            color: "from-blue-500 to-indigo-600",
        },
        {
            title: "Completed Sessions",
            value: stats.completedSessions,
            icon: TrendingUp,
            color: "from-purple-500 to-pink-600",
        },
        {
            title: "Total Students",
            value: stats.totalStudents,
            icon: Users,
            color: "from-orange-500 to-red-600",
        },
    ];

    return (
        <MentorLayout>
            <div className="px-4 py-10">
                <div className="mx-auto max-w-7xl">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Mentor Dashboard</h1>
                        <p className="mt-2 text-gray-400">
                            Welcome back, {user?.firstName}! Here's your mentoring overview.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-gray-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">{stat.title}</p>
                                            <p className="mt-2 text-3xl font-bold text-white">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}
                                        >
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <button
                            onClick={() => navigate("/mentor/sessions")}
                            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-left transition-all hover:border-indigo-500/50 hover:bg-gray-900"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
                                    <Calendar className="h-6 w-6 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        View Hosted Sessions
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Manage your upcoming and past sessions
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate("/mentor/availability")}
                            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-left transition-all hover:border-purple-500/50 hover:bg-gray-900"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                                    <TrendingUp className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Manage Availability
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Update your schedule and time slots
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}
