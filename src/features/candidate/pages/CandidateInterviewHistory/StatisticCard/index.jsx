import { Card} from "antd";
import React, { useState } from "react";
import "./StatisticCard.scss";
import dayjs from "dayjs";

export default function StatisticCard({ title, data, filterType }) {
  const [activeTab, setActiveTab] = useState("week");
  const onTabChange = (key) => {
    setActiveTab(key);
  };
  var isBetween = require("dayjs/plugin/isBetween");
  dayjs.extend(isBetween);

  const type = {
    applications: "applyDate",
    interviews: "interviewDatetime",
  };

  const listThisWeek = data
    ? data.filter((item) => {
        return dayjs(item[type[filterType]]).isBetween(
          dayjs().startOf("week"),
          dayjs().endOf("week")
        );
      })
    : [];

  const listLastWeek = data
    ? data.filter((item) => {
        return dayjs(item[type[filterType]]).isBetween(
          dayjs().subtract(7, "day").startOf("week"),
          dayjs().subtract(7, "day").endOf("week")
        );
      })
    : [];

  const listThisMonth = data
    ? data.filter((item) => {
        return dayjs(item[type[filterType]]).isBetween(
          dayjs().startOf("month"),
          dayjs().endOf("month")
        );
      })
    : [];
  const listLastMonth = data
    ? data.filter((item) => {
        return dayjs(item[type[filterType]]).isBetween(
          dayjs().subtract(1, "month").startOf("month"),
          dayjs().subtract(1, "month").endOf("month")
        );
      })
    : [];

  const contentTab = {
    week: (
      <>
        <p>
          This week you have {listThisWeek.length} {filterType}
        </p>
        <p>
          Last week you have {listLastWeek.length} {filterType}
        </p>
      </>
    ),
    month: (
      <>
        <p>
          This month you have {listThisMonth.length} {filterType}
        </p>
        <p>
          Last month you have {listLastMonth.length} {filterType}
        </p>
      </>
    ),
  };
  const tabList = [
    {
      key: "week",
      tab: "week",
    },
    {
      key: "month",
      tab: "month",
    },
  ];

  return (
    <Card
      title={title}
      tabList={tabList}
      hoverable={true}
      tabProps={{
        size: "large",
        centered: true,
        animated: { inkBar: true, tabPane: true },
      }}
      className="card"
      onTabChange={onTabChange}
      activeTabKey={activeTab}
    >
      {contentTab[activeTab]}
    </Card>
  );
}
