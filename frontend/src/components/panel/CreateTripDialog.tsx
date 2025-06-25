import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { tripSchema } from "@/validation/zod"
import { useCreateTrip } from "@/query/Trips"

type TripForm = z.infer<typeof tripSchema>

export function CreateTripDialog() {
    const form = useForm<TripForm>({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            name: "",
            location: "",
            startDate: "",
            endDate: "",
            currency: "INR",
        },
    })

    const createTrip = useCreateTrip()

    const onSubmit = (values: TripForm) => {
        createTrip.mutate(values)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Create Tour</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create a New Tour</DialogTitle>
                    <DialogDescription>
                        Fill in the tour details below to get started.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <Label htmlFor="name">Trip Name</Label>
                        <Input id="name" {...form.register("name")} />
                        {form.formState.errors.name && (
                            <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" {...form.register("location")} />
                        {form.formState.errors.location && (
                            <p className="text-red-500 text-sm">{form.formState.errors.location.message}</p>
                        )}
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" {...form.register("startDate")} />
                        {form.formState.errors.startDate && (
                            <p className="text-red-500 text-sm">{form.formState.errors.startDate.message}</p>
                        )}
                    </div>

                    {/* End Date */}
                    <div className="space-y-1">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" {...form.register("endDate")} />
                        {form.formState.errors.endDate && (
                            <p className="text-red-500 text-sm">{form.formState.errors.endDate.message}</p>
                        )}
                    </div>

                    {/* Currency */}
                    <div className="space-y-1">
                        <Label htmlFor="currency">Currency</Label>
                        <Input id="currency" placeholder="e.g., INR, USD" {...form.register("currency")} />
                        {form.formState.errors.currency && (
                            <p className="text-red-500 text-sm">{form.formState.errors.currency.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={createTrip.isPending}>
                            {createTrip.isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
