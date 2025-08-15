import { defineStore } from "pinia";
import userApi from "../api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 0,
    limit: 10,
    total: 0,
  }),
  actions: {
    async fetchUsers(params) {
      this.loading = true;
      try {
        const data = await userApi.getAllUsers(params);
        if (data) {
          this.users = data.list || [];
          this.totalPages = data.totalPages || 0;
          this.total = data.total || 0;
        } else {
          this.users = [];
          this.totalPages = 0;
          this.total = 0;
        }
        this.error = null;
        return data; // Thêm trả về data để dùng ở .then
      } catch (error) {
        this.error = error.message;
        return {};
      } finally {
        this.loading = false;
      }
    },
    async fetchUserById(id) {
      this.loading = true;
      try {
        const user = await userApi.getUserById(id);
        this.error = null;
        return user;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async createUser(user) {
      try {
        await userApi.createUser(user);
        this.fetchUsers({ limit: this.limit, page: this.page });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
    async updateUser(id, user) {
      try {
        await userApi.updateUser(id, user);
        this.fetchUsers({ limit: this.limit, page: this.page });
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    async deleteUser(id) {
      try {
        await userApi.deleteUser(id);
        this.fetchUsers({ limit: this.limit, page: this.page });
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
  },
});
