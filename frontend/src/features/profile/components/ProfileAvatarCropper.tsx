import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../../shared/constants/messages";

export type AvatarCropMode = "view" | "cropping";

export interface ProfileAvatarCropperProps {
  onSave: (img: File) => Promise<void>;
  url?: string;
  readonly?: boolean;
}

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=E5E7EB&color=374151";

export default function ProfileAvatarCropper({
  onSave,
  url,
  readonly = false,
}: ProfileAvatarCropperProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = useState<AvatarCropMode>("view");
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [saving, setSaving] = useState(false);

  const reset = () => {
    setMode("view");
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setSaving(false);
  };

  
  //file selection
  const handleSelectFile = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxBytes = 5 * 1024 * 1024;

    if (!allowed.includes(file.type)) {
      toast.error(APP_MESSAGES.PROFILE.INVALID_IMAGE_TYPE);
      return;
    }

    if (file.size > maxBytes) {
      toast.error(APP_MESSAGES.PROFILE.IMAGE_TOO_LARGE);
      return;
    }

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    const reader = new FileReader();
    reader.onerror = () => {
      toast.error(APP_MESSAGES.PROFILE.IMAGE_UPLOAD_FAILED);
    };
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setMode("cropping");
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSelectFile(file);
    e.target.value = "";
  };

  
  //crop helpers
  const onCropComplete = useCallback((_: Area, area: Area) => {
    setCroppedAreaPixels(area);
  }, []);

  const createCroppedImage = async (): Promise<File> => {
    if (!imageSrc || !croppedAreaPixels) {
      throw new Error(APP_MESSAGES.PROFILE.INVALID_CROP_STATE);
    }

    const image = new Image();
    image.src = imageSrc;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error(APP_MESSAGES.PROFILE.CANVAS_CONTEXT_MISSING);

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error(APP_MESSAGES.PROFILE.CROP_FAILED);
        resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.92);
    });
  };

  const handleSave = async () => {
    try {
      if (saving) return;
      setSaving(true);

      const file = await createCroppedImage();
      await onSave(file);

      reset();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error(APP_MESSAGES.PROFILE.AVATAR_UPDATE_FAILED);
      setSaving(false);
    }
  };


  return (
    <>
      {/* Avatar */}
      <div className="relative w-32 h-32">
        <img
          src={url || DEFAULT_AVATAR}
          alt="Profile avatar"
          className="w-full h-full rounded-full object-cover border"
        />

        {!readonly && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            disabled={saving}
          >
            <Pencil size={16} />
          </button>
        )}

        {!readonly && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onFileChange}
          />
        )}
      </div>

      {/*crop modal */}
      {mode === "cropping" && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-[90vw] max-w-md rounded-lg border border-gray-800 bg-black p-4 text-white">
            <button
              className="absolute right-3 top-3 text-gray-400"
              onClick={reset}
              disabled={saving}
            >
              <X size={18} />
            </button>

            <div className="relative h-64 w-full bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded px-4 py-2 text-sm text-gray-300"
                onClick={reset}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
