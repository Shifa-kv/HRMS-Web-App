import { useEffect, useMemo, useState } from "react";
import { firestore } from "../../../Firebase/Config";
import { Link } from "react-router-dom";

const Notifications = () => {
    const [Notifications, setNotifications] = useState<any>([]);
    useEffect(() => {
        firestore.collection("notifications").orderBy("timestamp", "desc").limit(10).onSnapshot((snapshot) => {
            const userData = snapshot.docs.map((snapshot) => {
                return {...snapshot.data(),id:snapshot.id}
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
const handleOpen = (id:string)=>{
    console.log('open')
    firestore.collection("notifications").doc(id).update({
        "read": true
    })
    .then().catch((error)=>{
        console.log('error adding notification open status',error);
    });
}
    


    return (
        <div className="bg-white rounded-lg shadow-md py-3 overflow-hidden">
            <h2 className="px-6  text-2xl font-bold mb-4 text-defaultBg">Notifications</h2>
            <div className="px-6">
                {Notifications?.map((notification:any) => (
                    <Link to={`../${notification.linkTo}`} onClick={()=>{ !notification.read && handleOpen(notification.id)}}>
                    <div
                        key={notification.id}
                        className={`flex items-center justify-between 
                                    ${notification.read ? 'bg-gray-100' : 'bg-color-three'} 
                                    px-4 py-3 rounded-lg mb-4 shadow-md`
                        }
                    >
                        <div>
                            <h6 className=" font-semibold">{notification.title}</h6>
                            <p className="text-sm text-gray-600">{notification?.message?.slice(0, 50)}...</p>
                        </div>
                        <p className="text-gray-400 text-sm">{formatDate(notification?.timestamp.seconds).date}<br />{formatDate(notification.timestamp).time}</p>
                    </div>
                    </Link>
                ))}
                <Link to='../notifications' className="border w-full rounded-lg py-2 border-color-three text-defaultBg block text-center">View all</Link>
            </div>
            
        </div>
    );
}
export default Notifications