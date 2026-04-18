import { http } from "../api/http.js";

export const shippingService = {
    async searchCities(q) {
        const params = new URLSearchParams({ q });
        return await http(`/api/shipping/cities?${params.toString()}`);
    },

    async getWarehouses(cityId) {
        const params = new URLSearchParams({ cityId });
        return await http(`/api/shipping/warehouses?${params.toString()}`);
    },
};