import { FaCalendarMinus,FaNotesMedical,FaCalendarWeek,FaCalendarDay } from "react-icons/fa"
import ProgressCircle from "../../Graphs/ProgressCircle"

const ProgressBanner = () => {
    return (
        <div className='container bg-gradient-to-b from-defaultBg to-transparent'>
            <div className='flex space-x-6 justify-between'>
                <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
                    <FaCalendarWeek size={50} className=' overflow-visible bg-color-two text-defaultBg p-3 rounded-full' />
                    <h6>Annual leaves</h6>
                    <h3>15<span className=' text-base'>/15</span></h3>
                </div>
                <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
                    <FaNotesMedical size={50} className=' overflow-visible bg-color-one text-defaultBg p-3 rounded-full' />
                    <h6>Medical leaves</h6>
                    <h3>2<span className=' text-base'>/5</span></h3>
                </div>
                <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
                    <FaCalendarMinus size={50} className=' overflow-visible bg-stone-400 text-defaultBg p-3 rounded-full' />
                    <h6>Casual leaves</h6>
                    <h3>5<span className=' text-base'>/8</span></h3>
                </div>
                <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
                    <FaCalendarDay size={50} className=' overflow-visible bg-color-three text-defaultBg p-3 rounded-full' />
                    <h6>Other leaves</h6>
                    <h3>0</h3>
                </div>
                <div className='w-3/12 border h-max border-defaultBg rounded-lg p-4 flex space-x-4 justify-around items-center bg-white'>
                    <ProgressCircle text={20} value={20} height='107px' />
                    <div className=' h-max text-[14px] '>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-two before:block flex'>
                            Unpaid leaves
                        </p>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-defaultBg before:block flex'>
                            Total leaves
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default ProgressBanner