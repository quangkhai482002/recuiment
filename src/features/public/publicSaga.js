import publicApi from "api/publicApi";
import { publicActions } from "./publicSlice";

const { take, fork, call, all, put } = require("redux-saga/effects");

function* handleGetPublic() {
  try {
    const [skills, positions, levels] = yield all([
      call(publicApi.getSkills),
      call(publicApi.getPositions),
      call(publicApi.getLevels),
    ]);
    yield put(publicActions.getSkill(skills));
    yield put(publicActions.getPositions(positions));
    yield put(publicActions.getLevels(levels));
  } catch (error) {
    yield put(publicActions.fetchPublicFailed());
  } finally {
    return;
  }
}

function* watchGetPublicFlow() {
  while (true) {
    yield take(publicActions.fetchPublic().type);
    yield fork(handleGetPublic);
  }
}

export default function* publicSaga() {
  yield fork(watchGetPublicFlow);
}
