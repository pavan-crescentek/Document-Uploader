//Include Both Helper File with needed methods
import { setAuthorization } from '../../../helpers/api_helper';
import { postLogin } from '../../../helpers/backend_helper';

import {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag,
  starteLoader,
} from './reducer';

export const loginUser = (user, history) => async (dispatch) => {
  try {
    let response;
    dispatch(starteLoader());
    response = postLogin({
      email: user.email,
      password: user.password,
    });

    var data = await response;

    if (data) {
      sessionStorage.setItem('authUser', JSON.stringify(data.data));
      var finalLogin = JSON.stringify(data);
      finalLogin = JSON.parse(finalLogin);
      data = finalLogin.data;
      if (finalLogin.code === 200) {
        setAuthorization(data.token);
        dispatch(loginSuccess(data));
        history(
          data.role.some((role) => role.toLowerCase().includes('admin'))
            ? '/admin/users'
            : '/'
        );
      } else {
        dispatch(apiError(finalLogin));
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem('authUser');
    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
