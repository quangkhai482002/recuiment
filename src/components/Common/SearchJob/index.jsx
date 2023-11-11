import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select } from "antd";
import { useState } from "react";
import "./SearchJob.scss";

function SearchJob({ onSearch, skills, levels }) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const SKILLS = skills.map((skill) => skill.name);
  const LEVELS = levels.map((level) => level.name);
  const SKILLSID = skills.map((skill) => skill.id);
  const LEVELSID = levels.map((level) => level.id);

  const filteredSkills = SKILLS.filter((o) => !selectedSkills.includes(o));

  const filteredLevels = LEVELS.filter((o) => !selectedLevels.includes(o));

  const handleInputChange = (e) => {
    setInputSearch(e.target.value);
  };

  const handelClick = () => {
    onSearch({
      skillIds: selectedSkills.map((skill) => {
        const index = SKILLS.indexOf(skill);
        return SKILLSID[index];
      }),
      levelIds: selectedLevels.map((level) => {
        const index = LEVELS.indexOf(level);
        return LEVELSID[index];
      }),
      q: inputSearch,
    });
  };

  return (
    <Row gutter={4} className="SearchJob container">
      <div className="image"></div>
      <Col xs={24} md={12} lg={5}>
        <Input
          className="w-full"
          value={inputSearch}
          placeholder="Tìm kiếm công việc"
          onChange={handleInputChange}
        />
      </Col>

      <Col xs={24} md={12} lg={8}>
        <Select
          className="select w-full"
          mode="multiple"
          placeholder="Kĩ năng"
          value={selectedSkills}
          onChange={setSelectedSkills}
          options={filteredSkills.map((skill) => ({
            value: skill,
            label: skill,
          }))}
        />
      </Col>

      <Col xs={24} md={12} lg={8}>
        <Select
          className="select w-full"
          mode="multiple"
          placeholder="Cấp bậc"
          value={selectedLevels}
          onChange={setSelectedLevels}
          options={filteredLevels.map((level) => ({
            value: level,
            label: level,
          }))}
        />
      </Col>

      <Col xs={24} md={12} lg={3}>
        <Button
          className="w-full"
          onClick={handelClick}
          style={{
            backgroundColor: "#00b14f",
            color: "#FFFFFF",
          }}
          icon={<SearchOutlined />}
        >
          Tìm kiếm
        </Button>
      </Col>
    </Row>
  );
}

export default SearchJob;
