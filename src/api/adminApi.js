import { flatten } from "utils";
import axiosClient from "./axiosClient";
const adminApi = {
  getVacancies() {
    const url = `vacancies`;
    return axiosClient.get(url).then((vacancies) => {
      const unHideVacancies = vacancies.filter((item) => item.status === "1");
      return unHideVacancies.map((vacancy) => {
        if (vacancy.status === "1") {
          const flattedPosition = flatten({ position: vacancy.position });
          delete vacancy.position;
          return { ...vacancy, ...flattedPosition };
        }
      });
    });
  },
  getCandidateOfPositions(params, positionId) {
    const url = `admins/interviews/search?page${params.page}&limit=${params.limit}&vacancyId=${positionId}`;
    return axiosClient.get(url);
  },
  getAccounts(params) {
    const url = `admins/accounts/search?page=${params.page}&limit=${params.limit}`;
    return axiosClient.get(url);
  },
  getAccountByRole(params) {
    const url = `admins/accounts/${params.role}`;
    return axiosClient(url);
  },
  getAccountSearch(params) {
    const url = `admins/accounts?email=${params.email}`;
    return axiosClient(url);
  },
  registerRecruiter(form) {
    const url = `admins/accounts/registerRecruiter`;
    return axiosClient.post(url, form);
  },
  registerInterviewer(form) {
    const url = `admins/accounts/registerInterviewer`;
    return axiosClient.post(url, form);
  },

  getCandidateInfo(params) {
    const url = `/admins/candidate-profiles`;
    return axiosClient.get(url);
  },

  getBlacklist() {
    const url = `/admins/blacklists/candidates`;
    return axiosClient.get(url);
  },
  getBlacklistById(params) {
    const url = `admins/blacklists/${params.candidateId}`;
    return axiosClient.get(url);
  },
  addToBlackList(form) {
    const url = `admins/blacklists/${form.candidateId}`;
    return axiosClient.post(url, form);
  },
  getAdminScore(interviewId) {
    const url = `admins/interviews/${interviewId}`;
    return axiosClient.get(url);
  },
  rejectCandidate(interviewId) {
    const url = `admins/interviews/reject/${interviewId}`;
    return axiosClient.put(url);
  },
  approveCandidate(interviewId) {
    const url = `admins/interviews/approve/${interviewId}`;
    return axiosClient.put(url);
  },
  hideVacancy(vacancyId) {
    const url = `admins/vacancies/hide/${vacancyId}`;
    return axiosClient.put(url);
  },
  getCvById(id) {
    const url = `/admins/cvs/${id}`;
    return axiosClient.get(url);
  },
  getDataAsRecruiter() {
    const url = `recruiters/events`;
    return axiosClient.get(url);
  },
};
export default adminApi;
