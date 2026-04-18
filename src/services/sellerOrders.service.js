import { http } from "../api/http.js";

export const sellerOrdersService = {
    async getOrders() {
        return await http("/api/seller/orders");
    },

    async getOrderById(orderId) {
        return await http(`/api/seller/orders/${orderId}`);
    },

    async updateStatus(orderId, status) {
        return await http(`/api/seller/orders/${orderId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
    },
};