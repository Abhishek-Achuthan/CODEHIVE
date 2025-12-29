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

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";

import type {
  AboutData,
  MentorChecklist,
  ProfileEditSection,
  ProfileUser,
  SkillsData,
  ExperienceItem,
} from "../types";

export default function ProfilePage() {
  const activeEditSection: ProfileEditSection = null;

  const user: ProfileUser = {
    displayName: "Kunjuz",
    email: "kunju@gmail.com",
    roleTitle: "Software engineer",
    company: "meta",
    location: "kochi ,india",
    avatarUrl:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=256&h=256&q=60",
    linkedInUrl: "https://www.linkedin.com/in/kunjuz",
    githubUrl: "https://github.com/kunjuz",
    websiteUrl: "https://kunjuz.dev",
  };

  const about: AboutData = {
    text: "I’m a Software Engineer with experience in JavaScript, specializing in React and Node.js. I focus on building efficient, scalable web applications and writing clean, maintainable code.",
  };

  const experience: ExperienceItem[] = [
    {
      id: "exp_1",
      type: "job",
      title: "Software engineer",
      organization: "Meta-Full-time",
      dateRangeLabel: "Aug 2024 - present - 1 year",
    },
  ];

  const skills: SkillsData = {
    skills: ["Javascript", "Node js", "MongoDB", "React"],
    inputValue: "",
  };

  const mentorChecklist: MentorChecklist = {
    aboutComplete: true,
    skillsComplete: true,
    experienceComplete: true,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main>
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
            <ProfileHeader
              user={user}
              avatarMode={activeEditSection === "avatar" ? "cropping" : "view"}
              avatarImageSrc={null}
              avatarValues={{ crop: { x: 0, y: 0 }, zoom: 1 }}
              onAvatarSelectFile={() => {}}
              onAvatarCropChange={() => {}}
              onAvatarZoomChange={() => {}}
              onAvatarCropComplete={() => {}}
              onAvatarCancel={() => {}}
              onAvatarConfirm={() => {}}
              onEditProfile={() => {}}
              onClickMentor={() => {}}
              onClickDashboard={() => {}}
              onClickSessions={() => {}}
              onClickLinkedIn={() => {}}
              onClickGitHub={() => {}}
              onClickWebsite={() => {}}
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
                    mode={activeEditSection === "about" ? "edit" : "view"}
                    value={about}
                    draftText={about.text}
                    onStartEdit={() => {}}
                    onCancelEdit={() => {}}
                    onSaveEdit={() => {}}
                    onDraftChange={() => {}}
                  />
                  <ExperienceSection
                    mode={activeEditSection === "experience" ? "edit" : "view"}
                    items={experience}
                    onStartEdit={() => {}}
                    onCancelEdit={() => {}}
                    onSaveEdit={() => {}}
                    onEditItem={() => {}}
                    onDeleteItem={() => {}}
                  />
                  <SkillsSection
                    mode={activeEditSection === "skills" ? "edit" : "view"}
                    value={skills}
                    onStartEdit={() => {}}
                    onCancelEdit={() => {}}
                    onSaveEdit={() => {}}
                    onInputChange={() => {}}
                    onAddSkill={() => {}}
                    onRemoveSkill={() => {}}
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
