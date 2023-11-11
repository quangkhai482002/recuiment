import interviewerApi from 'api/interviewerApi';
import { interviewerActions } from './interviewerSlice';
import { call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { getErrorMessage } from 'utils';

function* handleGetPositions(actions) {
	const positions = yield call(interviewerApi.getPositions, actions.payload);
	yield put(interviewerActions.getPositionsSuccess(positions));
}

function* watchGetPositionsFlow() {
	while (true) {
		const actions = yield take(interviewerActions.getPositions().type);
		yield fork(handleGetPositions, actions);
	}
}

function* getQuestionsSaga() {
	try {
		yield put(interviewerActions.fetchLoading(true));
		const questions = yield call(interviewerApi.getQuestions);
		yield put(interviewerActions.fetchQuestionsSuccess(questions));
	} catch (err) {
		yield put(
			interviewerActions.fetchError(getErrorMessage(err.response.status))
		);
	} finally {
		yield put(interviewerActions.fetchLoading(false));
	}
}

function* createQuestionSaga(action) {
	try {
		yield put(interviewerActions.fetchLoading(true));
		const newQuestion = yield call(
			interviewerApi.createQuestion,
			action.payload
		);
		yield put(interviewerActions.createQuestionSuccess(newQuestion));
	} catch (err) {
		try {
			yield put(interviewerActions.fetchError(err.response.data.message));
		} catch (err2) {
			yield put(
				interviewerActions.fetchError(getErrorMessage(err.response.status))
			);
		}
	} finally {
		yield put(interviewerActions.fetchLoading(false));
	}
}

function* updateQuestionSaga(action) {
	try {
		yield put(interviewerActions.fetchLoading(true));
		const updatedQuestion = yield call(
			interviewerApi.updateQuestion,
			action.payload
		);
		yield put(interviewerActions.updateQuestionSuccess(updatedQuestion));
	} catch (err) {
		try {
			yield put(interviewerActions.fetchError(err.response.data.message));
		} catch (err2) {
			yield put(
				interviewerActions.fetchError(getErrorMessage(err.response.status))
			);
		}
	} finally {
		yield put(interviewerActions.fetchLoading(false));
	}
}

function* deleteQuestionSaga(action) {
	try {
		yield put(interviewerActions.fetchLoading(true));
		yield call(interviewerApi.deleteQuestion, action.payload);
		yield put(interviewerActions.deleteQuestionSuccess(action.payload));
	} catch (err) {
		try {
			yield put(interviewerActions.fetchError(err.response.data.message));
		} catch (err2) {
			yield put(
				interviewerActions.fetchError(getErrorMessage(err.response.status))
			);
		}
	} finally {
		yield put(interviewerActions.fetchLoading(false));
	}
}

function* watchQuestionsFlow() {
	yield takeEvery(
		interviewerActions.fetchQuestionsRequest.toString(),
		getQuestionsSaga
	);
	yield takeEvery(
		interviewerActions.createQuestionRequest.toString(),
		createQuestionSaga
	);
	yield takeEvery(
		interviewerActions.updateQuestionRequest.toString(),
		updateQuestionSaga
	);
	yield takeEvery(
		interviewerActions.deleteQuestionRequest.toString(),
		deleteQuestionSaga
	);
}

export default function* interviewerSaga() {
	yield fork(watchGetPositionsFlow);
	yield fork(watchQuestionsFlow);
}
