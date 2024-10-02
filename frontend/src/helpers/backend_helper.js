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

// Document
export const getAllDocuments = () => api.get(url.GET_ALL_DOCUMENTS);
export const updateSingleDocument = (document, headers) =>
  api.create(url.UPDATE_DOCUMENT, document, headers);
export const deleteDocument = (id) => api.create(url.DELETE_DOCUMENT, id);
export const addNewDocument = (newDocument, headers) =>
  api.create(url.ADD_NEW_DOCUMENT, newDocument, headers);

// UsersList
export const getAllUsers = () => api.get(url.GET_ALL_USERS);
export const addNewUser = (newUser) => api.create(url.ADD_NEW_USER, newUser);
export const updateUserApi = (userData) =>
  api.create(url.UPDATE_USERS, userData);

// Update Profile
export const updateProfileForUser = (data) => api.create(url.UPDATE_USER, data);
export const updateProfileForAdmin = (data) =>
  api.create(url.UPDATE_ADMIN, data);
