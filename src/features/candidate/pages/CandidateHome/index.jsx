import { Col, List, Pagination, Row, Spin } from "antd";
import image1 from "assets/images/image-1.png";
import { Position, SearchJob } from "components/Common";
import {
  candidateActions,
  candidateSelectors,
} from "features/candidate/candidateSlice";
import { publicSelectors } from "features/public/publicSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CandidateHome.scss";

export default function CandidateHome() {
  const { currentVacancies } = useSelector(candidateSelectors);
  const { skills, levels } = useSelector(publicSelectors);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(1);
  const [searchData, setSearchData] = useState({ page: 1, limit: 10 });

  const onChange = (page) => {
    const newParams = {
      ...currentVacancies.params,
      page: page,
    };
    fetchData(newParams);
    setCurrent(page);
  };

  const fetchData = useCallback(
    (params) => {
      dispatch(candidateActions.getVacancies(params));
    },
    [dispatch]
  );

  useEffect(() => {
    // Function to fetch Vacancies data
    if (!currentVacancies.status) fetchData({ ...searchData });
  }, [currentVacancies.status, fetchData, searchData]);

  const onSearch = function (data) {
    let params = { page: 1, limit: 5 }; // Bổ sung data vào params để ghi nhớ thông tin tìm kiếm
    if (data.skillIds.length > 0) {
      params = {
        ...params,
        skillIds: data.skillIds,
      };
    }
    if (data.levelIds.length > 0) {
      params = {
        ...params,
        levelIds: data.levelIds,
      };
    }
    if (data.q) {
      params = {
        ...params,
        q: data.q,
      };
    }
    setSearchData(params);
    fetchData(params);
  };

  return (
    <div className="CandidateHomePage">
        <SearchJob onSearch={onSearch} skills={skills} levels={levels} />
      <>
        <Row gutter={8} className="container my-25">
          <Col xxl={20} xl={19} xs={24} className="col-default">
            {(currentVacancies.status === "200" ||
              currentVacancies.status === "401") && (
              <List
                grid={{ gutter: 12, xxl: 4, xl: 3, lg: 3, md: 2, xs: 1 }}
                dataSource={currentVacancies.data}
                renderItem={(work) => (
                  <Position key={work.id} data={work} />
                )}
              />
            )}
            {currentVacancies.status === "pending" && (
              <div className="loader">
                <Spin></Spin>
              </div>
            )}
          </Col>

          <Col xxl={4} xl={5} xs={0}>
            <img height={600} src={image1} alt="" className="w-full"></img>
          </Col> 
        </Row>
        <div className="pagination">
          <Pagination current={current} onChange={onChange} total={50} />
        </div>
      </>
    </div>
  );
}
