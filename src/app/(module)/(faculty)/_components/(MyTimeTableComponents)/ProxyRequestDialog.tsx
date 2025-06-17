import React from "react"
import { User } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
type Faculty = {
  clerkId: string
  user: {
    name: string
    // add other user fields if needed
  }
}

type ProxyRequestDialogProps = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  isEditMode: boolean
  handleProxySubmit: (e: React.FormEvent<HTMLFormElement>) => void
  selectedFacultyId: string
  setSelectedFacultyId: (id: string) => void
  reason: string
  setReason: (reason: string) => void
  faculties: Faculty[]
  user: any
  proxyRequestLoading?: boolean
}

const ProxyRequestDialog: React.FC<ProxyRequestDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  isEditMode,
  handleProxySubmit,
  selectedFacultyId,
  setSelectedFacultyId,
  reason,
  setReason,
  faculties,
  user,
  proxyRequestLoading
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-lg bg-white border border-lamaSky">
        <DialogHeader className="pb-4 border-b border-lamaSky">
          <DialogTitle className="text-2xl font-black text-Dark">
            {isEditMode ? "Edit Proxy Request" : "Request Proxy for Slot"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleProxySubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="facultySelect"
              className="text-base font-bold text-TextTwo"
            >
              Choose Faculty
            </Label>
            <Select
              value={selectedFacultyId}
              onValueChange={(val) => setSelectedFacultyId(val)}
            >
              <SelectTrigger
                id="facultySelect"
                className="h-12 text-base border-2 border-lamaSky"
              >
                <SelectValue placeholder="Select a lecturer" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {faculties?.filter((fac) => fac.clerkId !== user?.id).length ===
                0 ? (
                  <SelectItem value="" disabled>
                    No other faculty available
                  </SelectItem>
                ) : (
                  faculties
                    ?.filter((fac) => fac.clerkId !== user?.id)
                    .map((fac) => (
                      <SelectItem
                        key={fac.clerkId}
                        value={fac.clerkId}
                        className="hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-ColorThree" />
                          <span>{fac.user.name}</span>
                        </div>
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="text-base font-bold text-TextTwo"
            >
              Reason (optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Why do you need this proxy? (e.g., medical appointment, conference, etc.)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="text-base border-2 resize-none border-lamaSky"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                className="flex-1 h-12 font-bold border-2 hover:scale-105 border-lamaSky text-TextTwo transition-all duration-300"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!selectedFacultyId || proxyRequestLoading}
              className="flex-1 h-12 font-bold hover:scale-105 border-ColorThree bg-ColorThree transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {proxyRequestLoading ? (
                "Requesting..."
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProxyRequestDialog
