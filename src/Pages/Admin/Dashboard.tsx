import Header from '../../Components/Admin/Header';
import HomeBanner from '../../Components/Admin/Dashboard/homeBanner';
import ProgressBanner from '../../Components/Admin/Dashboard/ProgressBanner';
import Notifications from '../../Components/Admin/Dashboard/Notifications';

const Dashboard = () => {

  return (
    <section>
      <Header />
      <HomeBanner />
      <ProgressBanner />
      <div className='container mt-6 mb-6'>
        <div className='flex'>
          <div className='w-7/12'></div>
          <div className='w-5/12'>
            <Notifications />
          </div>
        </div>
      </div>

    </section >

  )
}
export default Dashboard