import React from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

type SlotsContentProps = {
  sortedSlots: any[]
  getProxyStatusForSlot: (slot: any) => string
  openProxyDialog: (slot: any) => void
  ConfirmationDialogContent: React.FC<{
    action: string
    onConfirm: () => void
  }>
}

const SlotsContent: React.FC<SlotsContentProps> = ({
  sortedSlots,
  getProxyStatusForSlot,
  openProxyDialog
}) => {
  return (
    <div className="p-4 sm:p-6">
      {sortedSlots.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-blue-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-blue-100/50">
            <div className="flex items-center mb-3 sm:mb-0">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-black text-gray-800">
                {sortedSlots.length}{" "}
                {sortedSlots.length === 1 ? "Session" : "Sessions"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {["lecture", "lab", "seminar", "break"].map((tag) => {
                const count = sortedSlots.filter((slot) =>
                  slot.isProxy ? slot.slot.tag === tag : slot.tag === tag
                ).length
                if (count === 0) return null
                return (
                  <span
                    key={tag}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 shadow-sm`}
                  >
                    {count} {tag}
                    {count > 1 ? "s" : ""}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="space-y-4 md:space-y-6">
            {sortedSlots.map((slot) => {
              const proxyStatus = getProxyStatusForSlot(
                slot.isProxy ? slot.slot.id : slot.id
              )
              return (
                <div
                  key={slot.id}
                  className="group relative rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] border-l-4 md:border-l-6 overflow-hidden bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm hover:from-white hover:to-white/95 border border-gray-100/50"
                  style={{
                    borderLeftColor: "#CE93D8"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/20 pointer-events-none" />
                  <div className="relative p-4 md:p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-start space-x-3 md:space-x-4 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-black text-lg md:text-xl lg:text-2xl text-gray-800 transition-colors duration-300 leading-tight mb-1"
                              style={{
                                color: `var(--hover-color-${slot.isProxy ? slot.slot.id : slot.id}, #374151)`
                              }}
                            >
                              {slot.isProxy ? slot.slot.title : slot.title}
                            </h3>
                            <span
                              className="font-bold text-sm md:text-base lg:text-lg text-gray-600 transition-colors duration-300"
                              style={{
                                color: `var(--hover-color-light-${slot.isProxy ? slot.slot.id : slot.id}, #6b7280)`
                              }}
                            >
                              {slot.isProxy
                                ? slot.slot.class.name
                                : slot.class.name}
                            </span>
                          </div>
                        </div>
                        {!slot.isProxy && (
                          <div
                            className={`hidden sm:flex ${proxyStatus === "APPROVED" ? "sm:hidden" : ""}`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openProxyDialog(slot.id)}
                              className="font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-xl border-2 transition-all duration-300 hover:border-ColorTwo transform hover:text-ColorTwo hover:scale-105 shadow-sm hover:shadow-md whitespace-nowrap"
                            >
                              {proxyStatus === "DECLINE" ||
                              proxyStatus === "PENDING"
                                ? "Update Proxy"
                                : "Request Proxy"}
                            </Button>
                          </div>
                        )}
                        {slot.isProxy && (
                          <div className="hidden sm:flex items-center px-4 text-sm font-semibold text-gray-700">
                            Proxy Slot
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                          <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                              Time
                            </div>
                            <div className="font-bold text-sm md:text-base text-gray-800 truncate">
                              {slot.isProxy
                                ? slot.slot.startTime
                                : slot.startTime}{" "}
                              -{" "}
                              {slot.isProxy ? slot.slot.endTime : slot.endTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100/50 group-hover:from-red-100 group-hover:to-pink-100 transition-all duration-300">
                          <div className="flex-shrink-0 p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-300">
                            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-red-600 font-medium uppercase tracking-wide">
                              Location
                            </div>
                            <div className="font-bold text-sm md:text-base text-gray-800 truncate">
                              {slot.isProxy
                                ? slot.slot.location
                                : slot.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <div
                            className={`w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider bg-purple-100 text-purple-800 shadow-md ring-1 ring-white/30 transform group-hover:scale-105 transition-all duration-300`}
                          >
                            <span>
                              {slot.isProxy ? slot.slot.tag : slot.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!slot.isProxy && (
                        <div
                          className={`sm:hidden flex justify-center pt-2 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300 ${proxyStatus === "APPROVED" ? "hidden" : ""}`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openProxyDialog(slot.id)}
                            className="font-semibold px-6 py-2.5 rounded-xl border-2 transition-all duration-300 hover:border-ColorTwo transform hover:text-ColorTwo hover:scale-105 shadow-sm hover:shadow-md w-full max-w-xs"
                          >
                            {proxyStatus === "DECLINE" ||
                            proxyStatus === "PENDING"
                              ? "Update Proxy"
                              : "Request Proxy"}
                          </Button>
                        </div>
                      )}
                      {slot.isProxy && (
                        <div className="sm:hidden flex justify-center pt-2 border-t border-gray-100 text-sm font-semibold text-gray-700">
                          Proxy Slot
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to right, transparent,"#CE93D8"40, transparent)`
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 lg:py-24">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
              <Calendar className="w-full h-full text-blue-500" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-3 sm:mb-4 text-gray-800">
            No Classes Scheduled
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-md mx-auto px-4">
            You have a free day! Perfect time to relax or catch up on other
            tasks.
          </p>
        </div>
      )}
    </div>
  )
}

export default SlotsContent
