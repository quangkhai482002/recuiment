import {
  Button,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
  Spin,
  message,
  Popconfirm,
  Row,
  Col,
  Divider,
  Modal,
} from "antd";
import {
  EyeOutlined,
  CalendarOutlined,
  CalculatorOutlined,
  DeleteTwoTone,
  QuestionCircleOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./RecruiterPositionDetail.scss";
import InterviewForm from "./InterviewForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import recruiterApi from "api/recruiterApi";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { recruiterActions } from "features/recruiter/recruiterSlice";
import { isInBlackList } from "utils";

export default function RecruiterPositionDetail() {
  const dispatch = useDispatch();
  const { positionID } = useParams();
  const userID = useSelector((state) => state.auth.currentUser.id);
  const { Text } = Typography;
  const navigate = useNavigate();
  const notification = useSelector((state) => state.recruiter.notification);
  const loading = useSelector((state) => state.recruiter.loading);
  const [loadingData, setLoadingData] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [backLoading, setBackLoading] = useState(false);
  const [data, setData] = useState({
    data: null,
    interviewers: [],
  });
  const [candidates, setCandidates] = useState(null);
  const [openForm, setOpenForm] = useState({
    id: 0,
    open: false,
    type: "create",
    interviewDetail: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await recruiterApi.getPositionById(positionID);
        const interviewers = await recruiterApi.getInterviewers();
        setData({
          data: data,
          interviewers: interviewers,
        });
      } catch (error) {
        window.alert("Vacancy not found");
        navigate("/recruiter");
      }
    };
    fetchData();
  }, [positionID, navigate]);

  useEffect(() => {
    if (notification.type)
      messageApi.open({
        type: notification.type,
        content: notification.message,
        onClose: () => dispatch(recruiterActions.resetNotification()),
      });
  }, [notification, messageApi, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      return await recruiterApi.getApplications(positionID);
    };
    fetchData()
      .then((res) => {
        setCandidates(
          res.filter(
            (candidate) => !isInBlackList(candidate.candidate.blacklists)
          )
        );
        setLoadingData(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setCandidates([]);
        } else {
          message.error("Something went wrong");
        }
        setLoadingData(false);
      });
  }, [positionID, loading]);

  const applications =
    candidates &&
    (candidates.length > 0
      ? candidates.filter((candidate) => {
          return candidate.interview === null;
        })
      : []);
  const listWaitingInterviews =
    candidates &&
    (candidates.length > 0
      ? candidates.filter((candidate) => {
          return (
            candidate.interview !== null &&
            candidate.interview.status === "PENDING"
          );
        })
      : []);

  const listCompletedInterviews =
    candidates &&
    (candidates.length > 0
      ? candidates.filter((candidate) => {
          return (
            candidate.interview !== null &&
            candidate.interview.status !== "PENDING"
          );
        })
      : []);
  const setupInterview = (id, type, interviewDetail) => {
    setOpenForm({
      id: id,
      open: true,
      type: type ? type : "create",
      interviewDetail: interviewDetail ? interviewDetail : null,
    });
  };
  const cancelModal = () => {
    setOpenForm({ id: 0, open: false, type: "create", interviewDetail: null });
  };
  const viewCV = (ids) => {
    ids.length === 1
      ? window.open(`/view-resume?_interviewID=${ids[0]}`, "_blank")
      : window.open(
          `/view-resume?_candidateID=${ids[0]}&_vacancyID=${ids[1]}`,
          "_blank"
        );
  };

  const columnsInterview = [
    {
      title: "Email",
      key: "mail",
      render: (text, record) => {
        return <Text>{record.candidate.id}</Text>;
      },
    },
    {
      title: "Name",
      key: "name",
      render: (text, record) => {
        if (
          record.candidate.firstName === null &&
          record.candidate.lastName === null
        ) {
          return <Text italic>{record.candidate.email.split("@")[0]}</Text>;
        } else if (
          record.candidate.firstName === null &&
          record.candidate.lastName !== null
        ) {
          return <Text italic>{record.candidate.lastName}</Text>;
        } else if (
          record.candidate.firstName !== null &&
          record.candidate.lastName === null
        ) {
          return <Text italic>{record.candidate.firstName}</Text>;
        }
        return (
          <Text italic>
            {record.candidate.firstName + " " + record.candidate.lastName}
          </Text>
        );
      },
    },
    {
      title: "Email",
      key: "mail",
      render: (text, record) => {
        return <Text>{record.candidate.email}</Text>;
      },
    },
    {
      title: "Phone",
      key: "phone",
      render: (text, record) => {
        return (
          <Text>
            {record.candidate.phoneNumber
              ? record.candidate.phoneNumber
              : "No data"}
          </Text>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return record.interview === null ? (
          <Space className="action" size={1}>
            <Tooltip title="View CV">
              <Button
                icon={<EyeOutlined style={{ color: "blue" }} />}
                onClick={() => {
                  viewCV([record.candidate.id, positionID]);
                }}
              />
            </Tooltip>
            <Tooltip title="Interview Setup">
              <Button
                icon={<CalendarOutlined style={{ color: "green" }} />}
                onClick={() => setupInterview(record.candidate.id)}
              />
            </Tooltip>
          </Space>
        ) : (
          <Space className="action" size={1}>
            <Tooltip title="View CV">
              <Button
                icon={<EyeOutlined style={{ color: "blue" }} />}
                onClick={() => {
                  viewCV([record.interview.interviewId]);
                }}
              />
            </Tooltip>

            {record.interview.status !== "COMPLETED" &&
              record.interview.status !== "CANCELLED" && (
                <Tooltip title="Update Interview">
                  <Button
                    icon={<CalendarOutlined style={{ color: "green" }} />}
                    onClick={() =>
                      setupInterview(
                        record.candidate.id,
                        "update",
                        record.interview
                      )
                    }
                  />
                </Tooltip>
              )}
            {record.interview.status !== "CANCELLED" && (
              <>
                {record.interview.status !== "COMPLETED" && (
                  <Popconfirm
                    title="Cancel this Interview"
                    description="Are you sure to cancel this Interview?"
                    okText="Yes"
                    cancelText="No"
                    icon={
                      <QuestionCircleOutlined
                        style={{
                          color: "red",
                        }}
                      />
                    }
                    onConfirm={() =>
                      dispatch(
                        recruiterActions.cancelInterviewRequest({
                          id: record.interview.interviewId,
                          reId: userID,
                        })
                      )
                    }
                  >
                    <Tooltip title="Cancel Interview">
                      <Button icon={<DeleteTwoTone twoToneColor="#FF0000" />} />
                    </Tooltip>
                  </Popconfirm>
                )}
                <Tooltip title="Score Application">
                  <Button
                    icon={<CalculatorOutlined />}
                    onClick={() =>
                      navigate(
                        `/recruiter/interviews/${record.interview.interviewId}`
                      )
                    }
                  />
                </Tooltip>
              </>
            )}
            {record.interview.status === "CANCELLED" && (
              <Popconfirm
                title="Revoke this Interview"
                description="Are you sure to revoke this Interview?"
                okText="Yes"
                cancelText="No"
                icon={
                  <QuestionCircleOutlined
                    style={{
                      color: "red",
                    }}
                  />
                }
                onConfirm={() =>
                  dispatch(
                    recruiterActions.updateInterviewRequest({
                      id: record.interview.interviewId,
                      reId: userID,
                      datetime: dayjs()
                        .add(record.candidate.id, "day")
                        .format("YYYY-MM-DDTHH:mm:ss"),
                    })
                  )
                }
              >
                <Tooltip title="Revoke Interview">
                  <Button
                    icon={<ReloadOutlined style={{ color: "#2c7526" }} />}
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];
  return data.data === null ? (
    <div className="loading">
      <Spin size="large"></Spin>
    </div>
  ) : data.data.recruiter.id !== userID ? (
    <div className="container">
      <Modal
        open={true}
        className="Authorization"
        closable={false}
        keyboard={false}
        title={<CloseCircleOutlined className="bigX" height={"250px"} />}
        footer={[
          <Button
            key="back"
            className="button"
            onClick={() => {
              setBackLoading(true);
              setTimeout(() => {
                navigate("/recruiter");
              }, 1500);
            }}
            loading={backLoading}
          >
            Back
          </Button>,
        ]}
      >
        <p>You don't have permission to access this page.</p>
      </Modal>
    </div>
  ) : (
    <>
      <Space
        className="RecruiterPositionDetail internal-container"
        size="large"
        direction="vertical"
      >
        {contextHolder}
        <div className="positionSummary">
          <Typography.Title
            level={2}
            style={{
              margin: "1rem",
            }}
          >
            Position : {data.data.position.name}
          </Typography.Title>
          <div className="infoPosition">
            <Row>
              <Col flex="1 0 50%" className="column">
                <Typography.Title
                  level={5}
                  style={{
                    margin: 5,
                  }}
                >
                  Deadline : {dayjs(data.data.endDate).format("DD/MM/YYYY")}
                </Typography.Title>
              </Col>
              <Col flex="1 0 50%" className="column">
                <Typography.Title
                  level={5}
                  style={{
                    margin: 5,
                  }}
                >
                  Number of Applications: {loading ? 0 : candidates.length}
                </Typography.Title>
              </Col>
              <Col flex="1 0 50%" className="column">
                <Typography.Title
                  level={5}
                  style={{
                    margin: 5,
                  }}
                >
                  Total Need :{" "}
                  {data.data.totalNeeded ? data.data.totalNeeded : 0}
                </Typography.Title>
              </Col>
              <Col flex="1 0 50%" className="column">
                <Typography.Title
                  level={5}
                  style={{
                    margin: 5,
                  }}
                >
                  Remaining need:{" "}
                  {data.data.remainingNeeded ? data.data.remainingNeeded : 0}
                </Typography.Title>
              </Col>
            </Row>
          </div>
        </div>
        <Divider style={{ backgroundColor: "black" }}></Divider>
        <div>
          <h1>List of Applications</h1>
          <Tabs
            defaultActiveKey="1"
            className="tabApplications"
            type="card"
            size="large"
            items={[
              {
                label: "Waiting Interview",
                key: "Waiting Interview",
                children: (
                  <Table
                    columns={columnsInterview}
                    dataSource={applications ? applications : []}
                    rowKey={(record) => record.candidate.id}
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                    style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,.1)" }}
                    loading={{
                      indicator: (
                        <div>
                          <Spin size="large" />
                        </div>
                      ),
                      spinning: loadingData,
                    }}
                  />
                ),
              },
              {
                label: "Interviewing",
                key: "Interviewing",
                children: (
                  <Table
                    columns={columnsInterview}
                    dataSource={
                      listWaitingInterviews ? listWaitingInterviews : []
                    }
                    rowKey={(record) => record.interview.interviewId}
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                    style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,.1)" }}
                    loading={{
                      indicator: (
                        <div>
                          <Spin size="large" />
                        </div>
                      ),
                      spinning: loadingData,
                    }}
                  />
                ),
              },
              {
                label: "Interviewed",
                key: "Interviewed",
                children: (
                  <Table
                    columns={columnsInterview}
                    dataSource={
                      listCompletedInterviews ? listCompletedInterviews : []
                    }
                    rowKey={(record) => record.interview.interviewId}
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                    style={{ boxShadow: "0 0 10px 0 rgba(0,0,0,.1)" }}
                    loading={{
                      indicator: (
                        <div>
                          <Spin size="large" />
                        </div>
                      ),
                      spinning: loadingData,
                    }}
                  />
                ),
              },
            ]}
          />

          <InterviewForm
            visible={openForm.open}
            candidateId={openForm.id}
            cancelModal={cancelModal}
            vacancyId={positionID}
            recruiterId={userID}
            interviewers={data.interviewers}
            type={openForm.type}
            interview={openForm.interviewDetail}
            loading={loading}
          />
        </div>
      </Space>
    </>
  );
}
