import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/panal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/panal"!</div>
}
