import { createAsyncThunk } from '@reduxjs/toolkit';
//Include Both Helper File with needed methods
import {
  getAllRevenueData as getAllRevenueDataApi,
  getHalfYearRevenueData as getHalfYearRevenueDataApi,
  getMonthRevenueData as getMonthRevenueDataApi,
  getYearRevenueData as getYearRevenueDataApi,
} from '../../helpers/backend_helper';

export const getRevenueChartsData = createAsyncThunk(
  'dashboardEcommerce/getRevenueChartsData',
  async (data) => {
    try {
      var response;
      if (data === 'all') {
        response = getAllRevenueDataApi(data);
      }
      if (data === 'month') {
        response = getMonthRevenueDataApi(data);
      }
      if (data === 'halfyear') {
        response = getHalfYearRevenueDataApi(data);
      }
      if (data === 'year') {
        response = getYearRevenueDataApi(data);
      }
      return response;
    } catch (error) {
      return error;
    }
  }
);
