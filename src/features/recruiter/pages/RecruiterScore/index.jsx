import { useParams } from "react-router-dom";
import "./RecruiterScore.scss";

import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Drawer,
  Form,
  InputNumber,
  Spin,
  Typography,
  notification,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import recruiterApi from "api/recruiterApi";
import DescriptionInterview from "components/Common/DescriptionInterview";
import { useCallback, useEffect, useState } from "react";

const { Title, Text } = Typography;
export default function RecruiterScore() {
  const params = useParams();
  const [interviewDetail, setInterviewDetail] = useState();

  const [enabled, setEnabled] = useState(null);
  const [pending, setPending] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = useCallback(
    (type) => {
      if (type === "success")
        api[type]({
          message: "Notification",
          description: "Update Successfully",
          duration: 2,
        });

      if (type === "error")
        api[type]({
          message: "Notification",
          description: "Update Failed",
          duration: 2,
        });

      if (type === "info")
        api[type]({
          message: "Notification",
          description: "Interview is NOT Exist",
          duration: 6,
        });
    },
    [api]
  );

  // Fetch data function-----------------------------
  const fetchInterviewDetail = useCallback(async () => {
    try {
      setPending(true);
      const interviewDetail = await recruiterApi.getInterviewById(
        params.interviewId
      );
      setInterviewDetail(interviewDetail);
    } catch (error) {
      openNotificationWithIcon("info");
    } finally {
      setPending(false);
    }
  }, [openNotificationWithIcon, params.interviewId]);

  useEffect(() => {
    fetchInterviewDetail();
  }, [fetchInterviewDetail]);

  // Submit Function----------------------------
  const handleUpdateClick = useCallback(
    async (values) => {
      try {
        setPending(true);
        const params = {
          interviewId: interviewDetail?.id,
          recruiterId: interviewDetail?.recruiter.id,
        };
        await recruiterApi.updateSoftScore(params, values.soft);
        await recruiterApi.updateLanguageScore(params, values.language);
        const response = await recruiterApi.updateSummaryCompleted(
          params,
          values.summary
        );
        setInterviewDetail(response);
        openNotificationWithIcon("success");
      } catch (error) {
        openNotificationWithIcon("error");
      } finally {
        setPending(false);
      }
    },
    [
      interviewDetail?.id,
      interviewDetail?.recruiter.id,
      openNotificationWithIcon,
    ]
  );

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return (
    <>
      {contextHolder}
      <div className="RecruiterScore">
        <DescriptionInterview interviewDetail={interviewDetail} />

        <Title
          style={{
            borderTop: "#e5e5e5 0.1px solid",
            width: "100%",
            padding: "1rem 0",
          }}
          className="title"
          level={5}
        >
          Candidate Score
        </Title>

        <Spin spinning={pending} indicator={antIcon}>
          <Descriptions>
            <Descriptions.Item label={"Soft Skills"}>
              <Text strong>{interviewDetail?.softSkillScore}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={"Languages"}>
              <Text strong>{interviewDetail?.languageSkillScore}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={"Summary"}>
              <Text strong>{interviewDetail?.summary}</Text>
            </Descriptions.Item>
          </Descriptions>
          <Button
            disabled={interviewDetail?.status !== "PENDING"}
            type="primary"
            onClick={() => {
              setEnabled(interviewDetail);
            }}
            style={{ margin: "2rem 100% 0", translate: "-100%" }}
          >
            Update
          </Button>
        </Spin>

        <Drawer
          open={enabled}
          onClose={() => {
            setEnabled(null);
          }}
        >
          {enabled && (
            <Form
              initialValues={{
                remember: true,
              }}
              onFinish={(values) => {
                handleUpdateClick(values);
                setEnabled(null);
              }}
              autoComplete="off"
            >
              <Form.Item
                label={<Text strong>Soft Skills</Text>}
                name={"soft"}
                initialValue={enabled.softSkillScore}
              >
                <InputNumber min={0} max={10} />
              </Form.Item>
              <Form.Item
                label={<Text strong>Languages</Text>}
                name={"language"}
                initialValue={enabled.languageSkillScore}
              >
                <InputNumber min={0} max={10} />
              </Form.Item>
              <Form.Item
                label={<Text strong>Summary</Text>}
                name={"summary"}
                initialValue={enabled.summary}
              >
                <TextArea />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  htmlType="reset"
                  type="primary"
                  style={{ margin: "2rem 0.5rem" }}
                >
                  Reset
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ margin: "2rem 0.5rem" }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Drawer>
      </div>
    </>
  );
}
