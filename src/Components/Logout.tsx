import { useDispatch } from "react-redux";
import { auth } from "../Firebase/Config";
import { useNavigate } from 'react-router-dom';
import { setNotice } from "../Store/noticeSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogout = () => {
    auth.signOut().then(() => {
      dispatch(setNotice({ name: 'loginNotice', msg: 'Signout done! Login again.', code: 3, time: 3000 }))
      navigate("/");
    }).catch((error) => {
      console.log(error.errorMessage);
    });
  }
  return (
    <button onClick={userLogout}>Logout</button>
  )
}
export default Logout