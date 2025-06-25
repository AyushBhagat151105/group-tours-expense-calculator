import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchLocationImage } from "@/lib/LocationImageService";

interface Trip {
    id: string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    currency: string;
}

interface TripCardProps {
    trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
    const [imgUrl, setImgUrl] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        async function loadImage() {
            const url = await fetchLocationImage(trip.location);
            setImgUrl(url);
        }
        loadImage();
    }, [trip.location]);

    const handleNavigate = () => navigate({ to: `/trip/${trip.id}` });

    return (
        <Card
            className="hover:shadow-lg cursor-pointer transition"
            onClick={handleNavigate}
        >
            <CardHeader className="p-0">
                <img
                    src={imgUrl || "/default-trip.jpeg"}
                    alt={trip.location}
                    className="h-40 w-full object-cover rounded-t-md"
                    loading="lazy"
                />
            </CardHeader>

            <CardContent className="p-4 space-y-1">
                <CardTitle className="text-lg font-semibold">{trip.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{trip.location}</p>
                <p className="text-xs text-muted-foreground">
                    {trip.startDate} → {trip.endDate}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    variant="outline"
                    className="w-full text-xs"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate();
                    }}
                >
                    View Trip
                </Button>
            </CardFooter>
        </Card>
    );
}
