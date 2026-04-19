import { useState, useEffect } from "react";
import { sellerProfilesService } from "../../../services/sellerProfile.service";

export default function SellerProfilePage() {
    const [form, setForm] = useState({
        displayName: "",
        storeSlug: "",
        about: "",
        contacts: {},
        delivery: {},
        payment: {}
    });

    useEffect(() => {
        loadProfile();

    }, []);

    async function loadProfile() {
        const res = await sellerProfilesService.getMyProfile();
        setProfile(res.profile);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        await sellerProfilesService.updateMyProfile(form);
    }


    return (
        <div className="seller-store">
            <h1>Налаштування магазину</h1>

            <form onSubmit={handleSubmit}>
                <input
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    placeholder="Назва магазину"
                />

                <input
                    value={form.storeSlug}
                    onChange={(e) => setForm({ ...form, storeSlug: e.target.value })}
                    placeholder="slug (url)"
                />

                <textarea
                    value={form.about}
                    onChange={(e) => setForm({ ...form, about: e.target.value })}
                    placeholder="Опис магазину"
                />

                <button type="submit">Зберегти</button>
            </form>
        </div>
    );
}