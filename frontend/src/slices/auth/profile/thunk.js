//Include Both Helper File with needed methods
import {
  updateProfileForAdmin as updateProfileForAdminApi,
  updateProfileForUser as updateProfileForUserAPI,
} from '../../../helpers/backend_helper';

// action
import {
  profileError,
  profileSuccess,
  resetProfileFlagChange,
  startLoader,
  stopLoader,
} from './reducer';

export const editProfileForUser = (data) => async (dispatch) => {
  try {
    dispatch(startLoader());
    let response = await updateProfileForUserAPI(data);

    if (response.status) {
      const sessionUser = JSON.parse(sessionStorage.getItem('authUser'));

      const data = {
        email: response.data.email,
        id: response.data.id,
        name: response.data.name,
        role: sessionUser.role,
        token: sessionUser.token,
      };
      dispatch(profileSuccess(data));
      sessionStorage.setItem('authUser', JSON.stringify(data));
      return true;
    }
    dispatch(stopLoader());
    return false;
  } catch (error) {
    dispatch(profileError(error));
    dispatch(stopLoader());
    return false;
  }
};
export const editProfileForAdmin = (data) => async (dispatch) => {
  try {
    dispatch(startLoader());
    let response = await updateProfileForAdminApi(data);

    if (response.status) {
      const sessionUser = JSON.parse(sessionStorage.getItem('authUser'));

      const data = {
        email: response.data.email,
        id: response.data.id,
        name: response.data.name,
        role: sessionUser.role,
        token: sessionUser.token,
      };
      dispatch(profileSuccess(data));
      sessionStorage.setItem('authUser', JSON.stringify(data));
      return true;
    }
    dispatch(stopLoader());
    return false;
  } catch (error) {
    dispatch(profileError(error));
    dispatch(stopLoader());
    return false;
  }
};

export const resetProfileFlag = () => {
  try {
    const response = resetProfileFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};
