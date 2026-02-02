import React, { useState } from "react";
import { DataTable } from "../../../shared/ui/DataTable";
import { useDebounce } from "../hooks/useDebounce";
import { applicationColumns } from "../columns/applicationColumns";
import { Pagination } from "../../../shared/ui/Pagination";
import { useFetchMentorApplications } from "../hooks/useFetchMentorApplications";
import { useUpdateMentorStatus } from "../hooks/useUpdateMentorStatus";

export const MentorApplicationsPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);
    const { applications, loading, totalPages, setApplications } = useFetchMentorApplications(debouncedSearch, page);
    const { updateStatus } = useUpdateMentorStatus();

    const handleApprove = async (id: string) => {
        const result = await updateStatus(id, 'approved');
        if (result.success) {
            // Remove from list after approval
            setApplications((prev) => prev.filter((app) => app.id !== id));
        }
    };

    const handleReject = async (id: string) => {
        const result = await updateStatus(id, 'rejected');
        if (result.success) {
            // Remove from list after rejection
            setApplications((prev) => prev.filter((app) => app.id !== id));
        }
    };

    return (
        <div className="p-6 flex flex-col min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Mentor Applications</h1>
                <input
                    type="text"
                    placeholder="Search applications..."
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                />
            </div>

            <div className="grow">
                {!loading && applications.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No pending applications found.</p>
                ) : (
                    <DataTable
                        columns={applicationColumns}
                        data={applications}
                        loading={loading}
                        actions={(application) => (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(application.id)}
                                    className="px-3 py-1.5 rounded-md text-white text-xs font-semibold bg-green-500 hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(application.id)}
                                    className="px-3 py-1.5 rounded-md text-white text-xs font-semibold bg-red-500 hover:bg-red-600"
                                >
                                    Reject
                                </button>
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
        </div>
    );
};
