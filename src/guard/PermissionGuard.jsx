import { useSelector } from "react-redux";
import { hasAccess } from "../utils/accessControl";
import { Navigate } from "react-router-dom";

const PermissionGuard = ({ children, roles, permissions }) => {
  const { meData } = useSelector((state) => state.auth);

  // if (!meData) return <Navigate to="/auth" replace />;

  const allowed = hasAccess({
    userRole: meData?.role,
    userPermissions: meData?.permissions,
    roles,
    permissions,
  });

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PermissionGuard;
