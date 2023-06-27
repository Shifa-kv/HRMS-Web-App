import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EmployeeUploadForm from './EmployeeUploadForm';

const HomeBanner = () => {
    const [ShowForm, setShowForm] = useState(false)
    const user = useSelector((state: any) => state.user);

    return (
        <section className='bg-defaultBg  py-10'>
            <div className='container flex justify-between'>
                <div>
                    <h2 className='text-amber-100 text-xl font-normal  capitalize'>Hello {user.uname},</h2>
                    <h1 className=' text-3xl text-amber-100 font-thin'>Good morning</h1>
                </div>
                <button className='defaultstyle' onClick={() => { setShowForm(true) }}><span className='text-2xl font-bold  leading-6'>+</span>Add Employee</button>
            </div>
            {ShowForm && <EmployeeUploadForm closeModal={() => setShowForm(false)} />}
        </section>
    )
}
export default HomeBanner