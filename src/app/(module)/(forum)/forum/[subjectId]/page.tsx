"use client"

import React, { useState, useEffect, useRef, useContext } from "react"
import io, { Socket } from "socket.io-client"
import { ForumSidebar } from "@/app/(module)/(forum)/_components/ForumSidebar"
import { ChatSection } from "@/app/(module)/(forum)/_components/ChatSection"
import { useParams } from "next/navigation"
import { chatMessage, Forum, UploadedFile } from "@/types/globals"
import toast from "react-hot-toast"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"

async function fetchSubjectDetails(subjectId: string | undefined | string[]) {
  try {
    const res = await fetch(
      `/api/subjects/forum/helper?route=subjectDetails&subjectId=${subjectId}`
    )
    if (!res.ok) {
      throw new Error("Failed to fetch subject details")
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching subject details:", error)
    throw error
  }
}

export default function Home() {
  const [forums, setForums] = useState<Forum[]>([])
  const [selectedForumId, setSelectedForumId] = useState<number | null>(null)
  const [messages, setMessages] = useState<chatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [tag, setTag] = useState<string>("")
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isForumDialogOpen, setIsForumDialogOpen] = useState(false)
  const [forumName, setForumName] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [isSubmittingForumForm, setIsSubmittingForumForm] = useState(false)
  const [isSubmittingForumTagForm, setIsSubmittingForumTagForm] =
    useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const { user } = useContext(UserContext)
  const userId = user?.id
  const userRoles = user?.roles?.map((role: any) => role.id) || []

  const socketRef = useRef<Socket | null>(null) // Store socket in a ref
  const { subjectId } = useParams()

  useEffect(() => {
    // Initialize socket connection with the path to the WebSocket API
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      transports: ["websocket", "polling"]
    })
    socketRef.current = socket

    socketRef.current.on("connect", () => {})

    socketRef.current.on("connect_error", () => {
      console.log("WebSocket connection error")
    })

    socketRef.current.on("connect_timeout", () => {
      console.log("WebSocket connection timed out")
    })

    socketRef.current.on("disconnect", (reason) => {
      console.log("WebSocket disconnected. Reason:", reason)
    })

    // Fetch messages from DB and localStorage on forum change
    const fetchMessages = async () => {
      const localMessages = JSON.parse(
        localStorage.getItem(`forum_${selectedForumId}`) || "[]"
      )

      try {
        const res = await fetch(
          `/api/subjects/forum/messages?forumId=${selectedForumId}`
        )
        if (!res.ok) console.log("Failed to fetch messages from DB")

        const dbMessages = await res.json()

        // Fetch deletedMessageIds from localStorage
        const deletedMessageIds = new Set(
          JSON.parse(localStorage.getItem("deletedMessageIds") || "[]")
        )

        // Filter out messages that are in deletedMessageIds
        const filteredDbMessages = dbMessages.filter(
          (message: { id: number }) => !deletedMessageIds.has(message.id)
        )

        setMessages(mergeMessages(filteredDbMessages, localMessages))
      } catch (error) {
        if (error) console.log("Error fetching messages from DB")
        setMessages(localMessages) // Fallback to local messages if DB fetch fails
      }
    }

    fetchMessages()

    // On socket connection
    socketRef.current.on("connect", () => {})

    socketRef.current?.emit("join_forum", selectedForumId) // Join the forum room

    socketRef.current.on("receive_message", (newMessage: any) => {
      setMessages((prev) => {
        // Check if the message is a duplicate
        const isDuplicate = prev.some(
          (msg) =>
            msg.message === newMessage.message &&
            msg.forumId === newMessage.forumId &&
            Math.abs(
              new Date(msg.createdAt).getTime() -
                new Date(newMessage.createdAt).getTime()
            ) < 50 // Allowing minor time difference
        )

        // If the message is not a duplicate, add it to the state
        if (!isDuplicate) {
          const updatedMessages = [...prev, newMessage]
          return updatedMessages
        }

        return prev
      })
    })

    // On socket disconnection
    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server")
    })

    // Cleanup on component unmount or forum change
    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("leave_forum", selectedForumId) // Leave the forum room
        socketRef.current.disconnect() // Disconnect only if connected
      }
    }
  }, [selectedForumId])

  const mergeMessages = (
    existingMessages: chatMessage[],
    newMessages: chatMessage[]
  ) => {
    const safeNewMessages = Array.isArray(newMessages) ? newMessages : []
    const safeExistingMessages = Array.isArray(existingMessages)
      ? existingMessages
      : []

    const allMessages = [...safeExistingMessages, ...safeNewMessages]

    // Remove duplicates based on the `id` field
    const uniqueMessages = Array.from(
      new Map(allMessages.map((msg) => [msg.id, msg])).values()
    )

    return uniqueMessages
  }

  useEffect(() => {
    // Fetch forums data dynamically based on userId
    const fetchForums = async () => {
      try {
        const response = await fetch(
          `/api/subjects/forum?subjectId=${subjectId}`
        )
        if (!response.ok) console.log("Failed to fetch the forums")

        const data = await response.json()
        // console.log("forums from DB", data)
        setForums(data)
      } catch (error: any) {
        console.log(
          error.message || "An error occurred while fetching forums @app/page"
        )
      }
    }

    fetchForums()
  }, [userId])

  const handleForumSelect = (forumId: any) => {
    setSelectedForumId(forumId)
  }

  const sendMessage = async (
    message?: string,
    attachments: UploadedFile[] = []
  ) => {
    if (
      message &&
      (message.trim() || attachments.length > 0) &&
      selectedForumId
    ) {
      const newMessage = {
        id: Date.now(),
        message: message.trim(),
        userId,
        forumId: selectedForumId,
        attachments: attachments,
        createdAt: new Date().toISOString()
      }
      // it recreting same message again cause of time difference of minor milliseconds, so we storing only unique messages when it's already in local storage

      // Fetch existing messages from localStorage
      const storedMessages = JSON.parse(
        localStorage.getItem(`forum_${selectedForumId}`) || "[]"
      )

      // Check if the message is a duplicate, mean already in the local storage
      const isDuplicate = storedMessages.some(
        (msg: any) =>
          msg.message === newMessage.message &&
          msg.forumId === newMessage.forumId &&
          Math.abs(
            new Date(msg.createdAt).getTime() -
              new Date(newMessage.createdAt).getTime()
          ) < 50 // Allowing minor time difference
      )

      if (!isDuplicate) {
        // Add the new message to the localStorage
        const updatedMessages = [...storedMessages, newMessage]
        localStorage.setItem(
          `forum_${selectedForumId}`,
          JSON.stringify(updatedMessages)
        )
      }

      if (socketRef.current) {
        socketRef.current.emit("send_message", newMessage)
      } else {
        console.log("Socket is not connected.")
      }

      setUploadedFiles([])
      setInputMessage("")
    }
  }

  useEffect(() => {
    if (selectedForumId) {
      const saveInterval = setInterval(
        () => {
          const localMessages = JSON.parse(
            localStorage.getItem(`forum_${selectedForumId}`) || "[]"
          )

          if (localMessages.length > 0) {
            saveChatMessages(selectedForumId, localMessages) // call the function to save chat
          }

          const deletedMessageIds = JSON.parse(
            localStorage.getItem(`deletedMessageIds`) || "[]"
          )

          if (deletedMessageIds.length > 0) {
            deleteMessagesFromDB(selectedForumId, deletedMessageIds)
          }
        },
        1 * 60 * 1000
      ) // every minutes call the function

      return () => clearInterval(saveInterval) // clear the interval
    }
  }, [messages, selectedForumId])

  // Reusable saveChatMessages function
  const saveChatMessages = async (
    selectedForumId: number,
    localMessages: any[]
  ) => {
    const processedMessages = localMessages.map((msg) => ({
      message: msg.message,
      userId: msg.userId,
      forumId: msg.forumId,
      attachments: Array.isArray(msg.attachments) ? msg.attachments : [], // Ensure it's an array
      createdAt: msg.createdAt
    }))

    try {
      const response = await fetch("/api/subjects/forum/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedForumId, processedMessages })
      })

      if (response.ok) {
        localStorage.removeItem(`forum_${selectedForumId}`)
      }
    } catch (error) {
      if (error) toast.error("Error saving messages")
    }
  }

  // for store the messages when user leave chatbox
  const handleLeaveChat = async () => {
    if (selectedForumId) {
      const localMessages = JSON.parse(
        localStorage.getItem(`forum_${selectedForumId}`) || "[]"
      )
      await saveChatMessages(selectedForumId, localMessages)
    }
    setSelectedForumId(null)
  }

  const handleDeleteMessage = (id: number) => {
    // Fetch existing deletedMessageIds from localStorage
    const deletedMessageIds = new Set<number>(
      JSON.parse(localStorage.getItem("deletedMessageIds") || "[]")
    )

    // Add the message ID to the deletedMessageIds array
    deletedMessageIds.add(id)
    localStorage.setItem(
      "deletedMessageIds",
      JSON.stringify(Array.from(deletedMessageIds))
    )

    // Remove from state
    setMessages(messages.filter((message: any) => message.id !== id))

    // reover from local storage
    const localMessages = JSON.parse(
      localStorage.getItem(`forum_${selectedForumId}`) || "[]"
    )

    const updatedMessages = localMessages.filter(
      (message: any) => message.id !== id
    )

    localStorage.setItem(
      `forum_${selectedForumId}`,
      JSON.stringify(updatedMessages)
    )
  }

  const deleteMessagesFromDB = async (
    forumId: number,
    messageIds: number[]
  ) => {
    if (!forumId || !messageIds.length) return

    console.log("messages befor dele from DB", messageIds)

    try {
      const response = await fetch("/api/subjects/forum/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forumId, messageIds })
      })

      if (!response.ok) {
        toast.error("Failed to delete messages from DB")
      }

      localStorage.removeItem("deletedMessageIds")
      return await response.json()
    } catch (error) {
      if (error) toast.error("error while delete messages from DB")
    }
  }

  const addTag = async () => {
    if (isSubmittingForumTagForm) return // Prevent double submissions
    setIsSubmittingForumTagForm(true)

    if (!subjectId || !tag.trim()) {
      alert("Subject ID or tag is missing!")
      return
    }

    try {
      const res = await fetch("/api/subjects/forum/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, tag })
      })

      if (!res.ok) toast.error("Failed to create tag")

      setTag("") // Clear the input
      setIsTagDialogOpen(false) // Close dialog
      refetchSubjectDetails()
    } catch (error) {
      if (error) toast.error("error while creating tag")
    } finally {
      setIsSubmittingForumTagForm(false)
    }
  }

  const { data: subjectDetails, refetch: refetchSubjectDetails } = useQuery({
    queryKey: ["subjectDetails", subjectId],
    queryFn: () => fetchSubjectDetails(subjectId),
    enabled: !!subjectId // Ensures query runs only when subjectId exists
  })

  // Derived state from fetched data
  const forumTags = subjectDetails?.forumTags || []
  const departmentId = subjectDetails?.departmentId
  const courseId = subjectDetails?.courseId

  // Handle forum creation
  const createForum = async () => {
    if (isSubmittingForumForm) return // Prevent double submissions
    setIsSubmittingForumForm(true)
    try {
      // Fetch the faculty data for the given courseId
      const facultyRes = await fetch(
        `/api/subjects/forum/helper?route=facultyDetails&courseId=${courseId}`
      )
      if (!facultyRes.ok) {
        console.log("Failed to fetch faculty data")
      }

      const facultyList = await facultyRes.json()

      // Find the faculty with the earliest `createdAt`
      const earliestFaculty = facultyList.reduce(
        (earliest: any, current: any) => {
          return new Date(current.createdAt) < new Date(earliest.createdAt)
            ? current
            : earliest
        }
      )

      const moderatorId = earliestFaculty.id

      const res = await fetch("/api/subjects/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: forumName,
          userId,
          subjectId,
          departmentId,
          moderatorId,
          courseId,
          forumTags: selectedTags,
          isPrivate
        })
      })

      if (!res.ok) toast.error("Failed to create forum")

      const newForum = await res.json()
      // console.log("Forum created successfully:", newForum)

      setForums((prev) => [...prev, newForum])
      setForumName("") // Clear the input
      setSelectedTags([]) // Clear selected tags
      setIsForumDialogOpen(false) // Close dialog
    } catch (error) {
      if (error) toast.error("Error creating forum")
    } finally {
      setIsSubmittingForumForm(false)
    }
  }

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 540)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 540)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="h-[89vh] py-2 px-3 flex">
      {isMobileView ? (
        selectedForumId === null ? (
          // Mobile view: Show Sidebar only
          <div
            className={`transition-all duration-300 h-[85vh] w-[80vw] md:w-full`}
          >
            <ForumSidebar
              forums={forums}
              selectedForumId={selectedForumId}
              tag={tag}
              setTag={setTag}
              addTag={addTag}
              userRole={userRoles}
              isTagDialogOpen={isTagDialogOpen}
              setIsTagDialogOpen={setIsTagDialogOpen}
              isForumDialogOpen={isForumDialogOpen}
              setIsForumDialogOpen={setIsForumDialogOpen}
              onForumSelect={(id) => setSelectedForumId(id)}
              forumName={forumName}
              forumTags={forumTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              createForum={createForum}
              isPrivate={isPrivate}
              setForumName={setForumName}
              setIsPrivate={setIsPrivate}
              isSubmittingForumForm={isSubmittingForumForm}
              isSubmittingForumTagForm={isSubmittingForumTagForm}
            />
          </div>
        ) : (
          // Mobile view: Show Chatbox only
          <div className="h-[85vh] w-full overflow-hidden">
            <ChatSection
              messages={messages}
              userId={userId}
              inputMessage={inputMessage}
              onInputChange={setInputMessage}
              onSendMessage={sendMessage}
              onLeaveChat={handleLeaveChat}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              handleDeleteMessage={handleDeleteMessage}
            />
          </div>
        )
      ) : (
        // Desktop view: Show Sidebar and Chatbox side by side
        <>
          <div className={`transition-all duration-300 h-[85vh] w-[35%]`}>
            <ForumSidebar
              forums={forums}
              selectedForumId={selectedForumId}
              tag={tag}
              setTag={setTag}
              addTag={addTag}
              userRole={userRoles}
              isTagDialogOpen={isTagDialogOpen}
              setIsTagDialogOpen={setIsTagDialogOpen}
              isForumDialogOpen={isForumDialogOpen}
              setIsForumDialogOpen={setIsForumDialogOpen}
              onForumSelect={handleForumSelect}
              forumName={forumName}
              forumTags={forumTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              createForum={createForum}
              isPrivate={isPrivate}
              setForumName={setForumName}
              setIsPrivate={setIsPrivate}
              isSubmittingForumForm={isSubmittingForumForm}
              isSubmittingForumTagForm={isSubmittingForumTagForm}
            />
          </div>

          {/* Chat Section */}
          <div className="h-[85vh] w-full overflow-hidden">
            {selectedForumId ? (
              <ChatSection
                messages={messages}
                userId={userId}
                inputMessage={inputMessage}
                onInputChange={setInputMessage}
                onSendMessage={sendMessage}
                onLeaveChat={handleLeaveChat}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                handleDeleteMessage={handleDeleteMessage}
              />
            ) : (
              !isMobileView && (
                <div className="h-[90vh] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600">
                      Please Select a Forum
                    </h2>
                    <p className="mt-2 text-gray-500">
                      Choose a forum from the sidebar to start chatting
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
