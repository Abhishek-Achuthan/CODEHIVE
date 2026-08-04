import { useEffect, useState } from "react";
import { getMyActivity } from "../../../api/endpoints/userAPI";
import toast from "react-hot-toast";

export interface UserActivityStats {
  totalSessionsTaken: number;
  joinedRooms: number;
  qnaContributions: number;
}

export function useMyActivity() {
  const [activity, setActivity] = useState<UserActivityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await getMyActivity();
        setActivity(response.data);
      } catch (error) {
        console.error("Failed to fetch user activity:", error);
        toast.error("Failed to load activity statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activity, loading };
}
