import { useState, useEffect } from "react"
import ProgressCircle from "../../Graphs/ProgressCircle"
import PieCharts from "../../Graphs/PieCharts"

const ProgressBanner = ({ data, types }: any) => {
    const [ProgressData, setProgressData] = useState<{ [key: string]: any }>()
    useEffect(() => {
        const today = new Date();

        const todayLeaves: number = data?.filter((doc: any) => {
            const dateObj = new Date(doc.start?.seconds * 1000);
            const dateEndObj = new Date(doc.end?.seconds * 1000);
            return dateObj.getDate() <= today.getDate() &&
                dateObj.getFullYear() <= today.getFullYear() &&
                dateObj.getMonth() <= today.getMonth() &&
                dateEndObj.getDate() >= today.getDate() &&
                dateEndObj.getFullYear() >= today.getFullYear() &&
                dateEndObj.getMonth() >= today.getMonth()
        })?.length;

        const currentMonthLeaves: number = data?.filter(
            (doc: any) => {
                const dateObj = new Date(doc.start?.seconds * 1000);
                const dateEndObj = new Date(doc.end?.seconds * 1000);
                return dateObj.getFullYear() <= today.getFullYear() &&
                    dateObj.getMonth() <= today.getMonth() &&
                    dateEndObj.getFullYear() >= today.getFullYear() &&
                    dateEndObj.getMonth() >= today.getMonth()
            }
        )?.length;

        let yearlyData:any = {};
        data?.filter((doc: any) => {
            const dateObj = new Date(doc.start?.seconds * 1000);
                const dateEndObj = new Date(doc.end?.seconds * 1000);
                return dateObj.getFullYear() <= today.getFullYear() &&
                    dateEndObj.getFullYear() >= today.getFullYear() 
            }
        ).map((docs:any)=>{
            const docType =types?.find((type: any) => type.id === docs.type)?.title
            yearlyData={...yearlyData,[docType]:(yearlyData[docType]||0)+1}
        });

        setProgressData({ todayLeaves, currentMonthLeaves, yearly:yearlyData })

    }, [data])
    console.log(ProgressData)
    return (
        <div className="flex space-x-3">
            <div className='w-4/12 border h-max  rounded-lg p-4 flex flex-wrap  justify-around items-center bg-white'>
                <h2 className=" pb-2 text-base font-bold flex justify-between items-center w-full">
                    Today's Leaves
                </h2>
                <div className="flex justify-between items-center w-full ml-0">
                    <ProgressCircle
                        text=''
                        value={ProgressData?.todayLeaves}
                        height='120px'
                    />
                    <div className=' h-max text-[14px] '>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-two before:block flex'>
                            {ProgressData?.todayLeaves} Absent
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-4/12 border h-max  rounded-lg p-4 flex flex-wrap  justify-around items-center bg-white'>
                <h2 className=" pb-2 text-base font-bold flex justify-between items-center w-full">
                    Current month leaves
                </h2>
                <div className="flex justify-between items-center w-full ml-0">
                    <ProgressCircle
                        text=''
                        value={ProgressData?.currentMonthLeaves}
                        height='120px'
                        pathColor="#c4975B"
                    />
                    <div className=' h-max text-[14px] '>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-one before:block flex'>
                            {ProgressData?.currentMonthLeaves} On-leave
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-4/12 border h-max  rounded-lg p-4 flex flex-wrap  justify-around items-center bg-white'>
                <h2 className=" pb-2 text-base font-bold flex justify-between items-center w-full">
                    This year overview
                </h2>
                <div className="flex justify-between items-center w-full ml-0 h-[120px]">
                    <PieCharts
                    data= {ProgressData?.yearly}
                    />
                </div>
            </div>
        </div>
    )
}
export default ProgressBanner