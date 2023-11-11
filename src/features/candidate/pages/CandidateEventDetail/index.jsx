import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EventDetail from "../../../../components/Common/EventDetail/EventDetail";
import "./CandidateEventDetail.scss";
import { Skeleton } from "antd";
import publicApi from "api/publicApi";
import { NotFound } from "components/Common";

export default function Event() {
  // Location
  const location = useLocation();

  // const { currentUser } = useSelector(authSelectors);
  const { id } = useParams();
  const [isLoading, setLoading] = useState(
    location.state ? (location.state.classify === "add" ? false : true) : true
  );

  // Navigate
  const navigate = useNavigate();

  // // Get data API
  const [data, setData] = useState({});

  const getData = useCallback(
    async (id) => {
      const res = await publicApi
        .getEventById({ id: id })
        .then((res) => res)
        .catch((err) => {
          console.log(err);
          navigate('/events');
        });
      setData(res);
      setLoading(false);
    },
    [navigate]
  );

  useEffect(() => {
    if (isLoading) {
      if (location.state) {
        getData(location.state.id);
      } else {
        getData(id);
      }
    }
    return () => { };
  }, [getData, id, isLoading, location.state]);

  return (
    <>
      {isLoading ? (
        <Skeleton active style={{ margin: "20px" }} />
      ) : !isLoading && localStorage.getItem("currentRole") === "candidate" ? (
        <EventDetail
          eventData={data}
          classify={"view"}
          role={"candidate"}
          id={id}
        />
      ) : (
        <EventDetail eventData={data} classify={"view"} role={"user"} id={id} />
      )}
    </>
  );
}
