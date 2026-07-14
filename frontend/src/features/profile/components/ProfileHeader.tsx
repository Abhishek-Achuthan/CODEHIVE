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
      className="mb-2 relative border-none bg-transparent"
      contentClassName="p-0"
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

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-[#121214] p-6 rounded-2xl border border-zinc-800 shadow-sm relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 z-10">
          <ProfileAvatarCropper
            url={user.avatarUrl}
            onSave={onSaveAvatar ?? (async () => undefined)}
            readonly={readonly}
          />

          <div className="flex flex-col items-center sm:items-start pt-1">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
              {user.displayName}
            </h1>
            
            {user.roleTitle && (
              <div className="text-sm font-medium text-indigo-400 mt-1 uppercase tracking-wide">
                {user.roleTitle}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-3 text-sm text-zinc-400">
              <span>{user.email}</span>
              {user.phone && (
                <>
                  <span className="hidden sm:inline text-zinc-700">•</span>
                  <span>{user.phone}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClickLinkedIn}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-[#09090b] p-2.5 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
              aria-label="LinkedIn"
              title={user.linkedInUrl ?? ""}
            >
              <FaLinkedin className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClickGitHub}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-[#09090b] p-2.5 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
              aria-label="GitHub"
              title={user.githubUrl ?? ""}
            >
              <FaGithub className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClickWebsite}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-[#09090b] p-2.5 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-indigo-500 transition-all shadow-sm"
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
