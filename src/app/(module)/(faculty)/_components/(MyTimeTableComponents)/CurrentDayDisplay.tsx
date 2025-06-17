import React from "react"
import { Calendar, Clock } from "lucide-react"
import SlotsContent from "./SlotsContent"
import ProxyManagementDrawer from "./ProxyManagementDrawer"

type CurrentDayDisplayProps = {
  currentDay: { label: string } | null
  currentDate: string
  pendingCount: number
  currentPage: number
  goToToday: () => void
  receivedProxies: any[]
  askedProxies: any[]
  findFacultyName: (id?: string) => string
  getStatusColor: (status: string) => string
  handleProxyResponse: (proxyId: number, action: string) => void
  isApproveDialogOpen: boolean
  setIsApproveDialogOpen: (open: boolean) => void
  isDeclineDialogOpen: boolean
  setIsDeclineDialogOpen: (open: boolean) => void
  sortedSlots: any[]
  getProxyStatusForSlot: (slot: any) => string
  openProxyDialog: (slot: any) => void
  ConfirmationDialogContent: React.FC<{
    action: string
    onConfirm: () => void
  }>
  deleteDialogOpen: boolean
  handleDeleteClick: () => void
  handleDeleteCancel: () => void
  handleDeleteConfirm: (proxyId: number) => void
  isDeleting: boolean
}

const CurrentDayDisplay: React.FC<CurrentDayDisplayProps> = ({
  currentDay,
  currentDate,
  pendingCount,
  currentPage,
  goToToday,
  receivedProxies,
  askedProxies,
  findFacultyName,
  getStatusColor,
  handleProxyResponse,
  isApproveDialogOpen,
  setIsApproveDialogOpen,
  isDeclineDialogOpen,
  setIsDeclineDialogOpen,
  sortedSlots,
  getProxyStatusForSlot,
  openProxyDialog,
  ConfirmationDialogContent,
  deleteDialogOpen,
  handleDeleteClick,
  handleDeleteCancel,
  handleDeleteConfirm,
  isDeleting
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-lg border-lamaSky rounded-3xl shadow-2xl overflow-hidden border-2">
      <div className="p-6 text-white relative overflow-hidden bg-ColorThree">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 animate-pulse">
          <Calendar className="w-full h-full" />
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20 opacity-10 animate-bounce">
          <Clock className="w-full h-full" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 drop-shadow-lg">
              {currentDay?.label}
            </h2>
            <p className="text-sm sm:text-base opacity-90 font-medium">
              {currentDate}
            </p>
          </div>
          <ProxyManagementDrawer
            pendingCount={pendingCount}
            receivedProxies={receivedProxies}
            askedProxies={askedProxies}
            findFacultyName={findFacultyName}
            getStatusColor={getStatusColor}
            handleProxyResponse={handleProxyResponse}
            isApproveDialogOpen={isApproveDialogOpen}
            setIsApproveDialogOpen={setIsApproveDialogOpen}
            isDeclineDialogOpen={isDeclineDialogOpen}
            setIsDeclineDialogOpen={setIsDeclineDialogOpen}
            deleteDialogOpen={deleteDialogOpen}
            handleDeleteClick={handleDeleteClick}
            handleDeleteCancel={handleDeleteCancel}
            handleDeleteConfirm={handleDeleteConfirm}
            isDeleting={isDeleting}
            ConfirmationDialogContent={ConfirmationDialogContent}
          />
          {currentPage !== 1 && (
            <button
              onClick={goToToday}
              className="px-4 py-2 mt-2 sm:mt-0 rounded-full text-ColorThree font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm hover:bg-white text-sm"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Jump to Today</span>
              </div>
            </button>
          )}
        </div>
      </div>
      <SlotsContent
        sortedSlots={sortedSlots}
        getProxyStatusForSlot={getProxyStatusForSlot}
        openProxyDialog={openProxyDialog}
        ConfirmationDialogContent={ConfirmationDialogContent}
      />
    </div>
  )
}

export default CurrentDayDisplay
