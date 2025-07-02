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
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full overflow-x-auto">
        <thead className="bg-lamaSkyLight border-b border-ColorThree/20">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`px-4 py-3 text-left text-TextTwo font-semibold text-sm ${col.className}`}
              >
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-TextTwo font-semibold text-sm">
              Actions
            </th>
          </tr>
        </thead>
        {data.length !== 0 ? (
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  )
}

export default Table
