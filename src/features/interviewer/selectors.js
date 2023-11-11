import { flatten } from "utils";

export const flattedQuestionSelector = (state => {
  const questions = state.interviewer.questions;
  return questions.map(question => flatten(question))
})