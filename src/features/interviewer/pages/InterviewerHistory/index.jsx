import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Tag, Typography, message, } from "antd";
import interviewerApi from "api/interviewerApi";
import { authSelectors } from "features/auth/authSlice";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomTable from "../../../../components/Common/CustomTable";
import "./interviewerHistory.scss";

const columns = [
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    isSearchByValue: true,
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    responsive: ["md"],
  },
  {
    title: "Date",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Place",
    dataIndex: "place",
    key: "place",
    responsive: ["lg"],
  },
  {
    title: "Candidate",
    dataIndex: "candidate",
    key: "candidate",
    isSearchByValue: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      {
        text: "COMPLETED",
        value: "COMPLETED",
      },
      {
        text: "CANCELLED",
        value: "CANCELLED",
      },
    ],
    onFilter: (value, record) => record.status === value,
    render: (value, record) => {
      let color, icon;
      switch (value) {
        case "COMPLETED":
          color = "#00a130";
          icon = <CheckCircleOutlined />;
          break;
        case "CANCELLED":
          color = "#c21802";
          icon = <CloseCircleOutlined />;
          break;
        default:
          color = "";
          break;
      }
      return (
        <Tag icon={icon} color={color}>
          {value}
        </Tag>
      );
    },
  },
  {
    title: "",
    key: "action",
    render: (_, record) => {
      return (
        <Link to={`/interviewer/interviews/${record.id}`} target="_blank">
          <Button
            type="primary"
            size="small"
            style={{ backgroundColor: "#327dfc" }}
            icon={<EyeOutlined />}
          ></Button>
        </Link>
      );
    },
  },
];

export default function InterviewerHistory() {

  const [messageApi] = message.useMessage();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useSelector(authSelectors, shallowEqual);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await interviewerApi.getInterviews();
        const formatInterviews = response
          .filter(
            (item) =>
              item.interviewer.id === currentUser.id &&
              (item.status === "COMPLETED" || item.status === "CANCELLED")
          )
          .map((item) => {
            return {
              id: item.id.toString(), // Convert to string as per your desired format
              position: item.candidateVacancy.vacancy.position.name,
              level: item.candidateVacancy.vacancy.level
                .map(
                  (level) =>
                    level.name.charAt(0).toUpperCase() + level.name.slice(1)
                )
                .join(", "), // Assuming you want the first level name, adjust as needed
              time: moment(item.interviewDatetime).format("HH:mm DD/MM/YYYY"),
              place: item.linkMeet,
              candidateId: item.candidateVacancy.candidate.id,
              candidate: `${item.candidateVacancy.candidate.firstName} ${item.candidateVacancy.candidate.lastName}`,
              status: item.status,
            };
          });
        formatInterviews.sort((a, b) => {
          const statusOrder = { PENDING: 0, CANCELLED: 2, COMPLETED: 1 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
        setInterviews(formatInterviews);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          messageApi.open({
            type: "error",
            content: "You haven't been assigned any interviews yet!",
            duration: 3,
          });
        }
        setIsLoading(false);
      }
    };
    fetchInterviews();
  }, [currentUser.id], messageApi);
  return (
    <div className="InterviewerHistory internal-container">
      <React.Fragment>
        <div className="InterviewerHome internal-container">
          <Card bodyStyle={{ borderRadius: "5px" }}>
            <Row justify="end">
              <Col span={18}>
                <Typography.Title level={4}>
                  Interview History{" "}
                </Typography.Title>
              </Col>
              <Col span={6}></Col>
            </Row>
            <CustomTable
              columns={columns}
              data={interviews}
              isLoading={isLoading}
            />
          </Card>
        </div>
      </React.Fragment>
    </div>
  );
}
