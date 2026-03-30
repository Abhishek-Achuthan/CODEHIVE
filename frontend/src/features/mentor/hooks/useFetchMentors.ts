import { useEffect, useState } from "react";
import { MentorshipService } from "../../../services/mentorService";
import { BaseError } from "../../../shared/errors/BaseError";
import { useDebounce } from "../../admin/hooks/useDebounce";
import { mapMentorListItemToView } from "../../../shared/mappers/mentor.mapper";
import type {
  MentorCardData,
  MentorListingParams,
} from "../../../shared/types/api/mentor";

export function useFetchMentors(initialParams?: MentorListingParams) {
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [mentors, setMentors] = useState<MentorCardData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [params, setParams] = useState<MentorListingParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });
  const [retryCount, setRetryCount] = useState<number>(0);

  const debouncedSearch = useDebounce(params.search, 500);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMentors() {
      try {
        setLoading(true);
        setError(null);

        const response = await MentorshipService.listMentors({
          ...params,
          search: debouncedSearch,
        });

        if (response.items) {
          const mappedMentors = response.items.map(mapMentorListItemToView);
          setMentors(mappedMentors);
          setTotalPages(response.totalPages);
        }
      } catch (err) {
        if (err instanceof BaseError) {
          setError(err.message);
        } else {
          setError("Unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMentors();

    return () => controller.abort();
  }, [debouncedSearch, params.page, params.limit, retryCount]);

  return {
    loading,
    mentors,
    error,
    params,
    setParams,
    totalPages,
    retry: () => setRetryCount((count) => count + 1),
  };
}
