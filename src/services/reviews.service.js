import { http } from "../api/http";

export const reviewsService = {
    async getProductReviews(productId) {
        return http(`/api/reviews/product/${productId}`, {
            method: "GET",
        });
    },

    async createReview(productId, payload) {
        return http(`/api/reviews/product/${productId}`, {
            method: "POST",
            body: JSON.stringify({
                rating: payload.rating,
                text: payload.text,
            }),
        });
    },

    async updateReview(reviewId, payload) {
        return http(`/api/reviews/${reviewId}`, {
            method: "PATCH",
            body: JSON.stringify({
                rating: payload.rating,
                text: payload.text,
            }),
        });
    },

    async deleteReview(reviewId) {
        return http(`/api/reviews/${reviewId}`, {
            method: "DELETE",
        });
    },

    async getSellerRating(sellerId) {
        return http(`/api/reviews/seller/${sellerId}/rating`, {
            method: "GET",
        });
    },
};