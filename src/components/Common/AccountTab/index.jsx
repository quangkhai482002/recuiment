import {
  CheckCircleOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  FileOutlined,
  Loading3QuartersOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import Meta from "antd/es/card/Meta";
import adminApi from "api/adminApi";
import CustomTable from "components/Common/CustomTable";
import { adminActions, adminSelectors } from "features/admin/adminSlice";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const { RangePicker } = DatePicker;

const AccountTab = ({ role }) => {
  const [messageApi, contextHolder] = message.useMessage();

  // Get data api
  const { currentAccounts } = useSelector(adminSelectors);
  const dispatch = useDispatch();

  const [accounts, setAccounts] = useState([]);
  const [candidateAccounts, setCandidateAccounts] = useState([]);
  const [isCandidateInfoFetched, setIsCandidateInfoFetched] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState([]);

  const [isAdding, setIsAdding] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);

  const [isAddingToBlacklist, setIsAddingToBlacklist] = useState(0);
  const [addBlacklistLoading, setAddBlacklistLoading] = useState(false);
  const [blacklistLoading, setBlacklistLoading] = useState(false);
  const [blacklistHistory, setBlacklistHistory] = useState(0);
  const [formBlacklist, setFormBlacklist] = useState([]);

  // useEffect to fetch all accounts
  useEffect(() => {
    if (isLoading) {
      if (!currentAccounts.status) {
        dispatch(adminActions.getAccounts({ page: 1, limit: 200 }));
      }
      if (currentAccounts.status === "200") {
        const updatedData = currentAccounts.data.map((item) => ({
          ...item,
          name: item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : "",
        }));
        setAccounts(updatedData);
        setIsLoading(false);
      } else if (currentAccounts.status === "403") {
        setIsLoading(false);
        messageApi.open({
          type: "error",
          content: "Refresh the page, there seems to be something wrong",
        });
      }
    }
  }, [currentAccounts, currentAccounts.status, dispatch, isLoading, messageApi]);

  // useEffect to get full candidate info
  useEffect(() => {
    const getCandidateInfo = async () => {
      try {
        const candidateAccounts = accounts.filter((item) => item.role.name === "CANDIDATE");
        const response = await adminApi.getCandidateInfo();
        const accountByEmail = {};
        for (const item of response) {
          const { email } = item;
          if (!accountByEmail[email]) {
            accountByEmail[email] = { ...item, candidateId: item.id };
          } else {
            accountByEmail[email] = {
              ...accountByEmail[email],
              ...item,
              candidateId: item.id,
              blacklists: [...accountByEmail[email].blacklists, ...item.blacklists],
            };
          }
        }
        for (const item of candidateAccounts) {
          const { email } = item;
          if (!accountByEmail[email]) {
            accountByEmail[email] = { ...item };
          } else {
            accountByEmail[email] = {
              ...accountByEmail[email],
              ...item,
            };
          }
        }
        const formatCandidate = Object.values(accountByEmail).map((item) => {
          const { blacklists } = item;
          const inBlacklist =
            Array.isArray(blacklists) &&
            blacklists.length > 0 &&
            blacklists.some(
              (blacklist) =>
                new Date(blacklist.startDate) <= new Date() &&
                (!blacklist.endDate || new Date(blacklist.endDate) >= new Date())
            );

          return {
            id: item.id,
            email: item.email,
            role: { id: item.role ? item.role.id : 4, name: "CANDIDATE" },
            firstName: item.firstName,
            lastName: item.lastName,
            isActive: item.isActive,
            name: item.name,
            candidateId: item.candidateId,
            linkAvt: item.linkAvt,
            phone: item.phoneNumber,
            birthday: item.birthday,
            inBlacklist: inBlacklist,
            blacklistHistory: item.blacklists,
          };
        });
        setCandidateAccounts(formatCandidate);
        setIsCandidateInfoFetched(false);
      } catch (error) {
        console.log("failed", error);
        setIsCandidateInfoFetched(false);
      }
    };
    if (isCandidateInfoFetched && accounts.length !== 0 && role === "Candidate") {
      getCandidateInfo();
    }
  }, [accounts, isCandidateInfoFetched, role]);

  // useEffect to get Blacklist
  useEffect(() => {
    const fetchBlacklist = async () => {
      try {
        const params = { candidateId: isAddingToBlacklist };
        const response = await adminApi.getBlacklistById(params);
        setBlacklistLoading(false);
        setBlacklistHistory(response);
      } catch (error) {
        setBlacklistHistory(0);
      }
    };
    if (blacklistLoading) {
      fetchBlacklist();
    }
  }, [blacklistLoading, blacklistHistory, isAddingToBlacklist]);

  // add fake account
  const handleAddAccount = useCallback(
    (newAccount) => {
      newAccount["id"] = Math.max(...accounts.map((item) => item.id)) + 1;
      newAccount["role"] = {
        id: role === "Recruiter" ? 2 : 3,
        name: role.toUpperCase(),
      };
      setAccounts([...accounts, newAccount]);
    },
    [accounts, role]
  );

  // useEffect to add new recruiter or interviewer account
  useEffect(() => {
    const AddNewAccount = async () => {
      if (formData.length === 0) return;

      try {
        if (role === "Recruiter") {
          await adminApi.registerRecruiter(formData);
        } else {
          await adminApi.registerInterviewer(formData);
        }

        setIsAddLoading(false);
        setIsAdding(false);

        messageApi.open({
          type: "success",
          content: "Account addition successfully!",
          duration: 3,
        });

        handleAddAccount(formData);
      } catch (error) {
        setIsAddLoading(false);
        setIsAdding(false);

        if (error.response && error.response.status === 400) {
          messageApi.open({
            type: "error",
            content: "Email is invalid!",
            duration: 3,
          });
        } else if (error.response && error.response.status === 409) {
          messageApi.open({
            type: "error",
            content: "Email is already existed",
            duration: 3,
          });
        }
      }
    };

    if (isAddLoading) {
      AddNewAccount();
    }
  }, [formData, handleAddAccount, isAddLoading, messageApi, role]);

  // useEffect to add blacklist a candidate
  useEffect(() => {
    const AddBlacklist = async () => {
      if (formBlacklist.length === 0) return;
      try {
        console.log(formBlacklist);
        await adminApi.addToBlackList(formBlacklist);
        setAddBlacklistLoading(false);
        setIsAddingToBlacklist(0);
        setIsCandidateInfoFetched(true);
        messageApi.open({
          type: "success",
          content: "Success!",
          duration: 3,
        });
      } catch (error) {
        setAddBlacklistLoading(false);
        setIsAddingToBlacklist(0);
        console.log(error);
      }
    };
    if (addBlacklistLoading) {
      AddBlacklist();
    }
  }, [formBlacklist, addBlacklistLoading, messageApi]);

  // column
  const column = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "15%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      isSearchByValue: true,
      width: "25%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      isSearchByValue: true,
      width: "25%",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Inactive",
          value: false,
        },
      ],
      width: "15%",
      onFilter: (value, record) => record.isActive === value,
      render: (value, record) =>
        value ? (
          <Tag icon={<CheckCircleOutlined />} color={"#7abb5e"}>
            Active
          </Tag>
        ) : (
          <Tag icon={<ExclamationCircleFilled />} color={"#cd201f"}>
            Inactive
          </Tag>
        ),
    },
    {
      title: "In Blacklist",
      dataIndex: "inBlacklist",
      key: "inBlacklist",
      filters: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      width: "10%",
      onFilter: (value, record) => record.inBlacklist === value,
      render: (value, record) =>
        !value ? (
          <Tag icon={<CheckCircleOutlined />} color={"#7abb5e"}>
            No
          </Tag>
        ) : (
          <Tag icon={<ExclamationCircleFilled />} color={"#cd201f"}>
            Yes
          </Tag>
        ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: role === "Candidate" ? "10%" : "20%",
      render: (value, record) => {
        let buttonContent;
        switch (role) {
          case "Recruiter":
            buttonContent = "View Recruiter's Information";
            break;
          case "Interviewer":
            buttonContent = "View Interviewer's Information";
            break;
          case "Candidate":
            buttonContent = "View Candidate's Information";
            break;
          default:
            buttonContent = "Unknown";
            break;
        }

        return (
          <Space>
            {/* <Tooltip title="Disable" placement="top">
              <Button type="primary" size="small" onClick={showConfirm} icon={<CloseCircleOutlined />} danger></Button>
            </Tooltip> */}
            <Tooltip title={buttonContent} placement="top">
              <Link to={`${record.id}&=${record.email}`} target="_blank">
                <Button type="primary" size="small" icon={<EyeOutlined />}></Button>
              </Link>
            </Tooltip>
            {role === "Candidate" && (
              <Tooltip title="Add Blacklist" placement="top">
                <Button
                  type="primary"
                  icon={<ExclamationCircleFilled />}
                  size="small"
                  danger
                  onClick={() => {
                    setIsAddingToBlacklist(record.candidateId);
                    setBlacklistHistory(record.blacklistHistory.length);
                    if (record.blacklistHistory.length !== 0) {
                      setBlacklistLoading(true);
                    }
                  }}
                ></Button>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  const formItemLayoutAccount = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };
  const formItemLayoutBlacklist = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };
  // add account form
  const AddAccount = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
      setIsAddLoading(true);
      setFormData(values);
    };

    return (
      <Form
        {...formItemLayoutAccount}
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        disabled={isAddLoading}
        style={{ maxWidth: "600px" }}
      >
        <Form.Item
          hasFeedback
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
            },
            {
              required: true,
              message: "Please input your E-mail",
            },
          ]}
        >
          <Input placeholder={isAddLoading ? formData.email : "Enter your email"} autoComplete="off" />
        </Form.Item>

        <Form.Item
          hasFeedback
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
        >
          <Input.Password
            placeholder={isAddLoading ? "•".repeat(formData.password.length) : "Enter your password"}
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          hasFeedback
          name="confirm_password"
          label="Confirm password"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please input your Confirm password",
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
            placeholder={isAddLoading ? "•".repeat(formData.confirm_password.length) : "Confirm your password"}
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item wrapperCol={!isAddLoading ? { span: 4, offset: 20 } : { span: 5, offset: 19 }}>
          <Button loading={isAddLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  // add to blacklist form
  const AddToBlacklist = ({ user, history }) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
      setAddBlacklistLoading(true);
      const blacklist = {
        startDate: values.time[0],
        endDate: values.time[1],
        reason: values.reason,
        candidateId: user["candidateId"],
      };
      setFormBlacklist(blacklist);
    };
    return (
      <Card bodyStyle={!user["inBlacklist"] ? { height: "628px", overflow: "auto" } : { height: "340px", overflow: "auto" }}>
        <Meta
          avatar={<Avatar size={112} src={user["linkAvt"]} />}
          title={user["name"] ? user["name"] : "•••"}
          description={
            <>
              <span>{user["email"]}</span>
              <br />
              <span>Age: {new Date().getFullYear() - new Date(user["birthday"]).getFullYear()}</span>
              <br />
              <span>Phone: {user["phone"]}</span>
            </>
          }
        />
        <Divider orientation="left" orientationMargin="0">
          Blacklist History
        </Divider>
        <Card bordered={false}>
          {history.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={history}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: "#20252a", color: "whitesmoke" }}>{index + 1}</Avatar>}
                    title={
                      <>
                        <span>Start date: {item.startDate}</span>
                        <span> End date: {item.endDate}</span>
                      </>
                    }
                    description={`Reason: ${item.reason}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: "center", paddingTop: "12px" }}>
              <Typography.Title type="secondary">
                {blacklistLoading ? <Loading3QuartersOutlined spin /> : <FileOutlined />}
              </Typography.Title>
              <Typography.Text type="secondary">{blacklistLoading ? "Loading..." : "No history"}</Typography.Text>
            </div>
          )}
        </Card>
        {!user["inBlacklist"] ? (
          <>
            <Divider orientation="left" orientationMargin="0">
              {"Add to Blacklist"}
            </Divider>
            <Card bordered={false}>
              <Form {...formItemLayoutBlacklist} onFinish={onFinish} form={form}>
                <Form.Item
                  hasFeedback
                  label="Time"
                  name="time"
                  disabled={addBlacklistLoading}
                  rules={[
                    { required: true, message: "Please input your Time" },
                    () => ({
                      validator(_, value) {
                        if (value && value.length === 2) {
                          const [startDate, endDate] = value;
                          const now = moment();

                          if (startDate.isAfter(now)) {
                            return Promise.reject("Start date must be in the past");
                          }

                          if (endDate.isBefore(now)) {
                            return Promise.reject("End date must be in the future");
                          }
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <RangePicker
                    placeholder={
                      addBlacklistLoading
                        ? [
                            moment(formBlacklist.startDate).format("YYYY-MM-DD"),
                            moment(formBlacklist.endDate).format("YYYY-MM-DD"),
                          ]
                        : ["Start date", "End date"]
                    }
                  />
                </Form.Item>

                <Form.Item
                  hasFeedback
                  label="Reason"
                  name="reason"
                  rules={[{ required: true, message: "Please input your Reason" }]}
                >
                  <Input.TextArea rows={4} placeholder={addBlacklistLoading ? formBlacklist.reason : "Enter reason"} />
                </Form.Item>
                <Form.Item
                  wrapperCol={!addBlacklistLoading ? { span: 6, offset: 17 } : { span: 6, offset: 16 }}
                  style={{ margin: 0 }}
                >
                  <Button loading={addBlacklistLoading} type="primary" htmlType="submit">
                    Add to Blacklist
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </>
        ) : null}
      </Card>
    );
  };

  const handleCancel = () => {
    setIsAddingToBlacklist(0);
  };

  // const showConfirm = () => {
  //   Modal.confirm({
  //     title: "Do you want to disable this user?",
  //     className: "ConfirmModal",
  //     content: "This user's account will be disabled temporarily",
  //     centered: true,
  //     onOk() {
  //       console.log("OK");
  //     },
  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //   });
  // };

  return (
    <div className="AccountTab">
      {contextHolder}
      {role === "Candidate" ? (
        <div style={{ marginTop: "2.625rem" }}></div>
      ) : (
        <Row justify="end">
          <Button icon={<UserAddOutlined />} style={{ marginBottom: 10 }} onClick={() => setIsAdding(true)}>
            Add user
          </Button>
        </Row>
      )}
      <CustomTable
        columns={role === "Candidate" ? column : column.filter((column) => column.dataIndex !== "inBlacklist")}
        data={
          role === "Candidate"
            ? candidateAccounts.reverse()
            : accounts.filter((item) => item.role.name === role.toUpperCase()).reverse()
        }
        isLoading={role === "Candidate" ? isCandidateInfoFetched : isLoading}
      />
      <Modal
        title={`Add new ${role} account`}
        open={isAdding}
        onOk={() => setIsAdding(true)}
        onCancel={() => setIsAdding(false)}
        className="AddAccountModal"
        footer={[]}
      >
        <AddAccount />
      </Modal>
      <Modal
        open={isAddingToBlacklist}
        title="Add to Blacklist"
        onCancel={handleCancel}
        className="AddBlacklistModal"
        footer={[]}
      >
        <AddToBlacklist
          user={candidateAccounts.find((item) => item.candidateId === isAddingToBlacklist)}
          history={blacklistHistory}
        />
      </Modal>
    </div>
  );
};

export default AccountTab;
