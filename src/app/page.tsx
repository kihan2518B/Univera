"use client"

// export default function Home() {
//   return <div className="">hi</div>
// }

import { staticData } from "@/constant"
import { useState } from "react"

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<"student" | "faculty">(
    "student"
  )
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  )
  const [selectedYear, setSelectedYear] = useState<string | null>(null)

  const handleRoleChange = (role: "student" | "faculty") => {
    setSelectedRole(role)
    setSelectedDepartment(null) // Reset department selection on role change
  }

  // Filter forums data based on selected department and year
  const filteredForums =
    staticData.forums.filter(
      (forum) =>
        forum.department === selectedDepartment && forum.year === selectedYear
    ) || []

  return (
    <div
      className="min-h-screen flex flex-row bg-[#CECDF9] text-[#0A2353]"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Left Sidebar - Forums Section */}
      <div className="w-1/4 p-4 bg-[#112C71] text-white">
        <h2 className="text-xl font-bold mb-4">Forums Section</h2>

        {/* Create Issue Button */}
        {selectedDepartment && selectedYear && (
          <button
            onClick={() => alert("Create Issue functionality")}
            className="w-full bg-[#56E1E9] text-[#0A2353] py-2 mb-4 rounded-lg font-semibold"
          >
            Create Issue
          </button>
        )}

        {/* History of Forums */}
        <div>
          <h3 className="text-lg font-semibold mb-2">History</h3>
          {filteredForums.length > 0 ? (
            filteredForums[0].issues.map((issue) => (
              <div
                key={issue.id}
                className="p-2 mb-2 bg-[#CECDF9] text-[#0A2353] rounded-lg"
              >
                <p>
                  <span className="font-bold">Date:</span> {issue.date}
                </p>
                <p>
                  <span className="font-bold">Name:</span> {issue.name}
                </p>
                <p>
                  <span className="font-bold">Status:</span>{" "}
                  <span
                    className={
                      issue.status === "Resolved"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {issue.status}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm">No issues found for the selected values.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Filter Section */}
        <div className="mb-6">
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => handleRoleChange("student")}
              className={`px-6 py-2 rounded-lg font-semibold mx-2 ${
                selectedRole === "student"
                  ? "bg-[#112C71] text-white"
                  : "bg-[#56E1E9] text-[#0A2353]"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => handleRoleChange("faculty")}
              className={`px-6 py-2 rounded-lg font-semibold mx-2 ${
                selectedRole === "faculty"
                  ? "bg-[#112C71] text-white"
                  : "bg-[#56E1E9] text-[#0A2353]"
              }`}
            >
              Faculty
            </button>
          </div>

          <h2 className="text-lg font-semibold mb-4 mx-auto w-fit text-[#0A2353]">
            {selectedRole === "student"
              ? "Select a Department and Year"
              : "Select a Faculty Department"}
          </h2>

          {/* Dropdown for Departments */}
          <select
            onChange={(e) => setSelectedDepartment(e.target.value)}
            value={selectedDepartment || ""}
            className="w-full px-4 py-2 mb-4 border border-[#112C71] rounded-lg text-[#0A2353]"
          >
            <option value="" disabled>
              Select a Department
            </option>
            {staticData[selectedRole].departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          {/* Dropdown for Years (only for students) */}
          {selectedRole === "student" && selectedDepartment && (
            <select
              onChange={(e) => setSelectedYear(e.target.value)}
              value={selectedYear || ""}
              className="w-full px-4 py-2 border border-[#112C71] rounded-lg text-[#0A2353]"
            >
              <option value="" disabled>
                Select a Year
              </option>
              {staticData.student.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  )
}
