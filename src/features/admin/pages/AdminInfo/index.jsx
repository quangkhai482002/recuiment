import './AdminInfo.scss';
import { useSelector } from 'react-redux';
import UserInfo from '../../../../components/Common/UserInfo/UserInfo';
import { authSelectors } from 'features/auth/authSlice';
import { Skeleton } from 'antd';

export default function AdminInfo() {
  const { currentUser } = useSelector(authSelectors);

  return (
    <div className='AdminInfo internal-container'>
      {
        !currentUser ? (
          <Skeleton active style={{ padding: "30px" }} />
        ) : (
          <UserInfo data={currentUser} role={"admin"} color={"#e03e3e"} bgColor={"#fff7f6"} justView={false} />
        )
      }
    </div>
  );
}
