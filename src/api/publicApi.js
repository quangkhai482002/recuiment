import axiosClient from "./axiosClient";

const publicApi = {
  getSkills() {
    const url = "skills";
    return axiosClient.get(url);
  },
  getPositions() {
    const url = "positions";
    return axiosClient.get(url);
  },
  getLevels() {
    const url = "levels";
    return axiosClient.get(url);
  },
  getEvents(params) {
    const url = `events?page=${params.page}&limit=${params.limit}`;
    return axiosClient.get(url);
  },
  getEventById(id) {
    const url = `events/${id.id}`;
    return axiosClient.get(url);
  },
  applyEvent(id, form) {
    const url = `events/apply/${id}`;
    return axiosClient.post(url, form);
  }
};
export default publicApi;
