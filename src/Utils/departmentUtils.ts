import { useSelector } from "react-redux";
const useDepartment = ()=>{
    return useSelector((state:any)=>state.department)
}
const FindDepartment = (id: string,department:any): string | null => {
    const foundItem = department?.find((item: any) => item.id === id);
    return foundItem ? foundItem.title : '';
};

export {useDepartment,FindDepartment}