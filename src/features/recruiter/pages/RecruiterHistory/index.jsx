import {
  AuditOutlined,
  CalculatorOutlined,
  CheckOutlined,
  LoadingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Card, Modal, Space, Table, Tooltip } from "antd";
import { authSelectors } from "features/auth/authSlice";
import { publicSelectors } from "features/public/publicSlice";
import {
  recruiterActions,
  recruiterSelectors,
} from "features/recruiter/recruiterSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./RecruiterHistory.scss";

let dataFilterPosition = [];

function RecruiterHistory() {
  //get data API
  const { currentUser } = useSelector(authSelectors);
  const { currentHistory } = useSelector(recruiterSelectors);
  const { positions } = useSelector(publicSelectors);

  const dispatch = useDispatch();

  // Location
  const location = useLocation();

  //State
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(currentHistory.status != "200");
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
  const [dataFilterLocation, setDataFilterLocation] = useState([]);
  // Navigate
  const navigate = useNavigate();
  // Function
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // Set up columns
  const columns = [
    {
      title: "Candidate",
      dataIndex: "candidateVacancy",
      key: "candidateVacancy",
      render: (candidateVacancy) =>
        `${candidateVacancy.candidate.firstName}
          ${candidateVacancy.candidate.lastName}`,
      width: "20%",
    },
    {
      title: "Job position",
      dataIndex: "candidateVacancy",
      key: "candidateVacancy",
      render: (candidateVacancy) => `${candidateVacancy.vacancy.position.name}`,
      filters: dataFilterPosition,
      filterSearch: true,
      filteredValue: filteredInfo.candidateVacancy
        ? filteredInfo.candidateVacancy
        : null || null,
      onFilter: (value, record) => {
        if (
          record.candidateVacancy &&
          record.candidateVacancy.vacancy.position.name
        )
          return record.candidateVacancy.vacancy.position.name.includes(value);
      },

      width: "15%",
    },
    {
      title: "Place",
      dataIndex: "venue",
      key: "venue",
    },
    {
      title: "Time",
      dataIndex: "interviewDatetime",
      sort: true,
      sorter: (a, b) =>
        moment(a.interviewDatetime) - moment(b.interviewDatetime),
      render: (datetime) => moment(datetime).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Interviewer",
      dataIndex: "interviewer",
      render: (interviewer) =>
        interviewer ? `${interviewer.firstName} ${interviewer.lastName}` : "",
    },
    // {
    //   title: "Total score",
    //   dataIndex: "totalScore",
    //   sorter: (a, b) => a.totalScore - b.totalScore,
    // },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      width: "10%",
      render: (_, record) => {
        return (
          <Space size="small">
            <Tooltip title="Detail score">
              <Link to={`/recruiter/interviews/${record.id}`} target="_blank">
                <Button
                  type="link"
                  style={{ color: "green" }}
                  target="_blank"
                  size="medium"
                  icon={<CalculatorOutlined />}
                  className="btn-action btn-calculator"
                ></Button>
              </Link>
            </Tooltip>
            <Tooltip title="Candidate's CV">
              <Link
                to={`/view-resume?_interviewID=${record.id}`}
                target="_blank"
              >
                <Button
                  type="link"
                  style={{ color: "blue" }}
                  target="_blank"
                  size="medium"
                  icon={<AuditOutlined />}
                  className="btn-action btn-view"
                ></Button>
              </Link>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (isLoading) {
      if (!currentUser) {
        navigate("/login");
      }
      if (!currentHistory.status) {
        dispatch(recruiterActions.getHistory());
      } else {
        if (currentHistory.status === "200") {
          setData(
            [...currentHistory.data]
              .filter((object) => {
                return object.recruiter.id === currentUser.id;
              })
              .reverse()
          );

          // Filter vacancy
          for (let i = 0; i < positions.length; i++) {
            dataFilterPosition.push({
              text: positions[i].name,
              value: positions[i].name,
            });
          }

          setLoading(false);
          setModalText("Loading success!");
          setTimeout(() => {
            setOpenModal(false);
          }, 1000);
        } else if (currentHistory.status === "403") {
          if (location.state) {
            window.history.replaceState({}, document.title);
          } else {
            setModalText("Loading failed!");
          }
        }
      }
    }

    //Modal funtion
    if (document.getElementsByClassName("ant-modal-close").length === 1) {
      document
        .getElementsByClassName("ant-modal-close")[0]
        .addEventListener("click", () => {
          setOpenModal(false);
        });
    }

    return () => {};
  }, [
    currentHistory,
    currentHistory.status,
    dispatch,
    isLoading,
    dataFilterLocation,
    positions,
  ]);
  return (
    <>
      <div className="HistoryReccer internal-container">
        <Modal
          title={
            isLoading
              ? currentHistory.status === "403"
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
              isLoading
                ? currentHistory.status === "403"
                  ? { color: "red" }
                  : { color: "orange" }
                : { color: "green" }
            }
          >
            {isLoading ? (
              currentHistory.status === "403" ? (
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
            {contextHolder}
            <Card
              title="Manage history"
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
                size="small"
                className="HomeReccer-main"
              />
              <Table
                columns={columns}
                rowKey={(record) => `${record.id}`}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={isLoading}
                onChange={handleTableChange}
                size="small"
                className="HomeReccer-sub"
                scroll={{
                  x: 1100,
                }}
              />
            </Card>
          </>
        )}
      </div>
    </>
  );
}

export default RecruiterHistory;
