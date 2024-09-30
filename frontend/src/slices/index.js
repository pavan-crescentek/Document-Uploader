import { combineReducers } from 'redux';

// Front
import LayoutReducer from './layouts/reducer';

// Authentication
import LoginReducer from './auth/login/reducer';
import ProfileReducer from './auth/profile/reducer';

// Category
import CategoryReducer from './category/reducer';

// documents
import DocumentReducer from './documents/reducer';

// Partners
import PartnerReducer from './partner/reducer';

// UsersList
import UsersListReducer from './userList/reducer';

// Booking List
import BookingListReducer from './bookingList/reducer';

// Send Notification
import SendNotificationReducer from './sendNotification/reducer';

// Admin Dashboard
import AdminDashboardReducer from './adminDeshboard/reducer';

// Partner Dashboard
import PartnerDashboardReducer from './partnerDashboard/reducer';

import PartnerGroundsReducer from './grounds/reducer';

// Dashboard Ecommerce
import DashboardEcommerceReducer from './dashboardEcommerce/reducer';

// API Key
import APIKeyReducer from './apiKey/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Profile: ProfileReducer,
  Category: CategoryReducer,
  Document: DocumentReducer,
  Partner: PartnerReducer,
  UsersList: UsersListReducer,
  BookingList: BookingListReducer,
  SendNotification: SendNotificationReducer,
  AdminDashboard: AdminDashboardReducer,
  PartnerDashboard: PartnerDashboardReducer,
  Grounds: PartnerGroundsReducer,
  DashboardEcommerce: DashboardEcommerceReducer,
  APIKey: APIKeyReducer,
});

export default rootReducer;
