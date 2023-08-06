import { useState, useEffect } from 'react'
import Notice from '../../Notice';
import { useDispatch } from 'react-redux';
import {  setNotice } from '../../../Store/noticeSlice';
import { firestore } from '../../../Firebase/Config';
import { useDepartment } from '../../../Utils/departmentUtils';
import AddNotification from '../../../Utils/NotificationUtils';


const ProfileUpdate = ({ closeModal, type, User }: { closeModal?: () => void, type: string, User: any }) => {
    const id = User?.id;
    const departmentEntries = useDepartment();
    const dispatch = useDispatch();
    const [Managers, setManagers] = useState<{ [key: string]: string }[]>([]);
    const [FilteredManagers, setFilteredManagers] = useState<{ [key: string]: string }[]>([]);
    const [Departments, setDepartments] = useState<{ [key: string]: string }[]>([]);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string | boolean | null; }>({});
    type input = {
        personal: { [key: string]: string }
        employment: { [key: string]: string }
    }
    const [Inputdata, setInputdata] = useState<input>({
        personal: {
            name: User?.name,
            phone: User?.phone
        },
        employment: {
            role: User?.role,
            jobmode: User?.jobmode,
            jobstatus: User?.jobstatus,
            date: User?.e_date,
            eid: User?.e_id,
            manager: User?.manager,
            department: User?.department
        }
    });
    // maximum year to shown on DOB field
    const calculateMaxDate = () => {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - 18);
        return currentDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    };
    // form validation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        let { name, value } = e.currentTarget;
        type == 'Personalform' ?
            setInputdata({ ...Inputdata, personal: { ...Inputdata.personal, [name]: value } })
            :
            setInputdata({ ...Inputdata, employment: { ...Inputdata.employment, [name]: value } })
        let errors: {
            status: boolean;
            email?: string;
            phone?: string;
        } = { status: false };
        if (name === 'phone' && value.length < 10) {
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
        // console.log(Inputdata)
    }, [Inputdata])

    // form on submit action
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const managerstatus = e.currentTarget?.isManager?.checked;
        const addr = e.currentTarget.address?.value ? e.currentTarget.address?.value : '';
        const block = document.getElementById('employeeFormPopup');
        const inputType = (type == 'Personalform') ? Inputdata.personal : Inputdata.employment;
        const isEmptyField = Object.keys(inputType).some(key => inputType[key].trim() === '');
        if (isEmptyField || validationErrors.status == true) {
            dispatch(setNotice({ name: 'editProfile', msg: 'Please fill valid data in all mandotory fields', code: 1 }))
            block && block.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        else {
            let DataToUpdate: { [key: string]: string | boolean | number };
            if (type == 'Personalform') {
                DataToUpdate = {
                    name: Inputdata.personal.name,
                    phone: Inputdata.personal.phone,
                    address: addr,
                    dob: e.currentTarget.dob?.value
                }
            }
            else {
                DataToUpdate = {
                    e_id: Inputdata.employment.eid,
                    e_date: Inputdata.employment.date,
                    role: Inputdata.employment.role,
                    jobmode: Inputdata.employment.jobmode,
                    jobstatus: Inputdata.employment.jobstatus,
                    isManager: managerstatus,
                    manager: Inputdata.employment.manager,
                    department: Inputdata.employment.department
                }
            }
            
            // adding other user data to user database table
            DataToUpdate && firestore.collection("users").doc(id).set(DataToUpdate, { merge: true })
                .then((res) => {
                    dispatch(setNotice({ name: 'editProfile', msg: 'Profile details updated successfully!', code: 3, time: 3000 }));
                    AddNotification(`${User?.name} updated profile.`, id, `${User?.name} updated profile. Check and varify.`, `employees/view/${id}`, 'employee')
                    block && block.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => {
                        closeModal?.();
                    }, 3000);
                }).catch((error) => {
                    dispatch(setNotice({ name: 'editProfile', msg: 'Profile details updation failed!', code: 1 }));
                    console.log("Error updating user profile : ", error);
                });
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
                return managerEntries
            }).then((data) => {
                const newMangers = data.filter((manager) => manager?.dept === User.department)
                setFilteredManagers(newMangers)
            })

    }, [])
    const getManager = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMangers = Managers.filter((manager) => manager?.dept === e.currentTarget.value)
        setFilteredManagers(newMangers)
        console.log(FilteredManagers)
    }
    // Calculate the current date and set it as the max date
    const MaxDate = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
        return formattedDate
    };

    return (
        <div>
            <div className="fixed inset-0 grid overflow-y-auto	py-5 items-center justify-center z-50 bg-[#0000008c]">
                <div className="bg-white p-8 rounded shadow-md relative " id='employeeFormPopup'>
                    <button className="mt-4 bg-black rounded-full text-xs absolute right-2 top-1 text-white font-bold py-1 px-2 " onClick={closeModal}>
                        X
                    </button>
                    <h1 className="text-2xl font-bold  mb-5">Quick Edit {type == 'Personalform' ? 'Personal details' : 'Employment details'}</h1>
                    <Notice typeProp='editProfile' />
                    <form onSubmit={handleSubmit} className='mt-3'>
                        {type == 'Personalform' &&
                            < div >
                                <div className="mb-4 space-x-3 flex">
                                    <input
                                        id="NameInput"
                                        type="text"
                                        name="name"
                                        placeholder="Name*"
                                        defaultValue={User?.name}
                                        onBlur={handleChange}
                                        className="border border-gray-300 p-2 w-full rounded"
                                    />

                                </div>
                                <div className="mb-4 space-x-3 ">
                                    <input
                                        id="phoneNumberInput"
                                        type="text"
                                        name="phone"
                                        placeholder="Phone Number*"
                                        defaultValue={User?.phone}
                                        onBlur={handleChange}
                                        className="border border-gray-300 p-2 w-full rounded"
                                    />
                                    {validationErrors.phone &&
                                        <small className='block text-red-500	'>{validationErrors.phone}</small>
                                    }
                                </div>
                                <div className='w-full mb-4 '>
                                    <label className=' font-semibold'>Date of birth: </label><br />
                                    <input
                                        id="dob"
                                        type="date"
                                        name="dob"
                                        placeholder="Date of birth"
                                        onBlur={handleChange}
                                        defaultValue={User?.dob}
                                        max={calculateMaxDate()}
                                        className="border mt-2 w-full border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <div className="mb-4 space-x-3">
                                    <textarea
                                        id="addressInput"
                                        placeholder="Address"
                                        name="address"
                                        defaultValue={User.address ? User.address : ''}
                                        className="border w-full border-gray-300 p-2 rounded"
                                    />
                                </div>
                            </div>
                        }

                        {type == 'Employmentform' &&
                            < div >
                                <div className="mb-4 space-x-3 ">

                                    <input
                                        id="emailInput"
                                        type="email"
                                        name="email"
                                        placeholder="Email*"
                                        defaultValue={User?.email}
                                        onBlur={handleChange}
                                        className="border w-full border-gray-300 p-2 rounded"
                                    />
                                    {validationErrors.email &&
                                        <small className='block text-red-500	'>{validationErrors.email}</small>
                                    }


                                </div>
                                <div className="mb-4 space-x-3 flex">
                                    <input
                                        id="EidInput"
                                        type="text"
                                        name="eid"
                                        placeholder="Employee id*"
                                        defaultValue={User?.e_id}
                                        onBlur={handleChange}
                                        className="border border-gray-300 p-2 rounded"
                                    />
                                    <input
                                        id="role"
                                        type="text"
                                        name="role"
                                        placeholder="Role*"
                                        defaultValue={User?.role}
                                        onBlur={handleChange}
                                        className="border h-max w-full border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <div className="mb-4 space-x-3 flex">
                                    <select name='department' onBlur={handleChange} onChange={getManager} className="border w-full border-gray-300 p-2 rounded">
                                        <option>Department *</option>
                                        {Departments && Departments?.map((dep) => {
                                            return <option value={dep.id} selected={dep?.id === User.department} key={dep.id}>
                                                {dep.title}
                                            </option>
                                        })
                                        }
                                    </select>
                                    <select name='manager' onBlur={handleChange} className="border w-full border-gray-300 p-2 rounded">
                                        <option>Manager *</option>
                                        {FilteredManagers && FilteredManagers?.map((user) => {
                                            return <option value={user.id} selected={user?.id === User.manager} key={user.id}>
                                                {user.name}
                                            </option>
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
                                        defaultValue={User?.e_date}
                                        onBlur={handleChange}
                                        max={MaxDate()}
                                        className="border mt-2 w-full border-gray-300 p-2 rounded"
                                    />
                                </div>
                                <div className="mb-4 ">
                                    <label className='mr-3 font-semibold'>Job status* </label><br />
                                    <input type='radio' name='jobstatus' value='intern'
                                        className='mr-2'
                                        onBlur={handleChange}
                                        defaultChecked={User?.jobstatus === 'intern'}
                                    />Intern
                                    <input type='radio' name='jobstatus' value='fulltime'
                                        className='ml-3 mr-2'
                                        onBlur={handleChange}
                                        defaultChecked={User?.jobstatus == 'fulltime'}
                                    />Fulltime
                                </div>
                                <div className="mb-4 ">
                                    <label className='mr-3 font-semibold'>Job mode* </label><br />
                                    <input type='radio' name='jobmode' value='remote'
                                        className='mr-2'
                                        onBlur={handleChange}
                                        defaultChecked={User?.jobmode === 'remote'}
                                    />Remote
                                    <input type='radio' name='jobmode' value='office'
                                        className='ml-3 mr-2'
                                        onBlur={handleChange}
                                        defaultChecked={User?.jobmode === 'office'}
                                    />Office
                                </div>
                                <div className='mb-4 block'>
                                    <input type='checkbox' name='isManager' className='mr-2 mb-2'
                                        defaultChecked={User?.isManager === true}
                                    />Give Manager features<br />

                                </div>
                            </div>
                        }
                        <button
                            type="submit"
                            className="bg-defaultBg w-full text-white py-2 px-5 rounded"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div >

        </div >
    )
}
export default ProfileUpdate