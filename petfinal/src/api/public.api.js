import baseApi from './base';

export default {
    products: async (params) => {
        const { data } = await baseApi.get("/public/products?" + (params || ""));
        return data || []
    },
    productDogs: async (params) => {
        const { data } = await baseApi.get("/public/product-dogs?" + (params || ""));
        return data || []
    },
    productCats: async (params) => {
        const { data } = await baseApi.get("/public/product-cats?" + (params || ""));
        return data || []
    },
    productById: async (id) => {
        const { data } = await baseApi.get("/public/product/" + id);
        return data
    },
    hot: async () => {
        const { data: {list} } = await baseApi.get("/public/product-hot");
        return list || []
    },
    top: async () => {
        const { data: {list} } = await baseApi.get("/public/product-top");
        return list || []
    },
    news: async () => {
        const { data } = await baseApi.get("/public/news");
        return data || []
    },
    newById: async (id) => {
        const { data } = await baseApi.get("/public/new/" + id);
        return data
    },
}