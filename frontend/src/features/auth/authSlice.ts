import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  isAuth: boolean;
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuth: false,
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuth = true;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
