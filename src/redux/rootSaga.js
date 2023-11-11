import adminSaga from "features/admin/adminSaga";
import candidateSaga from "features/candidate/candidateSaga";
import interviewerSaga from "features/interviewer/interviewerSaga";
import recruiterSaga from "features/recruiter/recruiterSaga";
import { all } from "redux-saga/effects";
import authSaga from "../features/auth/authSaga";
import publicSaga from "features/public/publicSaga";

export default function* rootSaga() {
  yield all([
    publicSaga(),
    authSaga(),
    candidateSaga(),
    interviewerSaga(),
    recruiterSaga(),
    adminSaga(),
  ]);
}
