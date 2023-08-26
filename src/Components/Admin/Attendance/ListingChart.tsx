import AreaCharts from "../../Graphs/AreaCharts"
import { useEffect, useRef, useState } from "react"

const ListingChart = (props: { data: any }) => {
    // const [data, setData] = useState<any>([]);
    const optionRef = useRef<HTMLSelectElement>(null);
    let month = new Date().getMonth();
    let monthZeroPrefix = String(month);
    if (month < 10) {
        monthZeroPrefix = '0' + month;
    }
    let year = new Date().getFullYear();
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let chartTitle: string = monthName[month] + ' ' + year;
    const [chartData, setChartData] = useState<any>({ data: [], title: chartTitle, customFilter: false });



    useEffect(() => {
        
                let processedData: any = {};
                props?.data?.filter((datavalue: any) => {
                    const dateObj = new Date(datavalue?.time_in?.seconds * 1000);
                    return dateObj.getMonth() === month;
                }).map((res: any) => {
                    const dateObjInData = new Date(res?.time_in?.seconds * 1000);
                    const dayInData = dateObjInData.getDate();
                    processedData[dayInData] = (processedData[dayInData] || 0) + 1;
                    return { name: dayInData };
                });
                const filteredData = Object.keys(processedData).map(name => ({
                    name: name,
                    uv: processedData[name].toString(),
                }));
                setChartData({ ...chartData, data: filteredData });
            

    }, [])

    console.log(chartData)

    const handleChartFilter = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { value, name } = e.currentTarget;
        let processedData: any = {};
        if (value == 'prevMonth') {
            props?.data?.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in.seconds * 1000);
                if (month !== 0)
                    return dateObj.getMonth() === month - 1
                else
                    return dateObj.getMonth() === 11
            }).map((res: any) => {
                const dateObjInData = new Date(res?.time_in?.seconds * 1000);
                const dayInData = dateObjInData.getDate();
                processedData[dayInData] = (processedData[dayInData] || 0) + 1;
                return { name: dayInData };
            });
            const filteredData = Object.keys(processedData).map(name => ({
                name: name,
                uv: processedData[name].toString(),
            }));

            if (month !== 0) {
                chartTitle = monthName[month - 1] + ' ' + year
            } else {
                chartTitle = monthName[11] + ' ' + (year - 1)
            };
            setChartData({ title: chartTitle, data: filteredData, customFilter: false })
        }
        else if (value == 'thisMonth' || value == 'chooseDate') {
            props?.data?.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in?.seconds * 1000);
                return dateObj.getMonth() === month;
            }).map((res: any) => {
                const dateObjInData = new Date(res?.time_in?.seconds * 1000);
                const dayInData = dateObjInData.getDate();
                processedData[dayInData] = (processedData[dayInData] || 0) + 1;
                return { name: dayInData };
            });
            const filteredData = Object.keys(processedData).map(name => ({
                name: name,
                uv: processedData[name].toString(),
            }));
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

            props?.data?.filter((datavalue: any) => {
                const dateObj = new Date(datavalue?.time_in.seconds * 1000);
                return dateObj.getMonth() === Number(extractedNumber)
            }).map((res: any) => {
                const dateObjInData = new Date(res?.time_in?.seconds * 1000);
                const dayInData = dateObjInData.getDate();
                processedData[dayInData] = (processedData[dayInData] || 0) + 1;
                return { name: dayInData };
            });
            const filteredData = Object.keys(processedData).map(name => ({
                name: name,
                uv: processedData[name].toString(),
            }));
            setChartData({ title: ariaLabel, data: filteredData, customFilter: true })
        }
        else {
            setChartData({ title: 'Choose any options to view attendance ' })
        }
    }

    const getAttendenceMonths = () => {
        const uniqueDates: any = {};
        const filteredData = props?.data?.filter((res: any) => {
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
    return (
        <div className=" my-3 border flex-col flex justify-between rounded-lg p-4 bg-white">
            <div className="ml-2 flex items-center w-full justify-between">
                <p className=" text-color-two font-bold justify-self-end w-max">{chartData.title} overview</p>
                <div className="mr-0">
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
            <small className="ml-6">Count X Date</small>

            <div className="h-[350px] ">
                <AreaCharts fill="#c4975B" values={chartData.data} />
            </div>
        </div>
    )
}
export default ListingChart