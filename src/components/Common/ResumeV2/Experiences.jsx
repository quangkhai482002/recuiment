import { Typography, Col, Row,  Button, Popconfirm } from 'antd';
import { EditableInput, EditableTextarea } from './Custom';

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
			{data.experiences.map((exp, index) => (
				<Row
					key={`exp-${index}`}
					className='experience'>
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
								Xóa
							</Button>
						</Popconfirm>
					) : null}

					<Col span={8} className='remove-gap'  >
						<EditableTextarea
							value={exp.name}
							editable={editable}
							className='text-bold text-10 mr-10 w-full'
							onChange={(e) => changeExperiences(index, 'name', e)}
							styles={data.styles.header}
						/>

						<EditableInput
							value={exp.time}
							editable={editable}
							className='text-small w-full'
							onChange={(e) => changeExperiences(index, 'time', e)}
							styles={data.styles.text}
						/>

						<div
							className='remove-gap container-line'
							direction='vertical'>
							<div className='circle'></div>
							<div className='vertical-line-dash'></div>
						</div>
					</Col>

					<Col span={16}>
						<div className='flex-col gap-8'>
							<div className='flex-col remove-gap pl-20'>
								<Typography.Text className='text-bold text-10' style={data.styles.header}>
									Công việc
								</Typography.Text>
								<EditableTextarea
									editable={editable}
									value={exp.responsibility}
									className='text-small paragraph'
									onChange={(e) =>
										changeExperiences(index, 'responsibility', e)
									}
									styles={data.styles.paragraph}
								/>
							</div>

							<div className='flex-col w-full pl-20'>
								<Typography.Text className='text-bold text-10' style={data.styles.header}>
									Công nghệ
								</Typography.Text>

								<EditableTextarea
									editable={editable}
									value={exp.technologies}
									onChange={(e) => changeExperiences(index, 'technologies', e)}
									className='text-small paragraph'
									styles={data.styles.paragraph}
								/>
							</div>
						</div>
					</Col>
					
				</Row>
			))}
		</Row>
	);
};

export default Experiences;
