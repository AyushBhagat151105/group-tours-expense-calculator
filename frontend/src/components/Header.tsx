
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import LogoutButton from "./auth/LogoutButton"
import { useNavigate } from "@tanstack/react-router"
import { CreateTripDialog } from "./panel/CreateTripDialog"
import ThemeToggle from "./ThemeToggle"

export default function Header() {
  const { authUser, logOut } = useAuthStore()
  const navigate = useNavigate()

  if (!authUser) return null

  return (
    <header className="w-full border-b bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Avatar with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={authUser.avatar} alt={authUser.fullName} />
              <AvatarFallback>
                {authUser.fullName
                  .split(" ")
                  .map(n => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 mt-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{authUser.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
            </div>
            <DropdownMenuItem onClick={() => {
              logOut()
              navigate({ to: "/" })
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Buttons */}
        <div className="flex gap-3 items-center">
          <ThemeToggle />
          <CreateTripDialog />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}