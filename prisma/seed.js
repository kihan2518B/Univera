const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  // Define roles
  const roles = await prisma.role.createMany({
    data: [
      { rolename: "university_admin" },
      { rolename: "super_user" },
      { rolename: "department_admin" },
      { rolename: "faculty" },
      { rolename: "coordinator" },
      { rolename: "lab_assitant" },
      { rolename: "student" },
      { rolename: "non_teaching_staff" },
      { rolename: "non_teaching_staff_admin" },
      { rolename: "principal" },
      { rolename: "head_of_department" },
      { rolename: "dean" },
      { rolename: "mentor" }
    ]
  })

  // Create a university admin user
  const universityAdmin = await prisma.user.create({
    data: {
      phone: "9898989898",
      id: "user_2qqzgMCkR992I5nTTHPywz73Q8N",
      email: "ku578@ku.edu.in",
      name: "University Admin",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      clerkId: "user_2qqzgMCkR992I5nTTHPywz73Q8N",
      roles: {
        connect: {
          id: 1
        }
      }
    }
  })

  // Create a university
  const university = await prisma.university.create({
    data: {
      name: "Karnavati University",
      location: "Ahmedabad, India",
      established: 2000,
      users: {
        connect: { id: universityAdmin.id }
      },
      adminId: universityAdmin.id
    }
  })

  //create a super user
  await prisma.user.create({
    data: {
      id: "user_2pt3xWxXnLZhNLryELX1JgcK2IS",
      clerkId: "user_2pt3xWxXnLZhNLryELX1JgcK2IS",
      email: "kp648027@gmail.com",
      name: "kishan patel",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      phone: "8888888888",
      universityId: 1,
      roles: {
        connect: {
          id: 2
        }
      }
    }
  })

  //create department
  const department = await prisma.department.create({
    data: {
      id: 1,
      name: "United Institute Of Technology",
      code: "KU113",
      universityId: 1,
    }
  })

  //create department admin
  const dAdmin = await prisma.user.create({
    data: {
      phone: "9898989898",
      id: "user_2qXaLB1laV2FKevYXvv5PrOvYaU",
      email: "uit_admin@ku.edu.in",
      name: "UIT Admin",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      departmentId: 1,
      universityId: 1,
      departmentAdmin: {
        connect: { id: department.id }
      },
      clerkId: "user_2qXaLB1laV2FKevYXvv5PrOvYaU",
      roles: {
        connect: {
          id: 3
        }
      }
    }
  })

  const dummyPrincipalUser = await prisma.user.create({
    // Principal
    data: {
      id: "user_2qrHhQZhnV8h24O5Yw52yYm3dws",
      clerkId: "user_2qrHhQZhnV8h24O5Yw52yYm3dws",
      name: "Nilax Modi",
      email: "principal_uit@ku.edu.in",
      phone: "7894567898",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      departmentId: 1,
      universityId: 1,
      roles: {
        connect: {
          id: 10
        }
      },
      departmentPrincipal: {
        connect: { id: department.id }
      }
    }
  })

  const dummyDeanUser = await prisma.user.create({
    // Dean
    data: {
      id: "user_2s5G78wQLYfecd1bGzzscisyCQv",
      clerkId: "user_2s5G78wQLYfecd1bGzzscisyCQv",
      name: "Mohak shah",
      email: "dean_uit@ku.edu.in",
      phone: "7894567898",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      departmentId: 1,
      universityId: 1,
      roles: {
        connect: [12, 4].map((id) => ({ id }))
      },
      departmentDean: {
        connect: { id: department.id }
      }
    }
  })


  const course1 = await prisma.course.create({
    data: {
      id: 1,
      code: "CS101",
      name: "Btech Computer Science",
      universityId: 1,
      totalSemister: 8,
      departmentId: 1
    }
  })

  const course2 = await prisma.course.create({
    data: {
      id: 2,
      code: "EC101",
      name: "Btech Electronics Communication",
      universityId: 1,
      totalSemister: 8,
      departmentId: 1
    }
  })

  const dummyCoordinatorUser = await prisma.user.create({
    // Coordinator
    data: {
      id: "user_2qcq0dsXmDJf2muj5MjxJ8un7N8",
      clerkId: "user_2qcq0dsXmDJf2muj5MjxJ8un7N8",
      name: "Raj Patel",
      email: "coordinator_uit@ku.edu.in",
      phone: "7894567898",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      departmentId: 1,
      courseId: 1,
      universityId: 1,
      roles: {
        connect: [5, 4].map((id) => ({ id }))
      }
    }
  })

  //create faculty user
  const dummyFacultyUser1 = await prisma.user.create({
    data: {
      id: "user_2qcqFPWKzXDe3Ar5mMwLj9acj6O",
      clerkId: "user_2qcqFPWKzXDe3Ar5mMwLj9acj6O",
      name: "Kishan Patel",
      email: "kishanpatel@ku.edu.in",
      phone: "7894567898",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      departmentId: 1,
      courseId: 1,
      universityId: 1,
      roles: {
        connect: { id: 4 }
      }
    }
  })
  const dummyFacultyUser2 = await prisma.user.create({
    data: {
      id: "user_2qcqJyj0xvsPWSWdqt7csG7Ysdb",
      clerkId: "user_2qcqJyj0xvsPWSWdqt7csG7Ysdb",
      name: "Uday Panchal",
      email: "udaypanchal@ku.edu.in",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      departmentId: 1,
      courseId: 1,
      universityId: 1,
      phone: "7894567898",
      roles: {
        connect: { id: 4 }
      }
    }
  })

  const dummyHodUser = await prisma.user.create({
    // HOD
    data: {
      id: "user_2qcqOVn3ZSTCeUmQVWwIH0o6VTn",
      clerkId: "user_2qcqOVn3ZSTCeUmQVWwIH0o6VTn",
      name: "Swetang Pandit",
      email: "swetang_ce@ku.edu.in",
      phone: "7894567898",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJyNUNMSThCTVoydVRwQVBKWE52eFdGWmc0eSJ9",
      departmentId: 1,
      courseId: 1,
      hodCourse: {
        connect: { id: course1.id }
      },
      universityId: 1,
      roles: {
        connect: [11, 4].map((id) => ({ id }))
      }
    }
  })

  // Create a student user
  const studentUser1 = await prisma.user.create({
    data: {
      phone: "9898989898",
      id: "user_2qcpGWy1HfRZAtNQrQqI2Ypj1fS",
      email: "dev-student1@ku.edu.in",
      name: "student 1",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      departmentId: department.id,
      courseId: course1.id,
      universityId: university.id,
      clerkId: "user_2qcpGWy1HfRZAtNQrQqI2Ypj1fS",
      roles: {
        connect: {
          id: 7
        }
      }
    }
  })
  const studentUser2 = await prisma.user.create({
    data: {
      phone: "9898989898",
      id: "user_2qcpKoQwKdThSkf4UJNGVuNJGO2",
      email: "dev-student2@ku.edu.in",
      name: "student 2",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      clerkId: "user_2qcpKoQwKdThSkf4UJNGVuNJGO2",
      departmentId: department.id,
      courseId: course1.id,
      universityId: university.id,
      roles: {
        connect: {
          id: 7
        }
      }
    }
  })
  const studentUser3 = await prisma.user.create({
    data: {
      phone: "9898989898",
      id: "user_2qcpQH8urvrc576oy83BL99BVqI",
      email: "dev-student3@ku.edu.in",
      name: "student 3",
      imageUrl: "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yb21XZWFLSWtueG5RZFFSSWlsaDBZa2JlUEMiLCJyaWQiOiJ1c2VyXzJxdHpNR25LQTJPcTNQS0hQdzM3YXdiMHB5dSIsImluaXRpYWxzIjoiViJ9",
      clerkId: "user_2qcpQH8urvrc576oy83BL99BVqI",
      departmentId: department.id,
      courseId: course1.id,
      universityId: university.id,
      roles: {
        connect: {
          id: 7
        }
      }
    }
  })

  const subject1 = await prisma.subject.create({
    data: {
      id: 1,
      name: "Engineering Mathematics 1",
      code: "2ET100301T",
      credits: 3,
      semester: 1,
      courseId: course1.id,
      departmentId: department.id,
      universityId: 1,
      departmentId: 1,
      forumTags: []
    }
  })

  const subject2 = await prisma.subject.create({
    data: {
      id: 2,
      name: "Engineering Physics 1",
      code: "2ET100301T",
      credits: 3,
      departmentId: department.id,
      semester: 1,
      courseId: course1.id,
      universityId: 1,
      departmentId: 1,
      forumTags: []
    }
  })

  const subject3 = await prisma.subject.create({
    data: {
      id: 3,
      name: "C language",
      code: "2ET100301T",
      credits: 3,
      departmentId: department.id,
      semester: 1,
      courseId: course1.id,
      universityId: 1,
      forumTags: []
    }
  })
  const subject4 = await prisma.subject.create({
    data: {
      id: 4,
      name: "Python Programing",
      code: "2ET105401T",
      credits: 3,
      departmentId: department.id,
      semester: 1,
      courseId: course1.id,
      universityId: 1,
      forumTags: []
    }
  })

  const dummyFaculty1 = await prisma.faculty.create({
    data: {
      id: dummyFacultyUser1.id,
      clerkId: dummyFacultyUser1.id,
      departmentId: 1,
      courseId: 1,
      universityId: 1,
      subject: {
        connect: [subject1.id, subject2.id].map((id) => ({ id }))
      }
    }
  })

  const dummyFaculty2 = await prisma.faculty.create({
    data: {
      id: dummyFacultyUser2.id,
      clerkId: dummyFacultyUser2.id,
      departmentId: 1,
      courseId: 1,
      universityId: 1,
      subject: {
        connect: [subject1.id, subject3.id].map((id) => ({ id }))
      }
    }
  })
  const dumytHodFaculty = await prisma.faculty.create({
    data: {
      id: dummyHodUser.id,
      clerkId: dummyHodUser.id,
      departmentId: 1,
      courseId: 1,
      universityId: 1,
      subject: {
        connect: [subject2.id, subject3.id].map((id) => ({ id }))
      }
    }
  })

  const dummytDeanFaculty = await prisma.faculty.create({
    data: {
      id: dummyDeanUser.id,
      clerkId: dummyDeanUser.id,
      departmentId: 1,
      courseId: 1,
      universityId: 1,
      subject: {
        connect: [subject4.id, subject3.id].map((id) => ({ id }))
      }
    }
  })

  const dummyCoordinatorFaculty = await prisma.faculty.create({
    data: {
      id: dummyCoordinatorUser.id,
      clerkId: dummyCoordinatorUser.id,
      departmentId: 1,
      courseId: 1,
      universityId: 1,
      subject: {
        connect: [subject4.id, subject1.id].map((id) => ({ id }))
      }
    }
  })

  const dummyStudent1 = await prisma.student.create({
    data: {
      id: studentUser1.id,
      clerkId: studentUser1.id,
      prn: "1234567890",
      year: 1,
      semester: 1,
      guardianEmail: "gardianstudent1@gmail.com",
      gaurdianPhone: "7894567898",
      rollNo: 1,
      documents: [],
      departmentId: 1,
      courseId: course1.id,
      universityId: 1
    }
  })
  const dummyStudent2 = await prisma.student.create({
    data: {
      id: studentUser2.id,
      clerkId: studentUser2.id,
      prn: "1234567890",
      year: 1,
      semester: 1,
      guardianEmail: "gardianstudent1@gmail.com",
      gaurdianPhone: "7894567898",
      rollNo: 2,
      documents: [],
      departmentId: 1,
      courseId: course1.id,
      universityId: 1
    }
  })
  const dummyStudent3 = await prisma.student.create({
    data: {
      id: studentUser3.id,
      clerkId: studentUser3.id,
      prn: "1234567890",
      year: 1,
      semester: 1,
      guardianEmail: "gardianstudent1@gmail.com",
      gaurdianPhone: "7894567898",
      rollNo: 3,
      documents: [],
      departmentId: 1,
      courseId: course1.id,
      universityId: 1
    }
  })
  const class1 = await prisma.class.create({
    data: {
      id: 1,
      name: "Class 1",
      code: "2ET100301T",
      semister: 1,
      departmentId: 1,
      universityId: 1,
      coordinatorId: dummyCoordinatorUser.clerkId,
      mentorId: dummyFaculty1.clerkId,
      courseId: course1.id,
      universityId: 1
    }
  })
  const class2 = await prisma.class.create({
    data: {
      id: 2,
      name: "Class 2",
      code: "2ET100302T",
      semister: 1,
      departmentId: 1,
      universityId: 1,
      coordinatorId: dummyCoordinatorUser.clerkId,
      mentorId: dummyFaculty2.clerkId,
      courseId: course1.id,
      universityId: 1
    }
  })
}

main()
  .then(async () => {
    console.log("data seeded succesfully")

    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

