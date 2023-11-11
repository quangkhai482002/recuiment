import Resume from 'components/Common/ResumeV2';
import { useEffect, useLayoutEffect } from 'react';
import './CreateResume.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { candidateActions } from 'features/candidate/candidateSlice';
import {
	loadingSelector,
	notificationSelector,
} from 'features/candidate/candidateSelector';

const CreateResume = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loading = useSelector(loadingSelector);
	const notification = useSelector(notificationSelector);
	const [messageApi, contextHolder] = message.useMessage();

	// Hide Footer
	useLayoutEffect(() => {
		const footers = document.getElementsByTagName('footer');
		for (var i = 0; i < footers.length; i++) footers[i].style.display = 'none';

		const contents = document.getElementsByClassName("Content");
		const content = contents[0]
		content.style.overflowY = 'hidden';
		content.style.background = "#dee2e6";
		

		return () => {
			for (var i = 0; i < footers.length; i++)
				footers[i].style.display = 'block';

			content.style.overflowY = 'scroll';
			content.style.background = "#f5f5f5";
		};
	}, []);

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');

		// If user does not log in -> do not display any message
		if (!accessToken) return;

		// If there is a side effect working -> show loading effect
		if (loading)
			return messageApi.loading({
				content: 'Loading...',
				duration: 1000,
				key: 'CreateResumeLoading',
			});
		messageApi.destroy('CreateResumeLoading');

		let reset = true;
		switch (notification.type) {
			case 'success':
				console.log('Success');
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
	}, [notification, navigate, loading, dispatch, messageApi]);

	return (
		<div className='CreateResume'>
			{contextHolder}
			<Resume loading={loading} />
		</div>
	);
};

export default CreateResume;
