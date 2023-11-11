const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  skills: [],
  positions: [],
  levels: [],
  events: [],
};
const publicSlice = createSlice({
  name: "public",
  initialState,
  reducers: {
    getSkill(state, actions) {
      state.skills = actions.payload;
    },
    getPositions(state, actions) {
      state.positions = actions.payload;
      // console.log(state.skills);
    },
    getLevels(state, actions) {
      state.levels = actions.payload;
    },
    getEvents(state, actions) {
      state.events = actions.payload;
      console.log(state.events);
    },
    fetchPublic(state) {
      state.skills = [];
      state.positions = [];
      state.levels = [];
      state.events = [];
    },
    fetchPublicFailed(state) {
      state.skills = [];
      state.positions = [];
      state.levels = [];
      state.events = [];
    },
  },
});

// Reducers
export default publicSlice.reducer;

// Actions
export const publicActions = publicSlice.actions;

// Selector

export const publicSelectors = (state) => state.public;
