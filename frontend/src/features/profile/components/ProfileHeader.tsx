import { Globe, Pencil } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import type { ProfileUser } from "../types";
import ProfileAvatarCropper, {
  type AvatarCropMode,
  type AvatarCropValues,
} from "./ProfileAvatarCropper";
import SectionCard from "./SectionCard";
import type { Area } from "react-easy-crop";

export interface ProfileHeaderProps {
  user: ProfileUser;
  avatarMode: AvatarCropMode;
  avatarImageSrc: string | null;
  avatarValues: AvatarCropValues;
  onAvatarSelectFile: (file: File) => void;
  onAvatarCropChange: (crop: { x: number; y: number }) => void;
  onAvatarZoomChange: (zoom: number) => void;
  onAvatarCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onAvatarCancel: () => void;
  onAvatarConfirm: () => void;
  onEditProfile: () => void;
  onClickMentor: () => void;
  onClickDashboard: () => void;
  onClickSessions: () => void;
  onClickGitHub: () => void;
  onClickLinkedIn: () => void;
  onClickWebsite: () => void;
}

export default function ProfileHeader({
  user,
  avatarMode,
  avatarImageSrc,
  avatarValues,
  onAvatarSelectFile,
  onAvatarCropChange,
  onAvatarZoomChange,
  onAvatarCropComplete,
  onAvatarCancel,
  onAvatarConfirm,
  onEditProfile,
  onClickMentor,
  onClickDashboard,
  onClickSessions,
  onClickGitHub,
  onClickLinkedIn,
  onClickWebsite,
}: ProfileHeaderProps) {
  return (
    <SectionCard
      showHeader={false}
      className="mb-5 relative"
      contentClassName="py-4"
    >
      <button
        type="button"
        onClick={onEditProfile}
        className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
        aria-label="Edit profile"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <ProfileAvatarCropper
            mode={avatarMode}
            avatarPreviewUrl={user.avatarUrl}
            imageSrc={avatarImageSrc}
            values={avatarValues}
            onSelectFile={onAvatarSelectFile}
            onCropChange={onAvatarCropChange}
            onZoomChange={onAvatarZoomChange}
            onCropComplete={onAvatarCropComplete}
            onCancelCrop={onAvatarCancel}
            onConfirmCrop={onAvatarConfirm}
          />

          <div>
            <div className="text-lg font-semibold leading-tight">{user.displayName}</div>
            <div className="text-sm text-gray-400">{user.email}</div>

            <div className="mt-1 text-xs text-gray-400">
              <span className="text-gray-200">{user.roleTitle}</span> @ {user.company}
              <span className="mx-2 text-gray-600">|</span>
              {user.location}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onClickMentor}
                className="rounded-md border border-gray-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900"
              >
                Mentor
              </button>
              <button
                type="button"
                onClick={onClickDashboard}
                className="rounded-md border border-gray-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={onClickSessions}
                className="rounded-md border border-gray-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900"
              >
                Sessions
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end">
          <button
            type="button"
            onClick={onClickLinkedIn}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="LinkedIn"
            title={user.linkedInUrl ?? ""}
          >
            <FaLinkedin className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClickGitHub}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="GitHub"
            title={user.githubUrl ?? ""}
          >
            <FaGithub className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClickWebsite}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="Website"
            title={user.websiteUrl ?? ""}
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
