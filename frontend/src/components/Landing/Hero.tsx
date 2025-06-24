import { Link } from '@tanstack/react-router'

export function Hero() {
    return (
        <section className="flex items-center justify-center min-h-screen text-center bg-gradient-to-r from-blue-100 via-white to-blue-50">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                    Plan Trips. Split Bills. Travel Stress-Free.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                    Your ultimate tool for managing group tour expenses with ease. Track spending, split costs fairly, and enjoy every journey together!
                </p>
                <Link
                    to="/SignUp"
                    className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition"
                >
                    Get Started
                </Link>
            </div>
        </section>
    )
}
