import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  Send,
  Smile,
  Paperclip,
  File,
  Trash2,
  MessageCircle,
  X
} from "lucide-react"
import { chatMessage, UploadedFile } from "@/types/globals"
import { UploadthingUploader } from "@/components/(commnon)/UploadthingUploader"
import { useUploadThing } from "@/utils/uploadthing"

interface ChatSectionProps {
  messages: any[]
  userId: string | undefined
  inputMessage: string
  onInputChange: (value: string) => void
  onSendMessage: (
    message?: string,
    attachments?: UploadedFile[]
  ) => Promise<void>
  onLeaveChat: () => void
  uploadedFiles: UploadedFile[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  handleDeleteMessage: (id: number) => void
}

interface GroupedMessages {
  [dateKey: string]: {
    date: string | Date // or Date if it's a Date object
    messages: chatMessage[]
  }
}

interface FileWithPreview extends File {
  preview?: string
}

// Update getFileType to handle both string URLs and attachment objects
const getFileType = (attachment: string | UploadedFile): "image" | "other" => {
  const url = typeof attachment === "string" ? attachment : attachment.url
  const extension = url.split(".").pop()?.toLowerCase()
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"]
  return imageExtensions.includes(extension || "") ? "image" : "other"
}

export const ChatSection = ({
  messages,
  userId,
  inputMessage,
  onInputChange,
  onSendMessage,
  onLeaveChat,
  uploadedFiles,
  setUploadedFiles,
  handleDeleteMessage
}: ChatSectionProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [showMediaOptions, setShowMediaOptions] = useState<boolean>(false)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)

  // console.log("messages from chatsection", messages)

  const handleSend = async () => {
    if ((inputMessage.trim() || uploadedFiles.length > 0) && !uploading) {
      if (files.length > 0) {
        await startUpload(files)
      } else {
        // console.log("else called")
        // Directly send the message if there are no files to upload
        onSendMessage(inputMessage.trim())
        onInputChange("")
        setUploadedFiles([])
      }
    }
  }

