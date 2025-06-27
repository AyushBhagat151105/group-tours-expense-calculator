export default function ExpenseSummary({ summary, currency, members }: any) {
    if (!summary || !summary._sum) return null;

    const paidBy = members.find((m: any) => m.id === summary.paidById);
    const amount = summary._sum.amount ?? 0;

    return (
        <div className="rounded-xl border bg-muted/20 p-4 shadow-sm text-sm space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Total Spent</span>
                <span className="text-foreground font-semibold">
                    {currency} {amount}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Top Contributor</span>
                <span className="text-foreground font-semibold">
                    {paidBy?.fullName || summary.paidById || "Unknown"}
                </span>
            </div>
        </div>
    );
}
