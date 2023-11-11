import { EyeOutlined, FolderOpenTwoTone } from "@ant-design/icons";
import { Button, Space, Table, Tag, Tooltip, Typography, Spin } from "antd";
import candidateApi from "api/candidateApi";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from "react-router-dom";
import "./CandidateInterviewHistory.scss";
import StatisticCard from "./StatisticCard";

export default function CandidateInterviewHistory() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const listPosition = useSelector((state) => state.public.positions);
  const customParseFormat = require("dayjs/plugin/customParseFormat");
  dayjs.extend(customParseFormat);
  const positionFilter =
    listPosition &&
    listPosition.map((item) => {
      return { text: item.name, value: item.name };
    });
  const authStatus = useSelector((state) => state.auth.status);
  const accessToken = localStorage.getItem("accessToken");
  const currentRole = localStorage.getItem("currentRole");
  useEffect(() => {
    if (!accessToken || (accessToken && !currentRole)) {
      navigate("/login");
    }
  }, [authStatus, currentRole, accessToken, navigate]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const listAppliedVacancies = await candidateApi.getInterviewHistory();
        setData(listAppliedVacancies);
        setLoading(false);
      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          setLoading(false);
        } else {
          navigate("/");
        }
      }
    };
    fetchInterview();
  }, [navigate]);

  function newPage(url) {
    return window.open(url, "_blank");
  }

  const tagColors = {
    COMPLETED: "green",
    PENDING: "blue",
    CANCELLED: "red",
    NULL: "orange",
  };
  const columns = [
    {
      title: "Position",
      key: "position",
      render: (record) => (
        <>
          <Typography.Title level={5}>
            {record.vacancy.position.name}
          </Typography.Title>
        </>
      ),
      filters: positionFilter,
      onFilter: (value, record) =>
        record.vacancy.position.name.indexOf(value) === 0,
      align: "center",
      filterSearch: true,
    },
    {
      title: "Location",
      key: "workingLocation",
      align: "center",
      render: (record) => (
        <Typography.Title level={5}>
          {record.vacancy.workingLocation
            ? record.vacancy.workingLocation.split(":")[0]
            : "NO"}
        </Typography.Title>
      ),
    },
    {
      title: "Interview Date",
      key: "interviewDate",
      align: "center",
      render: (record) => (
        <Typography>
          {record.interviewDatetime !== null
            ? dayjs(record.interviewDatetime.split("T")[0]).format("DD/MM/YYYY")
            : "WAITING"}
        </Typography>
      ),
      sorter: (a, b) => {
        if (a.interviewDatetime && b.interviewDatetime) {
          return (
            dayjs(a.interviewDatetime.split("T")[0]).format("DD/MM/YYYY") -
            dayjs(b.interviewDatetime.split("T")[0]).format("DD/MM/YYYY")
          );
        } else if (a.interviewDatetime) {
          return 1;
        } else if (b.interviewDatetime) {
          return -1;
        }

        return 0;
      },
    },
    {
      title: "Applied Date",
      key: "applyDate",
      align: "center",
      render: (record) => (
        <Typography>
          {record.applyDate
            ? dayjs(record.applyDate).format("DD/MM/YYYY")
            : "01/01/0001"}
        </Typography>
      ),
      sorter: (a, b) => {
        if (a.applyDate && b.applyDate) {
          return (
            dayjs(a.applyDate, "YYYY-MM-DD").unix() -
            dayjs(b.applyDate, "YYYY-MM-DD").unix()
          );
        } else if (a.applyDate) {
          return 1;
        } else if (b.applyDate) {
          return -1;
        }
        return 0;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return (
          <>
            <Tag color={tagColors[text ? text : "NULL"]}>
              {text ? text : "NULL"}
            </Tag>
          </>
        );
      },
      align: "center",
      filters: [
        { text: "COMPLETED", value: "COMPLETED" },
        { text: "PENDING", value: "PENDING" },
        { text: "NULL", value: "" },
        { text: "CANCELLED", value: "CANCELLED" },
      ],
      onFilter: (value, record) => {
        if (record.status !== null) {
          return record.status.indexOf(value) === 0;
        }
        if (value === "") return record.status === null;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <Tooltip title="Click to see CV">
              <Button
                icon={<EyeOutlined style={{ color: "green" }} />}
                onClick={() => {
                  newPage(`/view-resume?_resumeID=${record.cvId}`);
                }}
              ></Button>
            </Tooltip>
            <Tooltip title="Click to see position detail">
              <Button
                icon={<FolderOpenTwoTone />}
                onClick={() => {
                  newPage(`/positions/${record.vacancy.id}`);
                }}
              ></Button>
            </Tooltip>
          </>
        );
      },
      width: "10%",
    },
  ];

  return (
    <Space direction="vertical" className="CandidateInterviewHistory container">
      {loading ? (
        <Spin size="large" className="loading" />
      ) : (
        <div className="statistic">
          <div className="applicationsStatistic">
            <StatisticCard
              title="Interviews Statistic"
              data={data}
              filterType="applications"
            />
          </div>
          <div className="interviewStatistic">
            <StatisticCard
              title="Interviews Statistic"
              data={data}
              filterType="interviews"
            />
          </div>
        </div>
      )}
      <div className="table">
        <Table
          bordered
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.vacancy.id}
          className="HistoryTable"
          pagination={{
            pageSize: 10,
            position: ["bottomCenter"],
          }}
          loading={{
            indicator: (
              <div>
                <Spin size="large" />
              </div>
            ),
            spinning: loading,
          }}
        ></Table>
      </div>
    </Space>
  );
}
