import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    useExpenseSummary,
    useUserContribution,
    useGetTripById,
    useGetExpenses,
} from "@/query/Trips";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExpenseSummary from "./ExpenseSummary";
import ContributionsList from "./ContributionsList";
import { ScrollArea } from "@/components/ui/scroll-area"

export function TripExpenseManager({ tripId }: { tripId: string }) {
    const [open, setOpen] = useState(false);

    const { data: expenses = [] } = useGetExpenses(tripId);
    const { data: summary } = useExpenseSummary(tripId);
    const { data: contributions } = useUserContribution(tripId);
    const { data: trip } = useGetTripById(tripId);

    const members = trip?.members || [];
    const currency = trip?.currency || "₹";

    return (
        <div className="space-y-10">
            {/* Trip Info */}
            <div className="p-4 bg-muted rounded-xl shadow-sm border">
                <h2 className="text-lg font-bold mb-2">Trip Overview</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                        <span className="font-medium text-foreground">Name:</span> {trip?.name}
                    </div>
                    <div>
                        <span className="font-medium text-foreground">Location:</span> {trip?.location}
                    </div>
                    <div>
                        <span className="font-medium text-foreground">Dates:</span>{" "}
                        {new Date(trip?.startDate).toLocaleDateString()} -{" "}
                        {new Date(trip?.endDate).toLocaleDateString()}
                    </div>
                    <div>
                        <span className="font-medium text-foreground">Currency:</span> {currency}
                    </div>
                </div>
            </div>

            {/* Expense Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Shared Expenses</h2>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default">+ Add Expense</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Expense</DialogTitle>
                            </DialogHeader>
                            <ExpenseForm tripId={tripId} members={members} setOpen={setOpen} />
                        </DialogContent>
                    </Dialog>
                </div>

                <ScrollArea className="h-[250px]">
                    <ExpenseList
                        expenses={expenses}
                        members={members}
                        currency={currency}
                        tripId={tripId}
                    />
                </ScrollArea>

            </div>

            {/* Summary */}
            <div>
                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Total Summary</h3>
                <ExpenseSummary summary={summary} currency={currency} members={members} />
            </div>

            {/* Contributions */}
            <div>
                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">User Contributions</h3>
                <ContributionsList contributions={contributions} members={members} currency={currency} />
            </div>
        </div>
    );
}
