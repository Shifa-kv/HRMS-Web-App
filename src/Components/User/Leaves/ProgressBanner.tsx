import { FaCalendarMinus, FaNotesMedical, FaCalendarWeek, FaCalendarDay } from "react-icons/fa"
import ProgressCircle from "../../Graphs/ProgressCircle"
import { useEffect, useState } from "react"
import { firestore } from "../../../Firebase/Config"
import { useSelector } from "react-redux"

const ProgressBanner = () => {
    const leaves = useSelector((state: any) => state.leavesData.userLeaves)
    const Type = useSelector((state: any) => state.leavesData.leavesTypes)
    const [count, setCount] = useState({ annual: 0, sick: 0, casual: 0, other: 0, total: 0, lop: 0 });
    console.log(leaves)
    const getType = (type: string) => {
        const values = Type?.find((data: any) => data.title === type);
        return { count: values?.count, id: values?.id };
    }

    const getCount = (type: string) => {
        let takenLeaves = 0;
        leaves.filter((leave: any) => (leave.type == getType(type).id && leave.status == 'approved')).map((item: any) => {
            takenLeaves = takenLeaves + Math.ceil(item.count / (1000 * 3600 * 24)) + 1;
        })
        return getType(type).count - takenLeaves;
    }

    const getOtherLeaves = () => {
        let otherLeaves = 0;
        let otherLeavesTook = 0;
        const excludedTitles = ['Annual leave', 'Casual leave', 'Sick leave'];

        Type.filter((type: any) => !excludedTitles.includes(type.title))
            .map((type: any) => {
                otherLeaves = otherLeaves + Number(type?.count);
                leaves.filter((item: any) => type.id.includes(item.type) && item.status == 'approved')
                    .map((item: any) => {
                        otherLeavesTook = otherLeavesTook + Number(item?.count);
                    })
            })


        return {otherLeaves,otherLeavesTook}
    }

    useEffect(() => {
        leaves.filter((item: any) => item.typ)
        setCount({
            ...count,
            annual: getCount('Annual leave'),
            sick: getCount('Sick leave'),
            casual: getCount('Casual leave'),
        });
    }, [leaves])

    return (
        <div className='container bg-gradient-to-b from-defaultBg to-transparent'>
            <div className='flex space-x-6 justify-between'>
                <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
                    <FaCalendarWeek size={50} className=' overflow-visible bg-color-two text-defaultBg p-3 rounded-full' />
                    <h6>Annual leaves</h6>
                    <h3>{count.annual}<span className=' text-base'>/{getType('Annual leave').count}</span></h3>
                </div>
                <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
                    <FaNotesMedical size={50} className=' overflow-visible bg-color-one text-defaultBg p-3 rounded-full' />
                    <h6>Sick leaves</h6>
                    <h3>{count.sick}<span className=' text-base'>/{getType('Sick leave').count}</span></h3>
                </div>
                <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
                    <FaCalendarMinus size={50} className=' overflow-visible bg-stone-400 text-defaultBg p-3 rounded-full' />
                    <h6>Casual leaves</h6>
                    <h3>{count.casual}<span className=' text-base'>/{getType('Casual leave').count}</span></h3>
                </div>
                <div className='w-2/12 border border-defaultBg rounded-lg p-4 bg-white'>
                    <FaCalendarDay size={50} className=' overflow-visible bg-color-three text-defaultBg p-3 rounded-full' />
                    <h6>Other remining leaves</h6>
                    <h3>{getOtherLeaves().otherLeavesTook}/{getOtherLeaves().otherLeaves}</h3>
                </div>
                <div className='w-3/12 border h-max border-defaultBg rounded-lg p-4 flex space-x-4 justify-around items-center bg-white'>
                    <ProgressCircle text={20} value={20} height='107px' />
                    <div className=' h-max text-[14px] '>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-color-two before:block flex'>
                            Loss of pay
                        </p>
                        <p className='relative before:absolute before:left-[-12px] before:top-2 before:h-2 before:w-2 before:rounded-full before:p-[-10px] before:bg-defaultBg before:block flex'>
                            Total leaves
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default ProgressBanner