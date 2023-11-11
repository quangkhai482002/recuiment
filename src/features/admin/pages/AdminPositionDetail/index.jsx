import {
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SolutionOutlined,
  SyncOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, message, Space, Spin, Tag, Tooltip, Typography } from "antd";
import CustomTable from "components/Common/CustomTable";
import { Link, useParams } from "react-router-dom";
import adminApi from "api/adminApi";
import { useEffect, useState } from "react";
import "./AdminPositionDetail.scss";

const AdminPositionDetail = () => {
  // state
  const [messageApi, contextHolder] = message.useMessage();
  const [positionDetail, setPositionDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { positionID } = useParams();

  const columns = [
    {
      title: "Candidate",
      dataIndex: "candidate",
      key: "candidate",
      isSearchByValue: true,
      fixed: "left",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      isSearchByValue: true,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Total Score",
      dataIndex: "score",
      key: "score",
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Pass",
          value: "PASS",
        },
        {
          text: "Pending",
          value: "PENDING",
        },
        {
          text: "Interviewed",
          value: "INTERVIEWED",
        },
      ],
      sorter: (a, b) => {
        const order = { PASS: 1, INTERVIEWED: 2, PENDING: 3 };
        return order[a.status] - order[b.status];
      },
      onFilter: (value, record) => record.status === value,
      render: (value, record) => {
        let color, icon;
        switch (value) {
          case "PASS":
            color = "success";
            icon = <CheckCircleOutlined />;
            break;
          case "PENDING":
            color = "default";
            icon = <ClockCircleOutlined />;
            break;
          case "INTERVIEWED":
            color = "processing";
            icon = <SyncOutlined spin />;
            break;
          default:
            color = "error";
            icon = <ExclamationCircleOutlined />;
            break;
        }
        return (
          <Tag icon={icon} color={color}>
            {value ? value : "NO STATUS"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value, record) => (
        <Space>
          <Tooltip title="Candidate's Detail" placement="top">
            <Link to={`/admin/positions/${positionID}/${record.interviewId}`}>
              <Button type="primary" size="small" icon={<AuditOutlined />} />
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // const BouncingDotsLoader = (props) => {
  //   return (
  //       <div className="bouncing-loader">
  //         <div></div>
  //         <div></div>
  //         <div></div>
  //       </div>
  //   );
  // };

  useEffect(() => {
    const fetchPositionDetail = async () => {
      try {
        const response = await adminApi.getCandidateOfPositions({ page: 1, limit: 200 }, positionID);
        const detail = {};

        response.forEach((item) => {
          const vacancy = item.candidateVacancy.vacancy;
          const candidate = item.candidateVacancy.candidate;
          const totalScore = item.totalScore;

          const positionName = vacancy.position.name;
          const requirement = vacancy.totalNeeded;

          const appliedCandidate = {
            id: candidate.id,
            interviewId: item.id,
            candidate: candidate.firstName && candidate.lastName ? `${candidate.firstName} ${candidate.lastName}` : "",
            age: new Date().getFullYear() - new Date(candidate.birthday).getFullYear(),
            email: candidate.email,
            phone: candidate.phoneNumber,
            score: totalScore,
            status:
              item.candidateVacancy.status === "FAILED"
                ? "INTERVIEWED"
                : item.candidateVacancy.status
                ? item.candidateVacancy.status.toUpperCase()
                : "NO STATUS",
          };

          if (!detail[positionName]) {
            detail[positionName] = {
              positionName: positionName,
              requirement: requirement,
              appliedCandidate: [appliedCandidate],
            };
          } else {
            detail[positionName].appliedCandidate.push(appliedCandidate);
          }
        });
        if (JSON.stringify(detail) !== "{}") {
          setPositionDetail(Object.values(detail)[0]);
        }
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          messageApi.open({
            type: "error",
            content: "Interviews not found!",
            duration: 3,
          });
        }
        setIsLoading(false);
      }
    };
    if (isLoading) {
      fetchPositionDetail();
    }
  }, [isLoading, messageApi, positionID]);


  return (
    <div className="PositionDetail internal-container">
      {contextHolder}
      <Row gutter={[32, 16]} justify="space-between">
        <Col span={24}>
          <Typography.Title level={2} className="position-name">
            {!isLoading ? (
              positionDetail["positionName"] ? (
                positionDetail["positionName"].charAt(0).toUpperCase() + positionDetail["positionName"].slice(1)
              ) : (
                "No interview found"
              )
            ) : (
              <Spin />
            )}
          </Typography.Title>
        </Col>
        <Col xl={6} sm={12} xs={24}>
          <Card style={{ backgroundColor: "#3395ff" }}>
            <Row>
              <Col span={19}>
                <Typography.Text type="secondary" strong>
                  APPLIED CANDIDATE
                </Typography.Text>
                <Typography.Title level={2}>
                  {!isLoading ? (
                    positionDetail["positionName"] ? (
                      positionDetail["appliedCandidate"].length
                    ) : (
                      "•••"
                    )
                  ) : (
                    <Spin />
                  )}
                </Typography.Title>
              </Col>
              <Col span={5}>
                <SolutionOutlined />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xl={6} sm={12} xs={24}>
          <Card style={{ backgroundColor: "#5ac8fa" }}>
            <Row>
              <Col span={19}>
                <Typography.Text type="secondary" strong>
                  REQUIREMENT
                </Typography.Text>
                <Typography.Title level={2}>
                  {!isLoading ? (
                    positionDetail["positionName"] ? (
                      `${positionDetail["appliedCandidate"].filter((item) => item.status === "PASS").length}/${
                        positionDetail["requirement"]
                      }`
                    ) : (
                      "•••"
                    )
                  ) : (
                    <Spin />
                  )}
                </Typography.Title>
              </Col>
              <Col span={5}>
                <UnorderedListOutlined />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xl={6} sm={12} xs={24}>
          <Card style={{ backgroundColor: "#FF9500" }}>
            <Row>
              <Col span={19}>
                <Typography.Text type="secondary" strong>
                  INTERVIEWED
                </Typography.Text>
                <Typography.Title level={2}>
                  {!isLoading ? (
                    positionDetail["positionName"] ? (
                      positionDetail["appliedCandidate"].filter((item) => item.status !== "PENDING" && item.status)
                        .length
                    ) : (
                      "•••"
                    )
                  ) : (
                    <Spin />
                  )}
                </Typography.Title>
              </Col>
              <Col span={5}>
                <TeamOutlined />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xl={6} sm={12} xs={24}>
          <Card style={{ backgroundColor: "#3DAE50" }}>
            <Row>
              <Col span={19}>
                <Typography.Text type="secondary" strong>
                  PASS
                </Typography.Text>
                <Typography.Title level={2}>
                  {!isLoading ? (
                    positionDetail["positionName"] ? (
                      positionDetail["appliedCandidate"].filter((item) => item.status === "PASS").length
                    ) : (
                      "•••"
                    )
                  ) : (
                    <Spin />
                  )}
                </Typography.Title>
              </Col>
              <Col span={5}>
                <CheckCircleOutlined />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Card className="AppliedTable" title="Applied Candidates">
        <CustomTable
          columns={columns}
          data={
            positionDetail["appliedCandidate"]
              ? positionDetail["appliedCandidate"].sort((a, b) => {
                  const statusOrder = { PASS: 0, INTERVIEWED: 1, PENDING: 2 };
                  return statusOrder[a.status] - statusOrder[b.status];
                })
              : positionDetail["appliedCandidate"]
          }
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default AdminPositionDetail;
