import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileCard from "../../components/ProfileCard";
import ProfileMenu from "../../components/ProfileMenu";
import "./profile.scss";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function fetchMe() {
            try {
                const res = await fetch(`${API}/api/users/me`, {
                    credentials: "include",
                });

                if (res.status === 401 || res.status === 404) {
                    navigate("/login", { replace: true });
                    return;
                }

                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error(error);
                navigate("/login", { replace: true });
            }
        }

        fetchMe();
    }, [navigate, location.key]);

    if (!user) return <p>Завантаження профілю...</p>;

    return (
        <div className="profile">
            <div className="profile__container">
                <ProfileHeader title="Profile" />
                <ProfileCard user={user} />
                <ProfileMenu />
            </div>
        </div>
    );
}