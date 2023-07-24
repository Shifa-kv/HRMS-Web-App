import { Route, Routes } from 'react-router-dom'
import Login from '../Pages/Login'
import Dashboard from '../Pages/Admin/Dashboard'
import PrivateRoute from './PrivateRoute'
import Employees from '../Pages/Admin/Employees'
import ViewEmployee from '../Pages/Admin/ViewEmployee'
import Notifications from '../Pages/Admin/Notifications'
import Projects from '../Pages/Admin/Projects'
import Leaves from '../Pages/Admin/Leaves'

const AdminRoute = () => {
  return (
    <Routes>
      <Route path='/login/' element={<Login />} />
      <Route path='/home' element={<Dashboard />} />
      <Route path='/' element={<Dashboard />} />
      <Route path='/employees' element={<Employees />} />
      <Route path='/employees/view/:id' element={<ViewEmployee />} />
      <Route path='/projects' element={<Projects />} />
      <Route path='/leaves' element={<Leaves />} />
      <Route path='/notifications' element={<Notifications />} />
    </Routes>
  )
}
export default AdminRoute