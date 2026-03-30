import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, User } from "lucide-react";

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";

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
      storedBooking.topic
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
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
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
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
              >
                Back to booking
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { slot, date, topic } = storedBooking;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");

  const {
    isBooking,
    clientSecret,
    setClientSecret,
    bookWithWallet,
    bookWithStripe,
  } = useBookSession();

  const handleBook = async (): Promise<void> => {
    try {
      if (!mentorId) {
        toast.error("Mentor is unavailable");
        return;
      }

      if (paymentMethod === "WALLET") {
        await bookWithWallet({
          mentorId,
          date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          topic,
        });

        sessionStorage.removeItem(PAYMENT_BOOKING_STORAGE_KEY);
        toast.success("Session booked successfully!");
        navigate("/my-sessions");
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
      });
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Booking
          </button>

          {isMentorLoading && !mentorSummary ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
              <div className="flex flex-col items-center gap-4 text-zinc-400">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                <p className="text-sm">Loading mentor details...</p>
              </div>
            </div>
          ) : !mentorSummary || isNotFound ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
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
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
                >
                  Browse mentors
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
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
        </div>
      </main>

      <Footer />

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "night" },
          }}
        >
          <StripePaymentModal
            onClose={() => setClientSecret(null)}
            onPaid={() => {
              setClientSecret(null);
              sessionStorage.removeItem(PAYMENT_BOOKING_STORAGE_KEY);
              toast.success("Payment successful!");
              navigate("/my-sessions");
            }}
          />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
