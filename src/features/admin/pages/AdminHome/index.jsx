import {
  CheckCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteOutlined,
  EyeOutlined,
  HourglassTwoTone,
  LoadingOutlined,
  SolutionOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Modal,
  Popconfirm,
  Result,
  Row,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./adminhome.scss";

import { CustomTable } from "components/Common";

import { Link } from "react-router-dom";

import adminApi from "api/adminApi";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

export default function AdminHome() {
  const skills = useSelector((state) => state.public.skills);
  const levels = useSelector((state) => state.public.levels);

  const [skillFilter, setSkillFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState([]);

  const [totalNeeded, setTotalNeeded] = useState();
  const [remainingNeeded, setRemainingNeeded] = useState();
  const [openingVacancy, setOpeningVacancy] = useState();

  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchModalOpen, setFetchModalOpen] = useState(false);

  const [error, setError] = useState({
    status: null,
    message: null,
  });

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setSkillFilter(
      skills.map((skill) => ({
        text: `${skill.name}`,
        value: `${skill.name}`,
      }))
    );
    setLevelFilter(
      levels.map((level) => ({
        text: `${level.name}`,
        value: `${level.name}`,
      }))
    );
  }, [skills, levels]);

  useEffect(() => {
    setPageLoading(true);
    setFetchModalOpen(true);
    const fetchAdminVacancies = async () => {
      try {
        const response = await adminApi.getVacancies();
        setTableData(response);

        setError({
          status: null,
          message: null,
        });

        let openingCount = response.reduce((accumulator, currentValue) => {
          const endDates = new Date(currentValue.endDate);
          const date = new Date();
          if (endDates > date) {
            return accumulator + 1;
          } else return accumulator;
        }, 0);
        setOpeningVacancy(openingCount);

        let totalNeed = response.reduce((accumulator, currentValue) => {
          if (currentValue.totalNeeded !== null) {
            return accumulator + currentValue.totalNeeded;
          } else return accumulator;
        }, 0);
        setTotalNeeded(totalNeed);

        let remaining = response.reduce((accumulator, currentValue) => {
          if (currentValue.remainingNeeded !== null) {
            return accumulator + currentValue.remainingNeeded;
          } else return accumulator;
        }, 0);
        setRemainingNeeded(remaining);

        setPageLoading(false);
      } catch (error) {
        setTimeout(() => {
          messageApi.open({
            type: "error",
            content: `Failed to load data`,
            style: {
              marginTop: "4rem",
            },
          });
        }, 500);

        switch (error.response.status) {
          case 404:
            return setError({
              status: 404,
              message: "Không tìm thấy vị trí tuyển dụng !!!",
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
    fetchAdminVacancies();
  }, [messageApi]);

  const handleDeleteCVOK = (vacancyId) => {
    setLoading(true);
    const deleteTodo = async () => {
      try {
        const response = await adminApi.hideVacancy(vacancyId);
        const itemfiltered = tableData.filter((item) => item.id !== vacancyId);
        setTableData(itemfiltered);

        const endDates = new Date(response.endDate);
        const date = new Date();

        if (endDates > date) setOpeningVacancy(openingVacancy - 1);

        setTotalNeeded(totalNeeded - response.totalNeeded);

        setRemainingNeeded(remainingNeeded - response.remainingNeeded);

        setLoading(false);
        messageApi.open({
          type: "success",
          content: "Delete successfully",
          style: {
            marginTop: "4rem",
          },
        });
      } catch (error) {
        setLoading(false);
        messageApi.open({
          type: "error",
          content: "Failed to delete",
          style: {
            marginTop: "4rem",
          },
        });
      }
    };
    deleteTodo();
  };

  const handleDeleteCVCancel = () => {
    messageApi.open({
      type: "error",
      content: "Clicked on No",
      style: {
        marginTop: "4rem",
      },
    });
  };

  const columns = [
    {
      title: "Position",
      dataIndex: "position_name",
      key: "position_name",
      align: "center",
      isSearchByValue: true,
    },
    {
      title: "Level",
      dataIndex: "candidate_level",
      key: "candidate_level",
      align: "center",

      filters: levelFilter,
      onFilter: (value, record) => {
        let isFilter = false;
        record.level.map((item) => {
          if (item.name.startsWith(value)) isFilter = true;
          return true;
        });
        return isFilter;
      },

      render: (text, record) => (
        <>
          {record.level.map((item, index) => {
            return <div key={index}>{item.name}</div>;
          })}
        </>
      ),
    },
    {
      title: "Skill",
      dataIndex: "skill",
      key: "skill",
      align: "center",
      filters: skillFilter,
      onFilter: (value, record) => {
        let isFilter = false;
        record.skill.map((item) => {
          if (item.name.startsWith(value)) isFilter = true;
          return true;
        });
        return isFilter;
      },

      render: (text, record) => (
        <>
          {record.skill.map((item, index) => {
            return <div key={index}>{item.name}</div>;
          })}
        </>
      ),
    },
    {
      title: "Recruiter",
      dataIndex: "recruiter_name",
      key: "recruiter_name",
      align: "center",

      render: (text, record) =>
        `${record.recruiter.firstName} ${record.recruiter.lastName}`,
    },
    {
      title: "Total needed",
      dataIndex: "totalNeeded",
      key: "totalNeeded",
      align: "center",
      width: "10%",
    },
    {
      title: "Remaining",
      dataIndex: "remainingNeeded",
      key: "remainingNeeded",
      align: "center",
      width: "10%",
    },
    {
      title: "State",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "10%",
      defaultSortOrder: "descend",
      sorter: (record) => {
        const endDates = new Date(record.endDate);
        const date = new Date();
        return endDates - date;
      },
      filters: [
        {
          text: "Opening",
          value: "Opening",
        },
        {
          text: "Closed",
          value: "Closed",
        },
      ],
      onFilter: (value, record) => {
        const endDates = new Date(record.endDate);
        const date = new Date();
        if (value === "Opening") {
          return endDates > date;
        }
        if (value === "Closed") {
          return endDates <= date;
        }
      },

      render: (text, record) => {
        let status = "Opening";
        let color = "#03a65f";
        let icon = <CheckCircleTwoTone twoToneColor="#52c41a" />;
        const endDates = new Date(record.endDate);
        const date = new Date();
        if (endDates <= date) {
          color = "#fa4039";
          status = "Closed";
          icon = <CloseCircleTwoTone twoToneColor="#FF3939" />;
        }

        return (
          <Tag color={color} key={status} icon={icon}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: "10%",

      render: (text, record) => (
        <Space>
          <Tooltip title="View position detail" placement="top">
            <Link to={`positions/${record.id}`}>
              <Button
                type="text"
                icon={<EyeOutlined />}
                style={{
                  backgroundColor: "#2f6ced",
                  color: "white",
                }}
              />
            </Link>
          </Tooltip>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDeleteCVOK(record.id)}
            onCancel={handleDeleteCVCancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              style={{
                backgroundColor: "#ed2f2f",
                color: "white",
              }}
            />
          </Popconfirm>
        </Space>
      ),
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

      {error.status && (
        <Result
          className="result"
          status={`${error.status}`}
          title={`${error.status}`}
          subTitle={error.message}
        />
      )}

      {!pageLoading && (
        <div className="admin-rec-position internal-container">
          <Row gutter={[0, 16]} justify="space-between">
            <Col xl={5} sm={11}>
              <Card style={{ backgroundColor: "#3395ff" }}>
                <Row>
                  <Col span={19}>
                    <Typography.Text type="secondary" strong>
                      POSITION QUANTITY
                    </Typography.Text>
                    <Typography.Title level={2}>
                      {tableData.length}
                    </Typography.Title>
                  </Col>
                  <Col span={5}>
                    <SolutionOutlined />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xl={5} sm={11}>
              <Card style={{ backgroundColor: "#5ac8fa" }}>
                <Row>
                  <Col span={19}>
                    <Typography.Text type="secondary" strong>
                      TOTAL NEEDED
                    </Typography.Text>
                    <Typography.Title level={2}>{totalNeeded}</Typography.Title>
                  </Col>
                  <Col span={5}>
                    <UnorderedListOutlined />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xl={5} sm={11}>
              <Card style={{ backgroundColor: "#FF9500" }}>
                <Row>
                  <Col span={19}>
                    <Typography.Text type="secondary" strong>
                      REMAINING NEEDED
                    </Typography.Text>
                    <Typography.Title level={2}>
                      {remainingNeeded}
                    </Typography.Title>
                  </Col>
                  <Col span={5}>
                    <TeamOutlined />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xl={5} sm={11}>
              <Card style={{ backgroundColor: "#3DAE50" }}>
                <Row>
                  <Col span={19}>
                    <Typography.Text type="secondary" strong>
                      OPENING
                    </Typography.Text>
                    <Typography.Title level={2}>
                      {openingVacancy}
                    </Typography.Title>
                  </Col>
                  <Col span={5}>
                    <CheckCircleOutlined />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Card className="RecruitmentTable" title="Recruitment">
            <Spin spinning={loading} size="large">
              <CustomTable columns={columns} data={tableData} />
            </Spin>
          </Card>
        </div>
      )}
    </Fragment>
  );
}
