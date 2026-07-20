import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

const API_URL = "/reservations";

/* ---------- Helper: normalize backend { success, message, data } wrapper ---------- */
const unwrap = (resData, key) => {
  // Handles apiResponse.success(res, { reservations }, ...) style payloads,
  // and falls back gracefully if the shape ever changes.
  if (resData?.data?.[key] !== undefined) return resData.data[key];
  if (resData?.[key] !== undefined) return resData[key];
  return resData;
};

/* ---------- Async Thunks ---------- */

export const getAllReservations = createAsyncThunk(
  "reservation/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}`);
      return unwrap(res.data, "reservations"); // -> array
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reservations"
      );
    }
  }
);

export const createReservation = createAsyncThunk(
  "reservation/create",
  async (reservationData, { rejectWithValue }) => {
    try {
      // reservationData must be shaped as:
      // { pharmacyId, items: [{ medicineId, quantity }], notes? }
      const res = await api.post(`${API_URL}`, reservationData);
      return unwrap(res.data, "reservation"); // -> single reservation object
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create reservation"
      );
    }
  }
);

export const updateReservationStatus = createAsyncThunk(
  "reservation/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`${API_URL}/${id}/status`, { status });
      return unwrap(res.data, "reservation");
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update reservation status"
      );
    }
  }
);

export const cancelReservation = createAsyncThunk(
  "reservation/cancel",
  async (id, { rejectWithValue }) => {
    try {
      // Backend route is PATCH /reservations/:id/cancel, not DELETE /reservations/:id
      const res = await api.patch(`${API_URL}/${id}/cancel`);
      const reservation = unwrap(res.data, "reservation");
      return reservation?._id || id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel reservation"
      );
    }
  }
);

/* ---------- Initial State ---------- */

const initialState = {
  reservations: [],
  loading: false,
  error: null,
};

/* ---------- Slice ---------- */

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    clearReservationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get all
      .addCase(getAllReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.reservations.unshift(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update status
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        const idx = state.reservations.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.reservations[idx] = action.payload;
      })
      .addCase(updateReservationStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      // cancel
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.reservations = state.reservations.filter((r) => r._id !== action.payload);
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearReservationError } = reservationSlice.actions;
export default reservationSlice.reducer;