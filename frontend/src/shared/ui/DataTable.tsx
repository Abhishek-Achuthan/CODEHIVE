import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-4 text-gray-500"
      >
        Loading data...
      </motion.div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-center py-4 text-gray-500"
      >
        No records found.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm"
    >
      <table className="min-w-full text-sm text-left">
        <motion.thead
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-100 text-gray-700 uppercase text-xs"
        >
          <tr>
            {columns.map((col, index) => (
              <motion.th
                key={String(col.key)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-3 font-medium"
              >
                {col.header}
              </motion.th>
            ))}
            {actions && (
              <motion.th
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: columns.length * 0.05 }}
                className="px-4 py-3 font-medium text-center"
              >
                Actions
              </motion.th>
            )}
          </tr>
        </motion.thead>

        <tbody>
          <AnimatePresence mode="popLayout">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  delay: rowIndex * 0.05,
                  duration: 0.3,
                }}
                  className="border-t text-white hover:bg-gray-50 hover:text-black transition-colors duration-200"
              >
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
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
}