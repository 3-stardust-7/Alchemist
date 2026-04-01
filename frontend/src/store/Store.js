import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./Campaignslice";

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
  },
});