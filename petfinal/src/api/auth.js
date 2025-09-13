// src/api/auth.js
import baseApi from './base'

export default {
  login: async (params) => {
    const { data } = await baseApi.post('/auth/login', params)
    return data
  },

  google: async (params) => {
    const { data } = await baseApi.post('/auth/google', params)
    return data
  },

  register: async (params) => {
    const { data } = await baseApi.post('/auth/signup', params)
    return data
  },

  // cập nhật hồ sơ (endpoint của bạn)
  update: async (params) => {
    const { data } = await baseApi.post('/auth/acc-google', params)
    return data
  },

  // CHÚ Ý: đừng gọi khi chưa có token
  me: async () => {
    const token = localStorage.getItem('token')
    if (!token) return { user: null }
    const { data } = await baseApi.get('/auth/me')
    return data
  },
}
