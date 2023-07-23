import Header from "../../Components/Admin/Header"
import EmployeeBanner from "../../Components/Admin/Employees/Banner"
import EmployeeProfile from '../../Components/Admin/Employees/Profile';


const ViewEmployee = () => {
    return (
        <section >
            <Header />
            <EmployeeBanner page='view' />
            <EmployeeProfile />
        </section>
    )
}
export default ViewEmployee