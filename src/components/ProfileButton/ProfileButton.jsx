import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../services/users.service";
import { clearAuthStorage } from "../../utils/auth-storage";

export default function ProfileButton() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleClick = async () => {
        try {
            let user = queryClient.getQueryData(["me"]);

            if (!user) {
                user = await queryClient.fetchQuery({
                    queryKey: ["me"],
                    queryFn: usersService.getMe,
                    retry: false,
                });
            }

            const role = user?.role;

            switch (role) {
                case "seller":
                    navigate("/seller");
                    break;
                case "admin":
                    navigate("/admin");
                    break;
                default:
                    navigate("/profile");
            }
        } catch (error) {
            if (error?.status === 401) {
                clearAuthStorage();
                navigate("/login");
                return;
            }

            navigate("/login");
        }
    };

    return (
        <button
            type="button"
            className="uiIconBtn"
            aria-label="Profile"
            onClick={handleClick}
        >
            <User size={20} />
        </button>
    );
}