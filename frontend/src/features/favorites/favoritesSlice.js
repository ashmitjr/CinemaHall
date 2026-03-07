import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: [] },
  reducers: {
    setFavorites(state, { payload }) {
      state.items = payload;
    },
    addFavorite(state, { payload }) {
      state.items.push(payload);
    },
    removeFavorite(state, { payload }) {
      state.items = state.items.filter((item) => item._id !== payload);
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
