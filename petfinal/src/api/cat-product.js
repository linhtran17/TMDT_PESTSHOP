import baseApi from './base';

export default {
    find: async (params) => {
        const { data } = await baseApi.get("/category-product?" + (params || ""));
        return data || [];
    },
    getById: async (id) => {
        const { data } = await baseApi.get("/category-product/" + id);
        return data || {};
    },
    add: async (params) => {
        const { data } = await baseApi.post("/category-product", params);
        return data || [];
    },
    update: async (id, params) => {
        const { data } = await baseApi.update("/category-product/" + id, params);
        return data || [];
    },
    delete: async (id) => {
        await baseApi.delete("/category-product/" + id);
        return true;
    },
}
