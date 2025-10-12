// "use client"

// import React, { useState } from "react"
// import { Calendar } from "@/components/ui/calendar"
// import { format } from "date-fns"

// export default function AnnouncementsList({
//   announcements
// }: {
//   announcements: any[]
// }) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

//   // Filter announcements based on selected date
//   const filteredAnnouncements = selectedDate
//     ? announcements.filter((a) => {
//         if (!a.date) return false
//         const announcementDate = new Date(a.date)
//         return (
//           announcementDate.getFullYear() === selectedDate.getFullYear() &&
//           announcementDate.getMonth() === selectedDate.getMonth() &&
//           announcementDate.getDate() === selectedDate.getDate()
//         )
//       })
//     : announcements

//   return (
//     <div className="bg-card rounded-2xl p-4 border shadow-sm">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-lg font-semibold">Latest Announcements</h3>
//         <span className="text-sm text-muted-foreground">
//           {filteredAnnouncements?.length ?? 0}
//         </span>
//       </div>

//       {/* Calendar shown at the top */}
//       <div className="mb-4 flex justify-center">
//         <Calendar
//           mode="single"
//           selected={selectedDate}
//           onSelect={setSelectedDate}
//           initialFocus
//         />
//       </div>

//       <div className="space-y-3 max-h-80 overflow-auto">
//         {filteredAnnouncements?.map((a: any) => (
//           <div key={a.id} className="p-3 border rounded-lg bg-background">
//             <div className="flex justify-between items-start gap-3">
//               <div>
//                 <h4 className="font-semibold text-foreground">{a.title}</h4>
//                 {a.description && (
//                   <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
//                     {a.description}
//                   </p>
//                 )}
//               </div>
//               <div className="text-xs text-muted-foreground">
//                 {format(new Date(a.date), "PPP")}
//               </div>
//             </div>
//             <div className="flex gap-2 mt-2 flex-wrap">
//               <span className="px-2 py-0.5 rounded-full bg-secondary text-xs">
//                 {a.category}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-accent text-xs">
//                 {a.announcerName}
//               </span>
//             </div>
//           </div>
//         ))}

//         {filteredAnnouncements?.length === 0 && (
//           <div className="text-sm text-muted-foreground">
//             No announcements found.
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"
import React, { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Bell,
  Calendar as CalendarIcon,
  X,
  ChevronDown,
  Clock,
  User,
  Tag,
  Search,
  FilterX
} from "lucide-react"

