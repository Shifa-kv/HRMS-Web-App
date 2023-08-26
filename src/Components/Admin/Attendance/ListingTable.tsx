import { Link } from "react-router-dom";
import { useEffect, useState } from "react"

const ListingTable = (props: { data: any, users: any }) => {
    const [TableFilter, setTableFilter] = useState<any>({});
    const [sortedTableData, setSortedTableData] = useState<any[]>([]);

    let month = new Date().getMonth();
    let monthZeroPrefix = String(month);
    if (month < 10) {
        monthZeroPrefix = '0' + month;
    }

    const getTotalHours = (datavalue: any) => {
        const dateObjInData = new Date(datavalue?.time_in?.seconds * 1000);
        const isToday = new Date().toLocaleDateString() === dateObjInData.toLocaleDateString();
        let TimeoutInData: Date;

        if (datavalue?.time_out) {
            TimeoutInData = new Date(datavalue?.time_out.seconds * 1000);
        } else if (isToday) {
            TimeoutInData = new Date();
        } else {
            const newDateObj = new Date(dateObjInData);
            TimeoutInData = new Date(newDateObj.setHours(23, 59, 0, 0));
        }
        let workHours = TimeoutInData.getHours() - dateObjInData.getHours();
        let workMinutes = TimeoutInData.getMinutes() - dateObjInData.getMinutes();
        // Correct calculation for workMinutes
        if (workMinutes < 0) {
            workHours -= 1;
            workMinutes += 60;
        }
        const totalHours = (workHours + workMinutes / 60).toFixed(2);
        return totalHours
    };



    const handleTableFilter = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { value, name } = e.currentTarget;
        setTableFilter({ ...TableFilter, [name]: value })
    }
    useEffect(() => {
        if (TableFilter?.tableUser && TableFilter?.tableDate) {
            const filteredData = props.data.filter((datavalue: any) => (
                datavalue.employee_id === TableFilter.tableUser &&
                datavalue.time_in &&
                isDateEqualToFilter(datavalue.time_in, TableFilter.tableDate)
            ));
            setSortedTableData(filteredData)
        } else if (TableFilter?.tableUser) {
            const filteredData = props.data.filter((datavalue: any) => datavalue.employee_id === TableFilter.tableUser);
            setSortedTableData(filteredData)
        } else if (TableFilter?.tableDate) {
            const filteredData = props.data.filter((datavalue: any) => datavalue.time_in && isDateEqualToFilter(datavalue.time_in, TableFilter.tableDate));
            setSortedTableData(filteredData)
        }
        else {
            const filteredData = props.data.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in.seconds * 1000).toLocaleDateString();
                return dateObj === new Date().toLocaleDateString()
            })
            setSortedTableData(filteredData)
        }

    }, [props.data, TableFilter]);

    function isDateEqualToFilter(time_in: any, filterDate: string) {
        const dateObj = new Date(time_in.seconds * 1000);
        const year = String(dateObj.getFullYear());
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}` === filterDate;
    }


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden my-5">
            <h2 className="px-8 py-2 text-2xl font-bold bg-defaultBg text-white flex justify-between items-center">
                Attendance Table
            </h2>

            <table className="mx-auto w-full overflow-hidden border text-center border-gray-300 ">
                <thead>
                    <tr className=" bg-color-one flex text-defaultBg  justify-evenly">
                        <th className="p-2 w-full text-center ">Employee</th>
                        <th className="p-2 w-full text-center ">Date</th>
                        <th className="p-2 w-full text-center">Check in</th>
                        <th className="p-2 w-full text-center">Check out</th>
                        <th className="p-2 w-full text-center">Total Hours</th>
                    </tr>
                </thead>
                <tbody className=" bg-color-three/30  max-h-[220px] block overflow-y-scroll w-full">
                    {props.data &&
                        sortedTableData?.length === 0 ? (
                        <tr className="flex">
                            <td colSpan={12} className="w-full p-4 text-center text-gray-500">
                                No attendance records available
                            </td>
                        </tr>
                    ) : (
                        sortedTableData?.sort((a: any, b: any) => b.time_in - a.time_in).map((item: any, index: number) => {
                            let time_in = new Date(item?.time_in?.seconds * 1000).toLocaleTimeString();
                            let item_date = new Date(item?.time_in?.seconds * 1000).toLocaleDateString();
                            let time_out = item?.time_out && new Date(item?.time_out?.seconds * 1000).toLocaleTimeString();
                            return (
                                <tr key={index} className="border-t flex justify-evenly border-gray-300 text-sm">
                                    <td className="p-2 w-full text-center text-color-one">
                                        <Link to={'../employees/view/' + item?.employee_id}>
                                            {
                                                props.users?.find((user: any) => user.id === item.employee_id)?.name
                                            }
                                        </Link>
                                    </td>
                                    <td className="p-2 w-full text-center">{item_date}</td>
                                    <td className="p-2 w-full text-center">{time_in}</td>
                                    <td className="p-2 w-full text-center">{time_out}</td>
                                    <td className="p-2 w-full text-center">{getTotalHours(item)} Hours</td>
                                </tr>
                            );
                        })
                    )}

                </tbody>

            </table>
            <div className="py-1 flex justify-end  bg-color-one/70">
                <select name="tableUser"
                    onChange={handleTableFilter}
                    className="border w-2/12 min-w-max border-defaultBg  font-semibold text-defaultBg mr-2 p-2 rounded bg-transparent text-xs h-max"
                >
                    <option value=''>Employee</option>
                    {props.users?.map((user: any, index: number) => {
                        return <option
                            key={index}
                            value={user.id}
                        >
                            {user.name}
                        </option>;
                    })}
                </select>
                <input type="date"
                    name="tableDate"
                    value={TableFilter.value}
                    onChange={handleTableFilter}
                    className="border w-2/12 min-w-max  border-defaultBg  font-semibold text-defaultBg mr-2 p-2 rounded bg-transparent text-xs h-max"
                />

            </div>
        </div>
    )
}
export default ListingTable