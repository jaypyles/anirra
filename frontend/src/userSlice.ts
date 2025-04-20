import { createSlice } from "@reduxjs/toolkit";

export type User = {
  id: string;
  username: string;
  creditBalance: number;
  settings: string[];
};

const initialState: User = {
  id: "",
  username: "",
  creditBalance: 0,
  settings: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.creditBalance = action.payload.creditBalance;
      state.settings = action.payload.settings;
    },
    updateCreditBalance(state, action) {
      state.creditBalance = action.payload;
    },
    clearUser(state) {
      state.id = "";
      state.username = "";
      state.creditBalance = 0;
      state.settings = [];
    },
  },
});

export const { setUser, updateCreditBalance, clearUser } = userSlice.actions;
export default userSlice.reducer;
