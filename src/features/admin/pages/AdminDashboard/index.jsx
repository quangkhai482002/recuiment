import { LoadingOutlined } from "@ant-design/icons";
import {
  Col,
  Descriptions,
  Progress,
  Row,
  Spin,
  Statistic,
  Typography,
} from "antd";
import adminApi from "api/adminApi";
import { useCallback, useEffect, useState } from "react";
import "./AdminDashboard.scss";
const { Countdown } = Statistic;
const date = new Date();
const deadline =
  Date.now() +
  1000 * 60 * 60 * 24 -
  1000 *
    (date.getHours() * 60 * 60 +
      date.getMinutes() * 60 +
      date.getMilliseconds()); // Dayjs is also OK

const onFinish = () => {
  console.log("finished!");
};

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [users, setUsers] = useState(null);
  const [pending, setPending] = useState(false);
  const fetchUser = useCallback(async () => {
    setPending(true);
    const users = await Promise.all([
      await adminApi.getAccountByRole({ role: "recruiter" }).catch(() => []),
      await adminApi.getAccountByRole({ role: "interviewer" }).catch(() => []),
      await adminApi.getAccountByRole({ role: "candidate" }).catch(() => []),
      await adminApi.getBlacklist().catch(() => []),
    ]);
    setUsers((state) => ({
      ...state,
      recruiters: users[0],
      interviewers: users[1],
      candidates: users[2],
      candidatesBlacklist: users[3],
    }));
    setPending(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  return (
    <div className="AdminDashboard">
      <Row>
        <Col xs={24} md={8} style={{ margin: "1rem 0" }}>
          <div className="table">
            <Countdown title="Tomorrow" value={deadline} onFinish={onFinish} />
            <Countdown
              title="Million Seconds"
              value={deadline}
              format="HH:mm:ss:SSS"
            />
          </div>
        </Col>

        <Col xs={24} md={16} style={{ margin: "1rem 0" }}>
          <div className="table">
            <Spin spinning={pending} indicator={antIcon}>
              <Title level={4} style={{ margin: "1rem 0" }}>
                Users
              </Title>
              <Descriptions>
                <Descriptions.Item label={"Active Users"}>
                  <Text strong>
                    {users?.recruiters.length +
                      users?.interviewers.length +
                      users?.candidates.length}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={"Inactive Users"}>
                  <Text strong>{0}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Recruiters">
                  <Text strong>{users?.recruiters.length}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Interviewers">
                  <Text strong>{users?.interviewers.length}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Candidates">
                  <Text strong>{users?.candidates.length}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Blackists User">
                  <Text strong>{users?.candidatesBlacklist.length}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Percent Active">
                  <Progress
                    type="circle"
                    percent={parseInt(
                      ((users?.recruiters.length +
                        users?.interviewers.length +
                        users?.candidates.length) *
                        100) /
                        (users?.recruiters.length +
                          users?.interviewers.length +
                          users?.candidates.length +
                          users?.candidatesBlacklist.length)
                    )}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Candidates">
                  <Progress
                    type="circle"
                    percent={parseInt(
                      (users?.candidates.length * 100) /
                        (users?.recruiters.length +
                          users?.interviewers.length +
                          users?.candidates.length +
                          users?.candidatesBlacklist.length)
                    )}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Employees">
                  <Progress
                    type="circle"
                    percent={parseInt(
                      ((users?.recruiters.length + users?.interviewers.length) *
                        100) /
                        (users?.recruiters.length +
                          users?.interviewers.length +
                          users?.candidates.length +
                          users?.candidatesBlacklist.length)
                    )}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Descriptions.Item>
              </Descriptions>
            </Spin>
          </div>
        </Col>
      </Row>
    </div>
  );
}
