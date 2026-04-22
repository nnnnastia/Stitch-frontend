import { http } from "../api/http";

export const sellerProfilesService = {
    async getMyProfile() {
        return http("/api/seller-profiles/me", {
            method: "GET"
        });
    },

    async createMyProfile(payload) {
        return http("/api/seller-profiles/me", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },

    async updateMyProfile(payload) {
        return http("/api/seller-profiles/me", {
            method: "PATCH",
            body: JSON.stringify(payload)
        });
    },

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);

        return http("/api/seller-profiles/me/avatar", {
            method: "PATCH",
            body: formData
        });
    },

    async uploadBanner(file) {
        const formData = new FormData();
        formData.append("banner", file);

        return http("/api/seller-profiles/me/banner", {
            method: "PATCH",
            body: formData
        });
    },

    async getPublicProfileBySlug(slug) {
        return http(`/api/seller-profiles/public/slug/${slug}`, {
            method: "GET"
        });
    },

    async getPublicProductsBySlug(slug) {
        return http(`/api/seller-profiles/public/slug/${slug}/products`, {
            method: "GET"
        });
    }
};