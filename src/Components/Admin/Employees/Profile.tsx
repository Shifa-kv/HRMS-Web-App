import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react'
import { firestore } from "../../../Firebase/Config";
import { FaCheck, FaPen } from "react-icons/fa6";
import { FindDepartment, useDepartment } from "../../../Utils/departmentUtils";
import EmployeeUpdate from "./Update";
import { delNotice } from "../../../Store/noticeSlice";
import { useDispatch } from "react-redux";

const EmployeeProfile = () => {
    const { id } = useParams();
    const [User, setUser] = useState<any>()
    const department = useDepartment();
    const dept = FindDepartment(User?.department, department);
    const [ShowEditForm, setShowEditForm] = useState<{ [key: string]: Boolean }>({})
    const dispatch = useDispatch()

    useEffect(() => {
        firestore.collection('users').doc(id)
            .onSnapshot((doc) => {
                const data = doc.data()
                data && setUser({ ...data });
                if (data?.manager)
                    firestore.collection('users').doc(data?.manager).get()
                        .then((doc) => {
                            const user = doc.data();
                            setUser({ ...data, managerName: user?.name })
                        })
            })
    }, [id])

    return (
        <div className='container bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem] '>
            {User &&
                <div className="  pt-5 flex space-x-12">
                    <div className="bg-white overflow-hidden  w-full rounded-lg shadow-md items-center justify-between mb-4">
                        <h2 className="px-8 py-2 text-2xl font-bold text-white bg-color-two flex justify-between items-center">Personal Details
                            <span>
                                <FaPen size={20} color="grey"
                                    onClick={() => {
                                        dispatch(delNotice('editEmployee'))
                                        setShowEditForm({ ...ShowEditForm, Personalform: true })
                                    }}
                                />
                            </span>
                        </h2>
                        <table className='py-2 block w-full border-separate capitalize text-left border-spacing-y-2 border-spacing-x-4 px-4'>
                            <tbody>
                                <tr>
                                    <th className="font-semibold text-black">Name:</th>
                                    <td>{User.name}</td>
                                </tr>
                                <tr>
                                    <th className="font-semibold text-black">Phone:</th>
                                    <td>{User.phone}</td>
                                </tr>
                                <tr>
                                    <th className="font-semibold text-black">Date of birth:</th>
                                    <td>{User.dob}</td>
                                </tr>
                                <tr>
                                    <th className="font-semibold text-black">Address</th>
                                    <td>{User.address}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white overflow-hidden  w-full rounded-lg shadow-md items-center justify-between mb-4">
                        <h2 className="px-8 py-2 text-2xl font-bold text-white bg-color-three flex justify-between items-center">Employment Details
                            <span>
                                <FaPen size={20} color="grey"
                                    onClick={() => {
                                        dispatch(delNotice('editEmployee'))
                                        setShowEditForm({ ...ShowEditForm, Employmentform: true })
                                    }}
                                />
                            </span>
                        </h2>
                        <table className='py-2 block w-full border-separate capitalize border-spacing-y-2 border-spacing-x-4 px-4'>

                            <tbody>
                                <tr>
                                    <td className="font-semibold text-black">Employment date:</td>
                                    <td>{User.e_date}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-black">Role:</td>
                                    <td>{User.role}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-black">Department:</td>
                                    <td>{dept}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-black">Manager:</td>
                                    <td>
                                        <Link to={`../employees/view/${User?.manager}`}>{User?.managerName}</Link>

                                    </td>
                                </tr>
                                {User.isManager &&
                                    <tr>
                                        <td className="font-semibold text-black">Manager role:</td>
                                        <td>
                                            <FaCheck />
                                        </td>
                                    </tr>
                                }

                                <tr>
                                    <td className="font-semibold text-black">Job Mode:</td>
                                    <td>{User.jobmode}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-black">Job Status:</td>
                                    <td>{User.jobstatus}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            
            }
            {ShowEditForm.Personalform &&
                <EmployeeUpdate
                    type='Personalform'
                    User={User}
                    closeModal={() => setShowEditForm({ ...ShowEditForm, Personalform: false })} />
            }
            {ShowEditForm.Employmentform &&
                <EmployeeUpdate
                    type='Employmentform'
                    User={User}
                    closeModal={() => setShowEditForm({ ...ShowEditForm, Employmentform: false })} />
            }
        </div>
    )
}
export default EmployeeProfile