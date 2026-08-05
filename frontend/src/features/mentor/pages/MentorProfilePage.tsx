import { useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

import ProfileHeader from "../../profile/components/ProfileHeader";
import AboutSection from "../../profile/components/AboutSection";
import ExperienceSection from "../../profile/components/ExperienceSection";
import SkillsSection from "../../profile/components/SkillsSection";
import ExpertiseSection from "../../profile/components/ExpertiseSection";
import LeftColumn from "../../profile/components/LeftColumn";
import RightColumn from "../../profile/components/RightColumn";
import MainContent from "../../profile/components/MainContent";

import type { ProfileUser } from "../../profile/types";
import type { ExperienceDraftItem } from "../../profile/types";

import { useMentorProfile } from "../hooks/useMentorProfile";
import BookSessionCard from "../components/BookSessionCard";
import LanguagesSection from "../../profile/components/LanguagesSection";

export default function MentorProfilePage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();

  const { mentor, isLoading, error, isNotFound } = useMentorProfile(mentorId);

  const profileUser = useMemo((): ProfileUser => {
    if (!mentor) {
      return {
        displayName: "",
        firstName: "",
        lastName: "",
        email: "",
        roleTitle: "",
        company: "",
        location: "",
        avatarUrl: "",
      };
    }

    return {
      displayName: `${mentor.firstName} ${mentor.lastName}`.trim(),
      firstName: mentor.firstName,
      lastName: mentor.lastName,
      email: mentor.email,
      phone: mentor.phone,
      roleTitle: mentor.primaryExpertise ?? "",
      company: "",
      location: "",
      avatarUrl: mentor.avatarUrl ?? "",
      githubUrl: mentor.githubUrl,
      linkedInUrl: mentor.linkedInUrl,
      websiteUrl: mentor.websiteUrl,
    };
  }, [mentor]);

  const experienceItems = useMemo((): ExperienceDraftItem[] => {
    return (mentor?.experience ?? []).map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      organization: item.organization,
      startDate: item.startDate,
      endDate: item.endDate,
      isCurrent: item.isCurrent,
    }));
  }, [mentor]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (isNotFound) {
    return <Navigate to="/sessions/discover" replace />;
  }

  if (error || !mentor) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-lg font-semibold text-red-400">
          Failed to load mentor profile
        </p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  const openUrl = (url?: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sessions
      </button>

      {/* Main content 2-column layout */}
      <MainContent
        left={
          <LeftColumn>
            <ProfileHeader
              user={profileUser}
              readonly
              onClickLinkedIn={() => openUrl(mentor.linkedInUrl)}
              onClickGitHub={() => openUrl(mentor.githubUrl)}
              onClickWebsite={() => openUrl(mentor.websiteUrl)}
            />

            <AboutSection initialText={mentor.about ?? ""} readonly />

            <ExperienceSection initialItems={experienceItems} readonly />


            <SkillsSection initialSkills={mentor.skills} readonly />

            <LanguagesSection initialLanguages={mentor.languages ?? []} readonly />

            <ExpertiseSection
              initialPrimaryExpertise={mentor.primaryExpertise}
              initialExperienceLevel={mentor.experienceLevel}
              readonly
            />
          </LeftColumn>
        }
        right={
          <RightColumn>
            {mentorId && <BookSessionCard mentorId={mentorId} />}
          </RightColumn>
        }
      />
    </div>
  );
}
