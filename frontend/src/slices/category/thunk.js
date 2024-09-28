// Include Both Helper File with needed methods
import {
  addNewCategory as addNewCategorytApi,
  deleteCategory as deleteCategorytApi,
  getAllCategiry as getAllCategiryApi,
  getAllCategiryForPartner as getAllCategiryForPartnerApi,
  updateCategiry as updateCategorytApi,
} from '../../helpers/backend_helper';
import {
  apiError,
  categoryCreatedSuccess,
  categoryDeletedSuccess,
  categoryFetchedSuccess,
  categoryUpdatedSuccess,
  resetCategoryData,
  starteAddEditLoader,
  starteLoader,
} from './reducer';

export const getAllCategoryData = (userProfile) => async (dispatch) => {
  try {
    dispatch(starteLoader());
    dispatch(resetCategoryData());
    let response = userProfile.role.some((role) =>
      role.toLowerCase().includes('admin')
    )
      ? await getAllCategiryApi()
      : await getAllCategiryForPartnerApi();

    if (response && response.status) {
      dispatch(categoryFetchedSuccess(response));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const updateCategory = (category) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const formData = new FormData();

    Object.keys(category).forEach((key) => {
      formData.append(key, category[key]);
    });
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const response = await updateCategorytApi(formData, headers);

    if (response.status) {
      dispatch(categoryUpdatedSuccess(response.data));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const response = await deleteCategorytApi(id);

    if (response.status) {
      dispatch(categoryDeletedSuccess(id));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const addNewCategory = (newCategory) => async (dispatch) => {
  try {
    dispatch(starteAddEditLoader());
    const formData = new FormData();

    Object.keys(newCategory).forEach((key) => {
      formData.append(key, newCategory[key]);
    });
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const response = await addNewCategorytApi(formData, headers);

    if (response.status) {
      dispatch(categoryCreatedSuccess(response.data));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
