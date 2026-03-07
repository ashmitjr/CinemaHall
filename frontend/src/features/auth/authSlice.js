import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, accessToken: null, isAuth: false },
  reducers: {
    setCredentials(state, { payload }) {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.isAuth = true;
    },
    setAccessToken(state, { payload }) {
      state.accessToken = payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuth = false;
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
