import { Frown } from "lucide-react"
import Container from "./Container"
import LeaveCard from "./LeaveCard"
import { Balances } from "@prisma/client"

type Props = {
  balances: Balances[]
  isError: boolean
}

const UserBalances = ({ balances, isError }: Props) => {
  if (!balances) {
    return null
  }
  if (isError) {
    return (
      <Container>
        <div className="my-10 text-center text-red-500">
          <p>Something went wrong while fetching balances.</p>
        </div>
      </Container>
    )
  }
  console.log("balances", balances)

  return (
    <Container>
      {balances.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 my-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <LeaveCard
            year={balances[0]?.year}
            leaveType={"ANNUAL"}
            credit={balances[0]?.annualCredit ?? (0 as number)}
            used={balances[0]?.annualUsed ?? (0 as number)}
            balance={balances[0]?.annualAvailable ?? (0 as number)}
          />
          <LeaveCard
            year={balances[0]?.year}
            leaveType={"CASUAL"}
            credit={balances[0]?.casualCredit ?? (0 as number)}
            used={balances[0]?.casualUsed ?? (0 as number)}
            balance={balances[0]?.casualAvailable ?? (0 as number)}
          />
          <LeaveCard
            year={balances[0]?.year}
            leaveType={"HEALTH"}
            credit={balances[0]?.healthCredit ?? (0 as number)}
            used={balances[0]?.healthUsed ?? (0 as number)}
            balance={balances[0]?.healthAvailable ?? (0 as number)}
          />
          <LeaveCard
            year={balances[0]?.year}
            leaveType={"SPECIAL"}
            credit={balances[0]?.specialCredit ?? (0 as number)}
            used={balances[0]?.specialUsed ?? (0 as number)}
            balance={balances[0]?.specialAvailable ?? (0 as number)}
          />
          <LeaveCard
            year={balances[0]?.year}
            leaveType={"PATERNITY"}
            credit={balances[0]?.paternityCredit ?? (0 as number)}
            used={balances[0]?.paternityUsed ?? (0 as number)}
            balance={balances[0]?.paternityAvailable ?? (0 as number)}
          />
          <LeaveCard
            year={balances[0]?.year}
            leaveType={"MATERNITY"}
            credit={balances[0]?.maternityCredit ?? (0 as number)}
            used={balances[0]?.maternityUsed ?? (0 as number)}
            balance={balances[0]?.maternityAvailable ?? (0 as number)}
          />
          <LeaveCard
            year={balances[0]?.year}
            leaveType={"UNPAID"}
            credit={balances[0].unpaidCredit as number}
            balance={balances[0].unpaidUsed as number}
            used={balances[0]?.unpaidUsed ?? (0 as number)}
          />
        </section>
      ) : (
        <h1 className="lg:text-2xl md:text-xl font-bold text-red-500 flex items-center justify-center my-10">
          No Balance Data Found
          <Frown />
        </h1>
      )}
    </Container>
  )
}

export default UserBalances
