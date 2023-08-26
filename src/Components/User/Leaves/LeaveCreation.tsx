import { useState, useEffect, useMemo } from "react";
import { Timestamp, firestore } from "../../../Firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import { setNotice } from "../../../Store/noticeSlice";
import Notice from "../../Notice";
import AddNotification from "../../../Utils/NotificationUtils";

const LeaveCreation = ({ closeModal }: { closeModal?: () => void }) => {
    type dataType = {
        start?: Date,
        end?: Date,
        reason?: string,
        type?: string,
        daysCount: number,
        daysLeft: number
        lop: number
    }
    const [Data, setData] = useState<dataType>({ daysCount: 0, daysLeft: 0,lop:0 })
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user)
    const leaves = useSelector((state: any) => state.leavesData.userLeaves)
    const Type = useSelector((state: any) => state.leavesData.leavesTypes)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!Data.start || !Data.end || !Data.reason || !Data.type) {
            dispatch(setNotice({ name: 'LeaveApplication', msg: 'Fill all fields.', code: 1, time: 3000 }))
        }
        else {
            try {
                const response = await firestore.collection('leaves').add({
                    start: Data?.start,
                    end: Data?.end,
                    reason: Data?.reason,
                    type: Data?.type,
                    user_id: user.id,
                    status: 'pending',
                    timestamp: Timestamp.now()
                })
                if (response) {
                    dispatch(setNotice({ name: 'LeaveApplication', msg: 'Leave application send successfully', code: 3, time: 3000 }));
                    AddNotification(`Leave application.`, user?.id, `${user?.name} applied for leave. Check and varify.`, `leaves/?id=${response.id}`, 'leave')
                    setTimeout(() => {
                        closeModal?.();
                    }, 3000)
                }
            }
            catch (error: any) {
                dispatch(setNotice({ name: 'LeaveApplication', msg: error.message, code: 1 }));
            }
        }
    }
    useMemo(() => {
        if (Data.start && Data.end) {
            const timeDiff = Math.abs(Data.end.getTime() - Data.start.getTime());
            const count = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            setData({ ...Data, daysCount: count })
        }
    }, [Data.start, Data.end])

    useMemo(() => {
        if (Data.type) {
            const values = Type.find((item: any) => item.id == Data.type)
            let takenLeaves = 0;
            leaves?.filter((leave: any) => (leave.type == Data.type && leave.status == 'approved')).map((item: any) => {
                const startTime = new Date(item.start).getTime();
                const endTime = new Date(item.end).getTime();
                const count = Math.abs(endTime - startTime);
                takenLeaves = takenLeaves + Math.ceil(count / (1000 * 3600 * 24)) + 1;
            })
            let count = values?.count - takenLeaves - Data.daysCount
            let lop = 0;
            if (count < 0) {
                lop = Math.abs(count);
                count = 0;
            }
            setData({ ...Data, daysLeft: count, lop })
        }
    }, [Data.type, Data.daysCount])

    console.log(leaves);

    return (
        <div >
            <div className="fixed inset-0 grid overflow-y-auto	py-5 items-center justify-center z-50 bg-[#0000008c]">
                <div className="bg-white p-8  rounded shadow-md relative ">
                    <button
                        className="mt-4 bg-black rounded-full text-xs absolute right-2 top-1 text-white font-bold py-1 px-2 "
                        onClick={closeModal}
                    >
                        X
                    </button>
                    <h1 className="text-2xl font-bold  mb-5">Leave Application</h1>
                    <Notice typeProp="LeaveApplication" />
                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="mb-4">
                            <select
                                className="border w-full border-gray-300 p-2 rounded"
                                onChange={(e) => setData({ ...Data, type: e.target.value })}
                            >
                                <option>Type of leave</option>
                                {Type?.map((item: any, index: number) => {
                                    return <option key={index} value={item?.id}>{item.title}</option>
                                })
                                }
                            </select>
                        </div>
                        <div className="flex space-x-3">
                            <div className="mb-4">
                                <label className="block font-semibold mb-1">Start Date:</label>
                                <input
                                    type="date"
                                    className="border w-full border-gray-300 p-2 rounded"
                                    max={Data.end?.toLocaleDateString('fr-ca')}
                                    onChange={(e) => setData({ ...Data, start: new Date(e.target.value) })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-1">End Date:</label>
                                <input
                                    type="date"
                                    className="border w-full border-gray-300 p-2 rounded"
                                    min={Data.start?.toLocaleDateString('fr-ca')}
                                    onChange={(e) => setData({ ...Data, end: new Date(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Reason for Leave:</label>
                            <textarea
                                className="border w-full border-gray-300 p-2 rounded"
                                defaultValue={Data?.reason}
                                onChange={(e) => setData({ ...Data, reason: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">No.of days: {Data.daysCount}</label>
                            < label className="block font-semibold mb-1">Leaves remaining: {Data.daysLeft}</label>
                            {Data?.lop>0 &&
                                < label className="block font-semibold mb-1">Loss of pay: {Data.lop}</label>
                            }
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-defaultBg w-full text-white py-2 px-5 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    )
}
export default LeaveCreation