import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import watchHistoryReducer from "../features/watchHistory/watchHistorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    watchHistory: watchHistoryReducer,
  },
});
