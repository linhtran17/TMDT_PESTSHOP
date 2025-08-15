<template>
  <div>
    <notifications />
    <component :is="layoutComponent">
      <RouterView />
    </component>
  </div>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import AdminLayout from "./views/layouts/Admin.vue";
import AuthLayout from "./views/layouts/Auth.vue";
import PublicLayout from "./views/layouts/Public.vue";

export default {
  computed: {
    layoutComponent() {
      switch (this.$route.meta.layout) {
        case "admin":
          return AdminLayout;
        case "auth":
          return AuthLayout;
        default:
          return PublicLayout;
      }
    },
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.css";
</style>
