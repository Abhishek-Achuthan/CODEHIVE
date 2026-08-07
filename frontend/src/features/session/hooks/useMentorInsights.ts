import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { getMyInsights } from '../../../api/endpoints/mentorAPI';

export interface MentorInsightsData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  completionRate: number;
  completedSessions: number;
  cancelledSessions: number;
}

export function useMentorInsights(isMentor: boolean) {
  const [insights, setInsights] = useState<MentorInsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(isMentor);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isMentor) {
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyInsights();
        setInsights(response.data);
      } catch (err) {
        const message = err instanceof AxiosError
          ? (err.response?.data?.message ?? 'Failed to fetch insights')
          : 'Failed to fetch insights';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [isMentor]);

  return { insights, loading, error };
}
