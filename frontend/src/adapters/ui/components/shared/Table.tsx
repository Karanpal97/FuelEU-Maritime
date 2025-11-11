/**
 * Table Component - Modern Dark Theme
 */
import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function Table<T>({ columns, data, emptyMessage = 'No data available' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-dark-border">
      <table className="min-w-full divide-y divide-dark-border">
        <thead className="bg-dark-surface/50 backdrop-blur-sm">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                  column.align === 'right'
                    ? 'text-right'
                    : column.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-dark-card/30 divide-y divide-dark-border">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-dark-surface flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-400">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr 
                key={rowIdx} 
                className="hover:bg-dark-hover/50 transition-all duration-200 group"
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-6 py-4 text-sm text-gray-300 ${
                      column.align === 'right'
                        ? 'text-right'
                        : column.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    }`}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[column.key as string] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

