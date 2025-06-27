import { useState } from "react";
import {
    PieChart,
    Pie,
    Sector,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Card, CardContent } from "@/components/ui/card";

type Contribution = {
    _sum: { amount: number };
    paidById: string;
};

type Member = {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
};

type Props = {
    contributions: Contribution[];
    members: Member[];
    currency: string;
};

type ChartItem = {
    name: string;
    value: number;
    fill: string;
    avatar?: string;
    email?: string;
};

const COLORS = [
    "#34D399", // green
    "#60A5FA", // blue
    "#FBBF24", // yellow
    "#F87171", // red
    "#A78BFA", // purple
    "#F472B6", // pink
];

export default function ContributionsList({ contributions, members, currency }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);

    console.log(activeIndex);


    if (!contributions?.length) return null;

    const chartData: ChartItem[] = contributions.map((contribution, index) => {
        const member = members.find((m) => m.id === contribution.paidById);
        const amount = parseFloat(String(contribution._sum?.amount ?? 0)) || 0;

        return {
            name: member?.fullName || "Unknown",
            value: amount,
            fill: COLORS[index % COLORS.length],
            avatar: member?.avatar,
            email: member?.email,
        };
    });

    return (
        <Card className="flex flex-col w-full max-w-4xl">
            <CardContent className="pb-4">
                {/* Flex container for side-by-side layout */}
                <div className="flex flex-wrap md:flex-nowrap gap-6">
                    <ResponsiveContainer width={250} height={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                strokeWidth={5}
                                onMouseEnter={(_, index) => setActiveIndex(index)}
                                activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                                    <Sector {...props} outerRadius={outerRadius + 10} />
                                )}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const item = payload[0].payload as ChartItem;
                                        return (
                                            <div className="bg-white dark:bg-zinc-900 p-3 rounded shadow border border-gray-300 dark:border-gray-700">
                                                <div className="font-semibold">{item.name}</div>
                                                {item.email && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {item.email}
                                                    </div>
                                                )}
                                                <div className="mt-1 text-green-700 dark:text-green-400 font-medium">
                                                    {currency} {item.value}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Contributions List Section */}
                    <div className="flex-1 grid gap-3">
                        {chartData.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 bg-muted/30 rounded-md p-3"
                            >
                                <img
                                    src={item.avatar}
                                    alt={item.name}
                                    className="h-10 w-10 rounded-full border object-cover"
                                />
                                <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.email}
                                    </div>
                                </div>
                                <div className="font-semibold text-green-700 dark:text-green-400">
                                    {currency} {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
