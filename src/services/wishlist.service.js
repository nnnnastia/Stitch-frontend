import { http } from "../api/http";

export const wishlistService = {
    getMyWishlist() {
        return http("/api/wishlist/me");
    },

    addToWishlist(productId) {
        return http("/api/wishlist/items", {
            method: "POST",
            body: JSON.stringify({ productId }),
        });
    },

    removeFromWishlist(productId) {
        return http(`/api/wishlist/items/${productId}`, {
            method: "DELETE",
        });
    },

    toggleWishlist(productId) {
        return http("/api/wishlist/toggle", {
            method: "POST",
            body: JSON.stringify({ productId }),
        });
    },
};