import {
	CheckCircleTwoTone,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
	Button,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
	Skeleton,
} from "antd";
import recruiterApi from "api/recruiterApi";
import dayjs from "dayjs";
import { authSelectors } from "features/auth/authSlice";
import { publicSelectors } from "features/public/publicSlice";
import { recruiterActions } from "features/recruiter/recruiterSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./RecruiterUpdatePositon.scss";

const { TextArea } = Input;
const dateFormat = "DD/MM/YYYY";

const onFinishFailed = (errorInfo) => {
	console.log("Failed:", errorInfo);
};

const handleChange = (value) => {
	console.log(`selected ${value}`);
};

export default function RecruiterUpdatePosition() {
	const [data, setData] = useState();
	const { currentUser } = useSelector(authSelectors);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { skills } = useSelector(publicSelectors);
	const { positions } = useSelector(publicSelectors);
	const { levels } = useSelector(publicSelectors);

	const { positionId } = useParams();

	const fetchData = useCallback(async () => {
		try {
			const resData = await recruiterApi.getPositionById(positionId);
			setData(resData);
		} catch (error) {
			console.log(error);
		}
	}, [positionId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const confirm = () => {
		Modal.confirm({
			title: "Cancel",
			icon: <ExclamationCircleOutlined />,
			content: "Cancel the Update position info process?",
			okText: "Yes",
			cancelText: "No",
			onOk: () => navigate("/recruiter"),
		});
	};
	const validateParagraph = (_, value) => {
		const lines = value.split('\n');
		if (lines.length >= 4) {
			return Promise.resolve();
		}
		return Promise.reject('The paragraph must be at least 4 lines.');
	};
	const getstartstring = (start)=>{
		var mm= start.getMonth()+1;
		var dd= start.getDate();
		return [start.getFullYear(),'-',(mm>9 ? '' : '0') + mm,'-',(dd>9 ? '' : '0') + dd].join('');
	};
	const onSubmit = async (values) => {
		let newposition = undefined;
		let newskill = undefined;
		let newlevel = undefined;
		let newstart = String(getstartstring(values.startDate.$d));
		let newend = String(getstartstring(values.endDate.$d));
		if (values.position.value) {
			newposition = values.position.value;
		} else {
			newposition = values.position;
		};
		if (values.skill[0].value) {
			newskill = values.skill.map((item) => {
				return {
					id: item.value
				};
			});
		} else {
			newskill = values.skill.map((item) => {
				return {
					id: item
				};
			});
		};
		if (values.level[0].value) {
			newlevel = values.level.map((item) => {
				return {
					id: item.value
				};
			});
		} else {
			newlevel = values.level.map((item) => {
				return {
					id: item
				};
			});
		};
		const newValues = {
			...values,
			id: values.id,
			benefit: values.benefit,
			description: values.description,
			startDate: newstart,
			endDate: newend,
			referenceInformation: values.referenceInformation,
			requirements: values.requirements,
			salary: values.salary,
			status: values.status,
			totalNeeded: values.totalNeeded,
			remainingNeeded: values.remainingNeeded,
			workingLocation: values.workingLocation,
			recruiter: currentUser,
			position: {
				id: newposition
			},
			skill: newskill.map((item) => {
				return {
					id: item.id
				};
			}),
			level: newlevel.map((item) => {
				return {
					id: item.id
				};
			}),
		};
		//check Date logic
		if (newValues.startDate >= newValues.endDate) {
			Modal.confirm({
				title: "Failed",
				content: "The Start Date need to be smaller than the End Date! ",
				onOk() { },
				cancelButtonProps: {
					style: {
						display: "none",
					},
				},
			});
		} else {
			if (newValues.remainingNeeded > newValues.totalNeeded) {
				Modal.confirm({
					title: "Failed",
					content: "The RemainingNeeded can't be larger than the TotalNeeded! ",
					onOk() { },
					cancelButtonProps: {
						style: {
							display: "none",
						},
					},
				});
			} else {
				const button = document.getElementById('btn-save');
				try {
					button.disabled = true;
					await recruiterApi.updatePosition(newValues);
					dispatch(recruiterActions.getPositions({ page: 1, limit: 200 }));
					setTimeout(() => {
						navigate(`/recruiter`);
					}, 2000);
					Modal.confirm({
						title: "Success",
						icon: <CheckCircleTwoTone />,
						content: "Update positon infomation successfull! ",
						onOk() { },
						cancelButtonProps: {
							style: {
								display: "none",
							},
						},
					});
				} catch (error) {
					button.disabled = false;
					console.log("add failed");
					Modal.confirm({
						title: "Failed",
						content: "Failed to Update position information!",
						onOk() { },
						cancelButtonProps: {
							style: {
								display: "none",
							},
						},
					});
				}
			}
		}
	};

	return !data ? (
		<Skeleton active style={{ margin: "2rem" }} />
	) : (
		<div className="RecruiterUpdatePosition internal-container">
			{skills && positions && levels && (
				<div className="container">
					<h2>Update Position Information</h2>
					<Form
						name="basic"
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						onFinish={onSubmit}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						initialValues={{
							id: data.id,
							benefit: data.benefit,
							description: data.description,
							startDate: dayjs(data.startDate, "YYYY-MM-DD"),
							endDate: dayjs(data.endDate, "YYYY-MM-DD"),
							referenceInformation: data.referenceInformation,
							requirements: data.requirements,
							salary: data.salary,
							status: data.status,
							totalNeeded: data.totalNeeded,
							remainingNeeded: data.remainingNeeded,
							workingLocation: data.workingLocation,
							recruiter: {
								id: currentUser.id,
							},
							position: {
								value: data.position.id,
								label: data.position.name,
							},
							skill: data.skill.map((item) => {
								return {
									value: item.id,
									label: item.name,
								};
							}),
							level: data.level.map((item) => {
								return {
									value: item.id,
									label: item.name,
								};
							}),
						}}
					>
						<Form.Item
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 20 }}
							label="id"
							name="id"
							style={{ display: "none" }}
						>
							<Input></Input>
						</Form.Item>
						<Form.Item
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 20 }}
							label="Position"
							name="position"
							rules={[
								{
									required: true,
									message: "The Position Can't Be Empty!",
								},
							]}
						>
							<Select
								allowClear
								style={{
									width: "100%",
								}}
								placeholder="Please select"
								onChange={handleChange}
								options={positions.map((position) => ({
									value: position.id,
									label: position.name,
								}))}
							/>
						</Form.Item>
						<Form.Item
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 20 }}
							label="Skill Required"
							name="skill"
							rules={[
								{
									required: true,
									message: "The Skill Required Can't Be Empty!",
								},
							]}
						>
							<Select
								mode="multiple"
								allowClear
								style={{
									width: "100%",
								}}
								placeholder="Please select"
								onChange={handleChange}
								options={skills.map((skill) => ({
									value: skill.id,
									label: skill.name,
								}))}
							/>
						</Form.Item>
						<Row>
							<Col span="12">
								<Form.Item
									label="Level"
									name="level"
									rules={[
										{
											required: true,
											message: "The Level Can't Be Empty!",
										},
									]}
								>
									<Select
										mode="multiple"
										allowClear
										style={{
											width: "100%",
										}}
										placeholder="Please select"
										onChange={handleChange}
										options={levels.map((level) => ({
											value: level.id,
											label: level.name,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									wrapperCol={{ span: 16 }}
									label="Total Needed"
									name="totalNeeded"
									rules={[
										{
											required: true,
											message: "The Total Needed Can't Be Empty!",
										},
									]}
								>
									<InputNumber
										min={1}
										style={{
											width: "100%",
										}}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Salary"
									name="salary"
									rules={[
										{
											required: true,
											message: "The Salary Can't Be Empty!",
										},
									]}
								>
									<InputNumber
										min={1}
										style={{
											width: "100%",
										}}
									/>
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									wrapperCol={{ span: 16 }}
									label="Remaining Needed"
									name="remainingNeeded"
									rules={[
										{
											required: true,
											message: "The Remaining Needed Can't Be Empty",
										},
									]}
								>
									<InputNumber
										min={1}
										style={{
											width: "100%",
										}}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Working Location"
									name="workingLocation"
									rules={[
										{
											required: true,
											message: "The Working Location Can't Be Empty!",
										},
									]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									label="Start Date"
									name="startDate"
									rules={[
										{
											required: true,
											message: "The Start Date Can't Be Empty!",
										},
									]}
								>
									<DatePicker
										style={{
											width: "100%",
										}}
										format={dateFormat}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Status"
									name="status"
									rules={[
										{
											required: true,
											message: "The Status Can't Be Empty!",
										},
									]}
								>
									<Input disabled />
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									label="End Date"
									name="endDate"
									rules={[
										{
											required: true,
											message: "The End Date Can't Be Empty!",
										},
									]}
								>
									<DatePicker
										style={{
											width: "100%",
										}}
										format={dateFormat}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Description"
									name="description"
									rules={[
										{
											required: true,
											message: "The Description Can't Be Empty!",
										},
										{ validator: validateParagraph },
									]}
								>
									<TextArea rows={4} />
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									label="Requirements"
									name="requirements"
									rules={[
										{
											required: true,
											message: "The Requirements Can't Be Empty!",
										},
									]}
								>
									<TextArea rows={4} />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Benefit"
									name="benefit"
									rules={[
										{
											required: true,
											message: "The Benefit Can't Be Empty!",
										},
									]}
								>
									<TextArea rows={4} />
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									label="Reference Information"
									name="referenceInformation"
									rules={[
										{
											required: true,
											message: "The Reference Information Can't Be Empty!",
										},
									]}
								>
									<TextArea rows={4} />
								</Form.Item>
							</Col>
						</Row>
						<Form.Item
							wrapperCol={{
								offset: 11,
								span: 12,
							}}
						>
							<Button
								type="primary"
								danger
								onClick={() => {
									confirm();
								}}
							>
								Cancel
							</Button>
							<Button type="primary" htmlType="submit" id="btn-save">
								Save
							</Button>
						</Form.Item>
					</Form>
				</div>
			)}
		</div>
	);
}
