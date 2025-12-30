import { Navigate } from "react-router-dom";

const AdminRoute = ({ user, children }) => {
  // not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // logged in but not admin
  if (user.role !== "ROLE_ADMIN") {
    return <Navigate to="/signin" replace />;
  }

  // logged in + admin
  return children;
};

export default AdminRoute;
