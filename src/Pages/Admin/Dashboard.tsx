import Header from '../../Components/Admin/Header';
import HomeBanner from '../../Components/Admin/Dashboard/homeBanner';
import ProgressBanner from '../../Components/Admin/Dashboard/ProgressBanner';
import Notifications from '../../Components/Admin/Dashboard/Notifications';
import { useEffect, useState } from 'react';
import { Timestamp, firestore } from '../../Firebase/Config';
import StackedBarChart from '../../Components/Graphs/StackedBarChart';

const Dashboard = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const currentYear = new Date().getFullYear();

    firestore.collection("attendance")
      .where('time_in', '>=', new Date(currentYear, 0, 1)) // Start of current year
      .where('time_in', '<', new Date(currentYear + 1, 0, 1)) // Start of next year
      .get().then((snapshot) => {
        const values = snapshot.docs.map((res) => {
          const { time_in, employee_id, time_out } = res.data();
          const dateObjInData = new Date(time_in?.seconds * 1000);
          const isToday = new Date().toLocaleDateString() === dateObjInData.toLocaleDateString();
          let TimeoutInData = time_out;
          if (!time_out && !isToday) {
            const newDateObj = new Date(dateObjInData);
            TimeoutInData = Timestamp.fromDate(new Date(newDateObj.setHours(23, 59, 0, 0)));
          }
          const theDate = dateObjInData.toLocaleDateString();
          return { theDate, time_in, time_out: TimeoutInData, employee_id, id: res.id };
        })
        let monthlyData: any = [];
        values?.forEach((res: any) => {
          const month = new Date(res.time_in?.seconds * 1000).getMonth();
          const timeInDate = new Date(res.time_in?.seconds * 1000);
          const monthName = new Date(res.time_in?.seconds * 1000).toLocaleString('default', { month: 'long' });
          if (!monthlyData[month]) {
            monthlyData[month] = { name: monthName, pv: 0, uv: 0 };
          }
          if (timeInDate.getHours() <= 9) {
            return monthlyData[month].pv = monthlyData[month].pv + 1;
          }
          else {
            return monthlyData[month].uv = monthlyData[month].uv + 1;
          }
        })
        const filteredMonthlyData = monthlyData.filter((item:any) => item !== undefined);
        setData(filteredMonthlyData)
      })

  }, [])




  return (
    <section>
      <Header />
      <HomeBanner />
      <ProgressBanner />
      <div className='container mt-6 mb-6'>
        <div className='flex space-x-4'>
          <div className='w-7/12'>
            <div className="bg-white rounded-lg shadow-md py-5 overflow-hidden h-full max-h-[500px]">
              <StackedBarChart data={data} />
            </div>
          </div>
          <div className='w-5/12'>
            <Notifications />
          </div>
        </div>
      </div>

    </section >

  )
}
export default Dashboard