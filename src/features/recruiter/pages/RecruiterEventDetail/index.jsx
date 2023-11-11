import { Skeleton } from "antd";
import recruiterApi from "api/recruiterApi";
import { NotFound } from "components/Common";
import { currentDate } from "components/Common/EventDetail/data";
import { authSelectors } from "features/auth/authSlice";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import EventDetail from "../../../../components/Common/EventDetail/EventDetail";
import "./RecruiterEventDetail.scss";

export default function RecruiterEventDetail({ classify }) {
  const { currentUser } = useSelector(authSelectors);
  const location = useLocation();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(classify !== "add");
  const [notFound, setNotFound] = useState(false);

  // Navigate

  // // Get data API
  const [data, setData] = useState({
    name: "Type name of the event",
    location: "",
    description: "Description of the event",
    rule: "First rule",
    benefit: "First benefit",
    createAt: currentDate,
    startDate: currentDate,
    endDate: currentDate,
    status: "1",
    recruiter: { ...currentUser },
  });

  const getData = useCallback(
    async (id) => {
      await recruiterApi
        .getEventById({ id: id })
        .then((res) => {
          if (res.recruiter.id !== currentUser.id) {
            setNotFound(true);
            setLoading(false);
          } else {
            setData(res);
            setLoading(false);
          }
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [currentUser.id]
  );

  useEffect(() => {
    if (isLoading) {
      if (location.state) {
        getData(location.state.id);
      } else {
        getData(id);
      }
    }
    return () => {};
  }, [getData, id, isLoading, location.state]);

  return (
    <div>
      {isLoading && <Skeleton active style={{ padding: "30px" }} />}
      {classify === "add" && (
        <EventDetail eventData={data} classify={classify} role={"recruiter"} />
      )}
      {!isLoading && notFound && <NotFound />}
      {!isLoading && classify !== "add" && (
        <EventDetail
          eventData={data}
          classify={classify}
          role={"recruiter"}
          id={location.state.id}
        />
      )}
    </div>
  );
}
