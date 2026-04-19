import { http } from "../api/http";

export const recommendationsService = {
    async trackView(productId) {
        return http(`/api/recommendations/track-view/${productId}`, {
            method: "POST",
        });
    },

    async trackPublicView(productId) {
        return http(`/api/recommendations/view/${productId}`, {
            method: "POST",
        });
    },

    async getMyRecommendations() {
        return http("/api/recommendations/me", {
            method: "GET",
        });
    },

    async getPopularProducts(limit = 8) {
        return http(`/api/recommendations/popular?limit=${limit}`, {
            method: "GET",
        });
    },
};