export interface IAdminDashboardRepository {
  countUsersByRole(role: string): Promise<number>;
  countActiveRooms(): Promise<number>;
  countPendingMentorApplications(): Promise<number>;
  countPendingReports(): Promise<number>;
  countActiveSubscriptions(): Promise<number>;

  getUserGrowth(days: number): Promise<{ name: string; users: number }[]>;
  getRevenueGrowth(days: number): Promise<{ name: string; revenue: number }[]>;
  calculateMonthlyRevenue(): Promise<number>;
  getSubscriptionDistribution(): Promise<{ name: string; value: number }[]>;
  
  getRecentUsers(limit: number): Promise<any[]>;
  getRecentMentorApplications(limit: number): Promise<any[]>;
  getRecentRooms(limit: number): Promise<any[]>;
  getRecentSubscriptions(limit: number): Promise<any[]>;
  getRecentReports(limit: number): Promise<any[]>;
}
