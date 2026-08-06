import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionService } from "../../services/subscriptionService";
import type { CurrentSubscription } from "../../shared/types/api/subscription";

interface SubscriptionState {
  subscription: CurrentSubscription | null;
  loading: boolean;
  fetched: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  fetched: false,
  error: null,
};

export const fetchMySubscription = createAsyncThunk(
  "subscription/fetchMySubscription",
  async (_, { rejectWithValue }) => {
    try {
      const data = await SubscriptionService.getMySubscription();
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch subscription");
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<CurrentSubscription | null>) => {
      state.subscription = action.payload;
      state.fetched = true;
      state.loading = false;
      state.error = null;
    },
    clearSubscription: (state) => {
      state.subscription = null;
      state.fetched = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.subscription = action.payload;
        state.error = null;
      })
      .addCase(fetchMySubscription.rejected, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.subscription = null;
        state.error = action.payload as string;
      });
  },
});

export default subscriptionSlice.reducer;
export const { setSubscription, clearSubscription } = subscriptionSlice.actions;
