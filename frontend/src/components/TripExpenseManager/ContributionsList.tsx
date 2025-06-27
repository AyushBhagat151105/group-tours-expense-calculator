export default function ContributionsList({ contributions, members, currency }: any) {
    if (!contributions?.length) return null;

    return (
        <div className="grid gap-3">
            {contributions.map((contribution: any, index: number) => {
                const member = members.find((m: any) => m.id === contribution.paidById);
                const amount = parseFloat(String(contribution._sum?.amount ?? 0)) || 0;

                return (
                    <div
                        key={contribution.paidById || index}
                        className="flex items-center gap-4 bg-muted/30 rounded-md p-3"
                    >
                        <img
                            src={member?.avatar}
                            alt={member?.fullName}
                            className="h-10 w-10 rounded-full border"
                        />
                        <div className="flex-1">
                            <div className="font-medium">{member?.fullName || "Unknown"}</div>
                            <div className="text-sm text-muted-foreground">{member?.email}</div>
                        </div>
                        <div className="font-semibold text-green-700">
                            {currency} {amount}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
