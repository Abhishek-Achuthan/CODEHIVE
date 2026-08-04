import toast from "react-hot-toast";
import { UserService } from "../../../services/userService";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/storeHooks";
import type { UpdateMyProfileRequest } from "../../../shared/types/api/user";
import { BaseError } from "../../../shared/errors/BaseError";
import { setCurrentUser } from "../../../store/slices/authSlice";
import { APP_MESSAGES } from "../../../shared/constants/messages";

export function useProfileUpdater() {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector(s => s.auth.user);

    const updateProfile = async (payload: UpdateMyProfileRequest) => {
        if (!authUser) throw new Error(APP_MESSAGES.COMMON.NOT_AUTHENTICATED);

        const updated = await UserService.updateMyProfile(payload);
        dispatch(setCurrentUser({ ...authUser, ...updated }));
    };

    const applyForMentor = async () => {
        if (!authUser) throw new Error(APP_MESSAGES.COMMON.NOT_AUTHENTICATED);

        const updated = await UserService.applyForMentor();
        dispatch(setCurrentUser({ ...authUser, ...updated }));
    };

    const uploadAvatar = async (imageFile: File) => {
        try {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
            const maxBytes = 5 * 1024 * 1024;

            if (!allowedTypes.includes(imageFile.type)) {
                throw new BaseError(APP_MESSAGES.PROFILE.INVALID_IMAGE_TYPE);
            }
            if (imageFile.size > maxBytes) {
                throw new BaseError(APP_MESSAGES.PROFILE.IMAGE_TOO_LARGE);
            }

            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

            if (!uploadPreset) {
                throw new BaseError(
                    APP_MESSAGES.PROFILE.CLOUDINARY_NOT_CONFIGURED
                );
            }

            const endpoint = import.meta.env.VITE_CLOUDINARY_URL;
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
                        : APP_MESSAGES.PROFILE.IMAGE_UPLOAD_FAILED;

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
                throw new BaseError(APP_MESSAGES.PROFILE.SECURE_URL_MISSING);
            }

            await updateProfile({ avatarUrl: secureUrl });
            toast.success(APP_MESSAGES.PROFILE.AVATAR_UPDATED);
        } catch (error) {
            if (error instanceof BaseError) toast.error(error.message);
            else if (error instanceof Error) toast.error(error.message);
            else toast.error(APP_MESSAGES.PROFILE.AVATAR_UPDATE_FAILED);
            throw error;
        }
    };

    return { updateProfile, applyForMentor, uploadAvatar }
}
