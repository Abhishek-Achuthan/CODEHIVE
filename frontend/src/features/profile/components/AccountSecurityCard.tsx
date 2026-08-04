import { KeyRound, ShieldCheck } from "lucide-react";

import SectionCard from "./SectionCard";

export interface AccountSecurityCardProps {
  onChangePassword: () => void;
  hasPassword: boolean;
}

export default function AccountSecurityCard({
  onChangePassword,
  hasPassword,
}: AccountSecurityCardProps) {
  return (
    <SectionCard title="Account Security">
      <div className="grid gap-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 shrink-0">
             <ShieldCheck className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="space-y-1 pt-0.5">
            <p className="text-[13px] font-medium text-zinc-200">Password & Authentication</p>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              Update your password regularly to keep your account secure from unauthorized access.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangePassword}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-[#09090b] px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800/50 hover:text-zinc-100 transition-colors shadow-sm"
        >
          <KeyRound className="h-4 w-4" />
          {hasPassword ? "Change Password" : "Set Password"}
        </button>
      </div>
    </SectionCard>
  );
}
