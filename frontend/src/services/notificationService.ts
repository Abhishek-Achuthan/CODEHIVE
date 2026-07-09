import * as NotificationApi from '../api/endpoints/notificationApi';
import type { NotificationEntity } from '../shared/types/api/notifications';
import { BaseError } from '../shared/errors/BaseError';
import { APP_MESSAGES } from '../shared/constants/messages';
import { AxiosError } from 'axios';

interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}

export class NotificationService {
  static async getNotifications(page = 1, limit = 20): Promise<PaginatedResponse<NotificationEntity>> {
    try {
      const response = await NotificationApi.getNotifications(page, limit);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async markAsRead(id: string) {
    try {
      const response = await NotificationApi.markAsRead(id);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async markAllAsRead() {
    try {
      const response = await NotificationApi.markAllAsRead();
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private static handleError(error: unknown) {
    if (error instanceof AxiosError) {
      const msg = error.response?.data?.message || APP_MESSAGES.COMMON.SOMETHING_WENT_WRONG;
      const status = error.response?.status;
      throw new BaseError(msg, status);
    }
    if (error instanceof Error) {
      throw new BaseError(error.message);
    }
    throw new BaseError(APP_MESSAGES.COMMON.UNEXPECTED_ERROR);
  }
}
