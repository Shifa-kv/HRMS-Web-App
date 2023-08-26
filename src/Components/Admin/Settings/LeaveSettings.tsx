import { useEffect, useState } from "react";
import { firestore } from "../../../Firebase/Config";
import Notice from "../../Notice";
import { useDispatch } from "react-redux";
import { setNotice } from "../../../Store/noticeSlice";
import { FaTrash } from "react-icons/fa6";
import { FaTruckLoading } from "react-icons/fa";

const LeaveSettings = () => {
    const [leaveTypes, setLeaveTypes] = useState<any>([]);
    const [deletedTypes, setDeletedTypes] = useState<any>([]);
    const [Holiday, setHoliday] = useState<any>([]);
    const [state, setState] = useState(false)
    // const [employees, setEmployees] = useState<{ [key: string]: string }[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('enter')
        firestore.collection("leave_type").onSnapshot((snapshot) => {
            const userData = snapshot.docs.map((snapshot) => {
                return { ...snapshot.data(), id: snapshot.id }
            })
            setLeaveTypes(userData);
        })
        setState(false)
        // get user data
        // firestore.collection('users').onSnapshot(async (snapshot) => {
        //     const usersData = snapshot.docs.map((userDoc) => {
        //         const { email, name, phone, department, role, e_date, e_id } = userDoc.data();
        //         return {
        //             name,
        //             id: userDoc.id
        //         };
        //     });
        //     setEmployees(usersData);
        // });

    }, [state])

    const handleAddLeaveType = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const leavetype = e.currentTarget.elements.namedItem('leavetype') as HTMLInputElement;
        const value = leavetype.value;
        setLeaveTypes((prevTypes: any) => prevTypes.concat({ title: value, count: 0, status: false }));
    };
    const handleAddHoliday = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const holiday = e.currentTarget.elements.namedItem('holiday') as HTMLInputElement;
        const holidayDate = e.currentTarget.elements.namedItem('holidayDate') as HTMLInputElement;
        setHoliday((prevState: any) => prevState.concat({ title: holiday.value, date: new Date(holidayDate.value) }));
    };
    console.log(leaveTypes)

    const onLeaveSubmit = async () => {
        const batch = firestore.batch();

        leaveTypes.forEach((doc: any) => {
            console.log(2, doc.id)
            const docRef = firestore.collection('leave_type').doc(doc.id);
            const { title, status, count } = doc
            batch.set(docRef, { title, status, count }, { merge: true });
        });

        Holiday.forEach((doc: any) => {
            const docRef = firestore.collection('holidays').doc();
            batch.set(docRef, doc, { merge: true });
        });

        deletedTypes?.forEach((doc: any) => {
            console.log(3, doc.id)
            const docRef = firestore.collection('leave_type').doc(doc.id);
            batch.delete(docRef);
        });

        try {
            await batch.commit();
            console.log('Batch update successful!');
            setHoliday([])
            dispatch(setNotice({ name: 'settings', msg: 'Leave settings saved successfully! ', code: 3, time: 3000 }))
        } catch (error) {
            console.error('Error updating documents:', error);
        }
    };

    const updateState = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const { value } = e.currentTarget;
        const name = e.currentTarget.getAttribute('name'); // Get the name attribute from the input element

        const updatedType = leaveTypes.map((type: any) => {
            if (type.title.replaceAll(' ', '_') == name) {

                return ({ ...type, count: value });

            }
            return type
        })
        setLeaveTypes(updatedType);
    }
    const deleteType = (value: string) => {
        const deletedLeaveTypes = leaveTypes.filter((item: any) => item.id && item.title === value || item.id === value);
        setDeletedTypes([...deletedTypes, ...deletedLeaveTypes])
        const updatedLeaveTypes = leaveTypes.filter((item: any) => item.title !== value && item.id !== value);
        setLeaveTypes(updatedLeaveTypes);
    }
    return (
        <div className=" mx-auto container bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem]">
            <div className="pb-3">
                <Notice typeProp="settings" />
            </div>
            <div className="bg-color-one flex items-center justify-between py-2 px-6 rounded-lg mb-4">
                <h2 className="text-white mb-0">Leave settings</h2>
                <button onClick={() => onLeaveSubmit()} className="bg-defaultBg text-white py-3 px-6 rounded-lg font-bold uppercase">Save</button>
            </div>
            <div className="flex space-x-5">
                <div className="bg-white rounded-lg shadow-md p-6 w-full">
                    <div className="space-y-2">
                        <form onSubmit={handleAddLeaveType} className="mb-5">
                            <h2 className="text-lg font-bold mb-4">Type of Leaves</h2>

                            <input
                                type="text"
                                name="leavetype"
                                className="border w-6/12 border-gray-300 p-2 rounded "
                                placeholder="Add new leave type"
                            />
                            <button
                                type="submit"
                                className="ml-2 bg-defaultBg hover:bg-defaultBg/80 text-white font-bold py-2 px-6 rounded"
                            >
                                Add
                            </button>
                        </form>
                        <form onSubmit={handleAddHoliday}>
                            <h2 className="text-lg font-bold mb-4">Add new holiday</h2>
                            <input
                                type="date"
                                name="holidayDate"
                                className="border  border-gray-300 p-2 rounded "
                                placeholder="Choose a date"
                            />
                            <input
                                type="text"
                                name="holiday"
                                className="border w-6/12 ml-2 border-gray-300 p-2 rounded "
                                placeholder="Holiday title"
                            />
                            <button
                                type="submit"
                                className="ml-2 bg-defaultBg  hover:bg-defaultBg/80 text-white font-bold py-2 px-6 rounded"
                            >
                                Add
                            </button>
                        </form>
                        {Holiday.length > 0 &&
                            <div>
                                <button
                                    onClick={() => {
                                        setHoliday([]);
                                    }}
                                    className=" text-color-one float-right font-semibold"
                                >Clear all</button>
                                <ul>
                                    {Holiday?.map((holiday: any) => {
                                        return <li key={holiday.date}>
                                            {holiday.title}
                                            <button className='bg-gray-500 text-white p-1 rounded-full ml-3'
                                                onClick={() => {
                                                    setHoliday(Holiday.filter((data: any) => data.date !== holiday.date))
                                                }}
                                            >
                                                <FaTrash size={10} />
                                            </button>
                                        </li>
                                    })
                                    }
                                </ul>
                            </div>
                        }
                        {/* <h2 className="text-lg font-bold mb-4">Leave type restriction</h2> */}
                        {/* <form className="flex items-center space-x-2">
                            <select
                                className="border  border-gray-300 p-2 rounded "
                                multiple
                            >
                                <option>Select employee</option>
                                {employees?.map((user: any, index: number) => (
                                    <option value={user.id} key={index}>{user.name}</option>
                                ))}
                            </select>
                            <select
                                className="border  border-gray-300 p-2 rounded "
                                multiple
                            >
                                <option>Select leave type</option>
                                {leaveTypes?.map((type: any, index: number) => (
                                    <option value={type.id} key={index}>{type.title}</option>
                                ))}
                            </select>
                        </form> */}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 w-full">
                    <button
                        onClick={() => {
                            setDeletedTypes([]);
                            setState(true);
                        }}
                        className=" text-color-one float-right font-semibold"
                    >Clear</button>
                    <h2 className="text-lg font-bold mb-4">Number of Leaves </h2>

                    <div className="space-y-2">
                        {leaveTypes?.map((type: any, index: number) => (
                            <div className="flex items-center" key={index}>
                                <label className="w-32">{type.title}:</label>
                                <input type="number"
                                    onBlur={(e) => updateState}
                                    name={type.title.replaceAll(' ', '_')}
                                    defaultValue={type.count}
                                    className="border  border-gray-300 p-2 rounded"
                                />
                                <button className='bg-gray-500 text-white p-1 rounded-full ml-3'
                                    onClick={() => {
                                        type.id ?
                                            deleteType(type.id) :
                                            deleteType(type.title)
                                    }}
                                >
                                    <FaTrash size={10} />
                                </button>
                            </div>
                        ))}
                        {/* Add more types of leaves here */}
                    </div>
                </div>
            </div>
            {/* Add more settings sections */}
        </div>
    )
}
export default LeaveSettings