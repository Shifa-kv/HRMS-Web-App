import {useState} from 'react'
import EmployeeList from '../../Components/Admin/Employees/List';
import Header from '../../Components/Admin/Header';
import EmployeeBanner from '../../Components/Admin/Employees/Banner';
import Notice from '../../Components/Notice';

const Employees = () => {
  const [Selection, setSelection] = useState<{[key:string]:string | null}>({});
  return (
    <section>
      <Header />
      <Notice typeProp='deleteEmployee' />
      <EmployeeBanner page='main' setSelection={setSelection} />

      {/* section 1 start */}
      <div className='container bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem] '>        
            <EmployeeList selection={Selection} />
      </div>
      {/* section 1 end */}

    </section>
  )
}
export default Employees