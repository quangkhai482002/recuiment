import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, Form, InputNumber, Table, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { createSetValueFilter } from "utils";
const { Title, Text } = Typography;

export default function ScoredQuestion(props) {
  const [enabled, setEnabled] = useState(null);
  const {
    status,
    scoredData,
    handleDeleteClick,
    handleUpdateClick,
    handleSubmitClick,
  } = props;

  let skillFilter = scoredData.map((item) => {
    return item.question.skill.name;
  });

  skillFilter = createSetValueFilter(skillFilter);
  const columns = [
    {
      title: "Skills",
      dataIndex: "question",
      filters: [...skillFilter],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) =>
        record.question.skill.name.indexOf(value) === 0,
      sorter: (a, b) =>
        a.question.skill.name.length - b.question.skill.name.length,
      sortDirections: ["descend"],
      render: (question, _) => {
        return <Text>{question.skill.name}</Text>;
      },
    },
    {
      title: "Questions",
      dataIndex: "question",
      responsive: ["md"],
      defaultSortOrder: "descend",
      sorter: (a, b) => a.question.content.length - b.question.content.length,
      render: (question, _) => {
        return <Text>{question.content}</Text>;
      },
    },
    {
      title: "Answers",
      dataIndex: "question",
      responsive: ["md"],
      render: (question, _) => {
        return <Text>{question.answer}</Text>;
      },
    },
    {
      title: "Scores",
      dataIndex: "score",
      render: (score, _, index) => {
        return <Text strong>{score}</Text>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      responsive: ["md"],
      render: (note, _, index) => {
        return <Text>{note}</Text>;
      },
    },
    {
      title: "",
      dataIndex: "score",
      render: (_, value, index) => {
        return (
          <Button
            disabled={status !== "PENDING"}
            type="link"
            onClick={() => {
              setEnabled(value);
            }}
          >
            <FontAwesomeIcon icon="fa-regular fa-pen-to-square" />
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <Table
        caption={
          <Title level={5} style={{ margin: "1rem 0" }}>
            Scored Questions
          </Title>
        }
        bordered
        size="middle"
        columns={columns}
        dataSource={scoredData}
      />
      {scoredData.length !== 0 && (
        <Button
          disabled={status !== "PENDING"}
          type="primary"
          style={{ margin: "1rem 0 4rem 100%", translate: "-100%" }}
          onClick={() => {
            handleSubmitClick();
          }}
        >
          Complete
        </Button>
      )}
      <Drawer
        open={enabled}
        onClose={() => {
          setEnabled(null);
        }}
      >
        {enabled && (
          <Form
            initialValues={{
              remember: true,
            }}
            onFinish={(values) => {
              handleUpdateClick({
                ...enabled,
                score: values.score,
                note: values.note,
              });
              setEnabled(null);
            }}
            autoComplete="off"
          >
            <Form.Item name={"question"} label={<Text strong>Question</Text>}>
              <Text>{enabled.question.content}</Text>
            </Form.Item>
            <Form.Item name={"answer"} label={<Text strong>Answer</Text>}>
              <Text>{enabled.question.answer}</Text>
            </Form.Item>
            <Form.Item
              name={"score"}
              initialValue={enabled.score}
              label={<Text strong>Score</Text>}
              rules={[
                {
                  required: true,
                  message: "Please input your score!",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name={"note"}
              initialValue={enabled.note}
              label={<Text strong>Note</Text>}
            >
              <TextArea />
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="default"
                danger
                style={{ margin: "0 0.5rem" }}
                onClick={() => {
                  handleDeleteClick(enabled);
                  setEnabled(null);
                }}
              >
                Delete
              </Button>
              <Button
                type="default"
                htmlType="reset"
                style={{ margin: "0 0.5rem" }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ margin: "0 0.5rem" }}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Drawer>
    </>
  );
}
