import { useCallback, useEffect, useState } from "react";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";
import type { AdminUserListItemView } from "../../../shared/types/view/AdminUserListItemView";
import { mapAdminUserListItemToView } from "../../../shared/mappers/user.mapper";

export function useFetchUsers(role:'user' | 'mentor', search:string,page:number) {
    const [users,setUsers] =useState<AdminUserListItemView[]>([]);
    const [loading,setLoading] = useState(false);
    const [totalPages,setTotalPages] = useState(1);

    const fetchUsers = useCallback(async() => {
        setLoading(true);

        try {
            const data = await AdminService.listUsers(role,page,10,'createdAt',search);
             const items = Array.isArray(data?.items) ? data.items.map(mapAdminUserListItemToView) : [];
             setUsers(items);
             setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 1);
        } catch {
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