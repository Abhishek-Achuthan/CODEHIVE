import { injectable, inject } from 'tsyringe';
import type {
  IAdminDashboardRepository,
} from '../../../domain/interfaces/IAdminDashboardRepository';
import type {
  DashboardRecentActivityItem,
  IDashboardMetrics,
  IGetDashboardMetricsUseCase,
} from '../interface/admin/IGetDashboardMetricsUseCase';

type DashboardActivityFeedItem = Omit<DashboardRecentActivityItem, 'time' | 'createdAt'> & {
  createdAt: Date;
};

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

    const activityFeed: DashboardActivityFeedItem[] = [
      ...recentUsers.map((user) => ({
        id: `usr_${user._id}`,
        type: 'user',
        text: `New user registered (${user.firstName} ${user.lastName})`,
        createdAt: user.createdAt,
      })),
      ...recentMentors.map((mentor) => ({
        id: `mnt_${mentor._id}`,
        type: 'mentor',
        text: `Mentor application submitted by ${mentor.firstName} ${mentor.lastName}`,
        createdAt: mentor.mentorAppliedAt || mentor.createdAt,
      })),
      ...recentRooms.map((room) => ({
        id: `rm_${room._id}`,
        type: 'room',
        text: `New room created (${room.title})`,
        createdAt: room.createdAt,
      })),
      ...recentSubs.map((subscription) => ({
        id: `sub_${subscription._id}`,
        type: 'subscription',
        text: 'Subscription purchased',
        createdAt: subscription.createdAt,
      })),
      ...recentReports.map((report) => ({
        id: `rep_${report._id}`,
        type: 'report',
        text: `New report submitted (${report.reason})`,
        createdAt: report.createdAt,
      })),
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
      recentActivity: activityFeed.slice(0, 5).map((item) => ({
        ...item,
        time: new Date(item.createdAt).toISOString(),
        createdAt: item.createdAt.toISOString(),
      })),
    };
  }
}
