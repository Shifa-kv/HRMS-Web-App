import { useSelector } from 'react-redux';
import Header from '../../Components/User/Header';
import Banner from '../../Components/User/Banner';

const Dashboard = () => {
  const userName = useSelector((state:any)=>state.user.auth?.name);
  return (
    <section>
      <Header />
      <Banner />
    </section>
  )
}
export default Dashboard