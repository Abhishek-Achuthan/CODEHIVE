import { injectable } from 'tsyringe';
import { Model, Types } from 'mongoose';
import {
  AdminDashboardRecentMentorApplication,
  AdminDashboardRecentReport,
  AdminDashboardRecentRoom,
  AdminDashboardRecentSubscription,
  AdminDashboardRecentUser,
  IAdminDashboardRepository,
} from '../../../domain/interfaces/IAdminDashboardRepository';
import UserModel from '../models/UserModel';
import RoomModel from '../models/room/RoomModel';
import RoomReportModel from '../models/room/RoomReportModel';
import SubscriptionModel from '../models/SubscriptionModel';
import { MentorStatus } from '../../../domain/types/MentorStatus';
import type { SubscriptionDocument } from '../schemas/SubscriptionSchema';
import type { PlanDocument } from '../schemas/PlanSchema';
import type { RoomReportDocument } from '../schemas/room/RoomReportSchema';

type SubscriptionWithPlan = Omit<SubscriptionDocument, 'planId'> & {
  planId: PlanDocument | Types.ObjectId;
};

const isPopulatedPlan = (plan: SubscriptionWithPlan['planId']): plan is PlanDocument =>
  !(plan instanceof Types.ObjectId);

const roomReportModel = RoomReportModel as Model<RoomReportDocument>;

@injectable()
export class AdminDashboardRepository implements IAdminDashboardRepository {
  async countUsersByRole(role: string): Promise<number> {
    return UserModel.countDocuments({ role });
  }

  async countActiveRooms(): Promise<number> {
    return RoomModel.countDocuments({ status: 'active' });
  }

  async countPendingMentorApplications(): Promise<number> {
    return UserModel.countDocuments({ 
      mentorStatus: MentorStatus.PENDING,
      mentorAppliedAt: { $exists: true }
    });
  }

  async countPendingReports(): Promise<number> {
    return RoomReportModel.countDocuments({ status: 'pending' });
  }

  async countActiveSubscriptions(): Promise<number> {
    return SubscriptionModel.countDocuments({ status: 'ACTIVE' });
  }

  async getUserGrowth(days: number): Promise<{ name: string; users: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const isMonthly = days > 60;
    
    const groupBy = isMonthly 
      ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
      : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    
    const results = await UserModel.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    return results.map(r => {
       const dateStr = r._id;
       let name = dateStr;
       if (isMonthly) {
         const [year, month] = dateStr.split('-');
         const d = new Date(parseInt(year), parseInt(month) - 1);
         name = d.toLocaleString('default', { month: 'short' }) + ' ' + year;
       } else {
         const d = new Date(dateStr);
         name = d.toLocaleString('default', { month: 'short', day: 'numeric' });
       }
       return { name, users: r.count };
    });
  }

  async getRevenueGrowth(days: number): Promise<{ name: string; revenue: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const isMonthly = days > 60;
    
    const groupBy = isMonthly 
      ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
      : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    
    const results = await SubscriptionModel.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'ACTIVE' } },
      {
        $lookup: {
          from: 'plans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan'
        }
      },
      { $unwind: '$plan' },
      {
        $group: {
          _id: groupBy,
          revenue: { 
             $sum: { 
               $cond: [
                 { $eq: ['$billingInterval', 'yearly'] },
                 { $divide: [{ $ifNull: ['$plan.pricing.yearly', 0] }, 12] },
                 { $ifNull: ['$plan.pricing.monthly', 0] }
               ] 
             } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    return results.map(r => {
       const dateStr = r._id;
       let name = dateStr;
       if (isMonthly) {
         const [year, month] = dateStr.split('-');
         const d = new Date(parseInt(year), parseInt(month) - 1);
         name = d.toLocaleString('default', { month: 'short' }) + ' ' + year;
       } else {
         const d = new Date(dateStr);
         name = d.toLocaleString('default', { month: 'short', day: 'numeric' });
       }
       return { name, revenue: Math.round(r.revenue) };
    });
  }

  async calculateMonthlyRevenue(): Promise<number> {
    const activeSubs = await SubscriptionModel.find({ status: 'ACTIVE' }).populate<{ planId: PlanDocument }>('planId');
    let total = 0;
    for (const sub of activeSubs as SubscriptionWithPlan[]) {
      if (!isPopulatedPlan(sub.planId)) {
        continue;
      }

      if (sub.billingInterval === 'yearly') {
        total += sub.planId.pricing.yearly / 12;
      } else {
        total += sub.planId.pricing.monthly;
      }
    }
    return Math.round(total);
  }

  async getSubscriptionDistribution(): Promise<{ name: string; value: number }[]> {
    const results = await SubscriptionModel.aggregate([
      { $match: { status: 'ACTIVE' } },
      {
        $lookup: {
          from: 'plans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan'
        }
      },
      { $unwind: '$plan' },
      {
        $group: {
          _id: '$plan.name',
          value: { $sum: 1 }
        }
      },
      { $sort: { value: -1 } }
    ]);
    return results.map(r => ({ name: r._id, value: r.value }));
  }

  async getRecentUsers(limit: number): Promise<AdminDashboardRecentUser[]> {
    return UserModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }

  async getRecentMentorApplications(limit: number): Promise<AdminDashboardRecentMentorApplication[]> {
    return UserModel.find({ mentorAppliedAt: { $exists: true } }).sort({ mentorAppliedAt: -1 }).limit(limit).lean();
  }

  async getRecentRooms(limit: number): Promise<AdminDashboardRecentRoom[]> {
    return RoomModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }

  async getRecentSubscriptions(limit: number): Promise<AdminDashboardRecentSubscription[]> {
    return SubscriptionModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }

  async getRecentReports(limit: number): Promise<AdminDashboardRecentReport[]> {
    return roomReportModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }
}
