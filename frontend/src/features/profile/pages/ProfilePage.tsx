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

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";

import { useAppDispatch, useAppSelector } from "../../../shared/hooks/storeHooks";
import { UserService } from "../../../services/userService";
import { BaseError } from "../../../shared/errors/BaseError";
import { setCurrentUser } from "../../../store/slices/authSlice";
import { useProfileUpdater } from "../hooks/useProfileUpdater";

import type {
  MentorChecklist,
  ProfileUser,
} from "../types";


export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);

  const [linksDialogOpen, setLinksDialogOpen] = useState(false);
  const [githubUrlDraft, setGithubUrlDraft] = useState(authUser?.githubUrl ?? "");
  const [linkedInUrlDraft, setLinkedInUrlDraft] = useState(authUser?.linkedInUrl ?? "");
  const [websiteUrlDraft, setWebsiteUrlDraft] = useState(authUser?.websiteUrl ?? "");

  const {updateProfile} = useProfileUpdater();

  const [saving, setSaving] = useState(false);

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

  const openUrl = (url?: string) => {
    if (!url) {
      toast.error("Link not set");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const startEditLinks = () => {
    setGithubUrlDraft(authUser?.githubUrl ?? "");
    setLinkedInUrlDraft(authUser?.linkedInUrl ?? "");
    setWebsiteUrlDraft(authUser?.websiteUrl ?? "");
    setLinksDialogOpen(true);
  };

  const saveLinks = async () => {
    try {
      if (saving) return;
      if (!authUser) {
        toast.error("You must be signed in.");
        return;
      }

      setSaving(true);

      const updated = await UserService.updateMyProfile({
        githubUrl: githubUrlDraft.trim() || undefined,
        linkedInUrl: linkedInUrlDraft.trim() || undefined,
        websiteUrl: websiteUrlDraft.trim() || undefined,
      });

      dispatch(setCurrentUser({ ...authUser, ...updated }));
      toast.success("Profile updated");
      setLinksDialogOpen(false);
    } catch (error) {
      if (error instanceof BaseError) toast.error(error.message);
      else toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <Dialog open={linksDialogOpen} onOpenChange={setLinksDialogOpen}>
        <DialogContent className="border border-gray-800 bg-black text-white">
          <DialogHeader>
            <DialogTitle>Edit profile links</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-gray-400">GitHub</span>
              <input
                value={githubUrlDraft}
                onChange={(e) => setGithubUrlDraft(e.target.value)}
                placeholder="https://github.com/username"
                className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-600/40"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-gray-400">LinkedIn</span>
              <input
                value={linkedInUrlDraft}
                onChange={(e) => setLinkedInUrlDraft(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-600/40"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-gray-400">Website</span>
              <input
                value={websiteUrlDraft}
                onChange={(e) => setWebsiteUrlDraft(e.target.value)}
                placeholder="https://your-site.com"
                className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-600/40"
              />
            </label>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setLinksDialogOpen(false)}
              className="rounded-md border border-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveLinks}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <main>
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
            <ProfileHeader
              user={profileUser}
              avatarMode={activeEditSection === "avatar" ? "cropping" : "view"}
              avatarImageSrc={null}
              avatarValues={{ crop: { x: 0, y: 0 }, zoom: 1 }}
              onAvatarSelectFile={() => {}}
              onAvatarCropChange={() => {}}
              onAvatarZoomChange={() => {}}
              onAvatarCropComplete={() => {}}
              onAvatarCancel={() => {}}
              onAvatarConfirm={() => {}}
              onEditProfile={startEditLinks}
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

          <div className="mt-3">
            <MainContent
              left={
                <LeftColumn>
                  <AboutSection
                    initialText={authUser?.about??""}
                    onSave={(text) => updateProfile({about:text})}
                  />
                  <ExperienceSection
                   initialItems = {authUser?.experience ??[]}
                   onSave = {(items) => updateProfile({experience:items})}
                  />
                  <SkillsSection
                    initialSkills ={authUser?.skills ??[]}
                    onSave = {(skills) => updateProfile({skills})}
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
