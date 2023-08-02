import {  useSelector } from 'react-redux';
import CheckinButton from './CheckinButton';

const Banner = () => {
    const user = useSelector((state: any) => state.user);
    
    
    return (
        <section className='bg-defaultBg   py-10'>
            <div className='container flex justify-between'>
                <div>
                    <h2 className='text-amber-100 text-xl font-normal  capitalize'>Hello {user.name},</h2>
                    <h1 className=' text-3xl text-amber-100 font-thin'>Good morning</h1>
                </div>
                <CheckinButton />
            </div>
            
        </section>
    )
}
export default Banner