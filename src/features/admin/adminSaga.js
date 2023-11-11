import adminApi from "api/adminApi";
import { call, fork, put, take } from "redux-saga/effects";
import { adminActions } from "./adminSlice";



function* handleGetPositions(actions) {
  const positions = yield call(adminApi.getPositions, actions.payload);
  yield put(adminActions.getPositionsSuccess(positions));
}
function* watchGetPositionsFlow() {
  while (true) {
    const actions = yield take(adminActions.getPositions().type);
    yield fork(handleGetPositions, actions);
  }
}

function* handleGetAccounts(actions) {
  try {
    const accounts = yield call(adminApi.getAccounts, actions.payload);
    yield put(adminActions.getAccountsSuccess(accounts));
  } catch (error) {
    yield put(adminActions.getAccountsFailed());
  }
}
function* watchGetAccountsFlow() {
  while (true) {
    const actions = yield take(adminActions.getAccounts().type);
    yield fork(handleGetAccounts, actions);
  }
}

export default function* adminSaga() {
  yield fork(watchGetPositionsFlow);
  yield fork(watchGetAccountsFlow);
}
