import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL;
// HistorySlice.js
// const API_BASE = "http://localhost:8000"; 

// Fetch list of past campaigns (summary only)
export const fetchHistory = createAsyncThunk(
  "history/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/api/history`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch a single campaign's full results by id
export const fetchCampaignById = createAsyncThunk(
  "history/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/api/history/${id}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [],          // list of CampaignSummary
    fetchStatus: "idle",
    fetchError: null,
    selectedId: null,
    selectedStatus: "idle",
    selectedError: null,
  },
  reducers: {
    clearSelected: (state) => {
      state.selectedId = null;
      state.selectedStatus = "idle";
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchHistory
      .addCase(fetchHistory.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.fetchStatus = "error";
        state.fetchError = action.payload;
      })
      // fetchCampaignById
      .addCase(fetchCampaignById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.selectedStatus = "success";
        state.selectedId = action.payload.id;
        state.selectedCampaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.selectedStatus = "error";
        state.selectedError = action.payload;
      });
      
  },
});

export const { clearSelected } = historySlice.actions;
export default historySlice.reducer;