export default function AnnouncementsList({
  announcements
}: {
  announcements: any[]
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Get unique categories for filtering
  const categories = Array.from(
    new Set(announcements?.map((a) => a.category) || [])
  )

  // Filter announcements based on selected date, category, and search
  const filteredAnnouncements =
    announcements?.filter((a) => {
      if (!a) return false

      // Date filter
      if (selectedDate && a.date) {
        const announcementDate = new Date(a.date)
        const dateMatch =
          announcementDate.getFullYear() === selectedDate.getFullYear() &&
          announcementDate.getMonth() === selectedDate.getMonth() &&
          announcementDate.getDate() === selectedDate.getDate()
        if (!dateMatch) return false
      }

      // Category filter
      if (selectedCategory && a.category !== selectedCategory) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const titleMatch = a.title?.toLowerCase().includes(query)
        const descriptionMatch = a.description?.toLowerCase().includes(query)
        const announcerMatch = a.announcerName?.toLowerCase().includes(query)
        if (!titleMatch && !descriptionMatch && !announcerMatch) return false
      }

      return true
    }) || []

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          badge:
            "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
          indicator: "bg-gradient-to-b from-red-400 to-red-600",
          glow: "shadow-red-100"
        }
      case "medium":
        return {
          badge:
            "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
          indicator: "bg-gradient-to-b from-amber-400 to-amber-600",
          glow: "shadow-amber-100"
        }
      case "low":
        return {
          badge:
            "bg-green-50 text-green-700 border border-green-200 ring-1 ring-green-100",
          indicator: "bg-gradient-to-b from-green-400 to-green-600",
          glow: "shadow-green-100"
        }
      default:
        return {
          badge:
            "bg-gray-50 text-gray-700 border border-gray-200 ring-1 ring-gray-100",
          indicator: "bg-gradient-to-b from-gray-400 to-gray-600",
          glow: "shadow-gray-100"
        }
    }
  }

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      Academic:
        "bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-100",
      Event:
        "bg-green-50 text-green-700 border border-green-200 ring-1 ring-green-100",
      Facility:
        "bg-orange-50 text-orange-700 border border-orange-200 ring-1 ring-orange-100",
      Workshop:
        "bg-purple-50 text-purple-700 border border-purple-200 ring-1 ring-purple-100",
      Finance:
        "bg-pink-50 text-pink-700 border border-pink-200 ring-1 ring-pink-100"
    }
    return (
      colorMap[category] ||
      "bg-gray-50 text-gray-700 border border-gray-200 ring-1 ring-gray-100"
    )
  }

  const clearAllFilters = () => {
    setSelectedDate(undefined)
    setSelectedCategory(null)
    setSearchQuery("")
  }

  const hasActiveFilters = selectedDate || selectedCategory || searchQuery

  return (
    <div className="bg-white rounded-2xl border h-full border-gray-200 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                Announcements
              </h3>
              <p className="text-purple-100 text-sm font-medium">
                Stay updated with latest news & events
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {filteredAnnouncements.length}
            </div>
            <div className="text-purple-200 text-sm font-medium">
              {hasActiveFilters ? "Filtered" : "Total"}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        {/* Search Bar with Enhanced Styling */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search announcements, announcer, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filter Controls with Enhanced Styling */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Date Filter Button */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`group flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 font-medium ${
              selectedDate
                ? "bg-purple-100 text-purple-700 border-purple-300 shadow-sm ring-1 ring-purple-100"
                : "bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-200 text-gray-700 shadow-sm"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm">
              {selectedDate
                ? format(selectedDate, "MMM dd, yyyy")
                : "Select Date"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${showCalendar ? "rotate-180" : ""} group-hover:scale-110`}
            />
          </button>

          {/* Enhanced Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium shadow-sm hover:bg-purple-50 transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 text-sm font-medium border border-gray-200 shadow-sm"
            >
              <FilterX className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Active Filters Display with Enhanced Styling */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <span className="text-xs font-medium text-gray-500 mr-2">
              Active Filters:
            </span>
            {selectedDate && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200 shadow-sm">
                📅 {format(selectedDate, "MMM dd, yyyy")}
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="ml-2 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200 shadow-sm">
                🏷️ {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200 shadow-sm">
                🔍 &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Calendar Dropdown with Enhanced Animation */}
        {showCalendar && (
          <div className="mt-4 relative">
            <div className="absolute top-0 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 p-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Select Date</h4>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  setShowCalendar(false)
                }}
                initialFocus
                className="mx-auto"
              />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Announcements List */}
      <div className="p-4  h-full">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-lg">
              <Bell className="w-10 h-10 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              No announcements found
            </h4>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
              {hasActiveFilters
                ? "We couldn't find any announcements matching your current filters. Try adjusting them to see more results."
                : "There are no announcements available at the moment. Check back later for updates."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="w-4 h-4 mr-2" />
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 overflow-y-scroll max-h-[500px] scrollbar-hide">
            {filteredAnnouncements.map((announcement: any) => {
              const priorityStyle = getPriorityStyle(announcement.priority)
              const isRecent =
                announcement.date &&
                new Date(announcement.date) >
                  new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
              const categoryColor = getCategoryColor(announcement.category)

              return (
                <div
                  key={announcement.id}
                  className={`group relative bg-white border border-gray-200 rounded-xl p-4 
                    hover:shadow-xl hover:border-purple-200 
                    transition-all duration-300 hover:-translate-y-1 ${priorityStyle.glow}`}
                  style={{ overflow: "visible" }} // allow badge & shadow
                >
                  {/* Priority indicator */}
                  <div
                    className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${priorityStyle.indicator}`}
                  />

                  {/* NEW badge */}
                  {isRecent && (
                    <div
                      className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] 
                       px-2 py-0.5 rounded-full shadow-md border border-white 
                       font-bold animate-pulse z-10"
                    >
                      NEW
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title + Priority + Category */}
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-purple-700">
                            {announcement.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            {announcement.priority && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${priorityStyle.badge}`}
                              >
                                {announcement.priority.toUpperCase()}
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${categoryColor}`}
                            >
                              {announcement.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {announcement.description && (
                        <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-700 text-xs leading-snug line-clamp-2">
                            {announcement.description}
                          </p>
                        </div>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white rounded-md border border-gray-200 shadow-sm">
                          <Clock className="w-3 h-3 text-purple-500" />
                          <span>
                            {format(
                              new Date(announcement.date),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white rounded-md border border-gray-200 shadow-sm">
                          <User className="w-3 h-3 text-blue-500" />
                          <span>{announcement.announcerName}</span>
                        </div>
                        {announcement.department && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white rounded-md border border-gray-200 shadow-sm">
                            <Tag className="w-3 h-3 text-green-500" />
                            <span>{announcement.department}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date box */}
                    <div className="text-center flex-shrink-0 sm:w-16">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-2 shadow">
                        <div className="text-xl font-bold text-purple-700">
                          {format(new Date(announcement.date), "dd")}
                        </div>
                        <div className="text-[10px] text-purple-600 uppercase font-bold">
                          {format(new Date(announcement.date), "MMM")}
                        </div>
                        <div className="text-[10px] text-purple-500">
                          {format(new Date(announcement.date), "yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {announcement.attachments?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 text-[11px] font-medium">
                        📎 {announcement.attachments.length} attachment
                        {announcement.attachments.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Enhanced Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden transform animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Select Date</h3>
                    <p className="text-purple-100 text-sm">
                      Filter announcements by date
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Content */}
            <div className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  setShowCalendar(false)
                }}
                initialFocus
                className="mx-auto border-0"
              />

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedDate(new Date())
                    setShowCalendar(false)
                  }}
                  className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    setSelectedDate(undefined)
                    setShowCalendar(false)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Clear Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
