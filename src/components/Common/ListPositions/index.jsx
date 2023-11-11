import { Card, Space } from "antd";
import { Link } from "react-router-dom";
import "./ListPositions.scss";

export default function ListPositions(props) {
  const lists = props.lists;

  return (
    <div className="ListPositions">
      {lists}
      <h1>Home page</h1>
      <Space direction="vertical" size="middle" className="space">
        <Card
          title="Card title"
          type="inner"
          extra={<Link href="#">More</Link>}
        >
          Card contents
        </Card>
        <Card
          title="Card title"
          type="inner"
          extra={<Link href="#">More</Link>}
        >
          Card contents
        </Card>
        <Card
          title="Card title"
          type="inner"
          extra={<Link href="#">More</Link>}
        >
          Card contents
        </Card>
      </Space>
    </div>
  );
}
