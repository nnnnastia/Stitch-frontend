const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const recommendationsService = {
    async trackView(productId) {
        const res = await fetch(`${API_URL}/recommendations/track-view/${productId}`, {
            method: "POST",
            credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        console.log("TRACK VIEW STATUS:", res.status);
        console.log("TRACK VIEW RESPONSE:", data);

        if (!res.ok) {
            throw new Error(data.message || "Failed to track view");
        }

        return data;
    },

    async getMyRecommendations() {
        const res = await fetch(`${API_URL}/recommendations/me`, {
            method: "GET",
            credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        console.log("RECOMMENDATIONS STATUS:", res.status);
        console.log("RECOMMENDATIONS DATA:", data);

        if (!res.ok) {
            throw new Error(data.message || "Failed to load recommendations");
        }

        return data;
    }
};