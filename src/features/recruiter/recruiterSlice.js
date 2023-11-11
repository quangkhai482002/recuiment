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
  currentEvents: {
    status: "",
    data: {
      page: 0,
      limit: 0,
      data: [],
    },
  },
  event: {
    status: "",
    data: {},
  },

  currentHistory: {
    status: "",
    data: {
      page: 0,
      limit: 0,
      data: [],
    },
  },
  history: {
    status: {},
    data: {},
  },
  loading: false,
  notification: {
    type: null,
    message: null,
  },
};

const recruiterSlice = createSlice({
  name: "recruiter",
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
      state.currentPositions = {
        status: "403",

        data: [],
      };
    },
    getEvents(state) {
      state.currentEvents.status = "pending";
    },
    getEventsSuccess(state, actions) {
      state.currentEvents = {
        status: "200",
        data: actions.payload,
      };
    },
    getEventsFailed(state) {
      state.currentEvents = {
        status: "403",

        data: [],
      };
    },
    //======History======//
    getHistory(state) {
      state.currentHistory.status = "pending";
    },
    getHistorySuccess(state, actions) {
      state.currentHistory = {
        status: "200",
        data: actions.payload,
      };
    },
    getHistoryFailed(state) {
      state.currentHistory = {
        status: "403",
        data: undefined,
      };
    },
    //====================//
    createInterviewRequest(state, action) {},

    createInterviewSuccess(state, action) {
      state.notification.type = "success";
      state.notification.message = "Create Interview Successfully";
      localStorage.setItem("interviewId", action.payload.id);
    },
    //-----------------------------
    updateInterviewRequest(state, action) {},

    updateInterviewSuccess(state, action) {
      state.notification.type = "success";
      state.notification.message = "Update Interview Successfully";
    },
    //-----------------------------
    cancelInterviewRequest(state, action) {},

    cancelInterviewSuccess(state, action) {
      state.notification.type = "success";
      state.notification.message = "Cancel Interview Successfully";
    },

    //-----------------------------
    createCalendarRequest(state, action) {},

    createCalendarSuccess(state, action) {
      state.notification.type = "success";
      state.notification.message = "Create Calendar Successfully";
    },

    //-----------------------------
    resetNotification(state, action) {
      state.notification.type = null;
      state.notification.message = null;
    },

    fetchError(state, action) {
      state.notification.type = "error";
      state.notification.message = action.payload;
    },

    fetchLoading(state, action) {
      state.loading = action.payload;
    },
    //====================//
  },
});

// Reducers
export default recruiterSlice.reducer;

// Actions
export const recruiterActions = recruiterSlice.actions;

// Selectors
export const recruiterSelectors = (state) => state.recruiter;
