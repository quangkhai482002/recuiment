import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./MyFooter.scss";

const { Title, Text } = Typography;
export default function MyFooter(props) {
  const { role } = props;

  return (
    <div className="MyFooter container">
      <Row>
        <Col xs={0} md={18}>
          <Space size={80} wrap={true} className="content">
            <Link to={"about-us"}>
              <Title disabled className="title">
                About Us
              </Title>
            </Link>
            <Title disabled className="title">
              Feedback
            </Title>
            <Link to={"signup"}>
              <Title disabled className="title">
                Sign Up
              </Title>
            </Link>
            <Title disabled className="title">
              Contact
            </Title>
          </Space>
        </Col>

        <Col xs={24} md={6}>
          <Space size={"large"} className="sider">
            <FontAwesomeIcon
              size="xl"
              icon="fa-brands fa-facebook"
              className="icon"
            />
            <FontAwesomeIcon
              size="xl"
              icon="fa-brands fa-instagram"
              className="icon"
            />
            <FontAwesomeIcon
              size="xl"
              icon="fa-brands fa-youtube"
              className="icon"
            />
            <FontAwesomeIcon
              size="xl"
              icon="fa-brands fa-twitter"
              className="icon"
            />
          </Space>
        </Col>
      </Row>

      <Row className="footer">
        <FontAwesomeIcon
          icon="fa-solid fa-location-dot"
          className="icon"
          style={{ marginRight: "0.5rem", cursor: "unset" }}
        />
        <Text
          strong
          disabled
          className="text"
          style={{ marginRight: "0.5rem", cursor: "unset" }}
        >
          Vietnam
        </Text>
        <Text
          disabled
          style={{ color: "#7e7e7e", fontSize: "0.6rem", cursor: "unset" }}
        >
          2023 Company, Inc. All Rights Reserved
        </Text>
      </Row>
    </div>
  );
}
