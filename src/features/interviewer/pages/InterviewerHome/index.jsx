import {
  AuditOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditFilled,
} from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Row, Space, Tag, Tooltip, Typography, message } from "antd";
import interviewerApi from "api/interviewerApi";
import CustomTable from "components/Common/CustomTable";
import { authSelectors } from "features/auth/authSlice";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./InterviewerHome.scss";

const { RangePicker } = DatePicker;

const InterviewerHome = () => {
  // state
  const [messageApi, contextHolder] = message.useMessage();

  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRange, setFilterRange] = useState(null);
  const [filteredInterviews, setFilteredInterviews] = useState([]);

  const { currentUser } = useSelector(authSelectors, shallowEqual);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
    return formattedDate;
  };

  const formatDateCol = (text) => {
    const date = new Date(text);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes} ${period}`;
    return formattedDate;
  };

  const columns = [
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      isSearchByValue: true,
      fixed: "left",
      width: "12%"
    },
    {
      title: "Recruiter",
      dataIndex: "recruiter",
      key: "recruiter",
      isSearchByValue: true,
      width: "17%"
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      isSearchByValue: true,
      width: "9%"
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: "16%",
      sorter: (a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateA.getTime() - dateB.getTime();
      },
      render: (text) => formatDateCol(text), // Format the date for display
    },
    {
      title: "Link Meet",
      dataIndex: "place",
      key: "place",
      isSearchByValue: true,
      width: "13%"
    },
    {
      title: "Candidate",
      dataIndex: "candidate",
      key: "candidate",
      isSearchByValue: true,
      width: "17%"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "8%",
      filters: [
        {
          text: "COMPLETED",
          value: "COMPLETED",
        },
        {
          text: "CANCELLED",
          value: "CANCELLED",
        },
        {
          text: "PENDING",
          value: "PENDING",
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (value, record) => {
        let color, icon;
        switch (value) {
          case "COMPLETED":
            color = "success";
            icon = <CheckCircleOutlined />;
            break;
          case "CANCELLED":
            color = "error";
            icon = <CloseCircleOutlined />;
            break;
          case "PENDING":
            color = "default";
            icon = <ClockCircleOutlined />;
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
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "8%",
      render: (value, record) => (
        <Space>
          <Tooltip title="Candidate Evaluation" placement="top">
            <Link to={`/interviewer/interviews/${record.id}`}>
              <Button type="primary" size="small" icon={<EditFilled />} danger></Button>
            </Link>
          </Tooltip>
          <Tooltip title="Candidate's CV" placement="top">
            <Link to={`/view-resume?_interviewID=${record.id}`} target="_blank">
              <Button type="primary" target="_blank" size="small" icon={<AuditOutlined />}></Button>
            </Link>
          </Tooltip>
          {/* <Tooltip title="Recruiter's Information" placement="top">
            <Link to={`${record.id}&=${record.email}`} target="_blank">
              <Button type="primary" size="small" style={{ backgroundColor: "green" }} icon={<UserOutlined />}></Button>
            </Link>
          </Tooltip> */}
        </Space>
      ),
    },
  ];
  // useEffect
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await interviewerApi.getInterviews();
        const formatInterviews = response
          .sort((a, b) => {
            const statusOrder = { PENDING: 0, COMPLETED: 1 };
            return statusOrder[a.status] - statusOrder[b.status];
          })
          .filter((item) => item.interviewer.id === currentUser.id)
          .map((item) => {
            return {
              id: item.id.toString(), // Convert to string as per your desired format
              recruiterId: item.recruiter.id,
              recruiter: `${item.recruiter.firstName} ${item.recruiter.lastName}`,
              position: item.candidateVacancy.vacancy.position.name,
              level: item.candidateVacancy.vacancy.level
                .map((level) => level.name.charAt(0).toUpperCase() + level.name.slice(1))
                .join(", "),
              time: formatDate(item.interviewDatetime),
              place: item.linkMeet,
              candidateId: item.candidateVacancy.candidate.id,
              candidate: `${item.candidateVacancy.candidate.firstName} ${item.candidateVacancy.candidate.lastName}`,
              // candidateCVId: item.candidateVacancy.cvId,
              status: item.status,
            };
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
  }, [currentUser.id, messageApi]);

  // Filter interview when range picker changes value
  const onChange = (dates, dateStrings) => {
    if (dateStrings[0] === "" && dateStrings[1] === "") {
      setFilterRange(null);
    } else {
      setFilterRange(dates);
    }
  };

  // Clear filter
  const clearFilter = () => {
    setFilterRange(null);
    setFilteredInterviews(interviews);
  };
  // Filter interview by date range
  useEffect(() => {
    const filterData = () => {
      if (filterRange) {
        const [startDate, endDate] = filterRange;

        const filteredInterviews = interviews.filter((interview) => {
          const interviewTime = new Date(interview.time);

          // Start of the day for startDate and endDate
          const startDateStartOfDay = new Date(startDate);
          startDateStartOfDay.setHours(0, 0, 0, 0);
          const endDateStartOfDay = new Date(endDate);
          endDateStartOfDay.setHours(0, 0, 0, 0);

          return interviewTime >= startDateStartOfDay && interviewTime <= endDateStartOfDay;
        });

        setFilteredInterviews(filteredInterviews);
      } else {
        setFilteredInterviews(interviews);
      }
    };

    filterData();
  }, [filterRange, interviews]);

  return (
    <React.Fragment>
      <div className="InterviewerHome internal-container">
        {contextHolder}
        <Card bodyStyle={{ borderRadius: "5px" }}>
          <Row justify="end" style={{ textAlign: "left" }}>
            <Col xl={18} sm={12} style={{ textAlign: "left" }}>
              <Typography.Title level={4}>Interviews </Typography.Title>
            </Col>
            <Col xl={6} sm={12}>
              <Space>
                <RangePicker onChange={onChange} value={filterRange} />
                <Button icon={<ClearOutlined />} type="link" onClick={clearFilter}>
                  Clear Filter
                </Button>
              </Space>
            </Col>
          </Row>
          <CustomTable columns={columns} data={filterRange ? filteredInterviews : interviews} isLoading={isLoading} />
        </Card>
      </div>
    </React.Fragment>
  );
};

export default InterviewerHome;
