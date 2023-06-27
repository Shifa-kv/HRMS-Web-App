import {Route,Routes} from 'react-router-dom'
import Dashboard from '../Pages/User/Dashboard'

const UserRoute = () => {
  return (
    <Routes>
        <Route path='/home/' element={<Dashboard />} />
    </Routes>
  )
}
export default UserRoute