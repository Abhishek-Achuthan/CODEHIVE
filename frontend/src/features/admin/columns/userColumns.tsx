import type { AdminUserListItemView } from "../../../shared/types/view/AdminUserListItemView";
import type { Column } from "../../../shared/ui/DataTable";


export const userColumns: readonly Column<AdminUserListItemView>[] = [
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
    header: "Role",
    key: "role",
  },
  {
    header: "Status",
    key: "isBlocked",
    template: (_value, row) => {
      const isBlocked = row.isBlocked;
      if (!isBlocked) {
        return <span className="font-medium text-green-600">Active</span>;
      }
      
      let banText = "Banned";
      if (row.banExpirationDate) {
        banText = `Banned until ${new Date(row.banExpirationDate).toLocaleDateString()}`;
      } else {
        banText = "Permanently Banned";
      }

      return (
        <div className="flex flex-col">
          <span className="font-medium text-red-600">{banText}</span>
          {row.banReason && <span className="text-xs text-gray-400 max-w-xs truncate" title={row.banReason}>{row.banReason}</span>}
        </div>
      );
    },
  },
  {
    header: "Warnings",
    key: "warnCount",
    template: (_value, row) => {
      if (!row.warnCount) return <span className="text-gray-500">-</span>;
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
          {row.warnCount} {row.warnCount === 1 ? 'Warning' : 'Warnings'}
        </span>
      );
    }
  }
] as const;