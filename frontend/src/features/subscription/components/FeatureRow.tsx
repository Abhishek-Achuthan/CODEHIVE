import { Check } from "lucide-react";

interface FeatureRowProps {
  label: string;
  accent?: boolean;
}

export const FeatureRow = ({ label, accent }: FeatureRowProps) => (
  <li className="flex items-start gap-2.5 text-sm leading-snug text-zinc-300">
    <Check
      className={`mt-0.5 h-4 w-4 shrink-0 ${accent ? "text-indigo-400" : "text-zinc-500"}`}
      strokeWidth={2.5}
    />
    <span>{label}</span>
  </li>
);
