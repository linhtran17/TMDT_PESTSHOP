<script setup>
import { RouterLink, RouterView } from "vue-router";
import Nav from "@/components/NavAdmin.vue";
</script>

<template>
  <Nav></Nav>
  <div>
    <RouterView />
  </div>
</template>