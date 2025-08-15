<template>
  <div class="about">
    <About />
  </div>
</template>

<script setup>

import About from '../components/About.vue';

</script>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
