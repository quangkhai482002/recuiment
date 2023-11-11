import { ConfigProvider, Layout } from 'antd';
import { authActions, authSelectors } from 'features/auth/authSlice';
import { publicActions } from 'features/public/publicSlice';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import InternalHeader from '../Common/InternalHeader';
import Sider from '../Common/Sider';
import './Layout.scss';
import { interviewerActions } from 'features/interviewer/interviewerSlice';

const { Content } = Layout;

export default function ManagerLayout(props) {
	const dispatch = useDispatch();
	const { role } = props;
	const { currentUser, status } = useSelector(authSelectors);

	const handleLogoutClick = useCallback(() => {
		dispatch(authActions.logout());
	}, [dispatch]);

	useEffect(() => {
		dispatch(publicActions.fetchPublic());

		if (role === 'interviewer')
			dispatch(interviewerActions.fetchQuestionsRequest());
	}, [dispatch, role]);

	return (
		<ConfigProvider
			theme={{
				token: {
					colorBgLayout: '#dee2e6',
				},
			}}>
			<Layout
				hasSider
				className='Layout'>
				<Sider role={role} />
				<Content className='Content internal-content'>
					<InternalHeader
						handleLogoutClick={handleLogoutClick}
						role={role}
						currentUser={currentUser ? currentUser : undefined}
						status={status ? status : undefined}
					/>
					<Outlet />
				</Content>
			</Layout>
		</ConfigProvider>
	);
}
