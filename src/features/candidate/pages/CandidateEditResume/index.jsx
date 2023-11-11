import { Button, Result, message } from 'antd';
import { useEffect, useLayoutEffect } from 'react';
import { Resume } from 'components/Common';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
	resumeSelector,
	loadingSelector,
	notificationSelector,
	authLoadingSelector,
} from 'features/candidate/candidateSelector';
import './CandidateEditResume.scss';
import { candidateActions } from 'features/candidate/candidateSlice';

const CandidateEditResume = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { resumeID } = useParams();
	const accessToken = localStorage.getItem('accessToken');
	const [messageApi, contextHolder] = message.useMessage();

	const loading = useSelector(loadingSelector);
	const resume = useSelector(resumeSelector(resumeID));
	const notification = useSelector(notificationSelector);
	const userFetching = useSelector(authLoadingSelector);

	// Hide Footer
	useLayoutEffect(() => {
		const footers = document.getElementsByTagName('footer');
		for (var i = 0; i < footers.length; i++) footers[i].style.display = 'none';

		const contents = document.getElementsByClassName('Content');
		const content = contents[0];
		content.style.overflowY = 'hidden';
		content.style.background = '#dee2e6';

		return () => {
			for (var i = 0; i < footers.length; i++)
				footers[i].style.display = 'block';

			content.style.overflowY = 'scroll';
			content.style.background = '#f5f5f5';
		};
	}, []);

	// Handle loading effect
	useEffect(() => {
		if (loading)
			return messageApi.loading({
				content: 'Loading...',
				duration: 1000,
				key: 'EditResumeLoading',
			});
		messageApi.destroy('EditResumeLoading');

		let reset = true;
		switch (notification.type) {
			case 'success':
				messageApi.success(notification.message, 1, () =>
					navigate('/manage-resumes')
				);
				break;

			case 'error':
				messageApi.error(notification.message, 2);
				break;

			default:
				reset = false;
		}

		if (reset) dispatch(candidateActions.resetNotification());
	}, [loading, messageApi, dispatch, navigate, notification]);

	return (
		<div className='CandidateEditResume'>
			{contextHolder}

			{(() => {
				if (!accessToken)
					return (
						<Result
							status={403}
							title={403}
							subTitle='Bạn cần phải đăng nhập để thực hiện chỉnh sửa CV !!!'
							extra={
								<div className='flex justify-evenly w-full'>
									<div className='flex gap-8'>
										<Button onClick={() => navigate('/')}>Home</Button>
										<Button
											type='primary'
											onClick={() =>
												navigate('/login', {
													state: {
														urlToLoad: window.location.href,
													},
												})
											}>
											Đăng nhập
										</Button>
									</div>
								</div>
							}
						/>
					);

				if (!userFetching) {
					if (!resume)
						return (
							<Result
								status={404}
								title={404}
								subTitle='Không tìm thấy CV này trong danh sách các CV của bạn !!!'
								extra={
									<div className='flex justify-evenly w-full'>
										<div className='flex gap-8'>
											<Button onClick={() => navigate('/')}>Home</Button>
											<Button
												type='primary'
												onClick={() => navigate('/manage-resumes')}>
												Quay lại
											</Button>
										</div>
									</div>
								}
							/>
						);

					if (!resume.data)
						return (
							<Result
								status='warning'
								subTitle=' Không thể chỉnh sửa vì CV này không phải CV của hệ thống !!!'
								extra={
									<div className='flex justify-evenly w-full'>
										<div className='flex gap-8'>
											<Button onClick={() => navigate('/')}>Home</Button>
											<Button
												type='primary'
												onClick={() => navigate('/manage-resumes')}>
												Quay lại
											</Button>
										</div>
									</div>
								}
							/>
						);

					return (
						<Resume
							loading={loading}
							resume={resume}
						/>
					);
				}
			})()}
		</div>
	);
};

export default CandidateEditResume;
