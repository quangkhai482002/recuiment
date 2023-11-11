import { Input, Typography } from 'antd';

export const EditableInput = ({ editable, value, onChange, className }) => {
	return editable ? (
		<Input
			value={value}
			spellCheck={false}
			onChange={onChange}
			className={className}
		/>
	) : (
		<Typography.Text className={className}>{value}</Typography.Text>
	);
};

export const EditableTextarea = ({ editable, value, onChange, className }) => {
	return editable ? (
		<Input.TextArea
			autoSize
			value={value}
			spellCheck={false}
			onChange={onChange}
			className={className}
		/>
	) : (
		<Typography.Paragraph className={className}>{value}</Typography.Paragraph>
	);
};
