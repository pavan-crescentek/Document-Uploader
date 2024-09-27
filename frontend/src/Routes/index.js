import React from 'react';
import { Route, Routes } from 'react-router-dom';

//Layouts
import NonAuthLayout from '../Layouts/NonAuthLayout';
import VerticalLayout from '../Layouts/index';

//routes
import { AdminAuthProtected, PartnerAuthProtected } from './AuthProtected';
import {
  adminAuthProtectedRoutes,
  endUserAuthProtectedRoutes,
  publicRoutes,
} from './allRoutes';

const Index = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}
        </Route>

        <Route>
          {adminAuthProtectedRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AdminAuthProtected>
                  <VerticalLayout>{route.component}</VerticalLayout>
                </AdminAuthProtected>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>
        <Route>
          {endUserAuthProtectedRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <PartnerAuthProtected>
                  <VerticalLayout>{route.component}</VerticalLayout>
                </PartnerAuthProtected>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
