<script setup>
import publicApi from "@/api/public.api";
import ProductView from './ProductView.vue';
</script>

<template>
    <ProductView :api="publicApi.productCats" route="cats"/>
</template>