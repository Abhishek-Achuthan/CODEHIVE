import toast from "react-hot-toast";
import { UserService } from "../../../services/userService";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/storeHooks";
import type { UpdateMyProfileRequest } from "../../../shared/types/api/user";
import { BaseError } from "../../../shared/errors/BaseError";
import { setCurrentUser } from "../../../store/slices/authSlice";

export function useProfileUpdater() {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector(s => s.auth.user);

    const updateProfile = async (payload: UpdateMyProfileRequest) => {
        if (!authUser) throw new Error('Not authenticated');

        const updated = await UserService.updateMyProfile(payload);
        dispatch(setCurrentUser({ ...authUser, ...updated }));
    };

    const applyForMentor = async () => {
        if (!authUser) throw new Error('Not authenticated');

        const updated = await UserService.applyForMentor();
        dispatch(setCurrentUser({ ...authUser, ...updated }));
    };

    const uploadAvatar = async (imageFile: File) => {
        try {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
            const maxBytes = 5 * 1024 * 1024;

            if (!allowedTypes.includes(imageFile.type)) {
                throw new BaseError("Please select a JPG, PNG, or WEBP image");
            }
            if (imageFile.size > maxBytes) {
                throw new BaseError("Image must be 5MB or less");
            }

            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

            if (!cloudName || !uploadPreset) {
                throw new BaseError(
                    "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET"
                );
            }

            const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("upload_preset", uploadPreset);

            const folder = import.meta.env.VITE_CLOUDINARY_FOLDER as string | undefined;
            if (folder && folder.trim().length) {
                formData.append("folder", folder.trim());
            }

            const res = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            const json = (await res.json()) as unknown;
            if (!res.ok) {
                const message =
                    json &&
                        typeof json === "object" &&
                        json !== null &&
                        "error" in json &&
                        (json as { error?: unknown }).error &&
                        typeof (json as { error?: { message?: unknown } }).error?.message === "string"
                        ? ((json as { error: { message: string } }).error.message as string)
                        : "Failed to upload image";

                throw new BaseError(message);
            }

            const secureUrl =
                json &&
                    typeof json === "object" &&
                    json !== null &&
                    "secure_url" in json &&
                    typeof (json as { secure_url?: unknown }).secure_url === "string"
                    ? ((json as { secure_url: string }).secure_url as string)
                    : "";

            if (!secureUrl) {
                throw new BaseError("Cloudinary upload did not return a secure URL");
            }

            await updateProfile({ avatarUrl: secureUrl });
            toast.success("Avatar updated");
        } catch (error) {
            if (error instanceof BaseError) toast.error(error.message);
            else if (error instanceof Error) toast.error(error.message);
            else toast.error("Failed to update avatar");
            throw error;
        }
    };

    return { updateProfile, applyForMentor, uploadAvatar }
}