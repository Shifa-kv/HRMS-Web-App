import {Route,Routes} from 'react-router-dom'
import Login from '../Pages/Login'
import Dashboard from '../Pages/Admin/Dashboard'
import PrivateRoute from './PrivateRoute'

const AdminRoute = () => {
  return (
    <Routes>
        <Route path='/login/' element={<Login />} />
        <Route path='/home' element={<Dashboard />} />
    </Routes>
  )
}
export default AdminRoute