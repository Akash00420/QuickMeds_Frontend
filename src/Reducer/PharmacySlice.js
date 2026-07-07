import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Adjust this to match your actual backend base URL / axios instance
const API_URL = "/api/pharmacy";

/* ---------- Async Thunks ---------- */

export const getPharmacyStats = createAsyncThunk(
  "pharmacy/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      return res.data; // expected: { totalMedicines, lowStock, criticalStock, pendingReservations }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch pharmacy stats"
      );
    }
  }
);

export const getActivityFeed = createAsyncThunk(
  "pharmacy/getActivityFeed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/activity`);
      return res.data; // expected: array of { id, type, message, link, time }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch activity feed"
      );
    }
  }
);

export const getDemandTrends = createAsyncThunk(
  "pharmacy/getDemandTrends",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/demand-trends`);
      return res.data; // expected: array of { date, medicineName, demandCount } or similar time-series shape
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch demand trends"
      );
    }
  }
);

/* ---------- Initial State ---------- */

const initialState = {
  stats: {
    totalMedicines: 0,
    lowStock: 0,
    criticalStock: 0,
    pendingReservations: 0,
  },
  activityFeed: [],
  demandTrends: [],
  loading: false,
  error: null,
};

/* ---------- Slice ---------- */

const pharmacySlice = createSlice({
  name: "pharmacy",
  initialState,
  reducers: {
    clearPharmacyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // stats
      .addCase(getPharmacyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmacyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getPharmacyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // activity feed
      .addCase(getActivityFeed.pending, (state) => {
        state.error = null;
      })
      .addCase(getActivityFeed.fulfilled, (state, action) => {
        state.activityFeed = action.payload;
      })
      .addCase(getActivityFeed.rejected, (state, action) => {
        state.error = action.payload;
      })
      // demand trends
      .addCase(getDemandTrends.pending, (state) => {
        state.error = null;
      })
      .addCase(getDemandTrends.fulfilled, (state, action) => {
        state.demandTrends = action.payload;
      })
      .addCase(getDemandTrends.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearPharmacyError } = pharmacySlice.actions;
export default pharmacySlice.reducer;