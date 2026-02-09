import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import routeConfig from "../config/route-config";
import AppLayout from "../layout/AppLayout";
import PageNotFound from "../pages/PageNotFOund";
import PermissionGuard from "../guard/PermissionGuard";
import UnauthorizedPage from "../pages/UnauthorizedPage";

const AuthenticatedRoutes = () => {
  const { meData } = useSelector((state) => state.auth);

  const userRole = meData?.roles?.[0]?.slug;

  if (!meData) return null; // or loader

  return (
    <AppLayout>
      <Routes>
        {routeConfig.map((route, idx) => {
          const {
            path,
            element: DefaultComponent,
            elements,
            roles,
            permissions,
          } = route;

          // ROLE BASED COMPONENT SELECTION
          const SelectedComponent =
            (elements && elements[userRole]) || DefaultComponent;

          if (!SelectedComponent) return null;

          return (
            <Route
              key={idx}
              path={path}
              element={
                <PermissionGuard roles={roles} permissions={permissions}>
                  <SelectedComponent />
                </PermissionGuard>
              }
            />
          );
        })}

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppLayout>
  );
};

export default AuthenticatedRoutes;
