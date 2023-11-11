import axiosClient from "./axiosClient";

const recruiterApi = {
  getPositions(params) {
    const url = `recruiters/vacancies/search?page=${params.page}&limit=${params.limit}`;
    return axiosClient.get(url);
  },
  getPositionById(id) {
    const url = `recruiters/vacancies/details/${id}`;
    return axiosClient.get(url);
  },

  getApplications(id) {
    const url = `recruiters/vacancies/${id}`;
    return axiosClient.get(url);
  },

  addPosition(form) {
    const url = "recruiters/vacancies";
    return axiosClient.post(url, form);
  },
  updatePosition(form) {
    const url = `recruiters/vacancies/${form.id}`;
    return axiosClient.put(url, form);
  },
  deletePosition(id) {
    const url = `recruiters/vacancies/${id}`;
    return axiosClient.delete(url);
  },

  getEvents() {
    const url = `recruiters/events`;
    return axiosClient.get(url);
  },

  getAuthCalendar() {
    const url = `/recruiters/interviews/auth/calendar`;
    return axiosClient.get(url);
  },

  getCreateCalendar(code,id) {
    const url = `/recruiters/interviews/create/calendar?code=${code}&id=${id}`;
    return axiosClient.get(url);
  },

  getEventById(id) {
    const url = `recruiters/events/${id.id}`;
    return axiosClient.get(url);
  },

  getCandidatesCollectedEvent(id) {
    const url = `recruiters/collected-candidates/events?eventId=${id.id}`;
    return axiosClient.get(url);
  },
  getHistory() {
    const url = `recruiters/interviews/search`;
    return axiosClient.get(url);
  },

  addEvent(form) {
    const url = `recruiters/events`;
    return axiosClient.post(url, form);
  },
  updateEvent(id, form) {
    const url = `recruiters/events/${id}`;
    return axiosClient.put(url, form);
  },
  deleteEvent(id) {
    const url = `recruiters/events/${id}`;
    return axiosClient.delete(url);
  },
  getInterviews(id) {
    const url = `recruiters/interviews/${id}`;
    return axiosClient.get(url);
  },

  getInterviewCalendar() {
    const url = `recruiters/interviews/auth/calendar`;
    return axiosClient.get(url);
  },

  getInterview() {
    const url = `recruiters/interviews`;
    return axiosClient.get(url);
  },

  getInterviewById(id) {
    const url = `recruiters/interviews/details/${id}`;
    return axiosClient.get(url);
  },

  getInterviewers() {
    const url = `recruiters/interviewers/search`;
    return axiosClient.get(url);
  },

  getCvDetail(id) {
    const url = `recruiters/interviews/cv/${id}`;
    return axiosClient.get(url);
  },

  createInterview(form) {
    const url = `/recruiters/interviews`;
    return axiosClient.post(url, form);
  },

  updateInterview(id, form) {
    const url = `/recruiters/interviews/updateInterviewerOrDateTime?interviewId=${id}`;
    return axiosClient.put(url, form);
  },

  updateStatusInterview(id, reId,datetime=null) {
    const url = datetime ? `/recruiters/interviews/updateStatus?interviewId=${id}&recruiterId=${reId}&interviewDatetime=${datetime}`
    :`/recruiters/interviews/updateStatus?interviewId=${id}&recruiterId=${reId}`;
    return axiosClient.put(url);
  },

  updateInterviewLink(id,link) {
    const url = `/recruiters/interviews/updateLinkMeeting?id=${id}&link=${link}`;
    return axiosClient.put(url)
  },

  updateSoftScore(params, value) {
    const url = `recruiters/interviews/updateSoftScore?interviewId=${params.interviewId}&&recruiterId=${params.recruiterId}`;
    return axiosClient.put(url, value);
  },
  updateLanguageScore(params, value) {
    const url = `recruiters/interviews/updateLanguageScore?interviewId=${params.interviewId}&&recruiterId=${params.recruiterId}`;
    return axiosClient.put(url, value);
  },
  updateSummaryCompleted(params, value) {
    const url = `recruiters/interviews/completes?interviewId=${params.interviewId}&summary=${value}`;
    return axiosClient.put(url, value);
  },

  getCvByInterview(id) {
    const url = `/recruiters/interviews/cv/${id}`;
    return axiosClient.get(url);
  },

  getCvByCandidateAndVacancy(payload) {
    const url = `/recruiters/vacancies/cv?vacancyId=${payload.vacancyId}&&candidateId=${payload.candidateId}`;
    return axiosClient.get(url);
  }
};
export default recruiterApi;
