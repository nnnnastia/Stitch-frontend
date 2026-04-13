import { http } from "../api/http";

export const cartService = {
    getCart() {
        return http("/api/cart");
    },

    addToCart(productId, quantity = 1) {
        return http("/api/cart/items", {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
        });
    },

    updateQuantity(productId, quantity) {
        return http(`/api/cart/items/${productId}`, {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
        });
    },

    removeFromCart(productId) {
        return http(`/api/cart/items/${productId}`, {
            method: "DELETE",
        });
    },

    clearCart() {
        return http("/api/cart", {
            method: "DELETE",
        });
    },
};