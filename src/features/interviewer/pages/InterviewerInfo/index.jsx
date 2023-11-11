import './InterviewerInfo.scss';
import UserInfo from '../../../../components/Common/UserInfo/UserInfo';
import { useSelector } from 'react-redux';
import { authSelectors } from 'features/auth/authSlice';
import { Skeleton } from 'antd';

export default function InterviewerInfo() {
  const { currentUser } = useSelector(authSelectors);

  return (
    <div className='InterviewerInfo internal-container'>
      {
        !currentUser ? (
          <Skeleton active />
        ) : (
          <UserInfo data={currentUser} role={"interviewer"} color={"#3e9ce0"} bgColor={"#f6fcff"} justView={false} />
        )
      }
    </div>
  );
}
