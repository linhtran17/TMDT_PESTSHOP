import baseApi from "./base";

export default {
  getAllUsers: async (params) => {
    try {
      const { data } = await baseApi.get("/users", { params });
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
  getUserById: async (id) => {
    try {
      const { data } = await baseApi.get(`/users/${id}`);
      return data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },
  updateUser: async (id, user) => {
    try {
      const { data } = await baseApi.put(`/users/${id}`, user); // Sử dụng phương thức 'put'
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      await baseApi.delete(`/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};