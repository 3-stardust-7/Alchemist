import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./Campaignslice";
import historyReducer from "./HistorySlice"

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    history:historyReducer
  },
});