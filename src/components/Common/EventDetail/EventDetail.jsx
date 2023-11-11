import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Space, message } from "antd";
import publicApi from "api/publicApi";
import recruiterApi from "api/recruiterApi";
import { recruiterActions } from "features/recruiter/recruiterSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApplyForm from "./ApplyForm";
import CustomParagraph from "./CustomParagraph";
import "./EventDetail.scss";
import EventInformation from "./EventInformation";
import EventListData from "./EventListData";
import { currentDate } from "./data";

export default function EventDetail({ eventData, role, classify, id }) {
  // useNavigate
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // useState
  const [name, setName] = useState(eventData.name ? eventData.name : "");
  const [description, setDescription] = useState(
    eventData.description ? eventData.description : ""
  );
  const [rule, setRule] = useState(eventData.rule ? eventData.rule : "");
  const [benefit, setBenefit] = useState(
    eventData.benefit ? eventData.benefit : ""
  );
  const [rec] = useState(eventData.recruiter ? eventData.recruiter : {});
  const [location, setLocation] = useState(
    eventData.location ? eventData.location : ""
  );
  const [createAt] = useState(
    eventData.createAt ? eventData.createAt : currentDate
  );
  const [startDate, setStartDate] = useState(
    eventData.startDate ? eventData.startDate : currentDate
  );
  const [endDate, setEndDate] = useState(
    eventData.endDate ? eventData.endDate : currentDate
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Message
  const [messageApi, contextMessage] = message.useMessage();
  const messageError = useCallback((content) => {
    messageApi.open({
      type: "error",
      content: content,
      duration: 2,
    });
  }, [messageApi]);

  const messageLoading = useCallback((content) => {
    messageApi.open({
      type: "loading",
      content: content,
      duration: 0,
    });
  }, [messageApi]);

  const messageSuccess = useCallback((content) => {
    messageApi.open({
      type: "success",
      content: content,
      duration: 3,
    });
  }, [messageApi]);

  // Function
  const postData = useCallback(
    async (data) => {
      const button = document.getElementById('btn-save');
      if (classify === "add") {
        messageLoading("Adding data...");
        button.disabled = true;
        console.log(data);
        recruiterApi
          .addEvent(data)
          .then((res) => {
            messageApi.destroy();
            messageSuccess("Success!");
            dispatch(recruiterActions.getEvents());
            setTimeout(() => {
              navigate(-1);
            }, 2000);
            // console.log(res);
          })
          .catch((err) => {
            messageApi.destroy();
            button.disabled = false;
            messageError(`Failed! (error: ${err.message})`);
            console.log(err);
          });
      } else if (classify === "edit") {
        messageLoading("Adding data...");
        button.disabled = true;
        recruiterApi
          .updateEvent(id, data)
          .then(() => {
            messageApi.destroy();
            messageSuccess("Success!");
            dispatch(recruiterActions.getEvents());
            setTimeout(() => {
              navigate(-1);
            }, 2000);
          })
          .catch((err) => {
            button.disabled = false;
            messageApi.destroy();
            messageError(`Failed! (error: ${err.message})`);
            console.log(err);
          });
      }
    },
    [
      classify,
      dispatch,
      id,
      messageApi,
      messageError,
      messageLoading,
      messageSuccess,
      navigate,
    ]
  );

  const handleExit = useCallback(() => {
    if (role === "candidate" || role === "user") {
      navigate('/events');
    } else {
      navigate(`${role}/event`)
    }
  }, [navigate, role]);

  const handleApply = useCallback(
    async (value) => {
      const button = document.getElementById('btn-submit');
      button.disabled = true;
      messageLoading("Applying...");
      await publicApi
        .applyEvent(id, value.user)
        .then((res) => {
          messageApi.destroy();
          messageSuccess("Applied successfully!");
          setIsModalOpen(false);
          button.disabled = false;
          // console.log(res);
        })
        .catch((err) => {
          button.disabled = false;
          messageApi.destroy();
          messageError(`Applied failed! (error: ${err.message})`);
          console.log(err);
        });
    },
    [id, messageApi, messageError, messageLoading, messageSuccess]
  );

  const [modal, contextHolder] = Modal.useModal();
  const confirm = useCallback(
    (e, type) => {
      if (type === "save") {
        modal.confirm({
          title: "Confirm",
          icon: <ExclamationCircleOutlined />,
          content: "Do you really want to save your change?",
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            setRule(
              rule
                .split("\n")
                .filter((item) => item !== "")
                .join("\n")
            );
            setBenefit(
              benefit
                .split("\n")
                .filter((item) => item !== "")
                .join("\n")
            );
            // // Get new data
            let newData = { ...eventData };
            const newRule = rule
              .split(/\n/)
              .filter((item) => item !== "")
              .join("\n");
            const newBenefit = benefit
              .split(/\n/)
              .filter((item) => item !== "")
              .join("\n");
            newData.name = name;
            newData.location = location;
            newData.createAt = createAt;
            newData.status = "1";
            newData.description = description;
            newData.rule = newRule;
            newData.benefit = newBenefit;
            newData.recruiter = rec;
            newData.startDate = startDate;
            newData.endDate = endDate;
            if (name === "" || location === "" || description === "" || newRule === "" || newBenefit === "") {
              messageError("You must fill all the information in the form above!");
            } else {
              postData(newData);
            }
          },
        });
      } else if (type === "apply") {
        let birthday = e.user.birthday.$d;
        birthday = `${birthday.getFullYear()}-${birthday.getMonth() + 1 >= 10
          ? birthday.getMonth() + 1
          : `0${birthday.getMonth() + 1}`
          }-${birthday.getDate() >= 10
            ? birthday.getDate()
            : `0${birthday.getDate()}`
          }`;
        e.user.birthday = birthday;
        e.user.events = [eventData];
        handleApply(e);
      }
    },
    [benefit, createAt, description, endDate, eventData, handleApply, location, messageError, modal, name, postData, rec, rule, startDate]
  );

  // useEffect
  useEffect(() => {
    // Modal function
    if (document.getElementsByClassName("ant-modal-close").length === 1) {
      document
        .getElementsByClassName("ant-modal-close")[0]
        .addEventListener("click", () => {
          setIsModalOpen(false);
        });
    }

    return () => { };
  });

  // Render
  return (
    <div className="Event">
      {contextMessage}
      <div className="event-image">
        <div
          className="avatar-view"
          style={{
            background: `url(${"https://img.freepik.com/premium-photo/field-with-field-flowers-mountains-background_885092-89.jpg?w=360"}) center center/cover`,
          }}
        ></div>
      </div>
      <div className="event-content">
        <div className="event-name">
          <CustomParagraph
            role={role}
            data={name}
            func={setName}
            dataStyle={{ fontSize: "2rem", margin: 0 }}
            dataReturn={name}
            classify={classify}
          />
        </div>
        <hr />
        <div className="event-information information-main">
          <EventInformation
            role={role}
            type={"main"}
            startDate={startDate}
            setStartDate={(event) => {
              return setStartDate(event);
            }}
            endDate={endDate}
            setEndDate={(event) => {
              return setEndDate(event);
            }}
            createAt={createAt}
            location={location}
            setLocation={setLocation}
            classify={classify}
          />
        </div>
        <div className="event-information information-sub">
          <EventInformation
            role={role}
            type={"sub"}
            startDate={startDate}
            setStartDate={(event) => {
              return setStartDate(event);
            }}
            endDate={endDate}
            setEndDate={(event) => {
              return setEndDate(event);
            }}
            createAt={createAt}
            location={location}
            setLocation={setLocation}
            classify={classify}
          />
        </div>
        <hr />
        <div className="event-description">
          <CustomParagraph
            role={role}
            data={description}
            dataStyle={{ fontSize: "1rem", lineHeight: "30px" }}
            func={setDescription}
            dataReturn={description}
            type={"description"}
            classify={classify}
          />
        </div>
        <hr />
        <div className="event-rule">
          <p>HOW TO PARTICIPATE IN THE CONTEST:</p>
          <EventListData
            role={role}
            data={rule.split(/\n/)}
            func={(event) => {
              return setRule(event);
            }}
            type={"rule"}
            classify={classify}
          />
        </div>
        <hr />
        <div className="event-benefit">
          <p>WHAT ARE YOUR BENEFITS?</p>
          <EventListData
            role={role}
            data={benefit.split(/\n/)}
            func={(event) => {
              return setBenefit(event);
            }}
            type={"benefit"}
            classify={classify}
          />
        </div>
        <hr />
        <div className="event-contact">
          <table>
            <tbody>
              <tr>
                <td>Contact:</td>
                <td>
                  {rec
                    ? rec.firstName
                      ? rec.lastName
                        ? rec.firstName + " " + rec.lastName
                        : rec.firstName
                      : rec.lastName
                        ? rec.lastName
                        : ""
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  <a href={"mailto:" + rec ? (rec.email ? rec.email : "") : ""}>
                    {rec ? (rec.email ? rec.email : "") : ""}
                  </a>
                  {/* <CustomParagraph role={role} data={rec ? rec.email ? rec.email : "" : ""}
                                        func={(event) => { return changeRec(event, "email"); }} dataStyle={{ fontSize: "1rem" }}
                                        dataReturn={<a href={"mailto: " + rec ? rec.email ? rec.email : "" : ""}>{rec ? rec.email ? rec.email : "" : ""}</a>} type={"email"} classify={classify} /> */}
                </td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>
                  <a
                    href={
                      "tel: +" +
                      (rec ? (rec.phoneNumber ? rec.phoneNumber : "") : "")
                    }
                  >
                    {rec ? (rec.phoneNumber ? rec.phoneNumber : "") : ""}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Button */}
        {(classify === "edit" || classify === "add") && (
          <div className="btn-drop">
            <Space
              direction="vertical"
              style={{
                width: "120px",
              }}
              className="btn-cancel"
            >
              <Button
                type="primary"
                block
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  backgroundColor: "#3CB371",
                  color: "white",
                  height: "40px",
                }}
                onClick={handleExit}
              >
                CANCEL
              </Button>
            </Space>
            <Space
              direction="vertical"
              style={{
                width: "120px",
              }}
              className="btn-edit"
            >
              <Button
                type="primary"
                block
                onClick={(e) => {
                  return confirm(e, "save");
                }}
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  height: "40px",
                }}
                id="btn-save"
              >
                SAVE
              </Button>
            </Space>
            {contextHolder}
          </div>
        )}
        {role !== "recruiter" && role !== "interviewer" && role !== "admin" && (new Date(endDate) > new Date()) && (
          <>
            <div className="btn-drop">
              <Space
                direction="vertical"
                style={{
                  width: "120px",
                }}
                className="btn-apply"
              >
                <Button
                  block
                  onClick={showModal}
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    backgroundColor: "orange",
                    color: "white",
                    height: "50px",
                  }}
                >
                  APPLY
                </Button>
              </Space>
              <Modal
                title="EVENT APPLICATION FORM"
                open={isModalOpen}
                footer={null}
              >
                <ApplyForm
                  func={(e) => {
                    return confirm(e, "apply");
                  }}
                />
              </Modal>
              {contextHolder}
            </div>
          </>
        )}
        <Space direction="vertical" className="btn-exit">
          <Button
            type="default"
            shape="circle"
            style={{
              color: "red",
              border: "none",
              fontWeight: "bold",
              fontSize: "1.3rem",
            }}
            onClick={handleExit}
          >
            X
          </Button>
        </Space>
      </div>
    </div>
  );
}
