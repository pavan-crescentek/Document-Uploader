import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  bookingListData: [],
  error: '',
  loading: false,
  errorMsg: false,
};

const BookingListSlice = createSlice({
  name: 'BookingList',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.message;
      state.bookingListData = [];
      state.loading = false;
      state.errorMsg = true;
    },
    bookingFetchedSuccess(state, action) {
      state.bookingListData = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
    starteLoader(state) {
      state.loading = true;
    },
  },
});
export const { apiError, starteLoader, bookingFetchedSuccess } =
  BookingListSlice.actions;

export default BookingListSlice.reducer;
