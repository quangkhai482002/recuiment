import authApi from "api/authApi";
import { call, fork, put, take } from "redux-saga/effects";
import { authActions } from "./authSlice";

// watchLoginFlow----------------
function* watchLoginFlow() {
  while (true) {
    if (
      !localStorage.getItem("accessToken") ||
      !localStorage.getItem("currentRole")
    ) {
      const actions = yield take(authActions.login().type);
      yield fork(handleLogin, actions);
    }

    yield take(authActions.logout().type);
    yield fork(handleLogout);
  }
}
function* handleLogin(actions) {
  try {
    const data = yield call(authApi.login, actions.payload);
    yield localStorage.setItem("accessToken", data.accessToken);
    yield localStorage.setItem("refreshToken", data.refreshToken);
    yield put(authActions.loginSuccess());
  } catch (error) {
    yield put(authActions.loginFailed(error.response.status));
  } finally {
    return;
  }
}
function* handleLogout() {
  try {
    yield localStorage.removeItem("currentRole");
    yield localStorage.removeItem("refreshToken");
    yield call(authApi.logout);
    yield localStorage.removeItem("accessToken");
  } catch (error) {
    yield localStorage.removeItem("currentRole");
    yield localStorage.removeItem("accessToken");
    yield localStorage.removeItem("refreshToken");
  } finally {
    return;
  }
}

// watchGetInfoFlow----------
function* watchGetInfoFlow() {
  while (true) {
    const actions = yield take(authActions.getInfo().type);
    if (localStorage.getItem("accessToken")) yield fork(handleGetInfo, actions);
  }
}
function* handleGetInfo(actions) {
  try {
    const info = yield call(authApi.getInfo, actions.payload);
    yield localStorage.setItem("currentRole", actions.payload);
    yield put(authActions.loginSuccess({ ...info, role: actions.payload }));
  } catch (error) {
    // yield localStorage.removeItem("currentRole");
    yield put(authActions.loginFailed(error.response.status));
  } finally {
    return;
  }
}

// watchSetInfoFlow----------
function* watchSetInfoFlow() {
  while (true) {
    const actions = yield take(authActions.setInfo().type);
    if (localStorage.getItem("accessToken")) yield fork(handleSetInfo, actions);
  }
}
function* handleSetInfo(actions) {
  try {
    yield put(authActions.setInfoSuccess(actions.payload));
  } catch (error) {
    yield put(authActions.setInfoFailed(error.response.status));
    // console.log(error);
  } finally {
    return;
  }
}

// authSaga-------------------------------------------------------
export default function* authSaga() {
  yield fork(watchLoginFlow);
  yield fork(watchGetInfoFlow);
  yield fork(watchSetInfoFlow);
}
