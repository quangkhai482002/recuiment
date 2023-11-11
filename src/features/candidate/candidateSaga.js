import candidateApi from "api/candidateApi";
import { call, fork, put, take, takeEvery } from "redux-saga/effects";
import { candidateActions } from "./candidateSlice";

import { getErrorMessage } from "utils";

function* handleGetVacancies(actions) {
  try {
    const vacancies = yield call(candidateApi.getVacancies, actions.payload);
    yield put(
      candidateActions.getVacanciesSuccess({
        params: actions.payload,
        data: vacancies,
      })
    );
  } catch (err) {
    yield put(candidateActions.getVacanciesFailed());
  } finally {
    return;
  }
}
function* watchGetVacanciesFlow() {
  while (true) {
    const actions = yield take(candidateActions.getVacancies().type);
    yield fork(handleGetVacancies, actions);
  }
}

// -------------------------------------------------------

function* getResumesSaga() {
  try {
    yield put(candidateActions.fetchLoading(true));
    const resumes = yield call(candidateApi.getCV);
    yield put(candidateActions.fetchResumesSuccess(resumes));
  } catch (err) {
    yield put(
      candidateActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    yield put(candidateActions.fetchLoading(false));
  }
}

function* createResumeSaga(action) {
  try {
    yield put(candidateActions.fetchLoading(true));
    const newResume = yield call(candidateApi.uploadResume, action.payload);
    yield put(candidateActions.createResumeSuccess(newResume));
  } catch (err) {
    yield put(
      candidateActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    yield put(candidateActions.fetchLoading(false));
  }
}

function* updateResumeSaga(action) {
  try {
    yield put(candidateActions.fetchLoading(true));
    const newResume = yield call(candidateApi.updateResume, action.payload);
    yield put(candidateActions.updateResumeSuccess(newResume));
  } catch (err) {
    yield put(
      candidateActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    yield put(candidateActions.fetchLoading(false));
  }
}

function* deleteResumeSaga(action) {
  try {
    yield put(candidateActions.fetchLoading(true));
    yield call(candidateApi.deleteCV, action.payload);
    yield put(candidateActions.deleteResumeSuccess(action.payload));
  } catch (err) {
    if (err.response.data.message) {
      yield put(candidateActions.fetchError(err.response.data.message));
    } else {
      yield put(
        candidateActions.fetchError(getErrorMessage(err.response.status))
      );
    }
  } finally {
    yield put(candidateActions.fetchLoading(false));
  }
}

function* watchResumesFlow() {
  yield takeEvery(
    candidateActions.fetchResumesRequest.toString(),
    getResumesSaga
  );
  yield takeEvery(
    candidateActions.createResumeRequest.toString(),
    createResumeSaga
  );
  yield takeEvery(
    candidateActions.updateResumeRequest.toString(),
    updateResumeSaga
  );
  yield takeEvery(
    candidateActions.deleteResumeRequest.toString(),
    deleteResumeSaga
  );
}
// -------------------------------------------------------

function* applyJobSaga(action) {
  try {
    yield put(candidateActions.fetchLoading(true));
    const applyForm = yield call(candidateApi.apply, action.payload);
    yield put(candidateActions.applyJobSuccess(applyForm));
  } catch (err) {
    yield put(
      err.response.data.message.search("BlackList") !== -1? 
      candidateActions.fetchSuccess("Apply successfully!"):
      candidateActions.fetchError(err.response.data.message)
    );
  } finally {
    yield put(candidateActions.fetchLoading(false));
  }
}

function* watchApplyJobFlow() {
  yield takeEvery(candidateActions.applyJobRequest.toString(), applyJobSaga);
}

// -------------------------------------------------------
export default function* candidateSaga() {
  yield fork(watchGetVacanciesFlow);
  yield fork(watchResumesFlow);
  yield fork(watchApplyJobFlow);
}
