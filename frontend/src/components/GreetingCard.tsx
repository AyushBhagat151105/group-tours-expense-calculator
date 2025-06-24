import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";


export function GreetingCard() {
    const { authUser, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) {
        return (
            <Card className="max-w-sm w-full mx-auto p-6 shadow-xl rounded-2xl bg-muted/40">
                <CardHeader>
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-2/3 mx-auto" />
                </CardHeader>
                <CardContent className="text-center">
                    <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardContent>
            </Card>
        );
    }

    if (!authUser) return null;

    return (
        <Card className="max-w-sm w-full mx-auto p-6 shadow-2xl rounded-3xl bg-gradient-to-tr from-blue-500 via-purple-600 to-indigo-500 text-white animate-fade-in">
            <CardHeader className="flex flex-col items-center gap-3">
                <img
                    src={authUser.avatar ?? "https://api.dicebear.com/7.x/thumbs/svg?seed=person"}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                />
                <CardTitle className="text-2xl font-semibold">
                    Welcome, {authUser.fullName.split(" ")[0]}!
                </CardTitle>
                <Badge
                    variant="secondary"
                    className="text-xs bg-white/20 text-white border-white/10"
                >
                    {authUser.email}
                </Badge>
            </CardHeader>

            <CardContent className="text-center mt-2 space-y-3">
                <p className="text-sm font-medium">
                    We’re thrilled to have you here! 🎉
                </p>
                <p className="text-xs text-white/80">
                    Your account is {authUser.isVerified ? "verified ✅" : "not verified ❌"}
                </p>
                <div className="flex justify-center">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
            </CardContent>
        </Card>
    );
}