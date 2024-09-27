// Include Both Helper File with needed methods
import { getBookingList as getBookingListApi } from '../../helpers/fakebackend_helper';
import { apiError, bookingFetchedSuccess, starteLoader } from './reducer';

export const getBookingListData = () => async (dispatch) => {
  try {
    dispatch(starteLoader());
    let response = await getBookingListApi();

    if (response.status) {
      dispatch(bookingFetchedSuccess(response));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
