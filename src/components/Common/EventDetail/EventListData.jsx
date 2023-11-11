import { Button, Space } from "antd";
import CustomParagraph from "./CustomParagraph";


export default function EventListData({ role, data, func, type, classify }) {
    const addItem = () => {
        const newItem = [...data];
        newItem.push("");
        func(newItem.join('\n'));
    };

    const changeData = (event, index) => {
        const newData = [...data];
        newData[index] = event;
        func(newData.join('\n'));
    };

    const deleteData = (index) => {
        const newData = [...data];
        newData.splice(index[0], index.length);
        func(newData.join('\n'));
    };

    return (
        <>
            <ul>
                {data.map((item, id) => {
                    return (
                        <li key={type + "-" + id}>
                            <CustomParagraph role={role} data={item} func={(event) => {
                                if (event === "") {
                                    return deleteData([id]);
                                } else {
                                    return changeData(event, id);
                                }
                            }} dataStyle={{ fontSize: "1rem", lineHeight: "40px" }} dataReturn={item} type={type} classify={classify} />
                        </li>
                    );
                })}
            </ul>
            {
                (classify === "edit" || classify === "add") && (
                    <Space
                        direction="vertical"
                        style={{
                            width: "100%",
                        }}
                    >
                        <Button
                            type="primary"
                            block
                            onClick={() => {
                                return addItem();
                            }}
                            style={{
                                marginTop: "10px",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                textTransform: "uppercase"
                            }}
                        >
                            ADD NEW {type}
                        </Button>
                    </Space>
                )
            }
        </>
    );
}