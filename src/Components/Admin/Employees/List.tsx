import { FaPhone, FaRegEnvelope } from 'react-icons/fa6'
import image from '../../../Assets/images/user.jpg'
import { Timestamp, firestore } from '../../../Firebase/Config'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDepartment, FindDepartment } from '../../../Utils/departmentUtils'
type SelectionType = {
    [key: string]: string | null;
};

const EmployeeList = ({ selection }: { selection: SelectionType }) => {
    const [Users, setUsers] = useState<any>();
    const [userUpdationStatus, setUserUpdationStatus] = useState<boolean>(false);
    const department = useDepartment();
    let statusColor = 'bg-green-600';

    useEffect(() => {
        firestore.collection('users').onSnapshot(async (snapshot) => {
          const usersData = snapshot.docs.map((userDoc) => {
            const { email, name, phone, department, role, e_date, e_id } = userDoc.data();
            return {
              email,
              name,
              phone,
              department,
              id: userDoc.id,
              e_date,
              role,
              e_id,
              status: false, // Default status set to false
            };
          });
      
          const updatedUsers = await Promise.all(usersData.map(async (user) => {
            const snapshot = await firestore
              .collection("attendance")
              .where("employee_id", "==", user.id)
              .get();
      
            if (!snapshot.empty) {
              const today = new Date().toLocaleDateString();
              const hasAttendanceToday = snapshot.docs.some((doc) => {
                const dateObj = new Date(doc?.data()?.time_in?.seconds * 1000);
                return dateObj.toLocaleDateString() === today;
              });
              console.log(user.id,hasAttendanceToday)
              return {
                ...user,
                status: hasAttendanceToday,
              };
            }
            else{
                return user;

            }
          }));
      
          setUsers(updatedUsers);
          console.log(updatedUsers);

        });
      }, []);
      
      
      
      



    // Filter users by department 
    const filteredUsers = useMemo(() => {
        if (selection.filterDepartment) {
            return Users.filter((user: any) => user.department === selection.filterDepartment);
        }
        return Users;
    }, [Users, selection]);

    // Sort the users by name in ascending order
    const sortedUsers = useMemo(() => {
        if (selection.sort === 'name') {
            return [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));
        }
        if (selection.sort === 'e_id') {
            return [...filteredUsers].sort((a, b) => a.e_id - b.e_id);
        }
        return filteredUsers;
    }, [filteredUsers, selection]);

    return (
        <div className='flex space-x-5  flex-wrap justify-center'>
            {Users && sortedUsers?.map((user: any, index: number) => {
                const dep = FindDepartment(user?.department, department);
                return <div className='w-3/12 mb-10' key={index}>
                    <div className="bg-white rounded-lg shadow-lg p-4 text-center mt-6">
                        <div className='relative w-max m-auto'>
                            <img src={image} alt={user?.name} className="w-24 h-24 -mt-10 rounded-full mx-auto mb-2" />
                            <span className={`${user?.status ? statusColor : 'bg-red-600'} w-4 h-4 block absolute top-0 right-4 border-2 m-auto rounded-full`}></span>
                        </div>
                        <span>{user?.e_id}</span>
                        <h2 className="text-lg font-bold mb-0 capitalize">{user?.name}</h2>
                        <p className="text-gray-500 font-semibold capitalize mb-4">{user?.role}</p>
                        <div className=' bg-color-two rounded-lg text-white text-left px-5 py-2 my-2'>
                            <p className='flex items-center'><FaRegEnvelope className='mr-2' />{user?.email}</p>
                            <p className='flex items-center'><FaPhone className='mr-2' /> {user?.phone}</p>
                        </div>
                        <div className=' bg-color-three rounded-lg mb-3 text-left px-5 py-2 mt-2'>
                            <p className='flex items-center justify-between'>Department:
                                <span className='font-semibold'>{dep}</span>
                            </p>
                            <p className='flex items-center justify-between'>Date of joining:
                                <span className='font-semibold'>{user?.e_date}</span>
                            </p>
                        </div>
                        <Link
                            to={'./view/' + user?.id}
                            className="block rounded-md m-auto border border-color-one hover:bg-color-one hover:text-white text-color-one font-bold py-2 px-4 "
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            })
            }
        </div>
    )
}
export default EmployeeList