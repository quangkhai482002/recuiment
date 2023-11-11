import {
  BookOutlined,
  DollarTwoTone,
  EnvironmentTwoTone,
  SendOutlined,
  TeamOutlined,
  ExportOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import ClockCircleOutlined from "@ant-design/icons/lib/icons/ClockCircleOutlined";
import { Button, Row, Spin, Tag, Typography, Image, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate, useParams, Link } from "react-router-dom";
import ApplyForm from "./ApplyForm";
import "./CandidatePositionDetail.scss";
import candidateApi from "api/candidateApi";
import dayjs from "dayjs";
import FPT_logo from "../../../../assets/images/FPT_logo.png";

export default function CandidatePositionDetail() {
  const navigate = useNavigate();
  const { Title } = Typography;
  const { positionID } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.currentUser);
  const userID = user ? user.id:undefined;
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [relatedJobsLoading, setRelatedJobsLoading] = useState(true);
  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      return candidateApi.getVacancyById(positionID);
    };
    fetchData()
      .then((data) => {
        if(data.status==="0")
        {navigate("/")}
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        navigate("/404");
        console.log(error);
      });
  }, [positionID, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        limit: 6,
        page: 1,
        positionIds: data && data.position.id,
      };
      return candidateApi.getVacancies(params);
    };
    data && fetchData()
      .then((jobs) => {
        setRelatedJobs(
          jobs.filter((job) => {
            return job.id !== data.id;
          })
        );
        setRelatedJobsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data]);
  return (
    <>
      {isLoading ? (
        <div className="loading">
          <Spin size="large"></Spin>
        </div>
      ) : (
        <div className="CandidatePositionDetail container">
          <Row className="row">
            <div className="left column generalInformation">
              <div className="jobTitle">{data.position.name}</div>
              <div className="jobInfo">
                <div className="section">
                  <DollarTwoTone
                    style={{ fontSize: "40px" }}
                    twoToneColor={"#87d068"}
                  />
                  <div className="content">
                    <div className="detail">Salary</div>
                    <div className="detail highlight">
                      {data.salary.toLocaleString("en-US") + " VND"}
                    </div>
                  </div>
                </div>
                <div className="section">
                  <EnvironmentTwoTone
                    style={{ fontSize: "40px" }}
                    twoToneColor={"#87d068"}
                  />
                  <div className="content">
                    <div className="detail">Location</div>
                    <div className="detail highlight">
                      {data.workingLocation == null
                        ? "no data"
                        : data.workingLocation.split(":")[0]}
                    </div>
                  </div>
                </div>
                <div className="section">
                  <div className="content">
                    <div className="detail highlight tag">
                      <div>Level</div>
                      <Tag className="item" color="green">
                        {data.level[0].name}
                      </Tag>
                    </div>
                    <div className="detail highlight tag">
                      <div>Technology</div>
                      <Tag className="item" color="green">
                        {data.skill[0].name}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
              <div className="jobDeadline">
                <ClockCircleOutlined style={{ paddingRight: 5 }} />
                Deadline for application:{" "}
                {dayjs(data.endDate).format("DD/MM/YYYY")}
              </div>
              <div className="jobActions">
                <Button
                  type="primary"
                  className="applyButton button"
                  onClick={showModal}
                  icon={<SendOutlined />}
                >
                  APPLY NOW
                </Button>               
              </div>
            </div>

            <div className="right column companyInformation">
              <div className="companyInformationDetail">
                <div className="companyName detail">
                  <Image src={FPT_logo} className="companyLogo"></Image>
                  <Title className="companyTitle"> FPT Software</Title>
                </div>
                <div className="companyScale detail">
                  <div className="titleCompanyDetail">
                    <TeamOutlined style={{ color: "#87d068" }} />
                    Scale
                  </div>
                  <div className="contentCompanyDetail">42.000 people</div>
                </div>
                <div className="companyAddress detail">
                  <div className="titleCompanyDetail">
                    <EnvironmentTwoTone twoToneColor={"#87d068"} />
                    Location
                  </div>
                  <Tooltip
                    placement="top"
                    title={
                      "Lô T2, đường D1, khu công nghệ cao, Phường Tân Phú, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam"
                    }
                  >
                    <div className="contentCompanyDetail">
                      Ho Chi Minh City, Viet Nam
                    </div>
                  </Tooltip>
                </div>
              </div>
              <Link
                to="https://fptsoftware.com/"
                target="_blank"
                className="companyLink"
              >
                View company Page
                <ExportOutlined />
              </Link>
            </div>
          </Row>
          <Row className="row">
            <div className="left column jobDetailInformation">
              <Title level={2} className="jobDetailInformationTitle">
                Job Detail Information
              </Title>
              <div className="jobDetailInformationContent">
                <div className="jobDescriptionItems">
                  <Title level={3} className="jobDescriptionTitle">
                    Job Description
                  </Title>
                  <div className="jobDescriptionItem">
                    <ul>
                      {data.description
                        ? data.description.split("\n").map((item, index) => {
                            return <li key={index}>{item}</li>;
                          })
                        : "No data"}
                    </ul>
                  </div>
                </div>
                <div className="jobDescriptionItems">
                  <Title level={3} className="jobDescriptionTitle">
                    Job requirements
                  </Title>
                  <div className="jobDescriptionItem">
                    <ul>
                      {data.requirements
                        ? data.requirements.split("\n").map((item, index) => {
                            return <li key={index}>{item}</li>;
                          })
                        : "No data"}
                    </ul>
                  </div>
                </div>
                <div className="jobDescriptionItems">
                  <Title level={3} className="jobDescriptionTitle">
                    Job benefits
                  </Title>
                  <div className="jobDescriptionItem">
                    <ul>
                      {data.benefit
                        ? data.benefit.split("\n").map((item, index) => {
                            return <li key={index}>{item}</li>;
                          })
                        : "No data"}
                    </ul>
                  </div>
                </div>
                <div className="jobDescriptionItems">
                  <Title level={3} className="jobDescriptionTitle">
                    Job Working Location
                  </Title>
                  <div className="jobDescriptionItem">
                    <Typography.Text
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      {data.workingLocation ? data.workingLocation : "No data"}
                    </Typography.Text>
                  </div>
                </div>
                <div className="jobDescriptionItems">
                  <Title level={3} className="jobDescriptionTitle">
                    Reference Information
                  </Title>
                  <div className="jobDescriptionItem">
                    <Typography.Text
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      {data.referenceInformation
                        ? data.referenceInformation
                        : "No data"}
                    </Typography.Text>
                  </div>
                </div>
                <div className="jobDescriptionItems">
                  <Title level={3} className="jobDescriptionTitle">
                    How to apply
                  </Title>
                  <div className="jobDescriptionItem">
                    <Typography.Text>
                      Candidate click to the "APPLY NOW" button below
                    </Typography.Text>
                  </div>
                </div>
              </div>
              <div className="jobDetailInformationActions">
                <Button
                  type="primary"
                  className="applyButton button "
                  onClick={showModal}
                  icon={<SendOutlined />}
                >
                  APPLY NOW
                </Button>
              </div>
            </div>
            <div className="rightJobDetail ">
              <div className="rightJobDetail right general">
                <Title level={2} className="generalTitle">
                  General Information
                </Title>
                <div className="generalContent">
                  <div className="generalContentItem">
                    <ApartmentOutlined className="generalContentItemLogo" />
                    <div className="generalContentItemInfo">
                      <div className="generalContentItemTitle">Level</div>
                      <div className="generalContentItemValue">
                        {data.level[0].name}
                      </div>
                    </div>
                  </div>
                  <div className="generalContentItem">
                    <TeamOutlined className="generalContentItemLogo" />
                    <div className="generalContentItemInfo">
                      <div className="generalContentItemTitle">
                        Number needed
                      </div>
                      <div className="generalContentItemValue">
                        {data.totalNeeded}
                      </div>
                    </div>
                  </div>
                  <div className="generalContentItem">
                    <BookOutlined className="generalContentItemLogo" />
                    <div className="generalContentItemInfo">
                      <div className="generalContentItemTitle">Job Type</div>
                      <div className="generalContentItemValue">Full time</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rightJobDetail right category">
                <div className=" categoryBox">
                  <div className="categoryBoxTitle">
                    Technology Requirements
                  </div>
                  <div className="categoryBoxTags">
                    {data.skill.map((item) => {
                      return (
                        <Tag key={item.id} className="categoryBoxTag">
                          {item.name}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
                <div className=" categoryBox">
                  <div className="categoryBoxTitle">Working Location</div>
                  <div className="categoryBoxTags">
                    <Tooltip placement="top" title={data.workingLocation}>
                      <Tag className="categoryBoxTag">
                        {data.workingLocation}
                      </Tag>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="rightJobDetail right relatedJobs">
                <Title level={3}>Related Jobs</Title>
                {relatedJobsLoading ? (
                  <Spin className="loading" size="large"></Spin>
                ) : (
                  <div className="relatedJobsContent">
                    {relatedJobs.length > 0 ? (
                      relatedJobs.slice(0, 5).map((item, index) => {
                        return (
                          <div className="relatedJobsBox" key={index}>
                            <Link
                              to={`/positions/${item.id}`}
                              target="_blank"
                              key={index}
                              style={{
                                justifyContent: "space-between",
                                display: "flex",
                              }}
                            >
                              <Image
                                src={FPT_logo}
                                preview={false}
                                style={{
                                  height: 45,
                                  display: "flex",
                                  objectFit: "contain",
                                  borderRadius: "5px",
                                  justifyContent: "center",
                                  padding: "5px",
                                }}
                              ></Image>
                              <div className="relatedJobsBoxInfo">
                                <div className="relatedJobsBoxLevel">
                                  {item.level[0].name}
                                </div>
                                <div className="relatedBoxSalary">
                                  {item.salary.toLocaleString("en-US") + " VND"}
                                </div>
                              </div>
                            </Link>
                            <div className="relateJobsBoxTags">
                              {item.skill.slice(0, 3).map((item, index) => {
                                return (
                                  <Tag
                                    key={index}
                                    className="relatedJobsBoxTag"
                                  >
                                    {item.name}
                                  </Tag>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No data</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Row>
          <ApplyForm
            userID={userID}
            visible={isModalOpen}
            setVisible={setIsModalOpen}
            positionId={positionID}
          />
        </div>
      )}
    </>
  );
}
