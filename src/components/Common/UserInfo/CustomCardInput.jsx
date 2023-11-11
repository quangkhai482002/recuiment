import { Card, Input } from "antd";
import { useState } from "react";

export default function CustomCardInput({ title, disabled, func, style, value, id }) {
    const [phoneValue, setValue] = useState(title === "Phone" ? value : '');

    const handleChange = event => {
        const result = event.target.value.replace(/\D/g, '');
        setValue(result);
    };

    return (
        <Card title={title} style={{ border: "none", fontSize: "1rem" }}
            headStyle={{ border: "none", padding: 0, fontSize: "1rem", color: "#a3a3a3", fontWeight: "bold" }}
            bodyStyle={{ padding: 0, width: "100%" }}
            size='small'
        >
            {
                disabled ? (
                    <Input disabled={true}
                        placeholder={`Type your ${title}`}
                        style={style}
                        value={value}
                    />
                ) : title !== "Phone" ? (
                    <Input disabled={false} onChange={func}
                        placeholder={`Type your ${title}`}
                        style={style}
                        value={value}
                        id={id}
                    />
                ) : (
                    <Input disabled={false}
                        onChange={handleChange}
                        placeholder={`Type your ${title}`}
                        value={phoneValue}
                        style={style}
                        id={id}
                    />
                )
            }
        </Card>
    );
}