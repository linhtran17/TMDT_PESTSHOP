import baseApi from './base';

export default {
    find: async (params) => {
        const { data } = await baseApi.get("/category-pet?" + (params || ""));
        await ( new Promise(resolve => setTimeout(resolve, 500)))
        return data || []
    },
    getById: async (id) => {
        const { data } = await baseApi.get("/category-pet/" + id);
        return data || {}
    },
    add: async (params) => {
        const { data } = await baseApi.post("/category-pet", params);
        return data || []
    },
    update: async (id, params) => {
        const { data } = await baseApi.update("/category-pet/" + id, params);
        return data || []
    },
    delete: async (id) => {
        await baseApi.delete("/category-pet/" + id);
        return true
    },
}