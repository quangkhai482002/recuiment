import { CheckOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Table,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { recruiterActions } from "features/recruiter/recruiterSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./InterviewForm.scss";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default function InterviewForm({
  candidateId,
  vacancyId,
  visible,
  cancelModal,
  recruiterId,
  interviewers,
  interview,
  type,
  loading,
}) {
  const toArray = require("dayjs/plugin/toArray");
  dayjs.extend(toArray);
  const dispatch = useDispatch();
  const [chosenInterviewer, setChosenInterviewer] = useState(null);
  const format = { date: "DD/MM/YYYY", time: "HH:mm" };
  const [form] = Form.useForm();
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };
  useEffect(() => {
    if (interview) {
      form.setFieldsValue({
        Date: dayjs(interview.interviewDatetime),
        Time: dayjs(interview.interviewDatetime.split("T")[1], "HH:mm"),
      });
      setChosenInterviewer(interview.interviewer);
    } else {
      form.setFieldsValue({
        Date: null,
        Time: null,
      });
      setChosenInterviewer(null);
    }
  }, [interview, form]);
  const handleChosen = (value) => {
    return chosenInterviewer
      ? value.filter((item) => item.id !== chosenInterviewer.id)
      : value;
  };
  const handleCancel = () => {
    form.setFieldValue({
      Date: null,
      Time: null,
    });
    setChosenInterviewer(null);
    cancelModal();
  };
  const handleSubmit = (values) => {
    const data = {
      interviewDatetime: values.Date.toArray()
        .splice(0, 3)
        .concat(values.Time.toArray().splice(3, 3)),

      candidateVacancy: {
        candidate: {
          id: candidateId,
        },
        vacancy: {
          id: parseInt(vacancyId),
        },
      },
      recruiter: {
        id: recruiterId,
      },
    };
    data.interviewDatetime[1] += 1;
    chosenInterviewer && (data.interviewer = { id: chosenInterviewer.id });
    type === "create"
      ? dispatch(recruiterActions.createInterviewRequest(data))
      : dispatch(
          recruiterActions.updateInterviewRequest({
            id: interview.interviewId,
            data,
          })
        );
    setTimeout(() => {
      handleCancel();
    }, 1500);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Button
            icon={<CheckOutlined style={{ color: "green" }} />}
            onClick={() => {
              setChosenInterviewer(record);
            }}
          ></Button>
        );
      },
      width: "10%",
    },
  ];
  return (
    <div className="InterviewForm">
      <Modal
        open={visible}
        title={type === "create" ? "Create new interview" : "Update Interview"}
        okText={type === "create" ? "Create" : "Update"}
        cancelText="Cancel"
        confirmLoading={loading}
        onCancel={handleCancel}
        cancelButtonProps={{ disabled: loading }}
        maskClosable={!loading}
        keyboard={!loading}
        closable={!loading}
        forceRender
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSubmit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        className="InterviewForm"
        style={{
          minWidth: 500,
        }}
      >
        <Form form={form} name="InterviewForm" className="InterviewFormModal">
          <Row>
            <Col flex={12}>
              <Form.Item
                name="Date"
                label="Date"
                key="Date"
                rules={[
                  {
                    required: true,
                    message: "Please choice the date for the interview!",
                  },
                  ({ getFieldValue }) => {
                    if (interview) {
                      return {
                        validator(_, value) {
                          if (
                            dayjs(value, "DD/MM/YYYY").format("DD/MM/YYYY") !==
                              dayjs(interview.interviewDatetime).format(
                                "DD/MM/YYYY"
                              ) ||
                            dayjs(getFieldValue("Time"), "HH:mm").format(
                              "HH:mm"
                            ) !==
                              dayjs(
                                interview.interviewDatetime.split("T")[1],
                                "HH:mm"
                              ).format("HH:mm") ||
                            chosenInterviewer !== interview.interviewer
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Please change the date or time or interviewer for the interview!"
                            )
                          );
                        },
                      };
                    } else {
                      return { type: "object", required: true };
                    }
                  },
                ]}
              >
                <DatePicker format={format.date} disabledDate={disabledDate} />
              </Form.Item>
            </Col>

            <Col flex={12}>
              <div className="timePicker">
                <Form.Item
                  name="Time"
                  label="Time"
                  key="time"
                  rules={[
                    {
                      required: true,
                      message: "Please choice the time for the interview!",
                    },
                    ({ getFieldValue }) => {
                      if (interview) {
                        return {
                          validator(_, value) {
                            if (
                              dayjs(value, "HH:mm").format("HH:mm") !==
                                dayjs(
                                  interview.interviewDatetime.split("T")[1],
                                  "HH:mm"
                                ).format("HH:mm") ||
                              dayjs(getFieldValue("Date"), "DD/MM/YYYY").format(
                                "DD/MM/YYYY"
                              ) !==
                                dayjs(interview.interviewDatetime).format(
                                  "DD/MM/YYYY"
                                ) ||
                              chosenInterviewer !== interview.interviewer
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                "Please change the date or time or interviewer for the interview!"
                              )
                            );
                          },
                        };
                      } else {
                        return { type: "object", required: true };
                      }
                    },
                  ]}
                >
                  <TimePicker format={format.time} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div className="AssistInterviewers">
            <h3>Interviewers:</h3>
            {chosenInterviewer ? (
              <div className="AssistInterviewer">
                <p>
                  {chosenInterviewer.firstName} {chosenInterviewer.lastName}
                </p>
                <p>{chosenInterviewer.email}</p>
                <Button
                  icon={<CloseCircleTwoTone twoToneColor="#FF0000" />}
                  onClick={() => setChosenInterviewer(null)}
                />
              </div>
            ) : (
              <p></p>
            )}
          </div>

          <div>
            <Table
              columns={columns}
              dataSource={handleChosen(interviewers)}
              rowKey={(record) => record.id}
              pagination={{
                pageSize: 5,
                align: "center",
                showSizeChanger: false,
                responsive: true,
              }}
              size="small"
            />
            ;
          </div>
        </Form>
      </Modal>
    </div>
  );
}
