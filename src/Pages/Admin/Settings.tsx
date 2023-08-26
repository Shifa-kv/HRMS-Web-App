import Header from "../../Components/Admin/Header"
import LeaveSettings from "../../Components/Admin/Settings/LeaveSettings"
const Settings = () => {


    return (
        <section >
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between'>
                    <div>
                        <h1 className=' text-3xl text-amber-100 font-thin'>Settings</h1>
                    </div>
                </div>
            </div>
            <LeaveSettings />
        </section>
    )
}
export default Settings