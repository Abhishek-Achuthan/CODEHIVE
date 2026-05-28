import React, { useState } from "react";
import { DataTable } from "../../../shared/ui/DataTable";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useBlockUser } from "../hooks/useBlockUser";
import { userColumns } from "../columns/userColumns";
import { Pagination } from "../../../shared/ui/Pagination";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { PageHeader } from "../../../shared/ui/PageHeader";
import { Search } from "lucide-react";

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
    <div className="flex flex-col min-h-screen">
      <PageHeader
        label=""
        title={title}
        description={`Manage and oversee platform ${role}s`}
      >
        <div className="group relative w-full sm:w-80">
          <div className="absolute inset-0 bg-indigo-500/5 blur-lg transition-colors group-focus-within:bg-indigo-500/10" />
          <input
            type="text"
            placeholder={`Search ${role}s...`}
            className="relative w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm font-medium text-white transition-all placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-indigo-400" />
        </div>
      </PageHeader>

      <div className="grow">
        {!loading && users.length === 0 ? (
          <p className="text-zinc-500 text-center py-6 font-medium">No {role}s found.</p>
        ) : (
          <DataTable
            columns={userColumns}
            data={users}
            loading={loading}
            actions={(user) => (
              <button
                onClick={() => handleBlock(user.id, user.isBlocked)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-lg ${
                  user.isBlocked
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 shadow-emerald-500/5 hover:shadow-emerald-500/10"
                    : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 shadow-rose-500/5 hover:shadow-rose-500/10"
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