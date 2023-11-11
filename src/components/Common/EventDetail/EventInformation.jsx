import {
  CalendarOutlined,
  CheckOutlined,
  HighlightOutlined,
  HomeOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { DatePicker, Space, Typography } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";

const { Paragraph } = Typography;
const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
const date = new Date();

export default function EventInformation({
  type,
  location,
  setLocation,
  createAt,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  classify,
}) {
  const [state, setState] = useState();

  useEffect(() => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    if (date < sDate) {
      setState("Coming");
    } else if (date < eDate) {
      setState("In process");
    } else if (date > eDate) {
      setState("Completed");
    }
    return () => {};
  }, [startDate, endDate]);

  const formatDate = ({ date, month, year }) => {
    if (date < 10) {
      date = "0" + date;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    return `${year}-${month}-${date}`;
  };

  return (
    <>
      <ul>
        <li>
          <Paragraph
            editable={
              (classify === "edit" || classify === "add") && {
                text: location,
                icon: <HighlightOutlined />,
                tooltip: "Click to edit location",
                onChange: setLocation,
                enterIcon: <CheckOutlined />,
              }
            }
            style={{ fontSize: "1rem", width: "400px", height: "33.14px" }}
          >
            <HomeOutlined style={{ color: "orange" }} /> Location:{"  "}
            <strong style={{ textAlign: "right" }}>{location}</strong>
          </Paragraph>
        </li>
        <li>
          <Paragraph style={{ fontSize: "1rem", height: "33.14px" }}>
            <CalendarOutlined style={{ color: "orange" }} /> Create at:{" "}
            <strong style={{ textAlign: "right" }}>{createAt}</strong>
          </Paragraph>
        </li>
        {type === "sub" && (
          <>
            <li>
              <Paragraph style={{ fontSize: "1rem" }}>
                <LineChartOutlined style={{ color: "orange" }} /> Status:{" "}
                <strong
                  style={{
                    textAlign: "right",
                    color: `${
                      state === "Completed"
                        ? "red"
                        : state === "In process"
                        ? "green"
                        : "blue"
                    }`,
                  }}
                >
                  {state}
                </strong>
              </Paragraph>
            </li>
            <li>
              <Paragraph>
                <CalendarOutlined
                  style={{ color: "orange", fontSize: "1rem" }}
                />{" "}
                Time:{" "}
                {classify === "view" && (
                  <Space direction="vertical" size={12}>
                    <RangePicker
                      style={{
                        border: "none",
                        backgroundColor: "white",
                      }}
                      suffixIcon={""}
                      defaultValue={[
                        dayjs(startDate, "YYYY-MM-DD"),
                        dayjs(endDate, "YYYY-MM-DD"),
                      ]}
                      format={dateFormat}
                    />
                  </Space>
                )}
                {(classify === "edit" || classify === "add") && (
                  <Space direction="vertical" size={12}>
                    <RangePicker
                      style={{
                        border: "none",
                        width: "280px",
                      }}
                      defaultValue={[
                        dayjs(startDate, "YYYY-MM-DD"),
                        dayjs(endDate, "YYYY-MM-DD"),
                      ]}
                      format={dateFormat}
                    />
                  </Space>
                )}
              </Paragraph>
            </li>
          </>
        )}
      </ul>
      {type === "main" && (
        <ul>
          <li>
            <Paragraph style={{ fontSize: "1rem", height: "35px" }}>
              <LineChartOutlined style={{ color: "orange" }} /> Status:{" "}
              <strong
                style={{
                  textAlign: "right",
                  color: `${
                    state === "Completed"
                      ? "red"
                      : state === "In process"
                      ? "green"
                      : "blue"
                  }`,
                }}
              >
                {state}
              </strong>
            </Paragraph>
          </li>
          <li>
            <Paragraph style={{ fontSize: "1rem", height: "33.14px" }}>
              <CalendarOutlined style={{ color: "orange" }} /> Time:{" "}
              {classify === "view" && (
                <Space direction="vertical" size={12}>
                  <RangePicker
                    style={{
                      border: "none",
                      backgroundColor: "white",
                    }}
                    disabled
                    suffixIcon={""}
                    defaultValue={[
                      dayjs(startDate, "YYYY-MM-DD"),
                      dayjs(endDate, "YYYY-MM-DD"),
                    ]}
                    format={dateFormat}
                  />
                </Space>
              )}
              {(classify === "edit" || classify === "add") && (
                <Space direction="vertical" size={12}>
                  <RangePicker
                    style={{
                      border: "none",
                      width: "280px",
                    }}
                    onChange={(e) => {
                      let sDate = {
                        date: e[0].$d.getDate(),
                        month: e[0].$d.getMonth() + 1,
                        year: e[0].$d.getFullYear(),
                      };
                      setStartDate(formatDate(sDate));
                      let eDate = {
                        date: e[1].$d.getDate(),
                        month: e[1].$d.getMonth() + 1,
                        year: e[1].$d.getFullYear(),
                      };
                      setEndDate(formatDate(eDate));
                    }}
                    defaultValue={[
                      dayjs(startDate, "YYYY-MM-DD"),
                      dayjs(endDate, "YYYY-MM-DD"),
                    ]}
                    format={dateFormat}
                  />
                </Space>
              )}
            </Paragraph>
          </li>
        </ul>
      )}
    </>
  );
}
