import React from "react";
import { Route, Routes } from "react-router-dom";
import routeConfig from "../config/route-config";
import AppLayout from "../layout/AppLayout";
import PageNotFound from "../pages/PageNotFOund";
import PermissionGuard from "../guard/PermissionGuard";
import UnauthorizedPage from "../pages/UnauthorizedPage";
// import NotFoundPage from "../pages/NotFoundPage";

const AuthenticatedRoutes = ({ data }) => {
  return (
    <AppLayout>
      <Routes>
        {routeConfig.map(
          ({ path, element: Component, roles, permissions }, idx) => (
            <Route
              key={idx}
              path={path}
              element={
                <PermissionGuard roles={roles} permissions={permissions}>
                  <Component />
                </PermissionGuard>
              }
            />
          ),
        )}

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Catch-all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppLayout>
  );
};

export default AuthenticatedRoutes;
