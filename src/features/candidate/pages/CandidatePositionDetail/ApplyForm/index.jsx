import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Modal, Radio, Space, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { candidateActions } from "features/candidate/candidateSlice";
import "./ApplyForm.scss"
export default function ApplyForm({ userID, visible, setVisible, positionId }) {
  const listCV = useSelector((state) => state.candidate.resumes);
  const notification = useSelector((state) => state.candidate.notification);
  const loading = useSelector((state) => state.candidate.loading);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [cvChosen, setCvChosen] = useState(undefined);
  const [form, setForm] = useState({
    candidate: {
      id: parseInt(userID),
    },
    cvId: undefined,
    vacancy: {
      id: parseInt(positionId),
    },
  });
  const navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleApplyJob = () => {
    dispatch(candidateActions.applyJobRequest(form));
    setTimeout(() => {
      handleCancel();
    }, 1800);
  };

  const handleLogin = () => {
    setConfirmLoading(true);
    localStorage.setItem("urlToLoad",`positions/${positionId}`)
    setTimeout(() => {
      navigate(`/login`, {
        state: {
          urlToLoad: window.location.href,
        }
      })
      setConfirmLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (notification.type)
      messageApi.open({
        type: notification.type,
        content: notification.message,
        onClose: () => dispatch(candidateActions.resetNotification()),
      });
  }, [notification, messageApi, dispatch]);

  const onChange = (e) => {
    setCvChosen(e.target.value);
    setForm({ ...form, cvId: e.target.value });
  };

  const handleCancel = () => {
    setCvChosen(undefined);
    setVisible(false);
  };

  return (
    <>
      {contextHolder}
      {userID === undefined ? (
        <Modal
          title="Apply Form"
          open={visible}
          confirmLoading={confirmLoading}
          onOk={handleLogin}
          okText="Login"
          onCancel={handleCancel}
          className="ApplyForm"
          cancelButtonProps={{ disabled: confirmLoading }}
          maskClosable={!confirmLoading}
          keyboard={!confirmLoading}
          closable={!confirmLoading}
        >
          {" "}
          Not Logged in. Please log in to apply for this position.
        </Modal>
      ) : (
        <Modal
          title="Apply Form"
          open={visible}
          onOk={handleApplyJob}
          onCancel={handleCancel}
          okButtonProps={{ disabled: cvChosen === undefined, loading: loading, }}
          cancelButtonProps={{ disabled: loading }}
          maskClosable={!loading}
          keyboard={!loading}
          closable={!loading}
          className="ApplyForm"
        >
          <div>
            {listCV.length === 0 ? (
              <Space direction="vertical">
                <p>NO CV</p>
                <Button
                  icon={<PlusCircleOutlined style={{ color: "green" }} />}
                  onClick={() => {
                    navigate("/create-resume");
                  }}
                >
                  Add CV
                </Button>
              </Space>
            ) : (
              <Radio.Group onChange={onChange} value={cvChosen}>
                <Space direction="vertical">
                  {listCV.map((cv) => (
                    <Radio value={cv.id} key={cv.id}>
                      <Link
                        to={`/view-resume?_resumeID=${cv.id}`}
                        target="_blank"
                      >
                        {cv.fileName}
                      </Link>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
