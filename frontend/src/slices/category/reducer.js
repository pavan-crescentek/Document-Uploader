import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  categoryData: [],
  error: '',
  loading: false,
  errorMsg: false,
  addEditLoading: false,
};

const CategorySlice = createSlice({
  name: 'Category',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action?.payload?.message;
      state.loading = false;
      state.addEditLoading = false;
      state.errorMsg = true;
    },
    categoryFetchedSuccess(state, action) {
      state.categoryData = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
    starteLoader(state) {
      state.loading = true;
    },
    starteAddEditLoader(state) {
      state.addEditLoading = true;
    },
    categoryUpdatedSuccess(state, action) {
      const updatedCategory = action.payload;

      const index = state.categoryData.findIndex(
        (category) => category.id === updatedCategory.id
      );

      if (index !== -1) {
        state.categoryData[index] = updatedCategory;
      }
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    categoryDeletedSuccess(state, action) {
      const id = action.payload.id;
      state.categoryData = state.categoryData.filter(
        (category) => category.id !== id
      );
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    categoryCreatedSuccess(state, action) {
      const newCategory = action.payload;
      state.categoryData.push(newCategory);
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    resetCategoryData(state) {
      state.categoryData = [];
    },
  },
});
export const {
  apiError,
  categoryFetchedSuccess,
  starteLoader,
  categoryUpdatedSuccess,
  categoryDeletedSuccess,
  categoryCreatedSuccess,
  starteAddEditLoader,
  resetCategoryData,
} = CategorySlice.actions;

export default CategorySlice.reducer;
