import { useDispatch } from "react-redux";
import {useState} from 'react'
import { auth } from "../Firebase/Config";
import { useNavigate } from 'react-router-dom';
import { setNotice } from "../Store/noticeSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ShowLogoutWarning, setShowLogoutWarning] = useState(false)
  const userLogout = () => {
    auth.signOut().then(() => {
      dispatch(setNotice({ name: 'loginNotice', msg: 'Signout done! Login again.', code: 3, time: 3000 }))
      navigate("/");
    }).catch((error) => {
      console.log(error.errorMessage);
    });
  }
  return (
    <div>
      <button onClick={()=>{setShowLogoutWarning(true)}}>Logout</button>
    {
      ShowLogoutWarning &&
      <div>
          <div className="fixed inset-0 grid overflow-y-auto	py-5 items-center justify-center z-50 bg-[#0000008c]">
              <div className="bg-white p-8 rounded shadow-md relative " id='employeeFormPopup'>
                  <h1 className="text-2xl font-bold  mb-5 normal-case">Are you sure to Logout?</h1>

                  <div className='flex space-x-3 mb-3'>
                      <button className=' rounded-md m-auto border hover:bg-red-600 text-white w-full font-bold py-2 px-4  bg-red-700'
                          onClick={userLogout}
                      >Logout</button>
                      <button className='w-full rounded-md m-auto border border-color-one hover:bg-color-one hover:text-white text-color-one font-bold py-2 px-4 '
                          onClick={() => setShowLogoutWarning(false)}
                      >Cancel</button>
                  </div>

              </div>
          </div>
      </div>
  }
    </div>
  )
}
export default Logout