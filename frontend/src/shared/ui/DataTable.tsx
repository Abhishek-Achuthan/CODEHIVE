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
        className="flex min-h-[300px] items-center justify-center text-center text-zinc-500 font-medium bg-white/[0.01] rounded-2xl border border-white/5"
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
        className="flex min-h-[300px] flex-col items-center justify-center text-center text-zinc-500 font-medium bg-white/[0.01] rounded-2xl border border-dashed border-white/10"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl relative mb-4">
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
          <span className="relative z-10 text-2xl text-zinc-600">--</span>
        </div>
        No records found.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/40 shadow-xl backdrop-blur-xl"
    >
      <table className="min-w-full text-sm text-left">
        <motion.thead
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] text-zinc-400 uppercase text-[10px] tracking-[0.1em] font-semibold border-b border-white/10"
        >
          <tr>
            {columns.map((col, index) => (
              <motion.th
                key={String(col.key)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4"
              >
                {col.header}
              </motion.th>
            ))}
            {actions && (
              <motion.th
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: columns.length * 0.05 }}
                className="px-6 py-4 text-center"
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
                className="border-b border-white/5 text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-all duration-200 last:border-0"
              >
                {columns.map((col) => {
                  const cellValue = row[col.key];

                  return (
                    <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap">
                      {col.template
                        ? col.template(cellValue, row)
                        : String(cellValue ?? "")}
                    </td>
                  );
                })}

                {actions && (
                  <td className="px-6 py-4 text-center whitespace-nowrap">{actions(row)}</td>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
}