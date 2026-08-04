import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FilterChip, FilterPopover } from "../../../shared/ui/filters";
import { useFetchSessions } from "../hooks/useFetchSessions";
import { SessionCard } from "../components/SessionCard";
import { CancelSessionDialog } from "../components/CancelSessionDialog";
import { ReviewModal } from "../components/ReviewModal";
import { StatusTabs, type StatusFilter } from "../components/StatusTabs";
import { Pagination } from "../../../shared/ui/Pagination";
import { useCancelSession } from "../hooks/useCancelSession";
import type { BookedSessionResponse } from "../../../shared/types/api/session";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../../shared/ui";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { addReview } from "../../../api/endpoints/sessionAPI";

const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;

function getTimeDiffMs(startTime: string): number {
  return new Date(startTime).getTime() - Date.now();
}

export default function MySessionsPage() {
  const [activeTab, setActiveTab] = useState<StatusFilter>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentSource, setPaymentSource] = useState<"" | "STRIPE" | "WALLET">(
    "",
  );
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] =
    useState<BookedSessionResponse | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundEligible, setIsRefundEligible] = useState(false);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const navigate = useNavigate();

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const itemsPerPage = 6;
  const { loading, sessions, totalPages, error, refetch } = useFetchSessions({
    role: "mentee",
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchQuery,
    filter: {
      status: activeTab,
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(paymentSource && { paymentSource }),
      ...(refundableOnly && { refundableNow: true }),
    },
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const { cancelSession, loading: cancelLoading } = useCancelSession();

  const tabOrder: StatusFilter[] = ["upcoming", "completed", "cancelled"];
  const [direction, setDirection] = useState(0);

  const handleTabChange = (tab: StatusFilter) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(tab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setPaymentSource("");
    setRefundableOnly(false);
    setCurrentPage(1);
  };

  const activeFilterCount = [
    dateFrom,
    dateTo,
    paymentSource,
    refundableOnly ? "refundable" : "",
  ].filter(Boolean).length;

  const openCancelModal = (session: BookedSessionResponse) => {
    if (cancelLoading || isCancelModalOpen) return;

    const timeDiff = getTimeDiffMs(session.startTime);

    if (timeDiff <= 0) {
      toast.error("This session has already started and cannot be cancelled");
      return;
    }

    setSelectedSession(session);
    setIsRefundEligible(timeDiff >= REFUND_WINDOW_MS);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    if (cancelLoading) return;
    setIsCancelModalOpen(false);
    setSelectedSession(null);
    setIsRefundEligible(false);
  };

  const handleConfirmCancel = async () => {
    if (!selectedSession || cancelLoading) return;

    try {
      await cancelSession(selectedSession.id, {
        successMessage: isRefundEligible
          ? "Session cancelled. Refund will be processed."
          : "Session cancelled. No refund applicable.",
      });
      closeCancelModal();
      await refetch();
    } catch {
      // Error already handled in hook
    }
  };

  const openReviewModal = (session: BookedSessionResponse) => {
    setSelectedSession(session);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedSession(null);
  };

  const handleConfirmReview = async (rating: number, reviewText: string) => {
    if (!selectedSession) return;
    
    setReviewSubmitting(true);
    try {
      await addReview(selectedSession.id, rating, reviewText);
      toast.success("Review submitted successfully");
      closeReviewModal();
      await refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative z-40 mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex-shrink-0 w-full xl:w-auto overflow-x-auto pb-1 xl:pb-0">
          <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        <div className="flex w-full flex-col sm:flex-row sm:items-center gap-4 xl:w-auto xl:justify-end">
          <div className="w-full flex-1 sm:max-w-[280px] border-2 rounded-full border-transparent">
            <Input
              className="border border-white/10 bg-zinc-900/50 rounded-xl shadow-sm hover:border-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-200"
              placeholder="Search your sessions..."
              leftIcon={
                <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />
              }
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterPopover
              trigger={(isOpen) => (
                <FilterChip
                  label="Date"
                  value={dateFrom || dateTo ? "Custom" : undefined}
                  isActive={isOpen || !!dateFrom || !!dateTo}
                  hasDropdown
                />
              )}
            >
              {(close) => (
                <div className="flex flex-col gap-3 p-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{ colorScheme: "dark" }}
                      className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{ colorScheme: "dark" }}
                      className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>
                  {(dateFrom || dateTo) && (
                    <button
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                        setCurrentPage(1);
                        close();
                      }}
                      className="mt-1 text-xs text-zinc-400 hover:text-white"
                    >
                      Clear Date
                    </button>
                  )}
                </div>
              )}
            </FilterPopover>

            <FilterPopover
              trigger={(isOpen) => (
                <FilterChip
                  label="Payment"
                  value={
                    paymentSource
                      ? paymentSource.charAt(0) +
                        paymentSource.slice(1).toLowerCase()
                      : undefined
                  }
                  isActive={isOpen || !!paymentSource}
                  hasDropdown
                />
              )}
            >
              {(close) => (
                <div className="flex flex-col min-w-[150px]">
                  {[
                    { value: "", label: "All sources" },
                    { value: "STRIPE", label: "Stripe" },
                    { value: "WALLET", label: "Wallet" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setPaymentSource(opt.value as any);
                        setCurrentPage(1);
                        close();
                      }}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                        paymentSource === opt.value
                          ? "bg-indigo-500/10 text-indigo-300"
                          : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </FilterPopover>

            <div
              onClick={() => {
                setRefundableOnly(!refundableOnly);
                setCurrentPage(1);
              }}
            >
              <FilterChip label="Refundable" isActive={refundableOnly} />
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="ml-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-[400px] justify-center items-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          </motion.div>
        ) : sessions.length === 0 ? (
          <motion.div
            key={`empty-${activeTab}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center justify-center pt-4 pb-24 text-center min-h-[50vh]"
          >
            <div className="w-[350px] h-[350px] mb-8 mt-[-60px]">
              <DotLottieReact
                src="https://lottie.host/41ce04a9-e41c-4bb1-8e5e-531480e89cd3/cvAd2WHvbB.json"
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
              No {activeTab} sessions
            </h3>

            <p className="text-zinc-400 max-w-sm mx-auto mb-10 text-base leading-relaxed">
              {activeTab === "upcoming"
                ? "Book your first mentorship session and start learning from experienced developers."
                : `You don't have any ${activeTab} sessions listed.`}
            </p>

            <Button
              variant="primary"
              onClick={() => navigate("/mentors")}
              className="h-12 px-10 font-semibold rounded-xl text-base"
            >
              Discover Sessions
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={`content-${activeTab}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onCancel={() => openCancelModal(session)}
                  onReview={() => openReviewModal(session)}
                  onJoinRoom={() => {
                    navigate(`/room/${session.roomId}`);
                  }}
                  isCancelling={cancelLoading}
                  cancelDisabled={getTimeDiffMs(session.startTime) <= 0}
                  cancelDisabledReason="This session has already started and cannot be cancelled"
                />
              ))}
            </div>

            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CancelSessionDialog
        open={isCancelModalOpen}
        description={
          isRefundEligible
            ? "Are you sure you want to cancel this session?"
            : "This session starts within the next 24 hours. If you cancel now, you will not receive a refund."
        }
        confirmLabel={isRefundEligible ? "Confirm" : "Confirm Cancel"}
        cancelLabel={isRefundEligible ? "Cancel" : "Go Back"}
        loading={cancelLoading}
        onConfirm={handleConfirmCancel}
        onClose={closeCancelModal}
      />

      <ReviewModal 
        open={isReviewModalOpen}
        onClose={closeReviewModal}
        onSubmit={handleConfirmReview}
        loading={reviewSubmitting}
      />
    </div>
  );
}
