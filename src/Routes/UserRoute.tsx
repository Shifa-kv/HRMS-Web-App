import {Route,Routes} from 'react-router-dom'
import Dashboard from '../Pages/User/Dashboard'
import Profile from '../Pages/User/MyProfile'
import Attendance from '../Pages/User/Attendance'
import Leaves from '../Pages/User/Leaves'

const UserRoute = () => {
  return (
    <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/home/' element={<Dashboard />} />
        <Route path='/profile/' element={<Profile/>} />
        <Route path='/attendance/' element={<Attendance/>} />
        <Route path='/leaves/' element={<Leaves/>} />
    </Routes>
  )
}
export default UserRoute