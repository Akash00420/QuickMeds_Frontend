import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/reservation";

/* ---------- Async Thunks ---------- */

export const getAllReservations = createAsyncThunk(
  "reservation/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}`);
      return res.data; // expected: array of { _id, medicineName, userName, status, quantity, ... }
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
      const res = await axios.post(`${API_URL}`, reservationData);
      return res.data;
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
      const res = await axios.patch(`${API_URL}/${id}/status`, { status });
      return res.data;
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
      await axios.delete(`${API_URL}/${id}`);
      return id;
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
        state.reservations = action.payload;
      })
      .addCase(getAllReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
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