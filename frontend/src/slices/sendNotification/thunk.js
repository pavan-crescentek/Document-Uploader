// Include Both Helper File with needed methods
import { sendNotificationApi } from '../../helpers/backend_helper';
import { apiError, sendNotificationSuccess, startLoader } from './reducer';

export const sendNotification = (notificationData) => async (dispatch) => {
  try {
    dispatch(startLoader());
    let response = await sendNotificationApi(notificationData);

    if (response && response.status) {
      dispatch(sendNotificationSuccess(response));
      return response.status;
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
