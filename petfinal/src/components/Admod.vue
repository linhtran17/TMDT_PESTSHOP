<template>
  <header class="nav-wrapper">
    <div class="d-flex justify-content-between">
      <div class="shop">Pet store</div>
      <div class="d-flex ml-auto m-login">
        <div class="address">Dia chi</div>
        <div v-if="auth.user">Welcome, {{ auth.user.fullname }}</div>
        <div v-if="auth.user" class="cursor" @click="onLogout">
          <img class="icon-logout" src="@/assets/icons/logout-white.svg" />
        </div>
        <div v-else class="cursor" @click="onLogin">Đăng hindi</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuth();

function onLogin() {
  router.push({ path: "/login" });
}

function onLogout() {
  auth.logout();
  router.push({ name: "home" });
}
</script>

<style lang="scss" scoped>
.nav-wrapper {
  padding: 4px 16px;
  background-color: #e94560;
  border-bottom: 0.5px solid #cdcdcd;
  color: #fff;
  .d-flex {
    display: flex;
    flex-direction: row;
    &.m-login {
      gap: 8px;
      .icon-logout {
        width: 20px;
        height: auto;
      }

      .address {
        display: none;
      }
    }

    .shop {
      font-weight: bold;
    }
  }
}
</style>