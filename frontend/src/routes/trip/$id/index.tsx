import { TripMembersManager } from "@/components/AddMemberDialog";
import { TripExpenseManager } from "@/components/TripExpenseManager/TripExpenseManager";
import { useAuthStore } from "@/store/useAuthStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trip/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { authUser } = useAuthStore()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Trip Dashboard</h1>
        <p className="text-muted-foreground">Manage members and track shared expenses.</p>
      </div>

      <section className="bg-muted/30 rounded-xl p-4 shadow-sm border">
        <TripMembersManager tripId={id} currentUserId={authUser?.id as string} />
      </section>

      <section className="bg-muted/30 rounded-xl p-4 shadow-sm border">
        <TripExpenseManager tripId={id} />
      </section>
    </div>
  );
}
