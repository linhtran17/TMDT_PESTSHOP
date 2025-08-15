<template>
  <div class="content-wrap">
    <div class="slide-menu">
      <ul>
        <li
          v-for="me in menus"
          @click="onMenu(me.key)"
          :key="me.key"
          :class="{ active: route.name === me.key }"
        >
          {{ me.title }}
        </li>
      </ul>
    </div>
    <div class="content p-3">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { metas } from "@/utils";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const menus = [
  { key: "dashboard", title: "Dashboard" },
  metas.orders,
  { key: "admin-products", title: "Sản phẩm" },
  { key: "cat-pets", title: "Danh mục thú cưng" },
  { key: "cat-pro", title: "Danh mục thương hiệu" },
  { key: "admin-news", title: "Danh mục tin tức" },
  { key: "admin-user", title: "Quản lý người dùng" }, // Thêm menu quản lý khách hàng
  { key: "admin-contact", title: "Quản lý liên hệ" },
];

function onMenu(name) {
  router.push({ name });
}
</script>

<style lang="scss" scoped>
.content-wrap {
  width: 100%;
  display: flex;
  position: relative;

  .slide-menu {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 220px;
    border-right: 1px solid #cdcdcd;
    height: calc(100vh - 56px);
    padding-left: 1rem;

    ul {
      list-style-type: none;
      margin-left: 0px;
      padding-left: 0;

      li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #cdcdcd;
        margin-right: 0.5rem;
        cursor: pointer;

        &.active,
        &:hover {
          color: #f80a0a;
          background: transparent;
          transform: scale(1.05);
          font-weight: 500;
        }

        a {
          color: #000;
          font-weight: bold;
          text-decoration: none;

          &:hover,
          &:active {
            color: #f80a0a;
            background: transparent;
          }
        }
      }
    }
  }

  .content {
    margin-left: 220px;
    width: 100%;
  }
}
</style>