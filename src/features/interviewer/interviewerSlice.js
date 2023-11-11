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
  questions: [],
  loading: false,

  // Type: Success or Error
  // Message: show for user
  notification: {
    type: null,
    message: null,
  },
};

const interviewerSlice = createSlice({
  name: "interviewer",
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
      state.data = undefined;
    },

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

    fetchQuestionsRequest(state) {},
    createQuestionRequest(state, action) {},
    updateQuestionRequest(state, action) {},
    deleteQuestionRequest(state, action) {},

    fetchQuestionsSuccess(state, action) {
      state.questions = action.payload;
    },

    createQuestionSuccess(state, action) {
      state.questions.push(action.payload);
      state.notification.type = "success";
      state.notification.message = "Created Successfully";
    },

    updateQuestionSuccess(state, action) {
      const updatedQuestion = action.payload;
      const index = state.questions.findIndex(
        (question) => question.id === updatedQuestion.id
      );
      if (index !== -1) {
        state.questions[index] = updatedQuestion;
        state.notification.type = "success";
        state.notification.message = "Updated Successfully";
      }
    },

    deleteQuestionSuccess(state, action) {
      state.questions = state.questions.filter(
        (question) => question.id !== action.payload
      );
      state.notification.type = "success";
      state.notification.message = "Deleted Successfully";
    },
  },
});

// Reducers
export default interviewerSlice.reducer;

// Actions
export const interviewerActions = interviewerSlice.actions;

// Selectors
export const interviewerSelectors = (state) => state.interviewer;
