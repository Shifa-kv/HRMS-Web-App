import ListingTable from "../../Components/Admin/Attendance/ListingTable"
import ProgressBanner from "../../Components/Admin/Attendance/ProgressBanner"
import Header from "../../Components/Admin/Header"
import image from '../../Assets/images/user.jpg'
import ListingChart from "../../Components/Admin/Attendance/ListingChart"
import { useEffect, useMemo, useRef, useState } from "react"
import { firestore, Timestamp } from "../../Firebase/Config"


const Attendance = () => {
    const [data, setData] = useState<any>();
    const [users, setUsers] = useState<any>([]);

    useEffect(() => {
        firestore.collection("attendance")
            .get().then((snapshot) => {
                const values = snapshot.docs.map((res) => {
                    const { time_in, employee_id, time_out } = res.data();
                    const dateObjInData = new Date(time_in?.seconds * 1000);
                    const isToday = new Date().toLocaleDateString() === dateObjInData.toLocaleDateString();
                    let TimeoutInData = time_out;
                    if (!time_out && !isToday) {
                        const newDateObj = new Date(dateObjInData);
                        TimeoutInData = Timestamp.fromDate(new Date(newDateObj.setHours(23, 59, 0, 0)));
                    }
                    const theDate = dateObjInData.toLocaleDateString();
                    return { theDate, time_in, time_out: TimeoutInData, employee_id, id: res.id };
                })
                setData(values)
            })


        firestore.collection('users').onSnapshot((snapshot) => {
            const usersData = snapshot.docs.map((userDoc) => {
                return {
                    name: userDoc.data().name,
                    id: userDoc.id
                };
            });
            setUsers(usersData)
        });

    }, [])
    

    return (
        <section >
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between'>
                    <div>
                        <h1 className=' text-3xl text-amber-100 font-thin'>Attendance</h1>
                    </div>
                </div>
            </div>
            <div className='container bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem] '>
                <div className="flex space-x-3">
                    <div className=" w-8/12">
                        <ProgressBanner data={data} users={users} />
                        {data && data.length > 0 && (
                            <ListingChart data={data} />
                        )}
                    </div>
                    <div className="px-8 pt-4 pb-7 w-4/12 bg-white overflow-hidden rounded-lg shadow-md items-center justify-between mb-4">
                        <h2 className=" pb-2 text-2xl font-bold flex justify-between items-center">
                            Today's Attendance
                        </h2>
                        {
                            data?.filter((doc: any) => doc?.theDate === new Date().toLocaleDateString())
                            ?.length === 0 ? (
                                <div className="flex items-center">
                                    <p className="text-red-700">No attendance today</p>
                                </div>
                            ) : (
                                data?.filter((doc: any) => doc?.theDate === new Date().toLocaleDateString())
                                ?.sort((a: any, b: any) => a.time_in - b.time_in).map((attendee: any,index:number) => (
                                    <div className="flex items-center my-3" key={index}>
                                        <img src={image} alt={'s'} className="w-12 h-12 mr-3 rounded-full mb-0" />
                                        <p className=" font-semibold text-lg w-full">
                                            {
                                                users?.find((user: any) => user.id === attendee.employee_id)?.name
                                            }
                                        </p>
                                        <div className="w-full text-right block">
                                            <small className="font-bold text-sm text-color-two block">
                                                {
                                                    new Date(attendee.time_in.seconds * 1000).toLocaleTimeString()
                                                }
                                            </small>
                                            {attendee?.time_out &&
                                                <small className="font-bold text-sm text-color-three">
                                                    {
                                                        new Date(attendee.time_out.seconds * 1000).toLocaleTimeString()
                                                    }
                                                </small>
                                            }
                                        </div>
                                    </div>
                                ))
                            )
                        }


                    </div>
                </div>
                {data && data.length > 0 && (
                    <ListingTable data={data} users={users} />
                )}
            </div>

        </section>
    )
}

export default Attendance