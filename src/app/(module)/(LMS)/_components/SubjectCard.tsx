import { Subject } from "@prisma/client"
import React from "react"

interface SubjectCardProps {
  subject: Subject
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <div
      id="subject-card"
      className="block w-full bg-gradient-to-tr from-gray-100 to-gray-200 hover:from-Secondary hover:to-Secondary/50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-102"
    >
      <div className="p-6">
        <div className="text-left space-y-3">
          <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2">
            {subject.name}
          </h2>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Code:</span>
              <span className="text-sm text-gray-600">{subject.code}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Credits:
              </span>
              <span className="text-sm text-gray-600">{subject.credits}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Semester:
              </span>
              <span className="text-sm text-gray-600">{subject.semester}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
