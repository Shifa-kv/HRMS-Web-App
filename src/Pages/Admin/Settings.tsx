import { useEffect, useState } from "react";
import Header from "../../Components/Admin/Header"
import { firestore } from "../../Firebase/Config";
import Notice from "../../Components/Notice";

const Settings = () => {
    const [leaveTypes, setLeaveTypes] = useState<any>([]);
    // const [newLeaveType, setNewLeaveType] = useState('');
    useEffect(() => {
        firestore.collection("leave_type").onSnapshot((snapshot) => {
            const userData = snapshot.docs.map((snapshot) => {
                return { ...snapshot.data(), id: snapshot.id }
            })
            setLeaveTypes(userData);
        })
    }, [])

    const handleAddLeaveType = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const leavetype = e.currentTarget.elements.namedItem('leavetype') as HTMLInputElement;
        const value = leavetype.value;
        setLeaveTypes((prevTypes: any) => prevTypes.concat({ title: value, count: 0, status: false }));
    };
    const onLeaveSubmit = async () => {
        console.log(1)
        const batch = firestore.batch();

        leaveTypes.forEach((doc: any) => {
            console.log(2, doc.id)
            const docRef = firestore.collection('leave_type').doc(doc.id);
            const { title, status, count } = doc
            batch.set(docRef, { title, status, count }, { merge: true });
        });

        try {
            await batch.commit();
            console.log('Batch update successful!');
        } catch (error) {
            console.error('Error updating documents:', error);
        }
    };

    const updateState = (e: React.ChangeEvent<HTMLInputElement>, updateType: string) => {
        e.stopPropagation();
        const { value, checked } = e.currentTarget;
        const name = e.currentTarget.getAttribute('name'); // Get the name attribute from the input element
        console.log(1, checked, name)

        const updatedType = leaveTypes.map((type: any) => {
            if (type.title.replaceAll(' ', '_') == name) {
                if (updateType == 'status') {
                    return ({ ...type, status: checked });
                }
                if (updateType == 'count') {
                    return ({ ...type, count: value });
                }
            }
            return type
        })
        setLeaveTypes(updatedType);
    }
    console.log(leaveTypes)
    return (
        <section >
            <Header />
            <div className='bg-defaultBg  py-10'>
                <div className='container flex justify-between'>
                    <div>
                        <h1 className=' text-3xl text-amber-100 font-thin'>Settings</h1>
                    </div>
                </div>
            </div>
            <div className=" mx-auto container bg-gradient-to-b from-defaultBg to-transparent to-[130px] from-[1.5rem]">
                <Notice typeProp="settings" />
                <div className="bg-color-one flex items-center justify-between py-2 px-6 rounded-lg mb-4">
                    <h2 className="text-white mb-0">Leave settings</h2>
                    <button onClick={() => onLeaveSubmit()} className="bg-defaultBg text-white py-3 px-6 rounded-lg font-bold uppercase">Save</button>
                </div>
                <div className="flex space-x-5">
                    <div className="bg-white rounded-lg shadow-md p-6 w-full">
                        <h2 className="text-lg font-bold mb-4">Type of Leaves</h2>
                        <div className="space-y-2">
                            {leaveTypes?.map((type: any, index: number) => (
                                <div key={index} className="flex items-center">
                                    <input type="checkbox"
                                        className="form-checkbox h-5 w-5 "
                                        defaultChecked={type.status}
                                        name={type.title.replaceAll(' ', '_')}
                                        onChange={(e) => updateState(e, 'status')}
                                    />
                                    <label className="ml-2">{type.title}</label>
                                </div>
                            ))}

                            <form onSubmit={handleAddLeaveType} className="flex items-center">
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

                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 w-full">
                        <h2 className="text-lg font-bold mb-4">Number of Leaves </h2>
                        <div className="space-y-2">
                            {leaveTypes.map((type: any, index: number) => (
                                <div className="flex items-center" key={index}>
                                    <label className="w-32">{type.title}:</label>
                                    <input type="number"
                                        onBlur={(e) => updateState(e, 'count')}
                                        name={type.title.replaceAll(' ', '_')}
                                        defaultValue={type.count}
                                        className="border  border-gray-300 p-2 rounded"
                                    />
                                </div>
                            ))}
                            {/* Add more types of leaves here */}
                        </div>
                    </div>
                </div>
                {/* Add more settings sections */}
            </div>


        </section>
    )
}
export default Settings