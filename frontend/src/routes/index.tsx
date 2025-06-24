import { Hero } from '@/components/Landing/Hero'
import { Navbar } from '@/components/Landing/Navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <Hero />
    </div>
  )
}
