import { useState, useEffect } from 'react';
import { AdminService } from '../../../services/adminService';
import {type  DashboardMetrics } from '../../../shared/types/api';

export const useDashboardData = (timeFilterUser: string = '30', timeFilterRevenue: string = '30') => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const metricsData = await AdminService.getDashboardMetrics(timeFilterUser, timeFilterRevenue);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilterUser, timeFilterRevenue]);

  return {
    loading,
    metrics
  };
};
