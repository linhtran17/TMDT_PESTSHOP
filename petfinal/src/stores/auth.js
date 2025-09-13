// src/stores/auth.js
import { defineStore } from 'pinia'
import apiAuth from '@/api/auth'

export const useAuth = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isAdmin: false,
  }),

  actions: {
    async bootstrap() {
      if (!this.token) return
      try {
        const { user } = await apiAuth.me()
        if (!user) return
        this.user = user
        this.isAuthenticated = true
        this.isAdmin = user?.role === 'admin'
      } catch {
        this.logout()
      }
    },

    async login(payload) {
      const { user, token } = await apiAuth.login(payload)
      this.updateUser(user, token)
    },

    // dùng cho login Google / update profile
    updateUser(user, token) {
      if (token) {
        this.token = token
        localStorage.setItem('token', token)
      }
      this.user = user || null
      this.isAuthenticated = !!this.token
      this.isAdmin = this.user?.role === 'admin'
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.isAdmin = false
      localStorage.removeItem('token')
    },
  },
})
