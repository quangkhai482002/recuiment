import {
  BellFilled,
  DownOutlined,
  LoadingOutlined,
  MessageFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Col, Dropdown, Input, Layout, Row, Typography } from "antd";
import avatar from "assets/images/avatar-temp.jpg";
import { Link } from "react-router-dom";
import "./InternalHeader.scss";

const InternalHeader = ({ role, currentUser, status, handleLogoutClick }) => {
  const items = [
    {
      label: <Link to={`/${role}/info`}>Account</Link>,
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: <Link onClick={handleLogoutClick}>Log out</Link>,
      key: "3",
    },
  ];
  return (
    <Layout.Header className="InternalHeader">
      <Row style={{ width: "100%" }}>
        <Col md={{ span: 24 }} xs={{ span: 0 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            className="input"
          />
        </Col>
      </Row>
      <div className="message-container">
        <div className="icon-container">
          <BellFilled className="icon" />
          <MessageFilled className="icon" />
        </div>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className="avatar-container">
            {status === 200 ? (
              <>
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    overflow: "hidden",
                    borderRadius: "50%",
                  }}
                >
                  <div
                    className="avatar-image"
                    style={{
                      background: `url(${currentUser.linkAvt ? currentUser.linkAvt : "https://sangtao.sawaco.com.vn/wwwimages/Avatar/defaultavatar.png"}) center center/cover`,
                      width: "100%", height: "100%", border: "3px solid #0af", borderRadius: "50%"
                    }}
                  ></div>
                </div>
                <Typography.Text className="username">
                  {currentUser.lastName ? currentUser.lastName : currentUser.firstName ? currentUser.firstName : "Username"}
                </Typography.Text>
                <DownOutlined style={{ fontSize: "0.6rem" }} />
              </>
            ) : status === "pending" ? (
              <LoadingOutlined />
            ) : (
              <Typography.Text >
                ACCESS is<br /> Denied
              </Typography.Text>
            )}
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
};

export default InternalHeader;
