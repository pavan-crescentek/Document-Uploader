import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';
import { setAuthorization } from '../helpers/api_helper';

import { useProfile } from '../Components/Hooks/UserHooks';

import { logoutUser } from '../slices/auth/login/thunk';

const AdminAuthProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();
  useEffect(() => {
    if (
      userProfile &&
      !loading &&
      token &&
      userProfile.role &&
      userProfile.role.some((role) => role.toLowerCase().includes('admin'))
    ) {
      setAuthorization(token);
    } else if ((!userProfile || !token) && loading) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */

  if (
    (!userProfile && loading && !token) ||
    (userProfile.role &&
      !userProfile.role.some((role) => role.toLowerCase().includes('admin')))
  ) {
    dispatch(logoutUser());
    return (
      <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const PartnerAuthProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();

  useEffect(() => {
    if (
      userProfile &&
      !loading &&
      token &&
      userProfile.role &&
      userProfile.role.some((role) => role.toLowerCase().includes('enduser'))
    ) {
      setAuthorization(token);
    } else if ((!userProfile || !token) && loading) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */

  if (
    (!userProfile && loading && !token) ||
    (userProfile.role &&
      userProfile.role.some((role) => role.toLowerCase().includes('enduser')))
  ) {
    dispatch(logoutUser());
    return (
      <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {' '}
            <Component {...props} />{' '}
          </>
        );
      }}
    />
  );
};

export { AccessRoute, AdminAuthProtected, PartnerAuthProtected };
