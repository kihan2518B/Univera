import React from "react"

const Table = ({
  columns,
  renderRow,
  data
}: {
  columns: { header: string; accessor: string; className?: string }[]
  renderRow: (item: any, index?: number) => React.ReactNode
  data: any[]
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className={`px-6 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ${col.className}`}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          {data && (
            <tbody className="divide-y divide-gray-100">
              {data.map((item, index) => renderRow(item, index))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  )
}

export default Table
