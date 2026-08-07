export interface DashboardRecentActivityItem {
  id: string;
  type: string;
  text: string;
  time: string;
  createdAt: string;
}

export interface IDashboardMetrics {
  kpis: {
    totalUsers: number;
    totalMentors: number;
    activeSubscriptions: number;
    activeRooms: number;
    pendingApplications: number;
    pendingReports: number;
  };
  userGrowth: {
    name: string;
    users: number;
  }[];
  revenueGrowth: {
    name: string;
    revenue: number;
  }[];
  revenue: {
    monthlyRevenue: number;
    activePaidSubscribers: number;
  };
  subscriptionDistribution: {
    name: string;
    value: number;
  }[];
  recentActivity: DashboardRecentActivityItem[];
}

export interface IGetDashboardMetricsUseCase {
  execute(timeFilterUser?: string, timeFilterRevenue?: string): Promise<IDashboardMetrics>;
}
