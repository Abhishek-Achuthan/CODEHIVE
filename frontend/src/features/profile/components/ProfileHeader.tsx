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
  onClickGitHub?: () => void;
  onClickLinkedIn?: () => void;
  onClickWebsite?: () => void;
}

export default function ProfileHeader({
  user,
  readonly = false,
  onSaveAvatar,
  onSaveProfileHeader,
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



      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfileAvatarCropper
            url={user.avatarUrl}
            onSave={onSaveAvatar ?? (async () => undefined)}
            readonly={readonly}
          />

          <div className="flex flex-col justify-center">
            <div className="text-xl font-bold leading-tight">
              {user.displayName}
            </div>

            <div className="text-sm text-gray-400 mt-1">{user.email}</div>
            {user.phone ? (
              <div className="text-sm text-gray-400">{user.phone}</div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClickLinkedIn}
              className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900 transition-colors"
              aria-label="LinkedIn"
              title={user.linkedInUrl ?? ""}
            >
              <FaLinkedin className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClickGitHub}
              className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900 transition-colors"
              aria-label="GitHub"
              title={user.githubUrl ?? ""}
            >
              <FaGithub className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClickWebsite}
              className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900 transition-colors"
              aria-label="Website"
              title={user.websiteUrl ?? ""}
            >
              <Globe className="h-4 w-4" />
            </button>
          </div>

          {!readonly && (
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-black px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm"
              aria-label="Edit profile"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
