import { Button, Descriptions, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const { Title, Text, Paragraph } = Typography;

export default function DescriptionInterview(props) {
  const { interviewDetail } = props;
  const [interview, setInterview] = useState({
    salary: null,
    startDate: "...",
    endDate: "...",
    firstName: "...",
    lastName: "...",
    birthday: null,
    phoneNumber: null,
    address: "...",
    email: "...",
    applyDate: "...",
    cvId: null,
    linkMeet: null,
    vacancyId: null,
    recruiter: "...",
    interviewer: "...",
    status: "...",
  });

  useEffect(() => {
    if (interviewDetail)
      setInterview({
        salary: interviewDetail.candidateVacancy.vacancy.salary,
        startDate: interviewDetail.candidateVacancy.vacancy.startDate,
        endDate: interviewDetail.candidateVacancy.vacancy.endDate,
        firstName: interviewDetail.candidateVacancy.candidate.firstName,
        lastName: interviewDetail.candidateVacancy.candidate.lastName,
        birthday: interviewDetail.candidateVacancy.candidate.birthday,
        phoneNumber: interviewDetail.candidateVacancy.candidate.phoneNumber,
        email: interviewDetail.candidateVacancy.candidate.email,
        address: interviewDetail.candidateVacancy.candidate.address,
        applyDate: interviewDetail.candidateVacancy.applyDate,
        cvId: interviewDetail.id,
        linkMeet: interviewDetail.linkMeet,
        vacancyId: interviewDetail.candidateVacancy.vacancy.id,
        recruiter: interviewDetail.recruiter,
        interviewer: interviewDetail.interviewer,
        status: interviewDetail.status,
      });
  }, [interviewDetail]);

  return (
    <div className="DescriptionInterview">
      <Descriptions
        title={<Title level={3}>Interview Information</Title>}
        style={{ borderBottom: "#e5e5e5 0.1px solid" }}
      >
        <Descriptions.Item label="Recruiter">
          <Text strong>
            {interview.recruiter ? (
              <>
                {" "}
                {interview.recruiter.firstName} {interview.recruiter.lastName}
              </>
            ) : (
              "..."
            )}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Interviewer">
          <Text strong>
            {interview.interviewer ? (
              <>
                {" "}
                {interview.interviewer.firstName}{" "}
                {interview.interviewer.lastName}
              </>
            ) : (
              "..."
            )}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Text
            strong
            style={{
              color:
                (interview.status === "CANCELLED" && "#f5222d") ||
                (interview.status === "PENDING" && "#fa8c16") ||
                (interview.status === "COMPLETED" && "#5b8c00"),
            }}
          >
            {interview.status}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Salary">
          {interview.salary ? (
            <Paragraph strong>
              {new Intl.NumberFormat("en-US").format(interview.salary)} VND
            </Paragraph>
          ) : (
            "..."
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Starting Date">
          <Paragraph strong>{interview.startDate}</Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="Ending Date">
          <Paragraph strong>{interview.endDate}</Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="Link Meet">
          {interview.linkMeet ? (
            <Link to={interview.linkMeet} target="_blank">
              Join Meeting
            </Link>
          ) : (
            "..."
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Vacancy">
          {interview.vacancyId ? (
            <Link to={"/positions/"+interview.vacancyId} target="_blank">
              View Vacancy
            </Link>
          ) : (
            "..."
          )}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        style={{ padding: "1rem 0" }}
        title={<Title level={5}>Candidate Infomation</Title>}
      >
        <Descriptions.Item label="Name">
          {interview.firstName} {interview.lastName}
        </Descriptions.Item>

        <Descriptions.Item label="Birthday">
          {interview.birthday ? interview.birthday : "..."}
        </Descriptions.Item>
        <Descriptions.Item label="Telephone">
          {interview.phoneNumber ? interview.phoneNumber : "..."}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{interview.email}</Descriptions.Item>
        <Descriptions.Item label="Address">
          {interview.address && (
            <>
              {interview.address.street} Street, {interview.address.city} City,{" "}
              {interview.address.country}
            </>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Applied Time">
          {interview.applyDate}
        </Descriptions.Item>
        <Descriptions.Item label="Resume">
          {interview.cvId ? (
            <Link
              to={`/view-resume?_interviewID=${interview.cvId}`}
              target="_blank"
            >
              View CV
            </Link>
          ) : (
            "..."
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
