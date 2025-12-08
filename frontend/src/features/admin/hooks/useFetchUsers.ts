


import { useCallback, useEffect, useState } from "react";
import type { User } from "../../../shared/types/domain/user";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";

export function useFetchUsers(role:'user' | 'mentor', search:string,page:number) {
    const [users,setUsers] =useState<User[]>([]);
    const [loading,setLoading] = useState(false);
    const [totalPages,setTotalPages] = useState(1);

    const fetchUsers = useCallback(async() => {
        setLoading(true);

        try {
            const data = await AdminService.listUsers(role,page,10,'createdAt',search);
             setUsers(data.users || []);
             setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.log(`Error fetching ${role}s :`,error);
            toast.error(`Failed to load ${role}s`);
            setUsers([]);
        }finally{
            setLoading(false);
        }
    },[role,page,search]);

    useEffect(() => {
        fetchUsers();
    },[fetchUsers]);

    return {users,loading,totalPages,setUsers}
}