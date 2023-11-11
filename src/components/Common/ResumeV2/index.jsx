import './Resume.scss';
import { experienceDTO } from 'data';
import { toPDF } from 'utils';
import { resumeData } from 'data';
import Experiences from './Experiences';
import { useSelector, useDispatch } from 'react-redux';
import { candidateActions } from 'features/candidate/candidateSlice';
import { useState, useEffect, useRef } from 'react';
import {
	HomeFilled,
	MailFilled,
	PhoneFilled,
	PlusCircleOutlined,
	FilePdfOutlined,
	CloudUploadOutlined,
	FontColorsOutlined,
	ArrowLeftOutlined,
	RedoOutlined,
	NodeIndexOutlined,
} from '@ant-design/icons';
import {
	Col,
	Layout,
	Row,
	Space,
	Input,
	Divider,
	Menu,
	message,
	Popconfirm,
} from 'antd';
import {
	EditableInput,
	EditableTextarea,
	AddRowModal,
	CustomDivider,
	CustomCol,
	LogggedError,
	EditDividerModal,
	EditHeaderModal,
	EditParagraphModal,
	EditTextModal,
} from './Custom';
import { useNavigate } from 'react-router-dom';
import { userSelector } from 'features/candidate/candidateSelector';

function dicideWhichData(resume) {
	const editResumeTmp = localStorage.getItem('editResumeTmp');
	const createResumeTmp = localStorage.getItem('createResumeTmp');
	const editResumeTmpJson = JSON.parse(editResumeTmp);
	const createResumeTmpJson = JSON.parse(createResumeTmp);
	if (!resume) return createResumeTmpJson ? createResumeTmpJson : resumeData;

	const editResumeData = JSON.parse(resume.data);
	if (!editResumeTmpJson) return editResumeData;

	return editResumeTmpJson.id === resume.id
		? editResumeTmpJson.data
		: editResumeData;
}

function createFormData(pdf, name, data) {
	const blob = pdf.output('blob');
	const file = new File([blob], name, { type: 'application/pdf' });
	const formData = new FormData();
	formData.append('file', file);
	formData.append('data', JSON.stringify(data));
	return formData;
}

