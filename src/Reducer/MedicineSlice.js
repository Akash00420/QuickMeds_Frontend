import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

const API_URL = "/medicines";

/* ---------- Async Thunks ---------- */

export const getAllMedicines = createAsyncThunk(
  "medicine/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}`);
      return res.data; // expected: array of { _id, name, stock, price, category, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch medicines"
      );
    }
  }
);

export const getMedicineById = createAsyncThunk(
  "medicine/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch medicine"
      );
    }
  }
);

export const addMedicine = createAsyncThunk(
  "medicine/add",
  async (medicineData, { rejectWithValue }) => {
    try {
      const res = await api.post(`${API_URL}`, medicineData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add medicine"
      );
    }
  }
);

export const updateMedicine = createAsyncThunk(
  "medicine/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, updates);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update medicine"
      );
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  "medicine/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete medicine"
      );
    }
  }
);

/* ---------- Initial State ---------- */

const initialState = {
  medicines: [],
  selectedMedicine: null,
  loading: false,
  error: null,
};

/* ---------- Slice ---------- */

const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {
    clearMedicineError: (state) => {
      state.error = null;
    },
    clearSelectedMedicine: (state) => {
      state.selectedMedicine = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get all
      .addCase(getAllMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(getAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get by id
      .addCase(getMedicineById.fulfilled, (state, action) => {
        state.selectedMedicine = action.payload;
      })
      .addCase(getMedicineById.rejected, (state, action) => {
        state.error = action.payload;
      })
      // add
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.medicines.push(action.payload);
      })
      .addCase(addMedicine.rejected, (state, action) => {
        state.error = action.payload;
      })
      // update
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const idx = state.medicines.findIndex((m) => m._id === action.payload._id);
        if (idx !== -1) state.medicines[idx] = action.payload;
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.error = action.payload;
      })
      // delete
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter((m) => m._id !== action.payload);
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMedicineError, clearSelectedMedicine } = medicineSlice.actions;
export default medicineSlice.reducer;