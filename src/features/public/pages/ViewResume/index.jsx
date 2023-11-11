import { Layout, Typography, Button, Result } from 'antd';
import { randomInterger } from 'utils';
import bg1 from 'assets/images/bg_1.png';
import bg2 from 'assets/images/bg_2.png';
import bg3 from 'assets/images/bg_3.png';
import bg4 from 'assets/images/bg_4.png';
import bg5 from 'assets/images/bg_5.png';
import bg6 from 'assets/images/bg_6.jpg';
import './ViewResume.scss';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import adminApi from 'api/adminApi';
import candidateApi from 'api/candidateApi';
import recruiterApi from 'api/recruiterApi';
import interviewerApi from 'api/interviewerApi';

const backgroundMapping = {
	1: bg1,
	2: bg2,
	3: bg3,
	4: bg4,
	5: bg5,
	6: bg6,
};

const ViewResume = () => {
	const [link, setLink] = useState(null);
	const [loading, setLoading] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams();
	const [error, setError] = useState({
		status: null,
		message: null,
	});

	const ref = useRef({ api: null, payload: null });
	const exportPDF = () => (link ? window.open(link) : null);
	const randomBackground = useRef(backgroundMapping[randomInterger(1, 6)]);

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
		if (!accessToken) {
			setLoading(false);
			return setError({
				status: 403,
				message: 'Bạn không có quyền để xem CV này !!!',
			});
		}

		const role = localStorage.getItem('currentRole');
		const resumeID = searchParams.get('_resumeID');
		const vacancyID = searchParams.get('_vacancyID');
		const candidateID = searchParams.get('_candidateID');
		const interviewID = searchParams.get('_interviewID');

		switch (role) {
			case 'candidate':
				if (resumeID) {
					ref.current.api = candidateApi.getCvById;
					ref.current.payload = resumeID;
				}
				break;

			case 'admin':
				if (resumeID) {
					ref.current.api = adminApi.getCvById;
					ref.current.payload = resumeID;
				}
				break;

			case 'recruiter':
				if (candidateID && vacancyID) {
					ref.current.api = recruiterApi.getCvByCandidateAndVacancy;
					ref.current.payload = {
						candidateId: candidateID,
						vacancyId: vacancyID,
					};
				} else if (interviewID) {
					ref.current.api = recruiterApi.getCvByInterview;
					ref.current.payload = interviewID;
				}
				break;

			case 'interviewer':
				if (interviewID) {
					ref.current.api = interviewerApi.getCvByInterview;
					ref.current.payload = interviewID;
				}
				break;
			default:
				break;
		}

		if (!ref.current.api) {
			setLoading(false);
			return setError({
				status: 500,
				message: 'Bad Request !!!',
			});
		}

		ref.current
			.api(ref.current.payload)
			.then((data) => setLink(data.linkCv))
			.catch((err) => {
				const response = err.response;
				console.log(response);
				switch (response.status) {
					case 404:
						return setError({
							status: 404,
							message: 'Không tìm thấy CV !!!',
						});
					case 403:
						return setError({
							status: 403,
							message: 'Bạn không có quyền xem CV này !!!',
						});
					default:
						return setError({
							status: 500,
							message: response.data.message
								? response.data.message
								: 'Lỗi không xác định !!!',
						});
				}
			})
			.finally(() => setLoading(false));
	}, [searchParams]);

	return (
		<Layout className='ViewResume'>
			<Layout.Header className='header'>
				<Typography.Title>Xem CV</Typography.Title>
				<Button onClick={exportPDF}>Tải CV</Button>
			</Layout.Header>
			<Layout.Content>
				<div
					className='background'
					style={{ backgroundImage: `url(${randomBackground.current})` }}></div>
				<div className='resume'>
					<div className='resume-header'>
						<Typography.Title>Resume</Typography.Title>
					</div>
					<div className='content'>
						{(() => {
							if (loading) return <LoadingOutlined className='spin' />;

							if (link)
								return (
									<object
										data={link + '#toolbar=0&navpanes=0&scrollbar=0'}
										type='application/pdf'>
										CV PDF
									</object>
								);

							if (error.status)
								return (
									<Result
										className='result'
										status={`${error.status}`}
										title={`${error.status}`}
										subTitle={error.message}
									/>
								);
						})()}
					</div>
				</div>
			</Layout.Content>
		</Layout>
	);
};

export default ViewResume;
