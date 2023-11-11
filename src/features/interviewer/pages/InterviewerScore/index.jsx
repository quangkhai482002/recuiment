import { useParams } from "react-router-dom";
import "./InterviewerScore.scss";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin, notification } from "antd";
import interviewerApi from "api/interviewerApi";
import DescriptionInterview from "components/Common/DescriptionInterview";
import TableQuestion from "components/Common/TableQuestion";
import {
  interviewerActions,
  interviewerSelectors,
} from "features/interviewer/interviewerSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function InterviewerScore() {
  const params = useParams();
  const [pending, setPending] = useState(false);
  const [interviewDetail, setInterviewDetail] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = useCallback(
    (type) => {
      if (type === "success-add")
        api["success"]({
          message: "Notification",
          description: "Add Successfully",
          duration: 2,
        });
      if (type === "success-add-new")
        api["success"]({
          message: "Notification",
          description: "A new question added",
          duration: 2,
        });
      if (type === "success-update")
        api["success"]({
          message: "Notification",
          description: "Update Successfully",
          duration: 2,
        });
      if (type === "success-delete")
        api["success"]({
          message: "Notification",
          description: "Delete Successfully",
          duration: 2,
        });
      if (type === "success-submit")
        api["success"]({
          message: "Notification",
          description: "Submit Successfully ",
          duration: 2,
        });
      if (type === "error-add")
        api["error"]({
          message: "Notification",
          description: "Add Failed",
          duration: 2,
        });
      if (type === "error-add-new")
        api["error"]({
          message: "Notification",
          description: "Add new question Failed",
          duration: 2,
        });
      if (type === "error-update")
        api["error"]({
          message: "Notification",
          description: "Update Failed",
          duration: 2,
        });
      if (type === "error-delete")
        api["error"]({
          message: "Notification",
          description: "Delete Failed",
          duration: 2,
        });
      if (type === "error-submit")
        api["error"]({
          message: "Notification",
          description: "Submit Failed",
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
  const dispatch = useDispatch();
  const { questions } = useSelector(interviewerSelectors);
  const interviewQuestions = interviewDetail?.interviewQuestion.map((item) => {
    return {
      ...item,
      key: item.question.id,
    };
  });
  const allQuestions = questions.map((item) => {
    return {
      question: {
        ...item,
      },
      interviewId: parseInt(params.interviewId),
      key: item.id,
      score: null,
      note: null,
    };
  });

  const fetchInterviewDetail = useCallback(async () => {
    try {
      setPending(true);
      const data = await interviewerApi.getInterviewById(params.interviewId);
      setInterviewDetail(data);
    } catch (error) {
      openNotificationWithIcon("info");
    } finally {
      setPending(false);
    }
  }, [openNotificationWithIcon, params.interviewId]);

  const handleSelectClick = useCallback(
    async (value) => {
      try {
        setPending(true);
        await interviewerApi.addQuestionInterview(value);
        await fetchInterviewDetail();
        openNotificationWithIcon("success-add");
      } catch (error) {
        openNotificationWithIcon("error-add");
      } finally {
        setPending(false);
      }
    },
    [fetchInterviewDetail, openNotificationWithIcon]
  );

  const handleAddNewQuestionClick = async (values) => {
    try {
      setPending(true);
      await interviewerApi.createQuestion({
        content: values.content,
        answer: values.answer,
        skill_id: values.skill,
      });
      dispatch(interviewerActions.fetchQuestionsRequest());
      openNotificationWithIcon("success-add-new");
    } catch (error) {
      openNotificationWithIcon("error-add-new");
    } finally {
      setPending(false);
    }
  };
  const handleUpdateClick = useCallback(
    async (value) => {
      try {
        setPending(true);

        await interviewerApi.updateScore(value);
        await fetchInterviewDetail();
        openNotificationWithIcon("success-update");
      } catch {
        openNotificationWithIcon("error-update");
      } finally {
        setPending(false);
      }
    },
    [fetchInterviewDetail, openNotificationWithIcon]
  );

  const handleDeleteClick = useCallback(
    async (value) => {
      try {
        setPending(true);
        await interviewerApi.deleteQuestionInterview({
          interviewId: value.interviewId,
          questionId: value.key,
        });
        await fetchInterviewDetail();
        openNotificationWithIcon("success-delete");
      } catch (error) {
        openNotificationWithIcon("error-delete");
      } finally {
        setPending(false);
      }
    },
    [fetchInterviewDetail, openNotificationWithIcon]
  );

  const handleSubmitClick = useCallback(async () => {
    try {
      setPending(true);
      const response = await interviewerApi.updateSubmitInterview({
        interviewId: params.interviewId,
      });
      setInterviewDetail(response);
      openNotificationWithIcon("success-submit");
    } catch (error) {
      openNotificationWithIcon("error-submit");
    } finally {
      setPending(false);
    }
  }, [openNotificationWithIcon, params.interviewId]);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  useEffect(() => {
    fetchInterviewDetail();
  }, [fetchInterviewDetail]);
  return (
    <>
      {contextHolder}
      <div className="InterviewerScore">
        <DescriptionInterview interviewDetail={interviewDetail} />

        <Spin spinning={pending} indicator={antIcon}>
          <TableQuestion
            status={interviewDetail?.status}
            questions={allQuestions}
            interviewQuestions={interviewQuestions}
            openNotificationWithIcon={openNotificationWithIcon}
            handleSelectClick={handleSelectClick}
            handleUpdateClick={handleUpdateClick}
            handleDeleteClick={handleDeleteClick}
            handleSubmitClick={handleSubmitClick}
            handleAddNewQuestionClick={handleAddNewQuestionClick}
          />
        </Spin>
      </div>
    </>
  );
}
