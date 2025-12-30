import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
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

export interface ExperienceSectionProps {
  initialItems: ExperienceDraftItem[];
  onSave: (items: ExperienceDraftItem[]) => Promise<void>;
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
  open_source: "Open source",
  teaching: "Teaching",
  self_learning: "Self learning",
};

/* --------------------------- Component ---------------------------- */

export default function ExperienceSection({
  initialItems,
  onSave,
}: ExperienceSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<ExperienceDraftItem[]>(initialItems);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ExperienceDraftItem>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  /* Reset drafts when exiting edit mode */
  useEffect(() => {
    if (!isEditing) {
      setItems(initialItems);
    }
  }, [initialItems, isEditing]);

  /* --------------------------- Handlers --------------------------- */

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
      await onSave(cleaned);

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
        isEditing ? (
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-md border border-gray-700 p-2 hover:bg-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-700 p-2 hover:bg-gray-900"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )
      }
    >
      {viewItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-700 bg-gray-950/30 px-4 py-4">
          <div className="text-sm font-semibold text-gray-200">
            No experience added yet
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Add roles, internships, freelance work, open-source, or learning milestones.
          </div>

          {isEditing ? (
            <button
              type="button"
              onClick={openAdd}
              className="mt-3 rounded-md border border-gray-600 px-4 py-2 text-xs text-white hover:bg-gray-900"
            >
              Add your first experience
            </button>
          ) : (
            <div className="mt-3 text-xs text-gray-400">
              Click the pencil to start adding.
            </div>
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
                  sx={{ flex: 0.28, fontSize: 12, color: "rgb(156,163,175)" }}
                >
                  {it.dateRange}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot variant="outlined" />
                  {idx < viewItems.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent>
                  <div className="rounded-lg border border-gray-700 bg-black px-3 py-2">
                    <div className="flex justify-between gap-4">
                      <div>
                        <div className="text-xs text-gray-400">
                          {typeLabel[it.type]}
                        </div>
                        <div className="text-sm font-semibold">{it.title}</div>
                        <div className="text-sm text-gray-300">
                          {it.organization}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openEdit(it.id)}>
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => remove(it.id)}>
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
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={openAdd}
            className="rounded-md border border-gray-600 px-4 py-2 text-xs"
          >
            Add
          </button>
          <button
            onClick={saveAll}
            className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold"
          >
            Save
          </button>
        </div>
      )}

      <ExperienceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        value={form}
        onChange={setForm}
        onCancel={() => setDialogOpen(false)}
        onSave={upsert}
      />
    </SectionCard>
  );
}
