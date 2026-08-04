import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { DataTable } from "../../../shared/ui/DataTable";
import { Pagination } from "../../../shared/ui/Pagination";
import { PageHeader } from "../../../shared/ui/PageHeader";
import { PlanFormModal } from "./PlanFormModal";
import { planColumns } from "../columns/planColumns";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useFetchPlans } from "../hooks/useFetchPlans";
import { useCreatePlan } from "../hooks/useCreatePlan";
import { useUpdatePlan } from "../hooks/useUpdatePlan";
import { useArchivePlan } from "../hooks/useArchivePlan";
import type { PlanView, CreatePlanPayload, UpdatePlanPayload } from "../../../shared/types/view/PlanView";

export const PlanManagementPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanView | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { plans, loading, totalPages, setPlans, refetch } = useFetchPlans(debouncedSearch, page);
  const { createPlan, loading: creating } = useCreatePlan();
  const { updatePlan, loading: updating } = useUpdatePlan();
  const { archivePlan } = useArchivePlan();

  const openCreate = () => {
    setSelectedPlan(null);
    setModalOpen(true);
  };

  const openEdit = (plan: PlanView) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedPlan(null);
  };

  const handleSubmit = async (payload: CreatePlanPayload | UpdatePlanPayload) => {
    if (selectedPlan) {
      const result = await updatePlan(selectedPlan.id, payload as UpdatePlanPayload);
      if (result.success) {
        handleClose();
        refetch();
      }
    } else {
      const result = await createPlan(payload as CreatePlanPayload);
      if (result.success) {
        handleClose();
        refetch();
      }
    }
  };

  const handleArchive = async (plan: PlanView) => {
    const result = await archivePlan(plan.id);
    if (result.success) {
      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, isActive: false } : p))
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        label="Admin"
        title="Plans"
        description="Create and manage subscription plans for your platform"
      >
        {/* Search */}
        <div className="group relative w-full sm:w-72">
          <div className="absolute inset-0 bg-indigo-500/5 blur-lg transition-colors group-focus-within:bg-indigo-500/10" />
          <input
            type="text"
            placeholder="Search plans..."
            className="relative w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm font-medium text-white transition-all placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-indigo-400" />
        </div>

        {/* Create button */}
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </PageHeader>

      <div className="grow">
        <DataTable
          columns={planColumns}
          data={plans}
          loading={loading}
          actions={(plan) => (
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => openEdit(plan)}
                className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/30 shadow-indigo-500/5 hover:shadow-indigo-500/10"
              >
                Edit
              </button>
              {plan.isActive && (
                <button
                  onClick={() => handleArchive(plan)}
                  className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 shadow-rose-500/5 hover:shadow-rose-500/10"
                >
                  Archive
                </button>
              )}
            </div>
          )}
        />
      </div>

      <div className="mt-6 h-10 flex items-center justify-center mb-7">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <PlanFormModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        plan={selectedPlan}
        submitting={creating || updating}
      />
    </div>
  );
};
