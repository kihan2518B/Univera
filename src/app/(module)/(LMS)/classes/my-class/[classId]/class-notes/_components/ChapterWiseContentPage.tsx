"use client"
import { useState } from "react"
import { Chapter } from "@prisma/client"
// import AddChapterWiseContent from "./_lessionComponents/AddChapterWiseContent"

export default function ChapterWiseContentPage({
  chapter
}: {
  chapter: Chapter
}) {
  const [isButtonactive, setIsButtonActive] = useState(false)
  console.log(chapter, isButtonactive)
  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={() => setIsButtonActive(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-ColorThree to-ColorTwo text-white rounded-lg px-4 py-2"
        >
          <span className="text-sm font-bold">Add Lesson Content</span>
        </button>
        {/* {isButtonactive && <AddChapterWiseContent />} */}
      </div>

      {/* Display */}
    </div>
  )
}
