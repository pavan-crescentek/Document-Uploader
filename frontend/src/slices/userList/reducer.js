import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  usersListData: [],
  error: '',
  loading: false,
  errorMsg: false,
};

const UserListSlice = createSlice({
  name: 'UsersList',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.message;
      state.loading = false;
      state.errorMsg = true;
    },
    usersFetchedSuccess(state, action) {
      state.usersListData = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
    starteLoader(state) {
      state.loading = true;
    },
  },
});
export const { apiError, starteLoader, usersFetchedSuccess } =
  UserListSlice.actions;

export default UserListSlice.reducer;
