import { experienceDTO } from 'data';
import { Typography, Col, Row, Divider, Space, Button, Popconfirm } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { EditableInput, EditableTextarea } from './CustomComponent';

const Experiences = ({ editable, data, setData }) => {
	function changeExperiences(index, attribute, event) {
		const experiences = [...data.experiences];
		experiences[index][attribute] = event.target.value;
		setData({ ...data, experiences: experiences });
	}

	function deleteExperience(index) {
		const experiences = [...data.experiences];
		experiences.splice(index, 1);
		setData({ ...data, experiences: experiences });
	}

	function visibleDeleteButton(index, visibility) {
		let button = document.getElementById(`exp_delete_button_${index}`);
		button.style.visibility = visibility;
	}

	return (
		<Row className='experiences'>
			<Divider
				orientation='left'
				orientationMargin={0}
				className='text-bold text-12'>
				KINH NGHIỆM
			</Divider>

			{data.experiences.map((exp, index) => (
				<Row key={index} className='experience'>
					{editable ? (
						<Popconfirm
							okText='Có'
							cancelText='Không'
							title='Xóa kinh nghiệm?'
							description='Bạn có chắc chắn muốn xóa mục này?'
							onConfirm={() => deleteExperience(index)}
							onOpenChange={(open, e) =>
								open
									? visibleDeleteButton(index, 'visible')
									: visibleDeleteButton(index, 'hidden')
							}>
							<Button
								danger
								type='primary'
								id={`exp_delete_button_${index}`}
								className='delete-button text-10 text-bold px-10'
								onClick={() => visibleDeleteButton(index, 'visible')}>
								Delete
							</Button>
						</Popconfirm>
					) : (
						<></>
					)}

					<Col span={8}>
						<EditableTextarea
							value={exp.name}
							editable={editable}
							className='text-bold text-10 mr-10 w-full inline-block'
							onChange={(e) => changeExperiences(index, 'name', e)}
						/>

						<EditableInput
							value={exp.time}
							editable={editable}
							className='text-small pt-10 w-full inline-block'
							onChange={(e) => changeExperiences(index, 'time', e)}
						/>

						<Space
							className='remove-gap container-line'
							direction='vertical'>
							<div className='circle'></div>
							<div className='vertical-line-dash'></div>
						</Space>
					</Col>

					<Col span={16}>
						<Space direction='vertical w-full'>
							<div className='flex-col remove-gap pl-20'>
								<Typography.Text className='text-bold text-10'>
									CÔNG VIỆC
								</Typography.Text>
								<EditableTextarea
									editable={editable}
									value={exp.responsibility}
									className='text-small paragraph'
									onChange={(e) =>
										changeExperiences(index, 'responsibility', e)
									}
								/>
							</div>

							<div className='flex-col w-full pl-20'>
								<Typography.Text className='text-bold text-10'>
									CÔNG NGHỆ
								</Typography.Text>

								<EditableTextarea
									editable={editable}
									value={exp.technologies}
									onChange={(e) => changeExperiences(index, 'technologies', e)}
									className='text-small paragraph'
								/>
							</div>
						</Space>
					</Col>
				</Row>
			))}

			{editable ? (
				<Button
					className='add-button text-12'
					block
					type='dashed'
					icon={<PlusCircleOutlined />}
					onClick={() =>
						setData({
							...data,
							experiences: [...data.experiences, experienceDTO],
						})
					}>
					Thêm kinh nghiệm
				</Button>
			) : (
				<></>
			)}
		</Row>
	);
};

export default Experiences;
