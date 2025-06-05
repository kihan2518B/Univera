import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type DayType = {
  name: string
  label: string
  date: Date
}

type PaginationControlsProps = {
  handlePrevious: () => void
  handleNext: () => void
  rolling: DayType[]
  currentPage: number
  setCurrentPage: (page: number) => void
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  handlePrevious,
  handleNext,
  rolling,
  currentPage,
  setCurrentPage
}) => {
  return (
    <div className="flex items-center justify-center mb-8 px-1 xs:px-2 sm:px-4">
      <div
        className="backdrop-blur-lg rounded-2xl shadow-xl border-lamaSky p-1 xs:p-1.5 sm:p-2 border w-full max-w-2xl"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
      >
        <div className="flex items-center justify-between space-x-1 sm:space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 sm:p-3 rounded-xl text-Dark hover:scale-110 hover:bg-[#EDF9FD] transition-all duration-300 group flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex space-x-0.5 sm:space-x-1 flex-1 justify-center overflow-hidden">
            {rolling.map((day: any, index: number) => (
              <button
                key={day.name}
                onClick={() => setCurrentPage(currentPage - 1 + index)}
                className={`px-0.5 xs:px-1 sm:px-1.5 md:px-2 lg:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 min-w-0 flex-1 max-w-[65px] xs:max-w-[75px] sm:max-w-[90px] md:max-w-[120px] lg:max-w-[140px] ${
                  index === 1
                    ? "shadow-lg transform scale-105 text-white bg-ColorThree"
                    : "hover:scale-102 hover:shadow-sm bg-transparent text-TextTwo"
                }`}
              >
                <div className="text-center">
                  <div className="font-bold leading-tight text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm">
                    {day.label}
                  </div>
                  <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs opacity-80 mt-0.5">
                    {day.date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric"
                    })}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-2 sm:p-3 rounded-xl hover:scale-110 text-Dark hover:bg-[#EDF9FD] transition-all duration-300 group flex-shrink-0"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaginationControls
