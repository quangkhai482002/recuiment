import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	status: 0,
	currentUser: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login(state) {
			state.status = 'pending';
		},
		loginSuccess(state, actions) {
			state.status = 200;
			state.currentUser = actions.payload;
		},
		loginFailed(state, actions) {
			state.status = actions.payload;
		},
		logout(state) {
			state.status = 0;
			state.currentUser = null;
		},

		getInfo(state) {
			state.status = 'pending';
		},

		setInfo(state) {
			state.status = 'pending';
		},

		setInfoSuccess(state, actions) {
			state.status = 200;
			state.currentUser = actions.payload;
		},

		setInfoFailed(state, actions) {
			state.currentUser = actions.payload;
		},
	},
});

//Reducers
export default authSlice.reducer;

//Actions
export const authActions = authSlice.actions;

//Selector auth
export const authSelectors = (state) => state.auth;
