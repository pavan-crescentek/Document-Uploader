import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  error: '',
  success: '',
  user: {},
  loading: false,
};

const ProfileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    profileSuccess(state, action) {
      state.success = action.payload.status;
      state.user = action.payload.data;
      state.loading = false;
    },
    profileError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    editProfileChange(state, action) {
      state = { ...state };
      state.loading = false;
      state.user = action.payload.data;
    },
    resetProfileFlagChange(state) {
      state.success = null;
    },
    startLoader(state) {
      state.loading = true;
    },
    stopLoader(state) {
      state.loading = false;
    },
  },
});

export const {
  profileSuccess,
  profileError,
  editProfileChange,
  resetProfileFlagChange,
  startLoader,
  stopLoader,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;
