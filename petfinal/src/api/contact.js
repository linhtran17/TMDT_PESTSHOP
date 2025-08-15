import baseApi from "./base";

export default {
  getAllContacts: async (params) => {
    try {
      const { data } = await baseApi.get(`/contact?${params}`);
      return data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  },
  deleteContact: async (id) => {
    try {
      await baseApi.delete(`/contact/${id}`);
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  },
  updateContactStatus: async (id, status) => {
    try {
      const { data } = await baseApi.put(`/contact/${id}`, { status });
      return data;
    } catch (error) {
      console.error("Error updating contact status:", error);
      throw error;
    }
  },
  addContact: async (contact) => {
    try {
      const { data } = await baseApi.post(`/contact`, contact);
      return data;
    } catch (error) {
      console.error("Error adding contact:", error);
      throw error;
    }
  },
};
