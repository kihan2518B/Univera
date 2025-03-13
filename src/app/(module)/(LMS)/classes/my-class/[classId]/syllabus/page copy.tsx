"use client"

import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"

interface Subject {
  name: string
  code: string
  publisher: string
  syllabusUrl: string
}

const subjects: Subject[] = [
  {
    name: "Introduction to Computer Science",
    code: "CS101",
    publisher: "Department of Computer Science",
    syllabusUrl: "/sample-syllabus.pdf"
  },
  {
    name: "Data Structures and Algorithms",
    code: "CS201",
    publisher: "Department of Computer Science",
    syllabusUrl: "/sample-syllabus.pdf"
  },
  {
    name: "Database Management Systems",
    code: "CS301",
    publisher: "Department of Computer Science",
    syllabusUrl: "/sample-syllabus.pdf"
  },
  {
    name: "Web Development",
    code: "CS401",
    publisher: "Department of Computer Science",
    syllabusUrl: "/sample-syllabus.pdf"
  },
  {
    name: "Artificial Intelligence",
    code: "CS501",
    publisher: "Department of Computer Science",
    syllabusUrl: "/sample-syllabus.pdf"
  }
]

const colors = [
  { bg: "#FFF4D3", icon: "#F6C000" },
  { bg: "#E6E4FF", icon: "#8B85FF" },
  { bg: "#D9F5FF", icon: "#47B4D1" }
]

const PDFIcon = ({ color }: { color: string }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="4"
      width="32"
      height="32"
      rx="2"
      fill={color}
      fillOpacity="0.2"
    />
    <path d="M12 10H28V30H12V10Z" fill="white" />
    <path d="M14 12H26V28H14V12Z" fill={color} fillOpacity="0.1" />
    <path d="M16 20H24V21H16V20Z" fill={color} />
    <path d="M16 23H22V24H16V23Z" fill={color} />
    <path d="M16 26H20V27H16V26Z" fill={color} />
    <path d="M16 14H24V17H16V14Z" fill={color} />
  </svg>
)

export default function SyllabusPage() {
  const handleDownload = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#1a237e] mb-6">Syllabus</h1>
      <div className="space-y-4">
        {subjects.map((subject, index) => {
          const colorSet = colors[index % colors.length]
          return (
            <Card
              key={subject.code}
              style={{ backgroundColor: colorSet.bg }}
              className={`group relative p-4 cursor-pointer transition-all duration-300 ease-in-out
                         hover:scale-[1.02] hover:shadow-lg overflow-hidden`}
              onClick={() => handleDownload(subject.syllabusUrl)}
            >
              <div className="relative flex items-center gap-4">
                <div className="flex-shrink-0">
                  <PDFIcon color={colorSet.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-800 text-lg truncate">
                    {subject.name}
                  </h2>
                  <div className="flex gap-2 text-sm text-gray-600 mt-1 flex-wrap">
                    <span className="bg-white/50 px-2 py-0.5 rounded-full truncate">
                      {subject.code}
                    </span>
                    <span className="bg-white/50 px-2 py-0.5 rounded-full truncate">
                      {subject.publisher}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white/25 p-2 rounded-full group-hover:bg-white/40 transition-colors duration-300">
                    <Download className="h-5 w-5 text-gray-800" />
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
