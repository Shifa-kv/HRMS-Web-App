import { useState, useEffect } from 'react'
import Notice from '../Notice';
import { useDispatch, useSelector } from 'react-redux';
import { setNotice } from '../../Store/noticeSlice';
import { firestore } from '../../Firebase/Config';
import axios from 'axios';
import { useDepartment } from '../../Utils/departmentUtils';
import AddNotification from '../../Utils/NotificationUtils';


const EmployeeUploadForm = ({ closeModal }: { closeModal?: () => void }) => {
    const departmentEntries = useDepartment();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const [Managers, setManagers] = useState<{ [key: string]: string }[]>([]);
    const [FilteredManagers, setFilteredManagers] = useState<{ [key: string]: string }[]>([]);
    const [Departments, setDepartments] = useState<{ [key: string]: string }[]>([]);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string | boolean | null; }>({});
    const [Loading, setLoading] = useState(false)
    const [data, setData] = useState<{ [key: string]: string }>({
        name: '',
        phone: '',
        email: '',
        role: '',
        jobmode: '',
        jobstatus: '',
        password: '',
        date: '',
        eid: ''
    });

    // form validation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        let { name, value } = e.currentTarget;

        setData({ ...data, [name]: value });
        let errors: {
            status: boolean;
            email?: string;
            password?: string;
            phone?: string;
        } = { status: false };
        if (name === 'email' && !(/(.+)@(.+){2,}\.(.+){2,}/.test(value))) {
            errors = { ...errors, [name]: 'Enter a valid email id', status: true };
        }
        else if (name === 'password' && value.length < 6) {
            errors = { ...errors, [name]: 'Set a six digit password', status: true };
        }
        else if (name === 'phone' && value.length < 10) {
            errors = { ...errors, [name]: 'Invalid phone number', status: true };
        }
        else {
            errors = { ...errors, [name]: null };
        }
        setValidationErrors({
            ...validationErrors,
            ...errors
        })
    };

    useEffect(() => {
        const statusState = Object.keys(validationErrors)
            .filter(key => key !== 'status')
            .every(key => validationErrors[key] === null);
        setValidationErrors({
            ...validationErrors,
            status: !statusState
        })
    }, [data])

    // form on submit action
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const managerstatus = e.currentTarget.isManager?.checked;
        const addr = e.currentTarget.address.value;
        const manager = e.currentTarget.manager.value;
        const department = e.currentTarget.department.value;
        const block = document.getElementById('employeeFormPopup');
        const isEmptyField = Object.keys(data).some(key => data[key].trim() === '');
        if (isEmptyField || validationErrors.status == true) {
            dispatch(setNotice({ name: 'addEmployee', msg: 'Please fill valid data in all mandotory fields', code: 1 }))
            block && block.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        else {
            setLoading(true);
            try {
                // authenticate a new user
                // Make an HTTP POST request to the server-side endpoint
                const response = axios.post('http://localhost:5000/createUser', {
                    email: data.email,
                    password: data.password,
                    phone: data.phone
                }).then((userRecord) => {
                    // adding other user data to user database table
                    firestore.collection("users").add({
                        id: userRecord.data.userRecord.uid,
                        e_id: data.eid,
                        e_date: data.date,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        role: data.role,
                        jobmode: data.jobmode,
                        jobstatus: data.jobstatus,
                        isManager: managerstatus,
                        manager: manager,
                        department: department,
                        address: addr,
                        type: 'user'
                    }).then((res) => {
                        console.log(res);
                        setLoading(false)
                        dispatch(setNotice({ name: 'addEmployee', msg: userRecord?.data?.message, code: 3, time: 3000 }));
                        block && block.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        AddNotification('New registration!', user.id, `New employee ${data.name} added. View profile and update their details.`, `employees/view/${res.id}`, 'employee')
                        setTimeout(() => {
                            closeModal?.();
                        }, 3000);
                    }).catch((error) => {
                        setLoading(false)
                        dispatch(setNotice({ name: 'addEmployee', msg: 'Employee registration failed! try again.', code: 1 }))
                        console.log("Error adding to firestore db : ", error);
                    });
                }).catch((error) => {
                    setLoading(false)
                    console.log("Error : ", error?.response?.data?.error);
                    dispatch(setNotice({ name: 'addEmployee', msg: error?.response?.data?.error?.message, code: 1 }))
                });
            } catch (error) {
                console.error(error);
            }

        }
    }


    // set manager data & department data   
    useEffect(() => {
        setDepartments(departmentEntries);

        firestore.collection('users').where("isManager", "==", true)
            .get().then((snapshot) => {
                const managerEntries = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    dept: doc.data().department,
                }));
                setManagers(managerEntries);
            })

    }, [])
    const filterManager = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMangers = Managers.filter((manager) => manager?.dept === e.currentTarget.value)
        setFilteredManagers(newMangers)
        console.log(FilteredManagers)
    }
    // Calculate the current date and set it as the max date
    const calculateMaxDate = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
        return formattedDate
    };

    return (
        <div>
            <div className="fixed inset-0 grid overflow-y-auto	py-5 items-center justify-center z-50 bg-[#0000008c]">
                <div className="bg-white rounded shadow-md relative " id='employeeFormPopup'>
                    {Loading&&<div className="flex rounded items-center justify-center h-full w-full absolute bg-defaultBg/70 z-10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 "></div>
                    </div>}
                    <div className='p-8 '>
                        <button className="mt-4 bg-black rounded-full text-xs absolute right-2 top-1 text-white font-bold py-1 px-2 " onClick={closeModal}>
                            X
                        </button>
                        <h1 className="text-2xl font-bold  mb-5">Quick add employee</h1>
                        <Notice typeProp='addEmployee' />
                        <form onSubmit={handleSubmit} className='mt-3 '>

                            <div className="mb-4 space-x-3 flex">
                                <input
                                    id="NameInput"
                                    type="text"
                                    name="name"
                                    placeholder="Name*"
                                    onBlur={handleChange}
                                    className="border border-gray-300 p-2 rounded"
                                />
                                <input
                                    id="EidInput"
                                    type="text"
                                    name="eid"
                                    placeholder="Employee id*"
                                    onBlur={handleChange}
                                    className="border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4 space-x-3 flex">

                                <input
                                    id="role"
                                    type="text"
                                    name="role"
                                    placeholder="Role*"
                                    onBlur={handleChange}
                                    className="border h-max w-full border-gray-300 p-2 rounded"
                                />
                                <div>
                                    <input
                                        id="phoneNumberInput"
                                        type="text"
                                        name="phone"
                                        placeholder="Phone Number*"
                                        onBlur={handleChange}
                                        className="border border-gray-300 p-2 rounded"
                                    />
                                    {validationErrors.phone &&
                                        <small className='block text-red-500	'>{validationErrors.phone}</small>
                                    }
                                </div>


                            </div>
                            <div className="mb-4 space-x-3 flex">
                                <select name='department' onChange={filterManager} className="border w-full border-gray-300 p-2 rounded">
                                    <option value='' >Department</option>
                                    {Departments && Departments?.map((dep) => {
                                        return <option value={dep.id}>{dep.title}</option>
                                    })
                                    }
                                </select>
                                <select name='manager' className="border w-full border-gray-300 p-2 rounded">
                                    <option value='' >Manager</option>
                                    {FilteredManagers && FilteredManagers?.map((user) => {
                                        return <option value={user.id}>{user.name}</option>
                                    })
                                    }
                                </select>
                            </div>

                            <div className='w-full mb-4 '>
                                <label className=' font-semibold'>Employment date: </label><br />
                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    placeholder="Date"
                                    onBlur={handleChange}
                                    max={calculateMaxDate()}
                                    className="border mt-2 w-full border-gray-300 p-2 rounded"
                                />
                            </div>

                            <div className="mb-4 space-x-3 flex">

                                <input
                                    id="emailInput"
                                    type="email"
                                    name="email"
                                    placeholder="Email*"
                                    onBlur={handleChange}
                                    className="border w-full border-gray-300 p-2 rounded"
                                />
                                {validationErrors.email &&
                                    <small className='block text-red-500	'>{validationErrors.email}</small>
                                }


                            </div>
                            <div className="mb-4 space-x-3">
                                <textarea
                                    id="addressInput"
                                    placeholder="Address"
                                    name="address"
                                    className="border w-full border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4 ">
                                <label className='mr-3 font-semibold'>Job status* </label><br />
                                <input type='radio' name='jobstatus' value='intern' className='mr-2' onBlur={handleChange} />Intern
                                <input type='radio' name='jobstatus' value='fulltime' className='ml-3 mr-2' onBlur={handleChange} />Fulltime
                            </div>
                            <div className="mb-4 ">
                                <label className='mr-3 font-semibold'>Job mode* </label><br />
                                <input type='radio' name='jobmode' value='remote' className='mr-2' onBlur={handleChange} />Remote
                                <input type='radio' name='jobmode' value='office' className='ml-3 mr-2' onBlur={handleChange} />Office
                            </div>
                            <div className='mb-4 block'>
                                <input type='checkbox' name='isManager' className='mr-2 mb-2' />Give Manager features<br />
                                <label className='mr-3 font-semibold'>Set a password*</label><br />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    min={6}
                                    placeholder="Password"
                                    onBlur={handleChange}
                                    className="border w-full border-gray-300 p-2 rounded"
                                />
                                {validationErrors.password &&
                                    <small className='block text-red-500	'>{validationErrors.password}</small>
                                }
                            </div>
                            <button
                                type="submit"
                                className="bg-defaultBg w-full text-white py-2 px-5 rounded"
                            >
                                Add
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default EmployeeUploadForm