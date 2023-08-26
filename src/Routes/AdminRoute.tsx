import { Route, Routes } from 'react-router-dom'
import Login from '../Pages/Login'
import Dashboard from '../Pages/Admin/Dashboard'
import PrivateRoute from './PrivateRoute'
import Employees from '../Pages/Admin/Employees'
import ViewEmployee from '../Pages/Admin/ViewEmployee'
import Notifications from '../Pages/Admin/Notifications'
import Projects from '../Pages/Admin/Projects'
import Leaves from '../Pages/Admin/Leaves'
import Settings from '../Pages/Admin/Settings'
import Attendance from '../Pages/Admin/Attendance'

const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/login/' element={<Login />} />
      <Route path='/home' element={<Dashboard />} />
      <Route path='/' element={<Dashboard />} />
      <Route path='/employees' element={<Employees />} />
      <Route path='/employees/view/:id' element={<ViewEmployee />} />
      <Route path='/projects' element={<Projects />} />
      <Route path='/attendance' element={<Attendance />} />
      <Route path='/leaves' element={<Leaves />} />
      <Route path='/notifications' element={<Notifications />} />
      <Route path='/settings' element={<Settings />} />
    </Routes>
  )
}
export default AdminRoute