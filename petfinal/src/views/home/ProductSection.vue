<template>
    <div class="sp_hot">
      <h2 class="sp_hot_title">{{ props.title }}</h2>
    </div>
    <section class="container my-3">
      <div class="row justify-content-center">
        <!-- Product 1 -->
        <ProductItem v-for="pro in state.products" :product="pro" :key="pro.name" />
      </div>
    </section>
  </template>
   
   
  <script setup>
  import ProductItem from "@/views/product/ProductItem.vue";
  import { onMounted, reactive, defineProps } from "vue";

  const props = defineProps(["api", "title"]);
 
  const state = reactive({ products: [], busy: true });
  
  function onLoadData() {
    props.api()
      .then((data) => {
        state.products = data || [];
        state.busy = false;
      })
      .catch((err) => console.log(err));
  }
  
  onMounted(() => {
    onLoadData();
  })
  
  
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
    