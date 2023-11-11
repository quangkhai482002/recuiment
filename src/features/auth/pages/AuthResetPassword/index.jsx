import {
  ArrowLeftOutlined,
  LoadingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Typography, Spin } from "antd";
import authApi from "api/authApi";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import "./ResetPassword.scss";
import FPT_logo from "assets/images/FPT_Software_logo.png";

const AuthResetPassword = () => {
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "#FFFFFF",
      }}
      spin
    />
  );
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const resetPasswordClick = async (values) => {
    try {
      setLoading(true);
      await authApi.resetPassword({
        token: params.accessToken,
        password: values.password,
      });
      console.log("success");

      Modal.success({
        title: "Success",
        content: "Your password has recovery successfully.",
        onOk() {},
      });
    } catch (error) {
      console.log("falieddd");

      Modal.error({
        title: "Fail",
        content: "Your link was expired",
        onOk() {},
      });
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <div className="ResetPassword">
      <Form className="Form" autoComplete="off" onFinish={resetPasswordClick}>
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
          name="password"
          labelAlign="left"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
            { type: "password" },
          ]}
        >
          <Input.Password
            bordered
            prefix={<LockOutlined />}
            size="large"
            placeholder="Enter your password"
          />
        </Form.Item>
        <Form.Item
          name="confirm-password"
          dependencies={["password"]}
          labelAlign="left"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Confirm password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                return !value || getFieldValue("password") === value
                  ? Promise.resolve()
                  : Promise.reject("The two password is not the same");
              },
            }),
          ]}
        >
          <Input.Password
            bordered
            prefix={<LockOutlined />}
            size="large"
            placeholder="Confirm password"
          />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" className="button">
            {loading && (
              <div className="Loading">{<Spin indicator={antIcon} />}</div>
            )}
            <span>Submit</span>
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

export default AuthResetPassword;
