import React, { useState } from "react";
import { DataTable } from "../../../shared/ui/DataTable";
import { useDebounce } from "../hooks/useDebounce";
import { useBlockUser } from "../hooks/useBlockUser";
import { userColumns } from "../columns/userColumns";
import { Pagination } from "../../../shared/ui/Pagination";
import { useFetchUsers } from "../hooks/useFetchUsers";

interface UserTablePageProps {
  title: string;
  role: "user" | "mentor";
}

export const UserTablePage: React.FC<UserTablePageProps> = ({ title, role }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);
  const {users,loading,totalPages,setUsers} = useFetchUsers(role,debouncedSearch,page)
  const { blockUser } = useBlockUser();

  const handleBlock = async (id: string, currentStatus: boolean) => {
    const result = await blockUser(id, !currentStatus);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked: result.status } : u))
      );
    }
  };

  return (
    <div className="p-6 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <input
          type="text"
          placeholder={`Search ${role}s...`}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className="grow">
        {!loading && users.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No {role}s found.</p>
        ) : (
          <DataTable
            columns={userColumns}
            data={users}
            loading={loading}
            actions={(user) => (
              <button
                onClick={() => handleBlock(user.id, user.isBlocked)}
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
        )}
      </div>

      <div className="mt-6 h-10 flex items-center justify-center mb-7">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};