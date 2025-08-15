import { defineStore } from "pinia";
import contactApi from "../api/contact";

export const useContactStore = defineStore("contact", {
  state: () => ({
    contacts: [],
    loading: false,
    totalPages: 0,
    total: 0,
    page: 1,
    limit: 100,
  }),
  actions: {
    async fetchContacts(params) {
      this.loading = true;
      try {
        const { list, totalPages, total } = await contactApi.getAllContacts(
          params
        );
        this.contacts = list;
        this.totalPages = totalPages;
        this.total = total;
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        this.loading = false;
      }
    },
    async deleteContact(id) {
      try {
        await contactApi.deleteContact(id);
        this.fetchContacts({ limit: this.limit, page: this.page });
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    },
    async updateContactStatus(id, status) {
      try {
        await contactApi.updateContactStatus(id, status);
        this.fetchContacts({ limit: this.limit, page: this.page });
      } catch (error) {
        console.error("Error updating contact status:", error);
      }
    },
    async addContact(contact) {
      const newContact = await contactApi.addContact(contact);
      this.contacts.push(newContact);
    },
  },
});
