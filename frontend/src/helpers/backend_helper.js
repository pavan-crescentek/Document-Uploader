import { APIClient } from './api_helper';

import * as url from './url_helper';

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Login Method
export const postLogin = (data) => api.create(url.POST_LOGIN, data);

// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data).catch((err) => {
    var message;
    if (err.response && err.response.status) {
      switch (err.response.status) {
        case 404:
          message = 'Sorry! the page you are looking for could not be found';
          break;
        case 500:
          message =
            'Sorry! something went wrong, please contact our support team';
          break;
        case 401:
          message = 'Invalid credentials';
          break;
        default:
          message = err[1];
          break;
      }
    }
    throw message;
  });
};

// // Login Method
// export const postJwtLogin = data => api.create(url.POST_FAKE_JWT_LOGIN, data);

// Dashboard Ecommerce
// Revenue
export const getAllRevenueData = () => api.get(url.GET_ALLREVENUE_DATA);
export const getMonthRevenueData = () => api.get(url.GET_MONTHREVENUE_DATA);
export const getHalfYearRevenueData = () =>
  api.get(url.GET_HALFYEARREVENUE_DATA);
export const getYearRevenueData = () => api.get(url.GET_YEARREVENUE_DATA);

// Category
export const getAllCategiry = () => api.get(url.GET_ALL_CATEGORY);
export const getAllCategiryForPartner = () =>
  api.get(url.GET_ALL_CATEGORY_FOR_PARTNER);
export const updateCategiry = (category, headers) =>
  api.create(url.ADD_UPDATE_CATEGORY, category, headers);
export const deleteCategory = (id) => api.create(url.DELETE_CATEGORY, id);
export const addNewCategory = (newCategory, headers) =>
  api.create(url.ADD_UPDATE_CATEGORY, newCategory, headers);

// Document
export const getAllDocuments = () => api.get(url.GET_ALL_DOCUMENTS);
export const updateSingleDocument = (document, headers) =>
  api.create(url.UPDATE_DOCUMENT, document, headers);
export const deleteDocument = (id) => api.create(url.DELETE_DOCUMENT, id);
export const addNewDocument = (newDocument, headers) =>
  api.create(url.ADD_NEW_DOCUMENT, newDocument, headers);

// Grrounds
export const getAllGrounds = () => api.get(url.GET_ALL_GROUNDS);
export const getGroundsSlot = (groundId) =>
  api.create(url.GET_GROUND_SLOT, groundId);
export const getGroundsBooking = (groundId) =>
  api.create(url.GET_GROUND_BOOKINGS, groundId);
export const getGroundsSlotForBooking = (groundId) =>
  api.create(url.GET_GROUND_SLOT_FOR_BOOKING, groundId);
export const updateGroundsSlot = (updatedSlots) =>
  api.create(url.UPDATE_GROUND_SLOT, updatedSlots);
export const bookSlot = (bookingDetails) =>
  api.create(url.BOOK_SLOT, bookingDetails);
export const updateGround = (ground) =>
  api.create(url.ADD_UPDATE_GROUND, ground);
export const deleteGround = (id) => api.create(url.DELETE_GROUND, id);
export const deleteGroundImages = (id) =>
  api.create(url.DELETE_GROUND_IMAGES, id);
export const addNewGround = (newGround, headers) =>
  api.create(url.ADD_UPDATE_GROUND, newGround, headers);
export const addNewImage = (newImageData, headers) =>
  api.create(url.ADD_NEW_IMAGE_GROUND, newImageData, headers);
export const getAllCountries = () => api.get(url.GET_ALL_COUNTRIES);
export const getStatesOfCountry = (id) =>
  api.create(url.GET_STATE_OF_COUNTRIES, id);
export const getCitiesOfState = (id) => api.create(url.GET_CITIES_OF_STATE, id);
export const getIndividualGroundDetails = (id) =>
  api.create(url.GET_INDIVIDUAL_GROUND_DETAILS, id);

// Partners
export const getAllPartner = () => api.get(url.GET_ALL_PARTNERS);
export const updatePartner = (partner) =>
  api.create(url.ADD_UPDATE_PARTNER, partner);
export const updatePartnerBankDetails = (partnerBankDetails) =>
  api.create(url.ADD_UPDATE_PARTNER_BANK_DETAILS, partnerBankDetails);
export const deleteBankDetails = (id) =>
  api.create(url.DELETE_BANK_DETAILS, id);
export const deletePartner = (id) => api.create(url.DELETE_PARTNER, id);
export const addNewPartner = (newPartner) =>
  api.create(url.ADD_UPDATE_PARTNER, newPartner);

// UsersList
export const getAllUsers = () => api.get(url.GET_ALL_USERS);
export const addNewUser = (newUser) => api.create(url.ADD_NEW_USER, newUser);
export const updateUserApi = (userData) =>
  api.create(url.UPDATE_USERS, userData);

// Booking List
export const getBookingList = () => api.create(url.GET_BOOKING_LIST);

// Update Profile
export const updateProfileForPartner = (data) =>
  api.create(url.UPDATE_PARTNER, data);
export const updateProfileForAdmin = (data) =>
  api.create(url.UPDATE_ADMIN, data);

// Send Notification
export const sendNotificationApi = (notificationData) =>
  api.create(url.SEND_NOTIFICATION, notificationData);

// Admin Deshboard
export const getAdminDashboardStatistics = () => api.get(url.ADMIN_DASHBOARD);

// Partner Deshboard
export const getPartnerDashboardStatistics = () =>
  api.get(url.PARTNER_DASHBOARD);

//API Key
export const getAPIKey = () => api.get(url.GET_API_KEY);
