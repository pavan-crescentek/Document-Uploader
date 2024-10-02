// Include Both Helper File with needed methods
import {
  addNewUser as addNewUserApi,
  getAllUsers as getAllUsersApi,
  updateUserApi,
} from '../../helpers/backend_helper';
import {
  apiError,
  startAddEditLoader,
  startLoader,
  stopLoader,
  userCreatedSuccess,
  usersFetchedSuccess,
  userUpdatedSuccess,
} from './reducer';

export const getAllUsersData = () => async (dispatch) => {
  try {
    dispatch(startLoader());
    let response = await getAllUsersApi();

    if (response.code === 200) {
      dispatch(usersFetchedSuccess(response));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
    dispatch(stopLoader());
  } catch (error) {
    dispatch(stopLoader());
    dispatch(apiError(error));
  }
};

export const addNewUserThunk = (newUser) => async (dispatch) => {
  try {
    dispatch(startAddEditLoader());
    const response = await addNewUserApi(newUser);

    if (response.code === 200) {
      dispatch(userCreatedSuccess(response.data));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
    dispatch(stopLoader());
  } catch (error) {
    dispatch(stopLoader());
    dispatch(apiError(error));
  }
};

export const updateUser = (user) => async (dispatch) => {
  try {
    dispatch(startAddEditLoader());
    const response = await updateUserApi(user);

    if (response.code === 200) {
      dispatch(userUpdatedSuccess(response.data));
      return true;
    } else {
      dispatch(apiError(response));
      return false;
    }
    dispatch(stopLoader());
  } catch (error) {
    dispatch(stopLoader());
    dispatch(apiError(error));
  }
};
