export interface CurrentUserView {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  avatarUrl?: string;
  about?: string;
  skills?: string[];
  experience?: {
    id: string;
    type: "job" | "freelance" | "open_source" | "teaching" | "self_learning";
    title: string;
    organization?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
  }[];
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  mentorStatus?: "none" | "pending" | "approved";
  mentorAppliedAt?: string;
}
