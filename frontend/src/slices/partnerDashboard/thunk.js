import { getPartnerDashboardStatistics as getPartnerDashboardStatisticsApi } from '../../helpers/backend_helper';
import { apiError, starteLoader, statisticsFetchedSuccess } from './reducer';

export const getPartnerDashboardStatisticsData = () => async (dispatch) => {
  try {
    dispatch(starteLoader());
    let response = await getPartnerDashboardStatisticsApi();

    if (response.status) {
      dispatch(statisticsFetchedSuccess(response));
    } else {
      dispatch(apiError(response));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
