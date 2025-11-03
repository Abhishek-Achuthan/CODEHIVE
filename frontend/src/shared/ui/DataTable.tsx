import React from "react";

// Column definition for the table
export interface Column<T> {
  header: string;
  key: keyof T;
  template?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: readonly Column<T>[];
  data: T[];
  loading?: boolean;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  actions,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">Loading data...</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">No records found.</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50 transition text-white hover:text-black">
              {columns.map((col) => {
                const cellValue = row[col.key];
                
                return (
                  <td key={String(col.key)} className="px-4 py-3">
                    {col.template
                      ? col.template(cellValue, row)
                      : String(cellValue ?? "")}
                  </td>
                );
              })}

              {actions && (
                <td className="px-4 py-3 text-center">{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}