import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "../../../shared/ui/DataTable";
import type { Column } from "../../../shared/ui/DataTable";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";
import AdminLayout from "../../../layouts/AdminLayout";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  phone?: string; 
  password?: string; 
}

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async (role: string = "user") => {
    setLoading(true);
    try {
      const data = await AdminService.listUsers(role, page, 10, "createdAt", search);
      console.log("Fetched users:", data);
      
      setUsers(Array.isArray(data) ? data : data.users || []);
      
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); 

  const handleBlock = async (id: string,status:boolean) => {

    await AdminService.updateUserStatus(id,status);
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked:status} : u))
      );
      toast.success("User status updated");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user status");
      fetchUsers();
    }
  };

  const columns: readonly Column<User>[] = [
    {
      header: "Name",
      key: "firstName",
      template: (_value, row) => `${row.firstName} ${row.lastName}`,
    },
    { header: "Email", key: "email" },
    { header: "Role", key: "role" },
    {
      header: "Status",
      key: "isBlocked",
      template: (value) => {
        const isBlocked = value as boolean;
        return (
          <span
            className={`${
              isBlocked ? "text-red-600" : "text-green-600"
            } font-medium`}
          >
            {isBlocked ? "Blocked" : "Active"}
          </span>
        );
      },
    },
  ];

  return (
    <AdminLayout>
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <input
          type="text"
          placeholder="Search users..."
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {!loading && users.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No users found.</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            actions={(user) => (
              <button
                onClick={() => handleBlock(user.id,!user.isBlocked)}
                className={`px-3 py-1.5 rounded-md text-white text-xs font-semibold ${
                  user.isBlocked
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
            )}
          />

          <div className="flex justify-center items-center mt-4 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages <= 1} // Disable if no pagination
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
    </AdminLayout>
  );
};

export default UserManagementPage;