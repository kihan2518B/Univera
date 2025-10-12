import {
  FaUsers,
  FaRegCalendarAlt,
  FaBullhorn,
  FaBook,
  FaBuilding,
  FaUserTie
} from "react-icons/fa"
import {
  MdSpaceDashboard,
  MdClass,
  MdOutlineHealthAndSafety,
  MdPerson,
  MdPeople,
  MdEditDocument,
  MdForum,
  MdPolicy
} from "react-icons/md"

export const Menuitems = {
  university_admin: [
    { title: "Dashboard", url: "/admin", icon: MdSpaceDashboard },
    { title: "Departments", url: "/departments", icon: FaBuilding },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn },
    { title: "Policy", url: "/policy", icon: MdPolicy }
  ],
  university_admin_staff: [
    { title: "Doctors", url: "/admin/doctors", icon: MdOutlineHealthAndSafety },
    { title: "Patients", url: "/admin/patients", icon: MdPerson },
    { title: "Policy", url: "/policy", icon: MdPolicy }
  ],
  department_admin: [
    { title: "Dashboard", url: "/department_admin", icon: MdSpaceDashboard },
    { title: "Courses", url: "/courses", icon: MdEditDocument },
    { title: "Subjects", url: "/subject", icon: MdClass },
    { title: "Authorities", url: "/list/authorities", icon: FaUserTie },
    { title: "Faculty", url: "/list/teachers", icon: MdPeople },
    // { title: "Leave", url: "/leave", icon: MdOutlineHolidayVillage },
    { title: "Students", url: "/list/students", icon: MdPeople },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn },
    { title: "Policy", url: "/policy", icon: MdPolicy }
  ],
  authority: [
    { title: "Dashboard", url: "/dashboard", icon: MdSpaceDashboard },
    { title: "Students", url: "/list/students", icon: FaUsers },
    { title: "Classes", url: "/classes", icon: FaBook },
    { title: "Courses", url: "/courses", icon: MdEditDocument },
    { title: "Subjects", url: "/subject", icon: MdClass },
    // { title: "Leave", url: "/leave", icon: MdOutlineHolidayVillage },
    { title: "Events", url: "/events", icon: FaRegCalendarAlt },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn },
    { title: "Forums", url: "/forum", icon: MdForum },
    { title: "Policy", url: "/policy", icon: MdPolicy }
  ],
  faculty: [
    { title: "Dashboard", url: "/dashboard", icon: MdSpaceDashboard },
    { title: "Students", url: "/list/students", icon: FaUsers },
    { title: "Classes", url: "/classes", icon: FaBook },
    { title: "Subjects", url: "/subject", icon: MdClass },
    // { title: "Leave", url: "/leave", icon: MdOutlineHolidayVillage },
    { title: "Events", url: "/events", icon: FaRegCalendarAlt },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn },
    { title: "Forums", url: "/forum", icon: MdForum },
    { title: "Policy", url: "/policy", icon: MdPolicy }
  ],
  student: [
    { title: "Dashboard", url: "/dashboard", icon: MdSpaceDashboard },
    { title: "Curriculum", url: "/curriculum", icon: FaBook },
    { title: "Subjects", url: "/subjects", icon: MdClass },
    { title: "Events", url: "/events", icon: FaRegCalendarAlt },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn },
    { title: "Forums", url: "/forum", icon: MdForum },
    { title: "Policy", url: "/policy", icon: MdPolicy }
  ]
}

import { IconType } from "react-icons"
// import { title } from "process"

export interface LinkItem {
  title: string
  url: string
  icon: IconType
}

export interface MenuItems {
  [role: string]: LinkItem[]
}
