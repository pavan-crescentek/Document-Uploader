import React from 'react';
import { Navigate } from 'react-router-dom';

//AuthenticationInner pages
import BasicSignIn from '../pages/AuthenticationInner/Login/BasicSignIn';
import BasicPasswReset from '../pages/AuthenticationInner/PasswordReset/BasicPasswReset';

import Alt404 from '../pages/AuthenticationInner/Errors/Alt404';
import Basic404 from '../pages/AuthenticationInner/Errors/Basic404';
import Cover404 from '../pages/AuthenticationInner/Errors/Cover404';
import BasicLogout from '../pages/AuthenticationInner/Logout/BasicLogout';
import BasicSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg';

import BasicPasswCreate from '../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate';

// User Profile
import UserProfile from '../pages/Authentication/user-profile';

// Bookingd

// Categories

// Part Grounds

// Documents
import Documents from '../pages/Documents';

// Partners

// Users
import Users from '../pages/Users/index';

// Send Notification

//APi Key

//login
import Login from '../pages/Authentication/Login';
// import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from '../pages/Authentication/Logout';

const endUserAuthProtectedRoutes = [
  // { path: '/partner/index', component: <PartnerDashboard /> },
  { path: '/profile', component: <UserProfile /> },
  { path: '/documents', component: <Documents /> },
  { path: '/', component: <Documents /> },
  { path: '/index', component: <Documents /> },
];
const adminAuthProtectedRoutes = [
  //User Profile
  { path: '/admin/profile', component: <UserProfile /> },

  { path: '/admin/documents', component: <Documents /> },

  //Users
  { path: '/admin/users', component: <Users /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: '/admin',
    exact: true,
    component: <Navigate to="/users" />,
  },
  { path: '*', component: <Navigate to="/users" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  // { path: "/forgot-password", component: <ForgetPasswordPage /> },

  //AuthenticationInner pages
  { path: '/auth-signin-basic', component: <BasicSignIn /> },
  { path: '/auth-pass-reset-basic', component: <BasicPasswReset /> },
  { path: '/auth-logout-basic', component: <BasicLogout /> },

  { path: '/auth-success-msg-basic', component: <BasicSuccessMsg /> },
  { path: '/auth-404-basic', component: <Basic404 /> },
  { path: '/auth-404-cover', component: <Cover404 /> },
  { path: '/auth-404-alt', component: <Alt404 /> },

  { path: '/auth-pass-change-basic', component: <BasicPasswCreate /> },
];

export { adminAuthProtectedRoutes, endUserAuthProtectedRoutes, publicRoutes };
