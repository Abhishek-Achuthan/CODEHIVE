import type { Column } from "../../../shared/ui/DataTable";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

export const userColumns: readonly Column<User>[] = [
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
    template: (value) => {
      const isBlocked = value as boolean;
      return (
        <span
          className={`font-medium ${isBlocked ? "text-red-600" : "text-green-600"}`}
        >
          {isBlocked ? "Blocked" : "Active"}
        </span>
      );
    },
  },
] as const;