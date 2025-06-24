import { Link, useRouterState } from '@tanstack/react-router'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
export function Navbar() {
    const router = useRouterState()

    const isActive = (path: string) => router.location.pathname === path

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Group<span className="text-gray-900">Tours</span>
                </Link>


                <div className="hidden md:flex items-center space-x-4">
                    <Link
                        to="/Login"
                        className={cn(
                            'text-sm font-medium px-3 py-2 rounded transition-colors',
                            isActive('/Login')
                                ? 'text-blue-600 bg-blue-100'
                                : 'text-gray-700 hover:text-blue-600'
                        )}
                    >
                        Login
                    </Link>
                    <Link
                        to="/SignUp"
                        className={cn(
                            'text-sm font-medium px-4 py-2 rounded-md transition-colors',
                            isActive('/SignUp')
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        )}
                    >
                        Sign Up
                    </Link>
                </div>


                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button
                                aria-label="Open menu"
                                className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <div className="mt-6 flex flex-col space-y-4">
                                <Link
                                    to="/Login"
                                    className={cn(
                                        'text-lg px-4 py-2 rounded transition-colors',
                                        isActive('/Login')
                                            ? 'text-blue-600 bg-blue-100'
                                            : 'text-gray-700 hover:text-blue-600'
                                    )}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/SignUp"
                                    className={cn(
                                        'text-lg px-4 py-2 rounded transition-colors text-center',
                                        isActive('/SignUp')
                                            ? 'bg-blue-700 text-white'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    )}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
