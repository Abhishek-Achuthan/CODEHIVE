import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";
import {
  PLAN_DESCRIPTION_MAX_LENGTH,
  type PlanView,
  type CreatePlanPayload,
  type UpdatePlanPayload,
  type FeatureKey,
  type LimitKey,
} from "../../../shared/types/view/PlanView";

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL_FEATURES: { key: FeatureKey; label: string }[] = [
  { key: "chat", label: "Chat" },
  { key: "notes", label: "Notes" },
  { key: "polls", label: "Polls" },
  { key: "whiteboard", label: "Whiteboard" },
  { key: "screen_share", label: "Screen Share" },
  { key: "code_editor", label: "Code Editor" },
  { key: "video_audio", label: "Video & Audio" },
  { key: "private_rooms", label: "Private Rooms" },
  { key: "session_booking", label: "Session Booking" },
];

const ALL_LIMITS: { key: LimitKey; label: string; placeholder: string }[] = [
  { key: "max_participants", label: "Max Participants", placeholder: "e.g. 10" },
  { key: "max_active_rooms", label: "Max Active Rooms", placeholder: "e.g. 5" },
  { key: "max_session_hours", label: "Max Session Hours", placeholder: "e.g. 2" },
];

// ─── Validation Schema ────────────────────────────────────────────────────────

const planFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-_]+$/, "Only lowercase letters, numbers, hyphens, underscores"),
  description: z
    .string()
    .max(
      PLAN_DESCRIPTION_MAX_LENGTH,
      `Description must be ${PLAN_DESCRIPTION_MAX_LENGTH} characters or less`
    ),
  isPublic: z.boolean(),
  sortOrder: z.coerce.number().int().nonnegative("Must be 0 or greater"),
  features: z.array(z.string()).min(1, "Select at least one feature"),
  limits: z.object({
    max_participants: z.coerce.number().nonnegative().optional(),
    max_active_rooms: z.coerce.number().nonnegative().optional(),
    max_session_hours: z.coerce.number().nonnegative().optional(),
  }),
  pricing: z.object({
    monthly: z.coerce.number().nonnegative("Must be 0 or greater"),
    yearly: z.coerce.number().nonnegative("Must be 0 or greater"),
    currency: z.string().length(3, "Must be a 3-letter currency code (e.g. USD)"),
  }),
});

