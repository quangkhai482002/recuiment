import {
  CheckOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tag,
  Tooltip,
  message,
} from "antd";
import authApi from "api/authApi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCallback, useEffect, useState } from "react";
import AvatarUpload from "../AvatarUpload";
import CustomCardInput from "./CustomCardInput";
import CustomCardSelect from "./CustomCardSelect";
import "./UserInfo.scss";
import { dataCountry } from "./data";
import { useDispatch } from "react-redux";
import { authActions } from "features/auth/authSlice";

dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

export default function UserInfo({ data, color, bgColor, role, justView }) {
  // State
  const [infoData, setInfoData] = useState({ ...data });
  const [src] = useState(infoData.linkAvt);
  const [disabled, setDisabled] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataCity, setDataCity] = useState([]);
  const [form] = Form.useForm();
  const [disabledPassword, setDisabledPassword] = useState(true);

  // Dispatch
  const dispatch = useDispatch();

  // Message
  const [messageApi, contextMessage] = message.useMessage();
  const messageError = useCallback(() => {
    messageApi.open({
      type: "error",
      content: "Failed!",
      duration: 2,
    });
  }, [messageApi]);
  const messageLoading = useCallback(() => {
    messageApi.open({
      type: "loading",
      content: "Loading!",
      duration: 0,
    });
  }, [messageApi]);

  const messageSuccess = useCallback(() => {
    messageApi.open({
      type: "success",
      content: "Success!",
      duration: 3,
    });
  }, [messageApi]);

  // Modal
  const [modal, contextHolder] = Modal.useModal();

  // Async function
  const toggle = useCallback(() => {
    setDisabled(!disabled);
    setIsEdit(!isEdit);
  }, [disabled, isEdit]);

  const handleUpdate = useCallback(
    async (responseData) => {
      messageLoading();
      await authApi
        .updateInfo(role, responseData)
        .then((response) => {
          messageApi.destroy();
          messageSuccess();
          setInfoData(response);
          dispatch(authActions.setInfo(response));
          // console.log(response);
        })
        .catch((err) => {
          messageApi.destroy();
          messageError();
          console.log(err);
        });
    },
    [messageLoading, role, messageApi, messageSuccess, messageError, dispatch]
  );

  const confirm = useCallback(() => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Do you really want to save your change?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        toggle();
        const requestData = { ...infoData };
        requestData.phoneNumber = document.getElementById("info-phone").value;
        if (requestData.address) {
          requestData.address = {
            id: requestData.address.id ? requestData.address.id : 0,
            country: requestData.address.country ? requestData.address.country : null,
            city: requestData.address.city ? requestData.address.city : null,
            street: document.getElementById("info-street").value,
          };
        } else {
          requestData.address = {
            id: 0,
            country: null,
            city: null,
            street: document.getElementById("info-street").value,
          };
        }
        setInfoData(requestData);
        handleUpdate(requestData);
      },
    });
  }, [handleUpdate, infoData, modal, toggle]);

  // Function
  const formatDate = useCallback(({ date, month, year }) => {
    if (date < 10) {
      date = "0" + date;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    return `${year}-${month}-${date}`;
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = useCallback(
    (type) => {
      if (type === "Password") {
        setIsModalOpen(false);
      } else if (type === "Info") {
        const newData = { ...data };
        setInfoData(newData);
        toggle();
      }
    },
    [data, toggle]
  );

  const handleSave = () => {
    confirm();
  };

  const handleChangeCountry = useCallback(
    (value) => {
      const data = { ...infoData };
      data.address = {
        id: data.address ? data.address.id ? data.address.id : 0 : 0,
        country: value,
        city: null,
        street: data.address ? data.address.street ? data.address.street : "" : "",
      };
      setInfoData(data);
      const index = dataCountry.findIndex((object) => {
        return object.value === value;
      });
      setDataCity(dataCountry[index].city);
      document
        .getElementsByClassName("option-city")[0]
        .querySelectorAll("span")[1].innerHTML = "---------";
    },
    [infoData]
  );

  const handleChangeCity = useCallback(
    (value) => {
      const data = { ...infoData };
      data.address = {
        id: data.address.id,
        country: data.address.country,
        city: value,
        street: data.address.street,
      };
      setInfoData(data);
    },
    [infoData]
  );

  const handleChangeDate = useCallback(
    (date) => {
      const data = { ...infoData };
      data.birthday = formatDate({
        date: date.$d.getDate(),
        month: date.$d.getMonth() + 1,
        year: date.$d.getFullYear(),
      });
      return setInfoData(data);
    },
    [formatDate, infoData]
  );

  const handleChangePassword = useCallback(async () => {
    messageLoading();
    await authApi.changePassword({
      role: role,
      password: document.getElementById('new-password').value
    }).then(res => {
      messageApi.destroy();
      messageSuccess();
    }).catch(err => {
      messageApi.destroy();
      messageError();
      console.log(err);
    });
    // console.log(document.getElementById("new-password").value);
    setIsModalOpen(false);
  }, [messageApi, messageError, messageLoading, messageSuccess, role]);

  useEffect(() => {
    if (dataCountry) {
      const index = dataCountry.findIndex((object) => {
        return (
          object.value ===
          document
            .getElementsByClassName("option-country")[0]
            .querySelectorAll("span")[1].innerHTML
        );
      });
      if (index >= 0 && index < dataCountry.length) {
        setDataCity(dataCountry[index].city);
      }
    }

    return () => { };
  }, [infoData]);

  return (
    <div className="UserInfo">
      {contextHolder}
      {contextMessage}
      <Row className="avatar-wrapper">
        <Col
          flex={"auto"}
          style={{ textAlign: "center", display: "flex", alignItems: "center" }}
        >
          <AvatarUpload src={src} data={infoData} role={role} justView={justView} />
          <div className="main-info-wrapper">
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: "30px",
              }}
            >
              {infoData.firstName
                ? infoData.lastName
                  ? infoData.firstName + " " + infoData.lastName
                  : infoData.firstName
                : infoData.lastName
                  ? infoData.lastName
                  : "Username"}
            </p>
            {!justView && (
              <>
                <Button type="link" style={{ padding: 0 }} onClick={showModal}>
                  Change password
                </Button>
                <Modal
                  title="Change password"
                  open={isModalOpen}
                  onOk={handleChangePassword}
                  onCancel={() => {
                    return handleCancel("Password");
                  }}
                  okButtonProps={{
                    disabled: disabledPassword,
                    display: null,
                  }}
                >
                  <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    style={{
                      marginTop: "20px",
                      marginBottom: "30px",
                    }}
                    scrollToFirstError
                  >
                    <Form.Item
                      name="password"
                      label="New password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      name="confirm"
                      label="Confirm password"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              setDisabledPassword(false);
                              return Promise.resolve();
                            }
                            setDisabledPassword(true);
                            return Promise.reject(
                              new Error(
                                "The new password that you entered do not match!"
                              )
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password id="new-password" />
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            )}
            <div>
              <Tag
                id="user-role-mobile"
                style={{
                  borderColor: color,
                  backgroundColor: bgColor,
                  color: color,
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  marginTop: "10px"
                }}
              >
                {role}
              </Tag>
            </div>
          </div>
        </Col>
        <Col flex={"200px"}>
          <Tooltip title="This is your role">
            <Card
              id="user-role-pc"
              size="small"
              style={{
                borderColor: color,
                backgroundColor: bgColor,
                color: color,
              }}
            >
              {role}
            </Card>
          </Tooltip>
        </Col>
      </Row>
      <div className="info-content">
        <Card
          title={"Account Information"}
          style={{ border: "none" }}
          headStyle={{
            border: "none",
            height: "30px",
            textTransform: "uppercase",
          }}
          bodyStyle={{ paddingTop: 0, paddingBottom: "12px" }}
        >
          <Row>
            <Col span={12}>
              <CustomCardInput
                title={"First name"}
                disabled={disabled}
                func={(e) => {
                  const data = { ...infoData };
                  data.firstName = e.target.value;
                  return setInfoData(data);
                }}
                value={infoData.firstName ? infoData.firstName : ""}
                id={"info-firstName"}
              />
              <Card
                title={"Birth day"}
                style={{ border: "none", fontSize: "1rem" }}
                headStyle={{
                  border: "none",
                  padding: 0,
                  fontSize: "1rem",
                  color: "#a3a3a3",
                  fontWeight: "bold",
                }}
                bodyStyle={{ padding: 0, width: "100%" }}
                size="small"
              >
                <DatePicker
                  defaultValue={
                    infoData.birthday
                      ? dayjs(infoData.birthday, "YYYY-MM-DD")
                      : ""
                  }
                  disabled={disabled}
                  placeholder="Select your birth date"
                  suffixIcon={""}
                  onChange={handleChangeDate}
                  format={dateFormat}
                  style={{ width: "90%", border: "none", padding: 0 }}
                />
              </Card>
              <CustomCardInput
                title={"Email"}
                disabled={true}
                func={(e) => {
                  return;
                }}
                value={infoData.email}
                style={{ backgroundColor: "white", color: "#696969" }}
                id={"info-email"}
              />
            </Col>
            <Col span={12}>
              <CustomCardInput
                title={"Last name"}
                disabled={disabled}
                func={(e) => {
                  const data = { ...infoData };
                  data.lastName = e.target.value;
                  return setInfoData(data);
                }}
                value={infoData.lastName ? infoData.lastName : ""}
              />
              <CustomCardSelect
                title={"Gender"}
                defaultValue={
                  infoData.sex
                    ? infoData.sex === 1
                      ? "Male"
                      : "Female"
                    : "Female"
                }
                func={(e) => {
                  const data = { ...infoData };
                  if (e === "Male") {
                    data.sex = 1;
                  } else if (e === "Female") {
                    data.sex = 0;
                  }
                  return setInfoData(data);
                }}
                optionData={[
                  { value: "Male", text: "Male" },
                  { value: "Female", text: "Female" },
                ]}
                disabled={disabled}
              />
              <CustomCardInput
                title={"Phone"}
                disabled={disabled}
                func={(e) => {
                  return;
                }}
                value={infoData.phoneNumber ? infoData.phoneNumber : ""}
                id={"info-phone"}
              />
            </Col>
          </Row>
          {!justView && !isEdit && (
            <Space className="btn-edit-wrapper">
              <Tooltip title={"Edit"}>
                <Button
                  type="primary"
                  onClick={toggle}
                  style={{ width: "40px", textAlign: "center", padding: 0 }}
                >
                  <EditOutlined />
                </Button>
              </Tooltip>
            </Space>
          )}
          {!justView && isEdit && (
            <Space className="btn-edit-wrapper">
              <Tooltip title={"Save"}>
                <Button
                  onClick={handleSave}
                  style={{
                    width: "40px",
                    textAlign: "center",
                    padding: 0,
                    backgroundColor: "#16ff33",
                    color: "white",
                  }}
                >
                  <CheckOutlined />
                </Button>
              </Tooltip>
              <Tooltip title={"Cancel"}>
                <Button
                  onClick={() => {
                    return handleCancel("Info");
                  }}
                  style={{
                    width: "40px",
                    textAlign: "center",
                    padding: 0,
                    backgroundColor: "#ff1616",
                    color: "white",
                  }}
                >
                  <ReloadOutlined />
                </Button>
              </Tooltip>
            </Space>
          )}
        </Card>
        <Card
          title={"Contact information"}
          style={{ border: "none" }}
          headStyle={{
            border: "none",
            height: "30px",
            textTransform: "uppercase",
          }}
          bodyStyle={{ paddingTop: 0, paddingBottom: "12px" }}
        >
          <Row>
            <Col span={12}>
              <CustomCardSelect
                title={"Country"}
                defaultValue={
                  infoData.address ? infoData.address.country ? infoData.address.country : null : null
                }
                func={(value) => {
                  return handleChangeCountry(value);
                }}
                optionData={dataCountry}
                disabled={disabled}
                className={"option-country"}
              />
            </Col>
            <Col span={12}>
              <CustomCardSelect
                title={"Province/city"}
                defaultValue={
                  infoData.address
                    ? infoData.address.country
                      ? infoData.address.city ? infoData.address.city : '---------'
                      : null
                    : null
                }
                func={(value) => {
                  return handleChangeCity(value);
                }}
                optionData={dataCity}
                disabled={disabled}
                className={"option-city"}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card
                title={"Address"}
                style={{ border: "none", fontSize: "1rem" }}
                headStyle={{
                  border: "none",
                  padding: 0,
                  fontSize: "1rem",
                  color: "#a3a3a3",
                  fontWeight: "bold",
                }}
                bodyStyle={{ padding: 0, width: "100%" }}
                size="small"
              >
                {disabled && (
                  <TextArea
                    placeholder="Type your address"
                    autoSize={{
                      minRows: 2,
                      maxRows: 6,
                    }}
                    style={{ fontSize: "1rem", width: "95%" }}
                    disabled={disabled}
                    value={infoData.address ? infoData.address.street : ""}
                  />
                )}
                {!disabled && (
                  <TextArea
                    placeholder="Type your address"
                    autoSize={{
                      minRows: 2,
                      maxRows: 6,
                    }}
                    style={{ fontSize: "1rem", width: "95%" }}
                    disabled={disabled}
                    defaultValue={
                      infoData.address ? infoData.address.street : ""
                    }
                    id="info-street"
                  />
                )}
                <div
                  style={{
                    margin: "24px 0",
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
