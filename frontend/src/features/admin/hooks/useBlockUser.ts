import { useCallback, useState } from "react";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";


export function useBlockUser () {

    const [loading,setLoading] = useState(false);

    const blockUser = useCallback(async(id:string,status:boolean)=> {
        setLoading(true);
        try {
            await AdminService.updateUserStatus(id,status);
            toast.success('User status updated successFully');
            return{success:true,status}
        } catch {
            toast.error("Failed to update user status");
            return {success:false,status:!status};
        }finally{
            setLoading(false);
        }
    },[]);

    return {blockUser,loading}
    
}