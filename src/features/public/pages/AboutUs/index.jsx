import { BankOutlined, HourglassOutlined, SearchOutlined, TagFilled } from "@ant-design/icons";
import { Carousel, Col, Layout, Row, Typography } from "antd";
import daucy from "assets/images/Daucy.png";
import decowrap from "assets/images/Decowraps.png";
import dunlopillo from "assets/images/Dunlopillo.png";
import imed from "assets/images/IMED.png";
import rubio from "assets/images/Rubio.png";
import tekd from "assets/images/Tekd.png";
import wegrow from "assets/images/WeGrow.png";
import akrocean from "assets/images/akrocean.png";
import feedback1 from "assets/images/feedback-1.jpg";
import feedback2 from "assets/images/feedback-2.jpg";
import "./AboutUs.scss";

const AboutUs = () => {
  return (
    <Layout className="AboutUs">
      <section className="about-us">
        <div className="polygon">
          <div className="title-container">
            <div>
              <Typography.Title className="title" level={1}>
                ABOUT US
              </Typography.Title>
              <Typography.Title className="company" level={2}>
                FPT SOFTWARE
              </Typography.Title>
            </div>
          </div>
        </div>
      </section>

      <section className="outer why">
        <div className="inner intro">
          <Typography.Title level={2} className="why-title">
            Why choose us
          </Typography.Title>
          <Typography.Text className="why-content">
            FPT Software is part of FPT Corporation, a technology and IT services provider, headquartered in Vietnam
            with US$1.87 billion in revenue and more than 25,000 employees. Founded in 1999, the company has expanded
            its network to 27 countries and territories, with 65 global offices and 30 development centers. As a pioneer
            in digital transformation, FPT Software delivers world-class services in Smart factory, Digital platforms,
            RPA, AI, IoT, Cloud, AR/VR, BPO, and more with strict compliance to global standards. Recently, FPT Software
            became the first Vietnamese company and the 18th company worldwide to achieve TMMi level 5 certification.
          </Typography.Text>
        </div>
      </section>

      <section className="outer">
        <div className="inner flex align-center">
          <div className="content">
            <Typography.Title level={3}>Global IT consulting & service provider</Typography.Title>
            <Typography.Text>
              A subsidiary of FPT Corporation – the leading ICT Group in Asia, FPT Software is a global technology and
              IT services provider with headquarter in Vietnam. <br />
            </Typography.Text>
            <Typography.Text>
              Its decades of experiences in the global market have seen FPT Software empowering digital transformation
              for businesses worldwide, from various industries: Healthcare, BFSI, Manufacturing and Automotive,
              Communications, Media and Services, Aerospace and Aviation, Logistics and Transportation, Utilities and
              Energy, Consumer Packaged Goods, and Public Sector.
            </Typography.Text>{" "}
            <br />
            <Typography.Text>
              As a key player in the ICT industry, FPT Software places a strong emphasis on innovation, research, and
              development. The company has invested significantly in building its expertise in cutting-edge technologies
              such as artificial intelligence, machine learning, big data analytics, cloud computing, Internet of Things
              (IoT), and blockchain. These advancements have allowed FPT Software to deliver state-of-the-art digital
              solutions that address the complex challenges faced by businesses in today's fast-paced and interconnected
              world.
            </Typography.Text>
          </div>
          <div className="image-1"></div>
        </div>
      </section>

      <section className="outer">
        <div className="inner">
          <Typography.Title level={2} className="text-center row-title">
            WE PROVIDE ...
          </Typography.Title>
          <Row gutter={40}>
            <Col span={8} className="col">
              <SearchOutlined className="icon" />
              <Typography.Title level={4} className="col-title">
                Scalable Talent Pool
              </Typography.Title>
              <Typography.Text>A super great talent pool of 27,000+ engineers, including 5,000+ certified experts.</Typography.Text>
            </Col>

            <Col span={8} className="col">
              <BankOutlined className="icon" />
              <Typography.Title level={4} className="col-title">
                World-class Quality
              </Typography.Title>
              <Typography.Text>
                Standardized Quality Management System with Customer Satisfactory Score of 94,67/100.
              </Typography.Text>
            </Col>

            <Col span={8} className="col">
              <HourglassOutlined className="icon" />
              <Typography.Title level={4} className="col-title">
                Super speed
              </Typography.Title>
              <Typography.Text>Ready-made solutions/digital frameworks to define digital initiatives.</Typography.Text>
            </Col>
          </Row>
        </div>
      </section>

      <section className="outer carousel-container">
        <Typography.Title level={2}>Partnership</Typography.Title>
        <Carousel autoplay arrows autoplaySpeed={5000} className="carousel">
          <div className="w-full flex justify-between">
            <img src={akrocean} alt="akrocean" />

            <img src={daucy} alt="daucy" />

            <img src={decowrap} alt="decowrap" />

            <img src={dunlopillo} alt="dunlopillo" />
          </div>

          <div className="w-full flex justify-between">
            <img src={imed} alt="imed" />

            <img src={rubio} alt="rubio" />

            <img src={tekd} alt="tekd" />

            <img src={wegrow} alt="wegrow" />
          </div>
        </Carousel>

        <div className="feedback" id="feedback-0">
          <div className="feedback-inf">
            <div className="flex" style={{ gap: "16px" }}>
              <img src={feedback1} alt="feedback1" />
              <div className="flex align-center">
                <div>
                  <Typography.Title level={4}>Mr.Stephen</Typography.Title>
                  <Typography.Text>Business Development Manager</Typography.Text>
                </div>
              </div>
            </div>
          </div>
          <div className="feedback-content">
            <TagFilled className="feedback-icon" />
            <Typography.Text className="feedback-detail">
            FPT is a true leader in the technology industry, boasting a talent pool of over 27,000 skilled engineers, including 5,000+ certified experts. Its commitment to innovation and global expertise has enabled the company to deliver cutting-edge solutions and drive digital transformation for businesses across various sectors. FPT's remarkable capabilities and customer-centric approach have earned it widespread acclaim and trust in the industry.
            </Typography.Text>
          </div>
        </div>

        <div id="feedback-1" className="feedback">
          <div className="feedback-inf">
            <div className="flex" style={{ gap: "16px" }}>
              <img src={feedback2} alt="feedback1" />
              <div className="flex align-center">
                <div>
                  <Typography.Title level={4}>Mr.Christopher</Typography.Title>
                  <Typography.Text>CEO</Typography.Text>
                </div>
              </div>
            </div>
          </div>
          <div className="feedback-content">
            <TagFilled className="feedback-icon" />
            <Typography.Text className="feedback-detail">
            FPT is one of the leading technology companies in Vietnam, and I greatly admire their contributions and achievements in the fields of information technology and communications. With over 30 years of experience and development, FPT has continuously provided outstanding and innovative solutions that meet diverse customer needs.
            </Typography.Text>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
