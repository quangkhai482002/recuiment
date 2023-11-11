import { Layout, ConfigProvider } from 'antd';
import { authActions, authSelectors } from 'features/auth/authSlice';
import { candidateActions } from 'features/candidate/candidateSlice';
import { publicActions } from 'features/public/publicSlice';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import CandidateHeader from '../Common/CandidateHeader';
import MyFooter from '../Common/MyFooter';
import './Layout.scss';

const { Footer, Content } = Layout;

export default function CandidateLayout(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { role } = props;
	const { currentUser, status } = useSelector(authSelectors);

	const handleLogoutClick = useCallback(() => {
		dispatch(authActions.logout());
	}, [dispatch]);

	const currentRole = localStorage.getItem('currentRole');
	const accessToken = localStorage.getItem('accessToken');

	useEffect(() => {
		dispatch(publicActions.fetchPublic());

		if (role === 'candidate' && accessToken)
			dispatch(candidateActions.fetchResumesRequest());
	}, [accessToken, dispatch, role]);
	useEffect(() => {
		if (!accessToken) {
		} else {
			if (
				(status === 0 && currentRole) ||
				(status === 403 && currentRole === role) ||
				(status === 200 && !currentRole)
			) {
				dispatch(authActions.getInfo(role));
			} else if (status === 403 && !currentRole) {
				dispatch(authActions.logout());
			}
			//  else if (status === 403 && currentRole !== role) {
			// 	navigate(`/${currentRole === 'candidate' ? '' : currentRole}`);
			// }
		}
	}, [accessToken, currentRole, dispatch, navigate, role, status]);

	return (
		<Layout className='Layout'>
			<CandidateHeader
				handleLogoutClick={handleLogoutClick}
				role={role}
				currentUser={currentUser ? currentUser : undefined}
			/>
			<Content className='Content'>
				<Outlet />
				<Footer className='Footer'>
					<MyFooter role={role} />
				</Footer>
			</Content>
		</Layout>
	);
}
