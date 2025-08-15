<template>
  <header class="nav-wrapper">
    <div class="nav-header">
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/img/logostore.png"
        width="125"
        height="125"
      />
      <PublicSearch @submitSearch="onSearch" />
      <div class="d-flex frm-action">
        <div class="shop" @click="state.showCart = true">
          <img class="icon" src="@/assets/icons/shopping.png" />
          <span class="cart-badge" v-if="cartStore.total">
            {{ cartStore.total > 9 ? "9+" : cartStore.total }}
          </span>
        </div>
        <div class="d-flex phone">
          <img class="icon" src="@/assets/icons/phone.png" alt="" />
          <p class="text-white">HOTLINE:0123456789</p>
        </div>
        <LoginModal />
      </div>
    </div>
    <div class="menu-wrap">
      <ul class="menu">
        <li class="menu-item active" @click="onMenu('/')">TRANG CHỦ</li>
        <li class="menu-item" @click="router.push({ name: 'intro' })">
          GIỚI THIỆU
        </li>
        <li class="menu-item" @click="onMenu('/dogs')">SHOP CÚN CƯNG</li>
        <li class="menu-item" @click="onMenu('/cats')">SHOP MÈO CƯNG</li>
        <li class="menu-item" @click="router.push({ name: 'news' })">
          TIN TỨC
        </li>
        <li class="menu-item" @click="router.push({ name: 'contact' })">
          LIÊN HỆ
        </li>
      </ul>
    </div>
    <Cart :show="state.showCart" @onClose="state.showCart = false" />
  </header>
</template>

<script setup>
import { useAuth } from "@/stores/auth";
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Cart from "@/views/product/Cart.vue";
import { useCart } from "@/stores/cart";
import authApi from "../api/auth";
import LoginModal from "./LoginModal.vue";
import PublicSearch from "@/components/PublicSearch.vue";

const cartStore = useCart();
const state = reactive({ showCart: false });
const router = useRouter();
const auth = useAuth();

function onLogin() {
  router.push({ path: "/login" });
}

function onLogout() {
  router.push({ path: "/login" });
}

function onMenu(path, cat) {
  if (cat) router.push({ path, query: { c: cat } });
  else router.push({ path });
}

function onSearch(searchText) {
  if (!searchText) {
    router.push({ name: "home" }); // Chuyển hướng về trang chủ nếu từ khóa rỗng
    return;
  }
  router.push({ name: "search-product", query: { s: searchText } });
}

onMounted(() => {
  authApi
    .me()
    .then((user) => {
      auth.updateUser(user);
    })
    .catch(console.log);
});
</script>

<style lang="scss" scoped>
.nav-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .nav-header {
    padding: 1rem;
    background-color: #e94560;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      height: 40px;
      width: auto;
      display: block;
      object-fit: contain;
    }
    .frm-action {
      display: flex;
      gap: 12px;
      align-content: center;
      justify-content: center;
      .icon {
        width: 24px;
        height: 24px;
      }
      .shop {
        display: flex;
        justify-items: center;
        align-items: center;
        position: relative;
        cursor: pointer;
        .icon {
          width: 24px;
          height: 24px;
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -16px;
          border-radius: 50%;
          background-color: #0d6efd;
          text-align: center;
          color: #cdcdcd;
          font-size: 12px;
          width: 24px;
          padding: 2px 0;
          font-weight: 500;
        }
      }
      .btn-login {
        color: #fff;
        font-size: 14px;
        .icon {
          padding-right: 4px;
          width: 24px;
          height: 24px;
        }
      }
      .phone {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-items: center;
        .icon {
          padding-right: 4px;
          width: 24px;
          height: 24px;
        }
        p {
          margin-bottom: 0px;
        }
      }
    }
  }
  .menu-wrap {
    width: 100%;
    text-align: center;
    box-shadow: 2px 2px 2px 0px #cdcdcd;
    .menu {
      list-style: none;
      display: inline-flex;
      margin-bottom: 0;
      .menu-item {
        padding: 8px;
        color: #e94560;
        font-weight: 500;
        text-transform: uppercase;
        cursor: pointer;
        &.active,
        &:hover {
          font-weight: 600;
        }
      }
    }
  }
}
</style>