import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "@tanstack/react-router";


function LogoutButton() {
    const logout = useAuthStore((state) => state.logOut);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate({ to: "/" });
    };

    return (
        <Button onClick={handleLogout} variant="destructive">
            Logout
        </Button>
    );
}

export default LogoutButton;