import { useEffect } from 'react'
import { FaCircleExclamation, FaRegCircleCheck } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/types';
import { delNotice } from '../Store/noticeSlice';

const Notice = ({ typeProp }: { typeProp: string }) => {
  const dispatch = useDispatch();
  const noticeStore = useSelector((state: RootState) => state.notice)
  const data = noticeStore?.data?.[typeProp];
  console.log(noticeStore?.data)

  let bgColor;
  if ((data?.code == 1)) {
    bgColor = 'bg-red-300';
  }
  else if (data?.code === 2) {
    bgColor = 'bg-orange-200'
  }
  else if (data?.code == 3) {
    bgColor = 'bg-green-200'
  }
  useEffect(() => {
    setTimeout(() => {
      dispatch(delNotice(typeProp));
    }, data?.time);
  }, [data?.time])

  return (
    <div className='noticeBoard'>
      {noticeStore?.status && data && (
        <div className={`${bgColor} p-4`}>
          <ul>
            {data?.message?.map((notice, index) => (
              <li key={index} className="mb-2 flex items-center">
                <span className="font-semibold mr-2 text-2xl">{data?.code == 3 ? <FaRegCircleCheck /> : <FaCircleExclamation />}</span>
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
export default Notice