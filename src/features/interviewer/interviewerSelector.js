import { flatten } from 'utils';
import { createSelector } from 'reselect';


export const questionsSelector = (state) => state.interviewer.questions;

export const flattedQuestionSelector = createSelector(
	[questionsSelector],
	(questions) => {
		const flattedQuestion = questions.map((question) => flatten(question));
		return flattedQuestion;
	}
);
