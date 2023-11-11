import { useEffect, useState } from "react";
import { Pagination, Spin, List } from "antd";
import publicApi from "api/publicApi";

import "./CandidateEvent.scss";
import CardEvent from "./CardEvent";

function CandidateEvent() {
  const [current, setCurrent] = useState(1);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 880);

  useEffect(() => {
    const params = {
      page: current,
      limit: 5,
    };
    const fetchData = async (params) => {
      setLoading(true);
      try {
        const data = await publicApi.getEvents(params);
        setEventsData(data);
      } catch (error) {
        setEventsData({ status: "404" });
      } finally {
        setLoading(false);
      }
    };
    fetchData(params);
  }, [current]);

  const onChange = (page) => {
    setCurrent(page);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="CandidateEvent">
      <header className="header-event">Các sự kiện</header>
      {loading ? (
        <div className="loader">
          <Spin />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 16,
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "space-between",
            margin: "0 150px",
          }}
        >
          {eventsData.status === "404" ? (
            <div>Không tìm thấy sự kiện nào</div>
          ) : (
            <List
              grid={{ gutter: [0, 8], column: isMobile ? 1 : 2 }}
              dataSource={eventsData}
              renderItem={(event) => (
                <CardEvent key={event.id} eventData={event} />
              )}
              style={{ width: "100%", display: "flex", gap: 8 }}
            />
          )}
        </div>
      )}
      <div className="pagination">
        <Pagination current={current} onChange={onChange} total={50} />
      </div>
    </div>
  );
}

export default CandidateEvent;
