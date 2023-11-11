import {
  DeleteFilled,
  PlusSquareOutlined,
  UploadOutlined,
  EditFilled,
  EyeFilled,
} from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Space,
  Tooltip,
  Upload,
  message,
  Card,
} from "antd";
import React from "react";
import { useState, useEffect } from "react";
import "./managecv.scss";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { candidateActions } from "features/candidate/candidateSlice";
import { useNavigate } from "react-router-dom";

import bg1 from "assets/images/resume_bg1.jpg";
import bg2 from "assets/images/resume_bg2.jpg";
import bg3 from "assets/images/resume_bg3.jpg";
import bg4 from "assets/images/resume_bg4.jpg";
import bg5 from "assets/images/resume_bg5.jpg";
import bg6 from "assets/images/resume_bg6.jpg";
import bg7 from "assets/images/resume_bg7.jpg";
import bg8 from "assets/images/resume_bg8.jpg";
import bg9 from "assets/images/resume_bg9.jpg";
import bg10 from "assets/images/resume_bg10.jpg";
import bg11 from "assets/images/resume_bg11.jpg";
import bg12 from "assets/images/resume_bg12.jpg";
import bg13 from "assets/images/resume_bg13.jpg";
import bg14 from "assets/images/resume_bg14.jpg";
import bg15 from "assets/images/resume_bg15.jpg";
import bg16 from "assets/images/resume_bg16.jpg";
import bg17 from "assets/images/resume_bg17.jpg";
import bg18 from "assets/images/resume_bg18.jpg";
import bg19 from "assets/images/resume_bg19.jpg";
import bg20 from "assets/images/resume_bg20.jpg";

import { LoadingOutlined } from "@ant-design/icons";

import { createSelector } from "@reduxjs/toolkit";

import { Spin } from "antd";
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const backgroundMapping = {
  1: bg1,
  2: bg2,
  3: bg3,
  4: bg4,
  5: bg5,
  6: bg6,
  7: bg7,
  8: bg8,
  9: bg9,
  10: bg10,
  11: bg11,
  12: bg12,
  13: bg13,
  14: bg14,
  15: bg15,
  16: bg16,
  17: bg17,
  18: bg18,
  19: bg19,
  20: bg20,
};

export default function CandidateResume() {
  const reversedResumesSelector = createSelector(
    (state) => state.candidate.resumes,
    (resume) => {
      const copyResumes = [...resume];
      return copyResumes.reverse();
    }
  );

  const reversedResumes = useSelector(reversedResumesSelector);

  const notification = useSelector((state) => state.candidate.notification);
  const loading = useSelector((state) => state.candidate.loading);
  const authStatus = useSelector((state) => state.auth.status);

  const accessToken = localStorage.getItem("accessToken");
  const currentRole = localStorage.getItem("currentRole");

  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken || (accessToken && !currentRole)) {
      navigate("/login");
    }
  }, [authStatus, currentRole, accessToken, navigate]);

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", fileList[0]);
    dispatch(candidateActions.createResumeRequest(formData));
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const handleDeleteCVOK = (cvID) => {
    dispatch(candidateActions.deleteResumeRequest(cvID));
  };

  const handleDeleteCVCancel = () => {
    messageApi.open({
      type: "error",
      content: "Clicked on No",
      style: {
        marginTop: "4rem",
      },
    });
  };

  useEffect(() => {
    setUploading(false);

    if (notification.type === "success") setFileList([]);

    if (notification.type)
      messageApi.open({
        type: notification.type,
        content: notification.message,
        style: {
          marginTop: "4rem",
        },
      });
    dispatch(candidateActions.resetNotification());
  }, [dispatch, messageApi, notification]);

  return (
    <div className="ManageCV container">
      {contextHolder}
      <Space className="upload-crate-wrap">
        <Link to="/create-resume">
          <Button
            type="primary"
            className="create-btn"
            icon={<PlusSquareOutlined />}
          >
            Create CV
          </Button>
        </Link>

        <Upload {...props} accept=".pdf">
          <Button icon={<UploadOutlined />}>Upload CV</Button>
        </Upload>

        {fileList.length !== 0 && (
          <Button
            type="primary"
            onClick={handleUpload}
            className="upload-btn"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Start Upload"}
          </Button>
        )}
      </Space>

      <Spin spinning={loading} indicator={antIcon}>
        <div className="card-grid-container">
          {reversedResumes.map((item, index) => (
            <Card.Grid key={index} className="card-grid-item">
              <div
                className="grid-sub-container"
                style={{
                  backgroundImage: `url(${
                    backgroundMapping[(item.id % 20) + 1]
                  })`,
                }}
              >
                <div className="grid-date-created">
                  <div>
                    {`Created on ${new Date(item.creatdDate).getDate()}-${
                      new Date(item.creatdDate).getMonth() + 1
                    }-${new Date(item.creatdDate).getFullYear()}`}
                  </div>
                  <div className="grid-action">
                    <Tooltip title="View CV" placement="top">
                      <Link
                        to={`/view-resume?_resumeID=${item.id}`}
                        target="_blank"
                      >
                        <Button type="text" icon={<EyeFilled />} />
                      </Link>
                    </Tooltip>
                    <Tooltip title="Edit CV" placement="top">
                      <Link to={`/edit-resume/${item.id}`}>
                        <Button type="text" icon={<EditFilled />} />
                      </Link>
                    </Tooltip>
                    <Tooltip title="Delete CV" placement="top">
                      <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => handleDeleteCVOK(item.id)}
                        onCancel={handleDeleteCVCancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          className="delete-btn"
                          type="text"
                          icon={<DeleteFilled />}
                        />
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </div>
                <div className="grid-filename">
                  <div>
                    {item.fileName.endsWith(".pdf")
                      ? `${item.fileName.slice(0, -4)}`
                      : `${item.fileName}`}
                  </div>
                </div>
              </div>
            </Card.Grid>
          ))}
        </div>
      </Spin>
    </div>
  );
}
