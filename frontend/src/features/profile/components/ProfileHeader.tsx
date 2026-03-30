import { Globe, Pencil } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useState } from "react";

import type { ProfileUser } from "../types";
import ProfileAvatarCropper from "./ProfileAvatarCropper";
import SectionCard from "./SectionCard";
import ProfileHeaderEditDialog from "./ProfileHeaderEditDialog";

export interface ProfileHeaderProps {
  user: ProfileUser;
  readonly?: boolean;
  onSaveAvatar?: (img: File) => Promise<void>;
  onSaveProfileHeader?: (values: {
    firstName: string;
    lastName: string;
    phone?: string;
    githubUrl?: string;
    linkedInUrl?: string;
    websiteUrl?: string;
  }) => Promise<void>;
  onClickMentor?: () => void;
  onClickDashboard?: () => void;
  onClickSessions?: () => void;
  onClickGitHub?: () => void;
  onClickLinkedIn?: () => void;
  onClickWebsite?: () => void;
}

export default function ProfileHeader({
  user,
  readonly = false,
  onSaveAvatar,
  onSaveProfileHeader,
  onClickMentor,
  onClickDashboard,
  onClickSessions,
  onClickGitHub,
  onClickLinkedIn,
  onClickWebsite,
}: ProfileHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <SectionCard
      showHeader={false}
      className="mb-5 relative"
      contentClassName="py-4"
    >
      {!readonly && onSaveProfileHeader && (
        <ProfileHeaderEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          initialValues={{
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            githubUrl: user.githubUrl,
            linkedInUrl: user.linkedInUrl,
            websiteUrl: user.websiteUrl,
            avatarUrl: user.avatarUrl
          }}
          onSave={onSaveProfileHeader}
        />
      )}

      {!readonly && (
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
          aria-label="Edit profile"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <ProfileAvatarCropper
            url={user.avatarUrl}
            onSave={onSaveAvatar ?? (async () => undefined)}
            readonly={readonly}
          />

          <div>
            <div className="text-lg font-semibold leading-tight">
              {user.displayName}
            </div>

            <div className="text-sm text-gray-400">{user.email}</div>
            {user.phone ? (
              <div className="text-sm text-gray-400">{user.phone}</div>
            ) : null}

            {!readonly && (
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
            )}
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
