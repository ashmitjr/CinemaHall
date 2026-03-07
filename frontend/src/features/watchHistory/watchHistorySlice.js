import { createSlice } from "@reduxjs/toolkit";

const watchHistorySlice = createSlice({
  name: "watchHistory",
  initialState: { items: [] },
  reducers: {
    setHistory(state, { payload }) {
      state.items = payload;
    },
    addToHistory(state, { payload }) {
      state.items = [payload, ...state.items];
    },
    clearHistory(state) {
      state.items = [];
    },
  },
});

export const { setHistory, addToHistory, clearHistory } = watchHistorySlice.actions;
export default watchHistorySlice.reducer;
