import CalculatePercentage from "../../../Utils/CalculatePercentage"
import ProgressCircle from "../../Graphs/ProgressCircle"
import { useEffect, useState } from "react"

const ProgressBanner = (props: { data: any, users: any }) => {
    const [ProgressData, setProgressData] = useState<{ [key: string]: any }>()
    useEffect(() => {
        const todayPresents: number = props.data?.filter(
            (doc: any) => doc?.theDate === new Date().toLocaleDateString()
        )?.length;
        const todayLeaves: number = props.users?.length - todayPresents;
        const currentMonthPresents: number = props.data?.filter(
            (doc: any) => {
                return new Date(doc.time_in?.seconds * 1000).getMonth() === new Date().getMonth()
                    &&
                    new Date(doc.time_in?.seconds * 1000).getFullYear() === new Date().getFullYear()
            }
        )?.length;


        const thisMonthCheckin = props.data?.filter((doc: any) => {
            const timeInDate = new Date(doc.time_in?.seconds * 1000);
            return (
                timeInDate.getMonth() === new Date().getMonth() &&
                timeInDate.getFullYear() === new Date().getFullYear() &&
                timeInDate.getHours() <= 9
            );
        }).length || 0

        setProgressData({ todayPresents, todayLeaves, currentMonthPresents, thisMonthCheckin })

    }, [props.data])

    function getWorkingDaysInMonth(): number {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        let workingDays = 0;

        for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
            const dayOfWeek = day.getDay(); // 0 (Sunday) to 6 (Saturday)
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                workingDays++;
            }
        }
        return workingDays;
    }


    return (
        <div className="flex space-x-3">
            <div className='w-4/12 border h-max  rounded-lg p-4 flex flex-wrap  justify-around items-center bg-white'>
                <h2 className=" pb-2 text-base font-bold flex justify-between items-center w-full">
                    Today's attendance
                </h2>
                <div className="flex justify-between items-center w-full ml-0">
                    <ProgressCircle
                        text={props.users?.length}
                        value={
                            CalculatePercentage(
                                ProgressData ? ProgressData.todayLeaves : 0,
                                props.users?.length
                            )
                        }
                        height='120px'
                    />
                    <div className=' h-max text-[14px] '>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-two before:block flex'>
                            {ProgressData ? ProgressData.todayLeaves : 0} Absent
                        </p>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-defaultBg before:block flex'>
                            {ProgressData?.todayPresents} Present
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-4/12 border h-max  rounded-lg p-4 flex flex-wrap  justify-around items-center bg-white'>
                <h2 className=" pb-2 text-base font-bold flex justify-between items-center w-full">
                    Current month attendance
                </h2>
                <div className="flex justify-between items-center w-full ml-0">
                    <ProgressCircle
                        text={getWorkingDaysInMonth()*props.users?.length}
                        value={
                            CalculatePercentage(
                                getWorkingDaysInMonth()*props.users?.length - (ProgressData ? ProgressData.currentMonthPresents : 0),
                                getWorkingDaysInMonth()*props.users?.length
                            )
                        }
                        height='120px'
                        pathColor="#c4975B"
                    />
                    <div className=' h-max text-[14px] '>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-one before:block flex'>
                            {getWorkingDaysInMonth()*props.users?.length - (ProgressData ? ProgressData.currentMonthPresents : 0)} On-leave
                        </p>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-defaultBg before:block flex'>
                            {ProgressData?.currentMonthPresents} Present
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-4/12 border h-max  rounded-lg p-4 flex flex-wrap  justify-around items-center bg-white'>
                <h2 className=" pb-2 text-base font-bold flex justify-between items-center w-full">
                    Current month check-in
                </h2>
                <div className="flex justify-between items-center w-full ml-0">
                    <ProgressCircle
                        text={ProgressData?.currentMonthPresents}
                        value={
                            CalculatePercentage(
                                ProgressData?ProgressData?.currentMonthPresents - ProgressData.thisMonthCheckin : 0,
                                ProgressData?.currentMonthPresents
                            )
                        }
                        height='120px'
                        pathColor="#f3bdaa"
                    />
                    <div className=' h-max text-[14px] '>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-three before:block flex'>
                            After 10AM
                        </p>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-defaultBg before:block flex'>
                            Before 10AM
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProgressBanner