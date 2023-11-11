import {
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import { authSelectors } from "features/auth/authSlice";
import { publicSelectors } from "features/public/publicSlice";
import {
  recruiterActions,
  recruiterSelectors,
} from "features/recruiter/recruiterSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./RecruiterHome.scss";
import recruiterApi from "api/recruiterApi";

let dataFilterVacancy = [];

function RecruiterHomeList() {
  // Get data api
  const { currentPositions } = useSelector(recruiterSelectors);
  const { currentUser } = useSelector(authSelectors);
  const { positions } = useSelector(publicSelectors);

  const dispatch = useDispatch();

  // State
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(currentPositions.status !== "200");
  const [isLoading, setLoading] = useState(true);
  const [modalText, setModalText] = useState("Wait for data loading...");
  const [modal, contextHolder] = Modal.useModal();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 7,
    },
  });
  const [status, setStatus] = useState(0);

  // Message
  const [messageApi, contextMessage] = message.useMessage();

  const messageError = useCallback(
    (content) => {
      messageApi.open({
        type: "error",
        content: content,
        duration: 2,
      });
    },
    [messageApi]
  );

  const messageLoading = useCallback(
    (content) => {
      messageApi.open({
        type: "loading",
        content: content,
        duration: 0,
      });
    },
    [messageApi]
  );

  const messageSuccess = useCallback(
    (content) => {
      messageApi.open({
        type: "success",
        content: content,
        duration: 3,
      });
    },
    [messageApi]
  );

  const [dataFilterLocation, setDataFilterLocation] = useState([]);

  // Navigate
  const navigate = useNavigate();

  // Function
  const clearAll = useCallback(() => {
    setFilteredInfo({});
    setSortedInfo({});
  }, []);

  const confirm = useCallback(
    (record) => {
      modal.confirm({
        title: "Confirm",
        icon: <ExclamationCircleOutlined />,
        content: "Do you really want to create a new vacancy?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          return navigate("/recruiter/positions/create-position");
        },
      });
    },
    [modal, navigate]
  );

  const handleView = useCallback(
    (id) => {
      navigate(`/recruiter/positions/${id}`, {
        state: {
          id: id,
        },
      });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id) => {
      navigate(`/recruiter/positions/update-position/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (record) => {
      messageLoading("Deleting...");
      await recruiterApi
        .updatePosition({ ...record, status: "0" })
        .then((res) => {
          const newData = data.filter((object) => {
            return object.id !== record.id;
          });
          setData(newData);
          messageApi.destroy();
          messageSuccess("Delete successfully!");
          dispatch(recruiterActions.getPositions({ page: 1, limit: 300 }));
          // console.log(res);
        })
        .catch((err) => {
          messageApi.destroy();
          messageError(`Delete failed! (error: ${err.message})`);
          // console.log(err);
        });
    },
    [data, dispatch, messageApi, messageError, messageLoading, messageSuccess]
  );

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  }, []);

  // Set up columns
  const columns = [
    {
      title: "Vacancy",
      dataIndex: "position",
      key: "position",
      render: (position) => `${position.name}`,
      filters: dataFilterVacancy,
      filterSearch: true,
      filteredValue: filteredInfo.position
        ? filteredInfo.position
        : null || null,
      onFilter: (value, record) => {
        if (record.position && record.position.name) {
          return record.position.name.includes(value);
        }
      },
      width: "15%",
      fixed: "left",
    },
    {
      title: "Total needed",
      dataIndex: "totalNeeded",
      key: "totalNeeded",
      sort: true,
      sorter: (a, b) => a.totalNeeded - b.totalNeeded,
      sortOrder:
        sortedInfo.columnKey === "totalNeeded" ? sortedInfo.order : null,
      width: "8%",
    },
    {
      title: "Working location",
      dataIndex: "workingLocation",
      key: "workingLocation",
      filters: dataFilterLocation,
      filterSearch: true,
      filteredValue: filteredInfo.workingLocation || null,
      onFilter: (value, record) => {
        if (record.workingLocation) {
          return record.workingLocation.includes(value);
        }
      },
      width: "24%",
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      sort: true,
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      sortOrder: sortedInfo.columnKey === "startDate" ? sortedInfo.order : null,
      width: "11%",
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
      sort: true,
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      sortOrder: sortedInfo.columnKey === "endDate" ? sortedInfo.order : null,
      width: "10%",
    },
    {
      title: "State",
      key: "status",
      width: "11%",

      filters: [
        {
          text: "Coming",
          value: "Coming",
        },
        {
          text: "In process",
          value: "In process",
        },
        {
          text: "Completed",
          value: "Completed",
        },
      ],
      filterSearch: true,
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => {
        const startDates = new Date(record.startDate);
        const endDates = new Date(record.endDate);
        const date = new Date();
        if (value === "Coming") {
          return date < startDates;
        }
        if (value === "In process") {
          return endDates > date && date >= startDates;
        }
        if (value === "Completed") {
          return endDates <= date;
        }
      },

      render: (text, record) => {
        let status = "In process";
        let color = "#87d068";
        let icon = <CheckCircleOutlined twoToneColor="#52c41a" />;
        const startDates = new Date(record.startDate);
        const endDates = new Date(record.endDate);
        const date = new Date();
        if (startDates > date) {
          color = "#108ee9";
          status = "Coming";
          icon = <ClockCircleOutlined twoToneColor="#FF3939" />;
        } else if (endDates <= date) {
          color = "#f50";
          status = "Completed";
          icon = <CloseCircleOutlined twoToneColor="#FF3939" />;
        }

        return (
          <Tag
            color={color}
            key={status}
            icon={icon}
            style={{ fontWeight: "bold" }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Recruiter",
      dataIndex: "recruiter",
      key: "recruiter",
      render: (recruiter) => {
        if (recruiter) {
          if (recruiter.firstName && recruiter.lastName) {
            return `${recruiter.firstName + " " + recruiter.lastName}`;
          } else if (recruiter.firstName) {
            return `${recruiter.firstName}`;
          } else if (recruiter.lastName) {
            return `${recruiter.lastName}`;
          }
        }
        return `${recruiter.email}`;
      },
      width: "13%",
    },
    {
      title: "Action",
      dataIndex: "uuid",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="small">
            <Tooltip title="Click to view detail">
              <Button
                type="link"
                onClick={() => {
                  return handleView(record.id);
                }}
                className="btn-action btn-view"
                style={{ color: "green" }}
                icon={<EyeOutlined />}
              ></Button>
            </Tooltip>
            <Tooltip title="Click to edit">
              <Button
                type="link"
                onClick={() => {
                  return handleEdit(record.id);
                }}
                className="btn-action btn-edit"
                style={{ color: "blue" }}
                icon={<EditOutlined />}
              ></Button>
            </Tooltip>
            <Popconfirm
              title="Delete this task"
              description="Are you sure to delete this task?"
              onConfirm={(e) => {
                return handleDelete(record);
              }}
              onCancel={() => { }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                className="btn-action btn-delete"
                style={{ color: "red" }}
                icon={<DeleteOutlined />}
              ></Button>
            </Popconfirm>
          </Space>
        );
      },
      width: "8%",
    },
  ];

  // Effect
  useEffect(() => {
    // Dispatch actions
    if (isLoading) {
      if (!currentUser) {
        navigate("/login");
      }
      if (!currentPositions.status) {
        dispatch(recruiterActions.getPositions({ page: 1, limit: 300 }));
      } else {
        if (currentPositions.status === "200") {
          const responseData = [...currentPositions.data].filter((object) => {
            return object.recruiter.id === currentUser.id;
          });
          // console.log(responseData);
          if (responseData.length !== 0) {
            setData(responseData);

            // Filter location
            let newArray = [...dataFilterLocation];
            for (let i = 0; i < responseData.length; i++) {
              if (
                !newArray.some((object) => {
                  return (
                    object.value === responseData[i].workingLocation ||
                    responseData[i].workingLocation === "" ||
                    responseData[i].workingLocation === null
                  );
                })
              ) {
                const toSetData = {
                  text: responseData[i].workingLocation,
                  value: responseData[i].workingLocation,
                };
                newArray.push(toSetData);
              }
            }
            setDataFilterLocation(newArray);

            // Filter vacancy
            for (let i = 0; i < positions.length; i++) {
              dataFilterVacancy.push({
                text: positions[i].name,
                value: positions[i].name,
              });
            };
            setLoading(false);
            setStatus(1);
            setModalText("Loading success!");
            setTimeout(() => {
              setOpenModal(false);
            }, 1000);
          } else {
            setLoading(false);
            setStatus(-1);
            setData([]);
            setModalText("You haven't been assigned any vacancies yet!");
            setTimeout(() => {
              setOpenModal(false);
            }, 1500);
          }
        } else if (currentPositions.status === "403") {
          setLoading(false);
          setStatus(-1);
          setData([]);
          setModalText("You haven't been assigned any vacancies yet!");
          setTimeout(() => {
            setOpenModal(false);
          }, 1500);
        }
      }
    }
    return () => { };
  }, [
    currentPositions.data,
    currentPositions.status,
    currentUser,
    dataFilterLocation,
    dispatch,
    isLoading,
    navigate,
    positions,
  ]);

  useEffect(() => {
    // Modal function
    if (document.getElementsByClassName("ant-modal-close").length === 1) {
      document
        .getElementsByClassName("ant-modal-close")[0]
        .addEventListener("click", () => {
          setOpenModal(false);
        });
    }
    return () => { };
  }, []);

  return (
    <div className="RecruiterHome internal-container">
      {contextMessage}
      <Modal
        title={
          status !== 1
            ? status === -1
              ? "Failed!"
              : "Loading..."
            : "Success!"
        }
        open={openModal}
        cancelButtonProps={false}
        footer={null}
        bodyStyle={{ padding: "15px", fontSize: "1.2rem" }}
      >
        <p
          style={
            status !== 1
              ? status === -1
                ? { color: "red" }
                : { color: "orange" }
              : { color: "green" }
          }
        >
          {status !== 1 ? (
            status === -1 ? (
              <StopOutlined
                style={{ marginRight: "15px", fontSize: "1.5rem" }}
              />
            ) : (
              <LoadingOutlined
                style={{ marginRight: "15px", fontSize: "1.5rem" }}
              />
            )
          ) : (
            <CheckOutlined
              style={{ marginRight: "15px", fontSize: "1.5rem" }}
            />
          )}
          {modalText}
        </p>
      </Modal>

      {!isLoading && (
        <>
          <Space className="btn-main-wrapper">
            <Button
              type="primary"
              onClick={() => {
                return confirm();
              }}
              style={{
                width: "100px",
                height: "40px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              ADD
            </Button>
            <Button
              onClick={clearAll}
              style={{
                textTransform: "uppercase",
                height: "40px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Clear filters and sorters
            </Button>
          </Space>
          {contextHolder}
          <Card
            title="Manage vacancies"
            className="table-wrapper"
            bodyStyle={{ padding: 0 }}
            headStyle={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            <Table
              columns={columns}
              rowKey={(record) => `${record.id}`}
              dataSource={data}
              pagination={tableParams.pagination}
              loading={isLoading}
              onChange={handleTableChange}
              size="middle"
              className="RecruiterHome-main"
            />
            <Table
              columns={columns}
              rowKey={(record) => `${record.id}`}
              dataSource={data}
              pagination={tableParams.pagination}
              loading={isLoading}
              onChange={handleTableChange}
              className="RecruiterHome-sub"
              size="middle"
              scroll={{
                x: 1100,
              }}
            />
          </Card>
        </>
      )}
    </div>
  );
}

export default function RecruiterHome() {
  return <RecruiterHomeList />;
}
