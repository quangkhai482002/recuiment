import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import candidateSlice from 'features/candidate/candidateSlice';
import authSlice from 'features/auth/authSlice';
import interviewerSlice from 'features/interviewer/interviewerSlice';
import recruiterSlice from 'features/recruiter/recruiterSlice';
import adminSlice from 'features/admin/adminSlice';
import publicSlice from 'features/public/publicSlice';

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
	reducer: {
		public: publicSlice,
		auth: authSlice,
		candidate: candidateSlice,
		interviewer: interviewerSlice,
		recruiter: recruiterSlice,
		admin: adminSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga);
