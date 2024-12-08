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
      { rolename: "assistant_professor" },
      { rolename: "student" },
      { rolename: "non_teaching_staff" },
      { rolename: "non_teaching_staff_admin" },
      { rolename: "principal" }
    ]
  })

  //create a super user
  await prisma.user.create({
    data: {
      id: "user_2pt3xWxXnLZhNLryELX1JgcK2IS",
      clerkId: "user_2pt3xWxXnLZhNLryELX1JgcK2IS",
      email: "kp648027@gmail.com",
      name: "kishan patel",
      phone: "8888888888",
      roles: {
        create: {
          roleId: 2
        }
      }
    }
  })
  // Create a university admin user
  const universityAdmin = await prisma.user.create({
    data: {
      phone: "9898989898",
      id: "user_2oo7c0B50nyD00rgejt5Q8e44cg",
      email: "ku578@karnavatiuniversity.edu.in",
      name: "University Admin",
      clerkId: "user_2oo7c0B50nyD00rgejt5Q8e44cg",
      roles: {
        create: {
          roleId: 1
        }
      }
    }
  })

  // Create a university
  await prisma.university.create({
    data: {
      name: "Karnavati University",
      location: "Ahmedabad, India",
      established: 2000,
      adminId: universityAdmin.id
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
