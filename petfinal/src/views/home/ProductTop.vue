<template>
    <div class="sp_hot">
      <h2 class="sp_hot_title">Danh mục sản phẩm</h2>
    </div>
    <section class="container my-3">
      <div class="row justify-content-center">
        <!-- Product 1 -->
        <ProductItem v-for="pet in state.pets" :product="pet" :key="pet.name" />
      </div>
    </section>
  </template>

<script setup>
import ProductItem from "@/views/product/ProductItem.vue";
import { reactive } from "vue";

import publicApi from "@/api/public.api";
import { useRoute } from "vue-router";

const state = reactive({ pets: [], busy: true });

const route = useRoute();

function onLoadData() {
  publicApi
    .top()
    .then((data) => {
      state.pets = data;
      state.busy = false;
    })
    .catch((err) => console.log(err));
}

onLoadData();
</script>

<style scoped>
.container {
  width: auto;
  height: auto;
  align-content: center;
}

.sp_hot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  background-color: #e94560;
  padding: 1rem;
  border-radius: 0.5rem;
  color: #fff;
  text-transform: uppercase;
}
.sp_hot_title {
  margin-bottom: 0;
}
</style>
