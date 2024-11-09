import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function CheckRolePermission({ allowedRole }) {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  return isLoggedIn && allowedRole.find((myRole) => myRole == role) ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to="/Denied" />
  ) : (
    <Navigate to="/Login" />
  );
}
export default CheckRolePermission;
