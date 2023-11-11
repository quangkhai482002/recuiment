import { flatten } from "utils";
import axiosClient from "./axiosClient";

const interviewerApi = {
  getInterviews() {
    const url = `/interviewers/interviews`;
    return axiosClient.get(url);
  },

  getInterviewById(params) {
    const url = `/interviewers/interviews/${params}`;
    return axiosClient.get(url);
  },

  getQuestions() {
    const url = "/interviewers/questions";
    return axiosClient.get(url);
  },

  updateScore(form) {
    const url = `/interviewers/interviews/score?interviewId=${form.interviewId}&questionId=${form.key}`;
    return axiosClient.put(url, form);
  },
  addQuestionInterview(form) {
    const url = `/interviewers/interviews/question?interviewId=${form.interviewId}&questionId=${form.question.id}`;
    return axiosClient.post(url, form);
  },
  deleteQuestionInterview(form) {
    const url = `/interviewers/interviews/question?interviewId=${form.interviewId}&questionId=${form.questionId}`;
    return axiosClient.delete(url);
  },
  updateSubmitInterview(params) {
    const url = `interviewers/interviews/complete/${params.interviewId}`;
    return axiosClient.put(url);
  },
  getQuestionsFilter() {
    const url = `/interviewers/questions/filter`;
    return axiosClient.get(url);
  },
  getQuestionss() {
    const url = `/interviewers/questions`;
    return axiosClient.get(url);
  },

  createQuestion(payload) {
    const url = "/interviewers/questions";
    const body = {
      content: payload.content,
      answer: payload.answer,
      skill: {
        id: payload.skill_id,
      },
    };
    return axiosClient.post(url, body).then((response) => flatten(response));
  },

  deleteQuestion(id) {
    // Payload: question id
    const url = `/interviewers/questions/${id}`;
    return axiosClient.delete(url);
  },

  updateQuestion(payload) {
    const url = `/interviewers/questions/${payload.id}`;
    const body = {
      content: payload.content,
      answer: payload.answer,
      skill: {
        id: payload.skill_id,
      },
    };
    return axiosClient.put(url, body).then((response) => flatten(response));
  },

  getCvByInterview(id) {
    const url = `/interviewers/interviews/cv/${id}`;
    return axiosClient.get(url);
  },
};
export default interviewerApi;
