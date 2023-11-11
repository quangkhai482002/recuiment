import { PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import authApi from "api/authApi";
import { authActions } from "features/auth/authSlice";
// import authApi from "api/authApi";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AvatarUpload({ src, data, role, justView }) {
  // Dispatch
  const dispatch = useDispatch();

  // Message
  const [messageApi, contextMessage] = message.useMessage();
  const messageError = useCallback(() => {
    messageApi.open({
      type: "error",
      content: "Failed!",
      duration: 2,
    });
  }, [messageApi]);
  const messageLoading = useCallback(() => {
    messageApi.open({
      type: "loading",
      content: "Loading!",
      duration: 0,
    });
  }, [messageApi]);

  const messageSuccess = useCallback(() => {
    messageApi.open({
      type: "success",
      content: "Success!",
      duration: 3,
    });
  }, [messageApi]);

  // Async function
  const handleUpdate = async (formData) => {
    messageLoading();
    await authApi.changeAvatar({
      role: role,
      formData: formData,
    }).then((response) => {
      messageApi.destroy();
      messageSuccess();
      const newRes = { ...data, linkAvt: response.linkAvatar };
      dispatch(authActions.setInfo(newRes));
      // console.log(response);
    }).catch(err => {
      messageApi.destroy();
      messageError();
      console.log(err);
    });
  }

  const getUpload = () => {
    const FILE_INPUT = document.querySelector("input[type=file]");
    const AVATAR = document.getElementsByClassName("avatar-view")[0];

    FILE_INPUT.addEventListener("change", (event) => {
      console.log(event.target.files);
      const file = event.target.files[0];
      let formData = new FormData();

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = (e) => {
        AVATAR.setAttribute("aria-label", file.name);
        AVATAR.style.background = `url(${reader.result}) center center/cover`;
      };
      formData.append("file", file);
      handleUpdate(formData);
    }, { once: true });
    FILE_INPUT.click();
  };


  useEffect(() => {
    return () => { };
  }, []);

  return (
    <>
      {contextMessage}
      <input type="file" name="image" id="image" accept="image/*" />
      <div className="avatar">
        <div
          className="avatar-view"
          style={{ background: `url(${src ? src : "https://sangtao.sawaco.com.vn/wwwimages/Avatar/defaultavatar.png"}) center center/cover` }}
        ></div>
        {
          !justView && (
            <Button
              type="primary"
              shape="circle"
              id="btn-upload"
              aria-label="upload image"
              aria-describedby="image"
              icon={<PlusOutlined />}
              onClick={getUpload}
            ></Button>
          )
        }
      </div>
    </>
  );
}
