import {
	ArrowLeftOutlined,
	LockOutlined,
	MailOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Typography } from 'antd';
import authApi from 'api/authApi';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.scss';
import FPT_logo from 'assets/images/FPT_Software_logo.png';

const Signup = () => {
	const [loading, setLoading] = useState(false);

	const handleSignupClick = async (values) => {
		try {
			setLoading(true);
			const newValues = {
				email: values.email,
				password: values.password,
			};
			await authApi.register(newValues);

			console.log('verifyEmail');

			Modal.confirm({
				title: 'Check email',
				content: 'Please check your email to verify account',
				onOk() {},
				cancelButtonProps: {
					style: {
						display: 'none',
					},
				},
			});
			setLoading(false);
		} catch (error) {
			const status = error.response.status;
			if (status === 400) {
				console.log('Email not exist');
				Modal.error({
					title: 'Email not exist',
					content: 'Email is not exist. Please check your email.',
					onOk() {},
					cancelButtonProps: {
						style: {
							display: 'none',
						},
					},
				});
			} else if (status === 409) {
				console.log('Email already exists');

				Modal.warning({
					title: 'Email already exists',
					content: 'Email has already exists',
					cancelButtonProps: {
						style: {
							display: 'none',
						},
					},
					onOk() {},
				});
				setLoading(false);
			}
			setLoading(false);
		}
	};

	return (
		<div className='Signup'>
			<Form
				className='Form'
				autoComplete='off'
				onFinish={handleSignupClick}>
				<Link to={'/'}>
					<div className='goBack'>
						<img
							src={FPT_logo}
							alt='Go back'
							height={55}
							width={150}
						/>
					</div>
				</Link>
				<Typography.Text
					block
					level={1}
					className='header'>
					Sign <span>Up!</span>
				</Typography.Text>

				<Form.Item
					hasFeedback
					name='email'
					labelAlign='left'
					rules={[
						{
							required: true,
							message: 'Please enter your email',
						},
						{ type: 'email' },
					]}>
					<Input
						bordered
						className='input'
						prefix={<MailOutlined />}
						size='large'
						placeholder='Email'
						style={{ marginRight: '5px' }}></Input>
				</Form.Item>
				<Form.Item
					hasFeedback
					name='password'
					rules={[
						{
							required: true,
							message: 'Please enter your password',
						},
					]}>
					<Input.Password
						required
						bordered
						prefix={<LockOutlined />}
						className='input'
						placeholder='Password'
					/>
				</Form.Item>

				<Form.Item
					hasFeedback
					labelAlign='left'
					name='confirm-password'
					dependencies={['password']}
					rules={[
						{
							required: true,
							message: 'Confirm password',
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								return !value || getFieldValue('password') === value
									? Promise.resolve()
									: Promise.reject('The two password is not the same');
							},
						}),
					]}>
					<Input.Password
						bordered
						size='large'
						type='password'
						prefix={<LockOutlined />}
						className='input'
						placeholder='Confirm password'></Input.Password>
				</Form.Item>
				<Form.Item style={{ marginTop: '20px' }}>
					<Button
						block
						loading={loading}
						type='primary'
						htmlType='submit'
						className='button'
						disabled={loading}>
						Sign up
					</Button>
				</Form.Item>

				<Link to='/login'>
					<ArrowLeftOutlined />
					<span
						className='linkSmall'
						style={{ marginLeft: '5px' }}>
						Back to login
					</span>
				</Link>
			</Form>
		</div>
	);
};

export default Signup;
