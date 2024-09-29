import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  usersList: [],
  error: '',
  loading: false,
  errorMsg: false,
  addEditLoading: false,
};

const UserListSlice = createSlice({
  name: 'UsersList',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.message;
      state.loading = false;
      state.errorMsg = true;
      state.addEditLoading = false;
    },
    usersFetchedSuccess(state, action) {
      state.usersList = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
    startLoader(state) {
      state.loading = true;
    },
    startAddEditLoader(state) {
      state.addEditLoading = true;
    },
    userCreatedSuccess(state, action) {
      const newUser = action.payload;
      state.usersList.push(newUser);
      state.loading = false;
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    userUpdatedSuccess(state, action) {
      const updatedUser = action.payload;

      const index = state.usersList.findIndex(
        (users) => users._id === updatedUser._id
      );

      if (index !== -1) {
        state.usersList[index] = updatedUser;
      }
      state.addEditLoading = false;
      state.loading = false;
      state.errorMsg = false;
    },
    stopLoader(state, action) {
      state.addEditLoading = false;
      state.loading = false;
      state.errorMsg = false;
    },
  },
});
export const {
  apiError,
  startLoader,
  usersFetchedSuccess,
  startAddEditLoader,
  userCreatedSuccess,
  userUpdatedSuccess,
  stopLoader,
} = UserListSlice.actions;

export default UserListSlice.reducer;
