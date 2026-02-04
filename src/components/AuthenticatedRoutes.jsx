import React from "react";
import { Route, Routes } from "react-router-dom";
import routeConfig from "../config/route-config";
import AppLayout from "../layout/AppLayout";
import PageNotFound from "../pages/PageNotFOund";
// import NotFoundPage from "../pages/NotFoundPage";

const AuthenticatedRoutes = ({data}) => {
  return (
    <AppLayout>
      <Routes>
        {routeConfig.map(({ path, element: Component }, idx) => (
          <Route key={idx} path={path} element={<Component />} />
        ))}

         {/* Catch-all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppLayout>
  );
};

export default AuthenticatedRoutes;
