import type { SavedListAPIResponse } from "../types/api/qna";
import type { SavedListView } from "../types/view/SavedListView";

/**
 * Maps a single SavedListAPIResponse (DTO) to SavedListView (View Model).
 * Strictly typed, pure function.
 */
export function mapSavedListToView(dto: SavedListAPIResponse): SavedListView {
  return {
    id: dto.id,
    name: dto.name,
  };
}

/**
 * Maps an array of SavedListAPIResponse (DTO) to SavedListView array (View Model).
 * Handles null/undefined/non-array inputs gracefully.
 */
export function mapSavedListArrayToView(
  dtos: SavedListAPIResponse[] | null | undefined
): SavedListView[] {
  if (!Array.isArray(dtos)) {
    return [];
  }
  return dtos.map(mapSavedListToView);
}
