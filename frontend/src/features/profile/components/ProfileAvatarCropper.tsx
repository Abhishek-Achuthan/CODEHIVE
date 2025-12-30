import Cropper, { type Area } from "react-easy-crop";
import { Pencil } from "lucide-react";

export type AvatarCropMode = "view" | "cropping";

export interface AvatarCropValues {
  crop: { x: number; y: number };
  zoom: number;
}

export interface ProfileAvatarCropperProps {
  mode: AvatarCropMode;
  avatarPreviewUrl: string;
  imageSrc: string | null;
  values: AvatarCropValues;
  disabled?: boolean;
  onSelectFile: (file: File) => void;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onCancelCrop: () => void;
  onConfirmCrop: () => void;
}

export default function ProfileAvatarCropper({
  mode,
  avatarPreviewUrl,
  imageSrc,
  values,
  disabled,
  onSelectFile,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancelCrop,
  onConfirmCrop,
}: ProfileAvatarCropperProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-16 rounded-full overflow-hidden border border-gray-700 bg-gray-900">
        <img
          src={avatarPreviewUrl}
          alt="Profile"
          className="h-full w-full object-cover"
          draggable={false}
        />

        <label className="absolute bottom-0.5 right-0.5 inline-flex size-6 items-center justify-center rounded-full border border-gray-700 bg-black text-gray-200 hover:bg-gray-900 cursor-pointer">
          <Pencil className="h-3.5 w-3.5" />
          <input
            type="file"
            accept="image/*"
            disabled={disabled}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onSelectFile(f);
            }}
          />
        </label>
      </div>

      {mode === "cropping" ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-900"
            onClick={onCancelCrop}
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            onClick={onConfirmCrop}
            disabled={disabled}
          >
            Save
          </button>
        </div>
      ) : null}

      {mode === "cropping" && imageSrc ? (
        <div className="ml-auto w-60">
          <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-700 bg-black">
            <Cropper
              image={imageSrc}
              crop={values.crop}
              zoom={values.zoom}
              aspect={1}
              cropShape="rect"
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-gray-400">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={values.zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-full"
              disabled={disabled}
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Preview updates only after you save.
          </p>
        </div>
      ) : null}
    </div>
  );
}
