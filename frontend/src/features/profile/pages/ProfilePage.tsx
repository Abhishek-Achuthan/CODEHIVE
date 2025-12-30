import ActivityCard from "../components/ActivityCard";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import LeftColumn from "../components/LeftColumn";
import MainContent from "../components/MainContent";
import MentorCard from "../components/MentorCard";
import PlanBillingCard from "../components/PlanBillingCard";
import ProfileHeader from "../components/ProfileHeader";
import RightColumn from "../components/RightColumn";
import SkillsSection from "../components/SkillsSection";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";

import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { useProfileUpdater } from "../hooks/useProfileUpdater";

import type { MentorChecklist, ProfileUser } from "../types";
import ProfileLinksDialog from "../components/ProfileLinkDialoge";

export default function ProfilePage() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { updateProfile } = useProfileUpdater();
  const [linksOpen, setLinksOpen] = useState(false);

  /* ------------------------ Derived Data ------------------------ */

  const profileUser: ProfileUser = useMemo(() => {
    const displayName = authUser
      ? `${authUser.firstName ?? ""} ${authUser.lastName ?? ""}`.trim()
      : "";

    return {
      displayName,
      email: authUser?.email ?? "",
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

  /* ------------------------- Helpers ---------------------------- */

  const openUrl = (url?: string) => {
    if (!url) {
      toast.error("Link not set");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* -------------------------- Render ---------------------------- */

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <ProfileLinksDialog
        open={linksOpen}
        initialValues={{
          githubUrl: authUser?.githubUrl,
          linkedInUrl: authUser?.linkedInUrl,
          websiteUrl: authUser?.websiteUrl,
        }}
        onCancel={() => setLinksOpen(false)}
        onSave={(values) => {
          updateProfile(values);
          setLinksOpen(false);
        }}
      />

      <main>
        <div className="mx-auto max-w-6xl px-4 py-4">
          {/* Header row */}
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
            <ProfileHeader
              user={profileUser}
              avatarMode="view"
              avatarImageSrc={null}
              avatarValues={{ crop: { x: 0, y: 0 }, zoom: 1 }}
              onAvatarSelectFile={() => {}}
              onAvatarCropChange={() => {}}
              onAvatarZoomChange={() => {}}
              onAvatarCropComplete={() => {}}
              onAvatarCancel={() => {}}
              onAvatarConfirm={() => {}}
              onEditProfile={() => setLinksOpen(true)}
              onClickMentor={() => {}}
              onClickDashboard={() => {}}
              onClickSessions={() => {}}
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
                  <AboutSection
                    initialText={authUser?.about ?? ""}
                    onSave={(text) => updateProfile({ about: text })}
                  />

                  <ExperienceSection
                    initialItems={authUser?.experience ?? []}
                    onSave={(items) => updateProfile({ experience: items })}
                  />

                  <SkillsSection
                    initialSkills={authUser?.skills ?? []}
                    onSave={(skills) => updateProfile({ skills })}
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

                  <MentorCard
                    checked={false}
                    disabled={false}
                    checklist={mentorChecklist}
                    onToggle={() => {}}
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
