import axiosClient from "./axiosClient";
//
const authApi = {
  login(form) {
    const url = "/auth/login";
    return axiosClient.post(url, form);
  },

  logout() {
    const url = "auth/logout";
    return axiosClient.post(url);
  },

  register(form) {
    console.log("authApiRegister", form);
    const url = "auth/register";
    return axiosClient.post(url, form);
  },

  verifyEmail(accessToken) {
    const url = `auth/verify-email?token=${accessToken}`;
    return axiosClient.post(url);
  },

  resendActive(email) {
    const url = `auth/resend-active?email=${email}`;
    return axiosClient.post(url);
  },

  forgotPassword(email) {
    const url = `auth/forgot-password?email=${email}`;
    return axiosClient.post(url);
  },

  resetPassword(form) {
    const url = `auth/reset-password?token=${form.token}&password=${form.password}`;
    return axiosClient.post(url, form);
  },

  getInfo(role) {
    const url = `/${role}s`;
    return axiosClient.get(url);
  },

  updateInfo(role, form) {
    const url = `/${role}s`;
    return axiosClient.put(url, form);
  },

  changePassword(form) {
    const url = `/${form.role}s/change-password?password=${form.password}`;
    return axiosClient.put(url);
  },

  changeAvatar(form) {
    const url = `/${form.role}s/avatar`;
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    return axiosClient.put(url, form.formData, config);
  }
};
export default authApi;
