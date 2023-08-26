import Header from "../../Components/User/Header"
import ProgressBanner from "../../Components/User/Leaves/ProgressBanner";
import LeaveCreation from "../../Components/User/Leaves/LeaveCreation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { delNotice } from "../../Store/noticeSlice";
import LeavesList from "../../Components/User/Leaves/LeavesList";

const Leaves = () => {
    const [Show, setShow] = useState(false)
    const dispatch = useDispatch();
    return (
        <section>
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between items-center '>
                    <div className="flex items-end h-max justify-between w-full">
                        <h1 className=' text-3xl text-amber-100 font-thin'>Leaves</h1>
                        <button className='defaultstyle' onClick={() => { setShow(true) }}>
                            <span className='text-2xl font-bold  leading-6'>+</span>Apply Leave
                        </button>
                    </div>
                </div>
            </div>
            <ProgressBanner />
            {Show &&
                <LeaveCreation
                    closeModal={() => {
                        setShow(false); dispatch(delNotice('LeaveApplication'))
                    }}
                />
            }
            <LeavesList />
        </section>
    )
}
export default Leaves