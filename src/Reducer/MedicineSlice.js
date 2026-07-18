import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

const API_URL = "/medicines";

/* ---------- Async Thunks ---------- */

// Search medicines via GET /medicines/all?name=&category=
export const getAllMedicines = createAsyncThunk(
  "medicine/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/all`, { params });
      return res.data; // { success, message, data: { medicines } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch medicines"
      );
    }
  }
);

// Suggest medicines via GET /medicines/suggest?q=
export const suggestMedicines = createAsyncThunk(
  "medicine/suggest",
  async (q, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/suggest`, { params: { q } });
      return res.data; // { success, message, data: { suggestions } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get suggestions"
      );
    }
  }
);

export const getMedicineById = createAsyncThunk(
  "medicine/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data; // { success, message, data: { medicine } }
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
      return res.data; // { success, message, data: { medicine } }
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
      return res.data; // { success, message, data: { medicine } }
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
  suggestions: [],
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
        state.medicines = action.payload.data.medicines;
      })
      .addCase(getAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // suggest
      .addCase(suggestMedicines.fulfilled, (state, action) => {
        state.suggestions = action.payload.data.suggestions;
      })
      .addCase(suggestMedicines.rejected, (state, action) => {
        state.error = action.payload;
      })

      // get by id
      .addCase(getMedicineById.fulfilled, (state, action) => {
        state.selectedMedicine = action.payload.data.medicine;
      })
      .addCase(getMedicineById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // add
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.medicines.push(action.payload.data.medicine);
      })
      .addCase(addMedicine.rejected, (state, action) => {
        state.error = action.payload;
      })

      // update
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const updated = action.payload.data.medicine;
        const idx = state.medicines.findIndex((m) => m._id === updated._id);
        if (idx !== -1) state.medicines[idx] = updated;
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