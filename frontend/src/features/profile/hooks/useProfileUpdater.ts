import { UserService } from "../../../services/userService";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/storeHooks";
import type { UpdateMyProfileRequest } from "../../../shared/types/api/user";
import { setCurrentUser } from "../../../store/slices/authSlice";

export function useProfileUpdater() {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector(s  => s.auth.user);

    const updateProfile = async (payload:UpdateMyProfileRequest) => {
        if(!authUser) throw new Error('Not authenticated');

        const updated = await UserService.updateMyProfile(payload);
        dispatch(setCurrentUser({...authUser,...updated}));
    };

    return {updateProfile}
}