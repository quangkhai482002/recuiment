import { Card, Select } from "antd";

export default function CustomCardSelect({ title, defaultValue, func, optionData, disabled, className }) {
    return (
        <Card title={title} style={{ border: "none", fontSize: "1rem" }}
            headStyle={{ border: "none", padding: 0, fontSize: "1rem", color: "#a3a3a3", fontWeight: "bold" }}
            bodyStyle={{ padding: 0, width: "100%" }}
            size='small'
        >
            <Select
                showSearch
                placeholder={title === "Country" ? "Select your country" : title === "Province/city" ? "Please select a country first" : "Select your gender"}
                defaultValue={defaultValue}
                style={{
                    width: "90%",
                    height: "40px",
                }}
                disabled={disabled}
                onChange={func}
                options={optionData}
                className={`select-country ${className}`}
            />
        </Card>
    );
}