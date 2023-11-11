import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Divider,
	Form,
	Input,
	Layout,
	Modal,
	Popconfirm,
	Space,
	Tooltip,
	Typography,
	Select,
	message,
} from 'antd';
import './ManageQuestion.scss';
import { useEffect, useState } from 'react';
import CustomTable from 'components/Common/CustomTable';
import { useDispatch, useSelector } from 'react-redux';
import { interviewerActions } from 'features/interviewer/interviewerSlice';
import { flattedQuestionSelector } from 'features/interviewer/interviewerSelector';

const formLayout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};

const InterviewerManageQuestion = () => {
	const questions = useSelector(flattedQuestionSelector);
	const loading = useSelector((state) => state.interviewer.loading);
	const notification = useSelector((state) => state.interviewer.notification);
	const skills = useSelector((state) => state.public.skills ? state.public.skills : []);

	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const [openModal, setOpenModal] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();

	const createQuestion = (question) => {
		setOpenModal(false);
		dispatch(interviewerActions.createQuestionRequest(question));
	};

	const updateQuestion = (question) => {
		setOpenModal(false);
		dispatch(interviewerActions.updateQuestionRequest(question));
	};

	const deleteQuestion = (id) => {
		setOpenModal(false);
		dispatch(interviewerActions.deleteQuestionRequest(id));
	};

	useEffect(() => {
		if (notification.type)
			messageApi.open({
				type: notification.type,
				content: notification.message,
				onClose: () => dispatch(interviewerActions.resetNotification()),
			});
	}, [dispatch, messageApi, notification]);

	// Define columns for table
	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
			key: 'id',
			width: '8%',
			align: 'center',
			render: (_, record) => (
				<Typography.Text className='id'>{record.id}</Typography.Text>
			),
		},
		{
			title: 'Công nghệ',
			dataIndex: 'skill_name',
			key: 'skill_name',
			isSearchByValue: true,
			width: '17%',
		},
		{
			title: 'Câu hỏi',
			dataIndex: 'content',
			key: 'content',
			isSearchByValue: true,
			width: '20%',
		},
		{
			title: 'Câu trả lời',
			dataIndex: 'answer',
			key: 'answer',
		},
		{
			width: '7%',
			className: 'centre-align',
			render: (_, record) => (
				<Space>
					<Tooltip
						title='Delete'
						placement='top'>
						<Popconfirm
							placement='bottom'
							title='Sure to delete?'
							onConfirm={() => deleteQuestion(record.id)}>
							<DeleteOutlined
								className='table-icon'
								style={{ background: '#ff5b57' }}
							/>
						</Popconfirm>
					</Tooltip>
					<Tooltip
						title='Edit'
						placement='top'>
						<EditOutlined
							className='table-icon'
							style={{ background: '#348fe2' }}
							onClick={() => {
								setOpenModal(true);
								form.setFieldsValue(record);
							}}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	// Render
	return (
		<Layout.Content className='ManageQuestion internal-container'>
			{contextHolder}
			<div className='title-container'>
				<Typography.Title
					level={3}
					className='title'>
					Manage Question
				</Typography.Title>
				<Button
					className='button'
					icon={<PlusOutlined />}
					onClick={() => {
						form.resetFields();
						setOpenModal(true);
					}}>
					Thêm
				</Button>
			</div>

			<Divider className='divider' />

			<div className='table-container'>
				<div className='table-header'>
					<Typography.Title level={4}>Bảng Câu Hỏi</Typography.Title>
				</div>
				<CustomTable
					data={questions}
					isLoading={loading}
					columns={columns}
				/>
			</div>

			<Modal
				forceRender
				footer={null}
				open={openModal}
				className='ManageQuestionModal'
				onCancel={() => setOpenModal(false)}
				title={form.getFieldValue('id') ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}>
				<Form
					// Base on question ID
					// If the form does not have question id, it is ADD_QUESTION action
					// Otherwise, it is EDIT_QUESTION action
					{...formLayout}
					form={form}
					autoComplete='off'
					onFinish={(question) =>
						question.id ? updateQuestion(question) : createQuestion(question)
					}>
					<Form.Item
						label='ID'
						name='id'>
						<Input disabled />
					</Form.Item>

					<Form.Item
						label='Công nghệ'
						name='skill_id'
						rules={[{ required: true }]}>
						<Select
							options={skills.map((skill) =>
								Object.create({ value: skill.id, label: skill.name })
							)}
						/>
					</Form.Item>

					<Form.Item
						label='Câu hỏi'
						name='content'
						rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item
						label='Câu trả lời'
						name='answer'
						rules={[{ required: true }]}>
						<Input.TextArea
							autoSize
							style={{ maxHeight: '200px' }}
						/>
					</Form.Item>

					<Form.Item wrapperCol={{ span: 4, offset: 20 }}>
						<Button
							block
							type='primary'
							htmlType='submit'
							className='button'>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</Layout.Content>
	);
};

export default InterviewerManageQuestion;
