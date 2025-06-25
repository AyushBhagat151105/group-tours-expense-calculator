import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trip/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <div>{`Hello "/trip/${id}/"!`}</div>
}
