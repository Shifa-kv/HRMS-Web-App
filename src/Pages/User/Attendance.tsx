import { useSelector } from "react-redux";
import AttendanceList from "../../Components/User/AttendanceList"
import CheckinButton from "../../Components/User/CheckinButton"
import Header from "../../Components/User/Header"

const Attendance = () => {
    const attendance = useSelector((state: any) => state.attendance);
    return (
        <section>
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between items-center '>
                    <div className="flex items-end h-max">
                        <h1 className=' text-3xl text-amber-100 font-thin'>Attendence</h1>
                        <p className=" ml-2 pl-2 border-l mb-0 pb-0 h-max text-color-one">

                            {attendance.time_out?
                            `Checked out at ${attendance.time_out}` : 
                            attendance.time_in && `Checked in at ${attendance.time_in}`
                            }
                        </p>
                    </div>
                    <CheckinButton />
                </div>
            </div>

            <AttendanceList />
        </section>
    )
}
export default Attendance