import { useEffect, useState } from 'react'
import Notice from '../Notice';
import { firestore } from '../../Firebase/Config';
import { useDispatch } from 'react-redux';
import { setNotice } from '../../Store/noticeSlice';

const DepartmentUploadForm = ({ closeModal }: { closeModal?: () => void }) => {
    const [Managers, setManagers] = useState<{ [key: string]: string }[]>([]);
    const dispatch = useDispatch();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const nameInput = e.currentTarget.elements.namedItem('name') as HTMLInputElement;
        const headInput = e.currentTarget.elements.namedItem('head') as HTMLInputElement;
        if (nameInput?.value == '') {
            dispatch(setNotice({ name: 'addDepartment', msg: 'Please fill all fields.', code: 1 }));
        }
        else {
            firestore.collection("departments").add({
                department_name: nameInput.value,
                department_head: headInput.value
            }).then((docRef) => {
                dispatch(setNotice({ name: 'addDepartment', msg: 'Department added successfully!', code: 3, time: 3000 }));
                setTimeout(() => {
                    closeModal?.();
                }, 3000);
            }).catch((error) => {
                console.error("Error adding document: ", error);
                dispatch(setNotice({ name: 'addDepartment', msg: error.message, code: 1 }));
            });
        }
    }
    // get managers data & department data from database
    useEffect(() => {
        firestore.collection('users').where("isManager", "==", true)
            .get().then((snapshot) => {
                const managerEntries = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setManagers(managerEntries);
            })
    }, [])

    return (
        <div>
            <div className="fixed inset-0 grid overflow-y-auto	py-5 items-center justify-center z-50 bg-[#0000008c]">
                <div className="bg-white p-8 rounded shadow-md relative ">
                    <button className="mt-4 bg-black rounded-full text-xs absolute right-2 top-1 text-white font-bold py-1 px-2 " onClick={closeModal}>
                        X
                    </button>
                    <h1 className="text-2xl font-bold  mb-5">Add Department</h1>
                    <Notice typeProp='addDepartment' />
                    <form onSubmit={handleSubmit} className='mt-3'>
                        <div className="mb-4 space-y-3 block">
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Department Name*"
                                className="border w-full border-gray-300 p-2 rounded"
                            />
                            <select name='head' className="border w-full border-gray-300 p-2 rounded">
                                <option value='' >Department head</option>
                                {Managers && Managers?.map((user, index) => {
                                    return <option value={user.id} key={index}>{user.name}</option>
                                })
                                }
                            </select>
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
    )
}
export default DepartmentUploadForm