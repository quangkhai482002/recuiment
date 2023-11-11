import { authSelectors } from "features/auth/authSlice";
import { useSelector } from "react-redux";
import UserInfo from "../../../../components/Common/UserInfo/UserInfo";
import "./RecruiterInfo.scss";
import { Skeleton } from "antd";

export default function RecruiterInfo() {
  const { currentUser } = useSelector(authSelectors);

  return (
    <div className="RecruiterInfo internal-container">
      {
        !currentUser ? (
          <Skeleton active />
        ) : (
          <UserInfo
            data={currentUser}
            color={"#e0c93e"}
            bgColor={"#fffff6"}
            role={"recruiter"}
            justView={false}
          />
        )
      }
    </div>
  );
}
