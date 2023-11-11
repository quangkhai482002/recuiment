import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, Form, Select, Table, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { publicSelectors } from "features/public/publicSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { createSetValueFilter } from "utils";
const { Title, Text } = Typography;

export default function ListOfQuestions(props) {
  const { data, status, handleSelectClick, handleAddNewQuestionClick } = props;
  const [open, setOpen] = useState(false);
  const { skills } = useSelector(publicSelectors);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  let skillFilter = data.map((item) => {
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
      render: (_, value) => {
        return (
          <Button
            disabled={status !== "PENDING"}
            type="link"
            onClick={() => {
              handleSelectClick(value);
            }}
          >
            <FontAwesomeIcon icon="fa-solid fa-hand-pointer" size="lg" />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Table
        style={{ margin: "2rem 0" }}
        caption={
          <Title level={5} style={{ margin: "1rem 0" }}>
            List of Questions
          </Title>
        }
        size="middle"
        bordered
        columns={columns}
        dataSource={data}
      />

      <Button
        disabled={status !== "PENDING"}
        type="primary"
        onClick={showDrawer}
        style={{ margin: "1rem 0 0 100%", translate: "-100%" }}
      >
        New Question
      </Button>
      <Drawer
        title="New Question"
        placement="right"
        onClose={onClose}
        open={open}
      >
        {open && (
          <Form
            onFinish={(values) => {
              handleAddNewQuestionClick(values);
              setOpen(false);
            }}
            initialValues={{
              remember: true,
            }}
            style={{ width: "80%", margin: "auto" }}
            autoComplete="off"
          >
            <Form.Item name="skill">
              <Select
                showSearch
                placeholder="Select a skill"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={skills.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })}
              />
            </Form.Item>
            <Form.Item name="content">
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="Question"
              />
            </Form.Item>
            <Form.Item name="answer">
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder="Answer"
              />
            </Form.Item>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="default"
                htmlType="reset"
                style={{ margin: "0 0.5rem" }}
              >
                Clear
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ margin: "0 0.5rem" }}
              >
                Add
              </Button>
            </div>
          </Form>
        )}
      </Drawer>
    </>
  );
}
