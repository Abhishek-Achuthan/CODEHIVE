import { Pencil, Trash2, X } from "lucide-react";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

import type { ExperienceItem, ExperienceType } from "../types";
import SectionCard from "./SectionCard";
import type { SectionMode } from "./AboutSection";

export interface ExperienceSectionProps {
  mode: SectionMode;
  items: ExperienceItem[];
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

const typeLabel: Record<ExperienceType, string> = {
  job: "Job",
  freelance: "Freelance",
  open_source: "Open source",
  teaching: "Teaching",
  self_learning: "Self learning",
};

export default function ExperienceSection({
  mode,
  items,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditItem,
  onDeleteItem,
}: ExperienceSectionProps) {
  return (
    <SectionCard
      title="Experience"
      rightAction={
        mode === "view" ? (
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="Edit experience"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        )
      }
    >
      <div className="-ml-4">
        <Timeline
          position="right"
          sx={{
            padding: 0,
            margin: 0,
            "& .MuiTimelineItem-root:before": { flex: 0, padding: 0 },
            "& .MuiTimelineContent-root": { paddingTop: 0.5, paddingBottom: 0.5 },
          }}
        >
          {items.map((it, idx) => (
            <TimelineItem key={it.id}>
              <TimelineOppositeContent
                sx={{
                  flex: 0.28,
                  color: "rgba(156,163,175,1)",
                  fontSize: 12,
                  paddingTop: 1,
                }}
              >
                {it.dateRangeLabel}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot
                  variant="outlined"
                  sx={{ borderColor: "rgba(75,85,99,1)", bgcolor: "#000" }}
                />
                {idx < items.length - 1 ? (
                  <TimelineConnector sx={{ bgcolor: "rgba(31,41,55,1)" }} />
                ) : null}
              </TimelineSeparator>

              <TimelineContent sx={{ paddingRight: 0 }}>
                <div className="rounded-lg border border-gray-700 bg-black px-3 py-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] text-gray-400">
                        {typeLabel[it.type]}
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {it.title}
                      </div>
                      <div className="text-sm text-gray-300">{it.organization}</div>
                    </div>

                    {mode === "edit" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEditItem(it.id)}
                          className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
                          aria-label="Edit entry"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(it.id)}
                          className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>

      {mode === "edit" ? (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSaveEdit}
            className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      ) : null}
    </SectionCard>
  );
}
