import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, List, Space, Tag, Typography } from "antd";
import fsoft1 from "assets/images/fsoft1.jpg";
import fsoft2 from "assets/images/fsoft2.jpg";
import fsoft3 from "assets/images/fsoft3.jpeg";
import fsoft4 from "assets/images/fsoft4.jpeg";
import fsoft5 from "assets/images/fsoft5.jpg";
import fsoft6 from "assets/images/fsoft6.jpeg";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { randomInterger } from "utils";
import "./Position.scss";

const descriptionLineLimit = 4;
const imageMapping = {
  1: fsoft1,
  2: fsoft2,
  3: fsoft3,
  4: fsoft4,
  5: fsoft5,
  6: fsoft6,
};

function Position({ data }) {
  const image = useRef(imageMapping[randomInterger(1, 6)]);
  const descriptions = data.description.split(`\n`);

  return !data ? null : (
    <List.Item className="Position">
      <Link to={`positions/${data.id}`} target="_blank">
        <Card
          hoverable
          cover={<img className="logo" alt="logo" src={image.current} />}
        >
          <Typography.Title level={3}>
            {data.position.name} {""}
            <span className="salary">{new Intl.NumberFormat("en-US").format(data.salary)} VND</span>
          </Typography.Title>
          {/* <Typography.Title level={3} className="salary">
            {new Intl.NumberFormat("en-US").format(data.salary)} VND
          </Typography.Title> */}

          <div className="location-container">
            <FontAwesomeIcon className="icon" icon={faLocationDot} />
            <Typography.Text className="location">
              {data.workingLocation}
            </Typography.Text>
          </div>

          <div className="description-container">
            {descriptions.map((description, index) => {
              if (index < descriptionLineLimit)
                return (
                  <Typography.Text className="description" key={index}>
                    {description} <br />
                  </Typography.Text>
                );
              if (index === descriptionLineLimit)
                return <Typography.Text key={index}>...</Typography.Text>;
              return null;
            })}
          </div>

          <div className="tag-container">
            {data.skill.map((skill) => (
              <Tag key={skill.id} className="tag" color="#f0f3fa">
                {skill.name}
              </Tag>
            ))}
          </div>
        </Card>
      </Link>
    </List.Item>
  );
}

export default Position;
