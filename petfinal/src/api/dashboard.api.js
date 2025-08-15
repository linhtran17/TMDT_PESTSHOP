import baseApi from './base';

export default {
    quantityStatistics: async () => {
        const { data } = await baseApi.get("/dashboard/quantity-statistics");
        return data || {}
    },
    latestOrders: async () => {
        const { data } = await baseApi.get("/dashboard/latest-orders");
        return data || {}
    },
    findOrderById: async (id) => {
        const { data } = await baseApi.get("/dashboard/order/" + id);
        return data || {}
    },
    update: async (id, params) => {
        const { data } = await baseApi.put("/dashboard/order/" + id, params);
        return data || {}
    },
}