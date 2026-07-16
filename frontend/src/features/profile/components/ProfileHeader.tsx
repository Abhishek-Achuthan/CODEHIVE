import { Globe, Pencil } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useState } from "react";

import type { ProfileUser } from "../types";
import ProfileAvatarCropper from "./ProfileAvatarCropper";
import SectionCard from "./SectionCard";
import ProfileHeaderEditDialog from "./ProfileHeaderEditDialog";

export interface ProfileHeaderProps {
  user: ProfileUser & { languages?: import("../../../shared/types/domain/language.types").UserLanguage[] };
  readonly?: boolean;
  onSaveAvatar?: (img: File) => Promise<void>;
  onSaveProfileHeader?: (values: {
    firstName: string;
    lastName: string;
    phone?: string;
    githubUrl?: string;
    linkedInUrl?: string;
    websiteUrl?: string;
    languages?: import("../../../shared/types/domain/language.types").UserLanguage[];
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
      className="mb-6 relative overflow-hidden"
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
            avatarUrl: user.avatarUrl,
            languages: user.languages
          }}
          onSave={onSaveProfileHeader}
        />
      )}

      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 w-full z-10 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 flex-1 w-full">
          <ProfileAvatarCropper
            url={user.avatarUrl}
            onSave={onSaveAvatar ?? (async () => undefined)}
            readonly={readonly}
          />

          <div className="flex flex-col items-center sm:items-start flex-1 pt-1 w-full">
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight text-center sm:text-left">
              {user.displayName}
            </h1>
            
            {user.roleTitle && (
              <div className="text-[13px] font-bold text-indigo-400 mt-1.5 uppercase tracking-wider">
                {user.roleTitle}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mt-6 text-[14px] text-zinc-400">
              <span className="flex items-center gap-2"><span className="text-zinc-500 text-base">✉</span> {user.email}</span>
              {user.phone && (
                <>
                  <span className="hidden sm:inline text-zinc-700">•</span>
                  <span className="flex items-center gap-2"><span className="text-zinc-500 text-base">📞</span> {user.phone}</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 mt-6 w-full">
              <button
                type="button"
                onClick={onClickLinkedIn}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#09090b] text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
                aria-label="LinkedIn"
                title={user.linkedInUrl ?? ""}
              >
                <FaLinkedin className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClickGitHub}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#09090b] text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
                aria-label="GitHub"
                title={user.githubUrl ?? ""}
              >
                <FaGithub className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClickWebsite}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#09090b] text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
                aria-label="Website"
                title={user.websiteUrl ?? ""}
              >
                <Globe className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {!readonly && (
          <div className="w-full lg:w-auto flex justify-center lg:justify-start pt-1 shrink-0">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-200 px-5 py-2.5 text-sm font-medium hover:bg-zinc-700 hover:text-white transition-colors shadow-sm"
              aria-label="Edit profile"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
