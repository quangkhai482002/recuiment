import { useState, forwardRef, useImperativeHandle } from 'react';
import { HomeFilled, MailFilled, PhoneFilled } from '@ant-design/icons';
import { Col, Divider, Layout, Row, Space, Typography } from 'antd';
import { EditableInput, EditableTextarea } from './CustomComponent';
import Certificates from './Certificates';
import Experiences from './Experiences';
import { resumeData } from 'data';
import './Resume.scss';

const Resume = forwardRef(({ editable }, ref) => {
	const resumeDataTmp = JSON.parse(localStorage.getItem('resumeData'));
	const [data, setData] = useState(resumeDataTmp ? resumeDataTmp : resumeData);

	useImperativeHandle(ref, () => {
		return {
			resumeData: data,
		}
	}, [data])

	return (
		<Layout
			id='resume'
			className='Resume Resume-Hover'>
			<Row>
				<Col span={14}>
					<Space
						className='remove-gap'
						direction='vertical'>
						<EditableInput
							value={data.name}
							editable={editable}
							className='text-bold'
							onChange={(e) => setData({ ...data, name: e.target.value })}
						/>

						<EditableInput
							editable={editable}
							className='text-base'
							value={data.position}
							onChange={(e) => setData({ ...data, position: e.target.value })}
						/>
					</Space>
				</Col>

				<Col
					span={10}
					className='relative flex-col justify-between'>
					<div className='line'></div>

					<Space className='w-full w-children-full pl-10'>
						<PhoneFilled className='icon' />
						<EditableInput
							editable={editable}
							value={data.number}
							className='text-small'
							onChange={(e) => setData({ ...data, number: e.target.value })}
						/>
					</Space>

					<Space className='w-full w-children-full pl-10'>
						<MailFilled className='icon' />
						<EditableInput
							value={data.mail}
							editable={editable}
							className='text-small'
							onChange={(e) => setData({ ...data, mail: e.target.value })}
						/>
					</Space>

					<Space className='w-full w-children-full pl-10'>
						<HomeFilled className='icon' />
						<EditableInput
							editable={editable}
							value={data.address}
							className='text-small'
							onChange={(e) => setData({ ...data, address: e.target.value })}
						/>
					</Space>
				</Col>
			</Row>

			<Row id='experiences'>
				<Divider
					orientation='left'
					orientationMargin={0}
					className='text-bold text-12'>
					MỤC TIÊU NGHỀ NGHIỆP
				</Divider>
				<EditableTextarea
					editable={editable}
					value={data.target}
					className='text-small'
					onChange={(e) => setData({ ...data, target: e.target.value })}
				/>
			</Row>

			<Experiences
				data={data}
				setData={setData}
				editable={editable}
			/>

			<Row
				gutter={20}
				className='w-full mb-15'>
				<Col span={12}>
					<Divider
						orientation='left'
						orientationMargin={0}
						className='text-bold text-12'>
						CÁC KỸ NĂNG
					</Divider>

					<div className='flex-col px-10 mb-10 w-full'>
						<Typography.Text className='text-bold text-10'>
							Chuyên môn
						</Typography.Text>
						<EditableTextarea
							editable={editable}
							value={data.skill.main}
							onChange={(e) =>
								setData({
									...data,
									skill: { ...data.skill, main: e.target.value },
								})
							}
							className='text-small paragraph'
						/>
					</div>

					<div className='flex-col px-10 mb-10 w-full'>
						<Typography.Text className='text-bold text-10'>
							Khác
						</Typography.Text>
						<EditableTextarea
							editable={editable}
							value={data.skill.other}
							onChange={(e) =>
								setData({
									...data,
									skill: { ...data.skill, other: e.target.value },
								})
							}
							className='text-small paragraph'
						/>
					</div>
				</Col>

				<Certificates
					data={data}
					setData={setData}
					editable={editable}
				/>
			</Row>
		</Layout>
	);
});

export default Resume;
