import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import avatarTemp from "../../../assets/images/avatar-temp.jpg";
import { authActions, authSelectors } from "../../../features/auth/authSlice";

import "./AvatarBox.scss";
const items = [
  {
    label: <Link href="#">Information</Link>,
    key: "0",
  },
  {
    label: <Link href="#">2nd menu item</Link>,
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

export default function AvatarBox() {
  const dispatch = useDispatch();
  const selectAuth = useSelector(authSelectors);
  const islogin = selectAuth.isLogin;
  return (
    <div className="AvatarBox">
      {islogin ? (
        <>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <div className="avatar-img">
              <img src={avatarTemp} alt="" />
            </div>
          </Dropdown>
          {islogin}
        </>
      ) : (
        <Link
          className="avatar-icon"
          onClick={() => dispatch(authActions.setLogin())}
        >
          <Avatar shape="square" icon={<UserOutlined />} />
        </Link>
      )}
    </div>
  );
}
