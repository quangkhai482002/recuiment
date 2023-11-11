import { Card, Tabs } from "antd";
import AccountTab from "components/Common/AccountTab";
import "./ManageAccount.scss";
import { DesktopOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
// import { useState } from "react";


function AdminManageAccount() {
  const items = [
    {
      key: "1",
      label: <span><DesktopOutlined/>Recruiter</span>,
      children: <AccountTab role={"Recruiter"} />,
    },
    {
      key: "2",
      label: <span><SolutionOutlined/>Interviewer</span>,
      children: <AccountTab role={"Interviewer"} />,
    },
    {
      key: "3",
      label: <span><UserOutlined/>Candidate</span>,
      children: <AccountTab role={"Candidate"} />,
    },
  ];

  return (
    <div className="ManageAccount internal-container">
      <Card size="large">
        <Tabs
          defaultActiveKey="1"
          items={items}
          type="card"
          size="middle"
          tabBarGutter={0}
          centered
        />
      </Card>
    </div>
  );
}
export default AdminManageAccount;
