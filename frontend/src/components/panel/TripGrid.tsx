import { useGetTrips } from "@/query/Trips"
import { TripCard } from "./TripCard"


export function TripGrid() {
    const { data: trips, isLoading, isError } = useGetTrips()

    if (isLoading) return <p className="text-center py-8">Loading trips...</p>
    if (isError) return <p className="text-center py-8 text-red-500">Failed to load trips.</p>

    if (!trips || trips.length === 0)
        return <p className="text-center py-8 text-muted-foreground">No trips found.</p>

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
            {trips.map((trip: any) => (
                <TripCard key={trip.id} trip={trip} />
            ))}
        </div>
    )
}