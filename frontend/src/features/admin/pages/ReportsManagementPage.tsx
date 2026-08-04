import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getReports, updateReportStatus, banUser, warnUser, getRoomChatHistory } from '../../../api/endpoints/adminApi';
import { BaseError } from '../../../shared/errors/BaseError';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../shared/ui/dialog/Dialog';
import AdminLayout from '../../../layouts/AdminLayout';

export const ReportsManagementPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  
  // Modals state
  const [selectedUserForAction, setSelectedUserForAction] = useState<{ userId: string, reportId: string } | null>(null);
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [banDuration, setBanDuration] = useState<number | null>(null);

  const limit = 10;

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getReports(page, limit);
      setReports(res.data.data);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (error) {
      toast.error(error instanceof BaseError ? error.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      await updateReportStatus(reportId, status);
      toast.success(`Report marked as ${status}`);
      fetchReports();
    } catch (error) {
      toast.error('Failed to update report status');
    }
  };

  const handleWarnSubmit = async () => {
    if (!selectedUserForAction || !actionReason.trim()) return;
    try {
      await warnUser(selectedUserForAction.userId, actionReason);
      await updateReportStatus(selectedUserForAction.reportId, 'RESOLVED');
      toast.success('User warned successfully');
      setIsWarnModalOpen(false);
      setActionReason('');
      setSelectedUserForAction(null);
      fetchReports();
    } catch (error) {
      toast.error('Failed to warn user');
    }
  };

  const handleBanSubmit = async () => {
    if (!selectedUserForAction || !actionReason.trim()) return;
    try {
      await banUser(selectedUserForAction.userId, banDuration, actionReason);
      await updateReportStatus(selectedUserForAction.reportId, 'RESOLVED');
      toast.success('User banned successfully');
      setIsBanModalOpen(false);
      setActionReason('');
      setBanDuration(null);
      setSelectedUserForAction(null);
      fetchReports();
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleDismissReport = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to dismiss this report?')) return;
    await handleUpdateStatus(reportId, 'RESOLVED');
  };

  const handleViewChatHistory = async (roomId: string) => {
    setSelectedRoomId(roomId);
    setLoadingChat(true);
    setChatHistory([]);
    try {
      const res = await getRoomChatHistory(roomId);
      setChatHistory(res.data);
    } catch (error) {
      toast.error('Failed to load chat history');
    } finally {
      setLoadingChat(false);
    }
  };

  if (loading && reports.length === 0) {
    return (
      <AdminLayout>
        <div className="p-6">Loading reports...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Reports Management</h1>
      </div>

      <div className="bg-[#1c2128] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#22272e] border-b border-gray-800 text-sm font-semibold text-gray-400">
                <th className="p-4">Reported User</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Room</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-[#22272e]/50 transition-colors">
                  <td className="p-4">
                    {report.reportedUser ? (
                      <div>
                        <div className="font-medium text-gray-200">{report.reportedUser.name}</div>
                        <div className="text-xs text-gray-500">{report.reportedUser.email}</div>
                      </div>
                    ) : 'Unknown'}
                  </td>
                  <td className="p-4">
                    {report.reporter ? (
                      <div>
                        <div className="font-medium text-gray-200">{report.reporter.name}</div>
                        <div className="text-xs text-gray-500">{report.reporter.email}</div>
                      </div>
                    ) : 'Unknown'}
                  </td>
                  <td className="p-4 text-blue-400">
                    {report.room?.title || 'Unknown Room'}
                  </td>
                  <td className="p-4 max-w-xs truncate" title={report.description}>
                    <span className="font-medium">{report.reason}</span>
                    {report.description && <span className="text-gray-500 block truncate">{report.description}</span>}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                        report.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                        report.status === 'REVIEWED' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {report.status}
                      </span>
                      {report.resolvedBy && (
                         <span className="text-xs text-gray-500">Resolved by Admin</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {report.status !== 'RESOLVED' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewChatHistory(report.room?.id)}
                          className="px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded text-xs font-medium transition-colors"
                        >
                          View Chat
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserForAction({ userId: report.reportedUser?.id, reportId: report.id });
                            setActionReason('');
                            setIsWarnModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded text-xs font-medium transition-colors"
                        >
                          Warn
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserForAction({ userId: report.reportedUser?.id, reportId: report.id });
                            setActionReason('');
                            setBanDuration(null);
                            setIsBanModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded text-xs font-medium transition-colors"
                        >
                          Ban User
                        </button>
                        <button
                          onClick={() => handleDismissReport(report.id)}
                          className="px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-[#22272e] rounded border border-gray-800 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-[#22272e] rounded border border-gray-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Chat History Modal */}
      <Dialog open={!!selectedRoomId} onOpenChange={(open) => !open && setSelectedRoomId(null)}>
        <DialogContent className="bg-[#0d1117] border-gray-800 text-white max-w-2xl p-0 overflow-hidden rounded-2xl h-[80vh] flex flex-col">
          <div className="bg-[#161b22] px-6 py-4 border-b border-gray-800 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Room Chat History</DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loadingChat ? (
              <div className="text-center text-gray-500 py-8">Loading chat history...</div>
            ) : chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No messages found in this room.</div>
            ) : (
              chatHistory.map((msg: any) => (
                <div key={msg.id} className={`p-3 rounded-lg border ${msg.isDeleted ? 'bg-red-500/5 border-red-500/20' : 'bg-[#161b22] border-gray-800'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm text-gray-300">{msg.senderName}</span>
                    <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className={`text-sm ${msg.isDeleted ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
                    {msg.content}
                  </p>
                  {msg.isDeleted && <div className="text-xs text-red-400 mt-1">Deleted</div>}
                </div>
              ))
            )}
          </div>
          
          <DialogFooter className="bg-[#161b22] p-4 border-t border-gray-800 flex-shrink-0">
            <button
              onClick={() => setSelectedRoomId(null)}
              className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                className="w-full bg-[#161b22] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
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
                className="w-full bg-[#161b22] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
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
                className="w-full bg-[#161b22] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
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
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              Apply Ban
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
};
