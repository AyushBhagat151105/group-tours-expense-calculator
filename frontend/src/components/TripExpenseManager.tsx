import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useCreateExpense,
    useExpenseSummary,
    useUserContribution,
    useGetTripById,
    useGetExpenses,
} from "@/query/Trips";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function TripExpenseManager({ tripId }: { tripId: string }) {
    const { data: expenses = [] } = useGetExpenses(tripId);
    const { data: summary } = useExpenseSummary(tripId);
    const { data: contributions } = useUserContribution(tripId);
    const { data: trip } = useGetTripById(tripId);

    const members = trip?.members || [];

    const [open, setOpen] = useState(false);
    const { mutate: createExpense, isPending: isLoading } = useCreateExpense();

    const { register, handleSubmit, setValue, watch, reset } = useForm();

    const paidBy = watch("paidBy") || "";
    const splitBetween: string[] = watch("splitBetween") || [];

    const onSubmit = (values: any) => {
        const amount = parseFloat(values.amount);
        const selectedUserIds: string[] = values.splitBetween;
        const splitAmount = parseFloat((amount / selectedUserIds.length).toFixed(2));

        const splits = selectedUserIds.map((userId) => ({
            userId,
            amount: splitAmount,
        }));

        createExpense({
            tripId,
            title: values.title,
            amount,
            category: "",
            notes: "",
            splits,
        });

        reset();
        setOpen(false);
    };


    return (
        <div className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Expenses</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Expense</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Expense</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Input placeholder="e.g. Lunch" {...register("title", { required: true })} />
                            </div>

                            <div>
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register("amount", { required: true })}
                                />
                            </div>

                            <div>
                                <Label>Category</Label>
                                <Input placeholder="e.g. Food, Transport" {...register("category")} />
                            </div>

                            <div>
                                <Label>Notes</Label>
                                <Input placeholder="Additional info (optional)" {...register("notes")} />
                            </div>

                            <div>
                                <Label>Paid By</Label>
                                <Select
                                    onValueChange={(value) => setValue("paidBy", value)}
                                    defaultValue={paidBy}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((member: any) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.fullName} ({member.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Split Between</Label>
                                <div className="flex flex-wrap gap-2">
                                    {members.map((member: any) => {
                                        const isSelected = splitBetween.includes(member.id);
                                        return (
                                            <Button
                                                key={member.id}
                                                type="button"
                                                variant={isSelected ? "default" : "outline"}
                                                onClick={() => {
                                                    const updated = isSelected
                                                        ? splitBetween.filter((id) => id !== member.id)
                                                        : [...splitBetween, member.id];
                                                    setValue("splitBetween", updated);
                                                }}
                                            >
                                                {member.fullName}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? "Creating..." : "Create Expense"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {expenses
                    .filter((e: any) => e.tripId === tripId)
                    .map((expense: any) => (
                        <div key={expense.id} className="border p-4 rounded-md shadow-sm">
                            <div className="font-medium">{expense.title}</div>
                            <div className="text-sm text-muted-foreground">
                                ₹{expense.amount} paid by{" "}
                                {members.find((m: any) => m.id === expense.paidBy)?.fullName || expense.paidBy}
                            </div>
                        </div>
                    ))}
            </div>

            {summary && (
                <div className="mt-6">
                    <h3 className="text-md font-semibold mb-2">Expense Summary</h3>
                    <div className="bg-muted p-3 rounded">
                        <p>
                            Total Amount: ₹
                            {summary?._sum?.amount || 0}
                        </p>
                        <p>
                            Paid by User ID:
                            {summary.paidById}
                        </p>
                    </div>
                </div>
            )}


            {!!contributions && (
                <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">User Contributions</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        {contributions.map((contribution: any, index: number) => (
                            <li key={contribution.paidById || index}>
                                {members.find((m: any) => m.id === contribution.paidById)?.fullName || contribution.paidById}: ₹
                                {parseFloat(String(contribution._sum?.amount ?? 0)) || 0}
                            </li>
                        ))}
                    </ul>
                </div>
            )}


        </div>
    );
}
