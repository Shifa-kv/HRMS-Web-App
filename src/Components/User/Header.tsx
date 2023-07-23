import Notice from "../Notice"
import image from "../../Assets/images/logo.png"
import { FaHouse, FaPeopleGroup, FaList, FaBarsProgress, FaSearchengin, FaBell, FaPerson } from "react-icons/fa6"
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import Logout from "../Logout";

const Header = () => {
    const user = useSelector((state: any) => state.user);

    return (
        <header className="bg-defaultBg text-amber-100 border-b  border-defaultBg-100 " >
            <div className="container py-2">
                <div className="flex justify-between items-center space-x-2">
                    <div className="w-2/12">
                        <img src={image} alt="logo" className="w-28" />
                    </div>
                    <div className="w-full">
                        <nav className="w-full">
                            <ul className="flex w-full gap-x-3 ">
                                <li className="flex px-3 py-1 rounded-2xl items-center hover:bg-defaultBg-100"><Link to='../' className="flex items-center"><FaHouse className="mr-2" /> Dashboard</Link></li>
                                <li className="flex px-3 py-1 rounded-2xl items-center hover:bg-defaultBg-100"><Link to='/user/profile' className="flex items-center"><FaPeopleGroup className="mr-2" /> Profile</Link></li>
                                <li className="flex px-3 py-1 rounded-2xl items-center hover:bg-defaultBg-100"><Link to='../' className="flex items-center"><FaList className="mr-2" /> Leaves</Link></li>
                                <li className="flex px-3 py-1 rounded-2xl items-center hover:bg-defaultBg-100"><Link to='../' className="flex items-center"><FaBarsProgress className="mr-2" />My Projects</Link></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="w-4/12 text-right relative">
                        <ul className="flex justify-end gap-x-1 ">
                            <li className="flex items-center">
                                <FaSearchengin size={25}
                                    className="mr-2 border border-defaultBg-100 rounded-full p-1 text-center bg-defaultBg-100"
                                /></li>
                            <li className="flex items-center">
                                <FaBell size={25}
                                    className="mr-2 border border-defaultBg-100 rounded-full p-1 text-center bg-defaultBg-100"
                                /></li>
                            <li className="flex group items-center capitalize rounded-full p-1 pr-3 text-center bg-defaultBg-100"
                                onClick={() => { }} >
                                <FaPerson size={25}
                                    className="mr-2 border border-defaultBg-100  rounded-full p-1 text-center bg-defaultBg-100"
                                />
                                {user.name}
                                
                        <div className="absolute top-full hidden right-0 pt-3 group-hover:block   bg-opacity-50 ">
                            <div className="bg-defaultBg text-left rounded p-4 px-5 block border-defaultBg-100 border">
                                <p><Link to='/user/profile'>My profile</Link></p>
                                <p><Link to='/'>Settings</Link></p>
                                <Logout />
                            </div>
                        </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Notice typeProp="homeNotice" />
        </header>
    )
}
export default Header