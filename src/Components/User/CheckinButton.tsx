import { useEffect, useState } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Timestamp, firestore } from '../../Firebase/Config';
import { setNotice } from '../../Store/noticeSlice';
import Notice from '../Notice';
import { setAttendance } from '../../Store/attendanceSlice';

const CheckinButton = () => {
    const user = useSelector((state: any) => state.user);
    const attendance = useSelector((state: any) => state.attendance);
    const dispatch = useDispatch();
    const [ShowCheckin, setShowCheckin] = useState(false);
    // const [checkinStatus, setCheckinStatus] = useState<{ [key: string]: any }>({ allowCheckin: false });
    useEffect(() => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const startTimestamp = Timestamp.fromDate(currentDate);
        const endTimestamp = Timestamp.fromMillis(
            currentDate.getTime() + 24 * 60 * 60 * 1000 - 1
        );
        firestore.collection("attendance")
            .where("employee_id", "==", user.id)
            .where("time_in", ">=", startTimestamp)
            .where("time_in", "<=", endTimestamp)
            .get().then((snapshot) => {
                if (snapshot.docs.length === 0) {
                    dispatch(setAttendance({
                        allowCheckin: false
                    }));
                } else {
                    snapshot.docs.map((res) => {
                        let attnd_status = res.data().time_out ? false : true;
                        res.data().time_out ?
                            dispatch(setAttendance({
                                allowCheckin: attnd_status,
                                attnd_id: res?.id,
                                time_in: formatDate(res.data().time_in),
                                time_out: formatDate(res.data().time_out)
                            }))
                            :
                            dispatch(setAttendance({
                                allowCheckin: attnd_status,
                                attnd_id: res?.id,
                                time_in: formatDate(res.data().time_in)
                            }))
                    })
                }
            })
    }, [user])

    const formatDate = (timestamp: number) => {
        const dateObj = new Date(timestamp * 1000); // Convert seconds to milliseconds
        const options = {
            hour: 'numeric' as const,
            minute: 'numeric' as const,
            hour12: true, // Use 12-hour format
        };
        const time = dateObj.toLocaleString('en-US', options);
        return time;
    };

    const handleCheckin = (status: boolean) => {
        let query;
        if (status == true) {
            query = firestore.collection("attendance").add({
                employee_id: user.id,
                time_in: Timestamp.now()
            });
        }
        else {
            query = firestore.collection("attendance").doc(attendance?.attnd_id).set({
                time_out: Timestamp.now()
            }, { merge: true })
        }

        query?.then((res) => {
            status ?
                dispatch(setAttendance({
                    ...attendance,
                    allowCheckin: true,
                    attnd_id: res?.id,
                    time_in: formatDate(Timestamp.now().seconds)
                }))
                :
                dispatch(setAttendance({
                    ...attendance, allowCheckin: false, time_out: formatDate(Timestamp.now().seconds)
                }))
        }).catch((error) => {
            dispatch(setNotice({ name: 'attendence', msg: error.message, code: 1 }));
        });
    }
    return (
        <div>
            <div
                className='text-center border-1 border-color-one p-3 rounded-md bg-defaultBg-100'
                onClick={() => { setShowCheckin(true) }}
            >
                <h3 className='text-amber-100 '>Check in / out</h3>
                <FaSignInAlt size={40} className='text-center m-auto text-color-one' />
            </div>
            {
                ShowCheckin &&
                <div>
                    <div className="fixed inset-0 grid overflow-y-auto	py-5 items-center justify-center z-50 bg-[#0000008c]">
                        <div className="bg-defaultBg py-8 px-20 text-center rounded-lg shadow-md relative border-2 border-gray-600 " id='employeeFormPopup'>
                            <button className="mt-4 bg-gray-300 rounded-full text-xs absolute right-2 top-1 text-defaultBg font-bold py-1 px-2 "
                                onClick={() => { setShowCheckin(false) }}
                            >
                                X
                            </button>
                            <h1 className="text-2xl font-bold  mb-5 normal-case text-amber-200">Checkin</h1>
                            <div className='rounded-full m-auto  border-white/30 h-[120px] w-[120px] flex items-center justify-center border-2 bg-defaultBg-100 text-white '>
                                {attendance.attnd_id ?
                                    attendance.allowCheckin ?
                                        <span className='text-sm'>Checked in<br />at<br />{attendance.time_in}</span>
                                        :
                                        <span className='text-sm'>Checked out<br />at<br />{attendance.time_out}</span>
                                    :
                                    <span>{formatDate(Timestamp.now().seconds)}</span>
                                }
                            </div>
                            <div className='flex space-x-3 mb-3'>
                                {attendance.attnd_id ?
                                    attendance.allowCheckin && <button className=' rounded-md m-auto mt-3 hover:bg-red-800/50 text-white w-full  font-bold py-2 px-8  bg-red-800'
                                        onClick={() => { handleCheckin(false) }}
                                    >CHECK OUT</button>
                                    :
                                    <button className=' rounded-md m-auto mt-3 hover:bg-color-one/50 text-white w-full  font-bold py-2 px-8  bg-color-one'
                                        onClick={() => { handleCheckin(true) }}
                                    >CHECK IN</button>
                                }
                            </div>
                            <Notice typeProp='attendence' />

                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default CheckinButton