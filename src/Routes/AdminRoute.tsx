import {Route,Routes} from 'react-router-dom'
import Login from '../Pages/Login'
import Dashboard from '../Pages/Admin/Dashboard'
import PrivateRoute from './PrivateRoute'
import Employees from '../Pages/Admin/Employees'
import ViewEmployee from '../Pages/Admin/ViewEmployee'
import Notifications from '../Pages/Admin/Notifications'

const AdminRoute = () => {
  return (
    <Routes>
        <Route path='/login/' element={<Login />} />
        <Route path='/home' element={<Dashboard />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='/employees' element={<Employees />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/employees/view/:id' element={<ViewEmployee />} />
    </Routes>
  )
}
export default AdminRoute