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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-50 sticky top-0 z-10 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className={`px-5 py-4 text-gray-700 font-medium whitespace-nowrap ${col.className}`}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-5 py-4 text-gray-700 font-medium whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          {data && (
            <tbody className="divide-y divide-gray-100">
              {data.map((item, index) => (
                <tr key={index} className=" hover:bg-gray-50 duration-200">
                  {renderRow(item, index)}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  )
}

export default Table
