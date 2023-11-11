import { certificateDTO } from 'data';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Button, Popconfirm } from 'antd';
import { EditableInput } from './CustomComponent';

const Certificates = ({ editable, data, setData }) => {
	function changeCertificates(index, attribute, event) {
		const certificates = [...data.certificates];
		certificates[index][attribute] = event.target.value;
		setData({ ...data, certificates: certificates });
	}

	function visibleDeleteButton(index, visibility) {
		let button = document.getElementById(`cer_delete_button_${index}`);
		button.style.visibility = visibility;
	}

	function deleteCertificate(index) {
		const certificates = [...data.certificates];
		certificates.splice(index, 1);
		setData({ ...data, certificates: certificates });
	}

	return (
		<Col
			span={12}
			className='certificates'>
			<Divider
				orientation='left'
				orientationMargin={0}
				className='text-bold text-12'>
				CHỨNG CHỈ
			</Divider>

			{data.certificates.map((certificate, index) => (
				<div
					key={index}
					className='w-full px-10 mb-10 relative certificate'>
					{editable ? (
						<Popconfirm
							okText='Có'
							cancelText='Không'
							className='absolute'
							title='Xóa chứng chỉ?'
							description='Bạn có chắc chắn muốn xóa mục này?'
							onConfirm={() => deleteCertificate(index)}
							onOpenChange={(open, e) =>
								open
									? visibleDeleteButton(index, 'visible')
									: visibleDeleteButton(index, 'hidden')
							}>
							<Button
								danger
								type='primary'
								id={`cer_delete_button_${index}`}
								className='delete-button text-10 text-bold px-10'
								onClick={() => visibleDeleteButton(index, 'visible')}>
								Delete
							</Button>
						</Popconfirm>
					) : (
						<></>
					)}
					<div className='flex-col px-10 mb-10 w-full'>
						<EditableInput
							editable={editable}
							value={certificate.time}
							className='text-bold text-10'
							onChange={(e) => changeCertificates(index, 'time', e)}
						/>

						<EditableInput
							editable={editable}
							className='text-small'
							value={certificate.name}
							onChange={(e) => changeCertificates(index, 'name', e)}
						/>
					</div>
				</div>
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
							certificates: [...data.certificates, certificateDTO],
						})
					}>
					Thêm chứng chỉ
				</Button>
			) : (
				<></>
			)}
		</Col>
	);
};

export default Certificates;
