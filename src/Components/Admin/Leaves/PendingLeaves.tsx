import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { firestore } from "../../../Firebase/Config";
import { useDispatch } from "react-redux";
import { delNotice, setNotice } from "../../../Store/noticeSlice";
import Notice from "../../Notice";

const PendingLeaves = ({ data, users, types }: any) => {
    const [ShowPopup, setShowPopup] = useState(false);
    const [leaveId, setLeaveId] = useState<string | null>(null);
    const [popupData, setPopupData] = useState<any>({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search).get('id');

    useEffect(() => {
        if (queryParams) {
            setLeaveId(queryParams)
            setPopupData(
                data?.find((doc: any) => doc.id === queryParams)
            )
            setShowPopup(true)
        }
    }, [queryParams, data]);

    // Approve or reject the leave application on button click
    const handleStatus = (status: string) => {
        leaveId && firestore.collection('leaves').doc(leaveId)
            .set({ status: status }, { merge: true })
            .then(() => {
                dispatch(setNotice({ name: 'updateLeave', msg: 'Leave status updated successfully!', code: 3, time: 3000 }));
                setTimeout(() => {
                    setShowPopup(false)
                    setPopupData({})
                    navigate('.');
                    setLeaveId(null);
                }, 3000);
            }).catch((error) => {
                dispatch(setNotice({ name: 'updateLeave', msg: 'Unable to update leave status. Try again later.', code: 1, time: 3000 }));
                console.log("Error updating user : ", error);
            });
    }

    return (
        <div className="px-8 w-full pt-4 h-full pb-7 bg-white overflow-hidden rounded-lg shadow-md items-center justify-between mb-4">
            <h2 className=" pb-2 text-2xl font-bold flex justify-between items-center mb-3">
                Leave applications
            </h2>
            <ul>
                {data?.sort((a: any, b: any) => {
                    if (a.status === "pending" && b.status !== "pending") {
                        return -1;
                    }
                    if (a.status !== "pending" && b.status === "pending") {
                        return 1;
                    }
                    return 0;
                }).filter((values:any)=>{
                    const today = new Date()
                    const dateObj = new Date(values.end?.seconds * 1000);
                    if(values.status !== "pending"){
                        return dateObj.getDate() >= today.getDate() &&
                        dateObj.getFullYear() >= today.getFullYear() &&
                        dateObj.getMonth() >= today.getMonth() 
                    }
                    else{
                        return true
                    }
                })
                    .map((leave: any) => {
                        let bgColor = (leave.status == 'rejected') ? `bg-color-three` : (leave.status == 'pending') ? `bg-color-two` : `bg-defaultBg`;
                        return <li className="flex justify-between items-center mb-2 pt-1 pb-4 border-b last:border-b-0">
                            <p className="font-bold">
                                {
                                    users.find((user: any) => user.id === leave.user_id)
                                        .name
                                }
                                <span className="text-xs font-semibold text-gray-500 border-l border-gray-300 pl-1 ml-1">
                                    {
                                        types?.find((type: any) => type.id === leave.type)?.title
                                    }
                                </span>
                                <br />
                                <span className="text-sm font-semibold text-gray-500">
                                    Applied on {new Date(leave.timestamp?.seconds * 1000).toLocaleDateString()}
                                </span>
                            </p>
                            <Link
                                to={'./?id=' + leave.id}
                                className={bgColor + ` text-white text-center py-1 px-5 min-w-[115px] h-max rounded-2xl font-semibold uppercase text-sm`}
                            >
                                {leave.status}
                            </Link>
                        </li>
                    })

                }
            </ul>
            {ShowPopup &&
                <div className="fixed inset-0 grid overflow-y-auto	py-5 items-center justify-center z-50 bg-[#0000008c]">
                    <div className="bg-white p-8 px-12 rounded shadow-md relative ">
                        <button
                            className="mt-4 bg-black rounded-full text-xs absolute right-2 top-1 text-white font-bold py-1 px-2 "
                            onClick={() => {
                                setShowPopup(false)
                                dispatch(delNotice('updateLeave'))
                                setPopupData({})
                                navigate('.');
                                setLeaveId(null);
                            }}
                        >
                            X
                        </button>
                        <h1 className="text-2xl font-bold  mb-5">
                            Leave application from {users?.find((user: any) => user.id === popupData?.user_id)?.name}
                        </h1>
                        <Notice typeProp="updateLeave" />
                        {popupData &&
                            <table className="mt-3 w-full text-left border bg-color-three/30 rounded-lg overflow-hidden ">
                                <tbody>
                                    <tr className="border-b border-color-two">
                                        <th className="px-5 pb-1 pt-3">Name</th>
                                        <td className="px-5">{users?.find((user: any) => user.id === popupData?.user_id).name}</td>
                                    </tr>
                                    <tr className="border-b border-color-two">
                                        <th className="px-5 py-1">Leave type</th>
                                        <td className="px-5">{types?.find((type: any) => type.id === popupData?.type)?.title}</td>
                                    </tr>
                                    <tr className="border-b border-color-two">
                                        <th className="px-5 py-1">Starting date</th>
                                        <td className="px-5">{new Date(popupData.start?.seconds * 1000).toLocaleDateString()}</td>
                                    </tr>
                                    <tr className="border-b border-color-two">
                                        <th className="px-5 py-1">Ending date</th>
                                        <td className="px-5">{new Date(popupData.end?.seconds * 1000).toLocaleDateString()}</td>
                                    </tr>
                                    <tr className="border-b border-color-two">
                                        <th className="px-5 py-1">Reason</th>
                                        <td className="px-5">{popupData.reason}</td>
                                    </tr>
                                    <tr className="border-b border-color-two">
                                        <th className="px-5 pt-1 pb-3">Applied on</th>
                                        <td className="px-5">{new Date(popupData.timestamp?.seconds * 1000).toLocaleDateString()}</td>
                                    </tr>
                                    <tr className="border-b border-color-two">
                                        <th className="px-5 pt-1 pb-3">Current status</th>
                                        <td className="px-5 uppercase font-semibold">{popupData?.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                        }
                        {popupData?.status === 'pending' &&
                            <div className="flex space-x-3 mt-3">

                                <button
                                    className=" rounded-3xl m-auto border hover:bg-emerald-700 text-white w-full font-bold py-2 px-4  bg-emerald-900"
                                    onClick={() => { handleStatus('approved') }}
                                >
                                    Approve</button>
                                <button
                                    className=" rounded-3xl m-auto border hover:bg-rose-700 text-white w-full font-bold py-2 px-4  bg-rose-900"
                                    onClick={() => { handleStatus('rejected') }}
                                >
                                    Reject</button>
                            </div>
                        }

                    </div>
                </div>
            }
        </div>
    )
}
export default PendingLeaves