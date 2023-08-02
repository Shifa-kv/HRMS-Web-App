import { FaSign, FaTimesCircle } from "react-icons/fa"
import { FaCalendarXmark, FaClockRotateLeft, FaFile, FaSignal } from "react-icons/fa6"
import BarCharts from "../Graphs/BarCharts"
import { useEffect, useMemo, useRef, useState } from "react"
import { Timestamp, firestore } from "../../Firebase/Config"
import { useSelector } from "react-redux"


const AttendanceList = () => {
    const optionRef = useRef<HTMLSelectElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const user = useSelector((state: any) => state.user);
    const [data, setData] = useState<any>([]);
    const [TableFilter, setTableFilter] = useState<any>({});
    const date = new Date();
    let month = date.getMonth();
    let today = date.getDate();
    let monthZeroPrefix = String(month);
    if (month < 10) {
        monthZeroPrefix = '0' + month;
    }
    let year = date.getFullYear();
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let chartTitle: string = monthName[month] + ' ' + year;

    const [chartData, setChartData] = useState<any>({ data: [], title: chartTitle, customFilter: false });

    // return object in format that suits barcharts 
    const formatDate = (datavalue: any) => {
        const dateObjInData = new Date(datavalue?.time_in.seconds * 1000);
        const TimeoutInData = datavalue?.time_out
            ? new Date(datavalue?.time_out.seconds * 1000)
            : new Date();
        let dayInData = dateObjInData.getDate();
        let workHours = TimeoutInData.getHours() - dateObjInData.getHours();
        let workMinutes = TimeoutInData.getMinutes() - dateObjInData.getMinutes();
        // Correct calculation for workMinutes
        if (workMinutes < 0) {
            workHours -= 1;
            workMinutes += 60;
        }
        const totalHours = (workHours + workMinutes / 60).toFixed(2);
        return { uv: totalHours, name: dayInData }
    };

    useEffect(() => {
        firestore.collection("attendance")
            .where("employee_id", "==", user.id)
            .get().then((snapshot) => {
                const values = snapshot.docs.map((res) => {
                    const { time_in, time_out } = res.data();
                    return { time_in, time_out };
                })
                setData(values)
                return values
            }).then((values) => {
                const filteredData = values?.filter((datavalue: any) => {
                    const dateObj = new Date(datavalue?.time_in * 1000);
                    console.log('res',dateObj.getMonth(),month)
                    return dateObj.getMonth() === month
                }).map((res: any) => {
                    return formatDate(res);
                })
                setChartData({ ...chartData, data: filteredData })
            })

    }, [])

    const AttendanceData: any = (propData: any) => {
        const filteredData = propData.map((res: any) => {
            return formatDate(res);
        })
        // total attendance calculation
        const Total = filteredData.reduce((sum: number, item: any) => sum + Number(item.uv), 0).toFixed(2);
        // Total overtime calculation
        let Overtime: number = 0;
        filteredData.filter((value: any) => value.uv > 8).map((res: any) => {
            Overtime = Overtime + (Number(res.uv) - 8);
        })
        return { Total, Overtime }
    }

    const getAttendenceMonths = () => {
        const uniqueDates: any = {};
        const filteredData = data?.filter((res: any) => {
            const dateObj = new Date(res?.time_in.seconds * 1000);
            const monthYear = dateObj.getFullYear() + ' ' + monthName[dateObj.getMonth()];
            if (!uniqueDates[monthYear]) {
                uniqueDates[monthYear] = true;
                return true;
            }
            return false;
        })
        return filteredData
    }

    const handleChartFilter = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { value, name } = e.currentTarget;
        if (value == 'prevMonth') {
            const filteredData = data?.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in.seconds * 1000);
                if (month !== 0)
                    return dateObj.getMonth() === month - 1
                else
                    return dateObj.getMonth() === 11
            }).map((res: any) => formatDate(res))
            console.log(filteredData)
            if (month !== 0) {
                chartTitle = monthName[month - 1] + ' ' + year
            } else {
                chartTitle = monthName[11] + ' ' + (year - 1)
            };
            setChartData({ title: chartTitle, data: filteredData, customFilter: false })
        }
        else if (value == 'thisMonth' || value == 'chooseDate') {
            const filteredData = data?.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in.seconds * 1000);
                return dateObj.getMonth() === month
            }).map((res: any) => {
                return formatDate(res);
            })
            const customFilter = (value == 'chooseDate') ? true : false;
            typeof (customFilter) && setChartData({ title: chartTitle, data: filteredData, customFilter: customFilter })
        }
        else if (name == 'selectMonth') {
            //title for chart
            const selectedOption = optionRef.current?.selectedOptions[0];
            const ariaLabel = selectedOption?.getAttribute('aria-label');
            // get selected month
            const match = value.match(/^(\d+)-/);
            const extractedNumber = match ? match[1] : null;

            const filteredData = data?.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in.seconds * 1000);
                return dateObj.getMonth() === Number(extractedNumber)
            }).map((res: any) => {
                return formatDate(res);
            })
            setChartData({ title: ariaLabel, data: filteredData, customFilter: true })
        }
        else {
            setChartData({ title: 'Choose any options to view attendance ' })
        }
    }

    const handleTableFilter = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { value, name } = e.currentTarget;
        setTableFilter({ value, name })
        console.log(TableFilter)
    }

    const sortedTableData = useMemo(() => {
        if (TableFilter.name === 'tableMonth') {
            const match = TableFilter.value.match(/^(\d+)-/);
            const extractedNumber = match ? match[1] : null;

            const filteredData = data?.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in.seconds * 1000);
                return dateObj.getMonth() === Number(extractedNumber)
            })
            return filteredData
        }
        if (TableFilter.name === 'tableDate') {
            if (selectRef.current) {
                selectRef.current.value = "Month";
            }
            const filteredData = data?.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in.seconds * 1000);
                const year = String(dateObj.getFullYear());
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                console.log(`${year}-${month}-${day}`, TableFilter.value)
                return `${year}-${month}-${day}` == TableFilter.value;
            })
            return filteredData
        }
        return data;
    }, [data, TableFilter]);


    return (
        <div className='container  bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem]'>
            <div className="flex space-x-5">
                <div className="w-10/12 border flex-col flex justify-between border-defaultBg rounded-lg p-4 bg-white">
                    <div className="ml-2 flex items-center w-full justify-between">
                        <p className=" text-color-two font-bold justify-self-end w-max">{chartData.title} overview</p>
                        <div className="mr-3">
                            <select name="sort"
                                defaultValue='thisMonth'
                                onChange={handleChartFilter}
                                className="border w-max border-color-one text-defaultBg font-semibold mr-2 p-2 rounded bg-transparent text-sm h-max"
                            >
                                <option value='thisMonth'>Current month</option>
                                <option value='prevMonth'>Previous month</option>
                                <option value='chooseDate'>Choose a month</option>
                            </select>
                            {chartData.customFilter &&
                                <select name="selectMonth"
                                    ref={optionRef}
                                    className="border w-max border-color-one  font-semibold text-defaultBg mr-2 p-2 rounded bg-transparent text-sm h-max"
                                    onChange={handleChartFilter}
                                >
                                    {getAttendenceMonths()?.map((res: any, index: number) => {
                                        const dateObj = new Date(res?.time_in.seconds * 1000);
                                        const monthYear = dateObj.getFullYear() + ' ' + monthName[dateObj.getMonth()];
                                        const monthYearValue = (dateObj.getMonth()) + '-' + dateObj.getFullYear()
                                        return <option
                                            key={index}
                                            aria-label={monthYear}
                                            value={monthYearValue}>
                                            {monthYear}
                                        </option>;
                                    })}
                                </select>
                            }
                        </div>
                    </div>
                    <small className="ml-7">Hours X Date</small>

                    <div className="h-[350px] ">
                        <BarCharts values={chartData.data} />
                    </div>
                </div>
                <div className=' w-2/12 space-y-3'>
                    <div className=' border border-defaultBg rounded-lg p-4 bg-white'>
                        <FaSignal size={50} className='bg-color-two text-defaultBg p-3 rounded-full overflow-visible' />
                        <h6>Total attendance</h6>
                        <h3>{AttendanceData(data).Total}<small> Hours</small></h3>
                    </div>
                    <div className=' border border-defaultBg rounded-lg p-4 bg-white'>
                        <FaCalendarXmark size={50} className='bg-color-one text-defaultBg p-3 rounded-full overflow-visible' />
                        <h6>Total leaves</h6>
                        <h3>1</h3>
                    </div>
                    <div className=' border border-defaultBg rounded-lg p-4 bg-white'>
                        <FaClockRotateLeft size={50} className='bg-stone-400 text-defaultBg p-3 rounded-full overflow-visible' />
                        <h6>Total overtime</h6>
                        <h3>{AttendanceData(data).Overtime}<small> Hours</small></h3>
                    </div>
                </div>
            </div>
            <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden my-5">
                    <h2 className="px-8 py-2 text-2xl font-bold bg-defaultBg text-white flex justify-between items-center">
                        Attendance Table
                    </h2>

                    <table className="mx-auto w-full overflow-hidden border text-center border-gray-300 ">
                        <thead>
                            <tr className=" bg-color-one flex text-defaultBg ">
                                <th className="p-2 w-full ">Date</th>
                                <th className="p-2 w-full">Check in</th>
                                <th className="p-2 w-full">Check out</th>
                                <th className="p-2 w-full">Total Hours</th>
                            </tr>
                        </thead>
                        <tbody className=" bg-color-three/30  max-h-[220px] block overflow-y-scroll w-full">
                            {sortedTableData.length === 0 ?
                                (
                                    <tr className="flex">
                                        <td colSpan={12} className="w-full p-4 text-center text-gray-500">
                                            No attendance records available
                                        </td>
                                    </tr>
                                )
                                :
                                sortedTableData.sort((a: any, b: any) => b.time_in - a.time_in).map((item: any, index: number) => {
                                    let time_in = new Date(item?.time_in?.seconds * 1000).toLocaleTimeString();
                                    let item_date = new Date(item?.time_in?.seconds * 1000).toLocaleDateString();
                                    let time_out = item?.time_out && new Date(item?.time_out?.seconds * 1000).toLocaleTimeString();
                                    return <tr key={index} className="border-t flex border-gray-300 text-sm">
                                        <td className="p-2 w-full">{item_date}</td>
                                        <td className="p-2 w-full">{time_in}</td>
                                        <td className="p-2 w-full">{time_out}</td>
                                        <td className="p-2 w-full">{formatDate(item).uv} Hours</td>
                                    </tr>
                                })}
                        </tbody>
                        <tfoot className="bg-color-three/30 border-t border-color-one">
                            <tr className="flex justify-between py-2">
                                <td className="text-center w-3/12 font-semibold" colSpan={4}>
                                    Total attendance
                                </td>
                                <td className="text-center w-3/12" colSpan={1}>
                                    {AttendanceData(sortedTableData).Total} Hours
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="py-1 flex justify-end  bg-color-one/70">
                        <select name="tableMonth"
                            onChange={handleTableFilter}
                            ref={selectRef}
                            className="border w-2/12 min-w-max border-defaultBg  font-semibold text-defaultBg mr-2 p-2 rounded bg-transparent text-xs h-max"
                        >
                            <option>Month</option>
                            {getAttendenceMonths()?.map((res: any, index: number) => {
                                const dateObj = new Date(res?.time_in.seconds * 1000);
                                const monthYear = dateObj.getFullYear() + ' ' + monthName[dateObj.getMonth()];
                                const monthYearValue = (dateObj.getMonth()) + '-' + dateObj.getFullYear()
                                return <option
                                    key={index}
                                    aria-label={monthYear}
                                    value={monthYearValue}>
                                    {monthYear}
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
            </div>

        </div>
    )
}
export default AttendanceList