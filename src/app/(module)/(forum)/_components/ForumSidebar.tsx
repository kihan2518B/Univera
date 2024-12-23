import { Input } from "@/components/ui/input"
import { Submit } from "@/components/(commnon)/ButtonV1"
import { MultiSelect } from "@/components/ui/MultiSelect"
import {
  PlusCircle,
  MessageCircle,
  TagIcon,
  LockIcon,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"

interface ForumSidebarProps {
  forums: any[]
  userRole: string
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
  addTag
}: ForumSidebarProps) => {
  const filteredForums = forums.filter(
    (forum) => !forum.isPrivate || (forum.isPrivate && userRole === "faculty") // in this the forums filtered if isPrivate is true and userRole is faculty, if not then filtered if isPrivate is false
  )

  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 769)

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 769)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (selectedForumId === null) {
      setIsCollapsed(false) // Expand sidebar when no forum is selected
    } else {
      setIsCollapsed(true) // Shrink sidebar when a forum is selected
    }
  }, [selectedForumId])

  return (
    <div
      className={`transition-all duration-300 flex flex-col min-h-full bg-Primary text-white rounded-2xl shadow-2xl border-2 border-[#56E1E9]/20 overflow-hidden relative
    ${isCollapsed ? "w-16" : "w-[80vw] md:w-full"}`}
    >
      {/* Top Section */}
      <div
        className={`bg-[#5B58EB]/10 p-4 border-b border-[#56E1E9]/20 flex ${
          isCollapsed
            ? "flex-col items-center"
            : "flex-row justify-between items-center"
        }`}
      >
        {/* Forum Icon */}
        <div className="flex items-center gap-3">
          <MessageCircle className="text-Dark w-7 h-7" />
          {!isCollapsed && (
            <h2 className="text-2xl font-bold text-Dark">Forums</h2>
          )}
        </div>

        {/* Create Forum Button */}
        <Dialog open={isForumDialogOpen} onOpenChange={setIsForumDialogOpen}>
          <DialogTrigger asChild>
            <button
              className={`bg-Dark text-white p-2 flex justify-evenly items-center rounded-full hover:bg-[#5B58EB] transition-colors shadow-md ${
                isCollapsed ? "mt-4" : "ml-4"
              }`}
            >
              <PlusCircle className="w-6 h-6" />
              {window.innerWidth > 425 && !isCollapsed && (
                <span>Create Forum</span>
              )}
            </button>
          </DialogTrigger>

          {/* Forum Creation Dialog */}
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

              <MultiSelect
                options={forumTags.map((tag) => ({ label: tag, value: tag }))}
                selected={selectedTags}
                onChange={setSelectedTags}
                placeholder="Select Tags"
                className="border-2 border-[#56E1E9] rounded-lg"
              />

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

            <DialogFooter className="space-y-2">
              <button
                onClick={createForum}
                className="w-full bg-[#0A2353] text-white rounded-lg hover:bg-[#5B58EB] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Create Forum
              </button>
              <button
                onClick={() => setIsForumDialogOpen(false)}
                className="w-full py-2 bg-[#0A2353] text-white rounded-lg hover:bg-[#5B58EB] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Shrink Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`bg-Dark text-white p-2 rounded-full hover:bg-[#5B58EB] transition-colors shadow-md ${
            isCollapsed ? "mt-4" : "ml-auto"
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Tag Management Section */}
      {userRole === "faculty" && (
        <div className="p-4 border-b border-[#56E1E9]/20">
          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-full py-2.5 bg-[#5B58EB] text-white rounded-lg hover:bg-[#BB63FF] transition-colors flex items-center justify-center gap-2.5 shadow-md">
                <TagIcon className="w-5 h-5" />
                {window.innerWidth > 425 && !isCollapsed && (
                  <span> Add New Tag</span>
                )}
              </button>
            </DialogTrigger>

            {/* Tag Creation Dialog */}
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

              <DialogFooter className="space-y-2">
                <Submit
                  label="Create Tag"
                  className="w-full py-3 bg-[#BB63FF] text-white rounded-lg hover:bg-[#5B58EB] transition-colors flex items-center justify-center gap-2.5 shadow-md"
                  onClick={addTag}
                  disabled={!tag.trim()}
                >
                  <TagIcon className="w-5 h-5" />
                  Create Tag
                </Submit>
                <button
                  onClick={() => setIsTagDialogOpen(false)}
                  className="w-full py-3 bg-[#FAE27C] text-[#0A2353] rounded-lg hover:bg-[#CFCEFF] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  Cancel
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Forum List Section */}
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
            {isCollapsed ? (
              <MessageCircle className="w-6 h-6 text-[#BB63FF]" />
            ) : (
              <>
                <MessageCircle className="w-6 h-6 text-[#BB63FF]" />
                <span className="text-lg">{forum.name}</span>
                <span className="text-sm text-[#5B58EB] ml-auto">
                  {forum.forumTags.join(", ")}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
