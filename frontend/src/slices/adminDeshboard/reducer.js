import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  statisticsData: [],
  error: '',
  loading: false,
  errorMsg: false,
};

const AdminDashboardSlice = createSlice({
  name: 'AdminDashboard',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.message;
      state.loading = false;
      state.errorMsg = true;
    },
    starteLoader(state) {
      state.loading = true;
    },
    statisticsFetchedSuccess(state, action) {
      state.statisticsData = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
  },
});
export const { apiError, starteLoader, statisticsFetchedSuccess } =
  AdminDashboardSlice.actions;

export default AdminDashboardSlice.reducer;
