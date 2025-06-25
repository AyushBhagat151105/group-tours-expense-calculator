import { TripMembersManager } from '@/components/AddMemberDialog'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trip/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Trip Details</h1>
      <TripMembersManager tripId={id} />
    </div>
  )
}
