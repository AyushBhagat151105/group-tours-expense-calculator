export default function ExpenseList({ expenses, members, tripId, currency }: any) {
    if (!expenses.length) return <p className="text-sm text-muted-foreground">No expenses yet.</p>;

    return (
        <div className="grid gap-4">
            {expenses
                .filter((e: any) => e.tripId === tripId)
                .map((expense: any) => {
                    const paidBy = members.find((m: any) => m.id === expense.paidById);
                    return (
                        <div
                            key={expense.id}
                            className="border p-4 rounded-md bg-background shadow-sm space-y-1"
                        >
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-base">{expense.title}</div>
                                <div className="text-sm font-medium text-green-600">
                                    {currency} {expense.amount}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Paid by {paidBy?.fullName || "Unknown"} on{" "}
                                {new Date(expense.createdAt).toLocaleDateString()}
                            </div>
                            {expense.notes && (
                                <div className="text-xs italic text-muted-foreground">“{expense.notes}”</div>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}
