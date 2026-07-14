import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Camera, X } from "lucide-react";
import toast from "react-hot-toast";
import { APP_MESSAGES } from "../../../shared/constants/messages";

export type AvatarCropMode = "view" | "cropping";

export interface ProfileAvatarCropperProps {
  onSave: (img: File) => Promise<void>;
  url?: string;
  readonly?: boolean;
}

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=18181b&color=71717a";

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
      <div className="relative group w-[104px] h-[104px] sm:w-[120px] sm:h-[120px] rounded-full border-[3px] border-[#121214] bg-[#121214] shadow-xl ring-1 ring-zinc-800/50">
        <img
          src={url || DEFAULT_AVATAR}
          alt="Profile avatar"
          className="w-full h-full rounded-full object-cover transition-opacity group-hover:opacity-80"
        />

        {!readonly && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 shadow-sm transition-all hover:scale-105 hover:bg-zinc-800 hover:text-white"
            disabled={saving}
          >
            <Camera className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-[90vw] max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-[#121214] shadow-2xl">
            <div className="px-5 py-4 border-b border-zinc-800 bg-[#09090b]/50 flex justify-between items-center">
               <h3 className="text-[15px] font-semibold text-zinc-100 tracking-tight">Adjust Image</h3>
               <button
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors"
                  onClick={reset}
                  disabled={saving}
               >
                  <X className="w-4 h-4" />
               </button>
            </div>

            <div className="relative h-[300px] w-full bg-[#09090b]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                classes={{ containerClassName: 'bg-[#09090b]' }}
              />
            </div>

            <div className="px-5 py-4 border-t border-zinc-800 bg-[#09090b]/50 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                onClick={reset}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
