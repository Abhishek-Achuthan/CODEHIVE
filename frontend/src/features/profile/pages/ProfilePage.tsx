import ActivityCard from "../components/ActivityCard";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import ExpertiseSection from "../components/ExpertiseSection";
import LeftColumn from "../components/LeftColumn";
import MainContent from "../components/MainContent";
import MentorCard from "../components/MentorCard";
import PlanBillingCard from "../components/PlanBillingCard";
import ProfileHeader from "../components/ProfileHeader";
import RightColumn from "../components/RightColumn";
import SkillsSection from "../components/SkillsSection";
import AccountSecurityCard from "../components/AccountSecurityCard";
import ChangePasswordDialog from "../components/ChangePasswordDialog";

import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";

import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { useProfileUpdater } from "../hooks/useProfileUpdater";

import type { MentorChecklist, ProfileUser } from "../types";
import { MentorStatus } from "../types";
import { BaseError } from "../../../shared/errors/BaseError";

export default function ProfilePage() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { updateProfile, applyForMentor } = useProfileUpdater();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isApplyingForMentor, setIsApplyingForMentor] = useState(false);

  // Refs for scrolling to sections
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);

  //data
  const profileUser: ProfileUser = useMemo(() => {
    const displayName = authUser
      ? `${authUser.firstName ?? ""} ${authUser.lastName ?? ""}`.trim()
      : "";

    return {
      displayName,
      firstName: authUser?.firstName ?? "",
      lastName: authUser?.lastName ?? "",
      email: authUser?.email ?? "",
      phone: authUser?.phone,
      roleTitle: authUser?.role ?? "",
      company: "",
      location: "",
      avatarUrl: authUser?.avatarUrl ?? "",
      linkedInUrl: authUser?.linkedInUrl,
      githubUrl: authUser?.githubUrl,
      websiteUrl: authUser?.websiteUrl,
    };
  }, [authUser]);

  const mentorChecklist: MentorChecklist = useMemo(
    () => ({
      aboutComplete: Boolean((authUser?.about ?? "").trim()),
      skillsComplete: Boolean((authUser?.skills ?? []).length),
      experienceComplete: Boolean((authUser?.experience ?? []).length),
    }),
    [authUser]
  );

  //helpers
  const openUrl = (url?: string) => {
    if (!url) {
      toast.error("Link not set");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAvatarUpload = async (imageFile: File) => {
    try {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      const maxBytes = 5 * 1024 * 1024;

      if (!allowedTypes.includes(imageFile.type)) {
        throw new BaseError("Please select a JPG, PNG, or WEBP image");
      }
      if (imageFile.size > maxBytes) {
        throw new BaseError("Image must be 5MB or less");
      }

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
        | string
        | undefined;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
        | string
        | undefined;

      if (!cloudName || !uploadPreset) {
        throw new BaseError(
          "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET"
        );
      }

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", uploadPreset);

      const folder = import.meta.env.VITE_CLOUDINARY_FOLDER as string | undefined;
      if (folder && folder.trim().length) {
        formData.append("folder", folder.trim());
      }

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const json = (await res.json()) as unknown;
      if (!res.ok) {
        const message =
          json &&
            typeof json === "object" &&
            json !== null &&
            "error" in json &&
            (json as { error?: unknown }).error &&
            typeof (json as { error?: { message?: unknown } }).error?.message === "string"
            ? ((json as { error: { message: string } }).error.message as string)
            : "Failed to upload image";

        throw new BaseError(message);
      }

      const secureUrl =
        json &&
          typeof json === "object" &&
          json !== null &&
          "secure_url" in json &&
          typeof (json as { secure_url?: unknown }).secure_url === "string"
          ? ((json as { secure_url: string }).secure_url as string)
          : "";

      if (!secureUrl) {
        throw new BaseError("Cloudinary upload did not return a secure URL");
      }

      await updateProfile({ avatarUrl: secureUrl });
      toast.success("Avatar updated");
    } catch (error) {
      if (error instanceof BaseError) toast.error(error.message);
      else if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to update avatar");
      throw error;
    }
  };

  const scrollToSection = (section: 'about' | 'skills' | 'experience') => {
    const refs = { about: aboutRef, skills: skillsRef, experience: experienceRef };
    const targetRef = refs[section];

    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

      targetRef.current.classList.add('ring-2', 'ring-purple-500/50', 'rounded-lg');
      setTimeout(() => {
        targetRef.current?.classList.remove('ring-2', 'ring-purple-500/50', 'rounded-lg');
      }, 2000);
    }
  };

  const handleApplyForMentor = async () => {
    try {
      setIsApplyingForMentor(true);

      await applyForMentor();

      toast.success('Application submitted! We\'ll review your profile shortly.');
    } catch (error) {
      if (error instanceof BaseError) toast.error(error.message);
      else if (error instanceof Error) toast.error(error.message);
      else toast.error('Failed to submit application');
    } finally {
      setIsApplyingForMentor(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      <main>
        <div className="mx-auto max-w-6xl px-4 py-4">
          {/* Header row */}
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
            <ProfileHeader
              user={profileUser}
              onSaveAvatar={handleAvatarUpload}
              onSaveProfileHeader={(values) => updateProfile(values)}
              onClickMentor={() => { }}
              onClickDashboard={() => { }}
              onClickSessions={() => { }}
              onClickLinkedIn={() => openUrl(authUser?.linkedInUrl)}
              onClickGitHub={() => openUrl(authUser?.githubUrl)}
              onClickWebsite={() => openUrl(authUser?.websiteUrl)}
            />

            <ActivityCard
              totalSessionsLabel="5"
              joinedRoomsLabel="10"
              qnaContributionsLabel="7"
            />
          </div>

          {/* Main content */}
          <div className="mt-3">
            <MainContent
              left={
                <LeftColumn>
                  <div ref={aboutRef}>
                    <AboutSection
                      initialText={authUser?.about ?? ""}
                      onSave={(text) => updateProfile({ about: text })}
                    />
                  </div>

                  <div ref={experienceRef}>
                    <ExperienceSection
                      initialItems={authUser?.experience ?? []}
                      onSave={(items) => updateProfile({ experience: items })}
                    />
                  </div>

                  <div ref={skillsRef}>
                    <SkillsSection
                      initialSkills={authUser?.skills ?? []}
                      onSave={(skills) => updateProfile({ skills })}
                    />
                  </div>

                  <ExpertiseSection
                    initialPrimaryExpertise={authUser?.primaryExpertise}
                    initialExperienceLevel={authUser?.experienceLevel}
                    onSave={(data) => updateProfile(data)}
                  />
                </LeftColumn>
              }
              right={
                <RightColumn>
                  <PlanBillingCard
                    currentPlanLabel="PRO"
                    renewalDateLabel="11/10/2025"
                    badgeLabel="PRO"
                  />

                  <AccountSecurityCard
                    onChangePassword={() => setChangePasswordOpen(true)}
                  />

                  <MentorCard
                    checklist={mentorChecklist}
                    status={authUser?.mentorStatus ?? MentorStatus.NONE}
                    rejectionReason={undefined}
                    onApply={handleApplyForMentor}
                    onScrollToSection={scrollToSection}
                    isApplying={isApplyingForMentor}
                  />
                </RightColumn>
              }
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
