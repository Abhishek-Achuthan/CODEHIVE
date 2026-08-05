import { VideoConfigResponseDTO } from "../../../dto/VideoConfigDTO";

export interface IGetVideoConfigUseCase {
  execute(roomId: string, userId: string): Promise<VideoConfigResponseDTO>;
}
