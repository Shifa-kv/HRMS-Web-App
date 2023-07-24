import { useEffect, useState } from "react";
import { firestore } from "../../Firebase/Config";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa6";

const ListNotifications = () => {
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
  const handleDelete = (id: string) => {
    firestore.collection("notifications").doc(id).delete().then(() => {
      console.log("A notification got deleted!");
    }).catch((error) => {
      console.log("Error removing notification: ", error);
    });
  }
  return (
    <div className="container bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem]">
      <div className="px-6">
        {Notifications?.map((notification: any) => (

          <div
            key={notification.id}
            className={`flex items-center justify-between 
                                    ${notification.read ? 'bg-gray-100' : 'bg-color-one'} 
                                    px-4 py-3 rounded-lg mb-4 shadow-md`
            }
          >
            <Link to={`../${notification.linkTo}`}
              onClick={() => { !notification.read && handleOpen(notification.id) }}
              className="w-full"
            >
              <div>
                <h6 className=" font-semibold">{notification.title}</h6>
                <p className="text-sm text-gray-600">{notification?.message}</p>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <p className=" text-sm  border-gray-500 rounded-md px-2 w-max">
                {formatDate(notification?.timestamp.seconds).date + ' '}
                {formatDate(notification.timestamp).time}
              </p>
              <FaTrash onClick={() => handleDelete(notification.id)} />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
export default ListNotifications