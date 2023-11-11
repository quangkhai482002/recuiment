const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  currentPositions: {
    status: "",
    data: {
      page: 0,
      limit: 0,
      data: [],
    },
  },
  currentAccounts: {
    status: "",
    data: {
      page: 0,
      limit: 0,
      data: [],
    },
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    getPositions(state) {
      state.currentPositions.status = "pending";
    },
    getPositionsSuccess(state, actions) {
      state.currentPositions = {
        status: "200",
        data: actions.payload,
      };
    },
    getPositionsFailed(state) {
      state.status = "406";
      state.data = [];
    },
    getAccounts(state) {
      state.currentAccounts.status = "pending";
    },
    getAccountsSuccess(state, actions) {
      state.currentAccounts = {
        status: "200",
        data: actions.payload,
      };
    },
    getAccountsFailed(state) {
      state.currentAccounts = {
        status: "403",
        data: [],
      };
    },
  },
});

// Reducers
export default adminSlice.reducer;

// Actions
export const adminActions = adminSlice.actions;

// Selectors
export const adminSelectors = (state) => state.admin;
