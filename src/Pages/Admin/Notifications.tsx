import Header from "../../Components/Admin/Header";
import ListNotifications from "../../Components/Admin/ListNotifications";

const Notifications = () => {

  
    return (
        <section>
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between'>
                    <div>
                        <h1 className=' text-3xl text-amber-100 font-thin'>Notifications</h1>
                    </div>
                </div>
            </div>
            <ListNotifications />

        </section >
    )
}
export default Notifications