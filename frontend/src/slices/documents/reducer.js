import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  documentData: [],
  error: '',
  loading: false,
  errorMsg: false,
  addEditLoading: false,
};

const DocumentSlice = createSlice({
  name: 'Document',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action?.payload?.message;
      state.loading = false;
      state.addEditLoading = false;
      state.errorMsg = true;
    },
    documentFetchedSuccess(state, action) {
      state.documentData = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
    startLoader(state) {
      state.loading = true;
    },
    startAddEditLoader(state) {
      state.addEditLoading = true;
    },
    documentUpdatedSuccess(state, action) {
      const updatedDocument = action.payload;

      const index = state.documentData.findIndex(
        (document) => document._id === updatedDocument._id
      );

      if (index !== -1) {
        state.documentData[index] = updatedDocument;
      }
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    documentDeletedSuccess(state, action) {
      const id = action.payload.id;
      state.documentData = state.documentData.filter(
        (document) => document._id !== id
      );
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    documentCreatedSuccess(state, action) {
      const newDocument = action.payload;
      state.documentData.unshift(newDocument);
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    resetDocumentData(state) {
      state.documentData = [];
    },
  },
});
export const {
  apiError,
  documentFetchedSuccess,
  startLoader,
  documentUpdatedSuccess,
  documentDeletedSuccess,
  documentCreatedSuccess,
  startAddEditLoader,
  resetDocumentData,
} = DocumentSlice.actions;

export default DocumentSlice.reducer;
