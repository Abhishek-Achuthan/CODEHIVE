import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CurrentUserView } from "../../shared/types/view/CurrentUserView";

interface AuthState {
  user: CurrentUserView | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  role: string;
  error: string | null;
}

const loadAuthState = (): AuthState => {
  try {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    return {
      user: user ? JSON.parse(user) : null,
      accessToken: token ? token : null,
      isAuthenticated: !!token,
      role: "",
      loading: false,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      role: "",
      error: null,
    };
  }
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: CurrentUserView; accessToken: string }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.accessToken = action.payload.accessToken;

      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken", action.payload);
    },
  },
});

export default authSlice.reducer;
export const {
  loginStart,
  loginFailure,
  loginSuccess,
  logout,
  setAccessToken,
} = authSlice.actions;
