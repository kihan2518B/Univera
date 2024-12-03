import { FaUserMd, FaUsers } from "react-icons/fa"
import {
  MdSpaceDashboard,
  MdSchool,
  MdPeopleAlt,
  MdGroups2
} from "react-icons/md"

export const Menuitems = {
  admin: [
    { title: "Dashboard", url: "/erp/admin/dashboard", icon: MdSpaceDashboard },
    { title: "Departments", url: "/erp/admin/departments", icon: MdSchool },
    {
      title: "University Admin Team",
      url: "/erp/admin/university-admin-team",
      icon: MdPeopleAlt
    },
    {
      title: "Non-Teaching Staff",
      url: "/erp/admin/non-teaching-staff",
      icon: MdGroups2
    }
  ],
  university_admin_staff: [
    { title: "Doctors", url: "/admin/doctors", icon: FaUserMd },
    { title: "Patients", url: "/admin/patients", icon: FaUsers }
  ],
  user: []
}

import { IconType } from "react-icons"

export interface LinkItem {
  title: string
  url: string
  icon: IconType
}

export interface MenuItems {
  [role: string]: LinkItem[]
}

export const staticData = {
  student: {
    departments: ["B.Tech", "B.Sc IT", "M.Tech", "MBA"],
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"]
  },
  faculty: {
    departments: ["Engineering", "Science", "Management", "Arts"]
  },
  forums: [
    {
      department: "B.Tech",
      year: "1st Year",
      issues: [
        { id: 1, name: "Issue 1", date: "2024-01-15", status: "Resolved" },
        { id: 2, name: "Issue 2", date: "2024-01-20", status: "Pending" }
      ]
    },
    {
      department: "B.Sc IT",
      year: "2nd Year",
      issues: [
        { id: 3, name: "Issue 3", date: "2024-02-10", status: "Pending" }
      ]
    }
  ]
}
