// Include Both Helper File with needed methods
import { getAllUsers as getAllUsersApi } from '../../helpers/backend_helper';
import { apiError, starteLoader, usersFetchedSuccess } from './reducer';

export const getAllUsersData = () => async (dispatch) => {
  try {
    dispatch(starteLoader());
    let response = await getAllUsersApi();

    if (response.code) {
      dispatch(usersFetchedSuccess(response));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
