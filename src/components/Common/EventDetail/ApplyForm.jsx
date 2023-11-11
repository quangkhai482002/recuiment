import dayjs from "dayjs";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { authSelectors } from "features/auth/authSlice";
import { useSelector } from "react-redux";
dayjs.extend(customParseFormat);

const layout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 5,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 20,
        },
    },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
    },
};

export default function ApplyForm({ func }) {
    const { currentUser } = useSelector(authSelectors);

    return (
        <Form
            {...layout}
            name="nest-messages"
            style={{
                maxWidth: 600,
                marginTop: 30,
            }}
            validateMessages={validateMessages}
            size="large"
            onFinish={func}
        >
            <Form.Item
                name={['user', 'firstName']}
                label="First name"
                rules={[
                    {
                        required: true,
                    },
                ]}
                validateStatus="success"
                initialValue={currentUser ? currentUser.firstName ? currentUser.firstName : "" : ""}
            >
                <Input maxLength={60} placeholder="Type your first name" />
            </Form.Item>
            <Form.Item
                name={['user', 'lastName']}
                label="Last name"
                rules={[
                    {
                        required: true,
                    },
                ]}
                validateStatus="success"
                initialValue={currentUser ? currentUser.lastName ? currentUser.lastName : "" : ""}
            >
                <Input maxLength={60} placeholder="Type your last name" />
            </Form.Item>
            <Form.Item name={['user', 'sex']}
                label="Sex"
                rules={[{
                    required: true,
                }]}
                validateStatus="success"
                initialValue={currentUser ? currentUser.sex ? currentUser.sex : 0 : 0}
            >
                <Select
                    options={[
                        {
                            value: 1,
                            label: 'Male',
                        },
                        {
                            value: 0,
                            label: 'Female',
                        }
                    ]}
                    placeholder="Select your gender"
                />
            </Form.Item>
            <Form.Item name={['user', 'birthday']} label="Birthday"
                rules={[{
                    required: true,
                }]}
                validateStatus="success"
                initialValue={currentUser ? currentUser.birthday ? dayjs(currentUser.birthday, "YYYY-MM-DD") : dayjs("2023-01-01", "YYYY-MM-DD") : dayjs("2023-01-01", "YYYY-MM-DD")}
            >
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
                name={['user', 'email']}
                label="Email"
                rules={[
                    {
                        required: true,
                        type: 'email',
                    },
                ]}
                validateStatus="success"
                initialValue={currentUser ? currentUser.email ? currentUser.email : "" : ""}
            >
                <Input maxLength={60} placeholder="Type your email" />
            </Form.Item>
            <Form.Item
                name={['user', 'phoneNumber']}
                label="Phone"
                rules={[
                    {
                        required: true,
                    },
                ]}
                validateStatus="success"
                initialValue={currentUser ? currentUser.phoneNumber ? currentUser.phoneNumber : "" : ""}
            >
                <Input placeholder="Type your phone number" type="number" />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 20,
                    span: 16,
                }}
                style={{
                    marginTop: 50
                }}
            >
                <Button type="primary" htmlType="submit" id="btn-submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}