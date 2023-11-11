import { createSelector } from 'reselect';

export const resumesSelector = (state) => state.candidate.resumes;
export const loadingSelector = (state) => state.candidate.loading;
export const notificationSelector = (state) => state.candidate.notification;
export const userSelector = (state) => state.auth.currentUser;
export const authLoadingSelector = (state) => state.auth.status === 'pending';


export const resumeSelector = (id) =>
	createSelector(resumesSelector, (resumes) => {
		const idInt = parseInt(id);
		return resumes.find((resume) => resume.id === idInt);
	});
