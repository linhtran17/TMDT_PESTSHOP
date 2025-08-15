<template>
  <div class="main-wrap">
    <div class="mb-3 d-flex justify-content-between">
      <div class="h3">{{ route.meta.title }}</div>
    </div>
    <div class="w-100">
      <Orders :getData="orderApi.find" title="Danh sách đơn hàng"/>
    </div>
  </div>
  
</template>

<script setup>
import { useRoute } from "vue-router";
import Orders from "@/views/admin/dashboard/Orders.vue";
import orderApi from '@/api/orders';

const route = useRoute();

</script>