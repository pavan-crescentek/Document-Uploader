import { getAdminDashboardStatistics as getdDashboardStatisticsPartnerApi } from '../../helpers/fakebackend_helper';
import { apiError, starteLoader, statisticsFetchedSuccess } from './reducer';

export const getAdminDashboardStatisticsData = () => async (dispatch) => {
  try {
    dispatch(starteLoader());
    let response = await getdDashboardStatisticsPartnerApi();

    if (response.status) {
      dispatch(statisticsFetchedSuccess(response));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
