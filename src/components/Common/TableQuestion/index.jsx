import { useEffect, useState } from "react";
import ListOfQuestions from "./ListOfQuestions";
import ScoredQuestion from "./ScoredQuestion";
import "./TableQuestion.scss";

export default function TableQuestion(props) {
  const {
    status,
    questions,
    interviewQuestions,
    handleSelectClick,
    handleUpdateClick,
    handleDeleteClick,
    handleSubmitClick,
    handleAddNewQuestionClick,
  } = props;
  const [data, setData] = useState([]);
  const [scoredData, setScoredData] = useState([]);

  useEffect(() => {
    if (interviewQuestions && questions) {
      setScoredData(interviewQuestions);
      const scoredQuestionsId = interviewQuestions.map(
        (item) => item.question.id
      );
      const data = questions.filter(
        (item) => !scoredQuestionsId.includes(item.key)
      );
      setData(data);
    }
  }, [interviewQuestions, questions]);

  return (
    <div className="TableQuestion">
      <ScoredQuestion
        status={status}
        scoredData={scoredData}
        handleDeleteClick={handleDeleteClick}
        handleUpdateClick={handleUpdateClick}
        handleSubmitClick={handleSubmitClick}
      />

      <ListOfQuestions
        status={status}
        data={data}
        handleSelectClick={handleSelectClick}
        handleAddNewQuestionClick={handleAddNewQuestionClick}
      />
    </div>
  );
}
