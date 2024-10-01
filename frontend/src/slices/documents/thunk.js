// Include Both Helper File with needed methods
import {
  addNewDocument as addNewDocumentApi,
  deleteDocument as deleteDocumentApi,
  getAllDocuments as getAllDocumentsApi,
  updateSingleDocument as updateDocumentApi,
} from '../../helpers/backend_helper';
import {
  apiError,
  documentCreatedSuccess,
  documentDeletedSuccess,
  documentFetchedSuccess,
  documentUpdatedSuccess,
  resetDocumentData,
  startAddEditLoader,
  startLoader,
} from './reducer';

export const getAllDocumentData = (userProfile) => async (dispatch) => {
  try {
    dispatch(startLoader());
    dispatch(resetDocumentData());
    let response = await getAllDocumentsApi();

    if (response.code === 200) {
      dispatch(documentFetchedSuccess(response));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
  } catch (error) {
    dispatch(apiError(error));
    return false;
  }
};

export const updateDocument = (document) => async (dispatch) => {
  try {
    dispatch(startAddEditLoader());
    const formData = new FormData();

    Object.keys(document).forEach((key) => {
      formData.append(key, document[key]);
    });
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const response = await updateDocumentApi(formData, headers);

    if (response.code === 200) {
      dispatch(documentUpdatedSuccess(response.data));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
  } catch (error) {
    dispatch(apiError(error));
    return false;
  }
};

export const deleteDocument = (id) => async (dispatch) => {
  try {
    dispatch(startAddEditLoader());
    const response = await deleteDocumentApi(id);

    if (response.code === 200) {
      dispatch(documentDeletedSuccess(id));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
  } catch (error) {
    dispatch(apiError(error));
    return false;
  }
};

export const addNewDocument = (newDocument) => async (dispatch) => {
  try {
    dispatch(startAddEditLoader());
    const formData = new FormData();

    Object.keys(newDocument).forEach((key) => {
      formData.append(key, newDocument[key]);
    });
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const response = await addNewDocumentApi(formData, headers);

    if (response?.code === 200) {
      dispatch(documentCreatedSuccess(response.data));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
  } catch (error) {
    dispatch(apiError(error));
    return false;
  }
};
