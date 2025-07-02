import Image from "next/image"

type TableSearchProps = {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

const TableSearch = ({ searchTerm, setSearchTerm }: TableSearchProps) => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[200px] py-2 pr-2 bg-transparent outline-none"
      />
    </div>
  )
}

export default TableSearch
