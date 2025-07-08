// import React, { useState } from "react"
// import dynamic from "next/dynamic"
// import { EditorState, convertToRaw } from "draft-js"
// import draftToHtml from "draftjs-to-html"
// import axios from "axios"

// // Dynamically import the Editor to avoid SSR issues.
// const Editor = dynamic(
//   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
//   { ssr: false }
// )

// type RichTextFormProps = {
//   classId: String
//   subjectId: String
//   classNoteId: String
//   lessionId: String
//   chapterId: String
//   refetch: () => void
// }

// // Import CSS for react-draft-wysiwyg.
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

// export default function RichTextForm({
//   classId,
//   subjectId,
//   classNoteId,
//   lessionId,
//   chapterId,
//   refetch
// }: RichTextFormProps) {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty())
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [error, setError] = useState("")

//   const onEditorStateChange = (state: EditorState) => {
//     setEditorState(state)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsSubmitting(true)

//     try {
//       // Convert the current editor content to HTML.
//       const description = draftToHtml(
//         convertToRaw(editorState.getCurrentContent())
//       )
//       // A simple check to see if the description has any content.
//       if (!description.trim() || description === "<p></p>\n") {
//         throw new Error("Description is required")
//       }

//       const submitData = {
//         data: description
//       }
//       console.log("submitData: ", submitData)
//       // Submit to your API (update the endpoint as needed)
//       const response = await axios.patch(
//         `/api/classes/my-class/${classId}/classNotes/${subjectId}/${classNoteId}/${lessionId}/chapter/${chapterId}`,
//         submitData,
//         { params: { updateData: true } }
//       )
//       if (response.status === 200) {
//         setIsSubmitted(true)
//         setEditorState(EditorState.createEmpty())
//         refetch()
//       }
//     } catch (err: any) {
//       setError(err.message)
//       console.error("Submit error:", err)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <form onSubmit={handleSubmit}>
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         <div className="mb-6">
//           <label
//             htmlFor="description"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Description *
//           </label>
//           <Editor
//             editorState={editorState}
//             toolbarClassName="demo-toolbar-container mb-2"
//             wrapperClassName="demo-wrapper"
//             editorClassName="demo-editor p-2 border border-gray-300 rounded"
//             onEditorStateChange={onEditorStateChange}
//             toolbar={{
//               options: [
//                 "inline",
//                 "blockType",
//                 "fontSize",
//                 "list",
//                 "textAlign",
//                 "colorPicker",
//                 "link",
//                 "embedded",
//                 "emoji",
//                 "image",
//                 "remove",
//                 "history"
//               ]
//             }}
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? "Submitting..." : "Submit Form"}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
"use client"
import React, { useState, useEffect } from "react"
import { EditorState, convertToRaw, ContentState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
// Import CSS for react-draft-wysiwyg.
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

import dynamic from "next/dynamic"
import axios from "axios"
import { Save, X } from "lucide-react"
// Dynamically import the Editor to avoid SSR issues
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
)

// Enhanced Rich Text Form Component
const RichTextForm = ({
  classId,
  subjectId,
  classNoteId,
  lessionId,
  chapterId,
  refetch,
  existingContent = null,
  onClose
}: {
  classId: string
  subjectId: string
  classNoteId: string
  lessionId: string
  chapterId: string
  refetch: () => void
  existingContent?: string | null
  onClose: () => void
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Initialize editor with existing content if in edit mode
  useEffect(() => {
    if (existingContent) {
      const contentBlock = htmlToDraft(existingContent)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }
  }, [existingContent])

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Convert the current editor content to HTML
      const description = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      )

      // Check if the description has any meaningful content
      if (
        !description.trim() ||
        description === "<p></p>\n" ||
        description === "<p></p>"
      ) {
        throw new Error("Content is required")
      }

      const submitData = {
        data: description
      }

      // Submit to your API
      const response = await axios.patch(
        `/api/classes/my-class/${classId}/classNotes/${subjectId}/${classNoteId}/${lessionId}/chapter/${chapterId}`,
        submitData,
        { params: { updateData: true } }
      )

      if (response.status === 200) {
        setEditorState(EditorState.createEmpty())
        refetch()
        onClose()
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving")
      console.error("Submit error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-none mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Chapter Content *
          </label>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Editor
              editorState={editorState}
              toolbarClassName="border-b border-gray-200 bg-gray-50 px-4 py-2"
              wrapperClassName="min-h-[400px]"
              editorClassName="px-4 py-3 min-h-[350px] prose prose-sm max-w-none"
              onEditorStateChange={onEditorStateChange}
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "fontFamily",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "embedded",
                  "emoji",
                  "image",
                  "remove",
                  "history"
                ],
                inline: {
                  inDropdown: false,
                  className: "inline-style-buttons",
                  options: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "monospace",
                    "superscript",
                    "subscript"
                  ]
                },
                blockType: {
                  inDropdown: true,
                  options: [
                    "Normal",
                    "H1",
                    "H2",
                    "H3",
                    "H4",
                    "H5",
                    "H6",
                    "Blockquote",
                    "Code"
                  ],
                  className: "block-type-dropdown"
                },
                fontSize: {
                  options: [
                    8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96
                  ],
                  className: "font-size-dropdown"
                },
                fontFamily: {
                  options: [
                    "Arial",
                    "Georgia",
                    "Impact",
                    "Tahoma",
                    "Times New Roman",
                    "Verdana"
                  ],
                  className: "font-family-dropdown"
                },
                list: {
                  inDropdown: false,
                  className: "list-style-buttons",
                  options: ["unordered", "ordered", "indent", "outdent"]
                },
                textAlign: {
                  inDropdown: false,
                  className: "text-align-buttons",
                  options: ["left", "center", "right", "justify"]
                },
                colorPicker: {
                  className: "color-picker-button",
                  popupClassName: "color-picker-popup"
                },
                link: {
                  inDropdown: false,
                  className: "link-button",
                  popupClassName: "link-popup",
                  options: ["link", "unlink"]
                },
                embedded: {
                  className: "embedded-button",
                  popupClassName: "embedded-popup"
                },
                emoji: {
                  className: "emoji-button",
                  popupClassName: "emoji-popup"
                },
                image: {
                  className: "image-button",
                  popupClassName: "image-popup",
                  urlEnabled: true,
                  uploadEnabled: true,
                  alignmentEnabled: true,
                  uploadCallback: undefined,
                  previewImage: false,
                  inputAccept:
                    "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                  alt: { present: false, mandatory: false }
                },
                remove: {
                  className: "remove-button"
                },
                history: {
                  inDropdown: false,
                  className: "history-buttons",
                  options: ["undo", "redo"]
                }
              }}
              placeholder="Start writing your chapter content..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {existingContent ? "Update Content" : "Save Content"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
export default RichTextForm
