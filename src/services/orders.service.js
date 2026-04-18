import { http } from "../api/http.js";

export const ordersService = {
    async createOrder(payload) {
        return await http("/api/orders", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async getMyOrders() {
        return await http("/api/orders/me");
    },

    async getOrderById(orderId) {
        return await http(`/api/orders/${orderId}`);
    },
};