import { http } from "../api/http";

export const categoriesService = {
    async getAll() {
        return http("/api/categories");
    },
};