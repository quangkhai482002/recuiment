import {
  ArrowLeftOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Typography, message, Tooltip } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.scss";

const NewPassword = () => {
  const success = () => {
    Modal.success({
      title: "Notification",
      content: "Your password has been reset !!!",
    });
  };

  return (
    <div className="GetPassword">
      <Form
        className="Form"
        autoComplete="off"
        onFinish={(values) => {
          success();
        }}
      >
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

        <Form.Item
          name="code"
          labelAlign="left"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter your code",
            },
          ]}
        >
          <Input
            bordered
            prefix={<SafetyOutlined />}
            size="large"
            placeholder="Enter your code"
          ></Input>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" className="button">
            Submit
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

export default NewPassword;
