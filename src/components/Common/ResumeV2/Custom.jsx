import {
	DeleteOutlined,
	EditOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import {
	Input,
	Typography,
	Modal,
	Form,
	Button,
	InputNumber,
	Select,
	message,
	Divider,
	Col,
	Card,
	Dropdown,
	List,
	Space,
} from 'antd';
import { useLayoutEffect, useState } from 'react';
import { resumeData } from 'data';

export const EditableInput = ({
	editable,
	value,
	onChange,
	className,
	styles,
}) => {
	return editable ? (
		<Input
			value={value}
			spellCheck={false}
			onChange={onChange}
			className={className}
			style={styles}
		/>
	) : (
		<Typography.Text
			className={className}
			style={styles}>
			{value}
		</Typography.Text>
	);
};

export const EditableTextarea = ({
	editable,
	value,
	onChange,
	className,
	styles,
}) => {
	return editable ? (
		<Input.TextArea
			autoSize
			value={value}
			spellCheck={false}
			onChange={onChange}
			className={className}
			style={styles}
		/>
	) : (
		<Typography.Paragraph
			className={className}
			style={styles}>
			{value}
		</Typography.Paragraph>
	);
};

const formLayout = {
	labelCol: { span: 7 },
	wrapperCol: { span: 17 },
};

export const CustomDivider = ({ styles, content }) => {
	const localStyles = {
		fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
		marginTop: styles.marginTop ? `${styles.marginTop}px` : undefined,
		marginBottom: styles.marginBottom ? `${styles.marginBottom}px` : undefined,
	};

	return (
		<Divider
			orientation='left'
			orientationMargin={0}
			className='text-bold text-12'
			style={{ ...localStyles }}>
			{content}
		</Divider>
	);
};

export const AddRowModal = ({ open, closeModal, setData }) => {
	const [form] = Form.useForm();
	const [cols, setCols] = useState([]);

	// {cols: 2, col-0: 11, col-1: 11}
	const onFinish = (data) => {
		var sum = 0;
		const result = [];
		for (var i = 0; i < data.cols; i++) {
			const span = data[`col-${i}`];
			sum += span;
			result.push({ span: span, header: 'TEST', sections: [] });
		}

		if (sum !== 24) message.error('Tổng chiều dài của tất cả các cột phải bằng 24');
		else {
			closeModal();
			setData((prevData) => {
				return {
					...prevData,
					rows: [...prevData.rows, { cols: result }],
				};
			});
		}
	};

	return (
		<Modal
			footer={null}
			open={open}
			title='Thêm hàng'
			className='ResumeModal'
			onCancel={() => closeModal()}>
			<Form
				{...formLayout}
				form={form}
				onFinish={onFinish}
				autoComplete='off'>
				<Form.Item
					label='Số cột: '
					name='cols'
					rules={[{ required: true }]}>
					<Select
						onChange={(value) => setCols([...Array(value).keys()])}
						options={[1, 2, 3, 4].map((cols) =>
							Object.create({ value: cols, label: cols })
						)}
					/>
				</Form.Item>

				{cols.map((col, index) => (
					<Form.Item
						key={index}
						label={`Chiều dài cột ${col + 1}`}
						name={`col-${col}`}
						rules={[{ required: true, type: 'number', min: 1, max: 24 }]}>
						<InputNumber className='w-full' />
					</Form.Item>
				))}

				<Form.Item wrapperCol={{ span: 4, offset: 20 }}>
					<Button
						block
						type='primary'
						htmlType='submit'
						className='button'>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

const items = [
	{
		key: 1,
		icon: <EditOutlined />,
		label: 'Sửa Header',
	},
	{
		key: 2,
		icon: <PlusCircleOutlined />,
		label: 'Thêm mục',
	},
	{
		key: 3,
		danger: true,
		icon: <DeleteOutlined />,
		label: 'Xóa dòng',
	},
];

const sectionItems = [
	{
		title: 'Tiêu đề và nội dung',

		description: 'Bao gồm 1 dòng tiêu đề và 1 dòng nội dung',
	},
	{
		title: 'Nội dung',

		description: 'Bao gồm 1 dòng nội dung',
	},
	{
		title: 'Tiêu đề và đoạn văn',
		description: 'Bao gồm 1 dòng tiêu đề và 1 đoạn văn (có thể xuống dòng)',
	},
	{
		title: 'Đoạn văn',
		description: 'Bao gồm 1 đoạn văn (có thể xuống dòng)',
	},
];
export const CustomCol = ({
	span,
	header,
	sections,
	setData,
	rowIndex,
	colIndex,
	editable,
	data,
}) => {
	const [form] = Form.useForm();
	const [openHeaderModal, setOpenHeaderModal] = useState(false);
	const [openSectionModal, setOpenSectionModal] = useState(false);

	const editHeader = (data) => {
		setOpenHeaderModal(false);
		setData((prevData) => {
			const rows = [...prevData.rows];
			rows[rowIndex].cols[colIndex].header = data.header;
			return { ...prevData, rows: rows };
		});
	};

	const deleteRow = () => {
		setData((prevData) => {
			const rows = [...prevData.rows];
			rows.splice(rowIndex, 1);
			return { ...prevData, rows: rows };
		});
	};

	const handleMenuClick = (e) => {
		if (e.key === '1') setOpenHeaderModal(true);
		if (e.key === '2') setOpenSectionModal(true);
		if (e.key === '3') deleteRow();
	};

	const addSection = (sectionIndex) => {
		setOpenSectionModal(false);
		setData((prevData) => {
			const currentCol = prevData.rows[rowIndex].cols[colIndex];
			const title = sectionIndex === 0 || sectionIndex === 2 ? 'Title' : null;
			currentCol.sections.push({
				type: sectionIndex,
				title: title,
				content: 'Content',
			});
			return { ...prevData };
		});
	};

	//Hide menu when Modal is opening
	useLayoutEffect(() => {
		const menus = document.getElementsByClassName('ant-dropdown-menu');
		if (openHeaderModal || openSectionModal)
			for (var i = 0; i < menus.length; i++)
				menus[i].style.visibility = 'hidden';

		return () => {
			for (var i = 0; i < menus.length; i++)
				menus[i].style.visibility = 'visible';
		};
	}, [openHeaderModal, openSectionModal]);

	return !span ? (
		<></>
	) : (
		<Dropdown
			className='customcol-menu'
			placement='top'
			menu={{ items, onClick: handleMenuClick }}>
			<Col
				span={span}
				className='CustomCol'>
				{header ? (
					<CustomDivider
						styles={data.styles.divider}
						content={header}
					/>
				) : null}

				<Modal
					footer={null}
					className='ResumeModal'
					open={openHeaderModal}
					title='Sửa Header'
					onCancel={() => setOpenHeaderModal(false)}>
					<Form
						{...formLayout}
						form={form}
						onFinish={editHeader}
						autoComplete='off'>
						<Form.Item
							label='Nội dung: '
							name='header'
							rules={[{ required: true }]}>
							<Input />
						</Form.Item>

						<Form.Item wrapperCol={{ span: 4, offset: 20 }}>
							<Button
								block
								type='primary'
								htmlType='submit'
								className='button'>
								Thay đổi
							</Button>
						</Form.Item>
					</Form>
				</Modal>

				<Modal
					width={800}
					title='Thêm mục'
					footer={null}
					open={openSectionModal}
					className='ResumeModal'
					onOk={() => setOpenSectionModal(false)}
					onCancel={() => setOpenSectionModal(false)}>
					<List
						className='list-card'
						dataSource={sectionItems}
						grid={{ gutter: 16 }}
						renderItem={(item, index) => (
							<List.Item>
								<Card
									className='section-card'
									actions={[
										<PlusCircleOutlined
											key='add'
											onClick={() => addSection(index)}
											style={{ fontSize: '16px', color: 'green' }}
										/>,
									]}>
									<Card.Meta
										title={item.title}
										description={item.description}
									/>
								</Card>
							</List.Item>
						)}></List>
				</Modal>
				{sections.map((section, index) => (
					<CustomSection
						key={`section-${index}`}
						section={section}
						sectionIndex={index}
						setData={setData}
						rowIndex={rowIndex}
						colIndex={colIndex}
						editable={editable}
						styles={data.styles}
					/>
				))}
			</Col>
		</Dropdown>
	);
};

function getCSS(style) {
	return {
		fontSize: `${style.fontSize}px`,
		fontWeight: `${style.fontWeight}`,
		marginTop: `${style.marginTop}px`,
		marginBottom: `${style.marginBottom}px`,
		marginLeft: `${style.marginLeft}px`,
		marginRight: `${style.marginRight}px`,
	};
}

export const CustomSection = ({
	sectionIndex,
	section,
	setData,
	rowIndex,
	colIndex,
	editable,
	styles,
}) => {
	const { type, title, content } = section;
	const stopPropagation = (e) => e.stopPropagation();

	const headerStyle = getCSS(styles.header);
	const paragraphStyle = getCSS(styles.paragraph);
	const textStyle = getCSS(styles.text);

	const deleteSection = () => {
		setData((prevData) => {
			prevData.rows[rowIndex].cols[colIndex].sections.splice(sectionIndex, 1);
			return { ...prevData };
		});
	};

	const onTitleChange = (e) => {
		setData((prevData) => {
			prevData.rows[rowIndex].cols[colIndex].sections[sectionIndex].title =
				e.target.value;
			return { ...prevData };
		});
	};

	const onContentChange = (e) => {
		setData((prevData) => {
			prevData.rows[rowIndex].cols[colIndex].sections[sectionIndex].content =
				e.target.value;
			return { ...prevData };
		});
	};

	return (
		<div
			className='flex-col px-10 mb-10 w-full CustomSection'
			onClick={stopPropagation}>
			{(() => {
				switch (type) {
					case 0:
						return (
							<>
								<EditableInput
									editable={editable}
									value={title}
									onChange={onTitleChange}
									className='text-bold text-10'
									styles={headerStyle}
								/>
								<EditableInput
									editable={editable}
									className='text-small'
									onChange={onContentChange}
									value={content}
									styles={textStyle}
								/>
							</>
						);
					case 1:
						return (
							<EditableInput
								editable={editable}
								className='text-small'
								value={content}
								onChange={onContentChange}
								styles={textStyle}
							/>
						);
					case 2:
						return (
							<>
								<EditableInput
									editable={editable}
									value={title}
									onChange={onTitleChange}
									className='text-bold text-10'
									styles={headerStyle}
								/>

								<EditableTextarea
									editable={editable}
									value={content}
									className='text-small paragraph'
									onChange={onContentChange}
									styles={paragraphStyle}
								/>
							</>
						);
					case 3:
						return (
							<EditableTextarea
								editable={editable}
								value={content}
								className='text-small paragraph'
								onChange={onContentChange}
								styles={paragraphStyle}
							/>
						);
					default:
						return <></>;
				}
			})()}

			<Button
				danger
				type='primary'
				onClick={deleteSection}
				className='delete-button text-10 text-bold px-10'>
				Xóa
			</Button>
		</div>
	);
};

export const EditDividerModal = ({
	initialData,
	open,
	closeModal,
	setData,
}) => {
	const [form] = Form.useForm();

	const onFinish = (data) => {
		closeModal();
		setData((prev) => {
			return { ...prev, styles: { ...prev.styles, divider: data } };
		});
	};

	const reset = () => {
		form.setFieldsValue(resumeData.styles.divider);
	};

	return (
		<Modal
			footer={null}
			open={open}
			title='Edit Divider'
			onCancel={closeModal}
			className='ResumeModal'>
			<Form
				{...formLayout}
				form={form}
				autoComplete='off'
				onFinish={onFinish}
				initialValues={initialData}>
				<Form.Item
					label='Kích thước chữ: '
					name='fontSize'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề trên: '
					name='marginTop'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề dưới: '
					name='marginBottom'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label=''
					wrapperCol={24}>
					<div className='w-full flex justify-end'>
						<Space>
							<Button
								className='button'
								onClick={reset}>
								Trờ lại mặc định
							</Button>
							<Button
								type='primary'
								htmlType='submit'
								className='button'>
								Thay đổi
							</Button>
						</Space>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export const EditHeaderModal = ({ open, closeModal, setData, initialData }) => {
	const [form] = Form.useForm();

	const onFinish = (data) => {
		closeModal();
		setData((prev) => {
			const styles = prev.styles;
			styles.header = data;
			return { ...prev, styles: styles };
		});
	};

	const reset = () => {
		form.setFieldsValue(resumeData.styles.header);
	};

	return (
		<Modal
			footer={null}
			open={open}
			title='Edit Header'
			onCancel={closeModal}
			className='ResumeModal'>
			<Form
				{...formLayout}
				form={form}
				autoComplete='off'
				onFinish={onFinish}
				initialValues={initialData}>
				<Form.Item
					label='Kích thước chữ: '
					name='fontSize'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Kích cỡ chữ:'
					name='fontWeight'
					rules={[{ required: true, type: 'number' }]}>
					<Select
						options={[400, 500, 600, 700].map((cols) =>
							Object.create({ value: cols, label: cols })
						)}
					/>
				</Form.Item>

				<Form.Item
					label='Lề trên:'
					name='marginTop'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề dưới:'
					name='marginBottom'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề trái:'
					name='marginLeft'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề phải:'
					name='marginRight'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label=''
					wrapperCol={24}>
					<div className='w-full flex justify-end'>
						<Space>
							<Button
								className='button'
								onClick={reset}>
								Trờ lại mặc định
							</Button>
							<Button
								type='primary'
								htmlType='submit'
								className='button'>
								Thay đổi
							</Button>
						</Space>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export const EditParagraphModal = ({
	open,
	closeModal,
	setData,
	initialData,
}) => {
	const [form] = Form.useForm();

	const onFinish = (data) => {
		closeModal();
		setData((prev) => {
			const styles = prev.styles;
			styles.paragraph = data;
			return { ...prev, styles: styles };
		});
	};

	const reset = () => {
		form.setFieldsValue(resumeData.styles.paragraph);
	};

	return (
		<Modal
			footer={null}
			open={open}
			title='Edit Paragraph'
			onCancel={closeModal}
			className='ResumeModal'>
			<Form
				{...formLayout}
				form={form}
				autoComplete='off'
				onFinish={onFinish}
				initialValues={initialData}>
				<Form.Item
					label='Kích thước chữ: '
					name='fontSize'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Kích cỡ chữ:'
					name='fontWeight'
					rules={[{ required: true, type: 'number' }]}>
					<Select
						options={[400, 500, 600, 700].map((cols) =>
							Object.create({ value: cols, label: cols })
						)}
					/>
				</Form.Item>

				<Form.Item
					label='Lề trên:'
					name='marginTop'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề dưới:'
					name='marginBottom'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề trái:'
					name='marginLeft'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề phải:'
					name='marginRight'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label=''
					wrapperCol={24}>
					<div className='w-full flex justify-end'>
						<Space>
							<Button
								className='button'
								onClick={reset}>
								Trờ lại mặc định
							</Button>
							<Button
								type='primary'
								htmlType='submit'
								className='button'>
								Thay đổi
							</Button>
						</Space>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export const EditTextModal = ({ open, closeModal, setData, initialData }) => {
	const [form] = Form.useForm();

	const onFinish = (data) => {
		closeModal();
		setData((prev) => {
			const styles = prev.styles;
			styles.text = data;
			return { ...prev, styles: styles };
		});
	};

	const reset = () => {
		form.setFieldsValue(resumeData.styles.text);
	};

	return (
		<Modal
			footer={null}
			open={open}
			title='Edit Text'
			onCancel={closeModal}
			className='ResumeModal'>
			<Form
				{...formLayout}
				form={form}
				autoComplete='off'
				onFinish={onFinish}
				initialValues={initialData}>
				<Form.Item
					label='Kích thước chữ: '
					name='fontSize'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Kích cỡ chữ:'
					name='fontWeight'
					rules={[{ required: true, type: 'number' }]}>
					<Select
						options={[400, 500, 600, 700].map((cols) =>
							Object.create({ value: cols, label: cols })
						)}
					/>
				</Form.Item>

				<Form.Item
					label='Lề trên:'
					name='marginTop'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề dưới:'
					name='marginBottom'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề trái:'
					name='marginLeft'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Lề phải:'
					name='marginRight'
					rules={[{ required: true, type: 'number' }]}>
					<InputNumber style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label=''
					wrapperCol={24}>
					<div className='w-full flex justify-end'>
						<Space>
							<Button
								className='button'
								onClick={reset}>
								Trờ lại mặc định
							</Button>
							<Button
								type='primary'
								htmlType='submit'
								className='button'>
								Thay đổi
							</Button>
						</Space>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export const LogggedError = (onOK) =>
	Modal.error({
		centered: true,
		title: 'Chưa đăng nhập?',
		content: 'Bạn cần phải đăng nhập để lưu CV !!!',
		onOk: onOK,
	});
