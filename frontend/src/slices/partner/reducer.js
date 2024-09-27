import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  partnersData: [],
  error: '',
  loading: false,
  errorMsg: false,
  addEditLoading: false,
  deleteBankDetailsLoading: false,
};

const PartnerSlice = createSlice({
  name: 'Partner',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.message;
      state.loading = false;
      state.addEditLoading = false;
      state.errorMsg = true;
    },
    partnerFetchedSuccess(state, action) {
      state.partnersData = action.payload.data;
      state.loading = false;
      state.errorMsg = false;
    },
    starteLoader(state) {
      state.loading = true;
    },
    starteAddEditLoader(state) {
      state.addEditLoading = true;
    },
    startDeleteBankDetailsLoader(state) {
      state.deleteBankDetailsLoading = true;
    },
    partnerUpdatedSuccess(state, action) {
      const updatedPartner = action.payload;

      const index = state.partnersData.findIndex(
        (partner) => partner.id === updatedPartner.id
      );

      if (index !== -1) {
        state.partnersData[index] = updatedPartner;
      }
      state.addEditLoading = false;
      state.loading = false;
      state.errorMsg = false;
    },
    partnerBankDetailsUpdatedSuccess(state, action) {
      const updatedBankDetailsOfPartner = action.payload;

      const index = state.partnersData.findIndex(
        (partner) => partner.id === updatedBankDetailsOfPartner.user_id
      );

      if (index !== -1) {
        state.partnersData[index].bank_details = updatedBankDetailsOfPartner;
      }
      state.addEditLoading = false;
      state.loading = false;
      state.errorMsg = false;
    },
    partnerBankDetailsDelete(state, action) {
      const bankDetailsId = action.payload;

      const index = state.partnersData.findIndex(
        (partner) => partner.id == bankDetailsId
      );

      if (index !== -1) {
        state.partnersData[index].bank_details = {};
      }
      state.addEditLoading = false;
      state.loading = false;
      state.errorMsg = false;
      state.deleteBankDetailsLoading = false;
    },
    partnerDeletedSuccess(state, action) {
      const id = action.payload.id;
      state.partnersData = state.partnersData.filter(
        (partner) => partner.id !== id
      );
      state.addEditLoading = false;
      state.loading = false;
      state.errorMsg = false;
    },
    partnerCreatedSuccess(state, action) {
      const newPartner = action.payload;
      state.partnersData.push(newPartner);
      state.loading = false;
      state.addEditLoading = false;
      state.errorMsg = false;
    },
    stopLoader(state, action) {
      state.addEditLoading = false;
      state.loading = false;
      state.errorMsg = false;
      state.deleteBankDetailsLoading = false;
    },
  },
});
export const {
  apiError,
  starteLoader,
  partnerCreatedSuccess,
  partnerDeletedSuccess,
  partnerFetchedSuccess,
  partnerUpdatedSuccess,
  partnerBankDetailsUpdatedSuccess,
  starteAddEditLoader,
  startDeleteBankDetailsLoader,
  partnerBankDetailsDelete,
  stopLoader,
} = PartnerSlice.actions;

export default PartnerSlice.reducer;
