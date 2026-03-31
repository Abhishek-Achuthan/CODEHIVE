import { useState } from "react";
import { SessionService } from "../../../services/sessionService";
import { BaseError } from "../../../shared/errors/BaseError";

type BookSessionParams = {
  mentorId: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  clientRequestId: string;
};

export const useBookSession = () => {
  const [isBooking, setIsBooking] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const bookWithWallet = async (params: BookSessionParams) => {
    setIsBooking(true);
    try {
      await SessionService.bookSessionWithWallet(params);
    } catch (error) {
      throw error instanceof BaseError ? error : new Error("Unexpected error");
    } finally {
      setIsBooking(false);
    }
  };

  const bookWithStripe = async (params: BookSessionParams) => {
    setIsBooking(true);
    try {
      const result = await SessionService.bookSessionWithStripe(params);
      setClientSecret(result.clientSecret);
      setReservationId(result.reservation.id);
      setExpiresAt(result.expiresAt);
    } catch (error) {
      throw error instanceof BaseError ? error : new Error("Unexpected error");
    } finally {
      setIsBooking(false);
    }
  };

  return {
    isBooking,
    clientSecret,
    reservationId,
    expiresAt,
    setClientSecret,
    setReservationId,
    setExpiresAt,
    bookWithWallet,
    bookWithStripe,
  };
};
