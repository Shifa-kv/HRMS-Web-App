import { FaClipboardList, FaDiagramProject, FaFileInvoice, FaFilePen, FaNoteSticky, FaPage4, FaPerson, FaTable, FaUserGroup, FaUserPlus, FaUsers } from 'react-icons/fa6';
import Header from '../../Components/Admin/Header';
import HomeBanner from '../../Components/Admin/homeBanner';
import ProgressCircle from '../../Components/ProgressCircle';
import EmployeeUploadForm from '../../Components/Admin/EmployeeUploadForm';

const Dashboard = () => {

  return (
    <section>
      <Header />
      <HomeBanner />
      {/* <EmployeeUploadForm /> */}
      <div className='container bg-gradient-to-b from-defaultBg to-transparent'>
        <div className='flex space-x-5'>
          <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
            <FaUsers size={50} className='bg-color-two text-defaultBg p-3 rounded-full' />
            <h6>Permenent Employees</h6>
            <h3>200<span className=' text-base'>/210</span></h3>
          </div>
          <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
            <FaClipboardList size={50} className='bg-color-one text-defaultBg p-3 rounded-full' />
            <h6>On leave</h6>
            <h3>10<span className=' text-base'>/210</span></h3>
          </div>
          <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
            <FaUserPlus size={50} className='bg-stone-400 text-defaultBg p-3 rounded-full' />
            <h6>New joinee</h6>
            <h3>20<span className=' text-base'>/210</span></h3>
          </div>
          <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
            <FaDiagramProject size={50} className='bg-color-three text-defaultBg p-3 rounded-full' />
            <h6>Projects pending</h6>
            <h3>20<span className=' text-base'>/50</span></h3>
          </div>
          <div className='w-3/12 border h-max border-defaultBg rounded-lg p-4 flex space-x-4 justify-around items-center bg-white'>   
            <ProgressCircle text='200' value={23} height='107px'  />
            <div className=' h-max text-[14px] '>
              <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-two before:block flex'>
                23% Remote
              </p>
              <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-defaultBg before:block flex'>
                77% Office
              </p>
            </div>

          </div>
        </div>
      </div>
    </section >

  )
}
export default Dashboard