import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, Modal, Space, Typography } from "antd";

import authApi from "api/authApi";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FPT_logo from "assets/images/FPT_Software_logo.png";
import { authActions, authSelectors } from "../../authSlice";
import "./AuthLogin.scss";
const items = [
  {
    key: "1",
    label: "Admin",
  },
  {
    key: "2",
    label: "Interviewer",
  },
  {
    key: "3",
    label: "Recruiter",
  },
  {
    key: "4",
    label: "Candidate",
  },
];

export default function AuthLogin() {
  // Location
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("Candidate");
  const { status } = useSelector(authSelectors);
  const [email, setEmail] = useState();

  const handleOptionSelect = (item) => {
    setSelectedOption(item.label);
  };
  const handleLoginClick = (values) => {
    setEmail(values.email);
    dispatch(authActions.login(values));
  };
  const handleResendActiveClick = useCallback(async () => {
    try {
      await authApi.resendActive(email);

      Modal.success({
        title: "Send successfully",
        content: "Please check your email to active email !!!",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    } catch (error) {
      Modal.error({
        title: "Send fail",
        content: "Please check your email !!!",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    }
  }, [email]);

  // Effect-----------------------
  useEffect(() => {
    const currentRole = localStorage.getItem("currentRole");
    if (currentRole) {
      navigate(`/${currentRole === "candidate" ? "" : currentRole}`);
      return;
    }

    if (location.state) {
      let urlToLoad = "";
      let i = 3;
      const dataUrl = location.state.urlToLoad.split("/");
      while (i < dataUrl.length) {
        urlToLoad += `${dataUrl[i]}`;
        if (i !== dataUrl.length - 1) {
          urlToLoad += "/";
        }
        i++;
      }
      localStorage.setItem("urlToLoad", urlToLoad);
    }
    if (status === 200) {
      if (selectedOption === "Admin") {
        navigate("/admin");
      } else if (selectedOption === "Candidate") {
        const urlToLoad = localStorage.getItem("urlToLoad");
        if (urlToLoad) {
          localStorage.removeItem("urlToLoad");
          navigate(`/${urlToLoad}`);
        } else {
          navigate(`/`);
        }
      } else if (selectedOption === "Interviewer") {
        navigate("/interviewer");
      } else if (selectedOption === "Recruiter") {
        navigate("/recruiter");
      }
    } else if (status === 400) {
      dispatch(authActions.logout());

      Modal.confirm({
        title: "Email not active",
        content:
          "Your email is not active. Do you want to resend the verification email?",
        onOk() {
          handleResendActiveClick();
        },
        onCancel() {},
      });
    } else if (status === 401) {
      dispatch(authActions.logout());

      Modal.error({
        title: "Password incorrect",
        content: "Your password is incorrect.",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    } else if (status === 404) {
      dispatch(authActions.logout());

      Modal.error({
        title: "Email incorrect",
        content: "Your email is incorrect.",
        onOk() {},
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    }
  }, [
    dispatch,
    handleResendActiveClick,
    location,
    location.state,
    navigate,
    selectedOption,
    status,
  ]);

  // Return--------------------------------------------
  return (
    <div className="AuthLogin">
      <Form className="form" onFinish={handleLoginClick}>
        <Link to={"/"}>
          <div className="goBack">
            <img src={FPT_logo} alt="Go back" height={55} width={150} />
          </div>
        </Link>
        <Typography.Text level={1} className="header">
          Welcome, <span>{selectedOption}</span>!
        </Typography.Text>
        <Form.Item
          hasFeedback
          name="email"
          style={{ marginTop: "20px" }}
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            { type: "email" },
          ]}
        >
          <Input required bordered className="input" placeholder="Email" />
        </Form.Item>
        <Form.Item
          hasFeedback
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
        >
          <Input.Password
            required
            bordered
            className="input"
            placeholder="Password"
          />
        </Form.Item>
        <Link to="/forgot-password">
          <Typography.Text className="link">
            Forgot your password?
          </Typography.Text>
        </Link>
        <Form.Item style={{ marginTop: "20px" }}>
          <Button
            loading={status === "pending"}
            block
            type="primary"
            htmlType="submit"
            className="button"
          >
            Log in
          </Button>
        </Form.Item>
        {selectedOption === "Candidate" && (
          <Link to="/signup" className="link">
            <span className="linkSmall">Don't have an account? </span>
            Sign up
          </Link>
        )}
      </Form>
      <div className="option">
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: ["4"],
            onClick: ({ key }) => {
              const selectedItem = items.find((item) => item.key === key);
              handleOptionSelect(selectedItem);
            },
          }}
        >
          <Typography.Link>
            <Space>
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      </div>
    </div>
  );
}
