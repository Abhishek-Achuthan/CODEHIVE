import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, X, Plus } from "lucide-react";
import toast from "react-hot-toast";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

import SectionCard from "./SectionCard";
import ExperienceFormDialog from "./ExperienceFormDialog";

import type { ExperienceDraftItem, ExperienceType } from "../types";

const YEAR_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const getCurrentYearMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const isValidYearMonth = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return YEAR_MONTH_REGEX.test(trimmed);
};

export interface ExperienceSectionProps {
  initialItems: ExperienceDraftItem[];
  onSave?: (items: ExperienceDraftItem[]) => Promise<void>;
  readonly?: boolean;
}

const EMPTY_FORM: ExperienceDraftItem = {
  id: "",
  type: "job",
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
};

const typeLabel: Record<ExperienceType, string> = {
  job: "Job",
  freelance: "Freelance",
  open_source: "Open Source",
  teaching: "Teaching",
  self_learning: "Self Learning",
};

/* --------------------------- Component ---------------------------- */

export default function ExperienceSection({
  initialItems,
  onSave,
  readonly = false,
}: ExperienceSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<ExperienceDraftItem[]>(initialItems);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ExperienceDraftItem>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setItems(initialItems);
    }
  }, [initialItems, isEditing]);

  const openAdd = () => {
    const id =
      "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

    setForm({ ...EMPTY_FORM, id });
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const found = items.find((i) => i.id === id);
    if (!found) return;

    setForm({
      id: found.id,
      type: found.type,
      title: found.title,
      organization: found.organization ?? "",
      startDate: found.startDate ?? "",
      endDate: found.endDate ?? "",
      isCurrent: Boolean(found.isCurrent),
    });

    setDialogOpen(true);
  };

  const upsert = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!isValidYearMonth(form.startDate ?? "")) {
      toast.error("Invalid start date. Use YYYY-MM");
      return;
    }

    if (!form.isCurrent && !isValidYearMonth(form.endDate ?? "")) {
      toast.error("Invalid end date. Use YYYY-MM");
      return;
    }

    const start = (form.startDate ?? "").trim();
    const end = form.isCurrent ? "" : (form.endDate ?? "").trim();

    const currentYearMonth = getCurrentYearMonth();
    if (start && start > currentYearMonth) {
      toast.error("Start date cannot be in the future");
      return;
    }

    if (end && end > currentYearMonth) {
      toast.error("End date cannot be in the future");
      return;
    }

    if (start && end && end < start) {
      toast.error("End date cannot be before start date");
      return;
    }


    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === form.id);

      const next: ExperienceDraftItem = {
        ...form,
        title: form.title.trim(),
        organization: form.organization?.trim() || undefined,
        startDate: form.startDate?.trim() || undefined,
        endDate: form.isCurrent ? undefined : form.endDate?.trim() || undefined,
        isCurrent: Boolean(form.isCurrent),
      };

      if (index >= 0) {
        const copy = [...prev];
        copy[index] = next;
        return copy;
      }

      return [next, ...prev];
    });

    setDialogOpen(false);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const saveAll = async () => {
    try {
      if (saving) return;
      setSaving(true);

      const cleaned = items.filter((i) => i.title.trim().length > 0);
      await onSave?.(cleaned);

      toast.success("Experience updated");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update experience");
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------- Derived ---------------------------- */

  const viewItems = useMemo(() => {
    return items.map((it) => {
      const start = it.startDate ?? "";
      const end = it.isCurrent ? "Present" : it.endDate ?? "";
      const dateRange =
        start || end ? `${start}${start && end ? " - " : ""}${end}` : "";

      return { ...it, dateRange };
    });
  }, [items]);

  /* ---------------------------- Render ---------------------------- */

  return (
    <SectionCard
      title="Experience"
      rightAction={
        !readonly && (
          isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )
        )
      }
    >
      {viewItems.length === 0 ? (
        <div className="w-full rounded-xl border border-dashed border-zinc-800 bg-[#09090b]/50 px-6 py-8 text-center">
          <div className="text-sm font-medium text-zinc-400">
            No experience added yet
          </div>
          <div className="mt-2 text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Add roles, internships, freelance work, open-source contributions, or learning milestones.
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={openAdd}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </button>
          )}
        </div>
      ) : (
        <div className="-ml-4">
          <Timeline
            position="right"
            sx={{
              padding: 0,
              margin: 0,
              "& .MuiTimelineItem-root:before": { flex: 0, padding: 0 },
            }}
          >
            {viewItems.map((it, idx) => (
              <TimelineItem key={it.id}>
                <TimelineOppositeContent
                  sx={{ flex: 0.28, fontSize: 13, fontWeight: 500, color: "#a1a1aa", paddingTop: "12px" }}
                >
                  {it.dateRange}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot sx={{ bgcolor: "#27272a", borderColor: "#3f3f46", borderWidth: 2, boxShadow: 'none' }} variant="outlined" />
                  {idx < viewItems.length - 1 && <TimelineConnector sx={{ bgcolor: "#27272a" }} />}
                </TimelineSeparator>

                <TimelineContent sx={{ pb: 3 }}>
                  <div className="rounded-xl border border-zinc-800 bg-[#09090b] px-5 py-4 shadow-sm relative group">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-semibold tracking-wider uppercase text-indigo-400 mb-1">
                          {typeLabel[it.type]}
                        </div>
                        <div className="text-sm font-semibold text-zinc-100 tracking-tight">{it.title}</div>
                        <div className="text-[13px] text-zinc-400 mt-0.5">
                          {it.organization}
                        </div>
                      </div>

                      {isEditing && !readonly && (
                        <div className="flex items-start gap-1">
                          <button 
                            type="button" 
                            onClick={() => openEdit(it.id)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => remove(it.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      )}

      {isEditing && (
        <div className="mt-6 pt-5 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Experience
          </button>
          <button
            onClick={saveAll}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      )}

      <ExperienceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        value={form}
        onChange={setForm}
        onSave={upsert}
      />
    </SectionCard>
  );
}
