import type { Column } from "../../../shared/ui/DataTable";
import type { MentorApplicationView } from "../../../shared/types/view/MentorApplicationView";

export const applicationColumns: readonly Column<MentorApplicationView>[] = [
    {
        header: "Name",
        key: "firstName",
        template: (_value, row) => `${row.firstName} ${row.lastName}`,
    },
    {
        header: "Email",
        key: "email",
    },
    {
        header: "Applied Date",
        key: "mentorAppliedAt",
        template: (value) => {
            const date = value as Date;
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date);
        },
    },
    {
        header: "Status",
        key: "mentorStatus",
        template: (value) => {
            const status = value as string;
            return (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {status}
                </span>
            );
        },
    },
] as const;
