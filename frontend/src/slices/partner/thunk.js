// Include Both Helper File with needed methods
import {
  addNewPartner as addNewPartnerApi,
  deleteBankDetails as deleteBankDetailsApi,
  deletePartner as deletePartnerApi,
  getAllPartner as getAllPartnerApi,
  updatePartnerBankDetails as updatePartnerBankDetailsApi,
  updatePartner as updatePartnertApi,
} from '../../helpers/backend_helper';
import {
  apiError,
  partnerBankDetailsDelete,
  partnerBankDetailsUpdatedSuccess,
  partnerCreatedSuccess,
  partnerDeletedSuccess,
  partnerFetchedSuccess,
  partnerUpdatedSuccess,
  startDeleteBankDetailsLoader,
  starteAddEditLoader,
  starteLoader,
  stopLoader,
} from './reducer';

export const getAllPatnersData = () => async (dispatch) => {
  try {
    dispatch(starteLoader());
    let response = await getAllPartnerApi();

    if (response.status) {
      dispatch(partnerFetchedSuccess(response));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const updatePartner = (partner) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const response = await updatePartnertApi(partner);

    if (response.status) {
      dispatch(partnerUpdatedSuccess(response.data));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const updatePartnerBankDetails =
  (partnerBankDetails) => async (dispatch) => {
    try {
      dispatch(starteAddEditLoader());
      const response = await updatePartnerBankDetailsApi(partnerBankDetails);

      if (response.status) {
        dispatch(partnerBankDetailsUpdatedSuccess(response.data));
      } else {
        dispatch(apiError(response));
      }
      dispatch(stopLoader());
    } catch (error) {
      dispatch(stopLoader());
      dispatch(apiError(error));
    }
  };
export const deleteBankDetails = (id, user_id) => async (dispatch) => {
  try {
    dispatch(startDeleteBankDetailsLoader());
    const response = await deleteBankDetailsApi({ id: id });

    dispatch(partnerBankDetailsDelete(user_id));
    if (response.status) {
      dispatch(partnerBankDetailsDelete(user_id));
      dispatch(stopLoader());
      return true;
    } else {
      dispatch(apiError(response));
      dispatch(stopLoader());
      return false;
    }
  } catch (error) {
    dispatch(stopLoader());
    dispatch(apiError(error));
  }
};

export const deletePartner = (id) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const response = await deletePartnerApi(id);

    if (response.status) {
      dispatch(partnerDeletedSuccess(id));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const addNewPatnerThunk = (newPartner) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const response = await addNewPartnerApi(newPartner);

    if (response.status) {
      dispatch(partnerCreatedSuccess(response.data));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
