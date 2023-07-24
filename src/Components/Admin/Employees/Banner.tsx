import { useState, useEffect } from 'react';
import EmployeeUploadForm from '../EmployeeUploadForm';
import DepartmentUploadForm from '../DepartmentUploadForm';
import {  FaTrash } from 'react-icons/fa6';
import image from '../../../Assets/images/user.jpg'
import { firestore } from '../../../Firebase/Config';
import { Link, useNavigate, useParams } from "react-router-dom";
import Notice from '../../Notice';
import { useDispatch, useSelector } from 'react-redux';
import { delNotice, setNotice } from '../../../Store/noticeSlice';
import axios from 'axios';
import { useDepartment } from '../../../Utils/departmentUtils';
type StateType = {
    [key: string]: string | null;
};

const EmployeeBanner = (
    { page, setSelection }: {
        page: string,
        setSelection?: (data: StateType | ((prevState: StateType) => StateType)) => void
    }) => {
    const { id } = useParams();
    const currentuser = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let statusColor = 'bg-green-600';
    const [ShowForm, setShowForm] = useState<{ [key: string]: Boolean }>({})
    const [User, setUser] = useState<any>(null)
    const departmentEntries = useDepartment();

    useEffect(() => {
        firestore.collection('users').doc(id).onSnapshot((doc) => {
                const data = doc.data()
                if (data) {
                    setUser({
                        name: data.name,
                        role: data.role,
                        email: data.email,
                        e_id: data.e_id,
                        id: data.id
                    });
                }
            })
    }, [id])

    const deleteUser = () => {
        axios.post('http://localhost:5000/deleteUser', {
            uid: User?.id
        }).then((userRecord) => {
            firestore.collection("users").doc(id).delete().then(() => {
                dispatch(setNotice({ name: 'deleteEmployee', msg: 'Employee got removed successfully', code: 3, time: 3000 }))
                console.log('user removed', userRecord)
                navigate('../employees')
            }).catch((error) => {
                dispatch(setNotice({ name: 'deleteEmployee', msg: 'Employee removal failed', code: 1 }))
                console.error("Error removing document: ", error);
            });
        }).catch((error) => {
            dispatch(setNotice({ name: 'deleteEmployee', msg: 'Employee removal failed', code: 1 }))
            console.error("Error removing document: ", error);
        });
    }

    const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value, name } = e.target;
        setSelection && setSelection((prevState) => ({ ...prevState, [name]: value }));
    }

    return (
        <section className='bg-defaultBg  py-10'>
            <div className='container flex justify-between'>
                {page == 'main' &&
                    <div className='flex justify-between w-full'>
                        <div>
                            <h1 className=' text-3xl text-amber-100 font-thin'>Employees</h1>
                            <div className='flex mt-3'>
                                <select name='filterDepartment'
                                    onChange={handleSelection}
                                    className="border w-full border-color-one text-color-one mr-2 p-2 rounded bg-transparent text-sm h-max"
                                >
                                    <option value=''>Department</option>
                                    {departmentEntries && departmentEntries?.map((dep: any) => {
                                        return <option value={dep.id}  key={dep.id}>
                                            {dep.title}
                                        </option>
                                    })
                                    }
                                </select>
                                <select name='sort'
                                    onChange={handleSelection}
                                    className="border w-full border-color-one text-color-one mr-2 p-2 rounded bg-transparent text-sm h-max"
                                >
                                    <option value=''>Sort</option>
                                    <option value='e_id'>Employee id</option>
                                    <option value='name'>Name</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button className='defaultstyle' onClick={() => { setShowForm({ ...ShowForm, Employeeform: true }) }}>
                                <span className='text-2xl font-bold  leading-6'>+</span>Add Employee
                            </button>
                            <button className='defaultstyle ml-3' onClick={() => { setShowForm({ ...ShowForm, DepartmentForm: true }) }}>
                                <span className='text-2xl font-bold  leading-6'>+</span>Add Department
                            </button>
                        </div>
                    </div>
                }

                {page == 'view' &&
                User&&
                    <div className='flex justify-between w-full'>
                        <div>
                            <Link to='../employees' className='block  text-amber-100 text-xs px-2 py-1 w-max mb-2'>Go back</Link>

                            <div className='flex items-center space-x-2 capitalize text-gray-400'>
                                <div className='relative w-max m-auto'>
                                    <img src={image} alt={User.name} className="w-24 h-24 rounded-full mx-auto mb-2" />
                                    <span className={`${statusColor} w-4 h-4 block absolute top-0 right-4 border-2 m-auto rounded-full`}></span>
                                </div>
                                <div>
                                    <p className=' w-max bg-color-one text-black px-2 rounded-md text-xs'>{User.e_id}</p>

                                    <h1 className=' text-3xl text-amber-100 font-thin'>{User.name}</h1>

                                    <p>{User.role}</p>
                                    <p>{User.email}</p>
                                </div>
                            </div>
                        </div>
                        {currentuser.id !== id &&
                            <div>
                                <button className='bg-red-500 text-white p-3 rounded-full ml-3'
                                    onClick={() => { setShowForm({ ...ShowForm, DeleteForm: true }) }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        }
                    </div>
                }
                {
                  page == 'view' &&
                  !User &&
                  <h1 className='text-white'> If you are viewing this page and the employee is not found, it seems they might have been removed.</h1>  
                }
            </div>



            {
                ShowForm.Employeeform &&
                <EmployeeUploadForm
                    closeModal={() => {
                        dispatch(delNotice('addEmployee'))
                        setShowForm({ ...ShowForm, Employeeform: false })
                    }}
                />
            }
            {
                ShowForm.DepartmentForm &&
                <DepartmentUploadForm
                    closeModal={() => {
                        dispatch(delNotice('addDepartment'));
                        setShowForm({ ...ShowForm, DepartmentForm: false })
                    }}
                />
            }
            {
                ShowForm.DeleteForm &&
                <div>
                    <div className="fixed inset-0 grid overflow-y-auto	py-5 items-center justify-center z-50 bg-[#0000008c]">
                        <div className="bg-white p-8 rounded shadow-md relative " id='employeeFormPopup'>
                            <Notice typeProp='deleteEmployee' />

                            <h1 className="text-2xl font-bold  mb-5">Are you sure to remove the user?</h1>

                            <div className='flex space-x-3 mb-3'>
                                <button className=' rounded-md m-auto border hover:bg-red-600 text-white w-full font-bold py-2 px-4  bg-red-700'
                                    onClick={deleteUser}
                                >Remove</button>
                                <button className='w-full rounded-md m-auto border border-color-one hover:bg-color-one hover:text-white text-color-one font-bold py-2 px-4 '
                                    onClick={() => setShowForm({ ...ShowForm, DeleteForm: false })}
                                >Close</button>
                            </div>

                        </div>
                    </div>
                </div>
            }
        </section >

    )
}
export default EmployeeBanner