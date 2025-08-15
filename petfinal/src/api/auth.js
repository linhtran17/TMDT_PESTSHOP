import baseApi from "./base";

export default {
  login: async (params) => {
    try {
      const { data } = await baseApi.post("/auth/login", params); // Đúng endpoint là /auth/login
      return data;
    } catch (error) {
      throw error;
    }
  },
  google: async (params) => {
    const { data } = await baseApi.post("/auth/google", params); // Đúng endpoint là /auth/google
    return data;
  },
  register: async (params) => {
    try {
      const { data } = await baseApi.post("/auth/signup", params); // Đúng endpoint là /auth/signup
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },
  update: async (params) => {
    const { data } = await baseApi.post("/auth/acc-google", params); // Đúng endpoint là /auth/signup
    return data;
  },
  me: async () => {
    try {
      const { data } = await baseApi.get("/auth/me"); // Đúng endpoint là /auth/signup
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },
};
