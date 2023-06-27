import { useSelector } from 'react-redux';

const Dashboard = () => {
  const userName = useSelector((state:any)=>state.user.auth.name);
  return (
    <div>Hi {userName}</div>
  )
}
export default Dashboard