import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://recruiment-deploy.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async function (config) {
    // Làm gì đó trước khi request dược gửi đi
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const newHeader = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      config = {
        ...config,
        headers: newHeader,
      };
    }
    return config;
  },
  function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response

    // console.log("AxiosClient Response.data:", response.data);
    return response.data;
  },
  async function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    // console.log("Axios Error :", error);
    // console.log("Axios Error Status:", error.response.status);
    // console.log("Axios Error Message:", error.response.data.message);

    if (
      error.response.status === 401 &&
      localStorage.getItem("refreshToken") &&
      error.response.data.message === "Account logged out"
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentRole");
      window.location.reload();
    }

    if (
      error.response.status === 401 &&
      localStorage.getItem("refreshToken") &&
      error.response.data.message === "Token has expired"
    ) {
      try {
        console.log("refresh Token");
        const refreshToken = localStorage.getItem("refreshToken");
        localStorage.setItem("accessToken", refreshToken);
        localStorage.removeItem("refreshToken");

        const url = "auth/refresh-token";
        const newToken = await axiosClient.post(url);
        console.log("newToken", newToken);
        localStorage.setItem("accessToken", newToken.accessToken);
        localStorage.setItem("refreshToken", newToken.refreshToken);
        window.location.reload();
      } catch (error) {
        console.log("refreshToken has Expired");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentRole");
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
