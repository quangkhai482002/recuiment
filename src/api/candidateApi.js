import axiosClient from "./axiosClient";

const candidateApi = {
  getVacancies(params) {
    const newParams = new URLSearchParams(params).toString();
    const url = `candidates/search?${newParams}`;
    return axiosClient.get(url);
  },
  getVacancyById(id) {
    const url = `vacancies/${id}`;
    return axiosClient.get(url);
  },

  getEvents(params) {
    const url = `candidates/search?page=${params.page}&limit=${params.limit}`;
    return axiosClient.get(url);
  },

  apply(form) {
    const url = `candidates/apply`;
    return axiosClient.post(url, form);
  },

  updateInfo(form) {
    const url = ``;
    return axiosClient.put(url, form);
  },

  getCv(id) {
    const url = `candidates/cv/${id}`;
    return axiosClient.get(url);
  },
  
  getInterviewHistory(){
    const url= `candidates/vacancy-list`;
    return axiosClient.get(url);
  },
  
  getInterviews(){
    const url=`candidates/interviews`;
    return axiosClient.get(url);
  },
 
  uploadResume(form) {
    const url = `candidates/cv`;
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    return axiosClient.post(url, form, config);
  },
  updateResume(form) {
    const url = `candidates/cv/${form.get('cvId')}`;
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    return axiosClient.put(url, form, config);
  },
  getCV() {
    const url = `candidates/cv`;
    return axiosClient.get(url);
  },
  deleteCV(CVid) {
    const url = `candidates/cv/${CVid}`;
    return axiosClient.delete(url);
  },
  getCvById(id) {
    const url = `/candidates/cv/${id}`;
    return axiosClient.get(url);
  },
};


export default candidateApi;
