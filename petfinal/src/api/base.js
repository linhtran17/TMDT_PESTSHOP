import axios from "axios";const URL_BASE = "http://localhost:8000/api";
const instance = axios.create({
    baseURL: URL_BASE,
});// Thêm interceptor để xử lý phản hồi và lỗi
instance.interceptors.response.use(
    (response) => {
        // Trả về toàn bộ response để giữ cấu trúc { data, status, ... }
        return response;
    },
    (error) => {
        // Log lỗi để debug
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);const AUTH_TOKEN = 'auth/user-token';const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
        headers['authorization'] = 'Bearer ${token}';
        }
    return headers;
};export default {
    get: function (url, params) {
        return instance.get(url, { params, headers: getHeaders() });
    },
    post: function (url, data) {
        const headers = getHeaders();
        if (data instanceof FormData) {
            console.log('Gửi FormData:', data.get('file'));
            delete headers["Content-Type"];
        }
        return instance.post(url, data, { headers });
    },  
    put: function (url, data) {
        return instance.put(url, data, { headers: getHeaders() });
    },
    delete: function (url) {
        return instance.delete(url, { headers: getHeaders() });
    },
};

