import { http } from "../api/http";

export const productsService = {
    getAll(params = {}) {
        const searchParams = new URLSearchParams();

        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);

        if (params.minPrice !== undefined && params.minPrice !== "") {
            searchParams.set("minPrice", params.minPrice);
        }

        if (params.maxPrice !== undefined && params.maxPrice !== "") {
            searchParams.set("maxPrice", params.maxPrice);
        }

        if (params.sort) searchParams.set("sort", params.sort);
        if (params.page) searchParams.set("page", String(params.page));
        if (params.limit) searchParams.set("limit", String(params.limit));

        const query = searchParams.toString();

        return http(`/api/products${query ? `?${query}` : ""}`);
    },

    getById(id) {
        if (!id) {
            const error = new Error("Product ID is required");
            error.status = 400;
            throw error;
        }

        return http(`/api/products/${id}`);
    },
};