type PlanFormInput = z.input<typeof planFormSchema>;
type PlanFormValues = z.output<typeof planFormSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface PlanFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePlanPayload | UpdatePlanPayload) => Promise<void>;
  plan?: PlanView | null;
  submitting?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PlanFormModal: React.FC<PlanFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  plan,
  submitting = false,
}) => {
  const isEdit = !!plan;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PlanFormInput, unknown, PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isPublic: true,
      sortOrder: 0,
      features: [],
      limits: {},
      pricing: { monthly: 0, yearly: 0, currency: "USD" },
    },
  });

  // Auto-generate slug from name when creating
  const nameValue = watch("name");
  useEffect(() => {
    if (!isEdit && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "");
      setValue("slug", slug, { shouldValidate: false });
    }
  }, [nameValue, isEdit, setValue]);

  // Populate form when editing
  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        slug: plan.slug,
        description: plan.description ?? "",
        isPublic: plan.isPublic,
        sortOrder: plan.sortOrder,
        features: plan.features,
        limits: {
          max_participants: plan.limits.max_participants,
          max_active_rooms: plan.limits.max_active_rooms,
          max_session_hours: plan.limits.max_session_hours,
        },
        pricing: {
          monthly: plan.pricing.monthly,
          yearly: plan.pricing.yearly,
          currency: plan.pricing.currency,
        },
      });
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        isPublic: true,
        sortOrder: 0,
        features: [],
        limits: {},
        pricing: { monthly: 0, yearly: 0, currency: "USD" },
      });
    }
  }, [plan, reset, open]);

  const handleFormSubmit = async (values: PlanFormValues) => {
    const limits: Partial<Record<LimitKey, number>> = {};
    if (values.limits.max_participants !== undefined && values.limits.max_participants > 0)
      limits.max_participants = values.limits.max_participants;
    if (values.limits.max_active_rooms !== undefined && values.limits.max_active_rooms > 0)
      limits.max_active_rooms = values.limits.max_active_rooms;
    if (values.limits.max_session_hours !== undefined && values.limits.max_session_hours > 0)
      limits.max_session_hours = values.limits.max_session_hours;

    const payload: CreatePlanPayload | UpdatePlanPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      isPublic: values.isPublic,
      sortOrder: values.sortOrder,
      features: values.features as FeatureKey[],
      limits,
    };

    const pricingUnchanged =
      isEdit &&
      plan &&
      values.pricing.monthly === plan.pricing.monthly &&
      values.pricing.yearly === plan.pricing.yearly &&
      values.pricing.currency.toUpperCase().trim() === plan.pricing.currency.toUpperCase().trim();

    if (!isEdit || !pricingUnchanged) {
      payload.pricing = {
        monthly: values.pricing.monthly,
        yearly: values.pricing.yearly,
        currency: values.pricing.currency.toUpperCase(),
      };
    }

    await onSubmit(payload);
  };

  const selectedFeatures = watch("features");
  const descriptionValue = watch("description") ?? "";
  const descriptionLength = descriptionValue.length;
  const isDescriptionOverLimit = descriptionLength > PLAN_DESCRIPTION_MAX_LENGTH;

  const toggleFeature = (key: FeatureKey) => {
    const current = selectedFeatures ?? [];
    if (current.includes(key)) {
      setValue(
        "features",
        current.filter((f) => f !== key),
        { shouldValidate: true }
      );
    } else {
      setValue("features", [...current, key], { shouldValidate: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        closeButtonClassName="top-5 right-5 rounded-xl p-2 text-zinc-500 opacity-100 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
        className="!max-w-2xl w-[calc(100vw-2rem)] bg-zinc-900 border border-white/10 text-white rounded-2xl shadow-2xl p-0 overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 pr-14 border-b border-white/10 text-left">
          <DialogTitle className="text-xl font-bold text-white">
            {isEdit ? "Edit Plan" : "Create New Plan"}
          </DialogTitle>
          <p className="text-sm text-zinc-500 mt-1">
            {isEdit
              ? "Update the plan details below"
              : "Configure a new subscription plan for your platform"}
          </p>
        </DialogHeader>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="modal-scrollbar overflow-y-auto overflow-x-hidden max-h-[70vh] px-6 py-5 space-y-6 min-w-0"
        >
          {/* Basic Info */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400/80 mb-4">
              Basic Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Plan Name <span className="text-rose-400">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g. Pro Plan"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
                {errors.name && (
                  <p className="text-xs text-rose-400">{errors.name.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Slug <span className="text-rose-400">*</span>
                </label>
                <input
                  {...register("slug")}
                  placeholder="e.g. pro-plan"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono"
                />
                {errors.slug && (
                  <p className="text-xs text-rose-400">{errors.slug.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-zinc-400">
                    Description
                  </label>
                  <span
                    className={`text-xs tabular-nums ${
                      isDescriptionOverLimit
                        ? "text-rose-400 font-semibold"
                        : descriptionLength > PLAN_DESCRIPTION_MAX_LENGTH * 0.85
                        ? "text-amber-400"
                        : "text-zinc-500"
                    }`}
                    aria-live="polite"
                  >
                    {descriptionLength}/{PLAN_DESCRIPTION_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  {...register("description")}
                  rows={2}
                  maxLength={PLAN_DESCRIPTION_MAX_LENGTH}
                  placeholder="Short tagline shown on the pricing page (max 100 characters)"
                  className={`rounded-xl border bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.description || isDescriptionOverLimit
                      ? "border-rose-500/50 focus:ring-rose-500/30"
                      : "border-white/10 focus:ring-indigo-500/30"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-rose-400">{errors.description.message}</p>
                )}
                {!errors.description && isDescriptionOverLimit && (
                  <p className="text-xs text-rose-400">
                    Description exceeds the {PLAN_DESCRIPTION_MAX_LENGTH}-character limit.
                  </p>
                )}
                <p className="text-xs text-zinc-600">
                  Keep it brief — this appears as supporting text under the plan name on the
                  pricing page.
                </p>
              </div>

              {/* Sort Order */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Sort Order
                </label>
                <input
                  {...register("sortOrder")}
                  type="number"
                  min={0}
                  placeholder="0"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
                {errors.sortOrder && (
                  <p className="text-xs text-rose-400">{errors.sortOrder.message}</p>
                )}
              </div>

              {/* Visibility toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Visibility
                </label>
                <Controller
                  control={control}
                  name="isPublic"
                  render={({ field }) => (
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => field.onChange(true)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          field.value
                            ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                            : "bg-white/[0.03] text-zinc-500 border-white/10 hover:border-white/20"
                        }`}
                      >
                        Public
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange(false)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          !field.value
                            ? "bg-zinc-700/40 text-zinc-300 border-white/20"
                            : "bg-white/[0.03] text-zinc-500 border-white/10 hover:border-white/20"
                        }`}
                      >
                        Private
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400/80 mb-4">
              Pricing
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Monthly Price <span className="text-rose-400">*</span>
                </label>
                <input
                  {...register("pricing.monthly")}
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
                {errors.pricing?.monthly && (
                  <p className="text-xs text-rose-400">{errors.pricing.monthly.message}</p>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Yearly Price <span className="text-rose-400">*</span>
                </label>
                <input
                  {...register("pricing.yearly")}
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
                {errors.pricing?.yearly && (
                  <p className="text-xs text-rose-400">{errors.pricing.yearly.message}</p>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                <label className="text-xs font-semibold text-zinc-400">
                  Currency <span className="text-rose-400">*</span>
                </label>
                <input
                  {...register("pricing.currency")}
                  placeholder="USD"
                  maxLength={3}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all uppercase font-mono"
                />
                {errors.pricing?.currency && (
                  <p className="text-xs text-rose-400">{errors.pricing.currency.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400/80 mb-4">
              Features <span className="text-rose-400">*</span>
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ALL_FEATURES.map(({ key, label }) => {
                const isSelected = selectedFeatures?.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleFeature(key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      isSelected
                        ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 shadow-indigo-500/10 shadow-md"
                        : "bg-white/[0.02] text-zinc-500 border-white/8 hover:border-white/15 hover:text-zinc-300"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
            {errors.features && (
              <p className="text-xs text-rose-400 mt-2">{errors.features.message}</p>
            )}
          </section>

          {/* Limits */}
          <section className="min-w-0">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400/80 mb-1">
              Limits
            </h3>
            <p className="text-xs text-zinc-600 mb-4">
              Leave at 0 to apply no limit for that field.
            </p>
            <div className="space-y-3">
              {ALL_LIMITS.map(({ key, label, placeholder }) => (
                <div
                  key={key}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-200">{label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{placeholder}</p>
                  </div>
                  <div className="flex w-full items-center gap-2 sm:w-auto sm:min-w-[9.5rem]">
                    <button
                      type="button"
                      onClick={() => {
                        const fieldKey = `limits.${key}` as const;
                        const current = watch(fieldKey as keyof PlanFormValues) as number | undefined;
                        const val = typeof current === "number" ? current : 0;
                        if (val > 0) setValue(fieldKey as keyof PlanFormValues, val - 1 as never);
                      }}
                      className="h-9 w-9 shrink-0 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                      aria-label={`Decrease ${label}`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      {...register(`limits.${key}`)}
                      type="number"
                      min={0}
                      placeholder="0"
                      className="h-9 w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white text-center placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all sm:w-20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const fieldKey = `limits.${key}` as const;
                        const current = watch(fieldKey as keyof PlanFormValues) as number | undefined;
                        const val = typeof current === "number" ? current : 0;
                        setValue(fieldKey as keyof PlanFormValues, val + 1 as never);
                      }}
                      className="h-9 w-9 shrink-0 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                      aria-label={`Increase ${label}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer actions */}
          <div className="flex gap-3 pt-2 pb-1 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 bg-white/[0.02] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !isValid || isDescriptionOverLimit}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save Changes"
                : "Create Plan"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
