import { authSelectors } from "features/auth/authSlice";
import { useSelector } from "react-redux";
import UserInfo from "../../../../components/Common/UserInfo/UserInfo";
import "./CandidateInfo.scss";
import { Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function CandidateInfo() {

  const navigate = useNavigate();
  const { currentUser } = useSelector(authSelectors);
  const authStatus = useSelector((state) => state.auth.status);

  const accessToken = localStorage.getItem("accessToken");
  const currentRole = localStorage.getItem("currentRole");
  useEffect(() => {
    if (!accessToken || (accessToken && !currentRole)) {
      navigate("/login");
    }
  }, [authStatus, currentRole, accessToken, navigate]);

  return (
    <div className="CandidateInfo internal-container" style={{ display: "flex", justifyContent: "center" }}>
      {
        !currentUser ? (
          <Skeleton active />
        ) : (
          <UserInfo
            data={currentUser}
            role={"candidate"}
            color={"#3ee0a5"}
            bgColor={"#f6fffc"}
            justView={false}
          />
        )
      }
    </div>
  );
}
