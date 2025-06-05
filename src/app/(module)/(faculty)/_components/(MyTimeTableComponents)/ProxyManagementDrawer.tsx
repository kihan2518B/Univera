import React from "react"
import {
  Menu,
  User,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  BookOpen
} from "lucide-react"
import { ProxySlot } from "@/types/globals"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Drawer
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ProxyManagementDrawerProps {
  pendingCount: number
  receivedProxies: ProxySlot[]
  askedProxies: ProxySlot[]
  findFacultyName: (id?: string) => string
  getStatusColor: (status: string) => string
  handleProxyResponse: (id: number, action: string) => void
  isApproveDialogOpen: boolean
  setIsApproveDialogOpen: (open: boolean) => void
  isDeclineDialogOpen: boolean
  setIsDeclineDialogOpen: (open: boolean) => void
  deleteDialogOpen: boolean
  handleDeleteClick: () => void
  handleDeleteCancel: () => void
  handleDeleteConfirm: (proxyId: number) => void
  isDeleting: boolean
  ConfirmationDialogContent: React.FC<{
    action: string
    onConfirm: () => void
  }>
}

const ProxyManagementDrawer: React.FC<ProxyManagementDrawerProps> = ({
  pendingCount,
  receivedProxies,
  askedProxies,
  findFacultyName,
  getStatusColor,
  handleProxyResponse,
  isApproveDialogOpen,
  setIsApproveDialogOpen,
  isDeclineDialogOpen,
  setIsDeclineDialogOpen,
  deleteDialogOpen,
  handleDeleteClick,
  handleDeleteCancel,
  handleDeleteConfirm,
  isDeleting,
  ConfirmationDialogContent
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="relative group hover:scale-105 xs:hover:scale-110 bg-gradient-to-r from-ColorTwo to-ColorThree transition-all duration-500 border-0 px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3">
          <div className="inset-0 opacity-0 group-hover:opacity-20 transform group-hover:translate-x-full transition-all duration-700"></div>
          <Menu className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-1.5 xs:mr-2 sm:mr-3 group-hover:rotate-180 transition-transform duration-500" />
          <span className="relative z-10 text-xs xs:text-sm sm:text-base lg:text-lg font-bold whitespace-nowrap">
            Proxy Management
          </span>
          {pendingCount > 0 && (
            <div className="absolute -top-2 xs:-top-2.5 sm:-top-3 -right-2 xs:-right-2.5 sm:-right-3 flex items-center justify-center">
              <Badge className="h-4 w-4 bg-ColorTwo xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 p-0 flex items-center justify-center text-[8px] xs:text-[ correspondingly] sm:text-xs font-bold text-white shadow-lg animate-bounce z-50">
                {pendingCount}
              </Badge>
              <div className="absolute inset-0 bg-ColorTwo opacity-40 rounded-full animate-pulse-ring"></div>
            </div>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white">
        <DrawerHeader className="text-center py-3">
          <DrawerTitle className="sm:text-xl text-3xl font-black mb-2 text-Dark">
            Proxy Management Hub
          </DrawerTitle>
          <DrawerDescription className="text-TextTwo">
            Efficiently manage all your proxy requests and collaborations
          </DrawerDescription>
        </DrawerHeader>
        <div
          className="p-3 flex-1 overflow-y-auto max-h-[70vh]"
          style={{ scrollbarWidth: "thin" }}
        >
          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 shadow-lg bg-lamaSkyLight">
              <TabsTrigger value="incoming" className="font-bold text-TextTwo">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Incoming Requests</span>
                  {receivedProxies && receivedProxies?.length > 0 && (
                    <Badge className="h-6 w-6 p-0 flex items-center bg-ColorTwo justify-center text-xs font-bold text-white shadow-md animate-pulse">
                      {
                        receivedProxies.filter((s) => s.status === "PENDING")
                          .length
                      }
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="requested" className="font-bold text-TextTwo">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">My Requests</span>
                  {askedProxies && askedProxies?.length > 0 && (
                    <Badge className="h-6 w-6 p-0 flex bg-ColorTwo items-center justify-center text-xs font-bold text-white shadow-md animate-pulse">
                      {
                        askedProxies.filter((s) => s.status === "PENDING")
                          .length
                      }
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="incoming" className="space-y-6">
              {receivedProxies?.length > 0 ? (
                receivedProxies?.map((request, index) => (
                  <Card
                    key={request.id}
                    className={`border-l-8 shadow-xl border-l-ColorOne delay-${index * 150}ms`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex items-start space-x-3">
                          <div>
                            <CardTitle className="text-2xl font-black mb-2 text-Dark">
                              {request.slot.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 text-sm font-medium text-TextTwo">
                              <User className="h-4 w-4" />
                              <span>
                                Requested by{" "}
                                {findFacultyName(request.slot.facultyId)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={`self-start lg:self-center shadow-lg ${getStatusColor(request.status)}`}
                        >
                          <span className="font-bold py-1">
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-3 p-2 rounded-xl shadow-sm bg-lamaSkyLight">
                          <Calendar className="h-5 w-5 text-ColorThree" />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                              Date
                            </span>
                            <p className="font-bold text-lg text-TextTwo">
                              {request.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-xl shadow-sm bg-lamaSkyLight">
                          <Clock className="h-5 w-5 text-ColorThree" />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                              Time
                            </span>
                            <p className="font-bold text-lg text-TextTwo">
                              {request.slot.startTime} - {request.slot.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-xl shadow-sm md:col-span-2 xl:col-span-1 bg-lamaSkyLight">
                          <MapPin className="h-5 w-5 text-ColorThree" />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                              Location
                            </span>
                            <p className="font-bold text-sm text-TextTwo">
                              {request.slot.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      {request.reason && (
                        <div className="flex items-start gap-4 p-3 rounded-xl shadow-inner bg-lamaYellowLight">
                          <MessageSquare className="h-6 w-6 mt-1 flex-shrink-0 text-ColorThree" />
                          <div>
                            <span className="font-bold text-sm uppercase tracking-wide text-Dark">
                              Reason for Request
                            </span>
                            <p className="text-sm mt-2 leading-relaxed text-TextTwo">
                              {request.reason}
                            </p>
                          </div>
                        </div>
                      )}
                      {request.status === "PENDING" && (
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                          <Dialog
                            open={isApproveDialogOpen}
                            onOpenChange={setIsApproveDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg">
                                <CheckCircle className="h-5 w-5 mr-3" />
                                Accept Request
                              </Button>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-md mx-auto bg-white rounded-xl shadow-2xl border-2 p-6"
                              style={{
                                borderColor: "#CECDF9",
                                background:
                                  "linear-gradient(135deg, #EDF9FD 0%, #F1F0FF 100%)"
                              }}
                            >
                              <ConfirmationDialogContent
                                action="APPROVED"
                                onConfirm={() =>
                                  handleProxyResponse(
                                    Number(request.id),
                                    "APPROVED"
                                  )
                                }
                              />
                            </DialogContent>
                          </Dialog>
                          <Dialog
                            open={isDeclineDialogOpen}
                            onOpenChange={setIsDeclineDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 border-0 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                              >
                                <XCircle className="h-5 w-5 mr-3" />
                                Decline Request
                              </Button>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-md mx-auto bg-white rounded-xl shadow-2xl border-2 p-6"
                              style={{
                                borderColor: "#CECDF9",
                                background:
                                  "linear-gradient(135deg, #EDF9FD 0%, #F1F0FF 100%)"
                              }}
                            >
                              <ConfirmationDialogContent
                                action="DECLINED"
                                onConfirm={() =>
                                  handleProxyResponse(
                                    Number(request.id),
                                    "DECLINED"
                                  )
                                }
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <AlertCircle className="h-24 w-24 mx-auto animate-float text-Primary" />
                    <div className="absolute inset-0 h-24 w-24 mx-auto rounded-full animate-pulse-ring bg-Primary opacity-20"></div>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-Dark">
                    All Clear! 🎉
                  </h3>
                  <p className="text-lg font-medium text-TextTwo">
                    No pending proxy requests at the moment. You're all caught
                    up!
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="requested" className="space-y-6">
              {askedProxies.length > 0 ? (
                askedProxies.map((request, index) => (
                  <Card
                    key={request.id}
                    className="border-l-8 shadow-xl border-ColorTwo"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <CardTitle className="text-2xl font-black text-Dark">
                          {request.slot.title}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <Badge
                            className={`self-start shadow-lg ${getStatusColor(request.status)}`}
                          >
                            <span className="font-bold py-1">
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </Badge>
                          {request.status === "APPROVED" && (
                            <Dialog
                              open={deleteDialogOpen}
                              onOpenChange={(open: any) => {
                                if (!open) handleDeleteCancel()
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                                  disabled={isDeleting}
                                  onClick={() => handleDeleteClick()}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Delete Proxy
                                  </span>
                                  <span className="sm:hidden">Delete</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] mx-4 bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-Dark">
                                    Delete Proxy Request
                                  </DialogTitle>
                                  <DialogDescription className="text-TextTwo">
                                    Are you sure you want to delete this proxy
                                    request for{" "}
                                    <span className="font-semibold">
                                      {request?.slot.title}
                                    </span>
                                    ?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="">
                                  <div className="bg-lamaPurpleLight p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Calendar className="h-4 w-4 text-ColorTwo" />
                                      <span className="text-sm font-medium text-TextTwo">
                                        {request?.date} at{" "}
                                        {request?.slot.startTime} -{" "}
                                        {request?.slot.endTime}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <MapPin className="h-4 w-4 text-ColorTwo" />
                                      <span className="text-sm text-TextTwo">
                                        {request?.slot.location}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={handleDeleteCancel}
                                    disabled={isDeleting}
                                    className="w-full sm:w-auto border-ColorTwo text-ColorTwo hover:bg-lamaPurpleLight"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteConfirm(Number(request.id))
                                    }
                                    disabled={isDeleting}
                                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded-lg transition-all duration-200 hover:scale-105"
                                  >
                                    {isDeleting ? (
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                        Deleting...
                                      </div>
                                    ) : (
                                      <>
                                        <Trash2 className="h-4 w-4" />
                                        Delete Proxy
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-3 p-2 rounded-xl shadow-sm bg-lamaPurpleLight">
                          <User className="h-5 w-5 text-ColorTwo" />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                              Proxy To
                            </span>
                            <p className="font-bold text-lg text-TextTwo">
                              {findFacultyName(request.lecturerId)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-xl shadow-sm bg-lamaPurpleLight">
                          <Calendar className="h-5 w-5 text-ColorTwo" />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                              Date
                            </span>
                            <p className="font-bold text-lg text-TextTwo">
                              {request.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-xl shadow-sm bg-lamaPurpleLight">
                          <Clock className="h-5 w-5 text-ColorTwo" />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                              Time
                            </span>
                            <p className="font-bold text-lg text-TextTwo">
                              {request.slot.startTime} - {request.slot.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-lamaPurpleLight shadow-sm md:col-span-2 xl:col-span-3">
                          <MapPin className="h-5 w-5 text-ColorTwo" />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                              Location
                            </span>
                            <p className="font-bold text-sm text-TextTwo">
                              {request.slot.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      {request.reason && (
                        <div className="flex items-start gap-4 p-3 rounded-xl shadow-inner bg-lamaYellowLight">
                          <MessageSquare className="h-6 w-6 mt-1 flex-shrink-0 text-ColorTwo" />
                          <div>
                            <span className="font-bold text-sm uppercase tracking-wide text-Dark">
                              Reason for Request
                            </span>
                            <p className="text-sm mt-2 leading-relaxed text-TextTwo">
                              {request.reason}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="relative mb-4">
                    <BookOpen className="h-24 w-24 mx-auto text-ColorTwo" />
                    <div className="absolute inset-0 h-24 w-24 mx-auto rounded-full bg-ColorTwo opacity-20"></div>
                  </div>
                  <p className="text-lg font-medium text-TextTwo">
                    You haven't sent any proxy requests yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default ProxyManagementDrawer
