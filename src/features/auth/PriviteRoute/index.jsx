import { authActions, authSelectors } from "features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
export default function PrivateRoute(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = props;
  const { currentUser, status } = useSelector(authSelectors);

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const currentRole = localStorage.getItem("currentRole");

  useEffect(() => {
    if (!accessToken || (accessToken && status === 0 && !currentRole)) {
      navigate("/login");
    } else if (
      (status === 0 && currentRole) ||
      (status === 403 && currentRole === role) ||
      (status === 200 && !currentRole)
    ) {
      dispatch(authActions.getInfo(role));
    } else if (status === 403 && !currentRole) {
      dispatch(authActions.logout());
    } else if (status === 403 && currentRole !== role) {
      navigate(`/${currentRole === "candidate" ? "" : currentRole}`);
    }
  }, [
    accessToken,
    currentRole,
    dispatch,
    navigate,
    refreshToken,
    role,
    status,
  ]);

  return (
    <>
      {accessToken && status === 200 && currentUser && <Outlet role={role} />}
    </>
  );
}
