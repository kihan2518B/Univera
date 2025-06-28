import React, { useState } from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link
} from "lucide-react"

export default function RichTextForm() {
  // const [formData, setFormData] = useState({
  //   title: "",
  //   content: "",
  //   youtubeUrl: "",
  //   files: []
  // })
  const [previewMode, setPreviewMode] = useState(false)
  // const [submittedData, setSubmittedData] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {isSubmitted ? (
        <div className="submitted-form">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">
            Form Submitted Successfully!
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Title:</h3>
            <p className="p-3 bg-gray-50 rounded">title</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Content:</h3>
            <div
              className="p-3 bg-gray-50 rounded prose max-w-none"
              //   dangerouslySetInnerHTML={createMarkup(submittedData.content)}
            />
          </div>

          {/* {submittedData.files.length > 0 && ( */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Uploaded Files:</h3>
            <ul className="list-disc pl-5">
              {/* {Array.from(submittedData.files).map((file, index) => (
                  <li key={index} className="mb-1">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </li>
                ))} */}
            </ul>
          </div>
          {/* )} */}

          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Form
          </button>
        </div>
      ) : (
        <form className="rich-text-form">
          <h1 className="text-2xl font-bold mb-6 text-blue-700">
            Rich Text Form
          </h1>

          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              // value={formData.title}
              //   onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-gray-700 font-medium mb-2"
            >
              Content
            </label>

            <div className="toolbar flex flex-wrap gap-1 mb-2 p-2 bg-gray-100 rounded">
              <button
                type="button"
                // onClick={() => insertFormatting('bold')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Bold"
              >
                <Bold size={18} />
              </button>
              <button
                type="button"
                // onClick={() => insertFormatting('italic')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Italic"
              >
                <Italic size={18} />
              </button>
              <button
                type="button"
                // onClick={() => insertFormatting('underline')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Underline"
              >
                <Underline size={18} />
              </button>
              <div className="border-r border-gray-300 mx-1 h-6"></div>
              <button
                type="button"
                // onClick={() => insertFormatting('h1')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Heading 1"
              >
                <Heading1 size={18} />
              </button>
              <button
                type="button"
                // onClick={() => insertFormatting('h2')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Heading 2"
              >
                <Heading2 size={18} />
              </button>
              <div className="border-r border-gray-300 mx-1 h-6"></div>
              <button
                type="button"
                // onClick={() => insertFormatting('align-left')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Align Left"
              >
                <AlignLeft size={18} />
              </button>
              <button
                type="button"
                // onClick={() => insertFormatting('align-center')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Align Center"
              >
                <AlignCenter size={18} />
              </button>
              <button
                type="button"
                // onClick={() => insertFormatting('align-right')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Align Right"
              >
                <AlignRight size={18} />
              </button>
              <div className="border-r border-gray-300 mx-1 h-6"></div>
              <button
                type="button"
                // onClick={() => insertFormatting('ul')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Bullet List"
              >
                <List size={18} />
              </button>
              <button
                type="button"
                // onClick={() => insertFormatting('ol')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Numbered List"
              >
                <ListOrdered size={18} />
              </button>
              <div className="border-r border-gray-300 mx-1 h-6"></div>
              <button
                type="button"
                // onClick={() => insertFormatting('link')}
                className="p-1 hover:bg-gray-200 rounded"
                title="Insert Link"
              >
                <Link size={18} />
              </button>
              <div className="ml-auto flex items-center">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded text-blue-700"
                >
                  {previewMode ? "Edit Mode" : "Preview"}
                </button>
              </div>
            </div>

            {previewMode ? (
              <div
                className="border border-gray-300 rounded p-3 min-h-48 prose max-w-none bg-gray-50"
                // dangerouslySetInnerHTML={createMarkup(formData.content)}
              />
            ) : (
              <textarea
                id="content"
                name="content"
                // rows="10"
                // value={formData.content}
                // onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
            )}
            <p className="text-sm text-gray-500 mt-1">
              Use the toolbar to format your text. HTML tags are supported.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Form
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
