import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  username: '',
  creditBalance: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.creditBalance = action.payload.creditBalance;
    },
    updateCreditBalance(state, action) {
      state.creditBalance = action.payload;
    },
    clearUser(state) {
      state.id = null;
      state.username = '';
      state.creditBalance = 0;
    },
  },
});

export const { setUser, updateCreditBalance, clearUser } = userSlice.actions;
export default userSlice.reducer;