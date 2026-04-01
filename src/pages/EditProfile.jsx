import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatarPlaceholder from "../assets/avatar_placeholder.png"; // шлях під себе

const API = "http://localhost:5000/api";

export default function EditProfile() {
    const [form, setForm] = useState({
        userName: "",
        userSurname: "",
        phoneNumber: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const previewUrl = useMemo(() => {
        if (!avatarFile) return "";
        return URL.createObjectURL(avatarFile);
    }, [avatarFile]);

    useEffect(() => {
        async function loadMe() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login", { replace: true });
                    return;
                }

                const res = await fetch(`${API}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const text = await res.text();
                let data = {};
                try {
                    data = JSON.parse(text);
                } catch { }

                if (!res.ok) {
                    localStorage.removeItem("token");
                    navigate("/login", { replace: true });
                    return;
                }

                setForm({
                    userName: data.user?.userName || "",
                    userSurname: data.user?.userSurname || "",
                    phoneNumber: data.user?.phoneNumber || "",
                });

                setCurrentAvatar(data.user?.avatarUrl || "");
            } finally {
                setLoading(false);
            }
        }

        loadMe();
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    function onChange(e) {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    }

    function onPickFile(e) {
        const file = e.target.files?.[0] || null;
        if (!file) {
            setAvatarFile(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Оберіть зображення (png/jpg/webp)");
            e.target.value = "";
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            alert("Файл завеликий (макс 3MB)");
            e.target.value = "";
            return;
        }

        setAvatarFile(file);
    }

    async function onSave(e) {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            const fd = new FormData();
            fd.append("userName", form.userName);
            fd.append("userSurname", form.userSurname);
            fd.append("phoneNumber", form.phoneNumber);
            if (avatarFile) fd.append("avatar", avatarFile); // має збігатися з upload.single("avatar")

            const res = await fetch(`${API}/api/users/me`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch { }

            if (res.ok) {
                navigate("/profile");
            } else {
                console.log("UPDATE ERROR RESPONSE:", text);
                alert(data.message || "Update failed");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    }

    const avatarSrc =
        previewUrl ||
        (currentAvatar ? `${API}${currentAvatar}` : avatarPlaceholder);

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <div className="profile">
            <div className="profile__container">
                <h2 style={{ textAlign: "center", margin: "12px 0 16px" }}>
                    Edit profile
                </h2>

                <form onSubmit={onSave} style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "grid", justifyItems: "center", gap: 10 }}>
                        <img
                            src={avatarSrc}
                            alt="avatar"
                            onError={(e) => {
                                e.currentTarget.src = avatarPlaceholder;
                            }}
                            style={{
                                width: 96,
                                height: 96,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid rgba(17,24,39,.65)",
                            }}
                        />

                        <input type="file" accept="image/*" onChange={onPickFile} />
                    </div>

                    <input
                        name="userName"
                        placeholder="Імʼя"
                        value={form.userName}
                        onChange={onChange}
                    />
                    <input
                        name="userSurname"
                        placeholder="Прізвище"
                        value={form.userSurname}
                        onChange={onChange}
                    />
                    <input
                        name="phoneNumber"
                        placeholder="Телефон"
                        value={form.phoneNumber}
                        onChange={onChange}
                    />

                    <button type="submit" className="profile__edit-btn">
                        Save
                    </button>
                    <button type="button" onClick={() => navigate("/profile")}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
