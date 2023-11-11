import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import recruiterApi from "api/recruiterApi";
import { authSelectors } from "features/auth/authSlice";
import { publicSelectors } from "features/public/publicSlice";
import { recruiterActions } from "features/recruiter/recruiterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./RecruiterCreatePosition.scss";

const { TextArea } = Input;
const dateFormat = "DD/MM/YYYY";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

export default function RecruiterCreatePosition() {
  const navigate = useNavigate();
  const confirm = () => {
    Modal.confirm({
      title: "Cancel",
      icon: <ExclamationCircleOutlined />,
      content: "Cancel the Add position process?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => navigate("/recruiter"),
    });
  };
  const validateParagraph = (_, value) => {
    const lines = value.split('\n');
    if (lines.length >= 4) {
      return Promise.resolve();
    }
    return Promise.reject('The paragraph must be at least 4 lines.');
  };

  const dispatch = useDispatch();
  const { currentUser } = useSelector(authSelectors);
  const { skills } = useSelector(publicSelectors);
  const { positions } = useSelector(publicSelectors);
  const { levels } = useSelector(publicSelectors);

  const onSubmit = async (values) => {
    const newValues = {
      ...values,
      benefit: values.benefit,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      referenceInformation: values.referenceInformation,
      requirements: values.requirements,
      salary: values.salary,
      status: 1,
      totalNeeded: values.totalNeeded,
      remainingNeeded: values.totalNeeded,
      workingLocation: values.workingLocation,
      recruiter: {
        id: currentUser.id,
      },
      position: {
        id: values.position,
      },
      skill: values.skill.map((item) => {
        return {
          id: item,
        };
      }),
      level: values.level.map((item) => {
        return {
          id: item,
        };
      }),
    };
    //check Date logic
    if (newValues.startDate >= newValues.endDate) {
      Modal.confirm({
        title: "Failed",
        content: "The Start Date need to be smaller than the End Date! ",
        onOk() { },
        cancelButtonProps: {
          style: {
            display: "none",
          },
        },
      });
    } else {
      const button = document.getElementById('btn-save');
      try {
        button.disabled = true;
        const fetchData = await recruiterApi.addPosition(newValues).then(() => {
          dispatch(recruiterActions.getPositions({ page: 1, limit: 200 }));
          setTimeout(() => {
            navigate(`/recruiter`);
          }, 2000);
        });
        console.log("responseAddPosition", await fetchData);
        Modal.confirm({
          title: "Success",
          icon: <CheckCircleTwoTone />,
          content: "Add New Position Successfull! ",
          onOk() { },
          cancelButtonProps: {
            style: {
              display: "none",
            },
          },
        });
      } catch (error) {
        console.log("add failed");
        button.disabled = false;
        Modal.confirm({
          title: "Failed",
          content: "Failed To Add New Position! ",
          onOk() { },
          cancelButtonProps: {
            style: {
              display: "none",
            },
          },
        });
      }
    }
  };

  return (
    <div className="RecruiterCreatePosition internal-container">
      {skills && positions && levels && (
        <div className="container">
          <h2>Add New Position</h2>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              label="Position"
              name="position"
              rules={[
                {
                  required: true,
                  message: "The Position Name Can't Be Empty!",
                },
              ]}
            >
              <Select
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select"
                onChange={handleChange}
                options={positions.map((position) => ({
                  value: position.id,
                  label: position.name,
                }))}
              />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              label="Skill Required"
              name="skill"
              rules={[
                {
                  required: true,
                  message: "The Skill Can't Be Empty!",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select"
                onChange={handleChange}
                options={skills.map((skill) => ({
                  value: skill.id,
                  label: skill.name,
                }))}
              />
            </Form.Item>
            <Row>
              <Col span="12">
                <Form.Item
                  label="Level"
                  name="level"
                  rules={[
                    {
                      required: true,
                      message: "The Level Can't Be Empty!",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: "100%",
                    }}
                    placeholder="Please select"
                    onChange={handleChange}
                    options={levels.map((level) => ({
                      value: level.id,
                      label: level.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  wrapperCol={{ span: 16 }}
                  label="Total Needed"
                  name="totalNeeded"
                  rules={[
                    {
                      required: true,
                      message: "The Total Needed Can't Be Empty!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <Form.Item
                  label="Salary"
                  name="salary"
                  rules={[
                    {
                      required: true,
                      message: "The Salary Can't Be Empty!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  label="Start Date"
                  name="startDate"
                  rules={[
                    {
                      required: true,
                      message: "The Start Date Can't Be Empty!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <Form.Item
                  label="Working Location"
                  name="workingLocation"
                  rules={[
                    {
                      required: true,
                      message: "The Working Location Can't Be Empty!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  label="End Date"
                  name="endDate"
                  rules={[
                    {
                      required: true,
                      message: "The End Date Can't Be Empty!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "The Description Can't Be Empty!",
                    },
                    { validator: validateParagraph },
                  ]}

                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  label="Requirements"
                  name="requirements"
                  rules={[
                    {
                      required: true,
                      message: "The Requirements Can't Be Empty!",
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <Form.Item
                  label="Benefit"
                  name="benefit"
                  rules={[
                    {
                      required: true,
                      message: "The Benefit Can't Be Empty!",
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  label="Reference Information"
                  name="referenceInformation"
                  rules={[
                    {
                      required: true,
                      message: "The Reference Information Can't Be Empty!",
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              wrapperCol={{
                offset: 11,
                span: 12,
              }}
            >
              <Button
                type="primary"
                danger
                onClick={() => {
                  confirm();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" id="btn-save">
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