const Resume = ({ loading, resume }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const resumeNameRef = useRef();
	const user = useSelector(userSelector);
	const [messageApi, contextHolder] = message.useMessage();

	const [editable, setEditable] = useState(true);
	const [missingName, setMissingName] = useState(false);
	const [action, setAction] = useState({ TYPE: '', PAYLOAD: '' });

	const dataState = dicideWhichData(resume);
	const [data, setData] = useState(dataState);

	const [openModal, setOpenModal] = useState({
		addRow: false,
		editDivider: false,
		editHeader: false,
		editParagrapth: false,
		editText: false,
	});

	useEffect(() => {
		async function handle() {
			const resumeHTML = document.getElementById('resume');
			const name = resumeNameRef.current.input.value;
			const pdf = await toPDF(resumeHTML);
			let formData = null;

			switch (action.TYPE) {
				case 'DOWNLOAD':
					pdf.save(`${name}.pdf`);
					break;

				// Because user will have permission to use CreateResume without log in
				// So we must guarantee user authentication before saving resume (create a new one)
				case 'CREATE':
					if (!user) {
						return LogggedError(() => {
							data.fileName = name;
							localStorage.setItem('createResumeTmp', JSON.stringify(data));
							navigate('/login', {
								state: {
									urlToLoad: window.location.href,
								},
							});
						});
					}
					formData = createFormData(pdf, name, data);
					dispatch(candidateActions.createResumeRequest(formData));
					localStorage.removeItem('createResumeTmp');
					break;

				// In this case, no need to check user authentication cause we have made it before (in CandidateEditResu)
				case 'UPDATE':
					if (!user) {
						return LogggedError(() => {
							localStorage.setItem(
								'editResumeTmp',
								JSON.stringify({ ...resume, fileName: name, data: data })
							);
							navigate('/login', {
								state: {
									urlToLoad: window.location.href,
								},
							});
						});
					}
					formData = createFormData(pdf, name, data);
					formData.append('cvId', resume.id);
					dispatch(candidateActions.updateResumeRequest(formData));
					localStorage.removeItem('editResumeTmp');
					break;

				default:
					break;
			}

			setEditable(true);
			setAction({ TYPE: '', PAYLOAD: '' });
		}

		if (action.TYPE) handle();
	}, [action, user, dispatch, navigate, data, resume]);

	const downloadPDF = () => {
		setEditable(false);
		setAction({ TYPE: 'DOWNLOAD', PAYLOAD: '' });
	};

	const savePDF = (type) => {
		const name = resumeNameRef.current.input.value;
		if (!name) {
			setMissingName(true);
			messageApi.open({ type: 'error', content: 'Thiếu tên CV !!!' });
		} else {
			setEditable(false);
			setMissingName(false);
			setAction({ TYPE: type, PAYLOAD: '' });
		}
	};

	return (
		<Layout
			hasSider
			className='ResumeContainer'>
			{contextHolder}
			<AddRowModal
				setData={setData}
				open={openModal.addRow}
				closeModal={() => setOpenModal({ ...openModal, addRow: false })}
			/>

			<EditDividerModal
				setData={setData}
				open={openModal.editDivider}
				initialData={data.styles.divider}
				closeModal={() => setOpenModal({ ...openModal, editDivider: false })}
			/>

			<EditHeaderModal
				setData={setData}
				open={openModal.editHeader}
				initialData={data.styles.header}
				closeModal={() => setOpenModal({ ...openModal, editHeader: false })}
			/>

			<EditParagraphModal
				setData={setData}
				open={openModal.editParagrapth}
				initialData={data.styles.paragraph}
				closeModal={() => setOpenModal({ ...openModal, editParagrapth: false })}
			/>

			<EditTextModal
				setData={setData}
				open={openModal.editText}
				initialData={data.styles.text}
				closeModal={() => setOpenModal({ ...openModal, editText: false })}
			/>

			<Layout.Sider className='sider'>
				<Input
					status={missingName ? 'error' : null}
					placeholder='Tên CV'
					ref={resumeNameRef}
					defaultValue={
						resume ? resume.fileName : data.fileName ? data.fileName : ''
					}
				/>
				<Divider />
				<Menu
					selectable={false}
					mode='vertical'
					disabled={loading}>
					<Menu.Item
						key='menu-1'
						onClick={() =>
							setData({
								...data,
								experiences: [...data.experiences, experienceDTO],
							})
						}>
						<NodeIndexOutlined />
						<span>Thêm kinh nghiệm</span>
					</Menu.Item>

					<Menu.Item
						key='menu-2'
						onClick={() => setOpenModal({ ...openModal, addRow: true })}>
						<PlusCircleOutlined />
						<span>Thêm hàng</span>
					</Menu.Item>

					<Menu.SubMenu
						key='submenu-1'
						title='Thiết kế'
						icon={<FontColorsOutlined />}>
						<Menu.Item
							key='submenu-2'
							onClick={() => setOpenModal({ ...openModal, editDivider: true })}>
							<span>Divider</span>
						</Menu.Item>

						<Menu.Item
							key='submenu-3'
							onClick={() => setOpenModal({ ...openModal, editHeader: true })}>
							<span>Header</span>
						</Menu.Item>

						<Menu.Item
							key='submenu-4'
							onClick={() =>
								setOpenModal({ ...openModal, editParagrapth: true })
							}>
							<span>Paragraph</span>
						</Menu.Item>

						<Menu.Item
							key='submenu-5'
							onClick={() => setOpenModal({ ...openModal, editText: true })}>
							<span>Text</span>
						</Menu.Item>
					</Menu.SubMenu>

					<Menu.Item
						key='menu-3'
						onClick={downloadPDF}>
						<FilePdfOutlined />
						<span>Tải CV</span>
					</Menu.Item>

					<Popconfirm
						key='confirm-1'
						placement='right'
						title='Bạn có chắc chắn muốn lưu CV ?'
						description='Sau khi lưu sẽ trở lại trang quản lý CV'
						onConfirm={() => (resume ? savePDF('UPDATE') : savePDF('CREATE'))}>
						<Menu.Item key='menu-4'>
							<CloudUploadOutlined />
							<span>Lưu CV</span>
						</Menu.Item>
					</Popconfirm>

					<Popconfirm
						placement='right'
						key='confirm-2'
						title='Bạn có chắc chắn muốn Reset ?'
						description='Điều này sẽ khởi tạo CV về trạng thái ban đầu'
						onConfirm={() => setData(dataState)}>
						<Menu.Item key='menu-5'>
							<RedoOutlined />
							<span>Reset</span>
						</Menu.Item>
					</Popconfirm>

					<Menu.Item
						key='menu-6'
						onClick={() => {
							localStorage.removeItem('editResumeTmp');
							localStorage.removeItem('createResumeTmpTmp');
							navigate('/manage-resumes');
						}}>
						<ArrowLeftOutlined />
						<span>Quay lại</span>
					</Menu.Item>
				</Menu>
			</Layout.Sider>
			<div className='w-full h-full'>
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
									onChange={(e) =>
										setData({ ...data, position: e.target.value })
									}
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
									onChange={(e) =>
										setData({ ...data, address: e.target.value })
									}
								/>
							</Space>
						</Col>
					</Row>

					<Row id='experiences'>
						<CustomDivider
							styles={data.styles.divider}
							content='MỤC TIÊU NGHÊ NGHIỆP'
						/>
						<EditableTextarea
							editable={editable}
							value={data.target}
							className='text-small'
							onChange={(e) => setData({ ...data, target: e.target.value })}
						/>
					</Row>

					<CustomDivider
						styles={data.styles.divider}
						content='KINH NGHIỆM'
					/>

					<Experiences
						data={data}
						setData={setData}
						editable={editable}
					/>

					{data.rows.map((row, rowIndex) => (
						<Row
							key={`row-${rowIndex}`}
							gutter={20}>
							{row.cols.map((col, colIndex) => (
								<CustomCol
									key={`col-${colIndex}`}
									setData={setData}
									colIndex={colIndex}
									rowIndex={rowIndex}
									span={col.span}
									header={col.header}
									sections={col.sections}
									editable={editable}
									data={data}
								/>
							))}
						</Row>
					))}
				</Layout>
			</div>
		</Layout>
	);
};

export default Resume;
