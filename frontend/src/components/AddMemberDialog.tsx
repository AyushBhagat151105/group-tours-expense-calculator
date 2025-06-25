import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { UserPlus, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDebounce } from "use-debounce";
import { useAddMember, useGetAllUsers, useGetTripById, useRemoveMember } from "@/query/Trips";

interface User {
    id: string;
    fullName: string;
    email: string;
    avatar?: string | null;
}

export const TripMembersManager = ({ tripId }: { tripId: string }) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 300);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);

    const { data: users, isLoading } = useGetAllUsers(debouncedSearch);
    const { data: trip } = useGetTripById(tripId);
    const addMemberMutation = useAddMember();
    const removeMemberMutation = useRemoveMember();

    const handleAddMember = () => {
        if (!selectedUser) return toast.error("Please select a user to add.");

        addMemberMutation.mutate(
            {
                id: tripId,
                userId: selectedUser.id,
            },
            {
                onSuccess: () => {
                    toast.success("Member added successfully!");
                    setSearch("");
                    setSelectedUser(null);
                    setOpen(false);
                },
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Failed to add member.";
                    toast.error(message);
                },
            }
        );
    };

    const handleRemoveMember = (memberId: string) => {
        if (memberId === trip?.createdBy) {
            toast.error("Trip creator cannot be removed");
            return;
        }

        if (!confirm("Remove this member from the trip?")) return;

        removeMemberMutation.mutate({
            tripId: tripId,
            userId: memberId
        });
    };

    useEffect(() => {
        if (open) {
            setSearch("");
            setSelectedUser(null);
        }
    }, [open]);

    return (
        <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Trip Members</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a Member</DialogTitle>
                        </DialogHeader>
                        <Input
                            type="text"
                            placeholder="Search by email or name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <ScrollArea className="h-48 border rounded-md mt-2">
                            {isLoading ? (
                                <div className="p-4 text-sm text-gray-500">Loading users...</div>
                            ) : users?.length > 0 ? (
                                users.map((user: User) => (
                                    <div
                                        key={user.id}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setSearch(user.email);
                                        }}
                                        className={`p-2 px-4 cursor-pointer flex items-center gap-2 text-sm hover:bg-muted ${selectedUser?.id === user.id
                                            ? "bg-muted font-medium"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={user.avatar || ""} alt={user.fullName} />
                                            <AvatarFallback>
                                                {user.fullName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{user.fullName} — {user.email}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-sm text-gray-500">No users found</div>
                            )}
                        </ScrollArea>
                        <Button
                            onClick={handleAddMember}
                            disabled={addMemberMutation.isPending}
                            className="w-full mt-2"
                        >
                            {addMemberMutation.isPending ? "Adding..." : "Add Member"}
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            <ScrollArea className="max-h-64 border rounded-md p-2">
                {trip?.members?.length ? (
                    trip.members.map((member: User) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-accent"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={member.avatar || ""} />
                                    <AvatarFallback>
                                        {member.fullName
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {member.fullName}
                                        {member.id === trip?.createdBy && (
                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                Creator
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-muted-foreground">{member.email}</div>
                                </div>
                            </div>
                            {/* Only show remove button if not the creator */}
                            {member.id !== trip?.createdBy && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-destructive hover:text-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-sm text-gray-500">No members yet.</div>
                )}
            </ScrollArea>
        </div>
    );
};
