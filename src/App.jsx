import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthenticatedRoutes from "./components/AuthenticatedRoutes";
import AuthPage from "./pages/AuthPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeData } from "./redux/slices/authSlice";
import AppLayoutSkeleton from "./layout/AppLayoutSkeleton";
import { usePreventNumberInputScroll, useScrollToTop } from "./hooks/useScroll";
import { useSocket } from "./hooks/useSocket";

const App = () => {
  const dispatch = useDispatch();

  const { logIn, loading, meData } = useSelector((state) => state.auth);
  useSocket();

  useEffect(() => {
    if (logIn) {
      dispatch(fetchMeData());
    }
  }, [logIn]);

  useScrollToTop();
  usePreventNumberInputScroll();

  if (loading) {
    return <AppLayoutSkeleton />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* AUTH */}
        {!logIn && <Route path="/auth" element={<AuthPage />} />}
        {logIn && <Route path="/auth" element={<Navigate to="/" replace />} />}

        {/* PROTECTED */}
        {logIn && meData && (
          <Route
            path="/*"
            element={<AuthenticatedRoutes />}
          />
        )}

        {/* NOT LOGGED IN */}
        {!logIn && <Route path="*" element={<Navigate to="/auth" replace />} />}
      </Routes>
    </Suspense>
  );
};

export default App;
