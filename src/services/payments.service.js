import { http } from "../api/http.js";

export const paymentsService = {
    async createCheckoutSession(orderId) {
        return http("/api/payments/create-checkout-session", {
            method: "POST",
            body: JSON.stringify({ orderId }),
        });
    },
};