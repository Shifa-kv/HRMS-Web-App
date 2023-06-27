import { useState,useEffect } from 'react'

const EmployeeUploadForm = ({closeModal}:{closeModal?:()=>void}) => {

    const [validationErrors, setValidationErrors] = useState({})
    type EmployeeFormData = {
        [key: string]: string;
      };
      
        const [data, setData] = useState<EmployeeFormData>({});
      
        const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
          setData((prevData) => ({ ...prevData, [e.currentTarget.name]: e.currentTarget.value }));
        };
    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        console.log(data)
    }

    return (
        <div>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded shadow-md">
                        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={closeModal}>
                            Close
                        </button>
                        <h1 className="text-2xl font-bold mb-4">Employee Upload</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="firstNameInput" className="block font-medium mb-2">
                                    First Name:
                                </label>
                                <input
                                    id="firstNameInput"
                                    type="text"
                                    name="firstName"
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="lastNameInput" className="block font-medium mb-2">
                                    Last Name:
                                </label>
                                <input
                                    id="lastNameInput"
                                    type="text"
                                    name="lastName"
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="emailInput" className="block font-medium mb-2">
                                    Email:
                                </label>
                                <input
                                    id="emailInput"
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phoneNumberInput" className="block font-medium mb-2">
                                    Phone Number:
                                </label>
                                <input
                                    id="phoneNumberInput"
                                    type="text"
                                    name="phoneNumber"
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="addressInput" className="block font-medium mb-2">
                                    Address:
                                </label>
                                <input
                                    id="addressInput"
                                    type="text"
                                    name="address"
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Upload
                            </button>
                        </form>
                    </div>
                </div>
         
        </div>
    )
}
export default EmployeeUploadForm