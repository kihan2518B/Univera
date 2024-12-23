"use client"

import React, { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import io, { Socket } from "socket.io-client"
import { ForumSidebar } from "@/app/(module)/(forum)/_components/ForumSidebar"
import { ChatSection } from "@/app/(module)/(forum)/_components/ChatSection"
import { useParams } from "next/navigation"
import { chatMessage, Forum } from "@/types/globals"

export default function Home() {
  const [forums, setForums] = useState<Forum[]>([])
  const [selectedForumId, setSelectedForumId] = useState<number | null>(null)
  const [messages, setMessages] = useState<chatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [tag, setTag] = useState<string>("")
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isForumDialogOpen, setIsForumDialogOpen] = useState(false)
  const [forumName, setForumName] = useState<string>("")
  const [forumTags, setForumTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [departmentId, setDepartmentId] = useState<number | null>(null)
  const [courseId, setCourseId] = useState<number | null>(null)
  const [isPrivate, setIsPrivate] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ url: string; fileType: string; fileName: string }>
  >([])

  const userData = useUser()
  const userId = userData.user?.id
  const userRole = userData.user?.publicMetadata.role as string
  const socketRef = useRef<Socket | null>(null) // Store socket in a ref
  const { subjectId } = useParams()
  // console.log("userId", userId)
  // console.log("subjectId", subjectId)
  // console.log("userRole", userRole)

  useEffect(() => {
    // Initialize socket connection with the path to the WebSocket API
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      transports: ["websocket", "polling"]
    })
    socketRef.current = socket

    socketRef.current.on("connect", () => {
      console.log("WebSocket connected:", socketRef.current?.id)
    })

    socketRef.current.on("connect_error", (error) => {
      console.log("WebSocket connection error:", error)
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
        if (!res.ok)
          console.log("Failed to fetch messages from DB @(module)/forum/page")

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
        console.log("Error fetching messages from DB:", error)
        setMessages(localMessages) // Fallback to local messages if DB fetch fails
      }
    }

    fetchMessages()

    // On socket connection
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server")
    })

    socketRef.current?.emit("join_forum", selectedForumId) // Join the forum room
    console.log("Connected to WebSocket server with forum", selectedForumId)

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
    // console.log("All messages before deduplication:", allMessages)

    // Remove duplicates based on the `id` field
    const uniqueMessages = Array.from(
      new Map(allMessages.map((msg) => [msg.id, msg])).values()
    )
    // console.log("Unique messages after deduplication:", uniqueMessages)

    return uniqueMessages
  }

  useEffect(() => {
    // Fetch forums data dynamically based on userId
    const fetchForums = async () => {
      try {
        const response = await fetch(
          `/api/subjects/forum?subjectId=${subjectId}`
        )
        if (!response.ok)
          throw new Error("Failed to fetch the forums @app/page")

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
    message: string,
    attachments: Array<{ url: string; fileType: string; fileName: string }> = []
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

      // console.log("New message with attachments:", newMessage);

      // it recreting same message again cause of time difference of minor milliseconds, so we storing only unique messages when it's already in local storage

      // Fetch existing messages from localStorage
      const storedMessages = JSON.parse(
        localStorage.getItem(`forum_${selectedForumId}`) || "[]"
      )
      // console.log("Stored messages:", storedMessages);

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
      // console.log("Is duplicate:", isDuplicate);

      if (!isDuplicate) {
        // Add the new message to the localStorage
        const updatedMessages = [...storedMessages, newMessage]
        localStorage.setItem(
          `forum_${selectedForumId}`,
          JSON.stringify(updatedMessages)
        )
        // console.log("Updated messages in local:",JSON.parse(localStorage.getItem(`forum_${selectedForumId}`) || "[]"))
      }

      if (socketRef.current) {
        socketRef.current.emit("send_message", newMessage)
        console.log("Socket is connected, sending message...", newMessage)
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
        console.log("Messages stored successfully.")
        localStorage.removeItem(`forum_${selectedForumId}`)
      }
    } catch (error) {
      console.log("Error saving messages:", error)
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
    // console.log("messages before", messages)
    setMessages(messages.filter((message: any) => message.id !== id))
    // console.log("messages after", messages)

    // reover from local storage
    const localMessages = JSON.parse(
      localStorage.getItem(`forum_${selectedForumId}`) || "[]"
    )
    // console.log("localMessages before", localMessages)

    const updatedMessages = localMessages.filter(
      (message: any) => message.id !== id
    )

    localStorage.setItem(
      `forum_${selectedForumId}`,
      JSON.stringify(updatedMessages)
    )
    // console.log("localMessages after", localMessages)
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
        console.log(
          "Failed to delete messages from DB /@module)/(forum)/forum/[subjectId]/page"
        )
      }

      localStorage.removeItem("deletedMessageIds")
      return await response.json()
    } catch (error) {
      console.log(
        "error while delete messages from DB /@module)/(forum)/forum/[subjectId]/page",
        error
      )
    }
  }

  const addTag = async () => {
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

      if (!res.ok) throw new Error("Failed to add tag")

      setTag("") // Clear the input
      setIsTagDialogOpen(false) // Close dialog
    } catch (error) {
      console.log(
        `error while creating tag @(module)/(forum)/forum/[subjectId]/page${error}`
      )
    }
  }

  // Fetch forumTags, departmentId, and courseId from the subject table
  useEffect(() => {
    async function fetchSubjectDetails() {
      try {
        const res = await fetch(
          `/api/subjects/forum/helper?route=subjectDetails&subjectId=${subjectId}`
        )
        if (!res.ok) throw new Error("Failed to fetch subject details")

        const data = await res.json()
        setForumTags(data.forumTags || [])
        setDepartmentId(data.departmentId)
        setCourseId(data.courseId)
      } catch (error) {
        console.log("Error fetching subject details:", error)
      }
    }

    fetchSubjectDetails()
  }, [subjectId])

  // Handle forum creation
  const createForum = async () => {
    try {
      // Fetch the faculty data for the given courseId
      const facultyRes = await fetch(
        `/api/subjects/forum/helper?route=facultyDetails&courseId=${courseId}`
      )
      if (!facultyRes.ok) {
        throw new Error("Failed to fetch faculty data")
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

      if (!res.ok) throw new Error("Failed to create forum")

      const newForum = await res.json()
      // console.log("Forum created successfully:", newForum)

      setForums((prev) => [...prev, newForum])
      setForumName("") // Clear the input
      setSelectedTags([]) // Clear selected tags
      setIsForumDialogOpen(false) // Close dialog
    } catch (error) {
      console.log("Error creating forum:", error)
    }
  }

  // console.log("selected forum", selectedForumId)
  // console.log("messages", messages)
  // console.log("forums", forums)

  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="h-[89vh] py-2 px-3 grid grid-cols-[auto,1fr] gap-4">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${isCollapsed ? "w-16" : "w-[80vw] md:w-full"}`}
      >
        <ForumSidebar
          forums={forums}
          selectedForumId={selectedForumId}
          tag={tag}
          setTag={setTag}
          addTag={addTag}
          userRole={userRole}
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
        />
      </div>

      {/* Chat Section */}
      <div className="h-[85vh] overflow-hidden">
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
          !isCollapsed && (
            <div className="h-[82.5vh] bg-white rounded-lg flex items-center justify-center">
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
    </div>
  )
}