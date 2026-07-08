import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

const API_URL = "/emergency";

/* ---------- Async Thunks ---------- */

export const getAllEmergencyRequests = createAsyncThunk(
  "emergency/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}`);
      return res.data; // expected: array of { _id, medicineName, location, status, requestedBy, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch emergency requests"
      );
    }
  }
);

export const createEmergencyRequest = createAsyncThunk(
  "emergency/create",
  async (requestData, { rejectWithValue }) => {
    try {
      const res = await api.post(`${API_URL}`, requestData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create emergency request"
      );
    }
  }
);

export const updateEmergencyStatus = createAsyncThunk(
  "emergency/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`${API_URL}/${id}/status`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update emergency status"
      );
    }
  }
);

export const getNearbyEmergencyPharmacies = createAsyncThunk(
  "emergency/getNearbyPharmacies",
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/nearby`, { params: { lat, lng } });
      return res.data; // expected: array of pharmacies with distance/stock info
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch nearby pharmacies"
      );
    }
  }
);

/* ---------- Initial State ---------- */

const initialState = {
  requests: [],
  nearbyPharmacies: [],
  loading: false,
  error: null,
};

/* ---------- Slice ---------- */

const emergencySlice = createSlice({
  name: "emergency",
  initialState,
  reducers: {
    clearEmergencyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get all
      .addCase(getAllEmergencyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmergencyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getAllEmergencyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create
      .addCase(createEmergencyRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload);
      })
      .addCase(createEmergencyRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      // update status
      .addCase(updateEmergencyStatus.fulfilled, (state, action) => {
        const idx = state.requests.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.requests[idx] = action.payload;
      })
      .addCase(updateEmergencyStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      // nearby pharmacies
      .addCase(getNearbyEmergencyPharmacies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNearbyEmergencyPharmacies.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyPharmacies = action.payload;
      })
      .addCase(getNearbyEmergencyPharmacies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmergencyError } = emergencySlice.actions;
export default emergencySlice.reducer;