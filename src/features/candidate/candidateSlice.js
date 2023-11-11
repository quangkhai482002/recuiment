const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  currentVacancies: {
    status: "",
    params: {},
    data: [],
  },
  resumes: [],
  loading: false,

  // Type: Success or Error
  // Message: show for user
  notification: {
    type: null,
    message: null,
  },
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    getVacancies(state) {
      state.currentVacancies.status = "pending";
    },
    getVacanciesSuccess(state, actions) {
      state.currentVacancies = {
        status: "200",
        data: actions.payload.data,
        params: actions.payload.params,
      };
    },
    getVacanciesFailed(state) {
      state.currentVacancies.status = "401";
      state.currentVacancies.data = [];
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
    fetchSuccess(state, action) {
      state.notification.type = "success";
      state.notification.message = action.payload;
    },
    fetchLoading(state, action) {
      state.loading = action.payload;
    },

    fetchResumesRequest(state) {},
    createResumeRequest(state, action) {},
    updateResumeRequest(state, action) {},
    deleteResumeRequest(state, action) {},

    fetchResumesSuccess(state, action) {
      state.resumes = action.payload;
    },

    createResumeSuccess(state, action) {
      state.resumes.push(action.payload);
      state.notification.type = "success";
      state.notification.message = "Created Successfully";
    },

    updateResumeSuccess(state, action) {
      const updatedResume = action.payload;
      const index = state.resumes.findIndex(
        (resume) => resume.id === updatedResume.id
      );
      if (index !== -1) {
        state.resumes[index] = updatedResume;
        state.notification.type = "success";
        state.notification.message = "Updated Successfully";
      }
    },

    deleteResumeSuccess(state, action) {
      state.resumes = state.resumes.filter(
        (resume) => resume.id !== action.payload
      );
      state.notification.type = "success";
      state.notification.message = "Deleted Successfully";
    },

    applyJobRequest(state, action) {},

    applyJobSuccess(state, action) {
      state.notification.type = "success";
      state.notification.message = "Apply Successfully";
    },

    
    
  },
});

// Reducers
export default candidateSlice.reducer;

// Actions
export const candidateActions = candidateSlice.actions;

// Selectors
export const candidateSelectors = (state) => state.candidate;
