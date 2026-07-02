import { injectable, inject } from 'tsyringe';
import type { IAdminDashboardRepository } from '../../../domain/interfaces/IAdminDashboardRepository';

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
  recentActivity: {
    id: string;
    type: string;
    text: string;
    time: string;
    createdAt: string;
  }[];
}

export interface IGetDashboardMetricsUseCase {
  execute(timeFilterUser?: string, timeFilterRevenue?: string): Promise<IDashboardMetrics>;
}

@injectable()
export class GetDashboardMetricsUseCase implements IGetDashboardMetricsUseCase {
  constructor(
    @inject('IAdminDashboardRepository')
    private readonly _adminDashboardRepository: IAdminDashboardRepository
  ) {}

  async execute(timeFilterUser: string = '30', timeFilterRevenue: string = '30'): Promise<IDashboardMetrics> {
    const daysUser = timeFilterUser === '12m' ? 365 : parseInt(timeFilterUser) || 30;
    const daysRevenue = timeFilterRevenue === '12m' ? 365 : parseInt(timeFilterRevenue) || 30;

    const [
      totalUsers,
      totalMentors,
      activeRooms,
      pendingApplications,
      pendingReports,
      activeSubscriptions,
      userGrowth,
      revenueGrowth,
      monthlyRevenue,
      subscriptionDistribution,
      recentUsers,
      recentMentors,
      recentRooms,
      recentSubs,
      recentReports
    ] = await Promise.all([
      this._adminDashboardRepository.countUsersByRole('user'),
      this._adminDashboardRepository.countUsersByRole('mentor'),
      this._adminDashboardRepository.countActiveRooms(),
      this._adminDashboardRepository.countPendingMentorApplications(),
      this._adminDashboardRepository.countPendingReports(),
      this._adminDashboardRepository.countActiveSubscriptions(),
      this._adminDashboardRepository.getUserGrowth(daysUser),
      this._adminDashboardRepository.getRevenueGrowth(daysRevenue),
      this._adminDashboardRepository.calculateMonthlyRevenue(),
      this._adminDashboardRepository.getSubscriptionDistribution(),
      this._adminDashboardRepository.getRecentUsers(5),
      this._adminDashboardRepository.getRecentMentorApplications(5),
      this._adminDashboardRepository.getRecentRooms(5),
      this._adminDashboardRepository.getRecentSubscriptions(5),
      this._adminDashboardRepository.getRecentReports(5),
    ]);

    const activityFeed: any[] = [
      ...recentUsers.map((u: any) => ({ id: `usr_${u._id}`, type: 'user', text: `New user registered (${u.firstName} ${u.lastName})`, createdAt: u.createdAt })),
      ...recentMentors.map((m: any) => ({ id: `mnt_${m._id}`, type: 'mentor', text: `Mentor application submitted by ${m.firstName} ${m.lastName}`, createdAt: m.mentorAppliedAt || m.createdAt })),
      ...recentRooms.map((r: any) => ({ id: `rm_${r._id}`, type: 'room', text: `New room created (${r.title})`, createdAt: r.createdAt })),
      ...recentSubs.map((s: any) => ({ id: `sub_${s._id}`, type: 'subscription', text: `Subscription purchased`, createdAt: s.createdAt })),
      ...recentReports.map((r: any) => ({ id: `rep_${r._id}`, type: 'report', text: `New report submitted (${r.reason})`, createdAt: r.createdAt })),
    ];

    activityFeed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      kpis: {
        totalUsers,
        totalMentors,
        activeSubscriptions,
        activeRooms,
        pendingApplications,
        pendingReports,
      },
      userGrowth,
      revenueGrowth,
      revenue: {
        monthlyRevenue,
        activePaidSubscribers: activeSubscriptions,
      },
      subscriptionDistribution,
      recentActivity: activityFeed.slice(0, 5).map(item => ({
        ...item,
        time: new Date(item.createdAt).toISOString()
      }))
    };
  }
}
