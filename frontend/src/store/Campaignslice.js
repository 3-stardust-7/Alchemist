import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = "http://localhost:8000";

export const submitDocument = createAsyncThunk(
  "campaign/submitDocument",
  async ({ content, source_type }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/process-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, source_type }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${response.status}`);
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
    submitStatus: "idle", 
    submitError: null,
    factSheet: null,
    blogPost: null,
    socialThread: null,
    emailTeaser: null,
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
      state.factSheet = null;
      state.blogPost = null;
      state.socialThread = null;
      state.emailTeaser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitDocument.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
        state.factSheet = null;
        state.blogPost = null;
        state.socialThread = null;
        state.emailTeaser = null;
      })
      .addCase(submitDocument.fulfilled, (state, action) => {
        state.submitStatus = "success";
        state.factSheet = action.payload.fact_sheet;
        state.blogPost = action.payload.blog_post;
        state.socialThread = action.payload.social_thread;
        state.emailTeaser = action.payload.email_teaser;
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