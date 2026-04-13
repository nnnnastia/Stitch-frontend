const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const recommendationsService = {
    async trackView(productId) {
        const res = await fetch(`${API_URL}/recommendations/track-view/${productId}`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to track view");
        }

        return res.json();
    },

    async getMyRecommendations() {
        const res = await fetch(`${API_URL}/recommendations/me`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to load recommendations");
        }

        return res.json();
    }
};