import { useState, useEffect } from 'react';
import { getMyReviews } from '../../../api/endpoints/mentorAPI';
import type { ReviewEntity } from '../../../../../backend/src/domain/session/ReviewEntity'; // Just use any or simple interface

export interface MentorReview {
  id: string;
  sessionId: string;
  studentId: string;
  rating: number;
  reviewText?: string;
  createdAt: string;
  student?: {
    firstName: string;
    lastName: string;
  };
}

export function useMentorReviews() {
  const [reviews, setReviews] = useState<MentorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyReviews();
        setReviews(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, loading, error };
}
