import React, { useState } from "react";
import { DataTable } from "../../../shared/ui/DataTable";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { userColumns } from "../columns/userColumns";
import { Pagination } from "../../../shared/ui/Pagination";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { PageHeader } from "../../../shared/ui/PageHeader";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../shared/ui/dialog/Dialog";
import { AdminService } from "../../../services/adminService";
import toast from "react-hot-toast";

interface UserTablePageProps {
  title: string;
  role: "user" | "mentor";
}

export const UserTablePage: React.FC<UserTablePageProps> = ({ title, role }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);
  const {users,loading,totalPages,setUsers} = useFetchUsers(role,debouncedSearch,page)

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [banDuration, setBanDuration] = useState<number | null>(null);

  const handleUnban = async (id: string) => {
    if (!window.confirm("Are you sure you want to unban this user?")) return;
    try {
      await AdminService.unbanUser(id);
      toast.success("User unbanned successfully");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isBlocked: false, banExpirationDate: null, banReason: null, bannedAt: null } : u)));
    } catch (error) {
      toast.error("Failed to unban user");
    }
  };

  const handleWarnSubmit = async () => {
    if (!selectedUser || !actionReason.trim()) return;
    try {
      await AdminService.warnUser(selectedUser, actionReason);
      toast.success("User warned successfully");
      setUsers((prev) => prev.map((u) => (u.id === selectedUser ? { ...u, warnCount: (u.warnCount || 0) + 1 } : u)));
      setIsWarnModalOpen(false);
      setActionReason("");
      setSelectedUser(null);
    } catch (error) {
      toast.error("Failed to warn user");
    }
  };

  const handleBanSubmit = async () => {
    if (!selectedUser || !actionReason.trim()) return;
    try {
      await AdminService.banUser(selectedUser, banDuration, actionReason);
      toast.success("User banned successfully");
      const expirationDate = banDuration ? new Date(Date.now() + banDuration * 24 * 60 * 60 * 1000).toISOString() : null;
      setUsers((prev) => prev.map((u) => (u.id === selectedUser ? { ...u, isBlocked: true, banExpirationDate: expirationDate, banReason: actionReason } : u)));
      setIsBanModalOpen(false);
      setActionReason("");
      setBanDuration(null);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Failed to ban user");
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
              <div className="flex gap-2">
                {!user.isBlocked && (
                  <button
                    onClick={() => {
                      setSelectedUser(user.id);
                      setActionReason("");
                      setIsWarnModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 transition-all shadow-lg shadow-amber-500/5"
                  >
                    Warn
                  </button>
                )}
                {user.isBlocked ? (
                  <button
                    onClick={() => handleUnban(user.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all shadow-lg shadow-emerald-500/5"
                  >
                    Unban
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedUser(user.id);
                      setActionReason("");
                      setBanDuration(null);
                      setIsBanModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all shadow-lg shadow-rose-500/5"
                  >
                    Ban
                  </button>
                )}
              </div>
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

      {/* Warn Modal */}
      <Dialog open={isWarnModalOpen} onOpenChange={setIsWarnModalOpen}>
        <DialogContent className="bg-[#0d1117] border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Warn User</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Warning</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full bg-[#161b22] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500"
                rows={3}
                placeholder="Explain why the user is being warned..."
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsWarnModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleWarnSubmit}
              disabled={!actionReason.trim()}
              className="px-4 py-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              Issue Warning
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Modal */}
      <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
        <DialogContent className="bg-[#0d1117] border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
              <select
                value={banDuration === null ? 'indefinite' : banDuration}
                onChange={(e) => setBanDuration(e.target.value === 'indefinite' ? null : Number(e.target.value))}
                className="w-full bg-[#161b22] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="1">1 Day</option>
                <option value="3">3 Days</option>
                <option value="7">1 Week</option>
                <option value="30">1 Month</option>
                <option value="indefinite">Indefinite (Permanent)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Ban</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full bg-[#161b22] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500"
                rows={3}
                placeholder="Explain why the user is being banned..."
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsBanModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBanSubmit}
              disabled={!actionReason.trim()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              Apply Ban
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};