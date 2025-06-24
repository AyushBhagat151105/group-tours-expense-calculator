import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/SignUp')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/SignUp"!</div>
}
