import {
  ArrowLeftOutlined,
  MailOutlined,
} from "@ant-design/icons";

import { Button, Form, Input, Typography, Modal } from "antd";
import authApi from "api/authApi";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.scss";
import FPT_logo from "assets/images/FPT_Software_logo.png";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const forgotPasswordClick = async (values) => {
    try {
      setLoading(true);
      await authApi.forgotPassword(values.email);
      console.log("succefss");

      Modal.success({
        title: "Success",
        content: "Please check your email.",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    } catch (error) {
      console.log("errot fg");
      Modal.error({
        title: "Fail",
        content: "Your email is not exist. Please check your email.",
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
    <div className="ForgotPassword">
      <Form className="Form" autoComplete="off" onFinish={forgotPasswordClick}>
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
            Recovery Password
          </Typography.Title>
        </Form.Item>

        <Form.Item
          name="email"
          labelAlign="left"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            { type: "email" },
          ]}
        >
          <Input
            bordered
            prefix={<MailOutlined />}
            size="large"
            placeholder="Enter your email"
            style={{ marginRight: "5px" }}
          ></Input>
        </Form.Item>

        <Form.Item>
          <Button loading={loading} block type="primary" htmlType="submit" className="button">
            Send
          </Button>
        </Form.Item>

        <Link to="/login" style={{ marginLeft: "10px" }}>
          <ArrowLeftOutlined />
          <span className="linkSmall" style={{ marginLeft: "3px" }}>
            Back to login
          </span>
        </Link>
      </Form>
    </div>
  );
};

export default ForgotPassword;
