import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoPeopleOutline,
  IoSchoolOutline,
  IoWalletOutline,
  IoGridOutline,
  IoDocumentTextOutline,
  IoAlertCircleOutline,
  IoWarningOutline
} from "react-icons/io5";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import AdminLayout from "../../../layouts/AdminLayout";
import { PageHeader } from "../../../shared/ui/PageHeader";
import { useDashboardData } from "../hooks/useDashboardData";
import { Loader2, ArrowRight } from "lucide-react";

const Card = ({ children, className = "", title }: { children: React.ReactNode, className?: string, title?: string }) => (
  <div className={`bg-zinc-900/50 border border-white/10 rounded-2xl p-5 flex flex-col ${className}`}>
    {title && <h3 className="text-zinc-100 font-semibold mb-4">{title}</h3>}
    {children}
  </div>
);

const KPICard = ({ title, value, icon: Icon, colorClass }: any) => (
  <Card className="hover:bg-zinc-900/80 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorClass.bg}`}>
        <Icon className={`w-6 h-6 ${colorClass.text}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-zinc-400 text-sm font-medium">{title}</span>
        <span className="text-2xl font-bold text-white mt-1">{value}</span>
      </div>
    </div>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-zinc-300 font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-400">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Colors for PieChart
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export const AdminDashboardPage: React.FC = () => {
  const [timeFilterUser, setTimeFilterUser] = useState("30");
  const [timeFilterRevenue, setTimeFilterRevenue] = useState("30");
  
  const { loading, metrics } = useDashboardData(timeFilterUser, timeFilterRevenue);

  if (loading && !metrics) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const kpis = metrics?.kpis || {} as any;
  const userGrowth = metrics?.userGrowth || [];
  const revenueGrowth = metrics?.revenueGrowth || [];
  const recentActivity = metrics?.recentActivity || [];
  const subscriptionDistribution = metrics?.subscriptionDistribution || [];
  const revenue = metrics?.revenue || { monthlyRevenue: 0, activePaidSubscribers: 0 };

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
        
        <PageHeader 
          title="Overview"
          description="High-level metrics and operational status."
        />

        {/* 1. Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard title="Total Users" value={kpis.totalUsers || 0} icon={IoPeopleOutline} colorClass={{ bg: "bg-indigo-500/10", text: "text-indigo-400" }} />
          <KPICard title="Total Mentors" value={kpis.totalMentors || 0} icon={IoSchoolOutline} colorClass={{ bg: "bg-emerald-500/10", text: "text-emerald-400" }} />
          <KPICard title="Active Subs" value={kpis.activeSubscriptions || 0} icon={IoWalletOutline} colorClass={{ bg: "bg-blue-500/10", text: "text-blue-400" }} />
          <KPICard title="Active Rooms" value={kpis.activeRooms || 0} icon={IoGridOutline} colorClass={{ bg: "bg-purple-500/10", text: "text-purple-400" }} />
          <KPICard title="Pending Apps" value={kpis.pendingApplications || 0} icon={IoDocumentTextOutline} colorClass={{ bg: "bg-amber-500/10", text: "text-amber-400" }} />
          <KPICard title="Pending Reports" value={kpis.pendingReports || 0} icon={IoAlertCircleOutline} colorClass={{ bg: "bg-rose-500/10", text: "text-rose-400" }} />
        </div>

        {/* 2. Revenue Overview */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Revenue Chart */}
          <Card className="xl:col-span-3 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-zinc-100 font-semibold">Revenue Trend</h3>
              <select
                value={timeFilterRevenue}
                onChange={(e) => setTimeFilterRevenue(e.target.value)}
                className="bg-zinc-900 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={loading}
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="12m">12 Months</option>
              </select>
            </div>
            {revenueGrowth.length > 0 ? (
              <div className="flex-1 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#34d399", strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center h-[300px] border border-dashed border-white/10 rounded-xl bg-zinc-900/20">
                <span className="text-zinc-500">No revenue data available</span>
              </div>
            )}
          </Card>
          
          {/* Revenue Summary */}
          <Card title="Revenue Snapshot" className="xl:col-span-1 justify-center space-y-6">
            <div className="flex flex-col">
              <span className="text-zinc-400 text-sm font-medium mb-1">Revenue This Month</span>
              <span className="text-4xl font-bold text-emerald-400">
                ${(revenue.monthlyRevenue || 0).toLocaleString()}
              </span>
            </div>
            <div className="h-px bg-white/10 w-full" />
            <div className="flex flex-col">
              <span className="text-zinc-400 text-sm font-medium mb-1">Active Paid Subscribers</span>
              <span className="text-3xl font-bold text-white">
                {(revenue.activePaidSubscribers || 0).toLocaleString()}
              </span>
            </div>
          </Card>
        </div>

        {/* 3. User Growth */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-zinc-100 font-semibold">User Growth</h3>
              <select
                value={timeFilterUser}
                onChange={(e) => setTimeFilterUser(e.target.value)}
                className="bg-zinc-900 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="12m">12 Months</option>
              </select>
            </div>
            
            {userGrowth.length > 0 ? (
              <div className="flex-1 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="users" name="Registrations" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#818cf8", strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center h-[300px] border border-dashed border-white/10 rounded-xl bg-zinc-900/20">
                <span className="text-zinc-500">No data available</span>
              </div>
            )}
          </Card>
        </div>

        {/* 4. Operations (Needs Attention & Recent Activity) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          <Card title="Needs Attention" className="min-h-[400px]">
            <div className="space-y-4">
              <Link to="/admin/reports" className="flex items-center justify-between p-4 bg-zinc-900/80 border border-white/5 rounded-xl hover:bg-zinc-800 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                    <IoWarningOutline className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Pending Reports</h4>
                    <p className="text-sm text-zinc-400">Requires moderation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-500 group-hover:text-white transition-colors">
                  <span className="text-xl font-semibold text-rose-400">{kpis.pendingReports || 0}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>

              <Link to="/admin/applications" className="flex items-center justify-between p-4 bg-zinc-900/80 border border-white/5 rounded-xl hover:bg-zinc-800 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                    <IoDocumentTextOutline className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Pending Mentor Applications</h4>
                    <p className="text-sm text-zinc-400">Awaiting review</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-500 group-hover:text-white transition-colors">
                  <span className="text-xl font-semibold text-amber-400">{kpis.pendingApplications || 0}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
              
              {(kpis.pendingReports === 0 && kpis.pendingApplications === 0) && (
                <div className="flex-1 flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-xl">
                  <span className="text-zinc-500">No pending items</span>
                </div>
              )}
            </div>
          </Card>

          <Card title="Recent Activity" className="min-h-[400px]">
            {recentActivity.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {recentActivity.map((activity: any) => {
                  let iconColor = "text-zinc-400";
                  let bgColor = "bg-zinc-800";
                  if (activity.type === "report") { iconColor = "text-rose-400"; bgColor = "bg-rose-500/20"; }
                  if (activity.type === "subscription") { iconColor = "text-emerald-400"; bgColor = "bg-emerald-500/20"; }
                  if (activity.type === "room") { iconColor = "text-purple-400"; bgColor = "bg-purple-500/20"; }
                  if (activity.type === "mentor") { iconColor = "text-amber-400"; bgColor = "bg-amber-500/20"; }
                  if (activity.type === "user") { iconColor = "text-blue-400"; bgColor = "bg-blue-500/20"; }
                  
                  const d = new Date(activity.time);
                  const isToday = new Date().toDateString() === d.toDateString();
                  const timeFormatted = isToday 
                    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });

                  return (
                    <div key={activity.id} className="relative flex items-start group">
                      <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 border-zinc-950 ${bgColor} ${iconColor} shrink-0 shadow shadow-zinc-900 absolute left-0`} />
                      <div className="w-full ml-8 flex flex-col bg-zinc-900/50 border border-white/5 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors">
                        <p className="text-sm text-zinc-300">{activity.text}</p>
                        <span className="text-xs text-zinc-500 mt-1">{timeFormatted}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full min-h-[200px] border border-dashed border-white/10 rounded-xl">
                <span className="text-zinc-500">No recent activity</span>
              </div>
            )}
          </Card>

        </div>

        {/* 5. Subscription Distribution */}
        {subscriptionDistribution.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Subscription Distribution">
              <div className="h-[250px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={subscriptionDistribution} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                      {subscriptionDistribution.map((_entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {subscriptionDistribution.map((plan: any, index: number) => (
                  <div key={plan.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-zinc-400">{plan.name} ({plan.value})</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
