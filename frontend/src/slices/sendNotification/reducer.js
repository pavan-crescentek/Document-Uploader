import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  error: '',
  loading: false,
  errorMsg: false,
};

const SendNotificationSlice = createSlice({
  name: 'SendNotification',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action?.payload?.message;
      state.loading = false;
      state.errorMsg = true;
    },
    sendNotificationSuccess(state) {
      state.loading = false;
      state.errorMsg = false;
    },

    startLoader(state) {
      state.loading = true;
    },
  },
});
export const { apiError, sendNotificationSuccess, startLoader } =
  SendNotificationSlice.actions;

export default SendNotificationSlice.reducer;
