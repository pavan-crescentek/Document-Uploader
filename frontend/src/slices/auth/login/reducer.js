import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  user: {},
  error: '', // for error message
  loading: false,
  isUserLogout: false,
  errorMsg: false, // for error
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.message;
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state, action) {
      state.isUserLogout = true;
    },
    reset_login_flag(state) {
      state.error = null;
      state.loading = false;
      state.errorMsg = false;
    },
    starteLoader(state) {
      state.loading = true;
    },
  },
});

export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag,
  starteLoader,
} = loginSlice.actions;

export default loginSlice.reducer;
