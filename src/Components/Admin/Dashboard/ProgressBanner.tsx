import { useState,useEffect } from "react";
import { firestore } from "../../../Firebase/Config";
import ProgressCircle from "../../ProgressCircle";
import { FaClipboardList, FaDiagramProject, FaUserPlus, FaUsers } from 'react-icons/fa6';
import CalculatePercentage from "../../../Utils/CalculatePercentage";

const ProgressBanner = () => {
    const [Users, setUsers] = useState<any>();
  useEffect(() => {
    firestore.collection('users').onSnapshot((snapshot) => {
      const userData = snapshot.docs.map((user) => {
        const { email, name, phone, department, role, e_date, e_id, jobstatus, jobmode } = user.data();
        return {
          email, name, phone, department, id: user.id, e_date, role, e_id, jobstatus, jobmode
        }
      })
      setUsers(userData);
    })
  }, []);

  const filterUser = (data: string, value: string | boolean | number) => {
    return Users?.filter((user: any) => user[data] == value)
  }
  const getNewjoineeCount = () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    return Users?.filter((user: any) => {
      const userDate = new Date(user.e_date);
      return userDate >= threeMonthsAgo
    })
  }
  return (
    <div className='container bg-gradient-to-b from-defaultBg to-transparent'>
        <div className='flex space-x-6 justify-between'>
          <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
            <FaUsers size={50} className='bg-color-two text-defaultBg p-3 rounded-full' />
            <h6>Permenent Employees</h6>
            <h3>{filterUser('jobstatus', 'fulltime')?.length}<span className=' text-base'>/{Users?.length}</span></h3>
          </div>
          <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
            <FaClipboardList size={50} className='bg-color-one text-defaultBg p-3 rounded-full' />
            <h6>On leave</h6>
            <h3>1<span className=' text-base'>/{Users?.length}</span></h3>
          </div>
          <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
            <FaUserPlus size={50} className='bg-stone-400 text-defaultBg p-3 rounded-full' />
            <h6>New joinee</h6>
            <h3>{getNewjoineeCount()?.length}<span className=' text-base'>/{Users?.length}</span></h3>
          </div>
          <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
            <FaDiagramProject size={50} className='bg-color-three text-defaultBg p-3 rounded-full' />
            <h6>Projects pending</h6>
            <h3>20<span className=' text-base'>/50</span></h3>
          </div>
          <div className='w-3/12 border h-max border-defaultBg rounded-lg p-4 flex space-x-4 justify-around items-center bg-white'>
            <ProgressCircle text={Users?.length} value={CalculatePercentage((filterUser('jobmode', 'remote')?.length), (Users?.length))} height='107px' />
            <div className=' h-max text-[14px] '>
              <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-two before:block flex'>
                {filterUser('jobmode', 'remote')?.length} Remote
              </p>
              <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-defaultBg before:block flex'>
                {filterUser('jobmode', 'office')?.length} Office
              </p>
            </div>

          </div>
        </div>
      </div>
  )
}
export default ProgressBanner