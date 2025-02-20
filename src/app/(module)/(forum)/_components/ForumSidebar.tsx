import { Input } from "@/components/ui/input"
import { ButtonV1, Submit } from "@/components/(commnon)/ButtonV1"
import { MultiSelect } from "@/components/ui/MultiSelect"
import {
  PlusCircle,
  MessageCircle,
  TagIcon,
  LockIcon,
  X,
  LogOut
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import Link from "next/link"

interface ForumSidebarProps {
  forums: any[]
  userRole: any
  selectedForumId: number | null
  onForumSelect: (id: number) => void
  setTag: (value: string) => void
  setIsForumDialogOpen: (value: boolean) => void
  setIsTagDialogOpen: (value: boolean) => void
  isForumDialogOpen: boolean
  isTagDialogOpen: boolean
  addTag: () => void
  tag: string
  forumName: string
  setForumName: (value: string) => void
  forumTags: string[]
  selectedTags: string[]
  setSelectedTags: (value: string[]) => void
  createForum: () => void
  isPrivate: boolean
  setIsPrivate: (value: boolean) => void
  isSubmittingForumForm: boolean
  isSubmittingForumTagForm: boolean
}

export const ForumSidebar = ({
  forums,
  selectedForumId,
  onForumSelect,
  setTag,
  userRole,
  setIsForumDialogOpen,
  isTagDialogOpen,
  setIsTagDialogOpen,
  setForumName,
  setSelectedTags,
  forumName,
  tag,
  forumTags,
  isPrivate,
  setIsPrivate,
  createForum,
  selectedTags,
  isForumDialogOpen,
  addTag,
  isSubmittingForumForm,
  isSubmittingForumTagForm
}: ForumSidebarProps) => {
  const filteredForums = forums.filter(
    (forum) => !forum.isPrivate || (forum.isPrivate && userRole.includes(4)) // in this the forums filtered if isPrivate is true and userRole is faculty, if not then filtered if isPrivate is false
  )

  return (
    <div
      className={`transition-all duration-300 flex flex-col min-h-full bg-Primary text-white rounded-2xl shadow-2xl border-2 border-[#56E1E9]/20 overflow-hidden relative
w-full`}
    >
      <div
        className={`bg-[#5B58EB]/10 p-1 border-b border-[#56E1E9]/20 flex flex-row justify-between items-center`}
      >
        <div className="flex items-center gap-1">
          <Link href="/forum">
            <p className="p-1 hover:bg-Dark/5 rounded-full transition-colors inline-flex items-center justify-center">
              <LogOut className="w-5 h-5 text-Dark rotate-180" />
            </p>
          </Link>
          <h2 className="text-xl font-bold text-Dark">Forums</h2>
        </div>

        {userRole.includes(4) && (
          <Dialog
            open={isForumDialogOpen}
            onOpenChange={(isOpen) => {
              setIsForumDialogOpen(isOpen)
            }}
          >
            <DialogTrigger asChild>
              <button
                className={`bg-Dark text-white p-1 flex justify-evenly items-center rounded-full hover:bg-[#5B58EB] transition-colors shadow-md`}
              >
                <PlusCircle className="w-6 h-6" />
              </button>
            </DialogTrigger>

            <DialogContent className="bg-[#EDF9FD] text-[#0A2353] rounded-2xl shadow-2xl border-2 border-[#56E1E9]/30 w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-[#112C71] text-xl font-bold flex items-center gap-3">
                  <PlusCircle className="text-[#BB63FF] w-6 h-6" />
                  Create New Forum
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  type="text"
                  value={forumName}
                  onChange={(e) => setForumName(e.target.value)}
                  placeholder="Forum Name"
                  className="border-2 border-[#56E1E9] rounded-lg p-3 focus:ring-2 focus:ring-[#BB63FF] transition-all"
                />

                {forumTags.length > 0 ? (
                  <MultiSelect
                    options={forumTags.map((tag) => ({
                      label: tag,
                      value: tag
                    }))}
                    selected={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Select Tags"
                    className="border-2 border-[#56E1E9] rounded-lg"
                  />
                ) : (
                  <p className="text-red-500 text-sm">
                    Minimum one tag is required to create a forum.
                  </p>
                )}

                <label className="flex items-center gap-3 text-[#0A2353] hover:bg-[#CFCEFF]/20 p-2 rounded-lg transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="form-checkbox text-[#BB63FF] rounded-md border-[#56E1E9] focus:ring-[#BB63FF]"
                  />
                  <LockIcon className="w-5 h-5 text-[#5B58EB]" />
                  <span>Make Forum Private</span>
                </label>
              </div>

              <DialogFooter>
                <ButtonV1
                  onClick={createForum}
                  icon={PlusCircle}
                  label="Create Forum"
                  disabled={
                    !forumName ||
                    selectedTags.length === 0 ||
                    isSubmittingForumForm // Disable until conditions are met
                  }
                  className="w-full bg-[#0A2353] text-white rounded-lg hover:bg-[#5B58EB] transition-colors shadow-md flex items-center justify-center gap-2"
                />
                <ButtonV1
                  onClick={() => setIsForumDialogOpen(false)}
                  icon={X}
                  label="Cancel"
                  varient="outline"
                  className="w-full py-2 flex items-center justify-center gap-2"
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {userRole.includes(4) && (
        <div className="p-4 border-b border-[#56E1E9]/20">
          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-full mx-auto py-2.5 bg-Dark text-white p-2 flex justify-evenly items-center rounded-md hover:bg-[#5B58EB] transition-colors shadow-md">
                <TagIcon className="w-5 h-5" />
                <span>Add New Tag</span>
              </button>
            </DialogTrigger>

            <DialogContent className="bg-[#EDF9FD] text-[#0A2353] rounded-2xl shadow-2xl border-2 border-[#56E1E9]/30 w-[350px]">
              <DialogHeader>
                <DialogTitle className="text-[#112C71] text-xl font-bold flex items-center gap-3">
                  <TagIcon className="text-[#BB63FF] w-6 h-6" />
                  Create New Tag
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Enter Tag Name"
                  className="border-2 border-[#56E1E9] rounded-lg p-3 focus:ring-2 focus:ring-[#BB63FF] transition-all"
                />
              </div>

              <DialogFooter>
                <Submit
                  label="Create Tag"
                  className="w-full py-3 bg-[#0A2353] text-white rounded-lg hover:bg-[#5B58EB] transition-colors flex items-center justify-center gap-2.5 shadow-md"
                  onClick={addTag}
                  disabled={!tag.trim() || isSubmittingForumTagForm}
                >
                  <TagIcon className="w-5 h-5" />
                  Create Tag
                </Submit>
                <ButtonV1
                  onClick={() => setIsTagDialogOpen(false)}
                  label="Cancel"
                  icon={X}
                  varient="outline"
                  className="w-full py-3 flex items-center justify-center gap-2 shadow-md"
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="flex-grow overflow-y-auto">
        {filteredForums.map((forum) => (
          <button
            key={forum.id}
            onClick={() => onForumSelect(forum.id)}
            className={`w-full px-5 py-4 border-b text-left ${
              selectedForumId === forum.id
                ? "bg-[#BB63FF]/20 text-[#BB63FF]"
                : "hover:bg-[#BB63FF]/20"
            } transition-colors flex items-center gap-3`}
          >
            <MessageCircle className="w-6 h-6 text-[#BB63FF]" />
            <span className="text-lg">{forum.name}</span>
            <span className="text-sm text-[#5B58EB] ml-auto">
              {forum.forumTags.join(", ")}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
