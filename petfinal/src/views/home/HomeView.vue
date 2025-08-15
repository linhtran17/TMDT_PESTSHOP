<script setup>
import ProductSection from "./ProductSection.vue";
import Banner from "@/components/Banner.vue";
import QuangCao from "@/components/QuangCao.vue";
import NewHot from "@/views/home/NewHot.vue";
import publicApi from "@/api/public.api";
import chaxbox from "@/components/chatbox.vue";
import News from "@/views/News.vue"
</script>

<template>
  <div>
    <Banner />
    <main>
      <ProductSection :api="publicApi.hot" title="Sản phẩm đang khuyến mãi HOT"/>
      <ProductSection :api="publicApi.top" title="Sản phẩm đang Bán chạy"/>
      <!-- <Cat/> -->
      <NewHot/>
      <!-- <News/> -->
      <!-- <About /> -->
     <chaxbox/>
    </main>
    <QuangCao />
    <!-- <Footer /> -->
  </div>
</template>

<style scoped>
.container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
header {
  background-color: #ff6347;
  color: white;
  padding: 20px 0;
}

header h1 {
  float: left;
  margin: 0;
}

nav ul {
  float: right;
  display: flex;
  gap: 20px;
}

nav ul li a {
  color: white;
  font-weight: bold;
}

/* Hero Section */
.hero-section {
  background: url("https://example.com/your-image.jpg") no-repeat center
    center/cover;
  color: white;
  padding: 100px 0;
  text-align: center;
}

.hero-section .btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border-radius: 5px;
  margin-top: 20px;
}

/* Services Section */
.services-section {
  background-color: #fff;
  padding: 50px 0;
}

.services-section .service-list {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.service-item {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

/* Products Section */
.products-section {
  background-color: #ffebcd;
  padding: 50px 0;
}

.products-section .product-list {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.product-item {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

/* Contact Section */
.contact-section {
  background-color: #fff;
  padding: 50px 0;
  text-align: center;
}

.contact-section form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-section input,
.contact-section textarea {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.contact-section button {
  padding: 10px 20px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  max-width: 150px;
  margin: 0 auto;
}

.pet-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
</style>
