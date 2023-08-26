import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react";


const LeaveCalender = ({ data, users, types }: any) => {
    const [Filter, setFilter] = useState('today')
    const [sortedData, setSortedData] = useState<any[]>([]);
    const dateRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        console.log(Filter)
        const value = dateRef?.current?.value;
        if (Filter == 'tomorrow') {

            const filteredData = data?.filter((doc: any) => {
                const tomorrow = new Date().setDate(new Date().getDate() + 1);
                const dateObj = new Date(doc.start?.seconds * 1000);
                const dateEndObj = new Date(doc.end?.seconds * 1000);
                return dateObj.getDate() <= new Date(tomorrow).getDate() &&
                    dateObj.getFullYear() <= new Date(tomorrow).getFullYear() &&
                    dateObj.getMonth() <= new Date(tomorrow).getMonth() &&
                    dateEndObj.getDate() >= new Date(tomorrow).getDate() &&
                    dateEndObj.getFullYear() >= new Date(tomorrow).getFullYear() &&
                    dateEndObj.getMonth() >= new Date(tomorrow).getMonth()
            })
            setSortedData(filteredData)
        }
        else if (Filter == 'today') {
            const today = new Date()
            const filteredData = data?.filter((doc: any) => {
                const dateObj = new Date(doc.start?.seconds * 1000);
                const dateEndObj = new Date(doc.end?.seconds * 1000);
                return dateObj.getDate() <= today.getDate() &&
                    dateObj.getFullYear() <= today.getFullYear() &&
                    dateObj.getMonth() <= today.getMonth() &&
                    dateEndObj.getDate() >= today.getDate() &&
                    dateEndObj.getFullYear() >= today.getFullYear() &&
                    dateEndObj.getMonth() >= today.getMonth()
            })
            setSortedData(filteredData)
            
        }
        else {
            const filteredData = data?.filter((doc: any) => {
                const selDate = new Date(Filter);
                const dateObj = new Date(doc.start?.seconds * 1000);
                const dateEndObj = new Date(doc.end?.seconds * 1000);
                return dateObj.getDate() <= selDate.getDate() &&
                    dateObj.getFullYear() <= selDate.getFullYear() &&
                    dateObj.getMonth() <= selDate.getMonth() &&
                    dateEndObj.getDate() >= selDate.getDate() &&
                    dateEndObj.getFullYear() >= selDate.getFullYear() &&
                    dateEndObj.getMonth() >= selDate.getMonth()
            })
            setSortedData(filteredData)
        }
    }, [data, Filter,dateRef])


    return (
        <div className="px-8 pt-4 pb-7  w-full bg-white overflow-hidden rounded-lg shadow-md items-center justify-between mb-4">
            <h2 className=" pb-2 text-2xl font-bold flex justify-between items-center">
                Leave calendar
            </h2>
            <div className="mr-0 ">
                <button
                    onClick={() => { setFilter('today') }}
                    className={` ${Filter === 'today' ? 'bg-defaultBg text-white' : 'bg-white text-defaultBg'} border w-max border-defaultBg font-semibold mr-2 py-1 px-4 rounded-2xl text-sm h-max`}

                >
                    Today
                </button>
                <button
                    onClick={() => { setFilter('tomorrow') }}
                    className={` ${Filter === 'tomorrow' ? 'bg-defaultBg text-white' : 'bg-white text-defaultBg'} border w-max border-defaultBg font-semibold mr-2 py-1 px-4 rounded-2xl text-sm h-max`}
                >
                    Tomorrow
                </button>
                <input
                    type="date"
                    ref={dateRef}
                    onChange={(e) => { setFilter(e.currentTarget.value) }}
                    className={` ${Filter === 'custom' ? 'bg-defaultBg text-white' : 'bg-white text-defaultBg'} border w-max border-defaultBg font-semibold mr-2 py-1 px-4 rounded-2xl text-sm h-max`}
                />
            </div>
            <ul className="mt-4">
                {
                    sortedData?.length === 0 ? (
                        <div className="flex items-center">
                            <p className="text-red-700">No leave records exist for the day</p>
                        </div>
                    ) : (
                        sortedData?.map((leave: any) => {
                            let bgColor = (leave.status == 'rejected') ? `bg-color-three` : `bg-defaultBg`;
                            return <li className=" mb-2 py-2 bg-gray-100 px-5 rounded-xl">
                                <Link to={'./?id=' + leave.id} className="flex w-full justify-between items-center">
                                    <p className="font-bold">
                                        {
                                            users.find((user: any) => user.id === leave.user_id)
                                                .name
                                        }
                                        <br />
                                        <span className="text-xs font-semibold text-gray-500 border-r border-gray-300 pr-1 mr-1">
                                            {
                                                types?.find((type: any) => type.id === leave.type)?.title
                                            }
                                        </span>

                                        <span className="text-sm font-semibold text-gray-500">
                                            {new Date(leave.start?.seconds * 1000).toLocaleString('en-GB', { month: 'short', day: '2-digit' })}
                                            {' to '}
                                            {new Date(leave.end?.seconds * 1000).toLocaleString('en-GB', { month: 'short', day: '2-digit' })}
                                        </span>
                                    </p>
                                    <button

                                        className={bgColor + ` text-white text-center py-1 px-5 min-w-[115px] h-max rounded-2xl font-semibold uppercase text-sm`}
                                    >
                                        {leave.status}
                                    </button>
                                </Link>
                            </li>
                        })

                    )}
            </ul>
        </div>
    )
}
export default LeaveCalender