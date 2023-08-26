import { useMemo } from "react";
import {useState} from 'react'
import { useSelector } from "react-redux"

const LeavesList = () => {
    const leaves = useSelector((state: any) => state.leavesData.userLeaves)
    const Type = useSelector((state: any) => state.leavesData.leavesTypes)
    const [sort, setSort] = useState()
    // const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     e.currentTarget.value
    // }
    const leavesData = useMemo(() => {
        let sortedArray = [...leaves]?.sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp));
        if(sort == 'leaveDate'){
            sortedArray = [...sortedArray.sort((a: any, b: any) => a.start.localeCompare(b.start))];
            return sortedArray
        }
        else if(sort == 'status'){
            sortedArray = [...sortedArray.sort((a: any, b: any) => a.status.localeCompare(b.status))];
            return sortedArray
        }
        
        return sortedArray;

    }, [leaves,sort])

    return (
        <div className='container mt-5'>
            <table className="mx-auto w-full overflow-hidden border text-center border-gray-300 ">
                <thead>
                    <tr className=" bg-color-one flex px-2 text-defaultBg ">
                        <th className="p-2 w-full">Date</th>
                        <th className="p-2 w-full">Leave type</th>
                        <th className="p-2 w-full">From</th>
                        <th className="p-2 w-full">To</th>
                        <th className="p-2 w-full">No.of days</th>
                        <th className="p-2 w-full">Reason</th>
                        <th className="p-2 w-full">Status</th>
                    </tr>
                </thead>
                <tbody className=" bg-color-three/30  max-h-[220px] block overflow-y-auto w-full">
                    {leavesData?.length === 0 ?
                        (
                            <tr className="flex">
                                <td colSpan={12} className="w-full p-4 text-center text-gray-500">
                                    No leave records available
                                </td>
                            </tr>
                        )
                        :
                        leavesData?.map((leave: any, index: number) => {
                            const start = new Date(leave.start).toLocaleDateString('en-GB');
                            const end = new Date(leave.end).toLocaleDateString('en-GB');
                            const date = new Date(leave.timestamp).toLocaleDateString('en-GB');
                            let statusColor = 'bg-[#bfa7f9]'
                            if (leave.status == 'approved') {
                                statusColor = 'bg-emerald-900'
                            }
                            else if (leave.status == 'rejected') {
                                statusColor = 'bg-rose-900'
                            }
                            return <tr key={index} className="border-t flex py-2 px-2 border-gray-300 text-sm">

                                <td className="p-2 w-full">{date}</td>
                                <td className="p-2 w-full">{Type?.find((item: any) => item.id === leave.type)?.title}</td>
                                <td className="p-2 w-full">{start}</td>
                                <td className="p-2 w-full">{end}</td>
                                <td className="p-2 w-full">{leave.count}</td>
                                <td className="p-2 w-full">{leave.reason}</td>
                                <td className={`p-2 w-full text-white font-bold rounded-xl ${statusColor}`}>{leave.status}</td>
                            </tr>
                        })

                    }
                </tbody>
            </table>
            <div className="py-1 flex justify-end  bg-color-one/70">
                <select name="tableMonth"
                    onChange={(e:any)=>{setSort(e.currentTarget.value)}}
                    className="border w-2/12 min-w-max border-defaultBg  font-semibold text-defaultBg mr-2 p-2 rounded bg-transparent text-xs h-max"
                >
                    <option>Sort</option>
                    <option value='date'>Application date</option>
                    <option value='leaveDate'>Starting date</option>
                    <option value='status'>Status</option>
                </select>
            </div>
        </div>
    )
}
export default LeavesList