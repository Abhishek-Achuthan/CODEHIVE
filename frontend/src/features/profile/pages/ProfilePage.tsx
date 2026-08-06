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
import LanguagesSection from "../components/LanguagesSection";
import AccountSecurityCard from "../components/AccountSecurityCard";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import SetPasswordDialog from "../components/SetPasswordDialog";

import { useMemo, useRef, useState } from "react";
import {
  formatBillingIntervalLabel,
  formatSubscriptionDate,
  useMySubscription,
} from "../../subscription/hooks/useMySubscription";
import toast from "react-hot-toast";


import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { useProfileUpdater } from "../hooks/useProfileUpdater";
import { useMyActivity } from "../hooks/useMyActivity";

import type { MentorChecklist, ProfileUser } from "../types";
import { MentorStatus } from "../types";
import { BaseError } from "../../../shared/errors/BaseError";
import { UserRole } from "../../../shared/constants/auth";

export default function ProfilePage() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { updateProfile, applyForMentor, uploadAvatar } = useProfileUpdater();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isApplyingForMentor, setIsApplyingForMentor] = useState(false);
  const { subscription, loading: subscriptionLoading } = useMySubscription();
  const { activity } = useMyActivity();

  const hasPassword = Boolean(authUser?.hasPassword);

  const billingInfo = useMemo(() => {
    if (subscription) {
      return {
        planLabel: `${subscription.plan.name} · ${formatBillingIntervalLabel(subscription.billingInterval)}`,
        renewalLabel: formatSubscriptionDate(subscription.currentPeriodEnd),
        statusLabel: subscription.status.toLowerCase().replace(/_/g, " "),
        badgeLabel: subscription.plan.name.toUpperCase(),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      };
    }

    return {
      planLabel: "Free",
      renewalLabel: "—",
      statusLabel: undefined,
      badgeLabel: "FREE",
      cancelAtPeriodEnd: false,
    };
  }, [subscription]);

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
      languages: authUser?.languages,
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
    <div className="h-full bg-transparent text-white">

      {hasPassword ? (
        <ChangePasswordDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
        />
      ) : (
        <SetPasswordDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
        />
      )}

      <main>
        <div className="mx-auto max-w-6xl px-4 py-4">
          <MainContent
            left={
              <LeftColumn>
                <ProfileHeader
                  user={profileUser}
                  onSaveAvatar={uploadAvatar}
                  onSaveProfileHeader={(values) => updateProfile(values)}
                  onClickLinkedIn={() => openUrl(authUser?.linkedInUrl)}
                  onClickGitHub={() => openUrl(authUser?.githubUrl)}
                  onClickWebsite={() => openUrl(authUser?.websiteUrl)}
                />

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

                <LanguagesSection 
                  initialLanguages={authUser?.languages ?? []} 
                  onSave={(langs) => updateProfile({ languages: langs })}
                  role={authUser?.role}
                />

                <ExpertiseSection
                  initialPrimaryExpertise={authUser?.primaryExpertise}
                  initialExperienceLevel={authUser?.experienceLevel}
                  onSave={(data) => updateProfile(data)}
                />
              </LeftColumn>
            }
            right={
              <RightColumn>
                <ActivityCard
                  totalSessionsLabel={activity?.totalSessionsTaken?.toString() ?? "0"}
                  joinedRoomsLabel={activity?.joinedRooms?.toString() ?? "0"}
                  qnaContributionsLabel={activity?.qnaContributions?.toString() ?? "0"}
                />

                <PlanBillingCard
                  currentPlanLabel={billingInfo.planLabel}
                  renewalDateLabel={billingInfo.renewalLabel}
                  statusLabel={billingInfo.statusLabel}
                  badgeLabel={billingInfo.badgeLabel}
                  cancelAtPeriodEnd={billingInfo.cancelAtPeriodEnd}
                  loading={subscriptionLoading}
                />

                <AccountSecurityCard
                  onChangePassword={() => setIsPasswordDialogOpen(true)}
                  hasPassword={hasPassword}
                />

                {authUser && authUser.role !== UserRole.MENTOR && <MentorCard
                  checklist={mentorChecklist}
                  status={authUser?.mentorStatus ?? MentorStatus.NONE}
                  rejectionReason={undefined}
                  onApply={handleApplyForMentor}
                  onScrollToSection={scrollToSection}
                  isApplying={isApplyingForMentor}
                />}
              </RightColumn>
            }
          />
        </div>
      </main>

    </div>
  );
}