  // Function to format date
  const formatDate = (messageDate: any) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return messageDate.toLocaleDateString()
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce<GroupedMessages>((acc, message) => {
    const messageDate = new Date(message.createdAt)
    const dateKey = messageDate.toDateString()

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: messageDate,
        messages: []
      }
    }
    acc[dateKey].messages.push(message)
    return acc
  }, {})

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
    setShowMediaOptions(false)
  }

  const toggleMediaOptions = () => {
    setShowMediaOptions(!showMediaOptions)
    setShowEmojiPicker(false)
  }

  const addEmoji = (emoji: any) => {
    onInputChange(inputMessage + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  // function to upload attachments in uploadthing
  const { startUpload, routeConfig } = useUploadThing("attachmentsUploader", {
    onClientUploadComplete: (res) => {
      // console.log("Uploaded files res:", res)
      // console.log("Uploaded successfully!")
      // Clean up previews before clearing files
      const uploadedFileData = res.map((file) => ({
        url: file.url,
        fileType: file.name.split(".").pop()?.toLowerCase() || "",
        fileName: file.name
      }))

      setUploadedFiles((prev: UploadedFile[]) => {
        // console.log("setUploadedFiles calles")
        const updatedFiles = [...prev, ...uploadedFileData]
        // console.log("Updated files after setUploadedFiles:", updatedFiles)

        // Call onSendMessage with the updated files
        onSendMessage(inputMessage.trim() || "", updatedFiles)
        // console.log("Message sent with updated files:", updatedFiles)

        return updatedFiles
      })
      setUploading(false)

      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })

      setFiles([])
      setShowMediaOptions(false)
      onInputChange("")
    },
    onUploadError: (error) => {
      console.log("Error occurred while uploading: " + error.message)
      setUploading(false)
    },
    onUploadBegin: () => {
      setUploading(true)
    }
  })

  // Generate preview for files
  const generatePreview = (file: File) => {
    const fileWithPreview = file as File & { preview?: string }
    if (file.type.startsWith("image/")) {
      fileWithPreview.preview = URL.createObjectURL(file)
    }
    return fileWithPreview
  }

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const UniqueFiles = acceptedFiles.filter((file) => {
      return !files.some((existingFile) => existingFile.name === file.name)
    })

    const filesWithPreviews = UniqueFiles.map(generatePreview)
    setFiles((prevFiles) => [...prevFiles, ...filesWithPreviews])
  }, [])

  // Remove file from the list
  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove)
      if (prevFiles[indexToRemove].preview) {
        URL.revokeObjectURL(prevFiles[indexToRemove].preview!)
      }
      return newFiles
    })
  }

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const renderAttachments = (attachments: UploadedFile[]) => {
    return attachments.map((attachment, index) => {
      const fileType = getFileType(attachment)

      return (
        <div key={index} className="mt-3 space-y-2">
          {fileType === "image" ? (
            <div className="relative group">
              <img
                src={attachment.url}
                alt={attachment.fileName}
                className="max-w-full max-h-48 rounded-2xl object-contain shadow-lg"
              />
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-2xl"
              >
                <span className="opacity-0 group-hover:opacity-100 text-white bg-Dark/80 px-4 py-2 rounded-xl font-medium">
                  Open in new tab
                </span>
              </a>
            </div>
          ) : (
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-ColorOne to-ColorTwo rounded-lg flex items-center justify-center">
                <File className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm truncate font-medium">
                {attachment.fileName}
              </span>
            </a>
          )}
        </div>
      )
    })
  }

  const renderMessages = (messages: any[], userId: string) => {
    return messages.map((msg, index) => {
      const isOwn = msg.userId === userId

      return (
        <div
          key={msg.id}
          className={`flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"} group/message`}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {!isOwn && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ColorOne to-ColorTwo flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {msg.userId.charAt(0).toUpperCase()}
            </div>
          )}

          <div
            className={`relative px-5 py-4 rounded-3xl max-w-[75%] transition-all duration-300 shadow-lg ${
              isOwn
                ? "bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-br-lg"
                : "bg-gradient-to-r from-white to-lamaSkyLight text-Dark border border-lamaSky/30 rounded-bl-lg"
            }`}
          >
            {!isOwn && (
              <div className="text-xs font-semibold mb-2 text-ColorThree">
                {msg.userId}
              </div>
            )}

            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {msg.message}
            </p>

            {msg.attachments && renderAttachments(msg.attachments)}

            <div
              className={`absolute -bottom-6 ${isOwn ? "right-0" : "left-0"} text-xs opacity-0 group-hover/message:opacity-80 transition-all duration-300 bg-white/90 px-2 py-1 rounded-lg shadow-sm ${
                isOwn ? "text-Dark" : "text-Dark"
              }`}
            >
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
            </div>

            {isOwn && (
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="absolute -top-2 -right-2 p-2 rounded-full bg-red-500 text-white opacity-0 
                  group-hover/message:opacity-100 transition-all duration-300 hover:bg-red-600 
                  transform hover:scale-110 shadow-lg"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {isOwn && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ColorThree to-ColorTwo flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {msg.userId.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="chatbox-container h-[85vh] flex flex-col bg-gradient-to-b from-lamaSkyLight to-white rounded-3xl relative overflow-hidden border border-lamaSky/30">
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-r from-white to-lamaSkyLight text-Dark p-2 shadow-lg border-b border-lamaSky/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-ColorOne to-ColorTwo rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            FC
          </div>
          <div>
            <h2 className="text-xl font-bold text-Dark">Forum Chat</h2>
            <p className="text-sm text-ColorThree font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              3 members active
            </p>
          </div>
        </div>
        <button
          onClick={onLeaveChat}
          className="bg-gradient-to-r from-ColorTwo to-ColorThree text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
        >
          Back
        </button>
      </header>

      {/* Messages Section */}
      <main className="flex-1 h-[80vh] overflow-y-auto px-6 py-8 space-y-3 bg-gradient-to-b from-lamaSkyLight/30 to-white/50">
        {Object.entries(groupedMessages).map(
          ([dateKey, { date, messages }]) => (
            <React.Fragment key={dateKey}>
              <div className="flex justify-center my-8">
                <span className="bg-gradient-to-r from-white to-lamaSkyLight text-ColorThree px-4 py-2 rounded-full shadow-md font-medium border border-lamaSky/30">
                  {formatDate(date)}
                </span>
              </div>
              <div className="space-y-4">
                {renderMessages(messages, String(userId))}
              </div>
            </React.Fragment>
          )
        )}
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-lamaSky/30 to-lamaPurple/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-ColorThree" />
            </div>
            <p className="text-ColorThree font-medium text-lg">
              No messages yet
            </p>
            <p className="text-Dark/60 text-sm mt-2">Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Floating Panels */}
      {showMediaOptions && (
        <div className="fixed sm:absolute bottom-16 sm:bottom-24 left-2 right-2 sm:left-auto sm:right-6 w-auto sm:w-80 bg-gradient-to-br from-white to-lamaSkyLight rounded-2xl shadow-2xl z-10 transition-all duration-300 border border-lamaSky/30 max-h-[70vh] overflow-y-auto">
          <div className="p-3 sm:p-2 border-b border-lamaSky/30 sticky top-0 bg-gradient-to-br from-white to-lamaSkyLight rounded-t-2xl">
            <h3 className="text-base sm:text-lg font-semibold text-Dark flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-ColorOne to-ColorTwo rounded-lg flex items-center justify-center flex-shrink-0">
                <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span>Upload Files</span>
              <button
                onClick={() => setShowMediaOptions(false)}
                className="ml-auto p-1 rounded-lg hover:bg-lamaSky/20 transition-colors sm:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </h3>
          </div>
          <div className="p-2 sm:p-2">
            <UploadthingUploader
              files={files}
              uploading={uploading}
              setUploading={setUploading}
              setShowMediaOptions={setShowMediaOptions}
              onDrop={onDrop}
              removeFile={removeFile}
              routeConfig={routeConfig}
            />
          </div>
        </div>
      )}

      {/* Emoji Picker - Responsive */}
      {showEmojiPicker && (
        <div className="fixed sm:absolute bottom-16 sm:bottom-24 left-2 right-2 sm:left-6 sm:right-auto w-auto sm:w-72 bg-gradient-to-br from-white to-lamaSkyLight rounded-2xl shadow-2xl z-10 transition-all duration-300 border border-lamaSky/30 max-h-[70vh] overflow-y-auto">
          <div className="p-3 sm:p-4 sticky top-0 bg-gradient-to-br from-white to-lamaSkyLight rounded-t-2xl border-b border-lamaSky/30">
            <h3 className="text-base sm:text-lg font-semibold text-Dark flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-ColorTwo to-ColorThree rounded-lg flex items-center justify-center flex-shrink-0">
                <Smile className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span>Emojis</span>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="ml-auto p-1 rounded-lg hover:bg-lamaSky/20 transition-colors sm:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </h3>
          </div>
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3">
              {["😀", "👍", "❤️", "😂", "🎉", "👏", "😍", "🤔", "🙌", "🚀"].map(
                (emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl sm:text-2xl hover:bg-lamaSky/20 rounded-xl p-2 sm:p-2 transition-all duration-300 hover:scale-110 aspect-square flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Section - Fully Responsive */}
      <footer className="fixed sm:relative bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-r from-white to-lamaSkyLight border-t border-lamaSky/30 w-full z-[5]">
        <div className="flex items-center justify-between bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-none sm:max-w-[95%] mx-auto border border-lamaSky/30 min-h-[52px] sm:min-h-[60px]">
          {/* Left Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 flex-shrink-0">
            <button
              onClick={toggleMediaOptions}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl text-ColorThree hover:bg-lamaSky/20 transition-all duration-300 hover:scale-110 touch-manipulation"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={toggleEmojiPicker}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl text-ColorTwo hover:bg-lamaPurple/20 transition-all duration-300 hover:scale-110 touch-manipulation"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              files.length === 0 ? "Type a message..." : "Add caption..."
            }
            className="flex-1 bg-transparent p-2 sm:p-2 focus:outline-none text-Dark text-sm sm:text-base min-w-0 placeholder:text-Dark/60 px-2 sm:px-3"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={
              uploading || (inputMessage.trim() === "" && files.length === 0)
            }
            className="p-2 sm:p-3 m-1 sm:m-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-ColorThree to-ColorTwo text-white shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 flex-shrink-0 touch-manipulation"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Safe area for mobile devices with home indicator */}
        <div className="h-safe-area-inset-bottom sm:hidden"></div>
      </footer>

      {/* Add backdrop overlay for mobile when popups are open */}
      {(showMediaOptions || showEmojiPicker) && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[5] sm:hidden"
          onClick={() => {
            setShowMediaOptions(false)
            setShowEmojiPicker(false)
          }}
        />
      )}
    </div>
  )
}
