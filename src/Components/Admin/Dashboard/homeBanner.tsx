import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmployeeUploadForm from '../EmployeeUploadForm';
import { delNotice } from '../../../Store/noticeSlice';

const HomeBanner = () => {
    const [ShowForm, setShowForm] = useState(false)
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    return (
        <section className='bg-defaultBg  py-10'>
            <div className='container flex justify-between'>
                <div>
                    <h2 className='text-amber-100 text-xl font-normal  capitalize'>Hello {user.name},</h2>
                    <h1 className=' text-3xl text-amber-100 font-thin'>Good morning</h1>
                </div>
                <button className='defaultstyle' onClick={() => { setShowForm(true) }}><span className='text-2xl font-bold  leading-6'>+</span>Add Employee</button>
            </div>
            {ShowForm &&
                <EmployeeUploadForm
                    closeModal={() => {
                        dispatch(delNotice('addEmployee'))
                        setShowForm(false)
                    }}
                />
            }
        </section>
    )
}
export default HomeBanner