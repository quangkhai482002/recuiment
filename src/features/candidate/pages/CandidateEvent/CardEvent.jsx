import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, Image } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";

import "./CardEvent.scss";

const CardEvent = ({ eventData }) => {
  return (
    <Card
      style={{
        minHeight: "173px",
        width: "100%",
        backgroundColor: "white",
        border: "1px solid #e8e8e8",
      }}
      type="inner"
      title={
        <Link
          to={`${eventData.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="name-event"
        >
          {eventData.name ? eventData.name : "Sự kiện"}
        </Link>
      }
      extra={
        <Link
          to={`${eventData.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "" }}
        >
          <p className="detail-hidden">Chi tiết sự kiện </p>
          <i className="icon-hidden">
            <DoubleRightOutlined />
          </i>
        </Link>
      }
    >
      <div className="event-card-content">
        <Image
          preview={false}
          src="https://danhbaict.vn/uploads/business/logo/business1618470595-FPT%20Software%20V@4x.png"
          alt="Event Logo"
          className="event-card-logo"
        />
        <div>
          <p className="event-card-description">
            {eventData.description ? eventData.description : "Nội dung"}
          </p>
        </div>
      </div>
    </Card>
  );
};

CardEvent.propTypes = {
  eventData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default CardEvent;
