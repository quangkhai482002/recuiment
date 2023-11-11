import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./adminscore.scss";
import {
  Button,
  Avatar,
  Typography,
  Table,
  Modal,
  Spin,
  message,
  Result,
  Card,
  Drawer,
  Divider,
} from "antd";
import {
  BookOutlined,
  LoadingOutlined,
  HourglassTwoTone,
  CheckCircleTwoTone,
  CopyOutlined,
  CloseCircleTwoTone,
  AlignLeftOutlined,
} from "@ant-design/icons";

import adminApi from "api/adminApi";

const { Title, Text } = Typography;

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const gridLeftStyle = {
  borderTopLeftRadius: "8px",
  width: "50%",
  height: "4rem",
  padding: "0.6rem",
  textAlign: "center",
  backgroundColor: "rgb(223, 240, 236)",
};
const gridRightStyle = {
  borderTopRightRadius: "8px",
  width: "50%",
  height: "4rem",
  padding: "0.6rem",
  textAlign: "center",
  backgroundColor: "rgb(223, 240, 236)",
};

export default function AdminScore() {
  const [scoreData, setScoreData] = useState({});

  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [fetchModalOpen, setFetchModalOpen] = useState(false);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onDrawerClose = () => {
    setOpenDrawer(false);
  };

  const [error, setError] = useState({
    status: null,
    message: null,
  });

  const [messageApi, contextHolder] = message.useMessage();

  let { candidateID } = useParams();
  let { positionID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (candidateID) {
      setPageLoading(true);
      setFetchModalOpen(true);
      const fetchAdminScore = async () => {
        try {
          const response = await adminApi.getAdminScore(candidateID);
          setScoreData(response);
          console.log("Fetch API successfully: ", response);

          setError({
            status: null,
            message: null,
          });

          setPageLoading(false);
        } catch (error) {
          messageApi.open({
            type: "error",
            content: `${error.response.data.message}`,
            style: {
              marginTop: "4rem",
            },
          });

          console.log("Failed to fetch API: ", error);

          switch (error.response.status) {
            case 404:
              return setError({
                status: 404,
                message: "Không tìm thấy !!!",
              });
            case 403:
              return setError({
                status: 403,
                message: "Bạn không có quyền truy cập !!!",
              });
            default:
              return setError({
                status: 500,
                message: "Lỗi không xác định !!!",
              });
          }
        } finally {
          setTimeout(() => {
            setFetchModalOpen(false);
          }, 500);
        }
      };
      fetchAdminScore();
    }
  }, [candidateID, messageApi]);

  const showPassModal = () => {
    setIsPassModalOpen(true);
  };

  const showRejectModal = () => {
    setIsRejectModalOpen(true);
  };

  const handleOkPass = () => {
    setIsPassModalOpen(false);

    setUpdateLoading(true);
    setUpdateModalOpen(true);

    const approveCandidate = async () => {
      try {
        const response = await adminApi.approveCandidate(candidateID);
        console.log("Fetch API successfully: ", response);
        setUpdateLoading(false);
        setTimeout(() => {
          navigate(`/admin/positions/${positionID}`); // Navigate
        }, 500);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: `${error.response.data.message}`,
          style: {
            marginTop: "4rem",
          },
        });
        console.log("Failed to fetch API: ", error);
      } finally {
        setTimeout(() => {
          setUpdateModalOpen(false);
        }, 500);
      }
    };
    approveCandidate();
  };

  const handleCancelPass = () => {
    setIsPassModalOpen(false);
  };

  const handleOkFail = () => {
    setIsRejectModalOpen(false);

    setUpdateLoading(true);
    setUpdateModalOpen(true);

    const rejectCandidate = async () => {
      try {
        const response = await adminApi.rejectCandidate(candidateID);
        console.log("Fetch API successfully: ", response);
        setUpdateLoading(false);
        setTimeout(() => {
          navigate(`/admin/positions/${positionID}`); // Navigate
        }, 500);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: `${error.response.data.message}`,
          style: {
            marginTop: "4rem",
          },
        });
        console.log("Failed to fetch API: ", error);
      } finally {
        setTimeout(() => {
          setUpdateModalOpen(false);
        }, 500);
      }
    };
    rejectCandidate();
  };

  const handleCancelFail = () => {
    setIsRejectModalOpen(false);
  };

  const columns = [
    {
      title: "Soft Skill",
      dataIndex: "softSkillScore",
      key: "softSkillScore",
      width: "25%",
      align: "center",
      render: (text, record) => {
        return <b>{record.softSkillScore}</b>;
      },
    },
    {
      title: "Language Skill",
      dataIndex: "languageSkillScore",
      key: "languageSkillScore",
      width: "25%",
      align: "center",
      render: (text, record) => {
        return <b>{record.languageSkillScore}</b>;
      },
    },
    {
      title: "Technical Skill",
      dataIndex: "interviewerScore",
      key: "interviewerScore",
      width: "25%",
      align: "center",
      render: (text, record) => {
        return <b>{record.interviewerScore}</b>;
      },
    },
    {
      title: "Overall",
      dataIndex: "totalScore",
      key: "totalScore",
      width: "25%",
      align: "center",
      render: (text, record) => {
        return <b>{record.totalScore}</b>;
      },
    },
  ];

  const blackListColumns = [
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: "60%",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: "20%",
      align: "center",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: "20%",
      align: "center",
    },
  ];

  return (
    <Fragment>
      {contextHolder}
      <Modal
        title={
          pageLoading ? (
            <div>
              <HourglassTwoTone /> Loading...
            </div>
          ) : (
            <div>
              Success <CheckCircleTwoTone twoToneColor="#52c41a" />
            </div>
          )
        }
        open={fetchModalOpen}
        footer={null}
        bodyStyle={{ padding: "15px", fontSize: "1.2rem" }}
      >
        <div style={pageLoading ? { color: "orange" } : { color: "green" }}>
          <Spin spinning={pageLoading} indicator={antIcon} />{" "}
          {pageLoading ? "Waiting for data !" : "Load data successfully !"}
        </div>
      </Modal>

      <Modal
        title={
          updateLoading ? (
            <div>
              <HourglassTwoTone /> Updating...
            </div>
          ) : (
            <div>
              Success <CheckCircleTwoTone twoToneColor="#52c41a" />
            </div>
          )
        }
        open={updateModalOpen}
        footer={null}
        bodyStyle={{ padding: "15px", fontSize: "1.2rem" }}
      >
        <div style={updateLoading ? { color: "orange" } : { color: "green" }}>
          <Spin spinning={updateLoading} indicator={antIcon} />{" "}
          {updateLoading
            ? "Updating candidate status !"
            : "Update status successfully !"}
        </div>
      </Modal>

      {error.status && (
        <Result
          className="result"
          status={`${error.status}`}
          title={`${error.status}`}
          subTitle={error.message}
        />
      )}

      {!pageLoading && (
        <div className="admin-score internal-container">
          <Drawer
            title={
              <div>
                Candidate Information <AlignLeftOutlined />
              </div>
            }
            placement="right"
            width={640}
            className="admin-score-drawer"
            onClose={onDrawerClose}
            open={openDrawer}
          >
            <div className="personal-drawer">
              <Title level={4}>Personal</Title>
            </div>
            <div className="personal-drawer-container">
              <div className="name-city-birthday">
                <div className="item-drawer">
                  <Text>
                    <b>Full Name: </b>
                  </Text>
                  <Text>{`${scoreData.candidateVacancy.candidate.firstName} ${scoreData.candidateVacancy.candidate.lastName}`}</Text>
                </div>
                <div className="item-drawer">
                  <Text>
                    <b>City: </b>
                  </Text>
                  <Text>
                    {scoreData.candidateVacancy.candidate.address !== null
                      ? `${
                          scoreData.candidateVacancy.candidate.address.city !==
                          null
                            ? scoreData.candidateVacancy.candidate.address.city
                            : "no information"
                        }`
                      : "no information"}
                  </Text>
                </div>
                <div className="item-drawer">
                  <Text>
                    <b>Birthday: </b>
                  </Text>
                  <Text>
                    {scoreData.candidateVacancy.candidate.birthday !== null
                      ? `${scoreData.candidateVacancy.candidate.birthday}`
                      : "no information"}
                  </Text>
                </div>
              </div>
              <div className="acc-country-sex">
                <div className="item-drawer">
                  <Text>
                    <b>Account: </b>
                  </Text>
                  <Text>{`${scoreData.candidateVacancy.candidate.email}`}</Text>
                </div>

                <div className="item-drawer">
                  <Text>
                    <b>Country: </b>
                  </Text>
                  <Text>
                    {scoreData.candidateVacancy.candidate.address !== null
                      ? `${
                          scoreData.candidateVacancy.candidate.address
                            .country !== null
                            ? scoreData.candidateVacancy.candidate.address
                                .country
                            : "no information"
                        }`
                      : "no information"}
                  </Text>
                </div>
                <div className="item-drawer">
                  <Text>
                    <b>Sex: </b>
                  </Text>
                  <Text>
                    {scoreData.candidateVacancy.candidate.sex !== null
                      ? `${
                          scoreData.candidateVacancy.candidate.sex === 1
                            ? "Male"
                            : "Female"
                        }`
                      : "no information"}
                  </Text>
                </div>
              </div>
            </div>

            <Divider />

            <div className="position-drawer">
              <Title level={4}>Applied position</Title>
            </div>

            <div className="position-salary-container">
              <div className="position-drawer">
                <Text>
                  <b>Positon: </b>
                </Text>
                <Text>
                  {scoreData.candidateVacancy.vacancy.position !== null
                    ? `${
                        scoreData.candidateVacancy.vacancy.position.name !==
                        null
                          ? scoreData.candidateVacancy.vacancy.position.name
                          : "no information"
                      }`
                    : "no information"}
                </Text>
              </div>
              <div className="salary-drawer">
                <Text>
                  <b>Salary: </b>
                </Text>
                <Text>
                  {scoreData.candidateVacancy.vacancy.salary !== null
                    ? `${scoreData.candidateVacancy.vacancy.salary}`
                    : "no information"}
                </Text>
              </div>
            </div>
            <div className="working-location-drawer">
              <Text>
                <b>Working location: </b>
              </Text>
              <Text>
                {scoreData.candidateVacancy.vacancy.workingLocation !== null
                  ? `${scoreData.candidateVacancy.vacancy.workingLocation}`
                  : "no information"}
              </Text>
            </div>
            <div className="requirements-drawer">
              <Text>
                <b>Requirements: </b>
              </Text>
              <Text>
                {scoreData.candidateVacancy.vacancy.requirements !== null
                  ? `${scoreData.candidateVacancy.vacancy.requirements}`
                  : "no information"}
              </Text>
            </div>

            <Divider />

            <div className="contacts-drawer">
              <Title level={4}>Contacts</Title>
            </div>

            <div className="email-phone">
              <div className="email">
                <Text>
                  <b>Email: </b>
                </Text>
                <Text>
                  {scoreData.candidateVacancy.candidate.email !== null
                    ? `${scoreData.candidateVacancy.candidate.email}`
                    : "no information"}
                </Text>
              </div>
              <div className="phone">
                <Text>
                  <b>Phone Number: </b>
                </Text>
                <Text>
                  {scoreData.candidateVacancy.candidate.phoneNumber !== null
                    ? `${scoreData.candidateVacancy.candidate.phoneNumber}`
                    : "no information"}
                </Text>
              </div>
            </div>
          </Drawer>

          <div className="candidate-avatar">
            {scoreData.candidateVacancy.status === "PASS" && (
              <span className="stamp is-approved">Approved</span>
            )}
            {scoreData.candidateVacancy.status === "FAILED" && (
              <span className="stamp is-nope">Failed</span>
            )}
            {(!scoreData.candidateVacancy.status ||
              scoreData.candidateVacancy.status === "PENDING") &&
              scoreData.status === "PENDING" && (
                <span className="stamp">Pending</span>
              )}
            {(!scoreData.candidateVacancy.status ||
              scoreData.candidateVacancy.status === "PENDING") &&
              scoreData.status === "CANCELLED" && (
                <span className="stamp is-cancelled">Cancelled</span>
              )}
            {(!scoreData.candidateVacancy.status ||
              scoreData.candidateVacancy.status === "PENDING") &&
              scoreData.status === "COMPLETED" && (
                <span className="stamp is-completed">Completed</span>
              )}

            <div className="card-style">
              <div className="evalution-title">
                <Title level={2} className="title">
                  CANDIDATE RECRUITMENT EVALUATION FORM
                </Title>
              </div>
              <div className="avatar-meta">
                <Avatar
                  className="avatar"
                  src={scoreData.candidateVacancy.candidate.linkAvt}
                />
                <div className="infomation">
                  <Link
                    to={`/view-resume?_resumeID=${scoreData.candidateVacancy.cvId}`}
                    target="_blank"
                  >
                    <Button
                      size="small"
                      icon={<BookOutlined />}
                      className="cv-button"
                    >
                      View CV
                    </Button>
                  </Link>

                  <Button
                    size="small"
                    className="info-button"
                    icon={<CopyOutlined />}
                    onClick={showDrawer}
                  >
                    View info
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-btn">
              <div className="user-info">
                <div className="item">
                  <div className="info-item">
                    <Text>
                      <b>Candidate Name: </b>
                    </Text>
                  </div>
                </div>
                <div className="item">
                  <div className="info-item">
                    <Text>
                      <b>Positon: </b>
                    </Text>
                  </div>
                </div>
                <div className="item">
                  <div className="info-item">
                    <Text>
                      <b> Apply Date: </b>
                    </Text>
                  </div>
                </div>
              </div>

              <div className="user-content">
                <div className="item">
                  <div className="info-item">
                    <Text>{`${scoreData.candidateVacancy.candidate.firstName} ${scoreData.candidateVacancy.candidate.lastName}`}</Text>
                  </div>
                </div>
                <div className="item">
                  <div className="info-item">
                    <Text>
                      {scoreData.candidateVacancy.vacancy.position.name}
                    </Text>
                  </div>
                </div>
                <div className="item">
                  <div className="info-item">
                    <Text>{scoreData.candidateVacancy.applyDate}</Text>
                  </div>
                </div>
              </div>

              <div className="user-info">
                <div className="item">
                  <div className="info-item">
                    <Text>
                      <b>Interview Name: </b>
                    </Text>
                  </div>
                </div>
                <div className="item">
                  <div className="info-item">
                    <Text>
                      <b>Recruiter Name: </b>
                    </Text>
                  </div>
                </div>
                <div className="item">
                  <div className="info-item">
                    <Text>
                      <b>Interview Date: </b>
                    </Text>
                  </div>
                </div>
              </div>

              <div className="user-content">
                <div className="item">
                  <div className="info-item">
                    <Text>
                      {scoreData.interviewer !== null
                        ? `${scoreData.interviewer.firstName} ${scoreData.interviewer.lastName}`
                        : ""}
                    </Text>
                  </div>
                </div>
                <div className="item">
                  <div className="info-item">
                    <Text>
                      {scoreData.recruiter !== null
                        ? `${scoreData.recruiter.firstName} ${scoreData.recruiter.lastName}`
                        : ""}
                    </Text>
                  </div>
                </div>
                <div className="item">
                  <div className="info-item">
                    <Text>{`${new Date(
                      scoreData.interviewDatetime
                    ).getFullYear()}-${
                      new Date(scoreData.interviewDatetime).getMonth() + 1
                    }-${new Date(
                      scoreData.interviewDatetime
                    ).getDate()}`}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="candidate-evalution">
            <Title className="evalution-title" level={3} keyboard>
              Interviewer evalution
            </Title>

            {scoreData.interviewQuestion.map((item, index) => (
              <div key={index}>
                <div className="question-container">
                  <div className="question-title">
                    <b>
                      <Text>Question {++index}: </Text>
                    </b>
                  </div>
                  <div className="question-content">
                    <Text> {item.question.content}</Text>
                  </div>
                </div>
                <div className="question-container">
                  <div className="question-title">
                    <b>
                      <Text>Answer: </Text>
                    </b>
                  </div>
                  <div className="question-content">
                    <Text>{item.question.answer}</Text>
                  </div>
                </div>

                <div className="question-container">
                  <div className="question-title">
                    <b>
                      <Text>Note: </Text>
                    </b>
                  </div>
                  <div className="question-content">
                    <Text>{item.note}</Text>
                  </div>
                </div>

                <div className="question-container">
                  <div className="question-title">
                    <b>
                      <Text>Score: </Text>
                    </b>
                  </div>
                  <div className="question-content">
                    <Text>{item.score}</Text>
                  </div>
                </div>
                <br />
              </div>
            ))}
          </div>

          <div className="recruiter-evalution">
            <Title className="evalution-title" level={3} keyboard>
              Recruiter evalution
            </Title>

            <div className="recruiter-score">
              <Card>
                <Card.Grid hoverable={false} style={gridLeftStyle}>
                  <div>
                    <Typography.Text>
                      <b>Soft Skill Score</b>
                    </Typography.Text>
                  </div>

                  <div>
                    <Typography.Text>
                      <b>{scoreData.softSkillScore}</b>
                    </Typography.Text>
                  </div>
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridRightStyle}>
                  <div>
                    <Typography.Text>
                      <b>Language Skill Score</b>
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text>
                      <b>{scoreData.languageSkillScore}</b>
                    </Typography.Text>
                  </div>
                </Card.Grid>
                <Card.Grid
                  hoverable={false}
                  style={{ width: "100%", padding: "1rem" }}
                >
                  <span>
                    <Typography.Text>
                      <b>Note: </b>
                    </Typography.Text>
                    <Typography.Text>{scoreData.summary}</Typography.Text>
                  </span>
                </Card.Grid>
              </Card>
            </div>
          </div>

          <div className="overall">
            <Title className="evalution-title" level={3} keyboard>
              Overall
            </Title>

            <Table
              pagination={{ hideOnSinglePage: true }}
              rowKey={(data) => data.id}
              columns={columns}
              dataSource={[scoreData]}
            />
          </div>

          <div className="blacklist-history">
            <Title className="evalution-title" level={3} keyboard>
              Blacklist History
            </Title>

            <Table
              pagination={{ hideOnSinglePage: true }}
              rowKey={(data) => data.reason}
              columns={blackListColumns}
              dataSource={scoreData.candidateVacancy.candidate.blacklists}
            />
          </div>

          {(scoreData.candidateVacancy.status === null ||
            scoreData.candidateVacancy.status === "PENDING") && (
            <div className="pass-fail-btn">
              <Button
                className="pass-btn"
                type="primary"
                onClick={showPassModal}
              >
                <b>PASS</b>
              </Button>
              <Button
                className="fail-btn"
                type="primary"
                onClick={showRejectModal}
              >
                <b>REJECT</b>
              </Button>
            </div>
          )}

          {scoreData.candidateVacancy.status === "FAILED" && (
            <div className="pass-fail-btn">
              <Button
                className="pass-btn"
                type="primary"
                onClick={showPassModal}
              >
                <b>PASS</b>
              </Button>
            </div>
          )}

          {scoreData.candidateVacancy.status === "PASS" && (
            <div className="pass-fail-btn">
              <Button
                className="fail-btn"
                type="primary"
                onClick={showRejectModal}
              >
                <b>REJECT</b>
              </Button>
            </div>
          )}

          <Modal
            title={
              <div>
                Fail Confirmation{" "}
                <CloseCircleTwoTone
                  style={{ fontSize: "17px" }}
                  twoToneColor="#fc0b03"
                />
              </div>
            }
            open={isRejectModalOpen}
            okText="Yes"
            cancelText="No"
            onOk={handleOkFail}
            onCancel={handleCancelFail}
          >
            <p>Are you sure this candidate Failed ?</p>
          </Modal>
          <Modal
            title={
              <div>
                Pass Confirmation{" "}
                <CheckCircleTwoTone
                  style={{ fontSize: "17px" }}
                  twoToneColor="#52c41a"
                />
              </div>
            }
            open={isPassModalOpen}
            okText="Yes"
            cancelText="No"
            onOk={handleOkPass}
            onCancel={handleCancelPass}
          >
            <p>Are you sure this candidate passed ?</p>
          </Modal>
        </div>
      )}
    </Fragment>
  );
}
