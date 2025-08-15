import baseApi from './base';

export default {
    find: async (params) => {
        const { data } = await baseApi.get("/order?" + (params || ""));
        return data || [];
    },
    getById: async (id) => {
        const { data } = await baseApi.get("/order/" + id);
        return data || {};
    },
    add: async (params) => {
        const { data } = await baseApi.post("/order", params);
        return data || [];
    },
    update: async (id, params) => {
        const { data } = await baseApi.update("/order/" + id, params);
        return data || [];
    },
    delete: async (id) => {
        await baseApi.delete("/order/" + id);
        return true;
    },
    pay: async (id, params) => {
        const { data } = await baseApi.post(`/order/${id}/pay`, params);
        return data || {};
    },
}
