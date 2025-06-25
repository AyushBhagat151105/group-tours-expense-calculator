import { TripMembersManager } from '@/components/AddMemberDialog'
import { TripExpenseManager } from '@/components/TripExpenseManager'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trip/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Trip Details</h1>
      <TripMembersManager tripId={id} />
      <TripExpenseManager tripId={id} />
    </div>
  )
}
