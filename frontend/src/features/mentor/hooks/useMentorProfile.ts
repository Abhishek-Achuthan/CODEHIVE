import { useEffect, useState } from "react";
import { HttpStatusCode } from "axios";
import { MentorshipService } from "../../../services/mentorService";
import { BaseError } from "../../../shared/errors/BaseError";
import type { MentorProfileResponse } from "../../../shared/types/api/mentor";
import { APP_MESSAGES } from "../../../shared/constants/messages";

interface UseMentorProfileResult {
  mentor: MentorProfileResponse | null;
  isLoading: boolean;
  error: string | null;
  isNotFound: boolean;
}

export function useMentorProfile(
  mentorId: string | undefined
): UseMentorProfileResult {
  const [mentor, setMentor] = useState<MentorProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!mentorId) {
      setMentor(null);
      setError(APP_MESSAGES.MENTOR.INVALID_MENTOR_ID);
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchMentor = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      try {
        const data = await MentorshipService.getMentorProfile(mentorId);
        console.log(data,'data from the hook')
        if (!isMounted) {
          return;
        }

        setMentor(data);
      } catch (err: unknown) {
        if (!isMounted) {
          return;
        }

        const normalized =
          err instanceof BaseError
            ? err
            : new BaseError(APP_MESSAGES.MENTOR.PROFILE_LOAD_FAILED);

        setMentor(null);
        setError(normalized.message);
        setIsNotFound(normalized.status === HttpStatusCode.NotFound);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchMentor();

    return () => {
      isMounted = false;
    };
  }, [mentorId]);

  return {
    mentor,
    isLoading,
    error,
    isNotFound,
  };
}
