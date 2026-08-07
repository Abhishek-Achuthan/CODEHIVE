import { Types } from 'mongoose';

export interface AdminDashboardRecentUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface AdminDashboardRecentMentorApplication {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  createdAt: Date;
  mentorAppliedAt?: Date;
}

export interface AdminDashboardRecentRoom {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
}

export interface AdminDashboardRecentSubscription {
  _id: Types.ObjectId;
  createdAt: Date;
}

export interface AdminDashboardRecentReport {
  _id: Types.ObjectId;
  reason: string;
  createdAt: Date;
}

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
  
  getRecentUsers(limit: number): Promise<AdminDashboardRecentUser[]>;
  getRecentMentorApplications(limit: number): Promise<AdminDashboardRecentMentorApplication[]>;
  getRecentRooms(limit: number): Promise<AdminDashboardRecentRoom[]>;
  getRecentSubscriptions(limit: number): Promise<AdminDashboardRecentSubscription[]>;
  getRecentReports(limit: number): Promise<AdminDashboardRecentReport[]>;
}
