import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = "http://localhost:8000";

// Async thunk — sends document to FastAPI
export const submitDocument = createAsyncThunk(
  "campaign/submitDocument",
  async ({ content, source_type }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/submit-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, source_type }),
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    sourceContent: "",
    sourceType: "text",
    submitStatus: "idle", // "idle" | "loading" | "success" | "error"
    submitError: null,
    serverResponse: null,
  },
  reducers: {
    setSourceContent: (state, action) => {
      state.sourceContent = action.payload;
    },
    setSourceType: (state, action) => {
      state.sourceType = action.payload;
    },
    resetCampaign: (state) => {
      state.sourceContent = "";
      state.submitStatus = "idle";
      state.submitError = null;
      state.serverResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitDocument.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
      })
      .addCase(submitDocument.fulfilled, (state, action) => {
        state.submitStatus = "success";
        state.serverResponse = action.payload;
      })
      .addCase(submitDocument.rejected, (state, action) => {
        state.submitStatus = "error";
        state.submitError = action.payload;
      });
  },
});

export const { setSourceContent, setSourceType, resetCampaign } =
  campaignSlice.actions;

export default campaignSlice.reducer;