import {Route,Routes} from 'react-router-dom'
import Dashboard from '../Pages/User/Dashboard'
import Profile from '../Pages/User/MyProfile'

const UserRoute = () => {
  return (
    <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/home/' element={<Dashboard />} />
        <Route path='/profile/' element={<Profile/>} />
    </Routes>
  )
}
export default UserRoute