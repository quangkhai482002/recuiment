import './CandidateHeader.scss';
import { Typography, Dropdown, Layout, Menu } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from 'features/auth/authSlice';
import { LoadingOutlined } from '@ant-design/icons';
import logo from 'assets/images/FPT_logo.png';

export default function MyHeader() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);
	const user = auth.currentUser;

	const dropdownItems = [
		{
			key: 'information',
			label: (
				<Link to='/info'>
					<Typography.Text>Information</Typography.Text>
				</Link>
			),
		},
		{
			key: 'cv',
			label: (
				<Link to='/manage-resumes'>
					<Typography.Text>Resumes</Typography.Text>
				</Link>
			),
		},
		{
			key: 'interview',
			label: (
				<Link to='/history'>
					<Typography.Text>History</Typography.Text>
				</Link>
			),
		},
		{
			label: 'Logout',
			key: 'signout',
			onClick: () => dispatch(authActions.logout()),
		},
	];

	const menuItems = [
		{
			label: 'ABOUT US',
			key: 'about-us',
		},
		{
			label: 'JOBS',
			key: 'jobs',
		},
		{
			label: 'EVENTS',
			key: 'events',
		},
		{
			label: 'CREATE CV',
			key: 'create-cv'
		}
	]

	const onClick = (e) => {
		const key = e.key;
		switch (key) {
			case 'about-us':
				navigate('/about-us');
				break;
			
			case 'jobs':
				navigate('/');
				break;
			
			case 'events':
				navigate('/events');
				break;

			case 'create-cv':
				navigate('/create-resume');
				break;

			default:
				break;
		}
	}

	return (
		<Layout.Header className='CandidateHeader container'>
			<div className='flex align-center gap-2'>
				<Link to='/' className='flex align-center'>
					<img
						className='logo'
						src={logo}
						alt='cplogo'
						width={45}
						height={25}
					/>
				</Link>
				<Menu  onClick={onClick} items={menuItems}  mode='horizontal'/>
			</div>
			{(() => {
				if (auth.status === 'pending')
					return (
						<div className='loading-container'>
							<LoadingOutlined />
						</div>
					);

				if (!user)
					return (
						<div>
							<Typography.Text
								className='signup'
								onClick={() =>
									navigate('/signup', {
										state: { urlToLoad: window.location.href },
									})
								}>
								Sign up
							</Typography.Text>
							<Typography.Text
								className='login'
								onClick={() =>
									navigate('/login', {
										state: { urlToLoad: window.location.href },
									})
								}>
								Log in
							</Typography.Text>
						</div>
					);

				return (
					<Dropdown menu={{ items: dropdownItems }}>
						<div className='avatar'>
							<img
								alt=''
								src={user.linkAvt}
							/>
							<Typography.Text
								className='name'
								level={4}>
								{user.firstName && user.lastName
									? `${user.firstName} ${user.lastName}`
									: user.email}
							</Typography.Text>
						</div>
					</Dropdown>
				);
			})()}
		</Layout.Header>
	);
}
