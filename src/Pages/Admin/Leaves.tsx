import { useEffect, useState } from "react";
import Header from "../../Components/Admin/Header"
import { Timestamp, firestore } from "../../Firebase/Config"
import PendingLeaves from "../../Components/Admin/Leaves/PendingLeaves";
import LeaveCalender from "../../Components/Admin/Leaves/LeaveCalender";
import ProgressBanner from "../../Components/Admin/Leaves/ProgressBanner";







const Leaves = () => {
    const [data, setData] = useState<any>();
    const [users, setUsers] = useState<any>([]);
    const [types, setTypes] = useState<any>([]);
    const [Holidays, setHolidays] = useState<any>([]);

    useEffect(() => {
        firestore.collection("leaves")
            .onSnapshot((snapshot) => {
                const values = snapshot.docs.map((res) => {
                    const datas = res.data();
                    return { ...datas, id: res.id };
                })
                setData(values)
            })

        firestore.collection("holidays")
            .get().then((snapshot) => {
                const values = snapshot.docs.map((res) => {
                    const datas = res.data();

                    return { title: datas?.title, date: new Date(datas?.date?.seconds * 1000), id: res.id };
                })
                setHolidays(values)
            })

        firestore.collection('users').get().then((snapshot) => {
            const usersData = snapshot.docs.map((userDoc) => {
                return {
                    name: userDoc.data().name,
                    id: userDoc.id
                };
            });
            setUsers(usersData)
        });

        firestore.collection('leave_type').get().then((snapshot) => {
            const typeData = snapshot.docs.map((userDoc) => {
                return {
                    ...userDoc.data(),
                    id: userDoc.id
                };
            });
            setTypes(typeData)
        });

    }, [])


    return (
        <section >
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between'>
                    <div>
                        <h1 className=' text-3xl text-amber-100 font-thin'>Leaves</h1>
                    </div>
                </div>
            </div>
            <div className='container bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem] '>
                <div className="flex space-x-3">
                    <div className=" w-8/12">
                        <ProgressBanner 
                        data={data?.filter((value: any) => value.status == 'approved')}
                        types={types}
                         />
                        <div className="flex  space-x-3 mt-3">

                            <div className="px-8 pt-4 pb-7 w-6/12 bg-white overflow-hidden rounded-lg shadow-md items-center justify-between mb-4">
                                <h3 className=" pb-2 text-2xl font-bold flex justify-between items-center">
                                    Upcoming holidays
                                </h3>
                                {
                                    Holidays?.filter((doc: any) => doc.date >= new Date())
                                        ?.length === 0 ? (
                                        <div className="flex items-center">
                                            <p className="text-red-700">No upcoming holidays</p>
                                        </div>
                                    ) : (
                                        Holidays?.filter((doc: any) => doc.date >= new Date())
                                            ?.sort((a: any, b: any) => a.date.seconds - b.date.seconds).map((holiday: any, index: number) => (
                                                <div className="flex items-center my-3" key={index}>
                                                    <p className="py-1 px-2 bg-color-two rounded-md font-bold text-xs text-center mr-3 min-w-[42px]">
                                                        {holiday.date.getDate()}<br />
                                                        {holiday.date.toLocaleString('en-GB', { month: 'short' })}
                                                    </p>
                                                    <div>
                                                        <h6>{holiday.title}</h6>
                                                        <p className="text-sm">{holiday.date.toLocaleString('en-GB', { weekday: 'long' })}</p>
                                                    </div>
                                                </div>
                                            ))
                                    )
                                }
                            </div>
                            <LeaveCalender
                                data={data?.filter((value: any) => value.status == 'approved')}
                                users={users}
                                types={types}
                            />

                        </div>
                    </div>
                    <div className=" w-4/12">
                        <PendingLeaves data={data} users={users} types={types} />


                    </div>
                </div>

            </div>
        </section>
    )
}

export default Leaves