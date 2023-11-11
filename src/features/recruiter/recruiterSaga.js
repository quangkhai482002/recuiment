import recruiterApi from "api/recruiterApi";
import { call, fork, put, take, takeEvery, retry } from "redux-saga/effects";
import { recruiterActions } from "./recruiterSlice";

import { getErrorMessage, waitUntilLocalStorageNotNull } from "utils";

function* handleGetPositions(actions) {
  try {
    const positions = yield call(recruiterApi.getPositions, actions.payload);
    yield put(recruiterActions.getPositionsSuccess(positions));
  } catch (error) {
    yield put(recruiterActions.getPositionsFailed());
  } finally {
    return;
  }
}

function* watchGetPositionsFlow() {
  while (true) {
    const actions = yield take(recruiterActions.getPositions().type);
    yield fork(handleGetPositions, actions);
  }
}

function* handleGetEvents(actions) {
  try {
    const events = yield call(recruiterApi.getEvents, actions.payload);
    yield put(recruiterActions.getEventsSuccess(events));
  } catch (error) {
    yield put(recruiterActions.getEventsFailed());
  } finally {
    return;
  }
}

function* watchGetEventsFlow() {
  while (true) {
    const actions = yield take(recruiterActions.getEvents().type);
    yield fork(handleGetEvents, actions);
  }
}

function* handleGetHistory(actions) {
  try {
    const history = yield call(recruiterApi.getHistory, actions.payload);
    yield put(recruiterActions.getHistorySuccess(history));
  } catch (error) {
    yield put(recruiterActions.getHistoryFailed());
  } finally {
    return;
  }
}

function* watchGetHistoryFlow() {
  while (true) {
    const actions = yield take(recruiterActions.getHistory().type);
    yield fork(handleGetHistory, actions);
  }
}
// -------------------------------------------------------

function* createInterviewSaga(actions) {
  try {
    yield put(recruiterActions.fetchLoading(true));
    const applyForm = yield call(recruiterApi.createInterview, actions.payload);
    yield put(recruiterActions.createInterviewSuccess(applyForm));
    yield put(recruiterActions.createCalendarRequest(applyForm.id));
  } catch (err) {
    if (err.response.status === 400) {
      yield put(
        recruiterActions.fetchError("Interviewer already have an interview")
      );
    } else {
      yield put(
        recruiterActions.fetchError(getErrorMessage(err.response.status))
      );
    }
  } finally {
    yield put(recruiterActions.fetchLoading(false));
  }
}

function* watchCreateInterviewFlow() {
  yield takeEvery(
    recruiterActions.createInterviewRequest.toString(),
    createInterviewSaga
  );
}
// -------------------------------------------------------

function* updateInterviewSaga(actions) {
  try {
    yield put(recruiterActions.fetchLoading(true));
    const updateForm =
      Object.keys(actions.payload).length === 3
        ? yield call(
            recruiterApi.updateStatusInterview,
            actions.payload.id,
            actions.payload.reId,
            actions.payload.datetime
          )
        : yield call(
            recruiterApi.updateInterview,
            actions.payload.id,
            actions.payload.data
          );
    yield put(recruiterActions.updateInterviewSuccess(updateForm));
     yield Object.keys(actions.payload).length !== 3 &&
      put(recruiterActions.createCalendarRequest(updateForm.id));

  } catch (err) {
    if (err.response.status === 400) {
      yield put(
        recruiterActions.fetchError("Interviewer already have an interview")
      );
    } else {
      yield put(
        recruiterActions.fetchError(getErrorMessage(err.response.status))
      );
    }
  } finally {
    yield put(recruiterActions.fetchLoading(false));
  }
}

function* watchUpdateInterviewFlow() {
  yield takeEvery(
    recruiterActions.updateInterviewRequest.toString(),
    updateInterviewSaga
  );
}
// -------------------------------------------------------

function* cancelInterviewSaga(actions) {
  try {
    yield put(recruiterActions.fetchLoading(true));
    const cancel = yield call(
      recruiterApi.updateStatusInterview,
      actions.payload.id,
      actions.payload.reId
    );
    yield put(recruiterActions.cancelInterviewSuccess(cancel));
  } catch (err) {
    yield put(
      recruiterActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    yield put(recruiterActions.fetchLoading(false));
  }
}

function* watchCancelInterviewFlow() {
  yield takeEvery(
    recruiterActions.cancelInterviewRequest.toString(),
    cancelInterviewSaga
  );
}
// -------------------------------------------------------

function* createCalendarSaga(actions) {
  try {
    const linkCode = yield call(recruiterApi.getAuthCalendar);
    window.open(linkCode);
    const MILLISECOND = 100;
    yield retry(50, 10 * MILLISECOND, waitUntilLocalStorageNotNull, "code");
    const create = yield call(
      recruiterApi.getCreateCalendar,
      localStorage.getItem("code").toString(),
      actions.payload
    );
    const update = yield call(recruiterApi.updateInterviewLink,actions.payload,create);
    yield put(recruiterActions.createCalendarSuccess(update));
  } catch (err) {
    yield put(
      recruiterActions.fetchError(getErrorMessage(err.response.status))
    );
  } finally {
    localStorage.removeItem("code");
  }
}

function* watchCreateCalendarFlow() {
  yield takeEvery(
    recruiterActions.createCalendarRequest.toString(),
    createCalendarSaga
  );
}

export default function* recruiterSaga() {
  yield fork(watchGetPositionsFlow);
  yield fork(watchGetEventsFlow);
  yield fork(watchGetHistoryFlow);
  yield fork(watchCreateInterviewFlow);
  yield fork(watchUpdateInterviewFlow);
  yield fork(watchCancelInterviewFlow);
  yield fork(watchCreateCalendarFlow);
}
