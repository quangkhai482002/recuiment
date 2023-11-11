import './ViewUserInfo.scss';
import UserInfo from '../../../../components/Common/UserInfo/UserInfo';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import adminApi from 'api/adminApi';
import { Skeleton } from 'antd';

export default function ViewUserInfo() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);

  const getData = async (email) => {
    await adminApi.getDataAsRecruiter().then(res => {
      console.log(res);
    });
    const res = await adminApi.getAccountSearch({ email: email }).then(res => {
      // console.log(res);
      return res;
    }).catch(err => {
      console.log(err);
    });
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      getData(id.split('&=')[1]);

    }
    return () => { };
  }, [id, isLoading]);

  return (
    <div className='ViewUserInfo internal-container'>
      {
        isLoading && (
          <Skeleton active style={{ padding: "30px" }} />
        )
      }
      {
        !isLoading && data.role.name === "RECRUITER" &&
        (<UserInfo data={data} role={'recruiter'} color={"#e0c93e"} bgColor={"#fffff6"} justView={true} />)
      }
      {
        !isLoading && data.role.name === "CANDIDATE" &&
        (<UserInfo data={data} role={"candidate"} color={"#3ee0a5"} bgColor={"#f6fffc"} justView={true} />)
      }
      {
        !isLoading && data.role.name === "INTERVIEWER" &&
        (<UserInfo data={data} role={"interviewer"} color={"#3e9ce0"} bgColor={"#f6fcff"} justView={true} />)
      }
    </div>
  );
}
