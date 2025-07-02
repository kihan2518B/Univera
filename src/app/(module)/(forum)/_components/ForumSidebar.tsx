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
      className={`transition-all duration-300 flex flex-col min-h-full bg-gradient-to-b from-white to-lamaSkyLight text-Dark rounded-2xl shadow-xl border border-lamaSky/30 overflow-hidden relative w-full`}
    >
      <div
        className={`bg-gradient-to-r from-lamaSky/20 to-lamaPurple/20 p-4 border-b border-lamaSky/30 flex flex-row justify-between items-center backdrop-blur-sm`}
      >
        <div className="flex items-center gap-3">
          <Link href="/forum">
            <p className="p-2 hover:bg-lamaSky/20 rounded-xl transition-all duration-200 inline-flex items-center justify-center group">
              <LogOut className="w-5 h-5 text-Dark rotate-180 group-hover:scale-110 transition-transform" />
            </p>
          </Link>
          <h2 className="text-2xl font-bold text-Dark bg-gradient-to-r from-Dark to-ColorThree bg-clip-text text-transparent">
            Forums
          </h2>
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
                className={`bg-gradient-to-r from-ColorThree to-ColorTwo text-white p-2 sm:p-3 flex justify-center items-center rounded-xl hover:shadow-lg transition-all duration-300 transform w-full sm:w-auto`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="ml-2 sm:hidden">Create Forum</span>
              </button>
            </DialogTrigger>

            <DialogContent className="bg-gradient-to-br from-white to-lamaSkyLight text-Dark rounded-3xl shadow-2xl border-2 border-lamaSky/40 w-[95vw] max-w-[450px] sm:mx-0 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
              <DialogHeader className="px-2">
                <DialogTitle className="text-Dark text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-ColorTwo to-ColorThree rounded-xl flex items-center justify-center flex-shrink-0">
                    <PlusCircle className="text-white w-4 h-4 s" />
                  </div>
                  <span className="truncate">Create New Forum</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 px-2 sm:px-6">
                <Input
                  type="text"
                  value={forumName}
                  onChange={(e) => setForumName(e.target.value)}
                  placeholder="Forum Name"
                  className="border-2 border-lamaSky/50 bg-white/80 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-ColorTwo/50 focus:border-ColorTwo transition-all duration-300 text-Dark placeholder:text-Dark/60 text-sm sm:text-base w-full"
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
                    className="border-2 border-lamaSky/50 bg-white/80 rounded-xl w-full"
                  />
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
                    <p className="text-red-600 text-xs sm:text-sm font-medium">
                      Minimum one tag is required to create a forum.
                    </p>
                  </div>
                )}

                <label className="flex items-start sm:items-center gap-3 sm:gap-4 text-Dark hover:bg-lamaPurple/20 p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="form-checkbox text-ColorTwo rounded-lg border-lamaSky/50 focus:ring-ColorTwo/50 w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-ColorThree/20 to-ColorTwo/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <LockIcon className="w-3 h-3 sm:w-4 sm:h-4 text-ColorThree" />
                  </div>
                  <span className="font-medium text-sm sm:text-base">
                    Make Forum Private
                  </span>
                </label>
              </div>

              <DialogFooter className="gap-2 sm:gap-3 px-2 sm:px-6 flex-col sm:flex-row">
                <ButtonV1
                  onClick={createForum}
                  icon={PlusCircle}
                  label="Create Forum"
                  disabled={
                    !forumName ||
                    selectedTags.length === 0 ||
                    isSubmittingForumForm
                  }
                  className="w-full sm:flex-1 bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-xl py-3 sm:py-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base"
                />
                <ButtonV1
                  onClick={() => setIsForumDialogOpen(false)}
                  icon={X}
                  label="Cancel"
                  varient="outline"
                  className="w-full sm:flex-1 py-3 sm:py-4 border-2 border-lamaSky/50 text-Dark rounded-xl hover:bg-lamaSky/20 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {userRole.includes(4) && (
        <div className="p-2 sm:p-4 border-b border-lamaSky/30 bg-gradient-to-r from-lamaPurpleLight/50 to-lamaSkyLight/50">
          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-full py-3 sm:py-4 bg-gradient-to-r from-white to-lamaSkyLight border-2 border-lamaSky/30 text-Dark p-2 sm:p-3 flex justify-center items-center gap-2 sm:gap-3 rounded-xl hover:shadow-md hover:border-ColorTwo/50 transition-all duration-300 transform font-medium text-sm sm:text-base">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-ColorOne to-ColorTwo rounded-lg flex items-center justify-center flex-shrink-0">
                  <TagIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span>Add New Tag</span>
              </button>
            </DialogTrigger>

            <DialogContent className="bg-gradient-to-br from-white to-lamaSkyLight text-Dark rounded-3xl shadow-2xl border-2 border-lamaSky/40 w-[95vw] max-w-[400px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="px-2 sm:px-6">
                <DialogTitle className="text-Dark text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-ColorOne to-ColorTwo rounded-xl flex items-center justify-center flex-shrink-0">
                    <TagIcon className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="truncate">Create New Tag</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 sm:space-y-6 p-2 px-2 sm:px-6">
                <Input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Enter Tag Name"
                  className="border-2 border-lamaSky/50 bg-white/80 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-ColorOne/50 focus:border-ColorOne transition-all duration-300 text-Dark placeholder:text-Dark/60 text-sm sm:text-base w-full"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-3 px-2 sm:px-6 flex-col sm:flex-row">
                <Submit
                  label="Create Tag"
                  className="w-full sm:flex-1 py-3 sm:py-4 bg-gradient-to-r from-ColorOne to-ColorTwo text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 font-semibold transform hover:scale-105 text-sm sm:text-base"
                  onClick={addTag}
                  disabled={!tag.trim() || isSubmittingForumTagForm}
                >
                  <TagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create Tag
                </Submit>
                <ButtonV1
                  onClick={() => setIsTagDialogOpen(false)}
                  label="Cancel"
                  icon={X}
                  varient="outline"
                  className="w-full sm:flex-1 py-3 sm:py-4 border-2 border-lamaSky/50 text-Dark rounded-xl hover:bg-lamaSky/20 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="flex-grow overflow-y-auto bg-gradient-to-b from-transparent to-lamaSkyLight/30">
        {filteredForums.map((forum, index) => (
          <button
            key={forum.id}
            onClick={() => onForumSelect(forum.id)}
            className={`w-full px-4 py-3 border-b border-lamaSky/20 text-left transition-all duration-300 flex items-center gap-4 group hover:bg-gradient-to-r hover:from-lamaPurple/20 hover:to-lamaSky/20 ${
              selectedForumId === forum.id
                ? "bg-gradient-to-r from-ColorTwo/10 to-ColorThree/10 text-ColorTwo border-l-4 border-l-ColorTwo"
                : "hover:translate-x-1"
            }`}
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                selectedForumId === forum.id
                  ? "bg-gradient-to-r from-ColorTwo to-ColorThree text-white"
                  : "bg-gradient-to-r from-lamaSky/30 to-lamaPurple/30 text-ColorThree"
              }`}
            >
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-lg font-semibold truncate transition-colors ${
                  selectedForumId === forum.id
                    ? "text-ColorTwo"
                    : "text-Dark group-hover:text-ColorThree"
                }`}
              >
                {forum.name}
              </h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {forum.forumTags
                  .slice(0, 2)
                  .map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 bg-gradient-to-r from-lamaSky/40 to-lamaPurple/40 text-ColorThree rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                {forum.forumTags.length > 2 && (
                  <span className="text-xs px-2 py-1 bg-lamaSky/20 text-ColorThree rounded-full">
                    +{forum.forumTags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
