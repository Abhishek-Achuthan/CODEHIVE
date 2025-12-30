import { KeyRound } from "lucide-react";

import SectionCard from "./SectionCard";

export interface AccountSecurityCardProps {
  onChangePassword: () => void;
}

export default function AccountSecurityCard({
  onChangePassword,
}: AccountSecurityCardProps) {
  return (
    <SectionCard title="Account / Security">
      <div className="grid gap-3 text-sm">
        <div className="text-gray-400">
          Update your password to keep your account secure.
        </div>

        <button
          type="button"
          onClick={onChangePassword}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-600 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-900"
        >
          <KeyRound className="h-4 w-4" />
          Change password
        </button>
      </div>
    </SectionCard>
  );
}
