import ProgressCircle from "../../Components/Graphs/ProgressCircle";
import Header from "../../Components/User/Header"
import { FaClipboardList, FaDiagramProject, FaUserPlus, FaUsers } from 'react-icons/fa6';
import ProgressBanner from "../../Components/User/Leaves/ProgressBanner";

const Leaves = () => {
    return (
        <section>
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between items-center '>
                    <div className="flex items-end h-max justify-between w-full">
                        <h1 className=' text-3xl text-amber-100 font-thin'>Leaves</h1>
                        <button className='defaultstyle' onClick={() => { }}><span className='text-2xl font-bold  leading-6'>+</span>Apply Leave</button>
                    </div>
                </div>
            </div>
            <ProgressBanner />
        </section>
    )
}
export default Leaves