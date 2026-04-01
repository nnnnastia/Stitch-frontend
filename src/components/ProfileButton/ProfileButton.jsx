import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function ProfileButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            navigate("/login");
            return;
        }

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