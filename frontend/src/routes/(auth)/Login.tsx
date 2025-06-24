import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/Login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/Login"!</div>
}
