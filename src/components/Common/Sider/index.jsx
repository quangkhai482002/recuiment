import {
	HistoryOutlined,
	LineChartOutlined,
	QuestionCircleOutlined,
	StarOutlined,
	TeamOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Sider.scss';
import logo from 'assets/images/FPT_logo.png';

function getItem(label, key, icon, children, type) {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
}

// const items = [
//   getItem("Navigation One", "sub1", <>Icon</>, [
//     getItem("Option 1", "1"),
//     getItem("Option 2", "2"),
//     getItem("Option 3", "3"),
//     getItem("Option 4", "4"),
//   ]),
// ];

const locationMapping = [
	// Admin Mapping
	['/admin', ''],
	['/admin/info', 'info'],
	['/admin/accounts', 'accounts'],
	['/admin/dashboard', 'dashboard'],

	// Recruiter Mapping
	['/recruiter', ''],
	['/recruiter/info', 'info'],
	['/recruiter/event', 'event'],
	['/recruiter/history', 'history'],

	// Interviewer Mapping
	['/interviewer', ''],
	['/interviewer/info', 'info'],
	['/interviewer/history', 'history'],
	['/interviewer/manage-question', 'manage-question'],
];

const menuAdmin = [
	getItem('Recruitment', '', <UnorderedListOutlined />),
	getItem('Accounts', 'accounts', <TeamOutlined />),
	getItem('Dashboard', 'dashboard', <LineChartOutlined />),
	// getItem("Recruiter", "rec", <LineChartOutlined />, [
	//   getItem("Recruitment", "recruiter", <UnorderedListOutlined />),
	//   getItem("Event", "recruiter/event", <StarOutlined />),
	//   getItem("History", "recruiter/history", <HistoryOutlined />),
	// ]),
	// getItem("Interviewer", "itv", <LineChartOutlined />, [
	//   getItem("Recruitment", "interviewer", <UnorderedListOutlined />),
	//   getItem("Question", "interviewer/manage-question", <StarOutlined />),
	//   getItem("History", "interviewer/history", <HistoryOutlined />),
	// ]),
];

const menuRecruiter = [
	getItem('Recruitment', '', <UnorderedListOutlined />),
	getItem('Event', 'event', <StarOutlined />),
	getItem('History', 'history', <HistoryOutlined />),
];
const menuInterviewer = [
	getItem('Recruitment', '', <UnorderedListOutlined />),
	getItem('Question', 'manage-question', <QuestionCircleOutlined />),
	getItem('History', 'history', <HistoryOutlined />),
];

const Sider = ({ role }) => {
	const navigate = useNavigate();
	// const rootSubmenuKeys = ["rec", "ivt"];

	return (
		<Layout.Sider
			breakpoint='lg'
			collapsedWidth={0}
			className='Sider'
			width={'200px'}>
			<div className='MySiderLeft'>
				<Space className='antd-container'>
					<img
						src={logo}
						alt='antd'
						width={45}
						height={25}
					/>
					<Typography.Title
						level={5}
						style={{ marginBottom: '0' }}>
						{role.charAt(0).toUpperCase() + role.slice(1)}
					</Typography.Title>
				</Space>
				<Menu
					mode='inline'
					className='menu'
					defaultSelectedKeys={() => {
						const url = window.location.href.split('/')[4];
						if (!url) {
							return '';
						} else {
							return url;
						}
					}}
					onClick={(e) => navigate(`${e.key}`)}
					items={
						role === 'admin'
							? menuAdmin
							: role === 'recruiter'
							? menuRecruiter
							: menuInterviewer
					}
				/>
			</div>
		</Layout.Sider>
	);
};

export default Sider;
