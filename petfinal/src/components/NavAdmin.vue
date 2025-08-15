<template>
  <nav class="navbar navbar-light nav-shop">
    <router-link class="navbar-brand" :to="{ name: 'home' }">
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/img/logostore.png"
        width="125"
        height="125"
      />
    </router-link>
    <LoginModal />
  </nav>
</template>

<script setup>
import LoginModal from "./LoginModal.vue";
import { useAuth } from "@/stores/auth";

const storeAuth = useAuth();

const onLogout = () => {
  storeAuth.logout();
};
</script>


<style lang="scss" scoped>
.nav-shop {
  background-color: #e94560;
  a {
    &:hover {
      box-shadow: none;
    }
    .logo {
      height: 40px;
      width: auto;
      display: block;
      object-fit: contain;
    }
  }
}
</style>