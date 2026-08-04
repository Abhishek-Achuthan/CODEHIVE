import type { VideoConfigResponseDTO } from '../types';
import apiClient from '../../../api/apiClient';

export const getVideoConfig = async (roomId: string): Promise<VideoConfigResponseDTO> => {
  const { data } = await apiClient.get<VideoConfigResponseDTO>(`/rooms/${roomId}/video-config`);
  return data;
};
