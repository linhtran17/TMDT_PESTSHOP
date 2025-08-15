import { defineStore } from "pinia";
import authApi from "../api/auth";
import router from "@/router";  // Import router trực tiếp

const AUTH_USER = 'auth/user-info'
const AUTH_TOKEN = 'auth/user-token'

const store = {
  save: data => {
    if (data.token)
      localStorage.setItem(AUTH_TOKEN, data.token)
    localStorage.setItem(AUTH_USER, JSON.stringify(data))
  },
  remove: () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(AUTH_USER);
  },
  get: () => {
    const initData = localStorage.getItem(AUTH_USER)
    if (initData) {
      return JSON.parse(initData)
    }
    return {
      user: null,
      token: "",
    }
  }
}

export const useAuth = defineStore("auth", {
  state: () => {
    const initData = store.get();
    return initData;
  },
  actions: {
    async updateUser(user, token) {
      this.user = user;
      if (token) {
        this.token = token;
      }
      if (user) {
        store.save({ user, token: this.token });
      }
    },
    async login(params) {
      try {
        const { user, token } = await authApi.login(params);
        if (user && token) {
          this.user = user;
          this.token = token;
          store.save({ user, token });
          if (user.role === "admin") {
            router.push({ path: "/admin" });
          } else {
            router.push({ path: "/" });
          }
        } else {
          throw new Error(
            "Đăng nhập thất bại. Vui lòng kiểm tra thông tin tài khoản."
          );
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async register(params) {
      try {
        const { user, token } = await authApi.register(params);
        if (user && token) {
          this.user = user;
          this.token = token;
          store.save({ user, token });
          // Sửa lỗi: Sử dụng user thay vì data
          if (user.role === "admin") {
            router.push({ path: "/admin" });
          } else {
            router.push({ path: "/" });
          }
        } else {
          throw new Error(
            "Đăng ký thất bại. Vui lòng kiểm tra thông tin đăng ký."
          );
        }
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = "";
      store.remove();
      router.push({ path: "/" });
    },
  },
  getters: {
    isAuthenticated: (state) => !!state?.user,
    isAdmin: (state) => state?.user?.role === "admin",
  },
});