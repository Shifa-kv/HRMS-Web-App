import Header from "../../Components/User/Header"
import image from '../../Assets/images/user.jpg'
import { useDispatch, useSelector } from 'react-redux';
import Myprofile from "../../Components/User/Profile/Myprofile";

const Profile = () => {
    const User = useSelector((state: any) => state.user);
    let statusColor = 'bg-green-600';


    return (
        <section>
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between'>
                    <div className='flex items-center space-x-2 capitalize text-gray-400'>
                        <div className='relative w-max m-auto'>
                            <img src={image} alt={User.name} className="w-24 h-24 rounded-full mx-auto mb-2" />
                            <span className={`${statusColor} w-4 h-4 block absolute top-0 right-4 border-2 m-auto rounded-full`}></span>
                        </div>
                        <div>
                            <p className=' w-max bg-color-one text-black px-2 rounded-md text-xs'>{User.e_id}</p>

                            <h1 className=' text-3xl text-amber-100 font-thin'>{User.name}</h1>

                            <p>{User.role}</p>
                            <p>{User.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Myprofile />
        </section>
    )
}
export default Profile