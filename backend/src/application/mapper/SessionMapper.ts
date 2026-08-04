import { SessionEntity } from '../../domain/session/SessionEntity';
import {
  IBookedSessionResponseDTO,
  IBookingReservationResponseDTO,
  IMentorProfileResponseDTO,
  ISessionResponseDTO,
  IUserSummaryDTO,
} from '../dto/SessionDTO';
import { EssentialUserInfo } from '../../domain/types/EssentialUserInfo';
import { UserEntity } from '../../domain/entities/UserEntity';
import { BookingReservationEntity } from '../../domain/entities/BookingReservationEntity';
import { SessionStatus } from '../../domain/types/SessionStatus';
import { SessionPaymentStatus } from '../../domain/types/SessionPaymentStatus';
import { PaymentSource } from '../../domain/types/PaymentSource';
import { SessionType } from '../../domain/types/SessionType';

export class SessionMapper {
  static toResponse(session: SessionEntity): ISessionResponseDTO {
    return {
      id: session.id,
      mentorId: session.mentorId,
      userId: session.userId,
      date: session.date,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      status: session.status,      
      topic: session.topic,
      amount: session.amount,
      paymentSource:session.paymentSource,
      paymentStatus:session.paymentStatus,
      sessionType: session.sessionType,
      maxGuests: session.maxGuests,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }

  private static toUserSummary(u: EssentialUserInfo): IUserSummaryDTO {
    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
    };
  }

  static toBookedResponse(
    session: SessionEntity,
    mentor: EssentialUserInfo,
    user: EssentialUserInfo
  ): IBookedSessionResponseDTO {
    return {
      id: session.id,
      mentorId: session.mentorId,
      userId: session.userId,
      mentor: this.toUserSummary(mentor),
      user: this.toUserSummary(user),
      date: session.date,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      status: session.status,
      topic: session.topic,
      amount: session.amount,
      paymentSource:session.paymentSource,
      paymentStatus:session.paymentStatus,
      ...(session.roomId && { roomId: session.roomId }),
      ...(session.joinUrl !== undefined && { joinUrl: session.joinUrl }),
      sessionType: session.sessionType,
      maxGuests: session.maxGuests,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }

  static toMentorProfile(
    mentor : UserEntity
  ): IMentorProfileResponseDTO {
    return {
        id: mentor.id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email : mentor.email,
        phone : mentor.phone,
        about : mentor.about,
        skills: mentor.skills,
        experience: mentor.experience,
        avatarUrl: mentor.avatarUrl,
        githubUrl:  mentor.githubUrl,
        linkedInUrl: mentor.linkedInUrl,
        websiteUrl: mentor.websiteUrl,
        primaryExpertise: mentor.primaryExpertise,
        experienceLevel: mentor.experienceLevel,
    }
  }

  static toResponseArray(
    sessions: SessionEntity[]
  ): ISessionResponseDTO[] {
    return sessions.map(this.toResponse);
  }

  static toBookingReservationResponse(
    reservation: BookingReservationEntity
  ): IBookingReservationResponseDTO {
    return {
      id: reservation.id,
      status: reservation.status,
      expiresAt: reservation.expiresAt.toISOString(),
      sessionId: reservation.sessionId,
      refundStatus: reservation.refundStatus,
    };
  }

  static toSessionLikeLock(
    reservation: BookingReservationEntity
  ): SessionEntity {
    return {
      id: reservation.id,
      mentorId: reservation.mentorId,
      userId: reservation.userId,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: SessionStatus.UPCOMING,
      topic: reservation.topic,
      paymentStatus: SessionPaymentStatus.PENDING,
      paymentSource: PaymentSource.STRIPE,
      paymentReferenceId: reservation.stripePaymentIntentId ?? null,
      amount: reservation.amount,
      sessionType: SessionType.ONE_TO_ONE,
      maxGuests: 0,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  }
}
