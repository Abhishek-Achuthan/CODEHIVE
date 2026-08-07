import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { getMyReviews } from '../../../api/endpoints/mentorAPI';


export interface MentorReview {
  id: string;
  sessionId: string;
  roomId?: string;
  studentId: string;
  rating: number;
  reviewText?: string;
  createdAt: string;
  student?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role?: string;
  };
}

export function useMentorReviews(initialPage = 1, limit = 6) {
  const [reviews, setReviews] = useState<MentorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyReviews(page, limit);
      setReviews(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err instanceof AxiosError
        ? (err.response?.data?.message ?? 'Failed to fetch reviews')
        : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  return { reviews, loading, error, currentPage, totalPages, setCurrentPage, refetch: () => fetchReviews(currentPage) };
}
