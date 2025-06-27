import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useCreateExpense } from "@/query/Trips";

export default function ExpenseForm({ tripId, members, setOpen }: any) {
    const { register, handleSubmit, setValue, watch, reset } = useForm();
    const { mutate: createExpense, isPending } = useCreateExpense();

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
            category: values.category,
            notes: values.notes,
            paidBy: values.paidBy,
            splits,
        });

        reset();
        setOpen(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label>Title</Label>
                <Input placeholder="e.g. Lunch" {...register("title", { required: true })} />
            </div>

            <div>
                <Label>Amount</Label>
                <Input type="number" step="0.01" {...register("amount", { required: true })} />
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
                <Select onValueChange={(value) => setValue("paidBy", value)} defaultValue={paidBy}>
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

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Creating..." : "Create Expense"}
            </Button>
        </form>
    );
}
