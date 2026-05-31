import { Navigate } from "react-router-dom";

const AdminRoute = ({ user, children }) => {
  // not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // logged in but not admin
  // logged in but not admin (allow SUPER_ADMIN as well)
  if (!(user.role === "ROLE_ADMIN" || user.role === "ROLE_SUPER_ADMIN")) {
    return <Navigate to="/signin" replace />;
  }

  // logged in + admin
  return children;
};

export default AdminRoute;
