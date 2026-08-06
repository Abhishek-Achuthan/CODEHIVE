import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, User } from "lucide-react";

import StripePaymentModal from "../components/StripePaymentModal";
import SessionSummaryCard from "../components/SessionSummaryCard";
import PaymentCard from "../components/PaymentCard";
import { type PaymentMethod } from "../components/PaymentMethodSelector";

import { useBookSession } from "../hooks/useBookSession";
import { useMentorProfile } from "../../mentor/hooks/useMentorProfile";
import type {
  MentorSummary,
} from "../../../shared/types/api/mentor";
import type { PaymentPageState } from "../../../shared/types/api/session";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);
const PAYMENT_BOOKING_STORAGE_KEY = "session-booking-draft";

const PaymentPage: React.FC = () => {
  const { mentorId: routeMentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const storedBooking = useMemo<PaymentPageState | null>(() => {
    const rawValue = sessionStorage.getItem(PAYMENT_BOOKING_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as PaymentPageState;
    } catch {
      return null;
    }
  }, []);

  const mentorId = routeMentorId ?? storedBooking?.mentorId;
  const hasBookingContext = Boolean(
    mentorId &&
      storedBooking?.mentorId &&
      storedBooking.slot &&
      storedBooking.date &&
      storedBooking.topic &&
      storedBooking.clientRequestId
  );

  const {
    mentor: fetchedMentor,
    isLoading: isMentorLoading,
    error: mentorError,
    isNotFound,
  } = useMentorProfile(mentorId);

  const mentorSummary = useMemo<MentorSummary | null>(
    () => fetchedMentor
      ? {
          id: fetchedMentor.id,
          firstName: fetchedMentor.firstName,
          lastName: fetchedMentor.lastName,
          title: fetchedMentor.primaryExpertise,
          avatarUrl: fetchedMentor.avatarUrl,
          primaryExpertise: fetchedMentor.primaryExpertise,
        }
      : null,
    [fetchedMentor]
  );

  if (!hasBookingContext || !storedBooking) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-zinc-800 bg-[#121214] p-8 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400">
              <User className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Booking details missing</h1>
            <p className="text-sm text-zinc-400">
              Your payment details could not be restored. Please return to booking and select a slot again.
            </p>
            <button
              onClick={() => navigate(routeMentorId ? `/mentors/${routeMentorId}/book` : "/sessions/discover")}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Back to booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { slot, date, topic } = storedBooking;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");

  const {
    isBooking,
    clientSecret,
    reservationId,
    expiresAt,
    setClientSecret,
    setReservationId,
    setExpiresAt,
    bookWithWallet,
    bookWithStripe,
  } = useBookSession();

  const sessionDuration = useMemo(() => {
    try {
      const [startH, startM] = slot.startTime.split(':').map(Number);
      const [endH, endM] = slot.endTime.split(':').map(Number);
      const diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
      return `${diffMinutes} mins`;
    } catch {
      return '60 mins';
    }
  }, [slot.startTime, slot.endTime]);

  const handleBook = async (): Promise<void> => {
    try {
      if (!mentorId) {
        toast.error("Mentor is unavailable");
        return;
      }

      if (paymentMethod === "WALLET") {
        const session = await bookWithWallet({
          mentorId,
          date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          topic,
          clientRequestId: storedBooking.clientRequestId,
        });

        sessionStorage.removeItem(PAYMENT_BOOKING_STORAGE_KEY);
        toast.success("Session booked successfully!");
        
        navigate(`/mentors/${mentorId}/book/success`, {
          state: {
            sessionId: session.id,
            mentorName: `${mentorSummary?.firstName} ${mentorSummary?.lastName}`,
            mentorAvatar: mentorSummary?.avatarUrl,
            topic: topic,
            date: date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            duration: sessionDuration,
            category: mentorSummary?.primaryExpertise
          }
        });
        return;
      }

      if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
        toast.error("Stripe configuration error");
        return;
      }

      await bookWithStripe({
        mentorId,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        topic,
        clientRequestId: storedBooking.clientRequestId,
      });
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 text-zinc-100">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-zinc-400 hover:text-white mb-6 transition-colors group text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Booking
      </button>

      {isMentorLoading && !mentorSummary ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-zinc-800 bg-[#121214]">
          <div className="flex flex-col items-center gap-4 text-zinc-400">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-sm">Loading mentor details...</p>
          </div>
        </div>
      ) : !mentorSummary || isNotFound ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#121214] p-8 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400">
              <User className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Mentor not found</h1>
            <p className="text-sm text-zinc-400">
              {mentorError ?? "This mentor profile is unavailable."}
            </p>
            <button
              onClick={() => navigate("/sessions/discover")}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Browse mentors
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <SessionSummaryCard
            mentor={mentorSummary}
            slot={slot}
            date={date}
            topic={topic}
          />

          <div className="space-y-6">
            <PaymentCard
              price={slot.price}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              isBooking={isBooking}
              onBook={handleBook}
            />
          </div>
        </div>
      )}

      {clientSecret && reservationId && expiresAt && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "night" },
          }}
        >
          <StripePaymentModal
            reservationId={reservationId}
            expiresAt={expiresAt}
            onClose={() => {
              setClientSecret(null);
              setReservationId(null);
              setExpiresAt(null);
            }}
            onPaid={(sessionId) => {
              setClientSecret(null);
              setReservationId(null);
              setExpiresAt(null);
              sessionStorage.removeItem(PAYMENT_BOOKING_STORAGE_KEY);
              toast.success("Payment successful!");
              
              navigate(`/mentors/${mentorId}/book/success`, {
                state: {
                  sessionId: sessionId,
                  mentorName: `${mentorSummary?.firstName} ${mentorSummary?.lastName}`,
                  mentorAvatar: mentorSummary?.avatarUrl,
                  topic: topic,
                  date: date,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  duration: sessionDuration,
                  category: mentorSummary?.primaryExpertise
                }
              });
            }}
          />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
