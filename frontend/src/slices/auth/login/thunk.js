//Include Both Helper File with needed methods
import { setAuthorization } from '../../../helpers/api_helper';
import {
  postFakeLogin,
  postJwtLogin,
} from '../../../helpers/fakebackend_helper';
import { getFirebaseBackend } from '../../../helpers/firebase_helper';

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
    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(user.email, user.password);
    } else if (process.env.REACT_APP_DEFAULTAUTH === 'jwt') {
      response = postJwtLogin({
        email: user.email,
        password: user.password,
      });
    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      dispatch(starteLoader());
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }

    var data = await response;

    if (data) {
      sessionStorage.setItem('authUser', JSON.stringify(data.data));
      var finallogin = JSON.stringify(data);
      finallogin = JSON.parse(finallogin);
      data = finallogin.data;
      if (finallogin.status) {
        setAuthorization(data.token);
        dispatch(loginSuccess(data));
        history(
          data.role.toLowerCase().includes('admin')
            ? '/users'
            : '/partner/index'
        );
      } else {
        dispatch(apiError(finallogin));
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem('authUser');
    let fireBaseBackend = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem('authUser', JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard');
    }
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
