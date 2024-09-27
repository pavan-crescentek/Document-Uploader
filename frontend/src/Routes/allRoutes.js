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
import GroundBookings from '../pages/Partnerpages/GroundBookings';

// Categories

// Part Grounds
import Grounds from '../pages/Partnerpages/Grounds';

// Partners

// Users
import Users from '../pages/Users/index';

// Send Notification

//APi Key
import APIKey from '../pages/APIKey/index';

//login
import Login from '../pages/Authentication/Login';
// import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from '../pages/Authentication/Logout';

const endUserAuthProtectedRoutes = [
  // { path: '/partner/index', component: <PartnerDashboard /> },
  { path: '/partner/ground', component: <Grounds /> },
  { path: '/partner/profile', component: <UserProfile /> },
  { path: '/partner/bookings', component: <GroundBookings /> },
];
const adminAuthProtectedRoutes = [
  // { path: '/index', component: <DashboardEcommerce /> },

  //Api Key
  { path: '/apps-api-key', component: <APIKey /> },

  //User Profile
  { path: '/profile', component: <UserProfile /> },

  //Users
  { path: '/users', component: <Users /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: '/',
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
