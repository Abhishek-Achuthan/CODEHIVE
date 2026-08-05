import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import type {
  AvailableSlotResponse,
  MentorBookingFallback,
  MentorProfileResponse,
} from "../../../shared/types/api/mentor";
import type { BookingPageLocationState } from "../../../shared/types/api/session";

import {
  Loader2,
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  User,
  Users,
  MessageSquare,
  Sparkles,
  Layers,
} from "lucide-react";

import { Calendar } from "../../../shared/components/Calendar";
import type { DaySlotInfo } from "../../../shared/components/Calendar";
import { useFetchSlots } from "../../mentor/hooks/useFetchSlots";
import { useMentorProfile } from "../../mentor/hooks/useMentorProfile";
import { MentorshipService } from "../../../services/mentorService";

const PAYMENT_BOOKING_STORAGE_KEY = "session-booking-draft";

const createClientRequestId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

type BookingMentor = MentorProfileResponse | MentorBookingFallback;
type SlotTypeFilter = "ALL" | "ONE_TO_ONE" | "PRIVATE_SESSION";

const BookingPage: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as BookingPageLocationState | null;
  const fallbackMentor = locationState?.mentor;
  const {
    mentor: fetchedMentor,
    isLoading: isMentorLoading,
    error: mentorError,
    isNotFound,
  } = useMentorProfile(mentorId);
  const mentor: BookingMentor | null = fetchedMentor ?? fallbackMentor ?? null;
  const isMentorValid = Boolean(fetchedMentor) && !isNotFound;
  const mentorSubtitle =
    (mentor && "title" in mentor && typeof mentor.title === "string"
      ? mentor.title
      : mentor?.primaryExpertise) ?? "Expert Mentor";

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotResponse | null>(null);
  const [slotTypeFilter, setSlotTypeFilter] = useState<SlotTypeFilter>("ALL");
  const [topic, setTopic] = useState("");
  const [dateSlotsMap, setDateSlotsMap] = useState<Record<string, AvailableSlotResponse[]>>({});

  const {
    slots,
    isLoading,
    error: slotsError,
    retry: retrySlots,
  } = useFetchSlots(mentorId, selectedDate, isMentorValid);

  useEffect(() => {
    setSelectedSlot(null);
  }, [slots]);

  // Update slots map when current selected date slots load
  useEffect(() => {
    if (selectedDate && slots) {
      const offset = selectedDate.getTimezoneOffset();
      const dateObj = new Date(selectedDate.getTime() - offset * 60 * 1000);
      const dateStr = dateObj.toISOString().split("T")[0];
      setDateSlotsMap((prev) => ({
        ...prev,
        [dateStr]: slots,
      }));
    }
  }, [selectedDate, slots]);

  const fetchRangeAvailability = useCallback(
    async (startDate: Date, daysCount: number) => {
      if (!isMentorValid || !mentorId) return;

      const datesToFetch: string[] = [];
      for (let i = 0; i < daysCount; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const offset = d.getTimezoneOffset();
        const dateObj = new Date(d.getTime() - offset * 60 * 1000);
        const dateStr = dateObj.toISOString().split("T")[0];
        datesToFetch.push(dateStr);
      }

      const chunkSize = 15;
      for (let i = 0; i < datesToFetch.length; i += chunkSize) {
        const chunk = datesToFetch.slice(i, i + chunkSize);
        const batchResults: Record<string, AvailableSlotResponse[]> = {};

        await Promise.all(
          chunk.map(async (dateStr) => {
            try {
              const res = await MentorshipService.getAvailability(mentorId, dateStr);
              batchResults[dateStr] = res;
            } catch {
              // Ignore error in prefetch
            }
          })
        );

        setDateSlotsMap((prev) => ({
          ...batchResults,
          ...prev,
        }));
      }
    },
    [isMentorValid, mentorId]
  );

  // Background pre-fetch for full 90-day window (current month + next 2 months)
  useEffect(() => {
    if (!isMentorValid || !mentorId) return;

    let isMounted = true;
    const runPrefetch = async () => {
      const today = new Date();
      await fetchRangeAvailability(today, 90);
    };

    if (isMounted) {
      void runPrefetch();
    }

    return () => {
      isMounted = false;
    };
  }, [mentorId, isMentorValid, fetchRangeAvailability]);

  const handleMonthChange = useCallback(
    (newMonth: Date) => {
      void fetchRangeAvailability(newMonth, 31);
    },
    [fetchRangeAvailability]
  );

  const getDateSlotInfo = useCallback(
    (date: Date): DaySlotInfo | null => {
      const offset = date.getTimezoneOffset();
      const dateObj = new Date(date.getTime() - offset * 60 * 1000);
      const dateStr = dateObj.toISOString().split("T")[0];

      const dateSlots = dateSlotsMap[dateStr];
      if (!dateSlots) return null;

      const hasOneToOne = dateSlots.some((s) => s.sessionType === "ONE_TO_ONE" || s.maxGuests === 1);
      const hasGroup = dateSlots.some((s) => s.sessionType === "PRIVATE_SESSION" || s.maxGuests > 1);
      const hasSlots = dateSlots.length > 0;

      return { hasSlots, hasOneToOne, hasGroup };
    },
    [dateSlotsMap]
  );

  const filteredSlots = useMemo(() => {
    if (slotTypeFilter === "ONE_TO_ONE") {
      return slots.filter((s) => s.sessionType === "ONE_TO_ONE" || s.maxGuests === 1);
    }
    if (slotTypeFilter === "PRIVATE_SESSION") {
      return slots.filter((s) => s.sessionType === "PRIVATE_SESSION" || s.maxGuests > 1);
    }
    return slots;
  }, [slots, slotTypeFilter]);

  const handleProceedToPayment = (): void => {
    if (!selectedSlot || !topic.trim() || !mentorId || !selectedDate || !mentor) {
      return;
    }

    const offset = selectedDate.getTimezoneOffset();
    const date = new Date(selectedDate.getTime() - offset * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    sessionStorage.setItem(
      PAYMENT_BOOKING_STORAGE_KEY,
      JSON.stringify({
        mentorId,
        slot: selectedSlot,
        date: dateStr,
        topic,
        clientRequestId: createClientRequestId(),
      })
    );

    navigate(`/mentors/${mentorId}/book/payment`);
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-zinc-100">
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {isMentorLoading && !mentor ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-zinc-800 bg-[#121214]">
            <div className="flex flex-col items-center gap-4 text-zinc-400">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              <p className="text-sm">Loading mentor profile...</p>
            </div>
          </div>
        ) : null}

        {!isMentorLoading && (isNotFound || (!mentor && mentorError)) ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#121214] p-8 text-center">
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400">
                <User className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                {isNotFound ? "Mentor not found" : "Unable to load mentor"}
              </h1>
              <p className="text-sm text-zinc-400">
                {isNotFound
                  ? "This mentor profile is unavailable or the link is invalid."
                  : mentorError ?? "Something went wrong while loading this mentor profile."}
              </p>
              <button
                onClick={() => navigate("/sessions/discover")}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Browse mentors
              </button>
            </div>
          </div>
        ) : null}

        {!mentor || (isNotFound && !isMentorLoading) ? null : (
          /* Main 2-Column Desktop Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* COLUMN 1 (Left 7 Cols): Header Banner, Select Session Type, Select Date & Available Slots */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              {/* 1. Header Banner */}
              <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                  {mentor?.avatarUrl ? (
                    <img
                      src={mentor.avatarUrl}
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-indigo-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-1">
                    Book a session with {mentor?.firstName} {mentor?.lastName}
                  </h1>
                  <p className="text-indigo-400 text-sm font-medium">
                    {mentorSubtitle}
                  </p>
                </div>
              </div>

              {/* 2. Select Session Type Selection Mode */}
              <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Select Session Type
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Select a format to highlight available dates on the calendar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* All Slots Option */}
                  <button
                    type="button"
                    onClick={() => setSlotTypeFilter("ALL")}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      slotTypeFilter === "ALL"
                        ? "bg-indigo-600/10 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500/30"
                        : "bg-[#18181b] border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${slotTypeFilter === "ALL" ? "bg-indigo-500/20 text-indigo-300" : "bg-zinc-800 text-zinc-400"}`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                        All Slots
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-100">All Available Slots</div>
                      <div className="text-xs text-zinc-400 mt-0.5">View all available mentor dates & slots</div>
                    </div>
                  </button>

                  {/* 1-on-1 Option */}
                  <button
                    type="button"
                    onClick={() => setSlotTypeFilter("ONE_TO_ONE")}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      slotTypeFilter === "ONE_TO_ONE"
                        ? "bg-blue-600/10 border-blue-500 text-white shadow-xs ring-1 ring-blue-500/30"
                        : "bg-[#18181b] border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${slotTypeFilter === "ONE_TO_ONE" ? "bg-blue-500/20 text-blue-300" : "bg-zinc-800 text-zinc-400"}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        1-on-1 Only
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-100">1-on-1 Mentorship</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Highlights dates with private 1-on-1 slots</div>
                    </div>
                  </button>

                  {/* Group Session Option */}
                  <button
                    type="button"
                    onClick={() => setSlotTypeFilter("PRIVATE_SESSION")}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      slotTypeFilter === "PRIVATE_SESSION"
                        ? "bg-purple-600/10 border-purple-500 text-white shadow-xs ring-1 ring-purple-500/30"
                        : "bg-[#18181b] border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${slotTypeFilter === "PRIVATE_SESSION" ? "bg-purple-500/20 text-purple-300" : "bg-zinc-800 text-zinc-400"}`}>
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Group Only
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-100">Group Sessions</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Highlights dates with group session slots</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Select Date & Available Slots Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
                {/* Select Date Card */}
                <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-indigo-400" />
                      Select Date
                    </h2>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <span className={`w-2 h-2 rounded-full ${
                        slotTypeFilter === "PRIVATE_SESSION"
                          ? "bg-purple-400"
                          : slotTypeFilter === "ONE_TO_ONE"
                          ? "bg-blue-400"
                          : "bg-indigo-400"
                      }`} />
                      Available dates
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Calendar
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      getDateSlotInfo={getDateSlotInfo}
                      activeFilter={slotTypeFilter}
                      onMonthChange={handleMonthChange}
                    />
                  </div>
                </div>

                {/* Available Slots Card */}
                <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        Available Slots
                        {selectedDate && (
                          <span className="text-xs font-normal text-zinc-400 ml-1">
                            ({selectedDate.toLocaleDateString()})
                          </span>
                        )}
                      </h3>

                      {slotTypeFilter !== "ALL" && (
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${
                          slotTypeFilter === "PRIVATE_SESSION"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                          {slotTypeFilter === "PRIVATE_SESSION" ? "Group" : "1-on-1"}
                        </span>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                      </div>
                    ) : slotsError ? (
                      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-zinc-400 border border-dashed border-zinc-800 rounded-xl">
                        <p className="text-sm">{slotsError}</p>
                        <button
                          type="button"
                          onClick={retrySlots}
                          className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="text-center py-16 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
                        {selectedDate
                          ? "No slots available for this date."
                          : "Select a date to view slots."}
                      </div>
                    ) : filteredSlots.length === 0 ? (
                      <div className="text-center py-16 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
                        No {slotTypeFilter === "ONE_TO_ONE" ? "1-on-1" : "Group"} slots available for this date.
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          className="max-h-[300px] overflow-y-auto pr-1 slots-scroll-container"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          <style>
                            {`
                              .slots-scroll-container::-webkit-scrollbar {
                                display: none;
                              }
                            `}
                          </style>

                          <div className="grid grid-cols-2 gap-2.5">
                            {filteredSlots.map((slot, idx) => {
                              const isGroup = slot.sessionType === "PRIVATE_SESSION" || slot.maxGuests > 1;
                              const isSelected = selectedSlot === slot;

                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`
                                    relative p-3 rounded-xl text-sm font-medium transition-all duration-200 border text-left flex flex-col justify-between
                                    ${
                                      isSelected
                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30 scale-[1.02]"
                                        : "bg-[#18181b] border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700 hover:text-zinc-100"
                                    }
                                  `}
                                >
                                  <div className="flex items-center justify-between gap-1 mb-2">
                                    {isGroup ? (
                                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        isSelected ? "bg-white/20 text-white" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                      }`}>
                                        <Users className="w-3 h-3" /> Group ({slot.maxGuests})
                                      </span>
                                    ) : (
                                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        isSelected ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                      }`}>
                                        <User className="w-3 h-3" /> 1-on-1
                                      </span>
                                    )}
                                  </div>

                                  <div>
                                    <div className="text-sm font-semibold mb-0.5">
                                      {slot.startTime}
                                    </div>
                                    <div className="text-[11px] opacity-75">
                                      to {slot.endTime}
                                    </div>
                                  </div>

                                  <div className={`mt-2 text-xs font-bold ${isSelected ? "text-white" : "text-indigo-400"}`}>
                                    ₹{slot.price}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2 (Right 5 Cols): Full Vertical Height "What would you like to discuss?" Component */}
            <div className="lg:col-span-5 flex flex-col h-full">
              {selectedSlot ? (
                <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        What would you like to discuss?
                      </h3>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                        Please describe the topic, goals, or specific questions for {mentor?.firstName}.
                      </p>
                    </div>

                    {/* Detailed Summary Card */}
                    <div className="bg-[#18181b] p-4 rounded-xl border border-zinc-800/80 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          Session Type
                        </span>
                        {selectedSlot.sessionType === "ONE_TO_ONE" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                            <User className="w-3.5 h-3.5" /> 1-on-1 Private Session
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                            <Users className="w-3.5 h-3.5" /> Group Session (Up to {selectedSlot.maxGuests})
                          </span>
                        )}
                      </div>

                      <div className="h-px bg-zinc-800/80" />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                            Date & Time
                          </div>
                          <div className="text-zinc-200 text-xs font-medium mt-0.5">
                            {selectedDate?.toLocaleDateString()}
                          </div>
                          <div className="text-indigo-400 text-xs font-semibold mt-0.5">
                            {selectedSlot.startTime} - {selectedSlot.endTime}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                            Total Amount
                          </div>
                          <div className="text-white text-lg font-bold mt-0.5">
                            ₹{selectedSlot.price}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Discussion Topic Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-300">
                        Discussion Topic / Notes
                      </label>
                      <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="I want to discuss about..."
                        maxLength={100}
                        className="w-full h-40 bg-[#18181b] border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-500 p-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-colors"
                      />
                      <div className="flex justify-end">
                        <span className="text-[11px] text-zinc-500">
                          {topic.length}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <button
                      onClick={handleProceedToPayment}
                      disabled={!topic.trim()}
                      className={`
                        inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all w-full justify-center shadow-md
                        ${
                          topic.trim()
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60"
                        }
                      `}
                    >
                      Continue to Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#121214] border border-zinc-800 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center text-zinc-500 h-full min-h-[480px]">
                  <MessageSquare className="w-12 h-12 mb-4 text-zinc-600" />
                  <h4 className="text-base font-semibold text-zinc-300 mb-1">
                    No Slot Selected
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                    Select a date and click on an available time slot on the left to enter your topic and proceed to payment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
