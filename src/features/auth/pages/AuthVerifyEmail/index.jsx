import { Button, Form, Modal, Typography } from "antd";
import authApi from "api/authApi";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ActiveEmail.scss";
import FPT_logo from "assets/images/FPT_Software_logo.png";

export default function AuthVerifyEmail() {

  const [loading, setLoading] = useState(false);
  const params = useParams();
  const handleActiveEmailClick = async () => {
    try {
      setLoading(true);
      await authApi.verifyEmail(params.accessToken);
      console.log("success");
      Modal.success({
        title: "Successful",
        content: "Your email was activated successfully",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    } catch (error) {
      console.log("error");

      Modal.error({
        title: "Fail",
        content: "This link was expire",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="ActiveEmail">
      <Form
        className="Form"
        autoComplete="off"
        onFinish={handleActiveEmailClick}
      >
        <Link to={"/"}>
          <div className="goBack">
            <img
                src={FPT_logo}
                alt="Go back"
                height={55}
                width={150}
              />
          </div>
        </Link>
        <Form.Item>
          <Typography.Title level={3} className="header">
            Active Email
          </Typography.Title>
        </Form.Item>

        <Form.Item>
          <Button loading={loading} block type="primary" htmlType="submit" className="button">
            Active
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
