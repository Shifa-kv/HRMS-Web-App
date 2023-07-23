import { useEffect, useMemo, useState } from "react";
import { firestore } from "../../Firebase/Config";
import { Link } from "react-router-dom";
import Header from "../../Components/Admin/Header";

const Notifications = () => {
    const [Notifications, setNotifications] = useState<any>([]);
    useEffect(() => {
        firestore.collection("notifications").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            const userData = snapshot.docs.map((snapshot) => {
                return { ...snapshot.data(), id: snapshot.id }
            })
            setNotifications(userData);
        })
    }, [])

    const formatDate = (timestamp: number) => {
        const dateObj = new Date(timestamp * 1000); // Convert seconds to milliseconds
        const options = {
            hour: 'numeric' as const,
            minute: 'numeric' as const,
            hour12: true, // Use 12-hour format
        };
        const time = dateObj.toLocaleString('en-US', options);
        const date = dateObj.getDate() + ' ' + dateObj.toLocaleString('default', { month: 'short' });
        return { date, time };
    };
    const handleOpen = (id: string) => {
        console.log('open')
        firestore.collection("notifications").doc(id).update({
            "read": true
        })
            .then().catch((error) => {
                console.log('error adding notification open status', error);
            });
    }

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
            <div className="container bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem]">
                <div className="px-6">
                    {Notifications?.map((notification: any) => (
                        <Link to={`../${notification.linkTo}`} onClick={() => { !notification.read && handleOpen(notification.id) }}>
                            <div
                                key={notification.id}
                                className={`flex items-center justify-between 
                                    ${notification.read ? 'bg-gray-100' : 'bg-color-one'} 
                                    px-4 py-3 rounded-lg mb-4 shadow-md`
                                }
                            >
                                <div>
                                    <h6 className=" font-semibold">{notification.title}</h6>
                                    <p className="text-sm text-gray-600">{notification?.message}</p>
                                </div>
                                <p className=" text-sm">{formatDate(notification?.timestamp.seconds).date}<br />{formatDate(notification.timestamp).time}</p>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section >
    )
}
export default Notifications