import { Navigate, Outlet } from "react-router-dom";
import { isAuth, removeCookie } from "../../utils/cookie";

const PrivateRoute = () => {
  if (isAuth("token")){
    return <Outlet />;
  }
  else {
    alert("로그인이 필요합니다.");
    removeCookie("token");
    return <Navigate to="/signin" />;
  }
};

export default PrivateRoute;