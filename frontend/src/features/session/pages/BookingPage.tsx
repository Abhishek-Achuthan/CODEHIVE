import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import type {
  AvailableSlotResponse,
  MentorBookingFallback,
  MentorProfileResponse,
} from "../../../shared/types/api/mentor";
import type { BookingPageLocationState } from "../../../shared/types/api/session";

import { Loader2, ArrowLeft, Calendar as CalendarIcon, Clock, ArrowRight, User, MessageSquare } from "lucide-react";

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import { Calendar } from "../../../shared/components/Calendar";
import { useFetchSlots } from "../../mentor/hooks/useFetchSlots";
import { useMentorProfile } from "../../mentor/hooks/useMentorProfile";

const PAYMENT_BOOKING_STORAGE_KEY = "session-booking-draft";

const createClientRequestId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

type BookingMentor = MentorProfileResponse | MentorBookingFallback;

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
  const [topic, setTopic] = useState("");
  const [guestCount, setGuestCount] = useState(0);

  const {
    slots,
    isLoading,
    error: slotsError,
    retry: retrySlots,
  } = useFetchSlots(mentorId, selectedDate, isMentorValid);

  useEffect(() => {
    setSelectedSlot(null);
  }, [slots]);

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
        guestCount,
      })
    );

    navigate(`/mentors/${mentorId}/book/payment`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {isMentorLoading && !mentor ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
              <div className="flex flex-col items-center gap-4 text-zinc-400">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                <p className="text-sm">Loading mentor profile...</p>
              </div>
            </div>
          ) : null}

          {!isMentorLoading && (isNotFound || (!mentor && mentorError)) ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
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
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
                >
                  Browse mentors
                </button>
              </div>
            </div>
          ) : null}

          {!mentor || (isNotFound && !isMentorLoading) ? null : (
            <>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm flex items-start gap-6 shadow-lg shadow-black/20">
            <div className="h-16 w-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20 overflow-hidden">
              {mentor?.avatarUrl ? (
                <img
                  src={mentor.avatarUrl}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                Book a session with {mentor?.firstName} {mentor?.lastName}
              </h1>
              <p className="text-zinc-400 text-lg">
                {mentorSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
                Select Date
              </h2>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Available Slots
                {selectedDate && (
                  <span className="text-sm font-normal text-zinc-500 ml-2">
                    for {selectedDate.toLocaleDateString()}
                  </span>
                )}
              </h3>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
              ) : slotsError ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-zinc-400 border-2 border-dashed border-zinc-800 rounded-xl">
                  <p>{slotsError}</p>
                  <button
                    type="button"
                    onClick={retrySlots}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
                  >
                    Retry
                  </button>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                  {selectedDate
                    ? "No slots available for this date."
                    : "Select a date to view slots."}
                </div>
              ) : (
                <div className="relative">
                  <div
                    className="max-h-[400px] overflow-y-auto pr-2 slots-scroll-container"
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {slots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSlot(slot)}
                          className={`
                            relative p-4 rounded-xl text-sm font-medium transition-all duration-200 border text-left
                            ${
                              selectedSlot === slot
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750 hover:border-zinc-600 hover:text-white"
                            }
                          `}
                        >
                          <div className="text-base font-semibold mb-1">
                            {slot.startTime}
                          </div>
                          <div className="text-xs opacity-75">
                            to {slot.endTime}
                          </div>
                          <div className="absolute top-4 right-4 text-sm font-bold opacity-60">
                            ₹{slot.price}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {slots.length > 6 && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedSlot && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-in slide-in-from-bottom-8 duration-500 shadow-2xl shadow-indigo-500/10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                    What would you like to discuss?
                  </h3>

                  <p className="text-zinc-400 text-sm">
                    Please briefly describe the topic or questions you have for{" "}
                    {mentor?.firstName}.
                  </p>

                  <div>
                    <label
                      htmlFor="guest-count"
                      className="mb-1 block text-sm font-medium text-zinc-300"
                    >
                      Friends joining (optional)
                    </label>
                    <p className="mb-2 text-xs text-zinc-500">
                      How many friends will join via your session invite link (not including you).
                    </p>
                    <input
                      id="guest-count"
                      type="number"
                      min={0}
                      max={20}
                      value={guestCount}
                      onChange={(e) =>
                        setGuestCount(
                          Math.max(0, Math.min(20, Number(e.target.value) || 0)),
                        )
                      }
                      className="w-24 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                    <div>
                      <div className="text-xs text-zinc-500 uppercase font-bold">
                        Session
                      </div>
                      <div className="text-white font-medium">
                        {selectedDate?.toLocaleDateString()} •{" "}
                        {selectedSlot.startTime}
                      </div>
                    </div>

                    <div className="h-8 w-px bg-zinc-800"></div>

                    <div>
                      <div className="text-xs text-zinc-500 uppercase font-bold">
                        Price
                      </div>
                      <div className="text-white font-medium">
                        ₹{selectedSlot.price}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-end gap-4">
                  <div className="w-full">
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="I want to discuss about..."
                      maxLength={100}
                      className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-xl text-white p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-zinc-500">
                        {topic.length}/100
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={!topic.trim()}
                    className={`
                      flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all w-full md:w-auto justify-center
                      ${
                        topic.trim()
                          ? "bg-white text-black hover:bg-zinc-200"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }
                    `}
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
