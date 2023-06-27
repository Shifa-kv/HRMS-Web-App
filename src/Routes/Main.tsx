import {Navigate, Route,Routes} from 'react-router-dom'
import Login from '../Pages/Login'
import { useSelector } from 'react-redux'
const Main = () => {
    const userStore = useSelector((state:any)=>state.user)
    return(
        <Routes>
            {!userStore.isAuthenticated&&
              <Route path='/' element={<Login />}  />
            }
            {userStore.isAuthenticated&&
              <Route path='/' element={
                userStore.type == 'admin' ?
                <Navigate to='/hr/home' />:
                <Navigate to='/hr/user' />
              }  />
            }
        </Routes>
    )
}
export default Main