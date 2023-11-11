import { Typography } from "antd";
import { HighlightOutlined, CheckOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

export default function CustomParagraph(props) {
    return (
        <Paragraph
            editable={
                (props.classify === "edit" || props.classify === "add") && {
                    text: props.data,
                    icon: <HighlightOutlined />,
                    tooltip: "Click to edit " + props.type,
                    onChange: props.func,
                    enterIcon: <CheckOutlined />,
                }
            }
            style={props.dataStyle}
        >
            {props.dataReturn}
        </Paragraph>
    );
};