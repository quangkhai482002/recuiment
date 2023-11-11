import { Descriptions, Skeleton, Space, Table } from "antd";
import recruiterApi from "api/recruiterApi";
import { NotFound } from "components/Common";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./RecruiterViewEventDetail.scss";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { authSelectors } from "features/auth/authSlice";
import { useSelector } from "react-redux";
dayjs.extend(customParseFormat);

export default function RecruiterViewEventDetail() {
  const { currentUser } = useSelector(authSelectors);

  // Param
  const { id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({});
  const [data, setData] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchApi = useCallback(async () => {
    await recruiterApi
      .getEventById({ id: id })
      .then((res) => {
        if (res.recruiter.id !== currentUser.id) {
          setNotFound(true);
          setLoading(false);
        } else {
          setEventData(res);
          recruiterApi
            .getCandidatesCollectedEvent({ id: id })
            .then((res) => {
              setData(res);
              setLoading(false);
              // console.log("Get list success! (", `${res})`);
            })
            .catch((err) => {
              setData([]);
              setLoading(false);
              console.log("Get list failed! (", `${err})`);
            });
        }
        // console.log("Get event success! (", `${res})`);
      })
      .catch((err) => {
        setNotFound(true);
        setLoading(false);
        console.log("Get event failed! (", `${err})`);
      });
  }, [currentUser.id, id]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const columns = [
    {
      title: "First name",
      dataIndex: "firstName",
      key: "name",
      width: "12%",
      fixed: "left",
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
      width: "12%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "35%",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "15%",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      width: "15%",
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
      filters: [
        {
          text: "Male",
          value: 1,
        },
        {
          text: "Female",
          value: 0,
        },
      ],
      onFilter: (value, record) => {
        return record.sex === value;
      },
      render: (value, record) => {
        switch (value) {
          case 0:
            return "Female";
          case 1:
            return "Male";
          default:
            return "Male";
        }
      },
      width: "11%",
    },
  ];

  useEffect(() => {
    if (isLoading) {
      fetchApi();
    }
    return () => { };
  }, [fetchApi, isLoading]);

  return (
    <>
      {isLoading ? (
        <Skeleton active style={{ padding: "30px" }} />
      ) : notFound ? (
        <NotFound />
      ) : (
        <Space
          className="RecruiterViewEventDetail"
          size="large"
          direction="vertical"
        >
          <Descriptions
            bordered
            title={<h1>Event</h1>}
            size="default"
            className="positionSummary"
            style={{
              textAlign: "center",
            }}
          >
            <Descriptions.Item
              label="Event"
              contentStyle={{ textAlign: "center" }}
            >
              <h2>{eventData.name ? eventData.name : ""}</h2>
            </Descriptions.Item>
            <Descriptions.Item label="Create at">
              {eventData.createAt
                ? dayjs(eventData.createAt).format("YYYY-MM-DD")
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {
                new Date(eventData.startDate) > new Date() ? "Coming" : (
                  new Date(eventData.endDate) > new Date()
                ) ? "In process" : "Completed"
              }
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {eventData.location ? eventData.location : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Start date">
              {eventData.startDate
                ? dayjs(eventData.startDate).format("YYYY-MM-DD")
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="End date">
              {eventData.endDate
                ? dayjs(eventData.endDate).format("YYYY-MM-DD")
                : ""}
            </Descriptions.Item>
          </Descriptions>
          <h1>List of Applications</h1>
          <Table
            columns={columns}
            rowKey={(record) => `${record.id}`}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={isLoading}
            onChange={handleTableChange}
            size="middle"
            className="RecruiterViewEventDetail-main"
          />
          <Table
            columns={columns}
            rowKey={(record) => `${record.id}`}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={isLoading}
            onChange={handleTableChange}
            className="RecruiterViewEventDetail-sub"
            size="middle"
            scroll={{
              x: 1100,
            }}
          />
        </Space>
      )}
    </>
  );
}
